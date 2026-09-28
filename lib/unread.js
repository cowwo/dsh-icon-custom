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
 * 这是全套功能里**唯一贴着产品 DOM 走**的部分(侧栏那片没有插槽),
 * 所以它有自己的开关:一旦 DSH 升级改了结构导致它失效或画歪,
 * 关掉它就行,红点数字/清单/跳转那些稳的部分完全不受影响。
 */
export const UNREAD_WORKSPACE_DOT_DEFAULT = true

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
 * @param input - `{ reasons?, pending? }`,可以是脏的、缺项的、null
 * @returns `{ reasons, pending }` —— 两张表都完整
 */
export function normalizeUnreadConfig(input) {
	const source = input !== null && typeof input === 'object' ? input : {}
	return {
		reasons: normalizeReasons(source.reasons),
		pending: typeof source.pending === 'boolean' ? source.pending : UNREAD_PENDING_DEFAULT,
		workspaceDot: typeof source.workspaceDot === 'boolean' ? source.workspaceDot : UNREAD_WORKSPACE_DOT_DEFAULT
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
