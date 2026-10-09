# 通知权限:单独探测、只在用户手势里申请、不拿它门禁角标调用

## Status

accepted(0.17.0 起)

## Context

0.11.1 定下角标做法时,只把 Windows 当目标平台,macOS / iOS 记作"未验证";通知权限被当成 **iOS 独有**的一道门(ADR 0005 第 2 条),于是 iOS 那行写的是"本版不申请通知权限,所以不会出现"。

用户问"Mac 上 PWA 图标能不能显示红点"时,把这条重查了一遍,结论是 **macOS 同罪**,而且这件事对本插件是致命的:

1. **Apple 把角标权限绑在通知权限上**。支持文档原文:"Web apps support an additional notifications feature: The number of unread notifications appears as a red badge on the app's icon in the Dock. **To use this feature, respond to the website's notifications request in the web app, not in Safari.**"WWDC23《What's new in web apps》更直接:"Since badging and push notifications are so closely associated on macOS, iOS, and iPadOS, **when users allow a web app to send notifications, that includes permissions for the web app to use badging.**"
2. **Safari 在 macOS 上确实支持角标**,但要 macOS Sonoma 14+ 的「添加到程序坞」:MDN 兼容数据原文 "Badging is supported for installed web apps on macOS Sonoma and higher"(Safari 17 起)。WebKit 的 bug 275797(macOS:setAppBadge() 在应用关着时不生效)也把"程序坞图标上的角标"当成既定行为。
3. **Chromium 那边不需要通知权限**。MDN 记的是 Chrome 自 81 起即支持 Windows 与 macOS;源码链 `badge_manager_delegate_mac.cc` → `AppShimManager::UpdateAppBadge` → `AppShimController::SetBadgeLabel` → `NSApp.dockTile.badgeLabel` 里没有任何权限判断。

所以不处理的话,Mac 用户用 Safari 装会出现最糟的一种状态:**API 在、调用成功、什么都不画**——和安卓的静默无效同类,而且从页面里探测不到。

同时顺手纠正 ADR 0005 的两处事实:通知权限不止 iOS;以及 "macOS / iOS 由系统保留最后一次的值" 不成立——Chromium 的 `UpdateAppBadge` 里挂着 `TODO(crbug.com/40761338): Support updating the app badge for apps that aren't currently running`,未运行的应用连值都没有地方存。

## Decision

### A. 权限是**另一个**探测,不塞进 `badgeCapabilityProbe`

那三个事实(安全上下文 / 有没有 API / 是不是已安装应用)回答的是"这台机器有没有能力设置角标",挂载时采样一次就够,而且测试锁死了它的形状。权限不同:它要**活的**(用户可能去系统设置里改)、要**一个按钮**(申请必须发生在用户手势里)。所以新增 `notificationPermission*` 一族,输出 `{ state, canRequest }`,`state ∈ granted | denied | default | unsupported`。

### B. 唯一申请入口:`requestNotificationPermission()`

和 `applyAppBadge` 一样,整个客户端只有一处真去调浏览器。必须由 click 触发(WebKit 与 Chromium 都会丢掉没有激活的弹窗);同时兼容现代 Promise 形态与老 Safari 的回调形态;**永不 reject**——reject(不是用户手势、或 WebKit 上不是已安装应用)时回落到重读 `.permission`,否则页面会被一个挂住的 Promise 卡住。

### C. 按钮只在"还没问过"时出现

已授予没什么可问;已被拒绝时浏览器不会再弹,给一个点了没反应的按钮就是骗人——那一行改为直接说"要去系统设置的「通知」里打开"。没有 Notification API 时按钮也不出现。

### D. **不**用权限门禁 `applyAppBadge`

Chromium 不需要它;WebKit 没权限时的失败不可探测。ADR 0005 的"探测到 API 就调、探测不到就什么都不做"继续成立——加的只是**前置条件的可见性**,不是新的判断分支。这一条是刻意的:一旦按权限门禁,就等于在一个平台差异上再叠一层猜。

### E. 变成"已授予"的那一刻,强制重设一次数字

WebKit 在没权限时把之前所有 `setAppBadge()` 都丢掉了,所以授权成功时系统图标上没有数字。两条路径(按钮的回调、订阅到的页面外变化)都走同一个 `onPermissionChanged`,它只在 `state === "granted"` 时 `reconcileAppBadge(true)`。

### F. 订阅页面外的改动

`navigator.permissions.query({ name: "notifications" })` 的 `change` 是精确通道;`focus` / `visibilitychange` / `pageshow` 上重读是 WebKit 不一定实现该 descriptor 时的兜底。只在事实真的变了才播报(挂载时先用手上的读数播种,不重复播报设置页已经渲染过的值),卸载时摘掉全部监听与 `change` 订阅。

### G. 文案只说事实

新文案必须同时说清三件事:(1) 这是 **Apple / Safari 的规则**,不是插件的开关;(2) **Chrome / Edge 不需要**这一步;(3) 这里**只申请权限,不发通知**。并且不承诺"角标一定会出现"——那是系统说了算。

## Consequences

- **Safari(macOS 程序坞 / iOS 主屏)从"永远不出现"变成"有一条路"**:点一次「允许通知」。角标仍然只在应用窗口活着时由本插件更新——没有推送服务,窗口全关就没有代码在跑。
- **申请权限却不发通知**,用户会看到一次系统弹窗;设置页文案已说明用途,将来若做 Web Push,这套权限读取与订阅可以直接复用。
- **macOS Chrome / Edge 不需要授权**,理论上直接可用;但本机是 Linux,没有 macOS 可实测,README 里仍标"未在真机实测"。
- **文档同步修正**:README 中/英平台矩阵、ADR 0005 的修订注、CONTEXT.md 新增「通知权限」词条与「角标能力探测」的措辞。
- 回归测试:`test/notification-permission.mjs`(归一化、探测、文案键、按钮条件、两种申请形态、reject / 抛错回落、绝不自动申请、订阅与退订、字典完整性)。

## 出处

- Apple 支持《Use Safari web apps on Mac》——"The number of unread notifications appears as a red badge on the app's icon in the Dock. To use this feature, respond to the website's notifications request in the web app, not in Safari":<https://support.apple.com/en-us/104996>
- WWDC23《What's new in web apps》——"when users allow a web app to send notifications, that includes permissions for the web app to use badging":<https://developer.apple.com/videos/play/wwdc2023/10120/>
- WebKit 博客《Badging for Home Screen Web Apps》——"the badge will only appear if the user has granted notifications permission":<https://webkit.org/blog/14112/badging-for-home-screen-web-apps/>
- MDN 兼容数据 `api/Navigator.json`——Safari:"Badging is supported for installed web apps on macOS Sonoma and higher";Chrome:"Windows and macOS since Chrome 81":<https://github.com/mdn/browser-compat-data/blob/main/api/Navigator.json>
- Chromium:`badge_manager_delegate_mac.cc`(macOS 走 app shim)、`app_shim_manager_mac.cc`(`UpdateAppBadge` 与 `TODO(crbug.com/40761338): Support updating the app badge for apps that aren't currently running`)、`app_shim_controller.mm`(`NSApp.dockTile.badgeLabel = ...`)、`badge_manager.cc`(`GetBadgeString`:无参 → `•`,超过 `kMaxBadgeContent = 99` → `99+`):<https://chromium.googlesource.com/chromium/src/+/main/chrome/browser/badging/badge_manager_delegate_mac.cc>
- WebKit bug 275797《macOS: setAppBadge() not called by service worker if pwa is closed》——把"程序坞图标上的角标"当既定行为(应用关着时不生效):<https://bugs.webkit.org/show_bug.cgi?id=275797>
