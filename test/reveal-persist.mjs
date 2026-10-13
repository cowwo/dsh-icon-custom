// 「点清单定位」开关(revealOnOpen)的持久化回归。
//
// 锁的是一个真实缺陷:宿主 `lib/index.js` 的 `_unreadRuleView()` 没把
// `revealOnOpen` 放进返回对象,而 typert 响应 schema 声明了它。后果不是"开关
// 没反应"——本地拨动照常生效——而是**刷新页面后自己变回开**:客户端拿到缺项的
// 响应,`normalizeUnreadConfig` 按缺项回落 true(旧宿主兼容逻辑),把用户的
// "关"覆盖掉。存储里其实一直是 false,只有下发漏了。
//
// 跑法:在仓库根目录 `node test/reveal-persist.mjs`。
// 不启真宿主,从真实代码切两半(和 test/unread-subagents.mjs 同一手法):
//   * 宿主半:lib/index.js 的 getUnreadRule / setUnreadRule / _unreadRuleView,
//     绑一个只有 unread / seen / _saveUnread 的假实例(这三处正是它们用到的全部);
//   * 客户端半:client/client.js 的 normalizeUnreadConfig,模拟"刷新后拿响应重建配置"。
// 校验字段清单直接来自真实 typert 清单里 getUnreadRule 的响应 schema,不手抄类型。

import { readFileSync } from 'node:fs'
import { TYPERT } from '../lib/typert.host.js'
import { UNREAD_REVEAL_DEFAULT, normalizeUnreadConfig } from '../lib/unread.js'

const hostSrc = readFileSync('lib/index.js', 'utf8')
const clientSrc = readFileSync('client/client.js', 'utf8')

function extract(src, marker) {
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
// 真实代码:宿主那三个方法,绑在假实例上(不 import index.js,免得拉起 cordis/jimp)
// ---------------------------------------------------------------------------

const hostProto = new Function(
	'normalizeUnreadConfig',
	'return ({ ' + [
		extract(hostSrc, 'async getUnreadRule() {'),
		extract(hostSrc, 'async setUnreadRule(request) {'),
		extract(hostSrc, '_unreadRuleView() {')
	].join(',') + ' })'
)(normalizeUnreadConfig)

/** A host with just the fields those three methods touch. */
function makeHost(input = null, seen = {}) {
	const host = Object.create(hostProto)
	host.unread = normalizeUnreadConfig(input)
	host.seen = seen
	host._saveUnread = async () => {}
	return host
}

// ---------------------------------------------------------------------------
// 真实代码:客户端归一化 + 客户端保存路径(与 unread-subagents.mjs 同一切法)
// ---------------------------------------------------------------------------

const reasonsAt = clientSrc.indexOf('const UNREAD_FALLBACK_REASONS =')
const badgeAt = clientSrc.indexOf('const UNREAD_APP_BADGE_FALLBACK =')
const revealAt = clientSrc.indexOf('const UNREAD_REVEAL_FALLBACK =')
const clientNormalizeSrc = [
	clientSrc.slice(reasonsAt, clientSrc.indexOf(';', reasonsAt) + 1),
	clientSrc.slice(badgeAt, clientSrc.indexOf(';', badgeAt) + 1),
	clientSrc.slice(revealAt, clientSrc.indexOf(';', revealAt) + 1),
	extract(clientSrc, 'function normalizeClearDelay(input) {'),
	extract(clientSrc, 'function normalizeUnreadConfig(input) {')
].join('\n')
const clientNormalize = new Function(clientNormalizeSrc + '\nreturn normalizeUnreadConfig')()

// ---------------------------------------------------------------------------
// 字段清单:直接读真实 typert 响应 schema,不手抄
// ---------------------------------------------------------------------------

const invocation = TYPERT.invocations.find((entry) => entry.method === 'getUnreadRule')
if (invocation === undefined) throw new Error('清单里没有 getUnreadRule')
const responseSchema = invocation.result.create()
const declared = Object.keys(responseSchema.shape)
const EXPECTED_FIELDS = ['reasons', 'pending', 'workspaceDot', 'appBadge', 'clearDelaySec', 'revealOnOpen', 'unreadIncludeSubagents', 'hostNow', 'seen']

console.log('1. 字段清单:以 typert 响应 schema 为准')
{
	eq('schema 声明的字段 = 本测试逐字段核对的清单', declared.slice().sort().join(','), EXPECTED_FIELDS.slice().sort().join(','))
}

console.log('2. 默认(缺项)→ revealOnOpen true,且视图过 schema')
{
	const host = makeHost(null, { s1: 123 })
	const view = host._unreadRuleView()
	eq('缺项 → true', view.revealOnOpen, true)
	eq('lib 默认 = true', UNREAD_REVEAL_DEFAULT, true)
	eq('视图过 typert 响应 schema', responseSchema.safeParse(view).success, true)
	for (const key of EXPECTED_FIELDS) {
		check(Object.prototype.hasOwnProperty.call(view, key), '视图下发字段 ' + key)
	}
	eq('revealOnOpen 是严格的布尔', typeof view.revealOnOpen, 'boolean')
	eq('hostNow / seen 也照旧一起下发', [typeof view.hostNow, view.seen], ['number', { s1: 123 }])
}

console.log('3. 往返一致:setUnreadRule → getUnreadRule(宿主整份替换)')
{
	const host = makeHost(null)
	const afterOff = await host.setUnreadRule({ revealOnOpen: false })
	eq('set false 的返回里就是 false', afterOff.revealOnOpen, false)
	eq('再 get → false', (await host.getUnreadRule()).revealOnOpen, false)
	eq('存储里也是 false(不只是响应)', host.unread.revealOnOpen, false)

	const afterOn = await host.setUnreadRule({ revealOnOpen: true })
	eq('set true 的返回里就是 true', afterOn.revealOnOpen, true)
	eq('再 get → true', (await host.getUnreadRule()).revealOnOpen, true)

	const afterMissing = await host.setUnreadRule({ pending: false })
	eq('请求里没有这一项 → 回落 true', afterMissing.revealOnOpen, true)
	eq('再 get → true', (await host.getUnreadRule()).revealOnOpen, true)
}

console.log('4. 脏值(0 / "no" / "false" / null / 对象)→ 回落 true')
{
	for (const dirty of [0, 1, 'no', 'false', '', null, undefined, {}, [], NaN]) {
		const host = makeHost({ revealOnOpen: dirty })
		eq('脏值 ' + String(dirty) + ' → true', host._unreadRuleView().revealOnOpen, true)
		const host2 = makeHost(null)
		const view = await host2.setUnreadRule({ revealOnOpen: dirty })
		eq('set 脏值 ' + String(dirty) + ' → true', view.revealOnOpen, true)
	}
}

console.log('5. 刷新回环:客户端拿到视图重建配置,不许把用户的"关"翻回去')
{
	const host = makeHost(null)
	await host.setUnreadRule({ revealOnOpen: false })
	const view = await host.getUnreadRule()
	eq('客户端归一化(刷新后)→ 仍是 false', clientNormalize(view).revealOnOpen, false)
	// 老宿主(响应里根本没这一项)才该回落 true —— 兼容逻辑本身不许动。
	const legacy = { reasons: {}, pending: true, workspaceDot: true, appBadge: true, clearDelaySec: 0 }
	eq('老宿主响应(缺项)→ true(兼容旧版,不回归)', clientNormalize(legacy).revealOnOpen, true)
}

console.log('6. 保存路径:payload 必须带着 revealOnOpen(缺了它刷新就会回落)')
{
	check(clientSrc.includes('revealOnOpen: next.revealOnOpen'), 'saveUnreadRule 把 revealOnOpen 放进 request')
	{
		const body = clientSrc.slice(
			clientSrc.indexOf('const saveUnreadRule = React.useCallback((patch) => {'),
			clientSrc.indexOf(', [rpc]);', clientSrc.indexOf('const saveUnreadRule = React.useCallback((patch) => {'))
		) + ', [rpc]);'
		const sent = []
		const save = new Function('React', 'unreadConfig', 'emitUnreadConfig', 'rpc',
			clientNormalizeSrc + '\n' + body + '\nreturn saveUnreadRule;'
		)(
			{ useCallback: (fn) => fn },
			{ reasons: {}, pending: true, workspaceDot: true, appBadge: true, clearDelaySec: 0, revealOnOpen: true },
			() => {},
			{ call: (path, method, options) => { sent.push(options.args.request); return Promise.resolve({ ok: true }) } }
		)
		save({ revealOnOpen: false })
		eq('关掉开关时,发给宿主的那份带着 revealOnOpen=false', sent.length === 1 ? sent[0].revealOnOpen : 'no-call', false)
		eq('其余字段一个都没漏', sent.length === 1 ? Object.keys(sent[0]).sort().join(',') : 'no-call',
			'appBadge,clearDelaySec,pending,reasons,revealOnOpen,unreadIncludeSubagents,workspaceDot')
	}
}

console.log('7. 不碰同族行为:红点水位线 / subagent 过滤 / 黄点 includeSubagents 照旧')
{
	const host = makeHost({ unreadIncludeSubagents: false, workspaceDot: false, pending: false, clearDelaySec: 30, appBadge: false }, { keep: 7 })
	const view = await host.setUnreadRule({ ...host.unread, revealOnOpen: false })
	eq('unreadIncludeSubagents 原样下发', view.unreadIncludeSubagents, false)
	eq('workspaceDot / pending / clearDelaySec / appBadge 原样下发', [view.workspaceDot, view.pending, view.clearDelaySec, view.appBadge], [false, false, 30, false])
	eq('seen 水位线原样带出(没被这一项改写)', view.seen, { keep: 7 })
	eq('reasons 表仍是完整一张', Object.keys(view.reasons).length, 7)
}

if (failed > 0) {
	console.error('\nrevealOnOpen 持久化测试失败:' + failed + ' 项')
	process.exit(1)
}
console.log('\nrevealOnOpen 持久化测试全部通过')
