/**
 * dsh-icon-custom · "未读"规则(宿主半,纯函数)
 *
 * 只干一件事:把会话日志里的 `turn/end` 折叠成一条**事实**——
 * 「这个会话最后一次是怎么结束的、什么时候结束的」。
 *
 * 它**不判断**「这种结束值不值得亮红点」。那是用户设置,由客户端套用。
 * 这样勾掉一个原因会立刻生效,不需要回头重折任何日志。
 *
 * 这个文件不碰 cordis、不碰文件系统、不认任何其他插件:
 * 纯 reducer + 一套原因词汇表。以后想把它搬进独立的包,原样搬走即可。
 */
import { z } from 'zod'

/**
 * 红点可以为哪些结束原因亮起来。
 * `aborted`(被取消)按取消来源拆成两条——你亲手按的停止不该提醒你。
 */
export const UNREAD_REASONS = [
	'completed',
	'error',
	'blocked',
	'max-tokens',
	'interrupted',
	'aborted:user',
	'aborted:other'
]

/** 默认:除了"你自己按的停止",其余都算。 */
export const UNREAD_REASON_DEFAULTS = {
	completed: true,
	error: true,
	blocked: true,
	'max-tokens': true,
	interrupted: true,
	'aborted:user': false,
	'aborted:other': true
}

/** 投影 key:客户端从 `entry.projectionValues[LAST_TURN_END_KEY]` 读它。 */
export const LAST_TURN_END_KEY = 'lastTurnEnd'

/** 默认:门铃("有人在等你")也算一条。 */
export const UNREAD_PENDING_DEFAULT = true

/**
 * 默认:在工作区那一行的文件夹图标上画红点。
 *
 * 这是全套功能里**贴着产品 DOM 走**的两处之一(另一处见下面的 `UNREAD_REVEAL_DEFAULT`),
 * 所以它有自己的开关:一旦 DSH 升级改了结构导致它失效或画歪,
 * 关掉它就行,红点数字/清单/跳转那些稳的部分完全不受影响。
 */
export const UNREAD_WORKSPACE_DOT_DEFAULT = true

/**
 * 默认:点清单条目时,顺带在侧栏定位到那个会话(展开它所在的工作区、滚到那一行并闪一下)。
 *
 * 这是第二处贴着产品 DOM 走的部分。官方的"展开 + 滚动"只服务于它自己的搜索结果
 * (内部状态,没有对外的 Service),所以插件只能**模拟点击**官方的工作区行与
 * "显示更多"按钮。DSH 升级改结构时它会失效,失效的表现只有一个:
 * **点进去照常打开会话,只是侧栏不动**。不想让它动侧栏就关掉这一项。
 *
 * 还有一件事要说清:展开是**官方自己记住**的状态(存在浏览器里),不会自己收回去 ——
 * 官方搜索跳转也是这个行为。
 */
export const UNREAD_REVEAL_DEFAULT = true

/**
 * 默认:在系统应用图标上显示角标(安装为应用后生效)。
 *
 * 它只是"同一个数字在系统图标上的投影",所以默认跟随红点一起打开;
 * 关掉它等于"不要这个投影",而不等于"这个功能不存在"。
 * 注意:**探测到 API ≠ 角标会出现**(安卓与 Linux 上方法存在但静默无效,
 * iOS 上还额外要求通知权限),详见 docs/adr/0005-app-icon-badge.md。
 */
export const UNREAD_APP_BADGE_DEFAULT = true

/**
 * 默认:进入会话即视为已读(0 秒)。
 * 大于 0 时,你必须在那个会话里**连续**待满这么多秒它才算"看过";中途切走会
 * 清零重数。填 0 就是"不设置",行为跟没有这一项完全一样。
 */
export const UNREAD_CLEAR_DELAY_DEFAULT = 0

/**
 * 秒数上限:10 分钟。
 * 挡住误填的大数(想填 5 却打成 50000)——那会让红点实际上永远清不掉,
 * 而症状是"点进去也不消",很难联想到是这里填错了。
 */
export const UNREAD_CLEAR_DELAY_MAX_SEC = 600

/** 把任意输入夹成 `0..上限` 的整数秒(小数向下取整,脏值回落默认)。 */
export function normalizeClearDelay(input) {
	const value = typeof input === 'string' && input.trim() !== '' ? Number(input) : input
	if (typeof value !== 'number' || !Number.isFinite(value)) return UNREAD_CLEAR_DELAY_DEFAULT
	const seconds = Math.floor(value)
	if (seconds <= 0) return 0
	return Math.min(seconds, UNREAD_CLEAR_DELAY_MAX_SEC)
}

/** 把任意输入夹成一张完整、只有布尔值的开关表(缺项取默认)。 */
export function normalizeReasons(input) {
	const out = {}
	for (const key of UNREAD_REASONS) {
		const value = input !== null && typeof input === 'object' ? input[key] : undefined
		out[key] = typeof value === 'boolean' ? value : UNREAD_REASON_DEFAULTS[key]
	}
	return out
}

/**
 * 把任意输入夹成完整设置。
 * @param input - `{ reasons?, pending?, workspaceDot?, appBadge?, clearDelaySec?, revealOnOpen? }`,可以是脏的、缺项的、null
 * @returns `{ reasons, pending, workspaceDot, appBadge, clearDelaySec, revealOnOpen }` —— 每一项都完整
 */
export function normalizeUnreadConfig(input) {
	const source = input !== null && typeof input === 'object' ? input : {}
	return {
		reasons: normalizeReasons(source.reasons),
		pending: typeof source.pending === 'boolean' ? source.pending : UNREAD_PENDING_DEFAULT,
		workspaceDot: typeof source.workspaceDot === 'boolean' ? source.workspaceDot : UNREAD_WORKSPACE_DOT_DEFAULT,
		appBadge: typeof source.appBadge === 'boolean' ? source.appBadge : UNREAD_APP_BADGE_DEFAULT,
		clearDelaySec: normalizeClearDelay(source.clearDelaySec),
		revealOnOpen: typeof source.revealOnOpen === 'boolean' ? source.revealOnOpen : UNREAD_REVEAL_DEFAULT
	}
}

/**
 * 一个 `turn/end` 的 reason → 稳定的原因 key。
 * `aborted` 再看一层 `reason.kind`:`user` 是你自己按的,其余是重启/热更/父级取消。
 * @param reason - `TurnEndReason`
 * @returns 原因 key(`'aborted:user'` / `'aborted:other'` / 原 kind / `'unknown'`)
 */
export function reasonKey(reason) {
	const kind = reason !== null && typeof reason === 'object' && typeof reason.kind === 'string' ? reason.kind : 'unknown'
	if (kind !== 'aborted') return kind
	const cause = reason.reason !== null && typeof reason.reason === 'object' ? reason.reason.kind : undefined
	return cause === 'user' ? 'aborted:user' : 'aborted:other'
}

/** 折叠初始态:还没有任何回合结束过。 */
export function initLastTurnEnd() {
	return { endAt: 0, reason: null }
}

/**
 * 纯转移:只有 `turn/end` 改动它,其余事件原样返回同一个引用
 * (契约要求 `Object.is` 不变以产生零下游工作)。
 * @param state - 覆盖此前全部事件的状态
 * @param event - 下一个已提交的会话事件
 * @returns 下一个状态(事件与本单元无关时返回同一个引用)
 */
export function applyLastTurnEnd(state, event) {
	if (event === null || typeof event !== 'object' || event.type !== 'turn/end') return state
	const data = event.data !== null && typeof event.data === 'object' ? event.data : {}
	const reason = reasonKey(data.reason)
	const endAt = typeof event.time === 'number' ? event.time : 0
	if (state.endAt === endAt && state.reason === reason) return state
	return { endAt, reason }
}

/** 状态 → 上线载荷。 */
export function lastTurnEndView(state) {
	return {
		endAt: typeof state.endAt === 'number' ? state.endAt : 0,
		reason: typeof state.reason === 'string' && state.reason !== '' ? state.reason : null
	}
}

/** 持久化折叠状态(纯 JSON,供投影缓存检查点)。 */
export const lastTurnEndStateSchema = z.object({
	endAt: z.number(),
	reason: z.string().nullable()
})

/** 上线载荷。 */
export const lastTurnEndViewSchema = z.object({
	endAt: z.number(),
	reason: z.string().nullable()
})

// ---------------------------------------------------------------------------
// 水位线(宿主持有的"已读"标记)
//
// 这是这套东西唯一的真相:浏览器那份降级为缓存兼离线队列。放宿主有两个理由——
// 清掉浏览器数据不再等于"全部未读",以及"我看过了"跨设备一致。
// 判定精度不变:仍是"进入会话并连续待够 N 秒"才算看过,规则在 client/client.js。
// ---------------------------------------------------------------------------

/** 水位线文件的版本;不认识的版本当空库(猜错会把红点全点亮)。 */
export const UNREAD_SEEN_VERSION = 1

/** 一个库最多留多少条水位线(client/client.js 的 SEEN_MAX 是它的镜像)。 */
export const UNREAD_SEEN_MAX = 400

/** 单个会话 id 的长度上限:挡脏输入,不是安全边界。 */
const SESSION_ID_MAX = 128

/** 水位线文件:`{ version, seen }`;`seen` 是 会话 id → 已确认的最后一次 `turn/end`(宿主时钟域)。 */
export const unreadSeenFileSchema = z.object({
	version: z.number(),
	seen: z.record(z.string(), z.number())
})

/**
 * 把任意输入夹成一张干净的水位线表。
 * 脏 key(空、超长、非字符串)与脏值(非有限数、≤0)直接丢掉,绝不写回文件。
 * @param input - 文件内容、RPC 载荷,或任何东西
 * @returns 只含合法条目的新对象
 */
export function normalizeSeen(input) {
	const out = {}
	if (input === null || typeof input !== 'object') return out
	for (const [id, at] of Object.entries(input)) {
		if (typeof id !== 'string' || id === '' || id.length > SESSION_ID_MAX) continue
		if (typeof at !== 'number' || !Number.isFinite(at) || at <= 0) continue
		out[id] = at
	}
	return out
}

/**
 * 合并一批水位线:逐会话取 max。
 *
 * "标记永不倒退"是这套东西唯一的并发保护:两个浏览器(或两个 dsh 进程)同时写,
 * 后写者也不会把别人更新的标记盖回旧的——那会让已清掉的红点"诈尸"。
 * @param seen - 现有水位线表
 * @param marks - 要并入的标记
 * @returns `{ seen, changed }`,`changed` 表示是否有条目前进
 */
export function mergeSeen(seen, marks) {
	const base = normalizeSeen(seen)
	const incoming = normalizeSeen(marks)
	let changed = false
	for (const [id, at] of Object.entries(incoming)) {
		const previous = base[id]
		if (typeof previous === 'number' && previous >= at) continue
		base[id] = at
		changed = true
	}
	return { seen: base, changed }
}

/**
 * 只留最新的 N 条水位线。
 *
 * 丢掉的都是"很久以前就看过"的记录,不会把红点变回来:客户端对没有标记的会话
 * 按"这台浏览器上次在线"重新起基线,老结束仍算已读(见 client/client.js 的
 * `ensureSeenBaseline`)。所以按时间保留最新即可。
 * @param seen - 水位线表
 * @param max - 上限
 * @returns 新对象
 */
export function pruneSeen(seen, max = UNREAD_SEEN_MAX) {
	const entries = Object.entries(normalizeSeen(seen))
	if (entries.length <= max) return Object.fromEntries(entries)
	entries.sort((a, b) => b[1] - a[1])
	return Object.fromEntries(entries.slice(0, max))
}
