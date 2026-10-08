// 「红点只能画在属于它的那一行」的回归测试(0.11.2)。
//
// 锁的是同一个定位 bug 的三种表现:
//   * 折叠/未渲染的同名会话,把点画到了唯一还渲染着的同名行上(一行两点、三点);
//   * 重绘把同一个点画两遍(reconcile 必须幂等);
//   * 工作区行按"显示名"匹配 —— 显示名 ≠ 存储标题时点直接消失。
// 跑法:在仓库根目录 `node test/unread-rows.mjs`(从 client/client.js 切真实代码,
// 只桩 document/window/NodeFilter,所以测的是即将发布的代码本身)。

import { readFileSync } from 'node:fs'

const src = readFileSync('client/client.js', 'utf8')

// —— 假 DOM:只实现这段代码真正碰的那几个面 ——

function textNode(value, parent) {
	return { nodeValue: value, parentElement: parent }
}

class El {
	constructor(tag, attrs = {}) {
		this.tag = tag
		this.attrs = { ...attrs }
		this.children = []
		this.ownText = []
		this.parentElement = null
		this.style = { cssText: '', position: '' }
		this.title = ''
		this.isConnected = true
		this.rect = null
	}
	get textContent() {
		return this.ownText.map((t) => t.nodeValue).join('') + this.children.map((c) => c.textContent).join('')
	}
	appendChild(node) {
		node.parentElement = this
		node.isConnected = true
		this.children.push(node)
		return node
	}
	insertAdjacentElement(position, node) {
		const parent = this.parentElement
		if (position !== 'afterend' || parent === null) return null
		const index = parent.children.indexOf(this)
		node.parentElement = parent
		parent.children.splice(index + 1, 0, node)
		return node
	}
	remove() {
		const parent = this.parentElement
		if (parent !== null) {
			const index = parent.children.indexOf(this)
			if (index >= 0) parent.children.splice(index, 1)
		}
		this.parentElement = null
		this.isConnected = false
	}
	getAttribute(name) {
		return Object.prototype.hasOwnProperty.call(this.attrs, name) ? this.attrs[name] : null
	}
	setAttribute(name, value) {
		this.attrs[name] = String(value)
	}
	getBoundingClientRect() {
		return this.rect ?? { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }
	}
	descendants() {
		const out = []
		for (const child of this.children) out.push(child, ...child.descendants())
		return out
	}
	textNodes() {
		const out = [...this.ownText]
		for (const child of this.children) out.push(...child.textNodes())
		return out
	}
	querySelectorAll(selector) {
		return this.descendants().filter((el) => matches(el, selector))
	}
	querySelector(selector) {
		return this.querySelectorAll(selector)[0] ?? null
	}
}

/** Supports the handful of selector shapes this code uses: tag, [attr], [attr="v"], [attr^="v"], comma lists. */
function attrPart(el, part) {
	const m = /^\[([^\]^=]+)\s*(\^=|=)?\s*(?:"([^"]*)"|'([^']*)')?\]$/.exec(part)
	if (m === null) return null
	const name = m[1]
	const op = m[2]
	const want = m[3] ?? m[4] ?? ''
	const have = el.getAttribute(name)
	if (have === null) return false
	if (op === undefined) return true
	if (op === '^=') return String(have).startsWith(want)
	return String(have) === want
}

function matches(el, selector) {
	for (const raw of String(selector).split(',')) {
		const part = raw.trim()
		if (part === '') continue
		if (part.startsWith('[')) {
			if (attrPart(el, part) === true) return true
			continue
		}
		if (el.tag === part) return true
	}
	return false
}

function makeDocument(root) {
	const all = () => [root, ...root.descendants()]
	return {
		querySelector: (selector) => all().find((el) => matches(el, selector)) ?? null,
		querySelectorAll: (selector) => all().filter((el) => matches(el, selector)),
		createElement: (tag) => new El(tag),
		createTreeWalker: (node) => {
			const nodes = node.textNodes()
			let i = 0
			return { nextNode: () => (i < nodes.length ? nodes[i++] : null) }
		}
	}
}

// —— 从真源码切出 workspace dots 区域,用假 DOM 驱动 ——

function load(root, config = { workspaceDot: true }) {
	const start = src.indexOf('const WS_DOT_ATTR = "data-icon-custom-wsdot";')
	const end = src.indexOf('//#endregion', start)
	if (start < 0 || end < 0) throw new Error('找不到 workspace dots 区域')
	const region = src.slice(start, end)
	const doc = makeDocument(root)
	const win = {
		getComputedStyle: (el) => ({ position: el.style.position === '' ? 'static' : el.style.position }),
		setTimeout: () => 1,
		clearTimeout: () => {}
	}
	const api = new Function(
		'unreadConfig', 'document', 'window', 'console', 'NodeFilter',
		region + '\nreturn { emitSidebarMarks, paintWorkspaceDots, clearWorkspaceDots };'
	)(config, doc, win, { warn: () => {} }, { SHOW_TEXT: 4 })
	return { api, doc }
}

function row(key, { height = 28, width = 200, top = 0 } = {}) {
	const el = new El('div', key === null ? {} : { 'data-row-key': key })
	el.rect = { left: 0, top, right: width, bottom: top + height, width, height }
	return el
}

function title(text, parentRow) {
	const holder = new El('div')
	holder.rect = { left: 24, top: parentRow.rect.top, right: 144, bottom: parentRow.rect.bottom, width: 120, height: parentRow.rect.height }
	holder.ownText = [textNode(text, holder)]
	parentRow.appendChild(holder)
	return holder
}

function folder(parentRow, size = 16) {
	const svg = new El('svg')
	svg.rect = { left: 6, top: parentRow.rect.top + 6, right: 6 + size, bottom: parentRow.rect.top + 6 + size, width: size, height: size }
	parentRow.appendChild(svg)
	return svg
}

function sidebar() {
	return new El('div', { 'data-slot': 'sidebar.workspaces' })
}

let failed = 0
function check(ok, what) {
	if (ok) {
		console.log('  ✓ ' + what)
		return
	}
	failed++
	console.log('  ✗ ' + what)
}

// 1. 三个同名会话,只有其中一个的行渲染着 —— 点只能落在它自己那一行上。
{
	console.log('1. 同名折叠会话不得把点画到可见行上')
	const root = sidebar()
	const rowA = row('session:A')
	title('你好', rowA)
	root.appendChild(rowA)
	const { api, doc } = load(root)
	api.emitSidebarMarks({
		workspaces: [],
		sessions: [{ id: 'A', title: '你好' }, { id: 'B', title: '你好' }, { id: 'C', title: '你好' }]
	})
	api.paintWorkspaceDots()
	const dots = doc.querySelectorAll('[data-icon-custom-rowdot]')
	check(dots.length === 1, '三个同名会话只渲染一行时,只有一个点(实际 ' + dots.length + ' 个)')
	check(dots.length === 1 && dots[0].getAttribute('data-icon-custom-rowdot') === 'A', '点属于它自己的会话 A')
	check(dots.length === 1 && dots[0].parentElement === rowA, '点挂在这一行上')
	// reconcile 必须幂等:再画一遍不得多出点来。
	api.paintWorkspaceDots()
	const again = doc.querySelectorAll('[data-icon-custom-rowdot]')
	check(again.length === 1, '重复绘制不产生第二个点(实际 ' + again.length + ' 个)')
}

// 2. 旧版 DSH(完全没有 row key)仍要能画点。
{
	console.log('2. 没有 row key 的旧版构建保留标题退化')
	const root = sidebar()
	const rowA = row(null)
	title('你好', rowA)
	root.appendChild(rowA)
	const { api, doc } = load(root)
	api.emitSidebarMarks({ workspaces: [], sessions: [{ id: 'A', title: '你好' }] })
	api.paintWorkspaceDots()
	check(doc.querySelectorAll('[data-icon-custom-rowdot]').length === 1, '按标题仍画出一个点')
}

// 3. 工作区行按 id 定位:显示名与存储标题不一致时也要画上。
{
	console.log('3. 工作区点按 workspace:<id> 定位')
	const root = sidebar()
	const wRow = row('workspace:W')
	folder(wRow)
	title('默认工作区', wRow)
	root.appendChild(wRow)
	const { api, doc } = load(root)
	api.emitSidebarMarks({ workspaces: [{ id: 'W', name: '12000009_替换网页图标', count: 2 }], sessions: [] })
	api.paintWorkspaceDots()
	const dots = doc.querySelectorAll('[data-icon-custom-wsdot]')
	check(dots.length === 1, '显示名 ≠ 存储标题时仍能画上文件夹点(实际 ' + dots.length + ' 个)')
	check(dots.length === 1 && dots[0].getAttribute('data-icon-custom-wsdot') === 'W', '文件夹点的 key 是工作区 id')
	check(dots.length === 1 && dots[0].parentElement === wRow, '文件夹点挂在工作区行上')
}

// 4. 行根本没渲染(工作区收起 / 会话折叠):不画点,也不许抛错或画到别处。
{
	console.log('4. 没有行的条目直接跳过')
	const root = sidebar()
	const { api, doc } = load(root)
	api.emitSidebarMarks({
		workspaces: [{ id: 'W', name: '某个收起的工作区', count: 1 }],
		sessions: [{ id: 'A', title: '你好' }]
	})
	api.paintWorkspaceDots()
	check(doc.querySelectorAll('[data-icon-custom-wsdot]').length === 0, '工作区没有行时不画点')
	check(doc.querySelectorAll('[data-icon-custom-rowdot]').length === 0, '会话没有行时不画点')
}

// 5. 会话变成已读后,它的点要被回收。
{
	console.log('5. 已读后回收红点')
	const root = sidebar()
	const rowA = row('session:A')
	title('你好', rowA)
	root.appendChild(rowA)
	const { api, doc } = load(root)
	api.emitSidebarMarks({ workspaces: [], sessions: [{ id: 'A', title: '你好' }] })
	api.paintWorkspaceDots()
	const before = doc.querySelectorAll('[data-icon-custom-rowdot]').length
	api.emitSidebarMarks({ workspaces: [], sessions: [] })
	api.paintWorkspaceDots()
	const after = doc.querySelectorAll('[data-icon-custom-rowdot]').length
	check(before === 1 && after === 0, '点随未读状态消失(前 ' + before + ' → 后 ' + after + ')')
}

if (failed > 0) {
	console.error('\n红点定位回归测试失败:' + failed + ' 项')
	process.exit(1)
}
console.log('\n红点定位回归测试全部通过')
