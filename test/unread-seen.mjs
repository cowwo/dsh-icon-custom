// 宿主持久化的「已读」水位线:unread-seen.json(0.11.2)。
//
// 锁四件事,每一件坏了都会让红点变得不准:
//   * 脏输入(脏 key / 脏值 / 坏版本)不许进文件,也不许把红点全点亮;
//   * 合并逐会话取 max —— 标记永不倒退,否则两个设备同时写会"诈尸";
//   * 剪枝按时间保留最新,且丢掉的记录不会把红点变回来;
//   * 本浏览器从没记过水位线的会话,首帧就得算未读(水位线是 render 之后才补写的)。
// 跑法:在仓库根目录 `node test/unread-seen.mjs`。

import { readFileSync } from 'node:fs'
import {
	UNREAD_SEEN_MAX,
	UNREAD_SEEN_VERSION,
	mergeSeen,
	normalizeSeen,
	pruneSeen,
	unreadSeenFileSchema
} from '../lib/unread.js'

let failed = 0
function check(ok, what) {
	if (ok) {
		console.log('  ✓ ' + what)
		return
	}
	failed++
	console.log('  ✗ ' + what)
}

// 1. 脏输入
{
	console.log('1. 脏输入被丢掉,而不是写进文件')
	const dirty = {
		'session-a': 1000,
		'': 1000,
		'session-b': 0,
		'session-c': -5,
		'session-d': Number.NaN,
		'session-e': Number.POSITIVE_INFINITY,
		'session-f': '1000',
		'session-g': null,
		['x'.repeat(200)]: 1000
	}
	const clean = normalizeSeen(dirty)
	check(Object.keys(clean).join(',') === 'session-a', '只留下合法条目(实际:' + Object.keys(clean).join(',') + ')')
	check(normalizeSeen(null) !== null && Object.keys(normalizeSeen(null)).length === 0, 'null → 空表')
	check(Object.keys(normalizeSeen('nope')).length === 0, '字符串 → 空表')
	check(unreadSeenFileSchema.safeParse({ version: UNREAD_SEEN_VERSION, seen: clean }).success, '文件形状能通过 schema')
	check(!unreadSeenFileSchema.safeParse({ version: UNREAD_SEEN_VERSION, seen: { a: 'x' } }).success, '脏值过不了 schema')
}

// 2. 逐会话取 max
{
	console.log('2. 合并是逐会话 max,标记永不倒退')
	const host = { a: 100, b: 200 }
	const first = mergeSeen(host, { a: 150, c: 300 })
	check(first.seen.a === 150, '更新的标记前进')
	check(first.seen.b === 200, '没提到的会话原样保留')
	check(first.seen.c === 300, '新会话加进来')
	check(first.changed === true, '前进 → changed')
	const stale = mergeSeen(first.seen, { a: 50, b: 100 })
	check(stale.seen.a === 150 && stale.seen.b === 200, '旧标记盖不回新标记(并发保护)')
	check(stale.changed === false, '没有前进 → changed 为假')
	const same = mergeSeen(first.seen, { a: 150 })
	check(same.changed === false, '同值不算前进(幂等)')
	const dirty = mergeSeen(first.seen, { a: Number.NaN, '': 10 })
	check(dirty.seen.a === 150 && Object.keys(dirty.seen).length === 3, '脏载荷不改动现有表')
	check(mergeSeen(host, {}).seen !== host, '返回新对象,不改入参引用')
}

// 3. 剪枝
{
	console.log('3. 剪枝只留最新的 N 条,且不会把红点变回来')
	const small = pruneSeen({ a: 1, b: 2, c: 3 }, 2)
	check(Object.keys(small).sort().join(',') === 'b,c', '保留 endAt 最大的两条(实际:' + Object.keys(small).sort().join(',') + ')')
	const big = {}
	for (let i = 0; i < UNREAD_SEEN_MAX + 25; i++) big['s' + i] = 1000 + i
	const pruned = pruneSeen(big)
	check(Object.keys(pruned).length === UNREAD_SEEN_MAX, '超过上限 → 截到 ' + UNREAD_SEEN_MAX + ' 条(实际 ' + Object.keys(pruned).length + ')')
	check(pruned['s' + (UNREAD_SEEN_MAX + 24)] === 1000 + UNREAD_SEEN_MAX + 24, '留下的是最新的那条')
	check(pruned.s0 === undefined, '最老的那条被丢掉')
	// 丢掉记录 ≠ 变未读:客户端对没有标记的会话按"上次在线"重新起基线。
	const dropped = pruneSeen(big, UNREAD_SEEN_MAX)['s0']
	check(dropped === undefined, '被丢掉的会话没有标记(客户端会重新起基线,而不是当成未读)')
}

// 4. 文件往返(与 lib/index.js 的读写同一形状)
{
	console.log('4. 文件往返:写出去再读回来,语义不变')
	const written = JSON.stringify({ version: UNREAD_SEEN_VERSION, seen: mergeSeen({}, { a: 7, b: 9 }).seen })
	const read = JSON.parse(written)
	const ok = read.version === UNREAD_SEEN_VERSION && read.seen.a === 7 && read.seen.b === 9
	check(ok, '往返后条目一致')
	check(JSON.parse(JSON.stringify({ version: 99, seen: { a: 1 } })).version !== UNREAD_SEEN_VERSION, '未来版本会被当成空库(不猜着读)')
	const mergedAfterReload = mergeSeen(read.seen, { a: 8 })
	check(mergedAfterReload.seen.a === 8 && mergedAfterReload.seen.b === 9, '重启后继续 max 合并')
}

// 5. 首帧未见过的会话也必须算未读
//
// 「本浏览器从没记过水位线」在本浏览器第一次看到某个会话时是常态 —— 而水位线是
// render 之后的 effect 才补写的(ensureSeenBaseline + saveSeenState)。所以首帧那次
// 计算必须自己兜住"没有水位线"这件事,不能指望补写之后有人重算;否则红点从这一帧
// 起就丢,5 秒看门狗读到的也是 0。
//
// 这里不重写逻辑,也不改 client/client.js:直接把真源码里的 unread 状态区和真实的
// BadgeSource 拿出来,配一个最小的 React 桩跑首帧 —— render 阶段只登记 effect、
// 不执行,effect 在 render 之后才 flush,与 React 的时序一致;再从
// emitRealBadge(未读数进 favicon / 角标桥的唯一出口)收下它第一次拿到的值。
{
	console.log('5. 首帧(水位线还没补写)也必须算出未读')
	const src = readFileSync('client/client.js', 'utf8')

	const cut = (startMarker, endMarker, label) => {
		const a = src.indexOf(startMarker)
		if (a < 0) throw new Error('找不到 ' + label)
		const b = src.indexOf(endMarker, a)
		if (b < 0) throw new Error('找不到 ' + label + ' 的结尾')
		return src.slice(a, b)
	}
	const extract = (marker) => {
		const a = src.indexOf(marker)
		if (a < 0) throw new Error('找不到 ' + marker)
		const i = src.indexOf('{', a + marker.length - 1)
		let depth = 0
		for (let j = i; j < src.length; j++) {
			if (src[j] === '{') depth++
			else if (src[j] === '}') { depth--; if (depth === 0) return src.slice(a, j + 1) }
		}
		throw new Error('括号不配对 ' + marker)
	}
	const unreadRegion = cut('\t\t//#region unread state', '\t\t//#endregion', 'unread 状态区')
	const badgeSource = extract('function BadgeSource(props) {')

	// 环境:这个浏览器上次在线 seenBootAt = 1000,本地水位线表是空的。
	const SEEN_KEY = 'dsh-icon-custom.unread-seen.v2'
	const disk = new Map([[SEEN_KEY, JSON.stringify({ domain: 'host', lastActiveAt: 1000, seen: {} })]])
	const localStorageStub = {
		getItem: (key) => (disk.has(key) ? disk.get(key) : null),
		setItem: (key, value) => disk.set(key, String(value)),
		removeItem: (key) => disk.delete(key)
	}
	const effects = []
	const badgeEmits = []
	const stubs = {
		window: { localStorage: localStorageStub, setTimeout: () => 1, clearTimeout: () => {}, addEventListener: () => {}, removeEventListener: () => {} },
		document: { visibilityState: 'visible', querySelectorAll: () => [], addEventListener: () => {}, removeEventListener: () => {} },
		console: { warn: () => {}, log: () => {} },
		// 首帧的关键:render 阶段只登记 effect,不执行 —— React 在 commit 之后才跑。
		React: { useState: (initial) => [initial, () => {}], useMemo: (fn) => fn(), useEffect: (fn) => { effects.push(fn) }, useRef: (initial) => ({ current: initial }), useCallback: (fn) => fn },
		reconcileAppBadge: () => {},
		emitUnreadPoke: () => {},
		subscribeUnreadPoke: () => () => {},
		// 本用例只关心未读数,其余功能一律给不会抛的桩。
		runningSessionIds: () => [],
		runningItemsSignature: () => '',
		headerRingSuppressed: () => false,
		headerRingCount: () => -1,
		headerRingCatalogLoaded: () => true,
		requestHeaderRingRefresh: () => {},
		paintHeaderRing: () => {},
		emitSidebarMarks: () => {},
		dotsFromItems: () => [],
		runningWorkspaceDots: () => [],
		emitRunningState: () => {},
		// 未读数进 favicon / 角标桥的唯一出口 —— 收下它第一次拿到的值。
		emitRealBadge: (value) => { badgeEmits.push(value) },
		litUnreadIds: new Set()
	}
	const names = Object.keys(stubs)
	const api = new Function(...names,
		unreadRegion + '\n' + badgeSource + '\nreturn { BadgeSource, seenBootAt };'
	)(...names.map((name) => stubs[name]))

	check(api.seenBootAt === 1000 && JSON.parse(disk.get(SEEN_KEY)).seen.fresh === undefined,
		'前提:本浏览器上次在线 seenBootAt=1000,且本地从没记过这个会话的水位线')

	// 列表里就一个会话:本浏览器从没见过它,它的 endAt(5000)比 seenBootAt(1000)新。
	const list = {
		ids: ['fresh'],
		byId: { fresh: { id: 'fresh', origin: 'local', displayTitle: '首帧才出现的会话', projectionValues: { lastTurnEnd: { endAt: 5000, reason: 'completed' } } } }
	}
	const props = { useSessions: (select) => select(list), useSessionStatus: undefined, useWorkspaces: undefined, usePanelInfo: undefined }

	// 首帧:render(算未读)→ 之后才 flush effect(补写水位线)。
	api.BadgeSource(props)
	const effectErrors = []
	for (const effect of effects) {
		try { effect() } catch (error) { effectErrors.push(String((error && error.message) || error)) }
	}
	check(effectErrors.length === 0, '桩环境完整:首帧的 effect 没有一个抛错(实际:' + (effectErrors.join(' / ') || '无') + ')')

	const firstFrameCount = badgeEmits.length > 0 ? badgeEmits[0] : '首帧压根没算过'
	check(firstFrameCount === 1, '首帧未见过的会话也必须算未读:第一次进 favicon/角标的 count 实际=' + firstFrameCount + ',期望=1')
}

if (failed > 0) {
	console.error('\n水位线测试失败:' + failed + ' 项')
	process.exit(1)
}
console.log('\n水位线测试全部通过')
