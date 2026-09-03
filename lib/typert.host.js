/* Hand-written typert host manifest for dsh-icon-custom (strict face). */
import { z } from 'zod'

const statusSchema = z.object({
	active: z.boolean(),
	pwa: z.boolean(),
	logo: z.boolean(),
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
				schema: statusSchema
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
						schema: setIconRequestSchema
					}
				}
			],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/setIcon:result',
				schema: setIconResultSchema
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
						schema: setPwaRequestSchema
					}
				}
			],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/setPwa:result',
				schema: statusSchema
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
						schema: setLogoRequestSchema
					}
				}
			],
			result: {
				mode: 'strict',
				typeSymbol: 'dsh-icon-custom#iconCustom/setLogo:result',
				schema: statusSchema
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
				schema: statusSchema
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
					}
				],
				types: []
			}
		],
		events: [],
		objects: []
	}
}
