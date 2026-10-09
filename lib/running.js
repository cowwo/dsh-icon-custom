/**
 * dsh-icon-custom · 「进行中黄点」的开关(宿主半,纯函数)
 *
 * 这里**没有**任何"谁在跑"的事实,一条也没有——那是官方的:
 * 宿主 `ctx.agents.get(id)?.status === 'running'` 经 `api-session/status`
 * 事件实时推到浏览器,客户端会话列表里本来就带着每个会话的 `running`。
 * 这个插件只把那件事**多投影几次**(黄点/黄数字/黄 favicon 角标)。
 *
 * 所以这个文件只有一个布尔开关,和一条纪律:
 * **不落盘"进行中",只落盘"要不要显示"。** 进程重启后冷会话按官方口径
 * 永远是 `running:false`,不会留下一个永远亮着的假黄点;而开关是偏好,
 * 应该跨设备、跨重启跟着你,所以它归宿主,和红点规则并列但互不牵连
 * (见 docs/adr/0010-running-mark-is-a-second-projection.md)。
 */

/** 默认:显示黄点。 */
export const RUNNING_MARK_DEFAULT = true

/**
 * 把任意输入夹成 `{ enabled }`。
 *
 * 只认严格的 `true`/`false`;缺项、脏值、null 一律回落默认——一个读不懂的
 * 开关值不该把一整套标记的可见性变成猜谜。
 * @param input - `{ enabled? }`,可以是脏的、缺项的、null
 * @returns `{ enabled }` —— 永远完整
 */
export function normalizeRunningConfig(input) {
	const source = input !== null && typeof input === 'object' ? input : {}
	return {
		enabled: typeof source.enabled === 'boolean' ? source.enabled : RUNNING_MARK_DEFAULT
	}
}
