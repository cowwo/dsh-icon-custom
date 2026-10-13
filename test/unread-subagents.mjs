// 「子代理引起的未读」开关(unreadIncludeSubagents,0.20.0)。
//
// 锁三件事:
//   * 开关**开**(默认,缺项/脏值也是开)→ 判定与加这一项之前逐字相同;
//   * 开关**关** → 只屏蔽"这一轮是子代理把我叫醒的"那种未读,人自己发起的照旧;
//   * 归属在**宿主折叠**里算出来(不靠客户端猜时间戳),所以拨开关永远不用重折日志。
//
// 跑法:在仓库根目录 `node test/unread-subagents.mjs`。
// 客户端那半从 client/client.js 切真实代码(和 unread-clear.mjs / reveal.mjs 同一手法),
// 所以测的是即将发布的代码本身。

import { readFileSync } from 'node:fs'
import {
	UNREAD_INCLUDE_SUBAGENTS_DEFAULT,
	applyLastTurnEnd,
	initLastTurnEnd,
	isSubagentWakeSource,
	lastTurnEndStateSchema,
	lastTurnEndView,
	lastTurnEndViewSchema,
	normalizeUnreadConfig
} from '../lib/unread.js'

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
function eq(name, got, want) {
	const ok = JSON.stringify(got) === JSON.stringify(want)
	if (!ok) {
		failed++
		console.log('  ✗ ' + name + '\n      期望=' + JSON.stringify(want) + '\n      实际=' + JSON.stringify(got))
		return
	}
	console.log('  ✓ ' + name)
}

// ---------------------------------------------------------------------------
// 1. 宿主折叠:这一轮是谁叫醒的
// ---------------------------------------------------------------------------

const message = (kind) => ({ type: 'user/message', time: 0, data: { role: 'user', source: { kind } } })
const start = () => ({ type: 'turn/start', time: 0, data: { turn: 1 } })
const ended = (time, kind = 'completed') => ({ type: 'turn/end', time, data: { turn: 1, reason: { kind } } })
const fold = (...events) => events.reduce((state, event) => applyLastTurnEnd(state, event), initLastTurnEnd())

console.log('1. 来源判定:只有官方那两种"子代理在说话"算')
{
	check(isSubagentWakeSource({ source: { kind: 'subagent-settled' } }) === true, 'subagent-settled(结算通知)→ 子代理')
	check(isSubagentWakeSource({ source: { kind: 'agent-message' } }) === true, 'agent-message(send_message)→ 子代理')
	check(isSubagentWakeSource({ source: { kind: 'user' } }) === false, 'user(人在输入框里说话)→ 不是')
	check(isSubagentWakeSource({ source: { kind: 'skill-invocation' } }) === false, 'skill-invocation → 不是')
	check(isSubagentWakeSource({}) === false && isSubagentWakeSource(null) === false, '缺消息 / null → 不是(不猜)')
}

console.log('2. 人自己发起的一轮:归属不变,red 点照旧')
{
	const state = fold(start(), message('user'), message('agent-instructions'), ended(1000))
	eq('endAt / reason 和以前一模一样', [state.endAt, state.reason], [1000, 'completed'])
	eq('不是子代理引起', lastTurnEndView(state).subagentCaused, false)
}

console.log('3. 子代理结算唤醒的一轮:折出 subagentCaused')
{
	const settled = fold(start(), message('subagent-settled'), ended(2000))
	eq('subagent-settled 唤醒 → 归属子代理', lastTurnEndView(settled).subagentCaused, true)
	const relay = fold(start(), message('agent-message'), ended(2000))
	eq('send_message(agent-message)唤醒 → 归属子代理', lastTurnEndView(relay).subagentCaused, true)
	eq('旧字段一个不少', lastTurnEndView(settled).reason, 'completed')
	eq('视图形状:caused 是严格的布尔(客户端只认 true)', [typeof lastTurnEndView(relay).subagentCaused], ['boolean'])
}

console.log('4. 第一票定终身:人发起的一轮里子代理中途插话,不改归属')
{
	const state = fold(start(), message('user'), ended(500, 'aborted'), { type: 'assistant/message', time: 0, data: {} })
	check(state.endAt === 500 && state.subagentCaused === false, '中间夹一条无关事件:状态照旧')
	const steer = fold(start(), message('user'), message('subagent-settled'), ended(600))
	eq('人先说话 + 子代理 steer 进来 → 仍归人', lastTurnEndView(steer).subagentCaused, false)
	const answer = fold(start(), message('subagent-settled'), message('user'), ended(700))
	eq('子代理先说话 + 人补一句 → 仍归子代理', lastTurnEndView(answer).subagentCaused, true)
}

console.log('5. 每一轮重新投票(turn/start 清掉上一轮的归属)')
{
	let state = fold(start(), message('subagent-settled'), ended(1000))
	state = applyLastTurnEnd(state, start())
	state = applyLastTurnEnd(state, message('user'))
	state = applyLastTurnEnd(state, ended(2000))
	eq('下一轮是人发起的 → 归属翻过来', lastTurnEndView(state).subagentCaused, false)
	state = applyLastTurnEnd(state, start())
	state = applyLastTurnEnd(state, message('subagent-settled'))
	state = applyLastTurnEnd(state, ended(3000))
	eq('再下一轮是子代理 → 又翻回去', lastTurnEndView(state).subagentCaused, true)
	eq('最后一轮的 endAt 是新的', lastTurnEndView(state).endAt, 3000)
}

console.log('6. 契约:无关事件原样返回同一个引用(零下游工作)')
{
	const state = fold(start(), message('user'), ended(1000))
	check(applyLastTurnEnd(state, { type: 'tool/result', time: 0, data: {} }) === state, 'tool/result → 同一个 state')
	check(applyLastTurnEnd(state, { type: 'turn/start', time: 0, data: {} }) === state, '没有待定归属的 turn/start → 同一个 state')
	const voted = applyLastTurnEnd(state, message('user'))
	check(applyLastTurnEnd(voted, message('subagent-settled')) === voted, '已经投过票的第二条消息 → 同一个 state')
	check(applyLastTurnEnd(null, ended(1)).endAt === 1, '脏入参(null)不炸,照样折')
}

console.log('7. 老检查点 / 老视图:缺这一项按"不是子代理引起"读')
{
	const legacy = { endAt: 1000, reason: 'completed' }
	check(lastTurnEndStateSchema.safeParse(legacy).success, 'v1 检查点照样过 state schema')
	eq('老检查点 → caused=false', lastTurnEndView(legacy).subagentCaused, false)
	check(lastTurnEndViewSchema.safeParse(lastTurnEndView(legacy)).success, '上线载荷过 view schema')
	check(!lastTurnEndViewSchema.safeParse({ endAt: 1, reason: null }).success, '载荷少了 caused 就不合法(客户端读得到真值)')
	const restored = lastTurnEndStateSchema.parse({ endAt: 1000, reason: 'completed', subagentCaused: true, wakeSubagent: null })
	check(applyLastTurnEnd(restored, { type: 'assistant/message', time: 0, data: {} }) === restored, '检查点还原后仍是纯函数')
}

// ---------------------------------------------------------------------------
// 2. 宿主设置:默认开,脏值也不许把开关拨到"关"
// ---------------------------------------------------------------------------

console.log('8. 宿主归一化:缺项 / 脏值 → 开')
{
	eq('lib 默认 = true', UNREAD_INCLUDE_SUBAGENTS_DEFAULT, true)
	eq('缺项 → 开', normalizeUnreadConfig({}).unreadIncludeSubagents, true)
	eq('null → 开', normalizeUnreadConfig(null).unreadIncludeSubagents, true)
	eq('字符串 → 开(不把 "no" 当真)', normalizeUnreadConfig({ unreadIncludeSubagents: 'no' }).unreadIncludeSubagents, true)
	eq('明确关掉 → 关', normalizeUnreadConfig({ unreadIncludeSubagents: false }).unreadIncludeSubagents, false)
	eq('明确打开 → 开', normalizeUnreadConfig({ unreadIncludeSubagents: true }).unreadIncludeSubagents, true)
	eq('老配置(整份都没有这一项,其余字段齐全)照旧', Object.keys(normalizeUnreadConfig({ reasons: {}, pending: false, workspaceDot: false })).sort().join(','),
		'appBadge,clearDelaySec,pending,reasons,revealOnOpen,unreadIncludeSubagents,workspaceDot')
}

// ---------------------------------------------------------------------------
// 3. 客户端:初始值 / 归一化 / 保存路径
// ---------------------------------------------------------------------------

const reasonsAt = src.indexOf('const UNREAD_FALLBACK_REASONS =')
const badgeAt = src.indexOf('const UNREAD_APP_BADGE_FALLBACK =')
const revealAt = src.indexOf('const UNREAD_REVEAL_FALLBACK =')
const normalizeSrc = [
	src.slice(reasonsAt, src.indexOf(';', reasonsAt) + 1),
	src.slice(badgeAt, src.indexOf(';', badgeAt) + 1),
	src.slice(revealAt, src.indexOf(';', revealAt) + 1),
	extract('function normalizeClearDelay(input) {'),
	extract('function normalizeUnreadConfig(input) {')
].join('\n')
const clientNormalize = new Function(normalizeSrc + '\nreturn normalizeUnreadConfig')()

console.log('9. 客户端归一化:老宿主没有这个字段 → 开')
{
	eq('空对象 → 开', clientNormalize({}).unreadIncludeSubagents, true)
	eq('null(首屏还没拿到宿主响应)→ 开', clientNormalize(null).unreadIncludeSubagents, true)
	eq('老宿主响应里没有这一项 → 开', clientNormalize({ reasons: {}, pending: true, workspaceDot: true, clearDelaySec: 0 }).unreadIncludeSubagents, true)
	eq('脏值 true 以外的怪值 → 开', clientNormalize({ unreadIncludeSubagents: 1 }).unreadIncludeSubagents, true)
	eq('用户关掉 → 保持关', clientNormalize({ unreadIncludeSubagents: false }).unreadIncludeSubagents, false)
	eq('初始值(还没跟宿主说过话)也是开', /unreadIncludeSubagents:\s*UNREAD_INCLUDE_SUBAGENTS_FALLBACK/.test(src), true)
	eq('镜像常量取自宿主默认', /const UNREAD_INCLUDE_SUBAGENTS_FALLBACK = true/.test(src), true)
}

console.log('10. 保存路径:关掉之后必须跟着 payload 走(宿主是整份替换)')
{
	const body = slice('const saveUnreadRule = React.useCallback((patch) => {', ', [rpc]);', 'saveUnreadRule') + ', [rpc]);'
	const sent = []
	const save = new Function('React', 'unreadConfig', 'emitUnreadConfig', 'rpc',
		normalizeSrc + '\n' + body + '\nreturn saveUnreadRule;'
	)(
		{ useCallback: (fn) => fn },
		{ reasons: {}, pending: true, workspaceDot: true, appBadge: true, clearDelaySec: 0, revealOnOpen: true, unreadIncludeSubagents: true },
		() => {},
		{ call: (path, method, options) => { sent.push(options.args.request); return Promise.resolve({ ok: true }) } }
	)
	save({ unreadIncludeSubagents: false })
	eq('关掉开关时,发给宿主的那份带着 unreadIncludeSubagents=false', sent.length === 1 ? sent[0].unreadIncludeSubagents : 'no-call', false)
	eq('老字段一个都没漏(其余字段照旧一起发)', sent.length === 1 ? Object.keys(sent[0]).sort().join(',') : 'no-call',
		'appBadge,clearDelaySec,pending,reasons,revealOnOpen,unreadIncludeSubagents,workspaceDot')
}

console.log('11. 设置页接线 + 中英文案')
{
	check('设置页有这个复选框', src.includes('onIncludeSubagentsToggle(event.target.checked === true)') && src.includes('checked: unread.unreadIncludeSubagents !== false'))
	const toggleAt = src.indexOf('onIncludeSubagentsToggle = React.useCallback')
	check('开关走同一个保存路径(不新增端点)', toggleAt > 0 && src.slice(toggleAt, toggleAt + 240).includes('saveUnreadRule({ unreadIncludeSubagents: checked })'))
	check('zh 有文案', src.includes('unreadIncludeSubagentsLabel: "子代理引起的结束也算未读"'))
	check('en 有文案', src.includes('unreadIncludeSubagentsLabel: "Count sub-agent activity as unread"'))
}

// ---------------------------------------------------------------------------
// 4. 客户端判定:collectUnread
// ---------------------------------------------------------------------------

const collectSrc = slice('function sessionWhereOf(entry) {', '\n\t\t//#endregion', 'sessionWhereOf + collectUnread')
const collectUnread = new Function('LAST_TURN_END_KEY', collectSrc + '\nreturn collectUnread')('lastTurnEnd')

/** 一条会话行:`caused` 为 undefined 表示"老投影,没有这一项"。 */
function row(id, endAt, opts = {}) {
	const value = { endAt, reason: opts.reason ?? 'completed' }
	if (opts.caused !== undefined) value.subagentCaused = opts.caused
	return [id, { id, origin: opts.origin ?? 'local', displayTitle: id, projectionValues: { lastTurnEnd: value } }]
}
function listOf(...rows) {
	const byId = Object.fromEntries(rows)
	return { ids: Object.keys(byId), byId }
}
const SEEN = { human: 0, sub: 0, relay: 0, old: 0, busy: 0 }
const ON = { reasons: { completed: true }, pending: false, unreadIncludeSubagents: true }
const OFF = { reasons: { completed: true }, pending: false, unreadIncludeSubagents: false }
const ids = (hits) => hits.map((hit) => hit.id).sort().join(',')

console.log('12. 开关开:与加这一项之前逐字相同')
{
	const list = listOf(
		row('human', 1000, { caused: false }),
		row('sub', 2000, { caused: true }),
		row('relay', 3000, { caused: true }),
		row('old', 4000),
		row('child', 5000, { origin: 'subagent', caused: true })
	)
	eq('开 → 子代理引起的照样亮', ids(collectUnread(list, null, ON, SEEN)), 'human,old,relay,sub')
	eq('子代理自己的会话行永远不算(不受这一项影响)', collectUnread(list, null, ON, SEEN).some((h) => h.id === 'child'), false)
	eq('数字与清单条目一致', collectUnread(list, null, ON, SEEN).length, 4)
	eq('条目里的 kind / at 没被动过', collectUnread(list, null, ON, SEEN).find((h) => h.id === 'relay'), { id: 'relay', title: 'relay', where: '', waiting: false, kind: 'completed', at: 3000 })
}

console.log('13. 开关关:只屏蔽"子代理引起的",其余一根汗毛都不动')
{
	const list = listOf(
		row('human', 1000, { caused: false }),
		row('sub', 2000, { caused: true }),
		row('relay', 3000, { caused: true }),
		row('old', 4000)
	)
	eq('关 → 子代理引起的两颗都灭', ids(collectUnread(list, null, OFF, SEEN)), 'human,old')
	eq('人发起的那一轮照旧亮,时间/原因不变', collectUnread(list, null, OFF, SEEN).find((h) => h.id === 'human').at, 1000)
	eq('老投影(没有这一项)当成"不是子代理"照旧亮', collectUnread(list, null, OFF, SEEN).some((h) => h.id === 'old'), true)
	eq('只是不显示,水位线一个字节都没动', SEEN, { human: 0, sub: 0, relay: 0, old: 0, busy: 0 })
	// 已经亮着的点:这一项是用户主动说"这类消息我不要",所以照灭(与下面的
	// "原因开关不灭已亮的点"不同 —— 那条保护的是词表变化,不是用户的意思)。
	eq('关掉时,已经亮着的子代理点也会灭(其余照旧)', ids(collectUnread(list, null, OFF, SEEN, new Set(['sub', 'human']))), 'human,old')
	// 其它原因开关照旧生效:关掉 completed 之后,人的那一轮也不亮了。
	const offReason = { reasons: { completed: false }, pending: false, unreadIncludeSubagents: false }
	eq('原因开关与这一项互不干扰', ids(collectUnread(list, null, offReason, SEEN)), '')
}

console.log('14. 缺省配置 → 视为开(老宿主 / 老配置 / 脏配置)')
{
	const list = listOf(row('sub', 2000, { caused: true }), row('human', 1000, { caused: false }))
	eq('config 里没有这一项', ids(collectUnread(list, null, { reasons: { completed: true }, pending: false }, SEEN)), 'human,sub')
	eq('null config(首屏):原因表为空,和以前一样什么都不亮', ids(collectUnread(list, null, null, SEEN)), '')
	eq('脏值(字符串/数字)按开处理', ids(collectUnread(list, null, { reasons: { completed: true }, pending: false, unreadIncludeSubagents: 'no' }, SEEN)), 'human,sub')
	eq('明确 false 才关', ids(collectUnread(list, null, { reasons: { completed: true }, pending: false, unreadIncludeSubagents: false }, SEEN)), 'human')
}

console.log('15. "有人在等我"是另一件事:这一项不许把它一起屏蔽')
{
	const list = listOf(row('busy', 2000, { caused: true }))
	const pending = new Map([['busy', { kind: 'approval' }]])
	const hits = collectUnread(list, pending, { reasons: { completed: true }, pending: true, unreadIncludeSubagents: false }, SEEN)
	eq('子代理引起的回合结束被屏蔽,但"在等你审批"仍然在', hits.length, 1)
	eq('而且标成 waiting(不是 ended)', [hits[0].waiting, hits[0].kind], [true, 'approval'])
}

if (failed > 0) {
	console.error('\n子代理未读开关测试失败:' + failed + ' 项')
	process.exit(1)
}
console.log('\n子代理未读开关测试全部通过')
