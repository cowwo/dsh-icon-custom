# 应用图标角标:探测到就调、只镜像数字、不扩展"已读"语义

## Status

accepted

## Context

需求是「Win / mac / Android / iOS / 鸿蒙 上 PWA 安装后的**应用图标**显示红点通知」。查完一手资料(每条都有出处,见文末),有四条事实决定了做法:

1. **真正实现 Badging API 的只有一半平台**。Windows / macOS 的 Chromium 81+、macOS Safari 17+("添加到程序坞")、iOS/iPadOS Safari 16.4+(主屏应用)。**安卓 Chromium 没有实现**:方法在 `navigator` 上存在,但 native 调用被 `#if !BUILDFLAG(IS_ANDROID) && !BUILDFLAG(IS_IOS) && !BUILDFLAG(IS_FUCHSIA)` 编译掉了,调用只会静默 resolve;安卓启动器上的圆点**只能由"活动通知"产生**。鸿蒙无任何公开实现证据(华为只文档化"添加到桌面快捷方式",上限 10 个),原生角标只能 ArkTS 设。Firefox 全无。
2. **探测到 API ≠ 角标会出现**。安卓、Linux 上方法存在而静默无效;iOS 上还额外要求**用户已授予通知权限**(WebKit 原文:"the badge will only appear if the user has granted notifications permission"),而申请权限必须在用户手势里调 `Notification.requestPermission()`。
3. **样子由系统决定,我们无权定制**。Windows 上 Chrome 自己画**深色圆 + 白字**,做成**任务栏按钮上的覆盖图标**;Edge 走 Windows 系统徽章通道,外观是系统样式,**是否显示数字由 Edge/Windows 决定**(官方文档支持数字,但本机在 Windows 11 上实测 `setAppBadge(7)` 只显示一个系统蓝点)。两者都只作用于**开着的应用窗口**;窗口关掉角标就没了(不是开始菜单/磁贴角标);数字超过 99 由 Chrome 饱和为 `99+`(`kMaxBadgeContent = 99u`)。
4. **没有推送服务**。这是自托管 localhost 应用,没有 VAPID、没有 push 服务,所以**角标只能在某个应用窗口活着时更新**;窗口全关之后,没有任何代码在跑,连"保持数字新鲜"都做不到(Notification Triggers 已被 Chrome 官方放弃,Periodic Background Sync 需要浏览器进程活着且在安卓上无意义)。

另外:调用本身**不需要** service worker,但**需要安全上下文**(IDL 上标了 `[SecureContext]`),所以局域网 `http://192.168.x.x` 访问时 API 根本不存在;在**未安装**的普通标签页里调用,Chrome 静默无操作、Safari 直接没有这个方法(因此必须 guard,否则是 TypeError)。

## Decision

### 先交付 Windows,但代码不按平台门禁

本轮只把 Windows(Chromium 81+、已安装为应用)作为目标平台,但代码**不**判断平台、**也**不判断"是否已安装"——按 Chrome 官方建议,探测到 API 就调,探测不到就什么都不做。理由是同一行代码在 macOS 上也成立,按平台门禁只会在将来多一处要删的分支;而"已安装"这个判断一旦做错(比如平台 manifest 用的是 `display: fullscreen`,只测 `display-mode: standalone` 会永远误报"这是标签页"),代价比什么都不判断更高。

### 数字严格同值,插件不截断

角标数字 = 页内红点数字,**同一个 `effectiveCount()`**,不做二次计算;也**不**在这里截断(系统自己会显示 `99+`,在两处各自实现一套饱和规则,正是两个投影开始不一致的起点)。"手动测试"来源的数字**同样**推给系统角标——否则这条最容易踩平台差异的能力无法在真机上快速验证。

### 只镜像,不扩展"已读"语义

清除只由"计数变 0"触发;**不**在失焦、`pagehide`、关窗时清除,也**不**新增"聚焦即已读"。这一条是刻意的:0.9.x 刚把"正在看的会话不算未读"这条例外**删掉**(浏览器半边分不清"在看"和"开着"),从角标这条后门把它加回来会让两个投影打架。开关关掉时**清空**角标(而不是放着不管)——留一个数字在系统图标上,读起来就是 bug。

### 本轮不做通知、不做 service worker

Windows 一个都不需要;安卓/iOS 需要(一个要通知权限、一个整条路都靠通知),等做移动端时另开一轮,复用本轮的**角标投影**。不做的另一个理由是:这两样在自托管场景下都拿不到"应用关着也能响"的能力,做了也只是把"窗口活着才有用"这件事搬到更多代码里。

### 设置项默认开,并配一行只报本机事实的能力自检

默认开:它只是同一个数字在系统图标上的投影,默认关等于没人知道有这功能。自检行只报**本机此刻**的三个事实(安全上下文 / 有没有 API / 是不是已安装的应用),**不**报"这个平台支不支持",也**不**承诺角标会出现——并在文案里固定带一句"是否真正显示由系统决定"。角标投递不可探测,所以文案不许替系统许诺。

### 幂等是必需品

`notifyBadge()` 会被 DOM 观察器和 5 秒看门狗反复触发(见 ADR 0004 的对账机制),而每次 `setAppBadge` 都是一次到浏览器进程的 IPC + 一次任务栏重绘。适配器按"投影结果"去重,相同即不调;首屏直接按当前值设,不先清后设(会闪)。另外**永远传数字**,不传"无参数的圆点形式"——WebKit 上无参调用可能**移除**已有角标。

但去重不能是永久沉默:`setAppBadge`/`clearAppBadge` 的 Promise reject 时清掉去重记忆,下一轮对账重试;另有一个 **5 秒低频看门狗**,只在投影仍要求正向数字时调用一次强制重发,防止 Windows/Edge 在设置成功后用系统通知点覆盖数字(最终是否画成数字仍由系统决定)。

## Consequences

- **关掉应用后角标消失(Windows)**;macOS / iOS 由系统保留最后一次的值。这不是 bug,README 显眼处已写明"只在应用窗口开着时更新、关窗即消失"。
- **Edge 的系统徽章链可能只画点**:5 秒看门狗会尝试重设数字,但最终渲染由 Edge/Windows 决定;这不是插件能绕过的。
- **安卓用户会看到开关但看不到效果**:因为 `setAppBadge` 在安卓上存在且静默无效。由能力自检那句"本机可以设置角标,是否真正显示由系统决定"解释,并靠 README 平台矩阵说明。
- **iOS 上暂时不会出现角标**(本版不申请通知权限);要出现就得连通知功能一起做,那正是下一轮。
- 本轮只走 `navigator.setAppBadge`,不碰 favicon 合成、不碰 manifest 路由、不碰那 5 个图标 RPC 的返回形状;角标坏了就是"少了系统图标上那个数字",页内红点不受影响。
- 宿主侧只多一个布尔字段(`unread.json` 里的 `appBadge`),老客户端忽略它,老宿主的响应被客户端归一化成默认值。

## 出处

- MDN《Display a badge on the app icon》——"The badging API is not supported on Chromium-based browsers running on Android. Instead, Android automatically shows a badge on the PWA's app icon when there is an unread notification":<https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Display_badge_on_app_icon>
- WebKit 博客《Badging for Home Screen Web Apps》——"the badge will only appear if the user has granted notifications permission":<https://webkit.org/blog/14112/badging-for-home-screen-web-apps/>
- W3C Badging API 规范(算法、错误、`0` 等价于清空、`[SecureContext]`):<https://www.w3.org/TR/badging/>
- Chromium `navigator_badge.cc`(安卓/iOS 被编译掉)、`badge_manager.h`(`kMaxBadgeContent = 99`)、`taskbar_decorator_win.cc`(Windows 画在任务栏按钮上):<https://chromium.googlesource.com/chromium/src/+/main/third_party/blink/renderer/modules/badging/navigator_badge.cc>
- Chrome 官方《Badging API》——"Just call the API when it exists… If it works, it works. If not, it simply doesn't":<https://developer.chrome.com/docs/capabilities/web-apis/badging-api>
- 鸿蒙原生角标只能 ArkTS 设:<https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V14/notification-badge-V14>
