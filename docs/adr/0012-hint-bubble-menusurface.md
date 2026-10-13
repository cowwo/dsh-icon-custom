# 问号浮层改用 MenuSurface + 自管开合,Tooltip 因 label 限 string 被淘汰

## Status

accepted

## Context

需求是"设置页的 13 条长说明折叠成『短摘要 + 圆圈问号浮层』,浮层里的重要文字要**真加粗**"。折叠本身已经在做,卡住的是加粗:现有实现把整条 `props.text` 交给官方 `Tooltip` 的 `label`。动手前查实的四条事实:

1. **`Tooltip.label` 只收纯文本。** 类型是 `string | (() => string)`(`@deepseek-ai/dsh-client-ui-primitives/lib/types/Tooltip.d.ts:20`),气泡里没有任何可以塞 React 节点的入口。`**...**` 只会原样显示成两个星号,变不成 `<strong>`——这不是样式问题,是接口能力问题。
2. **`MenuSurface` 收任意子节点。** 它的 props 是 `ComponentPropsWithoutRef<'div'>`(同包 `lib/types/MenuSurface.d.ts:4`),即 `children` 与原生 div 属性都直接透传到那个 div;`compact?` 只控制更小圆角。它给的是**材质**(fill / radius / border / blur,以及 macOS 那块不透明 backing),既不管定位,也不管开合。
3. **官方包不保证拿得到。** 客户端这一半经 `window.__ModuleLoader__` 的 `require` 加载,没有构建步骤;`require` 打不中模块表就抛。浮层必须能退回自绘,不能白屏。
4. **Tooltip 曾经替我们做掉的事**:定位、portal、点开、再点关、点空白关、ESC 关、视口夹取。改用自定义容器,这些要自己接回来或自己保。

## Decision

**容器与开合拆开:容器优先用官方 `MenuSurface`,拿不到就用插件内联样式自绘;开合与定位由插件自管。**

- **开合自管,两条路共用同一段状态机**(`HintDisclosureBubble`):点问号开;再点问号 / 点空白(`mousedown` 捕获)/ ESC 关。气泡带 `data-icon-custom-hint="1"` 标记——`MenuSurface` 会把原生 div 属性透传下来,所以点进气泡里不会误判成"点空白"。
- **定位沿用既有纯函数 `hintBubblePlacement`**:贴着问号按钮下方,夹进视口。传给 `MenuSurface` 的只有 placement(定位 / 宽度 / 滚动),**不传**我们的 fill / border / boxShadow,材质留给官方画。
- **`MenuSurface` 拿不到时退回自绘气泡**,同一份内联样式(原有视觉 token:`--dsw-alias-label-primary`、`bg-layer-1`、`border-l2`),同样支持加粗。两条路都不抛。
- **内容渲染是纯函数** `hintTextNodes`:`**pair**` 成对 → 真 `<strong>`(加粗 + `--dsw-alias-label-primary` 强调),标记符不上屏;`**` 未成对 → 原样保留,不丢字。摘要行是纯文本,不含任何标记。
- **官方包懒解析 + `try/catch`**:成功即记忆,失败下次渲染再试(插件可能先于原语被物化),失败时 `surface === null` 走自绘。
- **无障碍不变**:问号按钮的 `aria-label` / `title` 保留;气泡 `role="dialog"` + `aria-label`。

## Consequences

- **Tooltip 原本替我们做的事,现在由插件自己维护**:开合状态、点空白、ESC、视口夹取(约 30 行)。官方以后给 Tooltip 加的行为(比如钉住的持久化、更聪明的翻边)不会自动落到这个浮层上。
- **材质仍在官方手里**:主题 token 一变,浮层跟着变;但浮层不再是"官方 Tooltip 语义"的节点,官方对 Tooltip 的测试与无障碍契约不覆盖它。
- **`MenuSurface` 在 macOS 会往 body 挂一块非交互 backing**(`pointer-events: none`,见其 CSS),因此不干扰"点空白关闭"。
- **加粗只在这条自渲染路径上成立**:任何回到 `Tooltip.label` 的做法都会让 `**` 重新露到界面上,所以这条裁决以本 ADR 锁住,并由 `test/hint-disclosure.mjs` 把"成对转换 / 未成对原样 / 两条路都出加粗节点"钉死。

## 备选方案(未采用)

- **继续用 Tooltip,把 `**` 换成别的纯文本标记(如「」或全角引号)。** 满足不了"重要文字加粗"这条既定需求,等于把需求降级成"看起来有点强调"。
- **HoverCard。** 内容可以是节点,但它是"悬停展开预览"的语义,没有"点击钉住、再点关闭"的既定行为;开合照样要自管,却白白多欠一层官方交互语义。
- **完全自绘,不 `require` 官方包。** 与主题脱节,也违背仓库"能借官方材质就借"的惯例;而且丢掉了官方材质随主题升级自动跟进的好处。
- **包装 Tooltip / 改官方包,把 `label` 换成节点。** 要么 hack 官方内部渲染,要么改 `node_modules`,两条都越界。
