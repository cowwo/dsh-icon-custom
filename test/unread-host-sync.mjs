// 「已读」水位线搬到宿主之后的同步行为(0.11.2)。
//
// 锁的是让"跨设备一致"不至于变成"红点诈尸"的那几条:
//   * 合并逐会话取 max:宿主更新 → 采纳;本地更新 → 留着;
//   * 每次打开页面把并集推回宿主(迁移 + 自愈),推的是整表、幂等;
//   * 20 秒一次的"我还在"心跳不许把整表推上去(它没改任何标记);
//   * 推送失败不丢标记,过一会儿自己重试;
//   * 宿主知道得更多时,再推一次直到收敛,不会无限循环。
// 跑法:在仓库根目录 `node test/unread-host-sync.mjs`(从 client/client.js 切真实代码,
// 只桩 window/localStorage/RPC)。

import { readFileSync } from 'node:fs'

const src = readFileSync('client/client.js', 'utf8')

let failed = 0
function check(ok, what) {
	if (ok) {
		console.log('  ✓ ' + what)
		return
	}
	failed++
	console.log('  ✗ ' + what)
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

/** Loads the real seen-store region with a fake window, timer queue and RPC. */
function harness({ stored = null } = {}) {
	const start = src.indexOf('const SEEN_STORE_KEY =')
	const end = src.indexOf('function ensureSeenBaseline(', start)
	if (start < 0 || end < 0) throw new Error('找不到水位线区域')
	const region = src.slice(start, end)
	const data = new Map()
	if (stored !== null) data.set('dsh-icon-custom.unread-seen.v2', JSON.stringify({ domain: 'host', lastActiveAt: 0, seen: stored }))
	const timers = new Map()
	let nextTimer = 1
	const window = {
		localStorage: {
			getItem: (k) => (data.has(k) ? data.get(k) : null),
			setItem: (k, v) => { data.set(k, v) }
		},
		setTimeout: (fn, ms) => { const id = nextTimer++; timers.set(id, { fn, ms }); return id },
		clearTimeout: (id) => { timers.delete(id) }
	}
	const api = new Function(
		'window',
		region + '\nreturn { seenState, noteSeen, adoptHostSeen, flushHostSeen, scheduleHostSync, saveSeenState, setRpc: (r) => { seenRpc = r; }, flags: () => ({ hostDirty, hostSyncedOnce, hostSyncInFlight, timers: hostSyncTimer, retry: hostRetryTimer, backoff: hostBackoffUntil }) };'
	)(window)
	/** Every RPC call the region made, in order. */
	const calls = []
	api.setRpc({
		call: (path, method, options) => {
			const marks = options?.args?.marks ?? null
			calls.push({ method, marks })
			const answer = api.answer
			if (answer === null) return Promise.reject(new Error('offline'))
			return Promise.resolve(typeof answer === 'function' ? answer(marks) : answer)
		}
	})
	api.answer = { ok: true, value: { seen: {} } }
	api.calls = calls
	/** Runs every timer scheduled so far (the debounce and the retry are both one-shot). */
	api.runTimers = () => {
		const pending = [...timers.values()]
		timers.clear()
		for (const t of pending) t.fn()
		return pending.length
	}
	api.timerCount = () => timers.size
	api.saved = () => JSON.parse(data.get('dsh-icon-custom.unread-seen.v2') ?? 'null')
	return api
}

// 1. 合并方向
{
	console.log('1. 与宿主合并:逐会话取 max')
	const api = harness({ stored: { local_only: 300, both: 100 } })
	const gained = api.adoptHostSeen({ both: 150, host_only: 200 })
	check(gained === true, '宿主更新的标记被采纳')
	check(api.seenState.seen.both === 150, '两边都有 → 取宿主那个更新的')
	check(api.seenState.seen.host_only === 200, '宿主独有的标记被采纳')
	check(api.seenState.seen.local_only === 300, '本地独有的标记留着(等着推上去)')
	const backwards = api.adoptHostSeen({ local_only: 50, both: 1 })
	check(backwards === false && api.seenState.seen.local_only === 300 && api.seenState.seen.both === 150, '宿主更旧 → 不倒退')
	check(api.adoptHostSeen(null) === false, '脏输入不炸也不改')
}

// 2. 首次同步:迁移 + 收敛
{
	console.log('2. 打开页面后的第一次同步:推并集、采纳宿主的、再推一次直到收敛')
	const api = harness({ stored: { mine: 500 } })
	api.answer = (marks) => ({ ok: true, value: { seen: { mine: 500, theirs: 900 } } })
	api.scheduleHostSync()
	api.runTimers()
	await settle()
	check(api.calls.length === 1, '第一次推送发生(实际 ' + api.calls.length + ' 次)')
	check(api.calls[0].method === 'iconCustom/setUnreadSeen', '推的是 setUnreadSeen 端点')
	check(api.calls[0].marks.mine === 500, '把自己那份推了上去(迁移)')
	check(api.seenState.seen.theirs === 900, '采纳了宿主知道的标记(自愈的另一半)')
	check(api.flags().hostDirty === true, '宿主知道得更多 → 标记为还要再推一次')
	api.runTimers()
	await settle()
	check(api.calls.length === 2 && api.calls[1].marks.theirs === 900, '第二次推的是并集')
	check(api.flags().hostDirty === false, '没有新的前进 → 收敛,不再推')
	const extra = api.runTimers()
	check(extra === 0, '收敛后没有多余定时器')
}

// 3. 心跳不许触发推送
{
	console.log('3. 20 秒心跳(只更新"我还在")不许把整表推上去')
	const api = harness({ stored: { a: 100 } })
	api.answer = { ok: true, value: { seen: { a: 100 } } }
	api.scheduleHostSync()
	api.runTimers()
	await settle()
	const afterFirst = api.calls.length
	api.seenState.lastActiveAt = 12345
	api.saveSeenState() // 心跳走的就是这条路
	check(api.timerCount() === 0, '心跳没有排新的推送(实际排了 ' + api.timerCount() + ' 个)')
	check(api.calls.length === afterFirst, '心跳没有多发 RPC')
	check(api.saved().lastActiveAt === 12345, '心跳本身仍然落盘')
}

// 4. 真正标了已读 → 推上去
{
	console.log('4. 标了已读就推:noteSeen → 保存 → 去抖 → 推送')
	const api = harness({ stored: { a: 100 } })
	api.answer = { ok: true, value: { seen: {} } }
	api.scheduleHostSync()
	api.runTimers()
	await settle()
	const before = api.calls.length
	const advanced = api.noteSeen('session-x', 777)
	api.saveSeenState()
	check(advanced === true, 'noteSeen 前进了')
	check(api.flags().hostDirty === true, '标记为脏')
	api.runTimers()
	await settle()
	check(api.calls.length === before + 1 && api.calls[before].marks['session-x'] === 777, '把新标记推给了宿主')
	const again = api.noteSeen('session-x', 700)
	check(again === false, '更旧的标记不算前进')
}

// 5. 推送失败不丢标记,并且会重试
{
	console.log('5. 推送失败:标记留在本地,稍后重试')
	const api = harness({ stored: { a: 100 } })
	api.answer = null // 每次都 reject
	api.scheduleHostSync()
	api.runTimers()
	await settle()
	check(api.calls.length === 1, '尝试过一次')
	check(api.seenState.seen.a === 100, '标记没有丢')
	check(api.flags().retry !== 0, '排了重试')
	api.answer = { ok: true, value: { seen: { a: 100 } } }
	api.runTimers()
	await settle()
	check(api.calls.length === 2, '重试真的发出去了')
	check(api.flags().hostDirty === false, '成功后不再脏')
}

// 6. 没有 RPC(测试环境/老宿主)时,一切都还是 no-op
{
	console.log('6. 没有连接时:不推送,也不抛错')
	const start = src.indexOf('const SEEN_STORE_KEY =')
	const end = src.indexOf('function ensureSeenBaseline(', start)
	const region = src.slice(start, end)
	const window = { localStorage: { getItem: () => null, setItem: () => {} }, setTimeout: () => 1, clearTimeout: () => {} }
	const api = new Function('window', region + '\nreturn { seenState, noteSeen, scheduleHostSync, flags: () => ({ hostDirty }) };')(window)
	api.noteSeen('session-y', 1)
	api.scheduleHostSync()
	check(api.flags().hostDirty === true, '标记照常记录(等有连接时再推)')
	check(true, 'scheduleHostSync 没抛错')
}

// 7. 失败退避:心跳不许空试,重试成功后退避清零
{
	console.log('7. 推送失败后退避,成功后清零')
	const api = harness({ stored: { a: 100 } })
	api.answer = null // 一直失败(例如宿主还没重启、没有这个端点)
	api.scheduleHostSync()
	api.runTimers()
	await settle()
	const failedCalls = api.calls.length
	api.saveSeenState() // 20 秒心跳走的路
	check(api.flags().timers === 0, '退避窗口内心跳不再排推送(实际排了 ' + api.flags().timers + ' 个)')
	api.answer = { ok: true, value: { seen: { a: 100 } } }
	api.runTimers() // 跑掉重试定时器
	await settle()
	check(api.calls.length === failedCalls + 1, '重试按计划发出去了')
	check(api.flags().backoff === 0, '成功后不再退避')
	api.noteSeen('session-z', 900)
	api.saveSeenState()
	check(api.timerCount() === 1, '退避清零后,新标记立刻能排推送')
}

if (failed > 0) {
	console.error('\n宿主同步测试失败:' + failed + ' 项')
	process.exit(1)
}
console.log('\n宿主同步测试全部通过')
