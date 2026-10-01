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
	/** 进入会话后要连续待满多少秒才算"看过";0 = 进入即已读。上限 10 分钟。 */
	clearDelaySec: z.number().int().nonnegative().max(600),
	/**
	 * 宿主此刻的 `Date.now()`。
	 * 客户端用它把"看过"水位换算进宿主时钟域(`turn/end.time` 也是宿主时钟):
	 * 浏览器与宿主差几秒,红点就会永远清不掉。
	 */
	hostNow: z.number()
})

const setUnreadRuleRequestSchema = z.object({
	reasons: z.record(z.string(), z.boolean()),
	pending: z.boolean().optional(),
	workspaceDot: z.boolean().optional(),
	clearDelaySec: z.number().int().nonnegative().max(600).optional()
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
						signature: 'async getUnreadRule(): Promise<{ reasons: Record<string, boolean>; pending: boolean; workspaceDot: boolean; clearDelaySec: number; hostNow: number }>',
						description: "Read the unread-badge rule.",
						summary: "Read the unread-badge rule.",
						jsDoc: "/** Read the unread-badge rule. */",
						tags: []
					},
					{
						kind: 'method',
						name: 'setUnreadRule',
						signature: 'async setUnreadRule(request: { reasons: Record<string, boolean>; pending?: boolean; workspaceDot?: boolean; clearDelaySec?: number }): Promise<{ reasons: Record<string, boolean>; pending: boolean; workspaceDot: boolean; clearDelaySec: number; hostNow: number }>',
						description: "Replace the unread-badge rule: which turn-end reasons light the red dot.",
						summary: "Set the unread-badge rule.",
						jsDoc: "/** Set the unread-badge rule. */",
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
