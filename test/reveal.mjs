// 「点清单条目 → 在侧栏定位到那个会话」的回归测试(0.19.0)。
//
// 锁四件事,每一件坏了都会让这个功能从"帮你找到它"变成"乱动侧栏":
//   * 顺序:行在就滚、不在就展开工作区、展开还不够才点「显示更多」;
//   * 克制:「显示更多」已经展开时**不许点**(那个按钮是开关,点下去等于把读者
//     自己展开的工作区收起来);步数到上限就停手,不许循环点官方控件;
//   * 开关:关掉之后一次 DOM 都不碰(它贴的是官方结构,读者要有退路);
//   * 兜底:任何一步失败都只是"没定位"——打开会话早就完成了,不许抛错。
// 跑法:在仓库根目录 `node test/reveal.mjs`(从 client/client.js 切真实代码,只桩依赖)。

import { readFileSync } from 'node:fs'
import { UNREAD_REVEAL_DEFAULT, normalizeUnreadConfig as hostNormalize } from '../lib/unread.js'

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

// —— 真实代码:那一整块定位逻辑 ——
const region = slice('//#region reveal in sidebar', '\t\t//#endregion', 'reveal region')

/** One shipped row: attributes, a click counter, a scroll counter. */
function makeRow(key, attrs = {}) {
	return {
		key,
		attrs: { 'data-row-key': key, ...attrs },
		clicks: 0,
		scrolled: 0,
		/** Set by a test to model "React commits this after the click". */
		onClick: null,
		getAttribute(name) {
			return Object.prototype.hasOwnProperty.call(this.attrs, name) ? this.attrs[name] : null
		},
		setAttribute(name, value) { this.attrs[name] = String(value) },
		removeAttribute(name) { delete this.attrs[name] },
		click() { this.clicks++; if (this.onClick !== null) this.onClick() },
		scrollIntoView() { this.scrolled++ }
	}
}

/**
 * A reveal run over a fake sidebar.
 *
 * `rows` is the live list of rendered rows, so a test can add the session row from
 * inside a click handler — exactly what the official React tree does on commit.
 */
function makeRunner({ config = { revealOnOpen: true }, rows = [], container = undefined, withRaf = true } = {}) {
	const timers = []
	const styles = []
	const win = {
		clearTimeout: () => {},
		setTimeout: (fn) => { timers.push(fn); return timers.length }
	}
	if (withRaf) win.requestAnimationFrame = (fn) => { fn(); return 1 }
	const doc = {
		head: { appendChild: (node) => styles.push(node) },
		createElement: () => ({ id: '', textContent: '' }),
		getElementById: () => null
	}
	const box = container === undefined
		? { querySelectorAll: (selector) => (selector === '[data-row-key]' ? rows.slice() : []) }
		: container
	const api = new Function(
		'unreadConfig', 'workspaceDotContainer', 'window', 'document',
		region + '\nreturn { revealAction, findRowByKey, revealSessionRow, flashRow, clearRevealFlash, REVEAL_MAX_STEPS, REVEAL_FLASH_ATTR, box: () => revealFlashRow, timer: () => revealFlashTimer };'
	)(config, () => box, win, doc)
	return { api, timers, styles, rows }
}

console.log('— 纯决策:先滚、再展开、再"显示更多",其余一律不动 —')
{
	const runner = makeRunner()
	const action = runner.api.revealAction
	const base = { hasRow: false, hasWorkspace: false, expanded: false, hasOverflow: false, overflowExpanded: false, steps: 0 }
	eq('行已经在 → 滚过去', action({ ...base, hasRow: true }), 'scroll')
	eq('工作区折叠着 → 展开它', action({ ...base, hasWorkspace: true }), 'expand')
	eq('工作区已展开、行还没出现、有"显示更多" → 点它', action({ ...base, hasWorkspace: true, expanded: true, hasOverflow: true }), 'overflow')
	eq('"显示更多"已经是展开态 → 什么都不做(点下去会把读者自己展开的收起来)', action({ ...base, hasWorkspace: true, expanded: true, hasOverflow: true, overflowExpanded: true }), 'give-up')
	eq('步数到上限 → 停手(不许循环点官方控件)', action({ ...base, hasWorkspace: true, steps: runner.api.REVEAL_MAX_STEPS }), 'give-up')
	eq('什么都没有 → 放弃', action(base), 'give-up')
	eq('行在、步数也用光了 → 仍然滚(滚不是点击,不算一步)', action({ ...base, hasRow: true, steps: runner.api.REVEAL_MAX_STEPS }), 'scroll')
}

console.log('— 找行:按值比,前缀相同的 id 不许串行 —')
{
	const rows = [makeRow('session:ab'), makeRow('session:a'), makeRow('workspace:W1'), makeRow('overflow:W1')]
	const runner = makeRunner({ rows })
	check('精确命中 session:a', runner.api.findRowByKey({ querySelectorAll: () => rows }, 'session:a') === rows[1])
	check('认不出 → null', runner.api.findRowByKey({ querySelectorAll: () => rows }, 'session:zzz') === null)
	check('查询本身抛错 → null(不把 DOM 的毛病变成点击的毛病)', runner.api.findRowByKey({ querySelectorAll: () => { throw new Error('boom') } }, 'session:a') === null)
}

console.log('— 执行:折叠的工作区,点开、滚到、闪一下 —')
{
	const wsRow = makeRow('workspace:W1', { 'aria-expanded': 'false' })
	const sessionRow = makeRow('session:s1')
	const rows = [wsRow]
	wsRow.onClick = () => { rows.push(sessionRow) } // React 提交
	const runner = makeRunner({ rows })
	await runner.api.revealSessionRow('s1', 'W1')
	eq('工作区行被点了恰好一次', wsRow.clicks, 1)
	eq('目标行滚进视野', sessionRow.scrolled, 1)
	check('目标行被点亮(attr 挂上了)', sessionRow.getAttribute('data-icon-custom-flash') === '1')
	check('点亮用的是一个会过期的定时器,不是永久 class', runner.timers.length === 1)
	runner.timers[0]()
	check('定时器到点 → 摘掉高亮', sessionRow.getAttribute('data-icon-custom-flash') === null)
	check('摘掉后不再持有那一行(下次不会再去动它)', runner.api.box() === null)
}

console.log('— 执行:行已在 → 一次都不点 —')
{
	const sessionRow = makeRow('session:s1')
	const wsRow = makeRow('workspace:W1', { 'aria-expanded': 'true' })
	const runner = makeRunner({ rows: [wsRow, sessionRow] })
	await runner.api.revealSessionRow('s1', 'W1')
	eq('没有多余的点击', [wsRow.clicks, sessionRow.clicks], [0, 0])
	eq('滚了一次', sessionRow.scrolled, 1)
}

console.log('— 执行:会话被"没展开的显示更多"挡住 → 点它,而不是点工作区 —')
{
	const wsRow = makeRow('workspace:W1', { 'aria-expanded': 'true' })
	const more = makeRow('overflow:W1', { 'aria-expanded': 'false' })
	const sessionRow = makeRow('session:s1')
	const rows = [wsRow, more]
	more.onClick = () => { rows.push(sessionRow) }
	const runner = makeRunner({ rows })
	await runner.api.revealSessionRow('s1', 'W1')
	eq('点的是"显示更多"(工作区本来就是展开的)', [more.clicks, wsRow.clicks], [1, 0])
	eq('滚到了', sessionRow.scrolled, 1)
}

console.log('— 执行:「显示更多」已经展开、行还是不在 → 一个都不点 —')
{
	const more = makeRow('overflow:W1', { 'aria-expanded': 'true' })
	const wsRow = makeRow('workspace:W1', { 'aria-expanded': 'true' })
	const runner = makeRunner({ rows: [wsRow, more] })
	await runner.api.revealSessionRow('s1', 'W1')
	eq('碰都没碰', [more.clicks, wsRow.clicks], [0, 0])
}

console.log('— 执行:开关关掉 → 一次 DOM 都不碰 —')
{
	const wsRow = makeRow('workspace:W1', { 'aria-expanded': 'false' })
	const sessionRow = makeRow('session:s1')
	const runner = makeRunner({ rows: [wsRow, sessionRow], config: { revealOnOpen: false } })
	await runner.api.revealSessionRow('s1', 'W1')
	eq('不点、不滚', [wsRow.clicks, sessionRow.clicks, sessionRow.scrolled], [0, 0, 0])
	check('也没点亮', sessionRow.getAttribute('data-icon-custom-flash') === null)
}

console.log('— 执行:认不出工作区 / 没有侧栏 / 脏输入 → 安静地什么都不做 —')
{
	const sessionRow = makeRow('session:s1')
	const runner = makeRunner({ rows: [makeRow('workspace:W2', { 'aria-expanded': 'false' }), sessionRow] })
	await runner.api.revealSessionRow('s1', '')
	eq('没有 workspaceId:行在就滚(仍然帮到读者)', sessionRow.scrolled, 1)

	const empty = makeRunner({ rows: [], container: null })
	await empty.api.revealSessionRow('s1', 'W1')
	check('没有侧栏容器 → 不炸、也不留下高亮', empty.api.box() === null)
	const dirty = makeRunner({ rows: [] })
	await dirty.api.revealSessionRow(null, 'W1')
	await dirty.api.revealSessionRow('', null)
	check('脏输入 → 不炸', dirty.api.box() === null)
	const broken = makeRunner({ rows: [], container: { querySelectorAll: () => { throw new Error('boom') } } })
	await broken.api.revealSessionRow('s1', 'W1')
	check('DOM 抛错 → 咽掉(打开会话早就完成了)', broken.api.box() === null)
}

console.log('— 执行:步数有上限,不许把官方按钮当跑步机 —')
{
	const wsRow = makeRow('workspace:W1', { 'aria-expanded': 'false' })
	const more = makeRow('overflow:W1', { 'aria-expanded': 'false' })
	// 每次点击都把"工作区"重新折叠、把行藏起来:永远找不到目标。
	wsRow.onClick = () => {}
	more.onClick = () => {}
	const rows = [wsRow, more]
	const runner = makeRunner({ rows })
	await runner.api.revealSessionRow('s1', 'W1')
	const clicks = wsRow.clicks + more.clicks
	check('点击数不超过上限(' + clicks + ' ≤ ' + runner.api.REVEAL_MAX_STEPS + ')', clicks <= runner.api.REVEAL_MAX_STEPS)
	check('明确停手过(不是死循环)', clicks >= 1)
}

console.log('— 接线:开关、传参、卸载清理,一个都不能漏 —')
{
	check('面板把整行交给打开逻辑(定位需要 workspaceId)', src.includes('props.onOpen(item)') && !src.includes('props.onOpen(item.id)'))
	check('打开会话后调用定位', src.includes('revealSessionRow(id, workspaceId)'))
	check('设置页有这一项', src.includes('onRevealToggle(event.target.checked === true)') && src.includes('checked: unread.revealOnOpen !== false'))
	const settingsAt = src.indexOf('onRevealToggle = React.useCallback')
	check('开关走同一个保存路径(不新增端点)', settingsAt > 0 && src.slice(settingsAt, settingsAt + 200).includes('saveUnreadRule({ revealOnOpen: checked })'))
	const unloadAt = src.indexOf('"dsh-icon-custom: workspace dots"')
	check('插件卸载时摘掉高亮(不许留在官方行上)', unloadAt > 0 && src.slice(Math.max(0, unloadAt - 700), unloadAt).includes('clearRevealFlash();'))
	// 真跑一遍保存路径。宿主是"整份替换",所以本地关掉的开关必须**跟着 payload 走**,
	// 否则刷新之后宿主拿默认值把它又打开 —— 这是最难查的一类静默失效。
	{
		const reasonsAt = src.indexOf('const UNREAD_FALLBACK_REASONS =')
		const appAt = src.indexOf('const UNREAD_APP_BADGE_FALLBACK =')
		const revealAt = src.indexOf('const UNREAD_REVEAL_FALLBACK =')
		const normalizeSrc = [
			src.slice(reasonsAt, src.indexOf(';', reasonsAt) + 1),
			src.slice(appAt, src.indexOf(';', appAt) + 1),
			src.slice(revealAt, src.indexOf(';', revealAt) + 1),
			extract('function normalizeClearDelay(input) {'),
			extract('function normalizeUnreadConfig(input) {')
		].join('\n')
		const body = slice('const saveUnreadRule = React.useCallback((patch) => {', ', [rpc]);', 'saveUnreadRule') + ', [rpc]);'
		const sent = []
		const save = new Function('React', 'unreadConfig', 'emitUnreadConfig', 'rpc',
			normalizeSrc + '\n' + body + '\nreturn saveUnreadRule;'
		)(
			{ useCallback: (fn) => fn },
			{ reasons: {}, pending: true, workspaceDot: true, appBadge: true, clearDelaySec: 0, revealOnOpen: true },
			() => {},
			{ call: (path, method, options) => { sent.push(options.args.request); return Promise.resolve({ ok: true }) } }
		)
		save({ revealOnOpen: false })
		eq('关掉开关时,发给宿主的那份带着 revealOnOpen=false', sent.length === 1 ? sent[0].revealOnOpen : 'no-call', false)
		eq('其它字段照旧一起发(宿主是整份替换,不是打补丁)', sent.length === 1 ? Object.keys(sent[0]).sort().join(',') : 'no-call', 'appBadge,clearDelaySec,pending,reasons,revealOnOpen,workspaceDot')
	}
}

console.log('— 宿主默认值:老配置也能读出这一项 —')
{
	eq('lib 默认开', UNREAD_REVEAL_DEFAULT, true)
	eq('缺项 → 开', hostNormalize({}).revealOnOpen, true)
	eq('null → 开', hostNormalize(null).revealOnOpen, true)
	eq('用户关掉 → 关', hostNormalize({ revealOnOpen: false }).revealOnOpen, false)
	eq('脏值 → 回默认', hostNormalize({ revealOnOpen: 'yes' }).revealOnOpen, true)
}

console.log(`\n结果: ${pass} 通过 · ${fail} 失败`)
process.exit(fail > 0 ? 1 : 0)
