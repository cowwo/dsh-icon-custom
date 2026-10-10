/* Hand-written typert host manifest for dsh-icon-custom (strict face).
 *
 * DSH 0.2.x contract: every strict codec carries a `create()` FACTORY returning
 * its zod schema — the gateway calls `codec.create().parse(value)` and the
 * registry caches the result. The 0.1.x bare `schema:` field is gone; keeping
 * it makes `validateTypertManifest` throw `has no create() factory`, so the
 * host endpoints below never register and the settings page silently stops
 * working (0.8.0 shipped this way — see the 0.8.1 fix). Do not reintroduce
 * `schema:` here: run the compatibility check before publishing.
 *
 * The request/response shapes are unchanged from 0.6.x. From 0.7.0 the host
 * additionally derives a canonical PNG set (see lib/index.js); `status.mime` /
 * `status.ext` still reflect the *uploaded* format, while the PWA/logo path
 * always serves the derived PNGs regardless of upload type. */
import { z } from 'zod'

const statusSchema = z.object({
	active: z.boolean(),
	pwa: z.boolean(),
	logo: z.boolean(),
	png: z.boolean(),
	rev: z.string().nullable(),
	mime: z.string().nullable(),
	ext: z.string().nullable(),
	name: z.string().nullable(),
	size: z.number().int().nonnegative().nullable(),
	savedAt: z.number().int().nonnegative().nullable()
})

const setIconRequestSchema = z.object({
	mime: z.string().min(1),
	name: z.string().max(128).optional(),
	pwa: z.boolean().optional(),
	logo: z.boolean().optional(),
	data: z.string().min(1)
})

const setPwaRequestSchema = z.object({
	enabled: z.boolean()
})

const setLogoRequestSchema = z.object({
	enabled: z.boolean()
})

/**
 * Unread-badge rule: which `turn/end` reasons light the badge, plus whether
 * "someone is waiting for you" counts. Its own endpoint pair on purpose — the
 * icon RPCs above keep their exact pre-badge response shape.
 */
const unreadRuleSchema = z.object({
	reasons: z.record(z.string(), z.boolean()),
	pending: z.boolean(),
	/** 实验项:工作区图标上的红点(贴产品 DOM,可一键关闭)。 */
	workspaceDot: z.boolean(),
	/** 在系统应用图标上显示角标(安装为应用后生效);只决定"设几/清空",样子由系统决定。 */
	appBadge: z.boolean(),
	/** 进入会话后要连续待满多少秒才算"看过";0 = 进入即已读。上限 10 分钟。 */
	clearDelaySec: z.number().int().nonnegative().max(600),
	/** 实验项:点清单条目时在侧栏定位到该会话(展开工作区 + 滚动 + 闪一下;贴产品 DOM,可一键关闭)。 */
	revealOnOpen: z.boolean(),
	/**
	 * 宿主此刻的 `Date.now()`。
	 * 客户端用它把"看过"水位换算进宿主时钟域(`turn/end.time` 也是宿主时钟):
	 * 浏览器与宿主差几秒,红点就会永远清不掉。
	 */
	hostNow: z.number(),
	/**
	 * 宿主持有的"已读"水位线:会话 id → 已确认的最后一次 `turn/end`(宿主时钟域)。
	 *
	 * 它是真相,浏览器那份是缓存 + 离线队列;随本响应一起下发是为了不新增读端点
	 * (老客户端忽略这个字段即可)。客户端拿它按会话取 max 合并。
	 */
	seen: z.record(z.string(), z.number())
})

const setUnreadRuleRequestSchema = z.object({
	reasons: z.record(z.string(), z.boolean()),
	pending: z.boolean().optional(),
	workspaceDot: z.boolean().optional(),
	appBadge: z.boolean().optional(),
	clearDelaySec: z.number().int().nonnegative().max(600).optional(),
	revealOnOpen: z.boolean().optional()
})

/** 一次水位线同步:浏览器把自己那份交上来,宿主逐会话取 max 后回权威表。 */
const setUnreadSeenRequestSchema = z.object({
	marks: z.record(z.string(), z.number())
})

const unreadSeenSchema = z.object({
	seen: z.record(z.string(), z.number())
})

/**
 * 进行中黄点的开关。
 *
 * 这里**没有**"谁在跑"的字段,一条都没有:那是官方的 `SessionSummary.running`,
 * 由官方宿主实时推给浏览器,插件只读不存。宿主这一侧只有"要不要显示"这一个偏好,
 * 和红点规则并列、互不牵连(自己的端点对、自己的文件)。
 */
const runningRuleSchema = z.object({
	enabled: z.boolean()
})

const setRunningRuleRequestSchema = z.object({
	enabled: z.boolean().optional()
})

const setIconResultSchema = statusSchema

export const TYPERT = {
	package: 'dsh-icon-custom',
	face: 'host',
	schemas: [],
	invocations: [
		{
			id: 'dsh-icon-custom#iconCustom/getStatus',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'getStatus',
			invocation: { kind: 'direct' },
			parameters: [],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/getStatus:result',
				create: () => statusSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		},
		{
			id: 'dsh-icon-custom#iconCustom/setIcon',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'setIcon',
			invocation: { kind: 'direct' },
			parameters: [
				{
					name: 'request',
					wire: 'request',
					source: 'json',
					codec: {
						mode: 'strict',
						typeSymbol: 'dsh-icon-custom#iconCustom/setIcon:request',
						create: () => setIconRequestSchema
					}
				}
			],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/setIcon:result',
				create: () => setIconResultSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		},
		{
			id: 'dsh-icon-custom#iconCustom/setPwa',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'setPwa',
			invocation: { kind: 'direct' },
			parameters: [
				{
					name: 'request',
					wire: 'request',
					source: 'json',
					codec: {
						mode: 'strict',
						typeSymbol: 'dsh-icon-custom#iconCustom/setPwa:request',
						create: () => setPwaRequestSchema
					}
				}
			],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/setPwa:result',
				create: () => statusSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		},
		{
			id: 'dsh-icon-custom#iconCustom/setLogo',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'setLogo',
			invocation: { kind: 'direct' },
			parameters: [
				{
					name: 'request',
					wire: 'request',
					source: 'json',
					codec: {
						mode: 'strict',
						typeSymbol: 'dsh-icon-custom#iconCustom/setLogo:request',
						create: () => setLogoRequestSchema
					}
				}
			],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/setLogo:result',
				create: () => statusSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		},
		{
			id: 'dsh-icon-custom#iconCustom/resetIcon',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'resetIcon',
			invocation: { kind: 'direct' },
			parameters: [],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/resetIcon:result',
				create: () => statusSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		},
		{
			id: 'dsh-icon-custom#iconCustom/getUnreadRule',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'getUnreadRule',
			invocation: { kind: 'direct' },
			parameters: [],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/getUnreadRule:result',
				create: () => unreadRuleSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		},
		{
			id: 'dsh-icon-custom#iconCustom/setUnreadRule',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'setUnreadRule',
			invocation: { kind: 'direct' },
			parameters: [
				{
					name: 'request',
					wire: 'request',
					source: 'json',
					codec: {
						mode: 'strict',
						typeSymbol: 'dsh-icon-custom#iconCustom/setUnreadRule:request',
						create: () => setUnreadRuleRequestSchema
					}
				}
			],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/setUnreadRule:result',
				create: () => unreadRuleSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		},
		{
			id: 'dsh-icon-custom#iconCustom/getRunningRule',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'getRunningRule',
			invocation: { kind: 'direct' },
			parameters: [],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/getRunningRule:result',
				create: () => runningRuleSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		},
		{
			id: 'dsh-icon-custom#iconCustom/setRunningRule',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'setRunningRule',
			invocation: { kind: 'direct' },
			parameters: [
				{
					name: 'request',
					wire: 'request',
					source: 'json',
					codec: {
						mode: 'strict',
						typeSymbol: 'dsh-icon-custom#iconCustom/setRunningRule:request',
						create: () => setRunningRuleRequestSchema
					}
				}
			],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/setRunningRule:result',
				create: () => runningRuleSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		},
		{
			id: 'dsh-icon-custom#iconCustom/setUnreadSeen',
			service: 'iconCustom',
			namespace: 'iconCustom',
			method: 'setUnreadSeen',
			invocation: { kind: 'direct' },
			parameters: [
				{
					name: 'request',
					wire: 'request',
					source: 'json',
					codec: {
						mode: 'strict',
						typeSymbol: 'dsh-icon-custom#iconCustom/setUnreadSeen:request',
						create: () => setUnreadSeenRequestSchema
					}
				}
			],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/setUnreadSeen:result',
				create: () => unreadSeenSchema
			},
			sourceLocation: { file: 'lib/index.js', line: 1, column: 1 }
		}
	],
	model: {
		services: [
			{
				description: "Stores a user-supplied favicon and serves it at /icon-custom.svg, rewriting the document-head icon link only when a custom icon is set.",
				summary: "Custom browser tab favicon.",
				jsDoc: "/** Custom browser tab favicon. */",
				tags: [],
				key: 'iconCustom',
				exportName: 'FaviconCustomService',
				members: [
					{
						kind: 'method',
						name: 'getStatus',
						signature: 'async getStatus(): Promise<{ active: boolean; pwa: boolean; logo: boolean; rev: string | null; mime: string | null; ext: string | null; name: string | null; size: number | null; savedAt: number | null }>',
						description: "Read the current favicon status.",
						summary: "Read the current favicon status.",
						jsDoc: "/** Read the current favicon status. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'setIcon',
						signature: 'async setIcon(request: { mime: string; name?: string; pwa?: boolean; logo?: boolean; data: string }): Promise<{ active: boolean; pwa: boolean; logo: boolean; rev: string | null; mime: string | null; ext: string | null; name: string | null; size: number | null; savedAt: number | null }>',
						description: "Store a new favicon uploaded as a data URL.",
						summary: "Store a new favicon.",
						jsDoc: "/** Store a new favicon. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'setPwa',
						signature: 'async setPwa(request: { enabled: boolean }): Promise<{ active: boolean; pwa: boolean; logo: boolean; rev: string | null; mime: string | null; ext: string | null; name: string | null; size: number | null; savedAt: number | null }>',
						description: "Toggle whether the active custom icon also replaces the PWA install icon.",
						summary: "Toggle the PWA-icon option.",
						jsDoc: "/** Toggle the PWA-icon option. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'setLogo',
						signature: 'async setLogo(request: { enabled: boolean }): Promise<{ active: boolean; pwa: boolean; logo: boolean; rev: string | null; mime: string | null; ext: string | null; name: string | null; size: number | null; savedAt: number | null }>',
						description: "Toggle whether the active custom icon also replaces the in-app sidebar brand mark.",
						summary: "Toggle the brand-mark option.",
						jsDoc: "/** Toggle the brand-mark option. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'resetIcon',
						signature: 'async resetIcon(): Promise<{ active: boolean; pwa: boolean; logo: boolean; rev: string | null; mime: string | null; ext: string | null; name: string | null; size: number | null; savedAt: number | null }>',
						description: "Clear the active custom favicon marker so the platform icon is used; stored icon files are kept.",
						summary: "Clear the custom favicon.",
						jsDoc: "/** Clear the custom favicon. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'getUnreadRule',
						signature: 'async getUnreadRule(): Promise<{ reasons: Record<string, boolean>; pending: boolean; workspaceDot: boolean; appBadge: boolean; clearDelaySec: number; revealOnOpen: boolean; hostNow: number; seen: Record<string, number> }>',
						description: "Read the unread-badge rule, the Host clock and the seen watermark.",
						summary: "Read the unread-badge rule.",
						jsDoc: "/** Read the unread-badge rule. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'setUnreadRule',
						signature: 'async setUnreadRule(request: { reasons: Record<string, boolean>; pending?: boolean; workspaceDot?: boolean; appBadge?: boolean; clearDelaySec?: number; revealOnOpen?: boolean }): Promise<{ reasons: Record<string, boolean>; pending: boolean; workspaceDot: boolean; appBadge: boolean; clearDelaySec: number; revealOnOpen: boolean; hostNow: number; seen: Record<string, number> }>',
						description: "Replace the unread-badge rule: which turn-end reasons light the red dot.",
						summary: "Set the unread-badge rule.",
						jsDoc: "/** Set the unread-badge rule. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'setUnreadSeen',
						signature: 'async setUnreadSeen(request: { marks: Record<string, number> }): Promise<{ seen: Record<string, number> }>',
						description: "Merge this browser's seen watermarks into the Host's copy (max per session).",
						summary: "Merge the seen watermark.",
						jsDoc: "/** Merge the seen watermark. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'getRunningRule',
						signature: 'async getRunningRule(): Promise<{ enabled: boolean }>',
						description: "Read the running-mark switch (yellow mark for sessions that are running right now).",
						summary: "Read the running-mark switch.",
						jsDoc: "/** Read the running-mark switch. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'setRunningRule',
						signature: 'async setRunningRule(request: { enabled?: boolean }): Promise<{ enabled: boolean }>',
						description: "Flip the running-mark switch. The running fact itself is official and is never stored here.",
						summary: "Set the running-mark switch.",
						jsDoc: "/** Set the running-mark switch. */",
						tags: []
					}
				],
				types: []
			}
		],
		events: [],
		objects: []
	}
}
