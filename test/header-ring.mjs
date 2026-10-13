// 会话头部「N 个子智能体」计数上的黄圈(0.19.3)。
//
// 锁这些事,每一件坏了都会让它数错、挡点击、或者悄悄挤动官方那一行:
//   * 数的是官方 `subagentCatalog` 里**直接**子代中 `running===true` 的个数:
//     嵌套的孙代理不算、没在跑的不算、projection 还没加载时按 0 而不是乱猜;
//   * 0 个就什么都不画(不留空壳、不留一个会撑高的节点);
//   * >99 显示 `99+`;
//   * 黄圈是纯展示:pointer-events:none、aria-hidden、挂载点绝对定位、
//     官方计数元素补 relative,按钮的 flex 子节点一个都不多;
//   * 开关缺项/脏值 → 开,显式 false → 不画;子会话自己的页面不画;
//   * 找不到官方锚点时安静退让,不抛错也不刷告警。
// 跑法:在仓库根目录 `node test/header-ring.mjs`(从 client/client.js 切真实代码,
// 只桩 DOM/RPC/React,所以测的是即将发布的代码本身)。

import { readFileSync } from 'node:fs'
import { TYPERT } from '../lib/typert.host.js'
import { RUNNING_HEADER_RING_DEFAULT, normalizeRunningConfig } from '../lib/running.js'

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

// —— 假 DOM:只实现这段代码真正碰的那几个面 ——

function textNode(value) {
	return { nodeValue: value }
}

class El {
	constructor(tag, attrs = {}) {
		this.tag = tag
		this.tagName = String(tag).toUpperCase()
		this.attrs = { ...attrs }
		this.children = []
		this.ownText = []
		this.parentElement = null
		this.style = { cssText: '', position: '' }
		this.isConnected = true
	}
	get textContent() {
		return this.ownText.map((t) => t.nodeValue).join('') + this.children.map((c) => c.textContent).join('')
	}
	set textContent(value) {
		this.ownText = [textNode(String(value))]
		this.children = []
	}
	appendChild(node) {
		node.remove()
		node.parentElement = this
		node.isConnected = true
		this.children.push(node)
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
	removeAttribute(name) {
		delete this.attrs[name]
	}
	descendants() {
		const out = []
		for (const child of this.children) out.push(child, ...child.descendants())
		return out
	}
	contains(node) {
		return this === node || this.descendants().includes(node)
	}
	closest(selector) {
		let node = this
		while (node !== null && node !== undefined) {
			if (matches(node, selector)) return node
			node = node.parentElement
		}
		return null
	}
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
	return {
		querySelector: (selector) => all().find((el) => matches(el, selector)) ?? null,
		querySelectorAll: (selector) => all().filter((el) => matches(el, selector)),
		getElementById: () => null,
		createElement: (tag) => new El(tag)
	}
}

// —— 真代码:切出 header ring 区,用假 DOM 驱动 ——

const region = slice('const HEAD_RING_ATTR = "data-icon-custom-headring";', '\t\t//#region components', 'header ring 区')

function load(root, { runningConfig = { headerRing: true } } = {}) {
	const doc = makeDocument(root)
	const warned = []
	const win = {
		getComputedStyle: (el) => ({ position: el.style.position === '' ? 'static' : el.style.position }),
		MutationObserver: class {
			constructor(fn) { this.fn = fn }
			observe() {}
			disconnect() {}
		}
	}
	const api = new Function(
		'document', 'window', 'console', 'RUNNING_YELLOW', 'badgeLabel', 'runningConfig',
		region + '\nreturn { headerRingCount, headerRingCatalogLoaded, headerRingSuppressed, headerRingVisibleCount, paintHeaderRing, clearHeaderRing };'
	)(doc, win, { warn: (...args) => warned.push(args.join(' ')) }, '#f5c518', (n) => (n > 99 ? '99+' : String(n)), runningConfig)
	return { api, doc, warned }
}

function headerFixture({ withSlot = true, withButton = true, withCount = true } = {}) {
	const root = new El('div')
	if (!withSlot) return { root, slot: null, button: null, count: null }
	const slot = new El('div', { 'data-slot': 'conversation.session.header.actions' })
	root.appendChild(slot)
	if (!withButton) return { root, slot, button: null, count: null }
	const button = new El('button', { 'aria-haspopup': 'tree' })
	slot.appendChild(button)
	if (!withCount) return { root, slot, button, count: null }
	const activity = new El('span')
	activity.textContent = '正在运行'
	const count = new El('span')
	count.textContent = '3 个子智能体'
	button.appendChild(activity)
	button.appendChild(count)
	return { root, slot, button, count }
}

const rings = (root) => root.querySelectorAll('[data-icon-custom-headring]').length

/** style.cssText → 声明表,外观断言用(假 DOM 只存整串 cssText)。 */
function cssMap(el) {
	const out = {}
	for (const part of String(el.style.cssText).split(';')) {
		const at = part.indexOf(':')
		if (at < 0) continue
		out[part.slice(0, at).trim()] = part.slice(at + 1).trim()
	}
	return out
}

/** `#1f2328` 这类深色?只认三/六位 hex,顺手排除白字。 */
function isDarkColor(value) {
	const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value).trim())
	if (hex === null) return false
	let digits = hex[1]
	if (digits.length === 3) digits = digits.split('').map((c) => c + c).join('')
	const sum = parseInt(digits.slice(0, 2), 16) + parseInt(digits.slice(2, 4), 16) + parseInt(digits.slice(4, 6), 16)
	return sum < 300
}

// —— 纯函数:谁被数 ——

console.log('— 数谁:官方 subagentCatalog 的直接子代里 running===true —')
{
	const { api } = load(new El('div'))
	const catalogList = (children, byId, extra = {}) => ({
		ids: Object.keys(byId),
		byId,
		projectionsBySession: { p: { state: 'idle', values: { subagentCatalog: children } } },
		...extra
	})
	const children = [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }]
	const status = new Map([
		['c1', { running: true }],
		['c2', { running: false }],
		['c3', { running: true, pendingInteraction: { kind: 'approval' } }]
	])
	// c1 自己又有一份 catalog,里面 g1 在跑:那是孙代理,和父会话的直接子代计数无关。
	const nested = {
		ids: ['c1', 'c2', 'c3'],
		byId: { c1: { id: 'c1', running: true }, c2: { id: 'c2', running: true }, c3: { id: 'c3', running: true }, g1: { id: 'g1', running: true } },
		projectionsBySession: {
			p: { state: 'idle', values: { subagentCatalog: children } },
			c1: { state: 'idle', values: { subagentCatalog: [{ id: 'g1' }] } }
		}
	}
	check(api.headerRingCount(catalogList(children, nested.byId), status, 'p') === 2, 'c1 在跑、c3 在等你(不算)、c2 没跑:2(实际 ' + api.headerRingCount(catalogList(children, nested.byId), status, 'p') + ')')
	// status 里没有的行,退回官方 sessionNode 的列表回退。
	check(api.headerRingCount(nested, new Map(), 'p') === 3, 'status 缺行时退回列表自己的 running(c1/c2/c3 都算)')
	check(api.headerRingCount(nested, new Map(), 'p') === 3 && api.headerRingCount(nested, new Map(), 'c1') === 1, 'c1 自己的直接子代只有 g1 一个(实际 ' + api.headerRingCount(nested, new Map(), 'c1') + ')')
	check(api.headerRingCount(catalogList(children, { c1: { id: 'c1', running: false }, c2: { id: 'c2', running: true } }), new Map(), 'p') === 1, '列表回退只数真正 running:true 的')
	check(api.headerRingCount(catalogList([], {}), status, 'p') === 0, '空目录 → 0')
	check(api.headerRingCount(nested, status, '') === 0 && api.headerRingCount(null, status, 'p') === 0, '没有会话页/没有列表 → 0,不猜')
	// projection 未加载:按 0,不许拿 byId 里碰巧在跑的会话顶上。
	const noProjection = { ids: ['c1'], byId: { c1: { id: 'c1', running: true } }, projectionsBySession: { p: { state: 'idle', values: {} } } }
	check(api.headerRingCount(noProjection, new Map(), 'p') === 0, 'subagentCatalog 未加载 → 0(不把普通 running 会话当子代理)')
	check(api.headerRingCatalogLoaded(noProjection, 'p') === false, '未加载被识别出来(好去请宿主刷新)')
	check(api.headerRingCatalogLoaded(nested, 'p') === true, '空数组是"已加载"的真实答案')
	check(api.headerRingCount(catalogList([{ id: 3 }, null, 'x'], {}), new Map(), 'p') === 0, '脏条目被跳过,不炸')
}

// —— 渲染:0 不画、>99 显示 99+、只是纯展示 ——

console.log('— 渲染:0 个什么都不画;>99 显示 99+ —')
{
	const { root, count } = headerFixture()
	const { api } = load(root)
	check(rings(root) === 0, '开始时没有任何黄圈')
	api.paintHeaderRing({ headerRing: true }, 0)
	check(rings(root) === 0, '0 个 → 什么都不渲染(实际 ' + rings(root) + ' 个节点)')
	api.paintHeaderRing({ headerRing: true }, -1)
	check(rings(root) === 0, '不知道(未加载/未定位)→ 也不渲染')
	api.paintHeaderRing({ headerRing: true }, 3)
	const node = root.querySelector('[data-icon-custom-headring]')
	check(node !== null && node.textContent === '3', '3 个 → 黄圈写 3(实际 ' + (node && node.textContent) + ')')
	api.paintHeaderRing({ headerRing: true }, 150)
	check(node !== null && node.textContent === '99+', '>99 → 显示 99+ (实际 ' + (node && node.textContent) + ')')
	check(count.ownText.map((t) => t.nodeValue).join('') === '3 个子智能体', '官方计数文字一个字都没被改写(实际 ' + JSON.stringify(count.ownText.map((t) => t.nodeValue).join('')) + ')')
}

console.log('— 纯展示:不吃点击、不朗读、绝对定位、不挤动那一行 —')
{
	const { root, button, count } = headerFixture()
	const { api } = load(root)
	const before = button.children.length
	api.paintHeaderRing({ headerRing: true }, 2)
	const node = root.querySelector('[data-icon-custom-headring]')
	check(node !== null && node.getAttribute('aria-hidden') === 'true', 'aria-hidden="true"(官方按钮已含运行数,不重复播报)')
	check(node !== null && node.style.cssText.includes('pointer-events:none'), 'pointer-events:none(它不吃任何事件)')
	check(node !== null && node.style.cssText.includes('position:absolute') && !node.style.cssText.includes('position:fixed'), '位置是 absolute,不是 fixed(实际 ' + JSON.stringify(node && node.style.cssText.slice(0, 60)) + ')')
	check(node !== null && node.style.cssText.includes('background:#f5c518'), '实心黄圆底沿用 RUNNING_YELLOW')
	check(node !== null && node.parentElement === count, '挂在官方计数元素上(不是按钮的直接子节点)')
	check(count.style.position === 'relative', '计数元素被补了 position:relative(绝对定位的参照)')
	check(button.children.length === before, '按钮的 flex 子节点一个都没多(布局不动,实际 ' + button.children.length + ' 个)')
	api.paintHeaderRing({ headerRing: true }, 2)
	check(rings(root) === 1 && root.querySelector('[data-icon-custom-headring]') === node, '重画幂等:还是同一个节点,不会越画越多')
	api.paintHeaderRing({ headerRing: true }, 0)
	check(rings(root) === 0 && count.style.position === '', '归零时撤掉节点并把 position 还原(不留残留)')
}

// —— 外观定稿:圆角方形药丸、黄底深字(照侧栏工作区红数字的样子) ——

console.log('— 外观:圆角方形药丸(不是正圆)、RUNNING_YELLOW 底、深色数字 —')
{
	const { root } = headerFixture()
	const { api } = load(root)
	api.paintHeaderRing({ headerRing: true }, 7)
	const node = root.querySelector('[data-icon-custom-headring]')
	const css = node === null ? {} : cssMap(node)

	// 形状:约 6px 圆角,任何百分比或 999 这类"正圆"值都算失败。
	const radiusRaw = css['border-radius'] ?? ''
	const radius = parseFloat(radiusRaw)
	check(node !== null && !radiusRaw.includes('%') && !/^9{2,}px$/.test(radiusRaw) && Number.isFinite(radius) && radius >= 5 && radius <= 8,
		'borderRadius 是约 5-8px 的圆角方形,不是 50%/999 正圆(实际 ' + JSON.stringify(radiusRaw) + ')')

	// 尺寸量级:16px 见方 + 0 4px 内边距 + 11px/600 数字,行高与高一致以垂直居中。
	check(css['min-width'] === '16px', 'min-width 16px(数字宽度自适应,实际 ' + JSON.stringify(css['min-width']) + ')')
	check(css['height'] === '16px', 'height 16px(实际 ' + JSON.stringify(css['height']) + ')')
	check(css['padding'] === '0 4px', 'padding 0 4px(实际 ' + JSON.stringify(css['padding']) + ')')
	check(css['font-size'] === '11px', 'fontSize 11px(实际 ' + JSON.stringify(css['font-size']) + ')')
	check(css['font-weight'] === '600', 'fontWeight 600(实际 ' + JSON.stringify(css['font-weight']) + ')')
	check(css['line-height'] === '16px', 'lineHeight 16px(数字垂直居中,实际 ' + JSON.stringify(css['line-height']) + ')')

	// 颜色:底色还是那个黄,数字必须是深色,不能是白字。
	check(css['background'] === '#f5c518', '背景沿用 RUNNING_YELLOW #f5c518(实际 ' + JSON.stringify(css['background']) + ')')
	const colorRaw = String(css['color'] ?? '').toLowerCase()
	check(colorRaw !== '' && !['#fff', '#ffffff', 'white', 'rgb(255,255,255)'].includes(colorRaw) && isDarkColor(colorRaw),
		'数字是深色(非 #fff/white,实际 ' + JSON.stringify(css['color']) + ')')
	// 深色必须和 RUNNING_YELLOW 有足够反差,别把深色写成脏值。
	check(isDarkColor(colorRaw) && css['background'] === '#f5c518', '深字压在黄底上,可读')
}

// —— 开关 ——

console.log('— 开关:缺项/脏值 → 开;显式 false → 不画 —')
{
	const cases = [
		[{ headerRing: true }, 2, true, '显式 true → 画'],
		[{}, 2, true, '缺这一项 → 开'],
		[{ headerRing: 'no' }, 2, true, '脏值 → 回落开'],
		[{ headerRing: null }, 2, true, 'null → 回落开'],
		[{ headerRing: false }, 2, false, '显式 false → 不画'],
		[{ headerRing: false }, 150, false, '关掉后 150 个也不画']
	]
	for (const [config, value, want, label] of cases) {
		const { root } = headerFixture()
		const { api } = load(root, { runningConfig: config })
		api.paintHeaderRing(config, value)
		check((rings(root) > 0) === want, label + '(实际 ' + rings(root) + ' 个)')
	}
	check(api_visible_count_checks(), 'headerRingVisibleCount 与开关同口径')
}
function api_visible_count_checks() {
	const { api } = load(new El('div'))
	return api.headerRingVisibleCount({}, 3) === 3
		&& api.headerRingVisibleCount({ headerRing: true }, 0) === 0
		&& api.headerRingVisibleCount({ headerRing: false }, 9) === -1
		&& api.headerRingVisibleCount({ headerRing: 'dirty' }, 9) === 9
}

// —— 子会话 guard ——

console.log('— 子会话自己的页面:官方那行不渲染,黄圈也不许出现 —')
{
	const list = { ids: ['p', 's'], byId: { p: { id: 'p' }, s: { id: 's', origin: 'subagent' } } }
	const { api } = load(new El('div'))
	check(api.headerRingSuppressed(list, 's') === true, 'origin==="subagent" → 抑制')
	check(api.headerRingSuppressed(list, 'p') === false, '普通会话不抑制')
	check(api.headerRingSuppressed(list, '') === true && api.headerRingSuppressed(null, 'p') === true, '没有会话页时不画')
	// 抑制之后交给 paint 的值就是 -1:即使页面上碰巧还留着官方那行,也不装饰。
	const { root } = headerFixture()
	const sub = load(root)
	sub.api.paintHeaderRing({ headerRing: true }, -1)
	check(rings(root) === 0, '抑制值 -1 下不渲染')
	check(src.includes('headerRingSuppressed(list, ringSessionId)') && src.includes('ringSuppressed ? -1 : headerRingCount'), '接线:BadeSource 用同一 guard 决定值')
}

// —— 右侧栏折叠但未卸载的对话:不许画到隐藏那份上 ——

console.log('— 右侧栏仍挂载(隐藏)的对话:锚点必须取可见那份 —')
{
	const root = new El('div')
	const hiddenPanel = new El('div', { 'data-sidebar-right-panel': '1' })
	const hiddenSlot = new El('div', { 'data-slot': 'conversation.session.header.actions' })
	const hiddenButton = new El('button', { 'aria-haspopup': 'tree' })
	const hiddenCount = new El('span')
	hiddenCount.textContent = '隐藏那份'
	hiddenButton.appendChild(hiddenCount)
	hiddenSlot.appendChild(hiddenButton)
	hiddenPanel.appendChild(hiddenSlot)
	root.appendChild(hiddenPanel)
	const visibleSlot = new El('div', { 'data-slot': 'conversation.session.header.actions' })
	const visibleButton = new El('button', { 'aria-haspopup': 'tree' })
	const visibleCount = new El('span')
	visibleCount.textContent = '可见那份'
	visibleButton.appendChild(visibleCount)
	visibleSlot.appendChild(visibleButton)
	root.appendChild(visibleSlot)
	const { api } = load(root)
	api.paintHeaderRing({ headerRing: true }, 4)
	check(hiddenCount.querySelectorAll('[data-icon-custom-headring]').length === 0, '右栏隐藏那份没有黄圈')
	check(visibleCount.querySelectorAll('[data-icon-custom-headring]').length === 1, '可见那份才是锚点(与 conversationOnScreen 同一 guard)')
}

// —— 找不到锚点:安静退让 ——

console.log('— 找不到官方锚点:安静退让,不抛也不刷告警 —')
{
	const cases = [
		[{ withSlot: false }, '整页没有 header actions 槽'],
		[{ withButton: false }, '有槽但没有 aria-haspopup="tree" 的按钮'],
		[{ withCount: false }, '有按钮但一个 span 子节点都没有']
	]
	for (const [options, label] of cases) {
		const { root } = headerFixture(options)
		const { api, warned } = load(root)
		let threw = null
		try { api.paintHeaderRing({ headerRing: true }, 5) } catch (error) { threw = error }
		check(threw === null, label + ':不抛错(' + String((threw && threw.message) || '') + ')')
		check(rings(root) === 0, label + ':不渲染任何东西')
		if (options.withCount === false) check(warned.length === 1, label + ':结构真的不认识时才降级警告一次(实际 ' + warned.length + ' 次)')
		else check(warned.length === 0, label + ':锚点本就不在该页面,完全安静(实际 ' + warned.length + ' 次告警)')
	}
	const { root } = headerFixture({ withSlot: false })
	const { api } = load(root)
	api.clearHeaderRing()
	check(true, 'clearHeaderRing 在没有宿主时也不抛')
}

// —— 与其他计数互不牵连 ——

console.log('— 独立计算:不进 runningSessionIds / 不改其他计数 —')
{
	const runningSrc = extract('function runningSessionIds(list, status) {')
	check(!runningSrc.includes('headerRing'), 'runningSessionIds 里没有 headerRing(不会并进任何既有计数)')
	check(!/emitRunningState\([^)]*headerRing/.test(src), 'emitRunningState(侧栏/角标共用数)不带 headerRing')
	check(!/emitSidebarMarks\([\s\S]{0,400}headerRing/.test(src), 'emitSidebarMarks(红黄点)不带 headerRing')
	check(src.includes('paintHeaderRing(runningConfig, headerRingValue)'), '黄圈由自己的绘制入口独立驱动')
	check(src.includes('data-icon-custom-headring') && !src.includes('.ZKlsPq_') && !src.includes('wSkVaW_'), '只用 data-slot/结构定位,不写任何构建哈希类名')
}

// —— 开关与端点:宿主规则 + 真清单里的形状 ——

console.log('— 开关与端点:宿主规则 + 真清单里的形状 —')
{
	check(RUNNING_HEADER_RING_DEFAULT === true, '宿主默认:开')
	check(normalizeRunningConfig(null).headerRing === true, '宿主 normalize(null) → 开')
	check(normalizeRunningConfig({ enabled: false }).headerRing === true, '宿主缺这一项 → 开')
	check(normalizeRunningConfig({ headerRing: false }).headerRing === false, '宿主关得掉')
	check(normalizeRunningConfig({ headerRing: 'no' }).headerRing === true, '宿主脏值不猜,回落开')
	check(normalizeRunningConfig({ headerRing: 0 }).headerRing === true, '宿主 0 也不猜')
	check(normalizeRunningConfig({ enabled: true, includeSubagents: false, headerRing: false, junk: 1 }).headerRing === false, '三个开关可以各管各的')

	// 客户端那个 normalize 的镜像(测试会把它从模块里切出来,所以它不能依赖模块常量)。
	const normalizeSrc = extract('function normalizeRunningConfig(input) {')
	const normalizeClient = (input) => new Function('input', normalizeSrc + '\nreturn normalizeRunningConfig(input)')(input)
	check(normalizeClient({}).headerRing === true, '客户端缺这一项 → 开')
	check(normalizeClient({ enabled: false }).headerRing === true, '客户端只有 enabled 时 → 开')
	check(normalizeClient({ headerRing: false }).headerRing === false, '客户端关得掉')
	check(normalizeClient({ headerRing: 'no' }).headerRing === true, '客户端脏值不猜,回落开')

	// 保存路径:新字段必须随另外两个一起发给宿主,否则会被 merge 回默认值。
	const calls = []
	const emitted = []
	const saveSrc = extract('const saveRunningRule = React.useCallback((patch) => {') + ', [rpc]);'
	const save = new Function(
		'React', 'runningConfig', 'normalizeRunningConfig', 'emitRunningConfig', 'rpc',
		normalizeSrc + '\n' + saveSrc + '\nreturn saveRunningRule'
	)(
		{ useCallback: (fn) => fn },
		{ enabled: true, includeSubagents: true, headerRing: true },
		(input) => new Function('input', normalizeSrc + '\nreturn normalizeRunningConfig(input)')(input),
		(value) => emitted.push(value),
		{ call: (path, method, options) => { calls.push({ path, method, options }); return Promise.resolve({ ok: true }) } }
	)
	save({ headerRing: false })
	check(calls.length === 1 && calls[0].method === 'iconCustom/setRunningRule', '走的是自己的端点(实际 ' + (calls[0] && calls[0].method) + ')')
	check(calls[0] && calls[0].options.args.request.headerRing === false, '载荷里带着 headerRing=false')
	check(calls[0] && Object.keys(calls[0].options.args.request).sort().join(',') === 'enabled,headerRing,includeSubagents', '三个字段一起发,不会把别的挤掉(实际 ' + (calls[0] ? Object.keys(calls[0].options.args.request).join(',') : '') + ')')
	check(emitted.length === 1 && emitted[0].headerRing === false && emitted[0].enabled === true, '本地先立即生效,且其他开关不受影响')

	const declared = (method) => {
		const invocation = TYPERT.invocations.find((entry) => entry.method === method)
		if (invocation === undefined) throw new Error('清单里没有这个端点: ' + method)
		return invocation
	}
	const setResult = declared('setRunningRule')
	const parsedRequest = setResult.parameters[0].codec.create().parse({ headerRing: false })
	check(parsedRequest.headerRing === false, 'setRunningRule 请求 schema 接受 headerRing')
	const parsedResult = setResult.result.create().parse({ enabled: true, headerRing: false })
	check(parsedResult.headerRing === false, 'setRunningRule 返回 schema 带得出 headerRing(不会被剥掉)')
	const getResult = declared('getRunningRule').result.create().parse({ enabled: true, headerRing: false })
	check(getResult.headerRing === false, 'getRunningRule 返回 schema 带得出 headerRing')

	check(src.includes('checked: running.headerRing !== false'), '设置页复选框默认勾上(缺项即开)')
	check(src.includes('t("headerRingLabel")') && src.includes('hintLine("headerRingHint")'), '设置页控件用上了新文案(选项名 + 圆圈问号浮层)')
	check(/onHeaderRingToggle/.test(src) && /saveRunningRule\(\{ headerRing: checked \}\)/.test(src), '勾选走同一个 saveRunningRule')
}

if (failed > 0) {
	console.error('\n会话头部黄圈测试失败:' + failed + ' 项')
	process.exit(1)
}
console.log('\n会话头部黄圈测试全部通过')
