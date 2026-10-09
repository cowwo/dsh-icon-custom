// 进行中黄点的回归测试(0.18.0)。
//
// 锁五件事,每一件坏了都会让黄点变成"看着像在动、其实在撒谎",或者变成一块挡路的黄条:
//   * 谁算"在跑":官方的 `running`,但停下来等你(审批/提问/计划待审)不算、
//     子代理会话不算 —— 口径必须和官方那一行的灰转圈同进同出;
//   * 谁不算:脏输入、没有 running 字段的行,不许把黄点画出来;
//   * 会话行与工作区文件夹:红左黄右(黄点只能追加在红点之后,重画多少遍都不许换位、
//     不许把自己插成整行的通栏——0.18.0 第一版就是这样错的);
//   * "工作区"标题后面:黄数字在红数字下方(右上一个、右下一个),黄点关掉红点不动;
//   * 标签页与左上角:两个数字上下排,黄的在右下,且两颗徽标不许叠在一起。
// 跑法:在仓库根目录 `node test/running-mark.mjs`(从 client/client.js 切真实代码,
// 只桩 DOM/RPC,所以测的是即将发布的代码本身)。

import { readFileSync } from 'node:fs'
import { TYPERT } from '../lib/typert.host.js'
import { RUNNING_MARK_DEFAULT, normalizeRunningConfig } from '../lib/running.js'

const src = readFileSync('client/client.js', 'utf8')

function slice(startMarker, endMarker, label) {
	const a = src.indexOf(startMarker)
	if (a < 0) throw new Error('找不到 ' + label)
	const b = src.indexOf(endMarker, a)
	if (b < 0) throw new Error('找不到 ' + label + ' 的结尾')
	return src.slice(a, b)
}
function extract(marker) {
	const a = src.indexOf(marker)
	if (a < 0) throw new Error('找不到 ' + marker)
	const i = src.indexOf('{', a + marker.length - 1)
	let d = 0
	for (let j = i; j < src.length; j++) {
		if (src[j] === '{') d++
		else if (src[j] === '}') { d--; if (d === 0) return src.slice(a, j + 1) }
	}
	throw new Error('括号不配对 ' + marker)
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

// —— 纯函数:谁在跑 ——

const runningCode = [
	extract('function runningSessionIds(list, status) {'),
	extract('function runningWorkspaceDots(ids, owners) {')
].join('\n')
const running = new Function(runningCode + '\nreturn { runningSessionIds, runningWorkspaceDots }')()

const list = (ids, byId) => ({ ids, byId })
const statusRow = (extra = {}) => ({ running: false, pendingInteraction: undefined, ...extra })
const entry = (extra = {}) => ({ id: 'x', displayTitle: 'x', ...extra })

console.log('— 谁算「在跑」:只认官方 running,等你和子代理都不算 —')
{
	const snapshot = list(['a', 'b', 'c', 'd', 'e'], {
		a: entry({ running: true }),
		b: entry({ running: true }),
		c: entry({ running: true }),
		d: entry({ running: true, origin: 'subagent' }),
		e: entry({ running: false })
	})
	const status = new Map([
		['b', statusRow({ running: true, pendingInteraction: { kind: 'approval' } })],
		['c', statusRow({ running: false })]
	])
	const ids = running.runningSessionIds(snapshot, status)
	check(ids.join(',') === 'a', '只留下真正在跑的 a(实际 ' + ids.join(',') + ')')
	check(running.runningSessionIds(list(['b'], { b: entry({ running: true }) }), status).length === 0, '停下来等你审批的不算(官方那行显示的是琥珀色,不是灰转圈)')
	check(running.runningSessionIds(list(['d'], { d: entry({ running: true, origin: 'subagent' }) }), new Map()).length === 0, '子代理会话不算(官方侧栏根本不渲染它们)')
	check(running.runningSessionIds(list(['c'], { c: entry({ running: true }) }), status).length === 0, 'status 更权威:它说没跑就没跑')
	check(running.runningSessionIds(list(['z'], { z: entry({ running: true }) }), new Map()).join(',') === 'z', 'status 里没有这一行时退回列表自己的 running(官方 sessionNode 的回退)')
	check(running.runningSessionIds(null, null).length === 0, '什么都没有时不炸也不猜')
	check(running.runningSessionIds({ byId: { q: entry({ running: true }) } }, null).join(',') === 'q', '没有 ids 数组时按 byId 走')
	check(running.runningSessionIds(list(['r'], { r: { id: 'r' } }), new Map()).length === 0, '没有 running 字段的行不算(缺省是"没在跑",不是"也许在跑")')
}

console.log('— 工作区分组:数不到的宁可丢掉 —')
{
	const owners = { a: { id: 'W1', title: '前端' }, b: { id: 'W1', title: '前端' }, c: { id: 'W2', title: '后端' } }
	const out = running.runningWorkspaceDots(['a', 'b', 'c', 'ghost'], owners)
	check(JSON.stringify(out) === JSON.stringify([{ id: 'W1', name: '前端', count: 2 }, { id: 'W2', name: '后端', count: 1 }]), '两个工作区各自计数、忙的在前(实际 ' + JSON.stringify(out) + ')')
	check(running.runningWorkspaceDots(['ghost'], owners).length === 0, '认不出工作区的会话不进标记(宁可不显示,也不放到别人那一行)')
	check(running.runningWorkspaceDots(null, null).length === 0, '脏输入返回空')
}

// —— 假 DOM:只实现这段代码真正碰的那几个面 ——

function textNode(value, parent) {
	return { nodeValue: value, parentElement: parent }
}

class El {
	constructor(tag, attrs = {}) {
		this.tag = tag
		this.tagName = String(tag).toUpperCase()
		this.attrs = { ...attrs }
		this.children = []
		this.ownText = []
		this.parentElement = null
		this.style = { cssText: '', position: '', display: '' }
		this.title = ''
		this.isConnected = true
		this.rect = null
	}
	get textContent() {
		return this.ownText.map((t) => t.nodeValue).join('') + this.children.map((c) => c.textContent).join('')
	}
	set textContent(value) {
		this.ownText = [textNode(String(value), this)]
		this.children = []
	}
	get nextElementSibling() {
		const parent = this.parentElement
		if (parent === null) return null
		return parent.children[parent.children.indexOf(this) + 1] ?? null
	}
	appendChild(node) {
		node.remove()
		node.parentElement = this
		node.isConnected = true
		this.children.push(node)
		return node
	}
	insertAdjacentElement(position, node) {
		const parent = this.parentElement
		if (position !== 'afterend' || parent === null) return null
		node.remove()
		const index = parent.children.indexOf(this)
		node.parentElement = parent
		node.isConnected = true
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
	contains(node) {
		return this === node || this.descendants().includes(node)
	}
	addEventListener() {}
	removeEventListener() {}
	querySelectorAll(selector) {
		return this.descendants().filter((el) => matches(el, selector))
	}
	querySelector(selector) {
		return this.querySelectorAll(selector)[0] ?? null
	}
}

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
		if (el.tag === part || el.tagName === part.toUpperCase()) return true
	}
	return false
}

function makeDocument(root) {
	const all = () => [root, ...root.descendants()]
	const head = new El('head')
	return {
		head,
		querySelector: (selector) => all().find((el) => matches(el, selector)) ?? null,
		querySelectorAll: (selector) => all().filter((el) => matches(el, selector)),
		getElementById: (id) => all().find((el) => el.id === id) ?? null,
		createElement: (tag) => new El(tag),
		createTreeWalker: (node) => {
			const nodes = node.textNodes()
			let i = 0
			return { nextNode: () => (i < nodes.length ? nodes[i++] : null) }
		}
	}
}

/** The real workspace-dots region, driven by a fake DOM. */
function load(root, { unreadConfig = { workspaceDot: true }, runningConfig = { enabled: true } } = {}) {
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
		'unreadConfig', 'runningConfig', 'RUNNING_YELLOW', 'document', 'window', 'console', 'NodeFilter',
		region + '\nreturn { emitSidebarMarks, paintWorkspaceDots, clearWorkspaceDots };'
	)(unreadConfig, runningConfig, '#f5c518', doc, win, { warn: () => {} }, { SHOW_TEXT: 4 })
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

const dotsOf = (el, attr) => el.children.filter((child) => child.getAttribute(attr) !== null)

console.log('— 会话行:红左黄右,重画多少遍都不许乱 —')
{
	const root = sidebar()
	const rowA = row('session:A')
	const titleA = title('你好', rowA)
	root.appendChild(rowA)
	const { api, doc } = load(root)
	api.emitSidebarMarks({ workspaces: [], sessions: [{ id: 'A', title: '你好' }], runningSessions: [{ id: 'A', title: '你好' }], runningWorkspaces: [] })
	api.paintWorkspaceDots()
	const order = rowA.children.filter((child) => child.getAttribute('data-icon-custom-rundot') !== null || child.getAttribute('data-icon-custom-rowdot') !== null)
	check(order.length === 2, '同一会话两颗点都在(实际 ' + order.length + ' 颗)')
	check(order[0].getAttribute('data-icon-custom-rowdot') === 'A', '第一颗是红点(未读)')
	check(order[1].getAttribute('data-icon-custom-rundot') === 'A', '第二颗是黄点(进行中)——左红右黄')
	check(order[0].nextElementSibling === order[1], '黄点紧跟在红点后面')
	check(titleA.nextElementSibling === order[0], '第一颗点就挂在标题后面')
	check(order[1].style.cssText.includes('#f5c518'), '黄点用的是那个金黄(与官方"等你"的琥珀 #f59e0b 可分辨)')
	api.paintWorkspaceDots()
	const again = rowA.children.filter((child) => child.getAttribute('data-icon-custom-rundot') !== null || child.getAttribute('data-icon-custom-rowdot') !== null)
	check(again.length === 2 && again[0] === order[0] && again[1] === order[1], '重复绘制不新增、也不换位')
	// 只有红点的会话:黄点不该凭空出现。
	const rowB = row('session:B')
	title('只有未读', rowB)
	root.appendChild(rowB)
	api.emitSidebarMarks({ workspaces: [], sessions: [{ id: 'A', title: '你好' }, { id: 'B', title: '只有未读' }], runningSessions: [{ id: 'A', title: '你好' }], runningWorkspaces: [] })
	api.paintWorkspaceDots()
	check(dotsOf(rowB, 'data-icon-custom-rundot').length === 0 && dotsOf(rowB, 'data-icon-custom-rowdot').length === 1, '没在跑的会话只有红点')
	check(doc.querySelectorAll('[data-icon-custom-rundot]').length === 1, '另一个会话仍是红加黄各一颗')
}

console.log('— 工作区文件夹:黄点落在图标上(不是数字、不是通栏) —')
{
	const root = sidebar()
	const wRow = row('workspace:W')
	const icon = folder(wRow)
	const nameHolder = title('12000009_替换网页图标', wRow)
	root.appendChild(wRow)
	const { api } = load(root)
	api.emitSidebarMarks({
		workspaces: [{ id: 'W', name: '12000009_替换网页图标', count: 1 }],
		sessions: [],
		runningSessions: [],
		runningWorkspaces: [{ id: 'W', name: '12000009_替换网页图标', count: 2 }]
	})
	api.paintWorkspaceDots()
	const red = dotsOf(wRow, 'data-icon-custom-wsdot')
	const yellow = dotsOf(wRow, 'data-icon-custom-runws')
	check(red.length === 1 && yellow.length === 1, '文件夹上红黄两颗点都在(实际 ' + red.length + ' / ' + yellow.length + ')')
	check(yellow.length === 1 && yellow[0].style.cssText.includes('width:8px'), '黄标记是固定 8px 的点(不会随文字长成一条)')
	check(yellow.length === 1 && yellow[0].style.cssText.includes('position:absolute'), '它是绝对定位的点(不是插进名字里的流式节点——0.18.0 第一版就是这样撑成通栏的)')
	check(yellow.length === 1 && nameHolder.querySelectorAll('[data-icon-custom-runws]').length === 0, '名字持有者内部一个标记都没插(插进去会改掉名字文本,后续重绘会认不出它)')
	check(red.length === 1 && yellow.length === 1 && parseFloat(yellow[0].style.left) > parseFloat(red[0].style.left), '左红右黄(黄点 left=' + (yellow[0] && yellow[0].style.left) + ' / 红点 left=' + (red[0] && red[0].style.left) + ')')
	check(red.length === 1 && parseFloat(red[0].style.left) === icon.rect.right - 4 - 10, '红点让位一个点的宽度(否则两颗叠在一起)')
	// 只有黄点(没有未读):它占红点原来的那个角。
	const solo = sidebar()
	const soloRow = row('workspace:S')
	folder(soloRow)
	title('只有进行中', soloRow)
	solo.appendChild(soloRow)
	const s = load(solo)
	s.api.emitSidebarMarks({ workspaces: [], sessions: [], runningSessions: [], runningWorkspaces: [{ id: 'S', name: '只有进行中', count: 1 }] })
	s.api.paintWorkspaceDots()
	const soloYellow = dotsOf(soloRow, 'data-icon-custom-runws')
	check(soloYellow.length === 1 && parseFloat(soloYellow[0].style.left) === 22 - 4, '没有红点时,黄点回到原来那个角(left=' + (soloYellow[0] && soloYellow[0].style.left) + ')')
	// 黄点消失后,红点必须退回原处(不许永久让位)。
	s.api.emitSidebarMarks({ workspaces: [{ id: 'S', name: '只有进行中', count: 1 }], sessions: [], runningSessions: [], runningWorkspaces: [] })
	s.api.paintWorkspaceDots()
	const backRed = dotsOf(soloRow, 'data-icon-custom-wsdot')
	check(backRed.length === 1 && parseFloat(backRed[0].style.left) === 22 - 4, '黄点没了以后红点退回原来的角(left=' + (backRed[0] && backRed[0].style.left) + ')')
}

console.log('— 两个开关互不牵连 —')
{
	const root = sidebar()
	const rowA = row('session:A')
	title('你好', rowA)
	root.appendChild(rowA)
	const { api, doc } = load(root, { runningConfig: { enabled: false } })
	api.emitSidebarMarks({ workspaces: [{ id: 'W', name: '某工作区', count: 1 }], sessions: [{ id: 'A', title: '你好' }], runningSessions: [{ id: 'A', title: '你好' }], runningWorkspaces: [{ id: 'W', name: '某工作区', count: 1 }] })
	api.paintWorkspaceDots()
	check(doc.querySelectorAll('[data-icon-custom-rundot]').length === 0, '黄点开关关掉 → 黄点不画')
	check(doc.querySelectorAll('[data-icon-custom-runws]').length === 0, '工作区黄点也不画')
	check(doc.querySelectorAll('[data-icon-custom-rowdot]').length === 1, '红点一个都不少')
	// 反过来:红点开关关掉,黄点照旧。
	const other = sidebar()
	const rowB = row('session:B')
	title('在跑的会话', rowB)
	other.appendChild(rowB)
	const o = load(other, { unreadConfig: { workspaceDot: false } })
	o.api.emitSidebarMarks({ workspaces: [], sessions: [{ id: 'B', title: '在跑的会话' }], runningSessions: [{ id: 'B', title: '在跑的会话' }], runningWorkspaces: [] })
	o.api.paintWorkspaceDots()
	check(o.doc.querySelectorAll('[data-icon-custom-rundot]').length === 1, '红点开关关掉 → 黄点照旧')
	check(o.doc.querySelectorAll('[data-icon-custom-rowdot]').length === 0, '红点确实关掉了')
	// 行没渲染(工作区收起)时不画,也不许抛错。
	const empty = sidebar()
	const e = load(empty)
	e.api.emitSidebarMarks({ workspaces: [], sessions: [], runningSessions: [{ id: 'ghost', title: '没渲染的' }], runningWorkspaces: [{ id: 'W9', name: '收起的工作区', count: 3 }] })
	e.api.paintWorkspaceDots()
	check(empty.descendants().length === 0, '没有行就什么都不插(实际插了 ' + empty.descendants().length + ' 个节点)')
}

// —— favicon:两个数字,右上红、右下黄 ——

const faviconCode = [
	extract('function badgeLabel(count) {'),
	extract('function roundRect(c2d, x, y, w, h) {'),
	extract('function faviconBadgeFitScale(scale) {'),
	extract('function drawFaviconBadge(c2d, size, count, scale) {'),
	extract('function drawFaviconRunningBadge(c2d, size, count, scale) {')
].join('\n')

function recorder() {
	const ops = []
	const style = { value: '' }
	const c2d = {
		save: () => ops.push(['save']),
		restore: () => ops.push(['restore']),
		beginPath: () => ops.push(['beginPath']),
		arc: (x, y, r) => ops.push(['arc', x, y, r]),
		moveTo: (x, y) => ops.push(['moveTo', x, y]),
		arcTo: (x1, y1, x2, y2) => ops.push(['arcTo', x1, y1, x2, y2]),
		closePath: () => {},
		fill: () => ops.push(['fill', style.value]),
		fillText: (text, x, y) => ops.push(['fillText', text, x, y, style.value]),
		font: '',
		textAlign: '',
		textBaseline: ''
	}
	Object.defineProperty(c2d, 'fillStyle', {
		get: () => style.value,
		set: (value) => { style.value = value; ops.push(['fillStyle', value]) }
	})
	return { c2d, ops }
}

/** Topmost and bottommost y the drawing touched, so two pills can be compared. */
function verticalSpan(ops) {
	const ys = []
	for (const op of ops) {
		if (op[0] === 'moveTo') ys.push(op[2])
		if (op[0] === 'fillText') ys.push(op[3])
		if (op[0] === 'arcTo') ys.push(op[2], op[4])
	}
	return { top: Math.min(...ys), bottom: Math.max(...ys) }
}

console.log('— favicon:两颗数字等大、右上红右下黄、不叠在一起 —')
{
	const f = new Function('RUNNING_YELLOW', faviconCode + '\nreturn { drawFaviconBadge, drawFaviconRunningBadge, faviconBadgeFitScale }')('#f5c518')
	const size = 64
	const solo = recorder()
	f.drawFaviconRunningBadge(solo.c2d, size, 2, 1)
	const text = solo.ops.find((op) => op[0] === 'fillText')
	check(text !== undefined && text[1] === '2', '黄徽标画的是数字(不是点):' + JSON.stringify(text))
	check(text !== undefined && text[2] > size / 2 && text[3] > size / 2, '黄数字在右下角(实测 ' + JSON.stringify(text) + ')')
	check(text !== undefined && text[4] === '#1f1f1f', '黄底用深色字(白字在黄上看不清)')
	check(solo.ops.some((op) => op[0] === 'fillStyle' && op[1] === '#f5c518'), '黄底就是那个金黄')
	// 只有一颗时,它保持设置里那个大小(配对才缩)。
	const soloSpan = verticalSpan(solo.ops)
	check(Math.round(soloSpan.bottom - soloSpan.top) === Math.round(size * (2 * 0.28 + 0.06)), '单独在场时用完整大小,含白圈(实测 ' + Math.round(soloSpan.bottom - soloSpan.top) + 'px)')
	// 两颗同时出现:同一个尺寸,上下排开,谁也不压谁。
	const pairedHeights = []
	for (const setting of [1, 1.15, 1.3]) {
		const k = setting * f.faviconBadgeFitScale(setting)
		const yellowOps = recorder()
		const redOps = recorder()
		f.drawFaviconRunningBadge(yellowOps.c2d, size, 2, k)
		f.drawFaviconBadge(redOps.c2d, size, 3, k)
		const ys = verticalSpan(yellowOps.ops)
		const rs = verticalSpan(redOps.ops)
		const yellowH = ys.bottom - ys.top
		const redH = rs.bottom - rs.top
		const redText = redOps.ops.find((op) => op[0] === 'fillText')
		check(Math.abs(yellowH - redH) <= 1, '角标大小=' + setting + ':两颗一样高(红 ' + Math.round(redH) + 'px / 黄 ' + Math.round(yellowH) + 'px——用户报的就是一大一小)')
		check(ys.top >= rs.bottom - 0.5, '角标大小=' + setting + ':黄的在红的下方、不重叠(缝隙 ' + Math.round(ys.top - rs.bottom) + 'px)')
		check(redText !== undefined && redText[3] < size / 2 && ys.top > size / 2, '角标大小=' + setting + ':红在上半、黄在下半')
		check(k < setting || setting === k, '角标大小=' + setting + ':配对时只缩不放(系数 ' + k.toFixed(3) + ' ≤ ' + setting + ')')
		check(rs.top >= -1 && ys.bottom <= size + 1, '角标大小=' + setting + ':两颗都在画布内(红顶 ' + rs.top.toFixed(1) + ' / 黄底 ' + ys.bottom.toFixed(1) + ')')
		pairedHeights.push(redH)
	}
	// 定案(0.18.0):配对时忽略"红点大小"档位 —— 画布是硬约束,三档画出来一样。
	check(Math.round(pairedHeights[0]) === Math.round(pairedHeights[1]) && Math.round(pairedHeights[1]) === Math.round(pairedHeights[2]), '配对时小/中/大三档尺寸完全一样(实测 ' + pairedHeights.map((h) => Math.round(h)).join(' / ') + 'px)')
	// 单独出现时档位必须生效,而且三档互不相同。
	const soloHeights = [1, 1.15, 1.3].map((setting) => {
		const r = recorder()
		f.drawFaviconBadge(r.c2d, size, 2, setting)
		const span = verticalSpan(r.ops)
		return span.bottom - span.top
	})
	check(soloHeights[0] < soloHeights[1] && soloHeights[1] < soloHeights[2], '单独出现时三档依次变大(实测 ' + soloHeights.map((h) => Math.round(h)).join(' / ') + 'px)')
	const big = recorder()
	f.drawFaviconRunningBadge(big.c2d, size, 1234, 1.3)
	const bigText = big.ops.find((op) => op[0] === 'fillText')
	check(bigText !== undefined && bigText[1] === '99+', '超过 99 用人读得下的写法(和角标同一条规矩)')
}

console.log('— 左上角两颗数字徽标:同样等大 —')
{
	const edges = new Function(extract('function brandPillEdges(size, scale, hasUnread, hasRunning) {') + '\nreturn brandPillEdges')()
	const one = edges(24, 1.15, true, false)
	check(one.unread === Math.max(12, Math.round(24 * 0.5 * 1.15)), '只有未读时,红 pill 还是原来的大小(' + one.unread + 'px)')
	const both = edges(24, 1.15, true, true)
	check(both.unread === both.running, '两颗都在时一样大(红 ' + both.unread + 'px / 黄 ' + both.running + 'px)')
	check(both.unread * 2 + 1 <= 24, '两颗合起来放得下 24px 的 logo(' + both.unread * 2 + '+1 ≤ 24)')
	const rail = edges(32, 1.3, true, true)
	check(rail.unread === rail.running && rail.unread * 2 + 1 <= 32, '大一点的 logo 上同样等大且放得下(' + rail.unread + 'px ×2)')
	check(edges(24, 1.15, false, true).running === one.unread, '只有进行中时,黄 pill 用完整大小')
}

// —— 合成:两颗标记各自独立决定,谁在都不许把另一个吞掉 ——

console.log('— 合成:只有黄点也要重建图标,两颗都关才回到原图 —')
{
	const body = extract('async function applyBadgeToFavicon(count, size) {')
	async function composeCase({ running, active }) {
		const draws = { yellow: 0, badge: 0, restored: 0, icons: [] }
		const canvas = {
			width: 0,
			height: 0,
			getContext: () => ({ drawImage: () => {}, save: () => {}, restore: () => {}, fillRect: () => {} }),
			toDataURL: () => 'data:image/png;base64,composed'
		}
		const fn = new Function(
			'desiredIconHref', 'desiredIconType', 'iconState', 'setIconEverywhere', 'restoreShippedIcons',
			'loadIconImage', 'document', 'FAVICON_SIZE', 'badgeScale', 'drawFaviconBadge', 'drawFaviconRunningBadge',
			'warnFaviconCompose', 'runningTotal', 'faviconBase', 'composeSeq', 'faviconComposing', 'URL',
			body + '\nreturn applyBadgeToFavicon'
		)(
			() => '/icon-custom.svg',
			() => 'image/svg+xml',
			{ active },
			(href) => draws.icons.push(href),
			() => { draws.restored++ },
			() => Promise.resolve({ naturalWidth: 512, naturalHeight: 512, width: 512, height: 512 }),
			{ baseURI: 'http://localhost/', createElement: () => canvas },
			64,
			() => 1,
			() => { draws.badge++ },
			() => { draws.yellow++ },
			() => {},
			running,
			null,
			0,
			false,
			URL
		)
		await fn(0, 'md')
		return draws
	}

	const onlyRunning = await composeCase({ running: 1, active: true })
	check(onlyRunning.yellow === 1 && onlyRunning.badge === 0, '只有"在跑"、没有未读时:画黄数字、不画红数字(实际黄 ' + onlyRunning.yellow + ' / 红 ' + onlyRunning.badge + ')')
	check(onlyRunning.icons.length === 1 && onlyRunning.icons[0] === 'data:image/png;base64,composed', '合成的图标真的被写进了 link(否则标签页还是老图标)')
	check(onlyRunning.restored === 0, '不能因为"未读是 0"就把整张图标撤回默认')

	const quiet = await composeCase({ running: 0, active: false })
	check(quiet.restored === 1 && quiet.yellow === 0 && quiet.badge === 0, '两颗都没有 → 交回平台/自定义原图,不合成')
}

// —— 侧栏「工作区」标题:右上一个红数字、右下一个黄数字 ——

console.log('— 标题后的黄数字:红数字下方,零就隐藏 —')
{
	const start = src.indexOf('const HEAD_BADGE_ATTR = "data-icon-custom-unreadbadge";')
	const end = src.indexOf('/** Gap between the panel and whatever it is anchored to. */', start)
	if (start < 0 || end < 0) throw new Error('找不到 header badge 区域')
	const region = src.slice(start, end)
	const root = sidebar()
	const headerRow = new El('div')
	headerRow.rect = { left: 0, top: 0, right: 200, bottom: 36, width: 200, height: 36 }
	headerRow.appendChild(new El('button'))
	const label = new El('div')
	label.rect = { left: 8, top: 8, right: 52, bottom: 28, width: 44, height: 20 }
	label.ownText = [textNode('工作区', label)]
	headerRow.appendChild(label)
	root.appendChild(headerRow)
	const doc = makeDocument(root)
	const warned = []
	const words = { unreadPanelCount: '{n} 个待处理', unreadPanelNone: '暂无待处理', runningMarkCount: '{n} 个进行中' }
	/** One painter over the real region, with a fixed unread count and a settable running count. */
	function painter(runningCount) {
		return new Function(
			'document', 'window', 'console', 'RUNNING_YELLOW', 'workspaceDotContainer', 'effectiveCount', 'badgeLabel',
			'normalizeCount', 'toggleUnreadPanel', 'runningTotal',
			'const words = ' + JSON.stringify(words) + ';\n' + region + '\nbadgeT = (key) => words[key] ?? key;\nreturn { paintHeaderBadge };'
		)(
			doc,
			{ getComputedStyle: (el) => ({ position: el.style.position === '' ? 'static' : el.style.position }) },
			{ warn: (...args) => warned.push(args.join(' ')) },
			'#f5c518',
			() => root,
			() => 3,
			(count) => (count > 99 ? '99+' : String(count)),
			(value) => (Number.isFinite(Number(value)) && Number(value) > 0 ? Math.floor(Number(value)) : 0),
			() => {},
			runningCount
		)
	}
	painter(2).paintHeaderBadge()
	const red = dotsOf(headerRow, 'data-icon-custom-unreadbadge')
	const yellow = dotsOf(headerRow, 'data-icon-custom-runbadge')
	check(red.length === 1 && red[0].textContent === '3', '红数字画出来了(未读 3)')
	check(yellow.length === 1 && yellow[0].textContent === '2', '黄数字画出来了(进行中 2,实际 ' + JSON.stringify(yellow[0] && yellow[0].textContent) + ')')
	check(yellow.length === 1 && yellow[0].style.display === 'flex', '有进行中时黄数字可见')
	check(yellow.length === 1 && red.length === 1 && yellow[0].style.left === red[0].style.left, '两个数字同一条右边线(右对齐)')
	check(yellow.length === 1 && red.length === 1 && parseFloat(yellow[0].style.top) > parseFloat(red[0].style.top), '黄数字在红数字下方(红 top=' + red[0].style.top + ' / 黄 top=' + yellow[0].style.top + ')')
	check(yellow.length === 1 && yellow[0].getAttribute('title') === '2 个进行中', '无障碍标签走字典(实际 ' + JSON.stringify(yellow[0] && yellow[0].getAttribute('title')) + ')')
	// 重画幂等:第二次不许把自家的黄节点当成"标题",也不许越画越多。
	painter(2).paintHeaderBadge()
	const again = dotsOf(headerRow, 'data-icon-custom-runbadge')
	check(again.length === 1 && again[0] === yellow[0], '重画是幂等的(黄节点不会越画越多)')
	check(red.length === 1 && headerRow.querySelectorAll('button').length === 2, '红节点也只有一个(自己的两个节点不会被认成搜索框)')
	check(warned.length === 0, '这一路上没有任何降级告警(' + warned.join(' | ') + ')')
	// 没有进行中:隐藏,而不是画一个黄 0。
	painter(0).paintHeaderBadge()
	const hidden = dotsOf(headerRow, 'data-icon-custom-runbadge')
	check(hidden.length === 1 && hidden[0].style.display === 'none', '没有进行中时黄数字隐藏(而不是画一个黄 0)')
}

// —— 开关与端点 ——

console.log('— 开关:宿主规则 + 真清单里的端点形状 —')
{
	check(normalizeRunningConfig(null).enabled === RUNNING_MARK_DEFAULT, '缺项 → 默认开(默认开才看得见)')
	check(normalizeRunningConfig({ enabled: false }).enabled === false, '关得掉')
	check(normalizeRunningConfig({ enabled: 'no' }).enabled === RUNNING_MARK_DEFAULT, '脏值不猜,回落默认')
	check(normalizeRunningConfig({ enabled: true, junk: 1 }).enabled === true, '多出来的字段被丢掉')
	const declared = (method) => {
		const invocation = TYPERT.invocations.find((entry) => entry.method === method)
		if (invocation === undefined) throw new Error('清单里没有这个端点: ' + method)
		return invocation.parameters.map((parameter) => parameter.name)
	}
	check(declared('getRunningRule').length === 0, 'getRunningRule 不带参数')
	check(declared('setRunningRule').join(',') === 'request', 'setRunningRule 的参数名是 request(网关只认描述符里的名字)')
	const get = TYPERT.invocations.find((e) => e.method === 'getRunningRule')
	check(get.result.create().parse({ enabled: true }).enabled === true, '读端点的返回就一个布尔开关')
	const setResult = TYPERT.invocations.find((e) => e.method === 'setRunningRule')
	check(setResult.parameters[0].codec.create().parse({ enabled: false }).enabled === false, '写端点接受 { enabled }')
	// 客户端真的按 { args: { request: { enabled } } } 发。
	const calls = []
	const emitted = []
	const normalizeSrc = extract('function normalizeRunningConfig(input) {')
	// `extract` returns the arrow function up to its closing brace; the real call
	// site adds the dependency array + semicolon, so put them back.
	const saveSrc = extract('const saveRunningRule = React.useCallback((patch) => {') + ', [rpc]);'
	const save = new Function(
		'React', 'runningConfig', 'normalizeRunningConfig', 'emitRunningConfig', 'rpc',
		normalizeSrc + '\n' + saveSrc + '\nreturn saveRunningRule'
	)(
		{ useCallback: (fn) => fn },
		{ enabled: true },
		(input) => new Function('input', normalizeSrc + '\nreturn normalizeRunningConfig(input)')(input),
		(value) => emitted.push(value),
		{ call: (path, method, options) => { calls.push({ path, method, options }); return Promise.resolve({ ok: true, value: { enabled: false } }) } }
	)
	save({ enabled: false })
	check(calls.length === 1 && calls[0].method === 'iconCustom/setRunningRule', '开关走自己的端点(实际 ' + (calls[0] && calls[0].method) + ')')
	const args = calls[0] ? Object.keys(calls[0].options.args) : []
	check(args.join(',') === 'request', '载荷是 { request: {...} } 而不是扁平写法(' + args.join(',') + ')')
	check(calls[0] && calls[0].options.args.request.enabled === false, 'request.enabled 就是要存的那个布尔')
	check(emitted.length === 1 && emitted[0].enabled === false, '本地先立即生效,不等往返')
}

if (failed > 0) {
	console.error('\n进行中黄点测试失败:' + failed + ' 项')
	process.exit(1)
}
console.log('\n进行中黄点测试全部通过')
