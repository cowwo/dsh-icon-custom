// 「进行中」清单(点黄数字打开)的回归测试(0.19.0)。
//
// 锁五件事,每一件坏了都会让这个清单变成新的谎话:
//   * 黄数字点开的是"进行中"那份,标题/空态/行都不是"待处理"那份;
//   * 名单必须跟着 running 变 —— 尤其是"数量没变、但换了一个会话在跑"(1 → 1):
//     只比数字的守卫会留下一个**已经停了**的会话名,而数字和标签页图标看着都对;
//   * 两个清单共用一块面板:开一个必然关另一个(两个数字在同一行,叠起来就是两层);
//   * 进行中清单里没有任何可"确认已读"的行 —— 它不许碰已读水位线;
//   * 副标题不编造时间:官方没有"开跑时刻"这个事实,插件不猜。
// 跑法:在仓库根目录 `node test/running-panel.mjs`(从 client/client.js 切真实代码,只桩依赖)。

import { readFileSync } from 'node:fs'
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

let pass = 0
let fail = 0
const check = (name, ok, detail) => {
	ok ? pass++ : fail++
	console.log((ok ? '  ✓ ' : '  ✗ ') + name + (ok || detail === undefined ? '' : '  ← ' + detail))
}
const eq = (name, got, want) => check(name, JSON.stringify(got) === JSON.stringify(want), '期望 ' + JSON.stringify(want) + ' / 实际 ' + JSON.stringify(got))

/** 记录用到的 key,替代真的 t():验证"选了哪个 key"而不是文案本身。 */
const keyT = (key, params) => (params && typeof params.n === 'number' ? key + ':' + params.n : key)

// —— 真实代码:清单第二行 ——
const subtitle = new Function(
	extract('function shortSessionId(id) {') + '\n' +
	extract('function runningRowSubtitle(item, t) {') + '\n' +
	'return { shortSessionId, runningRowSubtitle }'
)()

console.log('— 第二行:说清"在跑"和"是哪条",但不编造时间 —')
eq('短号 + 状态', subtitle.runningRowSubtitle({ id: 'session-e5dd6444-20b9-49d6-b25f-fa8362455367' }, keyT), 'runningPanelRow · e5dd6444')
eq('没有 id 就只留状态', subtitle.runningRowSubtitle({ id: '' }, keyT), 'runningPanelRow')
check('不出现任何时间档(官方没有"开跑时刻",不许猜)', !/age/.test(subtitle.runningRowSubtitle({ id: 'session-abcdefgh' }, keyT)), subtitle.runningRowSubtitle({ id: 'session-abcdefgh' }, keyT))
check('形状和"待处理"清单一致(都是 状态 · 短号)', subtitle.runningRowSubtitle({ id: 'session-abcdefgh' }, keyT).includes(' · '))

// —— 真实代码:徽标桥上的 running 名单 ——
const bridgeSrc = [
	extract('function normalizeCount(value) {'),
	extract('function runningItemsSignature(items) {'),
	extract('function emitRunningState(value, items) {')
].join('\n')
/** A bridge with its own state, so a test can drive it directly. */
function makeBridge() {
	return new Function(`
		let runningTotal = 0;
		let runningItems = [];
		const pokes = [];
		function notifyBadge() { pokes.push(1); }
		${bridgeSrc}
		return {
			emitRunningState, runningItemsSignature, normalizeCount,
			state: () => ({ runningTotal, runningItems, pokes: pokes.length })
		};
	`)()
}

console.log('— 名单守卫:数量没变但换了会话,也必须重新通知 —')
{
	const bridge = makeBridge()
	const a = { id: 'session-aaaa1111', title: '甲', where: 'w1' }
	const b = { id: 'session-bbbb2222', title: '乙', where: 'w1' }
	bridge.emitRunningState(1, [a])
	eq('第一次:记下数字与名单', bridge.state(), { runningTotal: 1, runningItems: [a], pokes: 1 })
	bridge.emitRunningState(1, [a])
	eq('原样再来一次:不打扰任何人(否则每次都重画图标)', bridge.state().pokes, 1)
	bridge.emitRunningState(1, [b])
	eq('数量还是 1、但换了一个会话:必须重新通知', bridge.state(), { runningTotal: 1, runningItems: [b], pokes: 2 })
	bridge.emitRunningState(1, [{ ...b, title: '乙(改名)' }])
	eq('标题变了也算变(清单上写的就是标题)', bridge.state().pokes, 3)
	bridge.emitRunningState(2, [b, a])
	eq('数量变了:通知,名单跟着走', bridge.state().runningItems.length, 2)
	eq('顺序也是名单的一部分(侧栏顺序变了就该重画)', bridge.runningItemsSignature([a, b]) === bridge.runningItemsSignature([b, a]), false)
	bridge.emitRunningState(0, null)
	eq('没有在跑:数字归零、名单清空', bridge.state(), { runningTotal: 0, runningItems: [], pokes: 5 })
	eq('脏项被忽略、不炸', bridge.runningItemsSignature([null, 'x', a]).length > 0, true)
	eq('全脏 → 空签名', bridge.runningItemsSignature([null, 'x']), '')
	eq('脏数字 → 0', bridge.normalizeCount('x'), 0)
}

console.log('— 桥上的快照:两份名单各归各的 —')
{
	const snapshotOf = new Function(
		'effectiveCount', 'badgeSize', 'badgeSource', 'realItems', 'runningTotal', 'runningItems',
		extract('function badgeSnapshot() {') + '\nreturn badgeSnapshot'
	)
	const rows = [{ id: 'session-aaaa1111', title: '甲', where: 'w1' }]
	const real = snapshotOf(() => 3, 'md', 'real', [{ id: 'session-zzzz' }], 1, rows)()
	eq('真实源:未读清单 + 进行中名单都在', { count: real.count, items: real.items.length, running: real.running, runningItems: real.runningItems }, { count: 3, items: 1, running: 1, runningItems: rows })
	const manual = snapshotOf(() => 7, 'md', 'manual', [{ id: 'session-zzzz' }], 1, rows)()
	eq('手动测试数字只动未读那份,不动进行中名单', { count: manual.count, items: manual.items, runningItems: manual.runningItems }, { count: 7, items: [], runningItems: rows })
}

// —— 真实代码:那块共用的面板 ——
const storeSrc = slice('let panelMode = null;', '\t\t/**\n\t\t * Tells the badge source that the marks moved somewhere it did not touch', 'panel store')
function makeStore() {
	return new Function(storeSrc + '\nreturn { emitPanel, subscribePanel, togglePanel, read: () => ({ mode: panelMode, anchor: panelAnchor }) };')()
}

console.log('— 一块面板、两种模式:开一个必然关另一个 —')
{
	const store = makeStore()
	let notified = 0
	store.subscribePanel(() => { notified++ })
	eq('初始:没有清单开着', store.read().mode, null)
	store.emitPanel('unread')
	eq('点红数字 → 待处理', store.read().mode, 'unread')
	store.emitPanel('running', { left: 1, top: 2, bottom: 3 })
	eq('点黄数字 → 进行中(切换,而不是两层叠着)', store.read().mode, 'running')
	eq('锚点跟着被点的那个节点走(面板才知道往哪儿弹)', store.read().anchor, { left: 1, top: 2, bottom: 3 })
	store.emitPanel('running')
	eq('再点同一个:还是开着(重复 emit 不该关自己)', store.read().mode, 'running')
	store.emitPanel(null)
	eq('关闭', store.read().mode, null)
	store.emitPanel('junk')
	eq('不认识的模式 → 当作关闭(不许弄出一个没内容的空壳)', store.read().mode, null)
	eq('订阅者每次都收到通知', notified, 5)
}
{
	const store = makeStore()
	store.togglePanel('running')
	eq('开关一下:打开进行中', store.read().mode, 'running')
	store.togglePanel('running')
	eq('再开关一下:关掉', store.read().mode, null)
	store.emitPanel('unread')
	store.togglePanel('running')
	eq('待处理开着时点黄数字:换成进行中(不是两个都开)', store.read().mode, 'running')
	store.togglePanel('unread')
	eq('反过来一样:换成待处理', store.read().mode, 'unread')
}

// —— 真实面板:两种模式各取各的名单,运行模式不许碰已读 ——
const popup = slice('function HeaderPopup(props) {', '\t\t/**\n\t\t * The two brand-mark pill sizes.', 'HeaderPopup')
console.log('— 面板本体:模式决定标题、名单与"能不能确认" —')
check('进行中模式读的是桥上的 runningItems', popup.includes('snapshot.runningItems'), '没找到 snapshot.runningItems')
check('标题与空态各有一套 running 文案', popup.includes('"runningPanelTitle"') && popup.includes('"runningPanelEmpty"'))
check('行内容按模式二选一(进行中不带时间)', popup.includes('running ? runningRowSubtitle(item, t) : unreadRowSubtitle(item, hostNow(), t)'))
check('进行中模式没有任何可确认的行(不许动已读水位线)', popup.includes('const ackTargets = running ? [] : unreadAckTargets(items);'))
check('两个模式的开关都走同一块面板(点外面/Esc 只关这一次)', popup.includes('emitPanel(null)') && !popup.includes('emitUnreadPanel'))
check('面板根节点有自家标记(点面板内部不该被当成"点外面")', popup.includes('"data-icon-custom-panel": "1"'))

// —— 真实字典:两种语言都要有新文案 ——
function dict(name, endMarker) {
	const body = slice('const ' + name + ' = {', endMarker, name + ' 字典')
	const literal = body
		.replace('const ' + name + ' = ', '')
		.replace(/;\s*$/, '')
		.replace(/\/\*\*[\s\S]*?\*\//g, '')
		.replace(/\/\/[^\n]*/g, '')
	return new Function('return (' + literal + ')')()
}
const zh = dict('zh', '\t\tconst en = {')
const en = dict('en', '\t\t//#endregion')

console.log('— 字典:中英都有这四条 —')
for (const key of ['runningPanelTitle', 'runningPanelEmpty', 'runningPanelTrigger', 'runningPanelRow']) {
	check('zh 有 ' + key, typeof zh[key] === 'string' && zh[key] !== '', JSON.stringify(zh[key]))
	check('en 有 ' + key, typeof en[key] === 'string' && en[key] !== '', JSON.stringify(en[key]))
}
check('触发标签带 {n} 占位符(中英一致)', zh.runningPanelTrigger.includes('{n}') && en.runningPanelTrigger.includes('{n}'))
check('标题不叫"待处理"(两份清单不能同名)', zh.runningPanelTitle !== zh.unreadPanelTitle && en.runningPanelTitle !== en.unreadPanelTitle)
check('"没在跑"的说法和"没待处理"的说法不同', zh.runningPanelEmpty !== zh.unreadPanelEmpty && en.runningPanelEmpty !== en.unreadPanelEmpty)

console.log(`\n结果: ${pass} 通过 · ${fail} 失败`)
process.exit(fail > 0 ? 1 : 0)
