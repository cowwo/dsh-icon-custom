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
 * From 0.7.0 the PWA/logo path derives a PNG of several canonical sizes with
 * Jimp (pure JS, no native binary): 192/512 for Android manifest entries (incl.
 * a maskable 512) and a 180x180 opaque PNG for iOS/apple-touch-icon. SVG and
 * ICO uploads are normalized to a PNG baseline first (SVG via the browser canvas
 * on the client; ICO by extracting the embedded PNG image server-side — browsers
 * do not reliably rasterize .ico). A failure to derive falls back to serving the
 * original bytes so the plugin never hard-fails.
 * `library/<id>.derived/*.png` holds the derived set; `library.json` records
 * `derived: true/false` so we know whether to serve the canonical sizes.
 */
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { Jimp } from 'jimp'
import { readFileSync } from 'node:fs'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
// Normalized mime -> safe extension. CUR (mouse cursor) is accepted as ICO.
const MIME_EXT = {
	'image/svg+xml': 'svg',
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/x-icon': 'ico'
}
// Canonical derived sizes for the PWA/logo path. `file` is the stored basename
// (without ext) under `library/<id>.derived/`; `url` the public route suffix.
// `maskable` variants get an opaque background so Android launchers crop cleanly;
// `apple` is opaque-white so iOS shows a solid tile instead of a transparent hole.
const DERIVED_SIZES = [
	{ file: '192', url: '192', size: 192, maskable: false },
	{ file: '512', url: '512', size: 512, maskable: false },
	{ file: '512-maskable', url: '512-maskable', size: 512, maskable: true },
	{ file: 'apple-180', url: 'apple-180', size: 180, apple: true }
]
// How far past the target a source may exceed before we downscale (not a file
// size cap; Jimp just resizes to the canonical square).
// PNG magic is 89 50 4e 47 0d 0a 1a 0a; we match the tail 7 bytes so a stray
// leading byte (some encoders emit 0xfd) still identifies a genuine PNG.
const PNG_MAGIC = [0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const ICO_MAGIC = [0x00, 0x00, 0x01, 0x00]
const CUR_MAGIC = [0x00, 0x00, 0x02, 0x00]
// Fallback platform manifest, mirroring @deepseek-ai/dsh-web-frontend/dist/
// manifest.webmanifest. Used only when the real file cannot be resolved (e.g.
// the plugin is developed outside the harness node_modules); the primary path
// reads the actual dist file at startup so platform-side field changes are
// followed automatically.
const FALLBACK_MANIFEST = {
	id: '/',
	name: 'DeepSeek Harness',
	short_name: 'DSH',
	start_url: '/',
	scope: '/',
	display: 'fullscreen',
	icons: [{
		src: '/favicon.svg',
		sizes: 'any',
		type: 'image/svg+xml',
		purpose: 'any'
	}]
}

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
	// ICO/CUR magic must appear at the very start; a loose scan can false-positive
	// on a JPEG header (e.g. JFIF bytes `00 00 01` at offset 13). Match at 0 only.
	if (matchAt(buf, ICO_MAGIC, 0)) return 'image/x-icon'
	if (matchAt(buf, CUR_MAGIC, 0)) return 'image/x-icon'
	// JPEG starts with FF D8 FF (byte 0 is 0xFF, byte 1 is 0xD8).
	if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
	const text = buf.toString('utf8').replace(/^\uFEFF/, '').replace(/^\s+/, '')
	if (/^<svg[\s>]/i.test(text)) return 'image/svg+xml'
	if (/^<\?xml/i.test(text) && /<svg[\s>]/i.test(text)) return 'image/svg+xml'
	return null
}

/** Match a byte pattern exactly at `offset`. */
function matchAt(buf, pattern, offset) {
	if (offset + pattern.length > buf.length) return false
	for (let j = 0; j < pattern.length; j++) {
		if (buf[offset + j] !== pattern[j]) return false
	}
	return true
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
 * Read the platform PWA manifest once at startup. Primary path resolves the
 * actual dist file the same way @deepseek-ai/dsh-web-app does; the fallback
 * constants keep the plugin working when developed outside the harness
 * node_modules. Returns both the raw bytes (served verbatim while the PWA
 * option is off) and the parsed object (base for the rewritten manifest).
 */
function loadBaseManifest() {
	try {
		const req = createRequire(import.meta.url)
		const path = req.resolve('@deepseek-ai/dsh-web-frontend/dist/manifest.webmanifest')
		const raw = readFileSync(path, 'utf8')
		const parsed = JSON.parse(raw)
		if (typeof parsed === 'object' && parsed !== null) return { raw, parsed }
	} catch { /* fall through to constants */ }
	const parsed = FALLBACK_MANIFEST
	return { raw: JSON.stringify(parsed, null, 2), parsed }
}

/** PNG pixel size from IHDR: `<W>x<H>`, or null when unreadable. */
function pngLabel(buf, offset) {
	if (buf.length < offset + 23) return null
	const w = buf.readUInt32BE(offset + 15)
	const h = buf.readUInt32BE(offset + 19)
	if (w <= 0 || h <= 0) return null
	return `${w}x${h}`
}

/** First ICO/CUR directory entry size; a 0 byte means 256. */
function icoFirstSize(buf, offset) {
	if (buf.length < offset + 8) return null
	const w = buf[offset + 6]
	const h = buf[offset + 7]
	return { w: w === 0 ? 256 : w, h: h === 0 ? 256 : h }
}

/**
 * Manifest `sizes` attribute for the active icon: SVG is scalable (`any`),
 * PNG reports its true IHDR dimensions, ICO reports its first entry size.
 * Anything unreadable falls back to `any` — the platform manifest itself
 * ships an SVG with `sizes: "any"` and remains installable.
 */
function iconSizes(mime, bytes) {
	if (mime === 'image/png') {
		const offset = indexOfPattern(bytes, PNG_MAGIC, 16)
		const label = offset === -1 ? null : pngLabel(bytes, offset)
		if (label !== null) return label
	} else if (mime === 'image/x-icon') {
		const at = matchAt(bytes, ICO_MAGIC, 0) ? 0 : (matchAt(bytes, CUR_MAGIC, 0) ? 0 : -1)
		const size = at === -1 ? null : icoFirstSize(bytes, at)
		if (size !== null) return `${size.w}x${size.h}`
	}
	return 'any'
}

/**
 * Extract the embedded PNG image from an ICO/CUR container. ICO is a header
 * (6 bytes) + a directory of 16-byte entries; each entry points at an image
 * that is either a PNG or a BMP. We return the first PNG-encoded image. If the
 * ICO only packs BMP frames (old-style) we cannot rasterize it without a BMP
 * decoder, so we throw and let the caller fall back.
 * (Browsers do not reliably rasterize .ico into a <canvas>, which is exactly
 * why this extraction happens server-side rather than on the client.)
 */
function extractIcoPng(buf) {
	const at = matchAt(buf, ICO_MAGIC, 0) ? 0 : (matchAt(buf, CUR_MAGIC, 0) ? 0 : -1)
	if (at === -1) throw new Error('无法识别 ICO 文件')
	if (buf.length < at + 6) throw new Error('ICO 数据不完整')
	const count = buf.readUInt16LE(at + 4)
	if (count === 0) throw new Error('ICO 没有图像')
	const dirStart = at + 6
	for (let i = 0; i < count; i++) {
		const entry = dirStart + i * 16
		if (buf.length < entry + 16) break
		const byteSize = buf.readUInt32LE(entry + 8)
		const imgOffset = buf.readUInt32LE(entry + 12)
		if (imgOffset + byteSize > buf.length || imgOffset < dirStart) continue
		const img = buf.subarray(imgOffset, imgOffset + byteSize)
		// A PNG image begins with the 8-byte signature (89 50 4e 47 ...).
		if (img.length >= 8 && img[0] === 0x89 && img[1] === 0x50 && img[2] === 0x4e && img[3] === 0x47) {
			return img
		}
	}
	throw new Error('该 ICO 仅含 BMP 帧,无法自动转换,请改用 PNG')
}

/** Read an ICO/CUR PNG and re-encode to a canonical square PNG via Jimp. */
async function pngFromBytes(bytes) {
	return Jimp.fromBuffer(bytes)
}

/**
 * Derive the canonical PNG set for a source image. `source` is the working
 * PNG bytes (already normalized: PNG uploads directly, SVG via the client
 * canvas, ICO by {@link extractIcoPng}). Returns a map of `file` -> Buffer for
 * each DERIVED_SIZES entry, or throws if the source cannot be decoded.
 */
async function deriveSizes(source) {
	const img = await Jimp.fromBuffer(source)
	const out = {}
	for (const spec of DERIVED_SIZES) {
		const square = img.clone().contain({ w: spec.size, h: spec.size, alignX: 0.5, alignY: 0.5 })
		if (spec.maskable === true || spec.apple === true) {
			// Opaque white backdrop so launchers/iOS render a solid tile.
			const canvas = new Jimp({ width: spec.size, height: spec.size, color: 0xffffffff })
			canvas.composite(square, 0, 0)
			out[spec.file] = await canvas.getBuffer('image/png')
		} else {
			out[spec.file] = await square.getBuffer('image/png')
		}
	}
	return out
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
		// { activeId, icons: { [id]: { id, mime, ext, name, size, savedAt, rev, pwa, logo } } }
		this.library = { activeId: null, icons: {} }
		// The active icon's loaded state: { rev, mime, ext, name, size, savedAt, pwa, logo, bytes } | null
		this.current = null
		// Platform PWA manifest (raw + parsed), read once at startup.
		this.baseManifest = loadBaseManifest()
		this._load()
		ctx.effect(() => ctx.webServer.register({
			kind: 'exact',
			path: '/icon-custom.svg',
			handler: (request, response) => this._handleIcon(request, response)
		}), 'dsh-icon-custom: /icon-custom.svg route')
		// Exact route beats the frontend-static fallback (webserver match order:
		// exact table → prefix table → fallback), so this transparently overrides
		// the dist manifest without touching any platform file.
		ctx.effect(() => ctx.webServer.register({
			kind: 'exact',
			path: '/manifest.webmanifest',
			handler: (request, response) => this._handleManifest(request, response)
		}), 'dsh-icon-custom: /manifest.webmanifest route')
		// Derived PNGs: /icon-custom-192.png, /icon-custom-512.png,
		// /icon-custom-512-maskable.png, /icon-custom-apple-180.png.
		for (const spec of DERIVED_SIZES) {
			ctx.effect(() => ctx.webServer.register({
				kind: 'exact',
				path: `/icon-custom-${spec.url}.png`,
				handler: (request, response) => this._handleDerivedIcon(request, response, spec.url)
			}), `dsh-icon-custom: /icon-custom-${spec.url}.png route`)
		}
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
			// Re-derive lazily when the record predates the derived set (a
			// pre-0.7.0 icon, or a failed derivation), so /icon-custom-*.png
			// still work after an upgrade. A failure just keeps derived=false.
			const pngBaseline = this._loadBaseline(rec, bytes)
			this.current = { ...rec, bytes, pngBaseline }
		} catch { /* no persisted icon yet */ }
	}

	/**
	 * Best-effort rasterized baseline for the active icon: prefer the PNG
	 * derived set; for a PNG/ICO source, derive from the stored bytes if the
	 * derived directory is missing. Always returns a PNG Buffer or null.
	 */
	_loadBaseline(rec, bytes) {
		const derivedDir = join(this.libraryDir, `${rec.id}.derived`)
		try {
			const p512 = readFileSync(join(derivedDir, '512.png'))
			return p512
		} catch { /* fall through to derive from original bytes */ }
		try {
			if (rec.mime === 'image/png' || rec.mime === 'image/jpeg') return bytes
			if (rec.mime === 'image/x-icon') return extractIcoPng(bytes)
		} catch { /* no rasterizable baseline */ }
		return null
	}

	/** Persist the library index to disk (does not touch icon files). */
	_saveLibrary() {
		return writeFile(this.indexPath, JSON.stringify(this.library, null, 2))
	}

	/** Currently active icon as a JSON-safe status object (no raw bytes). */
	status() {
		const c = this.current
		return c === null
			? { active: false, pwa: false, logo: false, png: false, rev: null, mime: null, ext: null, name: null, size: null, savedAt: null }
			: { active: true, pwa: c.pwa === true, logo: c.logo === true, png: c.pngBaseline !== null, rev: c.rev, mime: c.mime, ext: c.ext, name: c.name, size: c.size, savedAt: c.savedAt }
	}

	/** typert endpoint: read current status. */
	async getStatus() {
		return this.status()
	}

	/** typert endpoint: store a new icon uploaded as a data URL and make it active. */
	async setIcon(request) {
		if (request === null || typeof request !== 'object') throw new Error('缺少图标参数')
		// `pwa`: whether this icon also replaces the PWA install icon (opt-in).
		const pwa = request.pwa === true
		// `logo`: whether this icon also replaces the in-app sidebar brand mark (opt-in).
		const logo = request.logo === true
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
		// Derive a PNG baseline for the PWA/logo path. SVG was already turned
		// into a PNG by the client canvas before it reached setIcon (so a client
		// SVG arrives as `image/png`); ICO is decoded here by extracting the
		// embedded PNG. PNG/JPEG pass through as-is. A derivation failure is not
		// fatal: we keep `derived: false` and serve the original bytes, so the
		// favicon still works and only the multi-size PWA/logo set is skipped.
		const derivedSizes = await this._deriveFor(id, mime, bytes)
		const rec = {
			id,
			mime, ext,
			pwa, logo,
			derived: derivedSizes !== null,
			name: typeof name === 'string' && name.trim().length > 0 ? name.trim().slice(0, 128) : null,
			size: bytes.length, savedAt: now, rev
		}
		this.library.icons[id] = rec
		this.library.activeId = id
		await this._saveLibrary().catch(() => {}) // index is advisory; icon file is authoritative
		this.current = { ...rec, bytes, pngBaseline: derivedSizes ? derivedSizes.baseline : null }
		return this.status()
	}

	/**
	 * Derive the canonical PNG set from an uploaded icon's bytes. Returns
	 * `{ baseline, sizes }` where `baseline` is the working PNG Buffer (used for
	 * logo/favicon serving when the source is SVG/ICO) and `sizes` is the
	 * file->Buffer map for the DERIVED_SIZES set; or null when the source cannot
	 * be rasterized (e.g. BMP-only ICO), in which case we fall back untouched.
	 * The derived files are written under `library/<id>.derived/`.
	 */
	async _deriveFor(id, mime, bytes) {
		try {
			let baseline = null
			if (mime === 'image/png' || mime === 'image/jpeg') {
				baseline = bytes
			} else if (mime === 'image/x-icon') {
				baseline = extractIcoPng(bytes)
			}
			// SVG handled on the client (canvas -> PNG), so a server-side SVG
			// has no rasterizable baseline; fall back. Same for anything else.
			if (baseline === null) return null
			const sizes = await deriveSizes(baseline)
			const dir = join(this.libraryDir, `${id}.derived`)
			await mkdir(dir, { recursive: true })
			for (const spec of DERIVED_SIZES) {
				const buf = sizes[spec.file]
				if (buf === undefined) continue
				const tmp2 = join(dir, `.${spec.file}.png.tmp`)
				await writeFile(tmp2, buf)
				await rename(tmp2, join(dir, `${spec.file}.png`))
			}
			return { baseline, sizes }
		} catch {
			return null
		}
	}

	/** typert endpoint: toggle the PWA-icon flag on the active icon (no re-upload). */
	async setPwa(request) {
		if (request === null || typeof request !== 'object' || typeof request.enabled !== 'boolean') {
			throw new Error('缺少 enabled 参数')
		}
		const id = this.library.activeId
		if (id === null || this.current === null) throw new Error('当前没有自定义图标')
		const rec = this.library.icons[id]
		if (rec === null || typeof rec !== 'object') throw new Error('图标记录不存在')
		rec.pwa = request.enabled === true
		this.current.pwa = rec.pwa
		await this._saveLibrary().catch(() => {}) // index is advisory
		return this.status()
	}

	/** typert endpoint: toggle the brand-mark flag on the active icon (no re-upload). */
	async setLogo(request) {
		if (request === null || typeof request !== 'object' || typeof request.enabled !== 'boolean') {
			throw new Error('缺少 enabled 参数')
		}
		const id = this.library.activeId
		if (id === null || this.current === null) throw new Error('当前没有自定义图标')
		const rec = this.library.icons[id]
		if (rec === null || typeof rec !== 'object') throw new Error('图标记录不存在')
		rec.logo = request.enabled === true
		this.current.logo = rec.logo
		await this._saveLibrary().catch(() => {}) // index is advisory
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

	/**
	 * Serve a derived PNG (`/icon-custom-<size>.png`, size 192/512/512-maskable/
	 * apple-180) for the PWA manifest and the iOS apple-touch-icon. Falls back
	 * to the rasterized baseline (or a 404) when no derived set exists yet.
	 */
	async _handleDerivedIcon(request, response, sizeUrl) {
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			response.writeHead(405, { allow: 'GET, HEAD' })
			response.end()
			return
		}
		const c = this.current
		if (c === null) {
			response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
			response.end('no custom icon')
			return
		}
		let bytes = null
		let mime = 'image/png'
		const spec = DERIVED_SIZES.find((s) => s.url === sizeUrl)
		if (spec !== undefined) {
			try {
				bytes = readFileSync(join(this.libraryDir, `${c.id}.derived`, `${spec.file}.png`))
			} catch { /* fall back to baseline */ }
		}
		// No derived file yet: serve the rasterized baseline so the manifest
		// entry still resolves to a real PNG rather than a broken href.
		if (bytes === null && c.pngBaseline !== null) bytes = c.pngBaseline
		if (bytes === null) {
			response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
			response.end('icon not rasterizable')
			return
		}
		response.writeHead(200, {
			'content-type': mime,
			'content-length': bytes.length,
			'cache-control': 'public, max-age=31536000, immutable',
			'x-content-type-options': 'nosniff'
		})
		if (request.method === 'HEAD') { response.end(); return }
		response.end(bytes)
	}

	/** PWA manifest body: platform manifest verbatim, or with `icons` pointed
	 *  at the canonical derived PNG set when the PWA option is on for the
	 *  active icon. */
	_manifestJson() {
		const c = this.current
		if (c === null || c.pwa !== true) return this.baseManifest.raw
		// Preferred: the derived canonical sizes. When no derived set exists,
		// fall back to the original upload so the manifest still declares a
		// usable icon rather than pointing at broken derivative URLs.
		if (c.pngBaseline !== null) {
			const icons = DERIVED_SIZES.filter((s) => s.url !== 'apple-180').map((s) => ({
				src: `/icon-custom-${s.url}.png?v=${c.rev}`,
				sizes: `${s.size}x${s.size}`,
				type: 'image/png',
				purpose: s.maskable === true ? 'maskable' : 'any'
			}))
			return JSON.stringify({ ...this.baseManifest.parsed, icons }, null, 2)
		}
		const icons = [{
			src: `/icon-custom.svg?v=${c.rev}`,
			sizes: iconSizes(c.mime, c.bytes),
			type: c.mime,
			purpose: 'any'
		}]
		return JSON.stringify({ ...this.baseManifest.parsed, icons }, null, 2)
	}

	/** Serve the PWA manifest (platform default unless the PWA option is on). */
	async _handleManifest(request, response) {
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			response.writeHead(405, { allow: 'GET, HEAD' })
			response.end()
			return
		}
		const body = this._manifestJson()
		response.writeHead(200, {
			'content-type': 'application/manifest+json',
			// The static dist server sends no cache headers; require revalidation
			// so a toggled PWA icon is picked up without a hard cache purge.
			'cache-control': 'no-cache',
			'x-content-type-options': 'nosniff'
		})
		if (request.method === 'HEAD') {
			response.end()
			return
		}
		response.end(body)
	}

	/** Rewrite the head `<link rel="icon">` only when a custom icon is active.
	 *  Also points `<link rel="apple-touch-icon">` (iOS home-screen installs)
	 *  at the derived 180x180 opaque PNG when the PWA option is on and we have
	 *  a rasterized baseline — iOS ignores SVG and transparent apple-touch-icons. */
	_rewriteIndex(html) {
		const c = this.current
		if (c === null) return html
		let out = html
		// Prefer the derived PNG set for the favicon so SVG/ICO uploads (and
		// oversize PNGs) render consistently; fall back to the original.
		const favHref = c.pngBaseline !== null
			? `/icon-custom-192.png?v=${c.rev}`
			: `/icon-custom.svg?v=${c.rev}`
		const favType = c.pngBaseline !== null ? 'image/png' : c.mime
		const tag = `<link rel="icon" type="${favType}" href="${favHref}" />`
		const re = /<link\s+rel="icon"[^>]*\/?>/i
		out = re.test(out) ? out.replace(re, tag) : out.replace(/<head>/i, `<head>${tag}`)
		if (c.pwa === true && c.pngBaseline !== null) {
			const tag2 = `<link rel="apple-touch-icon" href="/icon-custom-apple-180.png?v=${c.rev}" />`
			const re2 = /<link\s+rel="apple-touch-icon"[^>]*\/?>/i
			out = re2.test(out) ? out.replace(re2, tag2) : out.replace(/<head>/i, `<head>${tag2}`)
		}
		return out
	}
}

export default FaviconCustomService
