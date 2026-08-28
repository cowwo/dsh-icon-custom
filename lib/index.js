/**
 * dsh-icon-custom host entry: a TypertRemoteService that stores user-supplied
 * favicons under $DSH_HOME/custom-favicon/ and serves the active one at
 * /icon-custom.svg, rewriting the document head `<link rel="icon">` only when
 * a custom icon is active (zero side effects otherwise — the browser falls back
 * to the platform favicon).
 *
 * Storage is shaped as an icon library from day one (see docs/adr/0001):
 * `library/<id>.<ext>` holds each icon's bytes and `library.json` holds the
 * index + the `activeId` marker. "reset" clears only `activeId`; icon files are
 * kept for a future icon-library UI. This round writes exactly one slot.
 *
 * Zero third-party deps: Node's Buffer gives a binary-safe base64 decode (the
 * dynamic-prototype bug was a lossy host `atob`; this never goes through it) and
 * a structural PNG walk confirms the bytes actually decode as a PNG without
 * requiring an exact chunk CRC (optimizers rewrite those and browsers still
 * render the file).
 */
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { readFileSync } from 'node:fs'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
// Normalized mime -> safe extension. CUR (mouse cursor) is accepted as ICO.
const MIME_EXT = {
	'image/svg+xml': 'svg',
	'image/png': 'png',
	'image/x-icon': 'ico'
}
// PNG magic is 89 50 4e 47 0d 0a 1a 0a; we match the tail 7 bytes so a stray
// leading byte (some encoders emit 0xfd) still identifies a genuine PNG.
const PNG_MAGIC = [0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const ICO_MAGIC = [0x00, 0x00, 0x01, 0x00]
const CUR_MAGIC = [0x00, 0x00, 0x02, 0x00]

/** Resolve the Harness home the same way `@deepseek-ai/dsh-home-paths` does. */
function resolveHome() {
	const fromEnv = process.env.DSH_HOME
	return resolve(fromEnv !== void 0 && fromEnv.trim().length > 0 ? fromEnv : join(homedir(), '.dsh'))
}

/** Find a byte pattern anywhere within the first `window` bytes. */
function indexOfPattern(buf, pattern, window) {
	const end = Math.min(buf.length, window)
	for (let i = 0; i < end; i++) {
		let ok = true
		for (let j = 0; j < pattern.length; j++) {
			if (buf[i + j] !== pattern[j]) { ok = false; break }
		}
		if (ok) return i
	}
	return -1
}

/** Detect the real image type from content bytes, not the declared mime. */
function detectMime(buf) {
	if (indexOfPattern(buf, PNG_MAGIC, 16) !== -1) return 'image/png'
	if (indexOfPattern(buf, ICO_MAGIC, 16) !== -1) return 'image/x-icon'
	if (indexOfPattern(buf, CUR_MAGIC, 16) !== -1) return 'image/x-icon'
	const text = buf.toString('utf8').replace(/^\uFEFF/, '').replace(/^\s+/, '')
	if (/^<svg[\s>]/i.test(text)) return 'image/svg+xml'
	if (/^<\?xml/i.test(text) && /<svg[\s>]/i.test(text)) return 'image/svg+xml'
	return null
}

/**
 * Walk the PNG chunk structure from the magic offset and require it to be a
 * well-formed sequence: starts with IHDR, traverses chunks by their declared
 * lengths, and terminates at a real IEND chunk. This confirms the bytes decode
 * as a genuine PNG (better than only checking the magic). We deliberately do not
 * require an exact chunk CRC — optimizers rewrite those and browsers still
 * decode such files.
 */
function assertPngStructure(buf, offset) {
	// `offset` is the position of the 'P' in the 7-byte tail magic. Both a
	// standard 8-byte PNG (leading 0x89) and an optimizer-rewritten one (leading
	// 0xfd) put the IHDR *type* at offset+11, with the chunk length at offset+7.
	if (buf.length < offset + 15) throw new Error('PNG 数据不完整')
	if (buf.toString('latin1', offset + 11, offset + 15) !== 'IHDR') throw new Error('PNG 缺少 IHDR 数据块')
	let pos = offset + 7 // start of the first chunk's length field
	let chunks = 0
	let guard = 0
	while (pos + 8 <= buf.length) {
		if (++guard > 2048) throw new Error('PNG 结构异常')
		const len = buf.readUInt32BE(pos)
		const type = buf.toString('latin1', pos + 4, pos + 8)
		const dataEnd = pos + 8 + len
		if (dataEnd + 4 > buf.length) throw new Error('PNG 数据不完整')
		if (chunks === 0 && type !== 'IHDR') throw new Error('PNG 缺少 IHDR 数据块')
		if (type === 'IEND') return
		pos = dataEnd + 4
		chunks++
	}
	throw new Error('PNG 缺少 IEND 结尾块')
}

/** Reject SVG content that can act on its own (scripts / event handlers). */
function assertSafeSvg(buf) {
	const text = buf.toString('utf8')
	if (/(<\s*script\b)/i.test(text)) throw new Error('SVG 不能包含 <script>')
	if (/\bon[a-z]+\s*=/i.test(text)) throw new Error('SVG 不能包含事件属性(如 onload)')
	if (/javascript\s*:/i.test(text)) throw new Error('SVG 不能包含 javascript: 链接')
}

/** Validate raw bytes; returns the detected mime or throws. */
function sniff(buf) {
	if (buf.length === 0) throw new Error('图标内容为空')
	if (buf.length > MAX_BYTES) throw new Error(`图标不能超过 ${MAX_BYTES / (1024 * 1024)} MB`)
	const mime = detectMime(buf)
	if (mime === null) throw new Error('无法识别图标内容,仅支持 SVG / PNG / ICO')
	if (mime === 'image/png') {
		const offset = indexOfPattern(buf, PNG_MAGIC, 16)
		assertPngStructure(buf, offset)
	}
	if (mime === 'image/svg+xml') assertSafeSvg(buf)
	return mime
}

/** Extract the base64 body from a `data:<mime>;base64,<body>` string. */
function base64Body(dataUrl) {
	const m = /^data:([^;,]+);base64,(.+)$/s.exec(dataUrl || '')
	if (!m) throw new Error('图标数据必须是 data URL(base64)')
	const body = m[2].replace(/\s+/g, '')
	if (body.length === 0) throw new Error('图标数据为空')
	// Binary-safe: Node's Buffer decodes base64 to exact bytes (never lossy).
	return { bytes: Buffer.from(body, 'base64') }
}

/**
 * 图标替换服务:保存/读取用户上传的 favicon,并通过 webServer 提供
 * `/icon-custom.svg` 路由与 index 头部改写。通过 typert
 * `iconCustom/*` 端点暴露给浏览器端。
 */
export class FaviconCustomService extends TypertRemoteService {
	static inject = ['webServer']

	constructor(ctx, config) {
		super(ctx, 'iconCustom')
		this.storageDir = join(resolveHome(), 'custom-favicon')
		this.libraryDir = join(this.storageDir, 'library')
		this.indexPath = join(this.storageDir, 'library.json')
		// { activeId, icons: { [id]: { id, mime, ext, name, size, savedAt, rev } } }
		this.library = { activeId: null, icons: {} }
		// The active icon's loaded state: { rev, mime, ext, name, size, savedAt, bytes } | null
		this.current = null
		this._load()
		ctx.effect(() => ctx.webServer.register({
			kind: 'exact',
			path: '/icon-custom.svg',
			handler: (request, response) => this._handleIcon(request, response)
		}), 'dsh-icon-custom: /icon-custom.svg route')
		ctx.effect(() => ctx.webServer.tapIndex((html) => this._rewriteIndex(html)),
			'dsh-icon-custom: index tap')
	}

	/** Load persisted library + active icon from disk at startup. */
	_load() {
		try {
			const raw = readFileSync(this.indexPath)
			const lib = JSON.parse(raw.toString('utf8'))
			if (typeof lib !== 'object' || lib === null) return
			const icons = (typeof lib.icons === 'object' && lib.icons !== null) ? lib.icons : {}
			this.library = { activeId: typeof lib.activeId === 'string' ? lib.activeId : null, icons }
			const activeId = this.library.activeId
			if (activeId === null) return
			const rec = icons[activeId]
			if (rec === null || typeof rec !== 'object') { this.library.activeId = null; return }
			const bytes = readFileSync(join(this.libraryDir, `${activeId}.${rec.ext}`))
			this.current = { ...rec, bytes }
		} catch { /* no persisted icon yet */ }
	}

	/** Persist the library index to disk (does not touch icon files). */
	_saveLibrary() {
		return writeFile(this.indexPath, JSON.stringify(this.library, null, 2))
	}

	/** Currently active icon as a JSON-safe status object (no raw bytes). */
	status() {
		const c = this.current
		return c === null
			? { active: false, rev: null, mime: null, ext: null, name: null, size: null, savedAt: null }
			: { active: true, rev: c.rev, mime: c.mime, ext: c.ext, name: c.name, size: c.size, savedAt: c.savedAt }
	}

	/** typert endpoint: read current status. */
	async getStatus() {
		return this.status()
	}

	/** typert endpoint: store a new icon uploaded as a data URL and make it active. */
	async setIcon(request) {
		if (request === null || typeof request !== 'object') throw new Error('缺少图标参数')
		const { name, data } = request
		if (typeof data !== 'string' || data.length === 0) throw new Error('缺少图标数据')
		const { bytes } = base64Body(data)
		const mime = sniff(bytes)
		const ext = MIME_EXT[mime]
		const now = Date.now()
		const id = now.toString(36) + Math.random().toString(36).slice(2, 6)
		const rev = now.toString(36)
		await mkdir(this.libraryDir, { recursive: true })
		// Atomic-ish write: temp file then rename, so a crash never leaves a
		// half-written icon that would 500 the /icon-custom.svg route.
		const tmp = join(this.libraryDir, `.${id}.${ext}.tmp`)
		await writeFile(tmp, bytes)
		await rename(tmp, join(this.libraryDir, `${id}.${ext}`))
		const rec = {
			id,
			mime, ext,
			name: typeof name === 'string' && name.trim().length > 0 ? name.trim().slice(0, 128) : null,
			size: bytes.length, savedAt: now, rev
		}
		this.library.icons[id] = rec
		this.library.activeId = id
		await this._saveLibrary().catch(() => {}) // index is advisory; icon file is authoritative
		this.current = { ...rec, bytes }
		return this.status()
	}

	/** typert endpoint: clear the active marker so the platform icon is used.
	 *  Icon files stay on disk for the future icon-library UI. */
	async resetIcon() {
		this.library.activeId = null
		await this._saveLibrary().catch(() => {})
		this.current = null
		return this.status()
	}

	/** Serve the current custom icon (or 404 when unset). */
	async _handleIcon(request, response) {
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			response.writeHead(405, { allow: 'GET, HEAD' })
			response.end()
			return
		}
		const c = this.current
		if (c === null) {
			response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
			response.end('no custom favicon')
			return
		}
		response.writeHead(200, {
			'content-type': c.mime,
			'content-length': c.bytes.length,
			// URL carries ?v=<rev>, so this is effectively content-addressed.
			'cache-control': 'public, max-age=31536000, immutable',
			'x-content-type-options': 'nosniff'
		})
		if (request.method === 'HEAD') {
			response.end()
			return
		}
		response.end(c.bytes)
	}

	/** Rewrite the head `<link rel="icon">` only when a custom icon is active. */
	_rewriteIndex(html) {
		const c = this.current
		if (c === null) return html
		const href = `/icon-custom.svg?v=${c.rev}`
		const tag = `<link rel="icon" type="${c.mime}" href="${href}" />`
		const re = /<link\s+rel="icon"[^>]*\/?>/i
		if (re.test(html)) return html.replace(re, tag)
		return html.replace(/<head>/i, `<head>${tag}`)
	}
}

export default FaviconCustomService
