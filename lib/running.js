/**
 * dsh-icon-custom · 「进行中黄点」的开关(宿主半,纯函数)
 *
 * 这里**没有**任何"谁在跑"的事实,一条也没有——那是官方的:
 * 宿主 `ctx.agents.get(id)?.status === 'running'` 经 `api-session/status`
 * 事件实时推到浏览器,客户端会话列表里本来就带着每个会话的 `running`。
 * 这个插件只把那件事**多投影几次**(黄点/黄数字/黄 favicon 角标)。
 *
 * 所以这个文件只有几个布尔开关,和一条纪律:
 * **不落盘"进行中",只落盘"要不要显示"。** 进程重启后冷会话按官方口径
 * 永远是 `running:false`,不会留下一个永远亮着的假黄点;而开关是偏好,
 * 应该跨设备、跨重启跟着你,所以它归宿主,和红点规则并列但互不牵连
 * (见 docs/adr/0010-running-mark-is-a-second-projection.md)。
 */

/** 默认:显示黄点。 */
export const RUNNING_MARK_DEFAULT = true

/**
 * 默认:把子代理的「进行中」算到它所属的会话上。
 *
 * 和上面那个开关是**两个问题**:「要不要画黄点」与「子代理在跑,算不算它上面那个
 * 会话在跑」。子代理自己没有会话行(官方侧栏根本不渲染),所以它跑得再欢,真正属于
 * 用户的那个会话看上去也是空闲的;默认聚合上去,黄点才反映「有活正在干」。
 * 聚合只影响计数归属:子代理自己的行照旧不画,等待你(琥珀色)的祖先也照旧不算。
 */
export const RUNNING_INCLUDE_SUBAGENTS_DEFAULT = true

/**
 * 默认:在会话头部那颗「N 个子智能体」计数上叠一个黄圈。
 *
 * 第三个问题,同样独立:前两个开关决定「黄点画不画」「子代理算不算到祖先」,
 * 这一个只决定「会话头部那颗计数上要不要再叠一个运行数」。它不参与任何既有
 * 计数(侧栏红黄点、左上角数字、favicon、系统角标),关掉它一个数字都不会动。
 */
export const RUNNING_HEADER_RING_DEFAULT = true

/**
 * 把任意输入夹成 `{ enabled, includeSubagents, headerRing }`。
 *
 * 只认严格的 `true`/`false`;缺项、脏值、null 一律回落默认——一个读不懂的
 * 开关值不该把一整套标记的可见性变成猜谜。
 * @param input - `{ enabled?, includeSubagents?, headerRing? }`,可以是脏的、缺项的、null
 * @returns `{ enabled, includeSubagents, headerRing }` —— 永远完整
 */
export function normalizeRunningConfig(input) {
	const source = input !== null && typeof input === 'object' ? input : {}
	return {
		enabled: typeof source.enabled === 'boolean' ? source.enabled : RUNNING_MARK_DEFAULT,
		includeSubagents: typeof source.includeSubagents === 'boolean' ? source.includeSubagents : RUNNING_INCLUDE_SUBAGENTS_DEFAULT,
		headerRing: typeof source.headerRing === 'boolean' ? source.headerRing : RUNNING_HEADER_RING_DEFAULT
	}
}
