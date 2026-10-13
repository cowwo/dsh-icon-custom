// 子代理进行中聚合开关的回归测试(0.20.0)。
//
// 锁三件事,每一件坏了都会让黄数字要么少算、要么重复、要么在你说"别管子代理"时还在管:
//   * 开关开:在跑的子代理沿 parentSessionId 链上溯到最顶层非子代理祖先,祖先计入;
//     子代理自己的行照旧不计;多个子代理归属同一祖先只算一次(数字是会话数);
//   * 开关关:行为完全等于旧版——所有 origin === "subagent" 的行一律跳过;
//   * 缺省:配置里没有这个字段(或值是脏的)→ 视为开;
//   * 等待语义不变:祖先自己 pendingInteraction 时不计(子代理的等待状态不参与)。
// 跑法:在仓库根目录 `node test/running-subagents.mjs`(从 client/client.js 切真实代码,
// 只桩依赖,所以测的是即将发布的代码本身)。

import { readFileSync } from 'node:fs'
import { RUNNING_INCLUDE_SUBAGENTS_DEFAULT, normalizeRunningConfig } from '../lib/running.js'

const src = readFileSync('client/client.js', 'utf8')

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

// —— 真实代码:会话筛选 + 子代理上溯 ——
// runningSessionIds 从作用域里的 runningConfig 读开关(第三参数可覆盖),
// 所以把它放进一个把 runningConfig 当参数的真实函数里跑。

const runningCode = extract('function runningSessionIds(list, status) {')
const makeRunning = (config) => new Function(
	'runningConfig',
	runningCode + '\nreturn { runningSessionIds }'
)(config)

const list = (ids, byId) => ({ ids, byId })
const entry = (extra = {}) => ({ id: 'x', displayTitle: 'x', ...extra })
const statusRow = (extra = {}) => ({ running: false, pendingInteraction: undefined, ...extra })

// 一个祖先 + 两个直接子代理 + 一个孙子代理 + 一个普通会话。
const tree = () => list(['parent', 'sub-a', 'sub-b', 'sub-deep', 'mine'], {
	parent: entry({ running: false }),
	'sub-a': entry({ running: true, origin: 'subagent', parentSessionId: 'parent' }),
	'sub-b': entry({ running: true, origin: 'subagent', parentSessionId: 'parent' }),
	'sub-deep': entry({ running: true, origin: 'subagent', parentSessionId: 'sub-a' }),
	mine: entry({ running: true })
})

console.log('— 开关开:子代理在跑,算它上面的真会话,子代理自己不算 —')
{
	const running = makeRunning({ enabled: true, includeSubagents: true })
	const ids = running.runningSessionIds(tree(), new Map(), true)
	check(ids.includes('parent'), '祖先会话被计入进行中(实际 ' + ids.join(',') + ')')
	check(ids.includes('mine'), '普通在跑会话照旧计入')
	check(!ids.includes('sub-a') && !ids.includes('sub-b') && !ids.includes('sub-deep'), '子代理自己的行一个都不计(官方侧栏也不渲染它们)')
	check(ids.filter((id) => id === 'parent').length === 1, '三个子代理归属同一祖先,只算一次(数字是会话数)')
	check(ids.length === 2, '总数是 2(祖先 + 自己的会话),不是 4(实际 ' + ids.length + ')')

	// 祖先自己也在跑:不能因此出现两次。
	const both = list(['parent', 'sub-a'], {
		parent: entry({ running: true }),
		'sub-a': entry({ running: true, origin: 'subagent', parentSessionId: 'parent' })
	})
	const deduped = running.runningSessionIds(both, new Map(), true)
	check(deduped.join(',') === 'parent', '祖先自己也在跑时仍然只有一条(实际 ' + deduped.join(',') + ')')

	// 祖先正在等你:琥珀色优先,子代理不能把它点成黄的。
	const waiting = new Map([['parent', statusRow({ running: false, pendingInteraction: { kind: 'approval' } })]])
	check(running.runningSessionIds(tree(), waiting, true).join(',') === 'mine', '祖先在等你(琥珀色)时不计,子代理的等待状态不参与')

	// 链条断了 / 成环:宁可不算,也不许把黄点安到无关的行上。
	const orphan = list(['sub-x'], { 'sub-x': entry({ running: true, origin: 'subagent' }) })
	check(running.runningSessionIds(orphan, new Map(), true).length === 0, '没有 parentSessionId 的子代理无从归属 → 不计')
	const unknown = list(['sub-y'], { 'sub-y': entry({ running: true, origin: 'subagent', parentSessionId: 'ghost' }) })
	check(running.runningSessionIds(unknown, new Map(), true).length === 0, '父会话不在列表里 → 不计(不猜一个 id)')
	const cycle = list(['s1', 's2'], {
		s1: entry({ running: true, origin: 'subagent', parentSessionId: 's2' }),
		s2: entry({ running: true, origin: 'subagent', parentSessionId: 's1' })
	})
	check(running.runningSessionIds(cycle, new Map(), true).length === 0, '父子成环 → 不计,也不死循环')

	// 子代理没在跑:什么都没有。
	const idle = list(['parent', 'sub-a'], {
		parent: entry({ running: true }),
		'sub-a': entry({ running: false, origin: 'subagent', parentSessionId: 'parent' })
	})
	check(running.runningSessionIds(idle, new Map(), true).join(',') === 'parent', '只有祖祖先自己在跑时就是它一个')

	// status 比 entry 更权威,子代理也一样。
	const statusWins = new Map([['sub-a', statusRow({ running: false })]])
	const listOne = list(['parent', 'sub-a'], {
		parent: entry({ running: false }),
		'sub-a': entry({ running: true, origin: 'subagent', parentSessionId: 'parent' })
	})
	check(running.runningSessionIds(listOne, statusWins, true).length === 0, 'status 说子代理没跑就没跑(官方优先级)')
}

console.log('— 开关关:完全等于旧行为 —')
{
	const running = makeRunning({ enabled: true, includeSubagents: false })
	const ids = running.runningSessionIds(tree(), new Map(), false)
	check(ids.join(',') === 'mine', '显式关掉:祖先不计,只剩自己开的会话(实际 ' + ids.join(',') + ')')
	const viaConfig = makeRunning({ enabled: true, includeSubagents: false }).runningSessionIds(tree(), new Map())
	check(viaConfig.join(',') === 'mine', '配置里关掉:结果一样(实际 ' + viaConfig.join(',') + ')')
	const marked = makeRunning({ enabled: true, includeSubagents: true }).runningSessionIds(tree(), new Map(), false)
	check(marked.join(',') === 'mine', '第三参数关掉:覆盖配置(实际 ' + marked.join(',') + ')')
}

console.log('— 缺省:配置缺项/脏值 → 视为开 —')
{
	check(RUNNING_INCLUDE_SUBAGENTS_DEFAULT === true, '宿主默认是开')
	check(normalizeRunningConfig(null).includeSubagents === true, '宿主 normalize(null) → 开')
	check(normalizeRunningConfig({ enabled: false }).includeSubagents === true, '宿主缺这一项 → 开')
	check(normalizeRunningConfig({ includeSubagents: false }).includeSubagents === false, '宿主关得掉')
	check(normalizeRunningConfig({ includeSubagents: 'no' }).includeSubagents === true, '宿主脏值不猜,回落开')
	check(normalizeRunningConfig({ includeSubagents: false, junk: 1 }).includeSubagents === false, '宿主丢掉多余字段')

	// 客户端那个 normalize 的镜像:测试会把它从模块里切出来,所以它不能依赖模块常量。
	const normalizeSrc = extract('function normalizeRunningConfig(input) {')
	const normalizeClient = (input) => new Function('input', normalizeSrc + '\nreturn normalizeRunningConfig(input)')(input)
	check(normalizeClient({}).includeSubagents === true, '客户端缺这一项 → 开')
	check(normalizeClient({ enabled: false }).includeSubagents === true, '客户端只有 enabled 时 → 开')
	check(normalizeClient({ includeSubagents: false }).includeSubagents === false, '客户端关得掉')
	check(normalizeClient({ includeSubagents: 0 }).includeSubagents === true, '客户端脏值不猜,回落开')

	// 配置里没这个字段、甚至整个配置缺失:两参数的旧调用也要按"开"来。
	const noField = makeRunning({ enabled: true }).runningSessionIds(tree(), new Map())
	check(noField.includes('parent') && noField.length === 2, '两参数调用 + 配置缺项 → 按开处理(实际 ' + noField.join(',') + ')')
	const noConfig = makeRunning(undefined).runningSessionIds(tree(), new Map())
	check(noConfig.includes('parent') && noConfig.length === 2, '整个 runningConfig 都不在作用域(被切出来时)→ 按开处理(实际 ' + noConfig.join(',') + ')')
	const dirty = makeRunning({ enabled: true, includeSubagents: 'no' }).runningSessionIds(tree(), new Map())
	check(dirty.includes('parent'), '配置值脏(非 boolean)→ 按开处理')
}

console.log('— 接线:开关真的接在设置页与端点上 —')
{
	check(/runningIncludeSubagentsLabel: "/.test(src) && /runningIncludeSubagentsHint: "/.test(src), '中英 locale 都补了新文案(至少两处出现)')
	const labelCount = (src.match(/runningIncludeSubagentsLabel: "/g) || []).length
	check(labelCount === 2, '文案恰好中英各一份(实际 ' + labelCount + ')')
	check(src.includes('t("runningIncludeSubagentsLabel")'), '设置页复选框用了这个 key')
	check(src.includes('running.includeSubagents !== false'), '复选框默认是勾上的(缺项即开)')
	check(/includeSubagents: next\.includeSubagents/.test(src), '保存时把新字段一起发给宿主(不会把另一个开关挤掉)')
}

if (failed > 0) {
	console.error('\n子代理进行中聚合测试失败:' + failed + ' 项')
	process.exit(1)
}
console.log('\n子代理进行中聚合测试全部通过')
