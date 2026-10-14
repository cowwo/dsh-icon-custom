window.__ModuleLoader__.load({
	id: "dsh-icon-custom",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		let React = require("react");

		//#region locales
		const NS = "dsh-icon-custom";
		const zh = {
			nav: "icon管理",
			current: "当前图标",
			none: "使用平台默认图标",
			upload: "上传图标",
			uploadHint: "支持 SVG、PNG、ICO,最大 10 MB。SVG 会自动转成 PNG,自动适配安卓/iOS/平板的主屏图标。上传后立即生效,刷新页面也会保留。",
			uploadHintSummary: "支持 SVG/PNG/ICO,≤10 MB,上传即生效。",
			svgFail: "该 SVG 无法转换,请改用 PNG。",
			reset: "恢复默认",
			resetHint: "清除自定义图标并回到平台默认图标。",
			replace: "替换",
			replacing: "上传中…",
			resetting: "恢复中…",
			name: "名称",
			size: "大小",
			updated: "更新时间",
			successUpload: "已应用新图标",
			successReset: "已恢复默认图标",
			pwa: "同时替换 PWA 安装图标",
			pwaHint: "安装为应用(添加到主屏幕)后,桌面上的图标也换成这张;已安装的应用可能需要重新安装才会更新。",
			pwaHintSummary: "装成应用后桌面图标也换成这张,可能要重装。",
			successPwa: "PWA 图标设置已更新",
			logo: "同时替换页面 Logo 图标",
			logoHint: "把网页左上角品牌 logo 里的鲸鱼图标换成这张(不影响 deepseek HARNESS 文字)。",
			logoHintSummary: "把左上角品牌 logo 里的鲸鱼换成这张。",
			successLogo: "页面 Logo 已更新",
			fail: "操作失败",
			noFile: "请先选择图标文件",
			hintMoreLabel: "查看完整说明",
			badgeTest: "未读红点",
			badgeSourceLabel: "数据来源:",
			badgeSourceReal: "真实未读",
			badgeSourceManual: "手动测试",
			badgeTestUnit: "0 = 不显示",
			badgeSizeLabel: "红点大小:",
			badgeSizeHint: "单独出现时按这三档决定大小;红黄两颗数字同时出现时(未读 + 进行中),它们会一起缩到能塞下的最大尺寸 —— 这时三档画出来是一样的,因为画布就这么大。",
			badgeSizeHintSummary: "单独出现按三档;红黄同框时一起缩到能容纳。",
			badgeSizeSmall: "小",
			badgeSizeMedium: "中",
			badgeSizeLarge: "大",
			unreadReasonsLabel: "哪些情况算未读(勾选即生效):",
			reasonCompleted: "干完一轮",
			reasonError: "报错",
			reasonBlocked: "被卡住",
			reasonMaxTokens: "输出超限",
			reasonInterrupted: "崩溃中断",
			reasonAbortedUser: "我自己停止",
			reasonAbortedOther: "其他中断",
			reasonPending: "有人在等我(审批/提问/计划)",
			unreadIncludeSubagentsLabel: "子代理引起的结束也算未读",
			unreadIncludeSubagentsHint: "后台子代理跑完时,运行时会把它所属的会话**再叫醒跑一轮**;这一项决定那一轮结束算不算未读。关掉它:由子代理唤醒的那一轮结束不再亮红点,你自己发起的一轮照旧提醒(子代理自己没有会话行,一直都不算)。打开(默认)= 和以前完全一样。判定依据是官方日志里的那条「子代理结算」消息(`subagent-settled` / `agent-message`),所以一个回合里第一条消息是谁发的就决定了这一轮的归属;**你中途在同一条会话里插话**不会把已经记下的归属改写。",
			unreadIncludeSubagentsHintSummary: "子代理唤醒的那一轮结束算不算未读。默认算。",
			unreadPanelShort: "待处理",
			unreadPanelCount: "{n} 个待处理",
			unreadPanelNone: "暂无待处理",
			unreadPanelTitle: "待处理的会话",
			unreadPanelEmpty: "现在没有需要你处理的事情",
			unreadWaiting: "在等你",
			unreadEnded: "刚结束,还没看",
			unreadPanelOther: "其他",
			unreadMarkAllRead: "全部标记已读",
			/** 进行中清单(点黄字打开):和那个黄数字是同一个事实,不落盘、不推断。 */
			runningPanelTitle: "进行中的会话",
			runningPanelEmpty: "现在没有会话在运行",
			runningPanelTrigger: "{n} 个进行中,点击查看",
			runningPanelRow: "回合正在跑",
			/** 与官方侧栏同一形状("13小时"),方便和列表里的时间戳逐字对上。 */
			ageNow: "刚刚",
			ageMinutes: "{n}分钟",
			ageHours: "{n}小时",
			ageDays: "{n}天",
			ageMonths: "{n}个月",
			ageYears: "{n}年",
			workspaceDotLabel: "在工作区和会话行上显示红点(实验)",
			workspaceDotHint: "在侧栏工作区那一行的文件夹图标上点一个小红点(收起的工作区里有多少未读,就看它),有未读的会话在其标题右边也跟一个小红点。会话行上的点只在那一行真的显示着时才画:折叠起来的会话由工作区那一行的点和「待处理」清单代表。这一项是贴着页面结构做的,DSH 升级后可能失效;失效时只会变成\"不显示\",不会影响红点数字、清单、跳转这些功能,随时可以关掉它。",
			workspaceDotHintSummary: "工作区文件夹和会话行上加小红点(实验,可能失效)。",
			revealLabel: "点清单里的会话时,在侧栏定位到它(实验)",
			revealHint: "点「待处理」或「进行中」清单里的一条时,除了打开那个会话,还会在侧栏把它所在的工作区展开、滚到那一行、并闪一下。这是贴着页面结构做的:官方只把\"展开 + 滚动\"留给了它自己的搜索框,没有给插件留接口,所以这里只能模拟点击官方的工作区行和「显示更多」。DSH 升级后可能失效,失效的表现只是\"侧栏不动\",打开会话完全不受影响。**展开状态是官方自己记住的**(存在浏览器里),所以它不会自己收回去——不想要就手动收起那个工作区,或者关掉这个开关。",
			revealHintSummary: "点清单时在侧栏展开并闪一下(实验,可能失效)。",
			appBadgeLabel: "在系统应用图标上显示红点",
			appBadgeHint: "安装为应用后,把同一个数字也放到系统图标上:Windows 是任务栏图标上的角标,macOS 是 Dock 角标,iOS 是主屏图标上的数字。样子由系统决定——Windows 上 Chrome 画深色圆+白字,Edge 走 Windows 系统徽章通道(是否显示数字由 Edge/Windows 决定);插件会周期重设数字,但只在应用窗口开着时更新。Safari 的程序坞网页应用 / 主屏应用还要先允许通知(见下面的「通知权限」),否则角标不会出现。",
			appBadgeHintSummary: "把同一个数字也放到系统应用图标上。",
			appBadgeFootnote: "角标只在应用窗口开着时由本插件更新;数字超过 99 时由系统显示为 99+。",
			appBadgeProbeInstalled: "当前环境:已安装为应用,本机可以设置角标。是否真正显示由系统决定。",
			appBadgeProbeTab: "当前环境:浏览器标签页(不是安装的应用)——安装为应用后才会显示角标。",
			appBadgeProbeUnsupported: "当前环境:本机没有这个能力(当前浏览器不支持应用角标)。",
			appBadgeProbeInsecure: "当前环境:不是安全上下文(请用 localhost 或 https 访问),系统角标不可用。",
			notificationPermissionLabel: "通知权限:",
			notificationPermissionGranted: "已授予",
			notificationPermissionDefault: "未授予",
			notificationPermissionDenied: "已被拒绝(要去系统设置的「通知」里打开)",
			notificationPermissionUnsupported: "本机浏览器没有通知能力",
			notificationPermissionButton: "允许通知",
			notificationPermissionHint: "Chrome / Edge 的角标不需要这一步;Safari 不一样——macOS 的「添加到程序坞」网页应用和 iOS 的主屏应用,只有在你允许通知之后才会画出角标(Apple 把角标权限绑在通知权限上)。这里只申请权限,本插件目前不会给你发通知。",
			notificationPermissionHintSummary: "只有 Safari 系(iOS/macOS)需要先允许通知。",
			badgeTestHint: "真实未读 = 有会话发生了上面勾选的情况、而且你还没看过它(打开该会话即视为已读)。你正开着的会话也算——窗口可能被最小化、页面可能切到后台,这里无从判断你在不在看,所以不做这个区分。子代理是否计入,由上方「子代理引起的结束也算未读」开关决定。手动模式:自己填数字试看效果。刷新页面后回到真实未读。",
			badgeTestHintSummary: "真实未读 = 勾选情况发生且你没看过;子代理看上方的开关。",
			clearDelayLabel: "进入会话后多久算已读:",
			clearDelayUnit: "秒",
			clearDelayHint: "填 0 = 进去就算已读(红点立即消失)。大于 0 时,你要在那个会话里连续待满这么多秒它才算看过:中途切走会清零重数,刷新页面也重新数。**计时只认\"你进入会话时已经存在的结束\"**——你人已经在里面的时候又跑完一轮,那一轮不算数:它会一直亮着,等你切走再进来才会清。上限 600 秒。**切到「插件/设置」页、或把标签页切到后台,都只是暂停计时,不会因此清掉红点**(它们不算离开);真正算离开的只有一件事:**去别的会话**。已读记在宿主($DSH_HOME/custom-favicon/unread-seen.json):任何一台设备上看过,所有设备都不再提醒;浏览器那份只是缓存,清站点数据不会把已读丢回去。",
			clearDelayHintSummary: "0 = 进去即已读;>0 要连续待满,上限 600 秒。",
			/** 进行中黄点(0.18.0):官方 running 的第二次投影,与红点互不牵连。 */
			runningMarkSection: "进行中黄点",
			runningMarkLabel: "显示进行中标记(标题数字 / 文件夹与会话行 / 左上角 / 标签页)",
			runningMarkCount: "{n} 个进行中",
			runningMarkHint: "黄点就是官方的「进行中」:会话有回合正在跑、而且没有停下来等你(停下等你的时候,官方那一行显示琥珀色的「等待审批 / 等待回答」,黄点也就不亮)。它和未读红点完全独立、各画各的:侧栏「工作区」标题后面是黄色数字——此刻全局有几个会话在跑(和红数字上下排:右上红、右下黄);工作区文件夹图标上是黄点,有未读时红点在左、黄点在右;会话行上同样是红点在左、黄点在右;左上角 Logo 与标签页图标右下角也是同一个数字,红数字仍占右上角。事实全部来自官方(会话列表里每个会话的 `running`)——插件不落盘、不推断,所以刷新页面立刻是对的,进程重启也不会留下一个永远亮着的黄点。关掉这个开关,红点完全不受影响。",
			runningMarkHintSummary: "黄点就是官方的进行中,和红点各自独立、互不影响。",
			runningIncludeSubagentsLabel: "把子代理的「进行中」算到它所属的会话上",
			runningIncludeSubagentsHint: "子代理(子会话)在侧栏里没有自己的那一行,所以它正在跑的时候,它上面那个真正属于你的会话看上去是空闲的。打开这个开关:有子代理在跑,就把最顶层那个不是子代理的祖先会话记为进行中——黄点/黄数字反映的是「有活正在干」,而不只是「你亲手开的会话在跑」。同一个祖先下好几个子代理同时跑,只算一次(数字始终是会话数,不是子代理数);子代理自己那一行照旧不画。祖先会话正在等你(官方那行是琥珀色)时不计。关掉就完全回到旧行为:所有子代理一律不计。",
			runningIncludeSubagentsHintSummary: "子代理在跑就把最顶层祖先会话记为进行中。",
			headerRingLabel: "在会话头部的子代理计数上叠一个黄圈",
			headerRingHint: "聊天区顶部那颗「N 个子智能体」的计数,右上角会叠一个小黄圈:只在**有直接子代理正在运行**时出现,里面的数字就是它们此刻的个数——不含更深一层的孙代理,同一个直接子代理只算一次,超过 99 显示 `99+`。它只是个数字:**不能点**,也不拦截任何点击,更不会改动画面的排版;会话头部那颗计数本身的文字和点击照旧,官方按钮的朗读里已经含运行数,所以它对着屏幕阅读器是隐藏的。关掉这个开关,其他地方的红黄点、左上角数字、标签页图标与系统角标一个都不受影响。子代理自己的会话页不显示官方那行,这个黄圈自然也不会出现。",
			headerRingHintSummary: "只在有直接子代理在跑时,会话头部计数右上角叠一个黄圈。"
		};
		const en = {
			nav: "Favicon",
			current: "Current icon",
			none: "Using the platform default icon",
			upload: "Upload",
			uploadHint: "SVG, PNG or ICO, up to 10 MB. SVG is auto-rasterized to PNG, and sizes are derived to fit Android/iOS/tablet home-screen icons. Applies instantly and persists across reloads.",
			uploadHintSummary: "SVG, PNG or ICO up to 10 MB; applies at once and persists.",
			svgFail: "This SVG could not be rasterized. Use a PNG instead.",
			reset: "Reset",
			resetHint: "Clear the custom icon and use the platform default.",
			replace: "Replace",
			replacing: "Uploading…",
			resetting: "Resetting…",
			name: "Name",
			size: "Size",
			updated: "Updated",
			successUpload: "New icon applied",
			successReset: "Default icon restored",
			pwa: "Also replace the PWA app icon",
			pwaHint: "The icon used after installing the site as an app (add to home screen). Already-installed apps may need a reinstall to pick it up.",
			pwaHintSummary: "The icon after installing as an app; may need a reinstall.",
			successPwa: "PWA icon setting updated",
			logo: "Also replace the page logo mark",
			logoHint: "Replaces the whale mark beside the brand name in the top-left (the deepseek HARNESS text stays).",
			logoHintSummary: "Swaps the whale mark inside the top-left brand logo.",
			successLogo: "Page logo updated",
			fail: "Operation failed",
			noFile: "Choose a file first",
			hintMoreLabel: "Show full description",
			badgeTest: "Unread badge",
			badgeSourceLabel: "Number source:",
			badgeSourceReal: "Real unread",
			badgeSourceManual: "Manual",
			badgeTestUnit: "0 = hidden",
			badgeSizeLabel: "Badge size:",
			badgeSizeHint: "A number shown on its own uses this size; when the red and the yellow number share the icon (unread + running) they shrink together to the largest pair that fits — the three sizes then draw the same, because the canvas is the constraint.",
			badgeSizeHintSummary: "Used when alone; both numbers shrink together to fit.",
			badgeSizeSmall: "Small",
			badgeSizeMedium: "Medium",
			badgeSizeLarge: "Large",
			unreadReasonsLabel: "Count these as unread:",
			reasonCompleted: "Turn finished",
			reasonError: "Error",
			reasonBlocked: "Blocked",
			reasonMaxTokens: "Hit token cap",
			reasonInterrupted: "Interrupted",
			reasonAbortedUser: "I stopped it",
			reasonAbortedOther: "Other cancel",
			reasonPending: "Someone is waiting",
			unreadIncludeSubagentsLabel: "Count sub-agent activity as unread",
			unreadIncludeSubagentsHint: "When a background sub-agent finishes, the runtime **wakes its parent session for one more turn**; this decides whether that turn's ending lights the red dot. Off: endings caused by a sub-agent stop lighting it, while a turn you started still notifies you (a sub-agent has no session row of its own and never counted). On (default) = exactly the old behaviour. The judgement comes from the official settlement notice in the log (`subagent-settled` / `agent-message`), so whichever message opened a turn owns that turn; typing into the same session halfway through does not rewrite an attribution already recorded.",
			unreadIncludeSubagentsHintSummary: "Whether a sub-agent-woken turn counts as unread; on by default.",
			unreadPanelShort: "Pending",
			unreadPanelCount: "{n} pending",
			unreadPanelNone: "Nothing pending",
			unreadPanelTitle: "Sessions needing you",
			unreadPanelEmpty: "Nothing needs you right now",
			unreadWaiting: "waiting for you",
			unreadEnded: "ended, not seen yet",
			unreadPanelOther: "Other",
			unreadMarkAllRead: "Mark all read",
			/** The running list (opened by the yellow number): the very fact that number counts. */
			runningPanelTitle: "Sessions running",
			runningPanelEmpty: "Nothing is running right now",
			runningPanelTrigger: "{n} running — click for the list",
			runningPanelRow: "turn in flight",
			/** Same shape as the shipped sidebar ("13h"), so the two can be read side by side. */
			ageNow: "now",
			ageMinutes: "{n}min",
			ageHours: "{n}h",
			ageDays: "{n}d",
			ageMonths: "{n}mo",
			ageYears: "{n}y",
			workspaceDotLabel: "Dots on workspace and session rows (experimental)",
			workspaceDotHint: "Adds a small red dot to the folder icon of each workspace row (a collapsed workspace shows how many of its sessions are unread there), and one beside the title of every unread session row. A session dot is only drawn while that row is really rendered: folded sessions are represented by their workspace row's dot and the pending panel. This one reads the page structure, so a DSH upgrade may break it; when it does it simply stops showing, never affecting the counts, the list, or navigation. Turn it off any time.",
			workspaceDotHintSummary: "Small dots on workspace folders and session rows (experimental).",
			revealLabel: "Locate the session in the sidebar when a list row is clicked (experimental)",
			revealHint: "Clicking a row in the \"needing you\" or \"running\" list opens that session AND, in the sidebar, expands its workspace, scrolls to the row and flashes it once. This reads the page structure: the official sidebar keeps expand-and-scroll for its own search box and exposes no interface for it, so this drives the shipped workspace row and \"show more\" button the way a click would. A DSH upgrade may break it, and the only symptom is a sidebar that does not move — opening the session is never affected. **The expanded state is remembered by the official sidebar itself** (in the browser), so it will not collapse again on its own: collapse that workspace by hand, or turn this off.",
			revealHintSummary: "Expands and flashes the session's sidebar row (experimental).",
			appBadgeLabel: "Badge the system app icon",
			appBadgeHint: "Once installed as an app, the same number also goes to the system icon: a taskbar badge on Windows, a Dock badge on macOS, a number on the iOS home-screen icon. The system decides how it looks — on Windows, Chrome draws a dark circle with white text, while Edge goes through the Windows badge channel (whether it shows the number is up to Edge/Windows). The plugin re-asserts the number periodically, but only while the app window is open. Safari's Dock and home-screen web apps additionally need notifications allowed first (see the permission row below), or the badge never appears.",
			appBadgeHintSummary: "Puts the same number onto the system app icon.",
			appBadgeFootnote: "The badge is only updated by this plugin while the app window is open; above 99 the system shows 99+.",
			appBadgeProbeInstalled: "This environment: installed as an app, so this device can set a badge. Whether it actually appears is up to the system.",
			appBadgeProbeTab: "This environment: a browser tab (not an installed app) — install as an app to get a badge.",
			appBadgeProbeUnsupported: "This environment: no app-badge capability in this browser.",
			appBadgeProbeInsecure: "This environment: not a secure context (use localhost or https) — the system badge is unavailable.",
			notificationPermissionLabel: "Notifications permission:",
			notificationPermissionGranted: "granted",
			notificationPermissionDefault: "not granted",
			notificationPermissionDenied: "denied (enable it in the system notifications settings)",
			notificationPermissionUnsupported: "this browser has no Notification API",
			notificationPermissionButton: "Allow notifications",
			notificationPermissionHint: "A badge needs no notification permission on Chrome / Edge, but Safari is different: a macOS web app added to the Dock (or an iOS home-screen web app) only draws its badge once you allow notifications — Apple ties the two together. This only asks for the permission; the plugin does not send notifications.",
			notificationPermissionHintSummary: "Only Safari (iOS/macOS) needs notifications allowed first.",
			badgeTestHint: "Real unread = a session ended for one of the checked reasons and you have not looked at it yet (opening a session marks it read). The session you are viewing counts too — the window may be minimised or the page in the background, so this half cannot tell whether you are looking, and does not pretend to. Whether sub-agents count is decided by the \"Count sub-agent activity as unread\" switch above. Manual = type a number to preview. Resets to Real on reload.",
			badgeTestHintSummary: "Real unread = a checked ending you have not seen; sub-agents follow the switch above.",
			clearDelayLabel: "Mark read after staying:",
			clearDelayUnit: "seconds",
			clearDelayHint: "0 = read as soon as you enter (the dot clears at once). Above 0 you must stay in that session for this many seconds before it counts as read: leaving it resets the clock, and so does a reload. The clock only ever covers **the ending that was already there when you entered** — a turn that finishes while you are sitting in the session does not count: it stays red until you leave and come back. Capped at 600 seconds. A settings or plugins page, or a tab in the background, only **pauses** the clock — neither clears a dot (neither counts as leaving); the one thing that does count as leaving is **opening another session**. Read state lives on the Host ($DSH_HOME/custom-favicon/unread-seen.json): read on any device means read on every device, and the browser's own copy is only a cache — clearing site data no longer throws it away.",
			clearDelayHintSummary: "0 = read at once; above 0, stay that long (max 600s).",
			/** Running mark (0.18.0): a second projection of the official `running`. */
			runningMarkSection: "Running marks",
			runningMarkLabel: "Show running marks (header number / folder and session rows / top-left / tab)",
			runningMarkCount: "{n} running",
			runningMarkHint: "The yellow mark IS the official \"running\": the session has a turn in flight and is not parked waiting for you (while it waits, the official row shows the amber \"waiting for approval / waiting for answer\" and the yellow goes dark). It is completely independent of the unread red dot, and each draws its own mark: after the sidebar's \"工作区\" label sits the yellow NUMBER of sessions running right now (stacked against the red number — red top-right, yellow bottom-right); the workspace folder icon gets a yellow dot with the red dot to its left; a session row is red left, yellow right; and the top-left logo plus the bottom-right of the tab icon carry the same number, with the red number keeping its top-right corner. Every fact comes from the official host (each session's `running` in the session list); the plugin stores nothing and infers nothing, so a reload is immediately right and a process restart never leaves a yellow mark stuck on. Turning this off does not affect the red dot at all.",
			runningMarkHintSummary: "The yellow mark is the official running state, independent of red dots.",
			runningIncludeSubagentsLabel: "Count sub-agent activity under the session that owns it",
			runningIncludeSubagentsHint: "A sub-agent (child session) has no row of its own in the sidebar, so while it works the real session above it looks idle. Turn this on: when a sub-agent is running, the topmost non-sub-agent ancestor session is credited as running — the yellow mark and number then reflect \"work is in flight\", not merely \"a session you opened is running\". Several sub-agents under one ancestor count once (the number stays a session count, never a sub-agent count), and the sub-agent row itself is still never drawn. An ancestor that is itself parked waiting for you (the official row is amber) is not counted. Turn it off and the old behaviour returns exactly: every sub-agent is ignored.",
			runningIncludeSubagentsHintSummary: "Credits the topmost ancestor session while a sub-agent runs.",
			headerRingLabel: "Draw a yellow ring on the header's sub-agent count",
			headerRingHint: "The \"N sub-agents\" count at the top of the chat area gets a small yellow ring on its top-right corner: it appears only while **direct sub-agents are running**, and the number inside is how many of them are active right now — it never counts deeper grandchildren, and one direct sub-agent counts once; above 99 it reads `99+`. It is a number only: **it is not clickable**, it swallows no pointer events, and it never changes the layout; the header count keeps its own text and its own click, and because the official button's label already announces the running count the ring is hidden from screen readers. Turning this switch off leaves every other red/yellow mark, the top-left number, the tab icon and the system badge untouched. A sub-agent's own conversation renders none of that header row, so no ring appears there either.",
			headerRingHintSummary: "A yellow ring on the header count while direct sub-agents run."
		};
		//#endregion

		//#region helpers
		function bytesLabel(value) {
			if (value == null || value < 0) return "—";
			if (value < 1024) return `${value} B`;
			if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
			return `${(value / (1024 * 1024)).toFixed(1)} MB`;
		}
		function reason(resp, fallback) {
			if (resp && resp.ok === false && resp.error && resp.error.message) return resp.error.message;
			return fallback;
		}
		function fmtTime(ms) {
			if (ms == null) return "—";
			try {
				return new Date(ms).toLocaleString();
			} catch { return "—"; }
		}
		// Rasterize an SVG file to a 512x512 PNG data URL in the browser.
		// We do this on the client because (a) browsers rasterize SVG reliably,
		// and (b) the host's pure-JS Jimp cannot decode SVG. ICO is NOT handled
		// here — browsers do not reliably draw .ico into a canvas, so the host
		// extracts the embedded PNG instead. Returns a `data:image/png;base64,..`
		// string, or throws when the SVG cannot be rasterized.
		function svgToPng(file) {
			return new Promise((resolve, reject) => {
				const url = URL.createObjectURL(file);
				const img = new Image();
				img.onload = () => {
					try {
						const size = 512;
						const canvas = document.createElement("canvas");
						canvas.width = size;
						canvas.height = size;
						const ctx = canvas.getContext("2d");
						ctx.fillStyle = "#fff"; // opaque backdrop for iOS tiles
						ctx.fillRect(0, 0, size, size);
						const scale = Math.min(size / img.width, size / img.height);
						const w = img.width * scale, h = img.height * scale;
						ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
						resolve(canvas.toDataURL("image/png"));
					} catch (e) {
						reject(e);
					} finally {
						URL.revokeObjectURL(url);
					}
				};
				img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("svg-rasterize")); };
				img.src = url;
			});
		}
		//#endregion
		//#region logo bridge
		// In-package brand-mark bridge: the settings section pushes the current
		// logo state here; the sidebar brand-mark component subscribes to it.
		// Both live in this same module — no RPC loop, no cross-package events.
		const logoListeners = new Set();
		function emitLogo(value) {
			logoListeners.forEach((fn) => { try { fn(value); } catch {} });
		}
		function subscribeLogo(fn) {
			logoListeners.add(fn);
			return () => { logoListeners.delete(fn); };
		}
		function syncStatus(status) {
			const known = status !== null && typeof status === "object";
			emitLogo({
				enabled: known && status.active === true && status.logo === true,
				rev: known && status.rev ? status.rev : null,
				png: known && status.png === true
			});
			// The plugin's own status — not the served HTML — decides which icon the
			// page should show. A cached/proxied page, a stale HTML rewrite, or a
			// browser extension can all leave the wrong link behind; this makes the
			// client authoritative about the icon it composites onto.
			const previousHref = desiredIconHref();
			iconState = {
				active: known && status.active === true,
				rev: known && typeof status.rev === "string" && status.rev !== "" ? status.rev : null,
				png: known && status.png === true,
				mime: known && typeof status.mime === "string" ? status.mime : null
			};
			// A different base image must be rebuilt from the NEW artwork right now:
			// the ordinary reconcile is not enough, because a compose already in flight
			// would land carrying the old base and nothing would touch the icon again
			// until the next 5-second watchdog tick. Same move the settings page makes
			// after an upload (`refreshFaviconBase`).
			if (desiredIconHref() !== previousHref) refreshFaviconBase();
			else reconcileFavicon();
		}

		//#endregion
		//#region unread state
		// ---------------------------------------------------------------------
		// Unread badge: which endings count, and what this browser has seen.
		//
		// The host folds every session's last `turn/end` into an official session
		// projection (`lastTurnEnd`); it travels to the browser inside the ordinary
		// session list, so this half never asks the host per session. Two local
		// inputs finish the job:
		//   * the rule — which reasons light the badge. Persisted by the host,
		//     mirrored here so a toggle applies without a round trip;
		//   * the seen watermark — per browser, in localStorage, because "have I
		//     already looked at this session" is a fact about this browser.
		// ---------------------------------------------------------------------
		const LAST_TURN_END_KEY = "lastTurnEnd";
		/** Reason key → locale key, for the settings checkboxes. */
		const REASON_LABEL_KEYS = {
			completed: "reasonCompleted",
			error: "reasonError",
			blocked: "reasonBlocked",
			"max-tokens": "reasonMaxTokens",
			interrupted: "reasonInterrupted",
			"aborted:user": "reasonAbortedUser",
			"aborted:other": "reasonAbortedOther"
		};
		/** Mirror of the host defaults; only used before the first status arrives. */
		const UNREAD_FALLBACK_REASONS = { completed: true, error: true, blocked: true, "max-tokens": true, interrupted: true, "aborted:user": false, "aborted:other": true };
		/** Mirror of the host's cap (see lib/unread.js) — 10 minutes. */
		const UNREAD_CLEAR_DELAY_MAX_SEC = 600;
		/** Mirror of the host's default (see lib/unread.js) — badging the app icon is on. */
		const UNREAD_APP_BADGE_FALLBACK = true;
		/** Mirror of the host's default (see lib/unread.js) — locating a clicked row is on. */
		const UNREAD_REVEAL_FALLBACK = true;
		/** Mirror of the host's default (see lib/unread.js) — sub-agent-caused endings count as unread. */
		const UNREAD_INCLUDE_SUBAGENTS_FALLBACK = true;
		let unreadConfig = { reasons: { ...UNREAD_FALLBACK_REASONS }, pending: true, workspaceDot: true, appBadge: UNREAD_APP_BADGE_FALLBACK, clearDelaySec: 0, revealOnOpen: UNREAD_REVEAL_FALLBACK, unreadIncludeSubagents: UNREAD_INCLUDE_SUBAGENTS_FALLBACK };
		const unreadConfigListeners = new Set();
		/** Mirror of the host's normalizer: any input becomes an integer 0..cap seconds. */
		function normalizeClearDelay(input) {
			const value = typeof input === "string" && input.trim() !== "" ? Number(input) : input;
			if (typeof value !== "number" || !Number.isFinite(value)) return 0;
			const seconds = Math.floor(value);
			if (seconds <= 0) return 0;
			return Math.min(seconds, UNREAD_CLEAR_DELAY_MAX_SEC);
		}
		function normalizeUnreadConfig(input) {
			const source = input !== null && typeof input === "object" ? input : {};
			const raw = source.reasons !== null && typeof source.reasons === "object" ? source.reasons : {};
			const reasons = {};
			for (const key of Object.keys(UNREAD_FALLBACK_REASONS)) {
				reasons[key] = typeof raw[key] === "boolean" ? raw[key] : UNREAD_FALLBACK_REASONS[key];
			}
			return {
				reasons,
				pending: typeof source.pending === "boolean" ? source.pending : true,
				workspaceDot: typeof source.workspaceDot === "boolean" ? source.workspaceDot : true,
				appBadge: typeof source.appBadge === "boolean" ? source.appBadge : UNREAD_APP_BADGE_FALLBACK,
				clearDelaySec: normalizeClearDelay(source.clearDelaySec),
				revealOnOpen: typeof source.revealOnOpen === "boolean" ? source.revealOnOpen : UNREAD_REVEAL_FALLBACK,
				// Missing or dirty falls back to ON (= today's behaviour): an old host that
				// never heard of this field must not make the badge quieter. Spelled as a
				// literal like `pending` / `workspaceDot` above, so a partial slice of this
				// normalizer (the tests take exactly this function) needs no extra constant.
				unreadIncludeSubagents: typeof source.unreadIncludeSubagents === "boolean" ? source.unreadIncludeSubagents : true
			};
		}
		function emitUnreadConfig(input) {
			unreadConfig = normalizeUnreadConfig(input);
			unreadConfigListeners.forEach((fn) => { try { fn(unreadConfig); } catch {} });
			// The rule (or just the app-badge switch) moved: the OS badge follows it
			// in the same breath, so toggling it applies without a reload.
			reconcileAppBadge();
		}
		function subscribeUnreadConfig(fn) {
			unreadConfigListeners.add(fn);
			return () => { unreadConfigListeners.delete(fn); };
		}

		/**
		 * The running mark's own switch, and the yellow it paints with.
		 *
		 * Deliberately NOT a field on the unread rule: the two features answer
		 * different questions ("something ended and you have not looked" vs
		 * "something is running right now"), so neither switch may drag the other's
		 * storage or response shape along. The yellow is a literal like the red
		 * `#e5484d` already is — the theme has no yellow token, and the official
		 * amber `--dsw-alias-state-warn-primary` (#f59e0b) is taken by the row's
		 * "waiting for you" dot, which must stay tellable apart from this one.
		 */
		const RUNNING_YELLOW = "#f5c518";
		/** Mirror of the host default (lib/running.js). */
		const RUNNING_MARK_FALLBACK = true;
		/**
		 * Mirror of the host's second running default (lib/running.js): rolling a
		 * running sub-agent up to the ancestor session that owns it is ON. The two
		 * questions are independent — whether to draw the marks at all is not the same
		 * as whether work you cannot see should light the session it belongs to.
		 */
		const RUNNING_INCLUDE_SUBAGENTS_FALLBACK = true;
		/**
		 * Mirror of the host's third running default (lib/running.js): the yellow ring
		 * on the conversation header's sub-agent count is ON. A third, independent
		 * question — the two above decide whether marks are drawn at all and whether a
		 * sub-agent's work is credited to its ancestor; this one only decides whether
		 * that one header count also carries a running number. It feeds no other count.
		 */
		const RUNNING_HEADER_RING_FALLBACK = true;
		let runningConfig = { enabled: RUNNING_MARK_FALLBACK, includeSubagents: RUNNING_INCLUDE_SUBAGENTS_FALLBACK, headerRing: RUNNING_HEADER_RING_FALLBACK };
		const runningConfigListeners = new Set();
		function normalizeRunningConfig(input) {
			const source = input !== null && typeof input === "object" ? input : {};
			// `typeof` (not a bare read) keeps this normalizer usable when a regression
			// test lifts it out of the module: an absent mirror is simply the default.
			const enabledFallback = typeof RUNNING_MARK_FALLBACK === "boolean" ? RUNNING_MARK_FALLBACK : true;
			const includeFallback = typeof RUNNING_INCLUDE_SUBAGENTS_FALLBACK === "boolean" ? RUNNING_INCLUDE_SUBAGENTS_FALLBACK : true;
			const headerRingFallback = typeof RUNNING_HEADER_RING_FALLBACK === "boolean" ? RUNNING_HEADER_RING_FALLBACK : true;
			return {
				enabled: typeof source.enabled === "boolean" ? source.enabled : enabledFallback,
				includeSubagents: typeof source.includeSubagents === "boolean" ? source.includeSubagents : includeFallback,
				headerRing: typeof source.headerRing === "boolean" ? source.headerRing : headerRingFallback
			};
		}
		function emitRunningConfig(input) {
			runningConfig = normalizeRunningConfig(input);
			runningConfigListeners.forEach((fn) => { try { fn(runningConfig); } catch {} });
		}
		function subscribeRunningConfig(fn) {
			runningConfigListeners.add(fn);
			return () => { runningConfigListeners.delete(fn); };
		}

		/**
		 * The seen watermark: the HOST owns it, this browser keeps the working copy.
		 *
		 * A turn end arrives stamped with the Host's `turn/end.time`; a mark written
		 * from the browser's `Date.now()` only lines up while both clocks agree. A
		 * browser a few seconds behind the Host therefore wrote marks that never
		 * reached `endAt`, so the dot could not be cleared by entering the session at
		 * all — the one failure users report as "点进去也不消". Marks now store the
		 * `endAt` they acknowledge, and `lastActiveAt` stores a host-domain time, so
		 * every comparison in `collectUnread` stays inside one clock.
		 *
		 * Since 0.11.2 the authoritative table lives in the Host
		 * (`~/.dsh/custom-favicon/unread-seen.json`, merged max-per-session). This
		 * copy is what the badge reads — so the page never waits for a round trip and
		 * keeps working offline — and doubles as the pending queue: every local mark
		 * is pushed back on the next sync, and a merge can only move marks forward.
		 * That is what makes "looked at it" survive a cleared browser profile and mean
		 * the same thing on every device.
		 */
		const SEEN_STORE_KEY = "dsh-icon-custom.unread-seen.v2";
		/** 0.10.1 and earlier wrote browser timestamps here; migrated once. */
		const LEGACY_SEEN_STORE_KEY = "dsh-icon-custom.unread-seen.v1";
		/** Mirror of the Host's cap (see lib/unread.js). */
		const SEEN_MAX = 400;
		/** Coalescing window for watermark pushes: one small RPC per burst, not per session. */
		const HOST_SYNC_DEBOUNCE_MS = 2000;
		/** Retry gap after a failed push (offline, or a Host without the endpoint). */
		const HOST_SYNC_RETRY_MS = 30000;
		/** Ceiling for that retry gap: an old Host must not be probed forever every 20 s. */
		const HOST_SYNC_MAX_RETRY_MS = 300000;
		/** Host clock minus browser clock, from the last Host sample; null until known. */
		let hostClockOffset = null;
		/** This browser's clock expressed in the Host's domain (best effort). */
		function hostNow() {
			return Date.now() + (hostClockOffset === null ? 0 : hostClockOffset);
		}
		function loadSeenState() {
			try {
				const raw = JSON.parse(window.localStorage.getItem(SEEN_STORE_KEY) || "null");
				if (raw !== null && typeof raw === "object" && raw.domain === "host") {
					const seen = raw.seen !== null && typeof raw.seen === "object" ? raw.seen : {};
					return { domain: "host", lastActiveAt: typeof raw.lastActiveAt === "number" ? raw.lastActiveAt : 0, seen };
				}
				const legacy = JSON.parse(window.localStorage.getItem(LEGACY_SEEN_STORE_KEY) || "null");
				if (legacy !== null && typeof legacy === "object") {
					const seen = legacy.seen !== null && typeof legacy.seen === "object" ? legacy.seen : {};
					return { domain: "browser", lastActiveAt: typeof legacy.lastActiveAt === "number" ? legacy.lastActiveAt : 0, seen };
				}
			} catch { /* fall through to an empty store */ }
			return { domain: "host", lastActiveAt: 0, seen: {} };
		}
		const seenState = loadSeenState();
		/** When this browser last had the app open before this page load (host domain). */
		const seenBootAt = seenState.lastActiveAt > 0 ? seenState.lastActiveAt : 0;
		/** The connection RPC, once `apply` has one; null keeps every push a no-op. */
		let seenRpc = null;
		/** Whether this page load has already converged with the Host once. */
		let hostSyncedOnce = false;
		/** Whether local marks changed since the last successful push. */
		let hostDirty = false;
		let hostSyncTimer = 0;
		let hostRetryTimer = 0;
		let hostSyncInFlight = false;
		/** Escalating gap between failed pushes; any success resets it. */
		let hostRetryDelay = HOST_SYNC_RETRY_MS;
		/** No push is attempted before this moment (the backoff window). */
		let hostBackoffUntil = 0;
		/** Whether the current failure streak has been reported (warn once per streak). */
		let hostSyncWarned = false;
		/**
		 * Push the local table soon, unless there is nothing to say.
		 *
		 * Called from `saveSeenState`, which is also the 20-second "this browser is
		 * still here" touch: that touch must NOT count as a change, or the table would
		 * travel every 20 seconds. `hostSyncedOnce` covers the first push of a page
		 * load, which is also the migration (local-only marks going up) and the
		 * self-heal (a lost Host file coming back from this browser).
		 * @param delayMs - override the coalescing window; non-positive uses the default.
		 */
		function scheduleHostSync(delayMs) {
			if (seenRpc === null || hostSyncInFlight) return;
			if (!hostDirty && hostSyncedOnce) return;
			if (hostSyncTimer !== 0) return;
			// A failed push escalates its own retry; the 20-second touch must not keep
			// poking a Host that has no such endpoint (an older DSH, or offline).
			if (Date.now() < hostBackoffUntil) return;
			const wait = typeof delayMs === "number" && delayMs > 0 ? delayMs : HOST_SYNC_DEBOUNCE_MS;
			hostSyncTimer = window.setTimeout(() => { hostSyncTimer = 0; flushHostSeen(); }, wait);
		}
		/**
		 * Adopt the Host's table: per session the NEWER of the two wins.
		 *
		 * Max-merge (never overwrite) is what makes both directions safe: the Host file
		 * lost or truncated → this browser's copy wins; this browser's localStorage
		 * cleared → the Host's copy wins. It is also the whole migration path.
		 * @param seen - the Host's table (`id → endAt`), or anything.
		 * @returns whether the local table gained anything.
		 */
		function adoptHostSeen(seen) {
			if (seen === null || typeof seen !== "object") return false;
			let gained = false;
			for (const id of Object.keys(seen)) {
				if (typeof id !== "string" || id === "") continue;
				const at = seen[id];
				if (typeof at !== "number" || !Number.isFinite(at) || at <= 0) continue;
				const previous = seenState.seen[id];
				if (typeof previous === "number" && previous >= at) continue;
				seenState.seen[id] = at;
				gained = true;
			}
			return gained;
		}
		/**
		 * Send the whole local table and adopt the merged answer.
		 *
		 * Whole-table, not a delta: the payload is a few KB, the Host merges by max (so
		 * a duplicate or partial round trip is harmless), and any lost message heals on
		 * the next one. A failure keeps the marks here — they are already in
		 * localStorage and the badge reads them — and retries later.
		 */
		function flushHostSeen() {
			if (seenRpc === null || hostSyncInFlight) return;
			if (!hostDirty && hostSyncedOnce) return;
			hostSyncInFlight = true;
			const marks = { ...seenState.seen };
			let pending;
			try {
				// Args are nested under the descriptor's parameter name ("request"), which
				// is what the gateway checks: a flat `{ marks }` is rejected with
				// `gateway/arguments-invalid` before the method ever runs.
				pending = seenRpc.call("/api", "iconCustom/setUnreadSeen", { args: { request: { marks } } });
			} catch (error) {
				// A carrier that throws synchronously must not wedge the in-flight guard:
				// that would stop every later push for the life of the page, silently.
				hostSyncInFlight = false;
				noteHostSyncFailure(error);
				return;
			}
			Promise.resolve(pending).then(
				(resp) => {
					hostSyncInFlight = false;
					if (resp === null || typeof resp !== "object" || resp.ok !== true) {
						const reason = resp !== null && typeof resp === "object" && resp.error !== undefined ? JSON.stringify(resp.error) : "resp.ok !== true";
						noteHostSyncFailure(new Error("setUnreadSeen 被拒绝: " + reason));
						return;
					}
					const value = resp.value !== null && typeof resp.value === "object" ? resp.value : {};
					const gained = adoptHostSeen(value.seen);
					hostSyncedOnce = true;
					hostRetryDelay = HOST_SYNC_RETRY_MS;
					hostBackoffUntil = 0;
					hostSyncWarned = false;
					// The Host knew marks this browser did not: keep them and push the union
					// once more. The next answer cannot gain anything, so this terminates.
					// Repaint too: the badge, the row dots and the panel all read this
					// browser's copy, and nothing else would re-render for a mark that
					// arrived over the wire.
					hostDirty = gained;
					if (gained) { saveSeenState(); emitUnreadPoke(); scheduleHostSync(); }
				},
				(error) => { hostSyncInFlight = false; noteHostSyncFailure(error); }
			);
		}
		/**
		 * One failed push: report it once per streak, then back off and try again later.
		 *
		 * Reported (not swallowed) because a watermark that cannot reach the Host is a
		 * silent, confusing failure — "为什么另一台设备还亮着" — and there is nothing on
		 * screen to explain it. The badge itself keeps working from the local copy, so
		 * this must never look fatal, and it warns once rather than on every retry.
		 * @param error - whatever the carrier rejected with.
		 */
		function noteHostSyncFailure(error) {
			if (!hostSyncWarned) {
				hostSyncWarned = true;
				try { console.warn("dsh-icon-custom: 已读水位线同步到宿主失败(红点仍照常工作,会自动重试):", (error && error.message) || error); } catch {}
			}
			const wait = hostRetryDelay;
			hostRetryDelay = Math.min(hostRetryDelay * 2, HOST_SYNC_MAX_RETRY_MS);
			hostBackoffUntil = Date.now() + wait;
			if (hostRetryTimer !== 0) window.clearTimeout(hostRetryTimer);
			hostRetryTimer = window.setTimeout(() => { hostRetryTimer = 0; flushHostSeen(); }, wait);
		}
		function saveSeenState() {
			try {
				window.localStorage.setItem(SEEN_STORE_KEY, JSON.stringify({ domain: "host", lastActiveAt: seenState.lastActiveAt, seen: seenState.seen }));
			} catch {}
			scheduleHostSync();
		}
		/**
		 * Learn the Host↔browser clock offset from a Host timestamp, and fold a
		 * legacy browser-domain store into the host domain. Idempotent: the fold
		 * happens once, on the first sample that carries a usable `hostNow`.
		 * @param hostAt - the Host's `Date.now()`, or anything else (ignored).
		 */
		function noteHostClock(hostAt) {
			if (typeof hostAt !== "number" || !Number.isFinite(hostAt) || hostAt <= 0) return;
			const offset = hostAt - Date.now();
			hostClockOffset = offset;
			if (seenState.domain === "host") return;
			seenState.domain = "host";
			if (seenState.lastActiveAt > 0) seenState.lastActiveAt += offset;
			for (const id of Object.keys(seenState.seen)) {
				if (typeof seenState.seen[id] === "number") seenState.seen[id] += offset;
			}
			saveSeenState();
		}
		function pruneSeenState() {
			const ids = Object.keys(seenState.seen);
			if (ids.length <= SEEN_MAX) return;
			ids.sort((a, b) => seenState.seen[b] - seenState.seen[a]);
			for (const id of ids.slice(SEEN_MAX)) delete seenState.seen[id];
		}
		/**
		 * Record that this browser has seen a session up to `seenAt` — the
		 * host-domain `endAt` being acknowledged. Marks never move backwards, so a
		 * late attempt cannot undo a newer one.
		 * @param sessionId - the session that was looked at.
		 * @param seenAt - host-domain watermark to store; defaults to the Host's now.
		 * @returns whether the mark actually advanced.
		 */
		function noteSeen(sessionId, seenAt) {
			if (typeof sessionId !== "string" || sessionId === "") return false;
			const mark = typeof seenAt === "number" && Number.isFinite(seenAt) ? seenAt : hostNow();
			const previous = seenState.seen[sessionId];
			if (typeof previous === "number" && previous >= mark) return false;
			seenState.seen[sessionId] = mark;
			// Only a REAL mark counts as a change: the 20-second "still here" touch also
			// lands in `saveSeenState`, and it must not drag the whole table to the Host.
			hostDirty = true;
			return true;
		}
		/**
		 * First sight of a session is watermarked at the last time this browser was
		 * here — so an ending that happened while the app was closed still counts as
		 * unread, while endings from before the plugin was installed do not.
		 *
		 * Unchanged by the move to a Host-owned table: a session nobody has a mark for
		 * still needs a starting value, and "the last time this browser was here" is
		 * the honest one. A mark dropped by the Host's pruning simply re-baselines here
		 * on the next load, which is why pruning cannot resurrect old dots.
		 * @returns whether anything was learned (callers persist only then).
		 */
		function ensureSeenBaseline(ids) {
			const fallback = seenBootAt > 0 ? seenBootAt : hostNow();
			let changed = false;
			for (const id of ids) {
				if (typeof id !== "string" || id === "") continue;
				if (typeof seenState.seen[id] === "number") continue;
				seenState.seen[id] = fallback;
				changed = true;
			}
			return changed;
		}
		/**
		 * Whether this page is on screen at all.
		 *
		 * A hidden tab is not "being looked at": the clock must not run while the page
		 * is in the background, or a session left open in another tab would be marked
		 * read for every device. Unknown (an exotic embedder) counts as visible, which
		 * is the pre-0.12.1 behaviour.
		 * @returns whether the page is visible.
		 */
		function documentVisible() {
			try { return document.visibilityState !== "hidden"; } catch { return true; }
		}
		/**
		 * The official "Session on screen" answer, when this build exposes it.
		 *
		 * `ctx.uiSession.adapter.current` is the very binding the renderer derives
		 * `[data-conversation-session]` from, so it answers with the same value without
		 * the DOM's first-match ambiguity (see `conversationOnScreen`) — and it keeps
		 * answering while a global panel has unmounted the conversation, where the DOM
		 * has nothing to say. Filled in by `apply`, where a client context exists;
		 * until then it answers nothing, which is exactly what the other fallbacks are
		 * for.
		 * @returns the session id, or undefined when this build does not say.
		 */
		let officialSessionId = () => undefined;
		/**
		 * What the conversation on screen is rendering, in two parts.
		 *
		 * `rendered` says whether the main conversation is on screen at all, and `id` is
		 * the session it renders (`undefined` while none is selected — the landing view).
		 * The distinction matters: "the conversation is showing no session" is an answer
		 * ("you are not in a session"), while "there is no conversation element" is not
		 * an answer at all (a global panel replaced it, the page is still booting).
		 *
		 * TWO occurrences can carry this attribute: the main conversation, and the
		 * embedded one the right sidebar keeps MOUNTED while collapsed (hidden by CSS and
		 * `inert`). A plain `querySelector` returns the first in document order, so the
		 * moment the main occurrence carries no attribute — no session selected, the
		 * archive/close path — the hidden one becomes the answer: "you are looking at
		 * that subagent conversation". The stay clock reads that as "you left this
		 * session", drops the entered-at snapshot, and the ending that arrived meanwhile
		 * is acknowledged the moment you come back: a dot that goes out without you ever
		 * leaving. Only an occurrence the user can actually see is an answer.
		 * @returns `{ rendered, id }`.
		 */
		function conversationOnScreen() {
			try {
				const nodes = document.querySelectorAll("[data-conversation-session]");
				let rendered = false;
				for (const node of nodes) {
					if (typeof node.closest === "function" && (node.closest("[data-sidebar-right-panel]") !== null || node.closest("[inert]") !== null)) continue;
					rendered = true;
					const id = node.getAttribute("data-conversation-session");
					if (typeof id === "string" && id !== "") return { rendered: true, id };
				}
				return { rendered, id: undefined };
			} catch { return { rendered: false, id: undefined }; }
		}
		/**
		 * The session whose conversation the page is rendering right now, from the DOM.
		 *
		 * This is the only signal that names the session on screen, and it is the one
		 * that keeps a stale retention from clearing a dot: `retainedBy.mainView` means
		 * "recently opened, not yet released", not "displayed". `undefined` means the page
		 * does not name one (see `conversationOnScreen`) and callers must fall back to the
		 * other answers rather than treat it as "nothing is displayed".
		 * @returns the session id, or undefined when the page cannot say.
		 */
		function displayedSessionId() {
			return conversationOnScreen().id;
		}
		/**
		 * The session this page is ON — the set that defines "entered" and "left" — plus
		 * whether the answer is actually known.
		 *
		 * Only a change here counts as leaving a session, so this must NOT be emptied by
		 * pausing: a background tab, or a global panel (settings, plugins, …) that covers
		 * the conversation, keeps you on the same session. Emptying it would drop the
		 * entered-at snapshot, and taking a fresh one on return is exactly what
		 * acknowledges an ending you never left the session for.
		 *
		 * The answers, in order:
		 *   * the visible conversation's own session (the precise one, and the only one
		 *     that may overrule retention);
		 *   * the official "Session on screen" binding (`view.official`, from
		 *     `ctx.uiSession`) — the very value the attribute above is rendered from, so
		 *     it still answers while a global panel has unmounted the conversation;
		 *   * `list.current`, when a build carries it;
		 *   * retention (`retainedBy.mainView > 0`), the pre-0.12 answer.
		 *
		 * `known: false` is the important one: it means the page could not name ANY
		 * session, which is NOT the same as "no session is being viewed". Callers must
		 * keep the snapshots they already have instead of reading it as a leave — a
		 * single such frame used to be enough to acknowledge an ending you were sitting
		 * in front of.
		 * @param list - the session list snapshot (may be absent).
		 * @param view - `{ displayed, official }`: what the page says about the screen.
		 * @returns `{ ids, known }`; `ids` in list order, `[]` when there are none.
		 */
		function viewedSessions(list, view) {
			const screen = view !== null && typeof view === "object" ? view : {};
			if (typeof screen.displayed === "string" && screen.displayed !== "") return { ids: [screen.displayed], known: true };
			if (typeof screen.official === "string" && screen.official !== "") return { ids: [screen.official], known: true };
			if (screen.idle === true) return { ids: [], known: true }; // the conversation is up, showing no session
			if (list === null || typeof list !== "object") return { ids: [], known: false };
			if (typeof list.current === "string" && list.current !== "") return { ids: [list.current], known: true };
			const byId = list.byId;
			if (byId === null || typeof byId !== "object") return { ids: [], known: false };
			const ids = [];
			for (const session of Object.values(byId)) {
				if (session === null || typeof session !== "object") continue;
				const retainedBy = session.retainedBy;
				const count = retainedBy !== null && typeof retainedBy === "object" ? retainedBy.mainView : undefined;
				if (typeof count === "number" && count > 0 && typeof session.id === "string" && session.id !== "") ids.push(session.id);
			}
			// Retention with nothing in it, and the conversation not on screen either, is
			// exactly the frame this must not read as a leave: it is what a global panel
			// over a released session, a boot, or a DOM gap looks like. The landing view
			// (`idle`) is the positive "you are on no session" answer, not this.
			return { ids, known: ids.length > 0 };
		}
		/**
		 * One session's last `turn/end` timestamp (host domain), or 0 when it has
		 * none. The projection is what the Host folded; an unknown reason still
		 * carries the time.
		 * @param entry - the session-list row (may be absent).
		 * @returns the epoch milliseconds, or 0.
		 */
		function lastTurnEndAt(entry) {
			const values = entry !== null && typeof entry === "object" ? entry.projectionValues : undefined;
			const value = values !== null && typeof values === "object" ? values[LAST_TURN_END_KEY] : undefined;
			return value !== null && typeof value === "object" && typeof value.endAt === "number" ? value.endAt : 0;
		}
		/**
		 * Which workspace a session is shown under: the basename of its cwd.
		 *
		 * The sidebar's own workspace rows are labelled with this basename, so a list
		 * points at the same place the reader sees — the sidebar group cannot be
		 * expanded for us (that state is private to the shipped browser), so naming
		 * it is the honest substitute. Shared by the pending list and the running
		 * list: two lists of the same sessions must not disagree about where they are.
		 * @param entry - the session-list row (may be absent).
		 * @returns the basename, or "" when the row carries no cwd.
		 */
		function sessionWhereOf(entry) {
			const cwd = entry !== null && typeof entry === "object" && typeof entry.cwd === "string" ? entry.cwd : "";
			if (cwd === "") return "";
			const parts = cwd.replace(/[\\/]+$/, "").split(/[\\/]/);
			return parts[parts.length - 1] || cwd;
		}
		/**
		 * How many sessions deserve the badge right now: endings whose reason is
		 * enabled and that this browser has not seen since, plus sessions waiting
		 * for you (when that source is enabled). Sub-agent sessions never count on
		 * their own; whether an ending caused by a sub-agent's settlement counts is
		 * decided by the `unreadIncludeSubagents` rule, not by this function.
		 *
		 * A PARENT session woken by a sub-agent settling is a second kind of
		 * sub-agent-caused unread: the child has no row of its own, but its
		 * settlement notice makes the parent run a turn, and that turn's ending used
		 * to light the parent's dot. The fold marks those endings
		 * (`subagentCaused`, see lib/unread.js) instead of hiding them, and this
		 * function drops them only while the rule says so — the fact stays in the
		 * projection either way, so flipping the switch never re-folds a log.
		 *
		 * The session you are LOOKING AT counts too. It used to be excluded, on the
		 * theory that "you have it open, so you have seen it" — but that premise is
		 * not knowable from here: the window may be minimised, the tab may be in the
		 * background, the page may be on another desktop. The browser half cannot
		 * tell "watching" from "left open", and a rule that cannot tell two cases
		 * apart should not pretend to: a session counts from the moment it ends until
		 * it is opened again. Leaving and re-entering it is what clears the entry.
		 * @param list - the session list snapshot (may be absent).
		 * @param pending - the pending-interaction map (may be absent).
		 * @param config - the unread rule to apply.
		 * @param lit - the ids currently showing a dot, so a change of ENDING KIND cannot
		 *   put an already lit dot out (see below). Optional.
		 * @returns the badge number.
		 */
		function collectUnread(list, pending, config, seen, lit) {
			const reasons = config !== null && typeof config === "object" && config.reasons !== null && typeof config.reasons === "object" ? config.reasons : {};
			// Absent, dirty or an old host's answer → ON (= everything this function
			// did before the switch existed).
			const includeSubagents = !(config !== null && typeof config === "object" && config.unreadIncludeSubagents === false);
			// The watermark is a parameter, not module state: this stays a pure
			// decision function that a test can drive with any marks it likes.
			const marks = seen !== null && typeof seen === "object" ? seen : {};
			const litIds = lit !== null && lit !== undefined && typeof lit.has === "function" ? lit : null;
			/** { id, title, waiting, kind, at } — newest first, "in wait" ahead of "ended". */
			const hits = [];
			const ids = new Set();
			const byId = list !== null && typeof list === "object" && list.byId !== null && typeof list.byId === "object" ? list.byId : {};
			const titleOf = (id, entry) => (entry !== null && typeof entry === "object" && typeof entry.displayTitle === "string" && entry.displayTitle !== "" ? entry.displayTitle : id);
			if (list !== null && typeof list === "object") {
				const order = Array.isArray(list.ids) ? list.ids : Object.keys(byId);
				for (const id of order) {
					const entry = byId[id];
					if (entry === null || typeof entry !== "object") continue;
					if (entry.origin === "subagent") continue;
					const values = entry.projectionValues;
					const value = values !== null && typeof values === "object" ? values[LAST_TURN_END_KEY] : undefined;
					if (value === null || typeof value !== "object") continue;
					// The switch is OFF: an ending the fold attributed to a sub-agent
					// settling is not news for the person sitting here. This is NOT the
					// reason-toggle exception below — that one protects an already lit dot
					// from a vocabulary change, while this one is the user explicitly
					// saying they do not want this class of news at all.
					if (!includeSubagents && value.subagentCaused === true) continue;
					const endAt = typeof value.endAt === "number" ? value.endAt : 0;
					// No watermark is the NORMAL first sight of a session: `ensureSeenBaseline`
					// writes one from an effect AFTER this render, so skipping the row here
					// would report 0 on the one frame the user actually sees — and the page
					// would keep that 0 for its whole life (the baseline write pushed no
					// re-render, so nothing recomputed it).
					// Fall back to EXACTLY the value that effect writes — this browser's last
					// time here (`seenBootAt`), or the Host's now when it has none — so the
					// first frame and the write agree and the number cannot flicker.
					// Guarded with `typeof` so a regression test may lift this function out
					// of the module: an absent mirror simply means "no baseline".
					const seenAt = typeof marks[id] === "number"
						? marks[id]
						: (typeof seenBootAt === "number" && seenBootAt > 0 ? seenBootAt : (typeof hostNow === "function" ? hostNow() : Date.now()));
					if (endAt <= 0 || endAt <= seenAt) continue;
					// Unknown reasons (a newer DSH adds one) stay hidden until the user
					// turns them on, so a vocabulary growth can never surprise the badge.
					// A reason the user turned OFF behaves the same way — with ONE
					// exception: it must never put out a dot that is already lit. That dot
					// stands for an ending nobody has read yet, and "the newest turn ended
					// in a way I do not want to be told about" is not "I read it". Only the
					// watermark clears a lit dot.
					if (reasons[value.reason] !== true && !(litIds !== null && litIds.has(id))) continue;
					ids.add(id);
					hits.push({ id, title: titleOf(id, entry), where: sessionWhereOf(entry), waiting: false, kind: value.reason, at: endAt });
				}
			}
			if (config === null || typeof config !== "object" || config.pending !== false) {
				if (pending !== null && pending !== undefined && typeof pending.forEach === "function") {
					pending.forEach((value, id) => {
						const kind = value !== null && typeof value === "object" && typeof value.kind === "string" ? value.kind : "";
						if (ids.has(id)) {
							// Already unread by its last turn: it is waiting too, which wins.
							const hit = hits.find((candidate) => candidate.id === id);
							if (hit !== undefined) { hit.waiting = true; hit.kind = kind; }
							return;
						}
						ids.add(id);
						hits.push({ id, title: titleOf(id, byId[id]), where: sessionWhereOf(byId[id]), waiting: true, kind, at: Date.now() });
					});
				}
			}
			hits.sort((a, b) => (b.waiting === true ? 1 : 0) - (a.waiting === true ? 1 : 0) || b.at - a.at);
			return hits;
		}

		//#endregion
		//#region running state
		// The "who is running right now" fact is entirely OFFICIAL and entirely
		// free: the browser's session list already carries each session's
		// `running` (host `ctx.agents.get(id)?.status === 'running'`, pushed by
		// `api-session/status`), and the official session row already draws its own
		// grey spinner from it. This plugin adds no host plumbing, no projection
		// and no storage — it only projects the same fact as a YELLOW mark in four
		// places. See docs/adr/0010-running-mark-is-a-second-projection.md.
		/**
		 * The sessions that are running right now.
		 *
		 * Two official facts are combined, in the shipped sidebar's own precedence:
		 *   * running — `status.get(id)?.running`, falling back to the row's own
		 *     `running` exactly like ui-workspace's `sessionNode` does;
		 *   * waiting — a `pendingInteraction` makes the official row show the amber
		 *     "waiting for approval / answer / plan review" instead of the spinner,
		 *     so it is NOT running here either. That is why a session with the
		 *     amber dot never also gets a yellow one.
		 *
		 * Sub-agent sessions get no ids of their own for the same reason
		 * `collectUnread` skips them: they are not part of the browsing the user does
		 * (ui-workspace's `sessionVisible` hides them outright), so a mark on their row
		 * would point at work nobody can open. With `includeSubagents` on (the
		 * default), a running sub-agent still credits the topmost non-sub-agent
		 * ancestor session that owns it, walking `parentSessionId` upwards: that is the
		 * session the user actually opened, and without the roll-up it looks idle while
		 * its sub-agents work. Several sub-agents under one ancestor collapse into that
		 * single id, so the number stays a count of sessions. The ancestor's own
		 * `pendingInteraction` still wins, switch or no switch: a session parked
		 * waiting for you is never also "running".
		 * @param list - the session list snapshot (may be absent).
		 * @param status - the official session-status map (may be absent).
		 * @param includeSubagents - optional override for the switch; absent means "ask the live config", whose documented default is ON.
		 * @returns the running session ids, in list order.
		 */
		function runningSessionIds(list, status) {
			const out = [];
			if (list === null || typeof list !== "object") return out;
			const byId = list.byId !== null && typeof list.byId === "object" ? list.byId : {};
			const order = Array.isArray(list.ids) ? list.ids : Object.keys(byId);
			const lookup = status !== null && status !== undefined && typeof status.get === "function"
				? (id) => status.get(id)
				: () => undefined;
			// The roll-up switch. A third argument wins (the regression tests drive it
			// that way); otherwise the live config answers, and a copy lifted out of the
			// module with no config in scope is the documented default: ON.
			const includeSubagents = arguments.length > 2
				? arguments[2] !== false
				: !(typeof runningConfig === "object" && runningConfig !== null && runningConfig.includeSubagents === false);
			/** Is this row parked waiting for the user (the amber state)? */
			const waitingForYou = (id) => {
				const row = lookup(id);
				return row !== null && typeof row === "object" && row.pendingInteraction !== null && row.pendingInteraction !== undefined;
			};
			/** The official running fact for a row, sidebar precedence, minus the wait state. */
			const isRunning = (id) => {
				if (waitingForYou(id)) return false;
				const row = lookup(id);
				const known = row !== null && typeof row === "object";
				const entry = byId[id];
				const running = known && typeof row.running === "boolean"
					? row.running
					: entry !== null && typeof entry === "object" ? entry.running : undefined;
				return running === true;
			};
			/**
			 * Up the `parentSessionId` chain to the topmost ancestor that is not itself a
			 * sub-agent. A broken, cyclic or unknown chain yields "" (unattributable):
			 * guessing an owner would light a session that has nothing to do with the
			 * sub-agent.
			 */
			const ownerOf = (id) => {
				let current = id;
				const walked = new Set([id]);
				for (let hops = 0; hops < 64; hops++) {
					const entry = byId[current];
					const parent = entry !== null && typeof entry === "object" && typeof entry.parentSessionId === "string" ? entry.parentSessionId : "";
					if (parent === "" || walked.has(parent)) return "";
					walked.add(parent);
					const next = byId[parent];
					if (next !== null && typeof next === "object" && next.origin === "subagent") {
						current = parent;
						continue;
					}
					if (next === null || typeof next !== "object") return "";
					return parent;
				}
				return "";
			};
			/** Ancestors are deduplicated: two sub-agents under one parent are one session. */
			const push = (id) => { if (!out.includes(id)) out.push(id); };
			for (const id of order) {
				if (typeof id !== "string" || id === "") continue;
				const entry = byId[id];
				if (entry === null || typeof entry !== "object") continue;
				if (entry.origin === "subagent") {
					if (!includeSubagents || !isRunning(id)) continue;
					const owner = ownerOf(id);
					// Only the ancestor's own wait state counts: the sub-agent has no row, so
					// it can never be the session the user is being asked about.
					if (owner !== "" && !waitingForYou(owner)) push(owner);
					continue;
				}
				if (!isRunning(id)) continue;
				push(id);
			}
			return out;
		}

		/**
		 * Roll the running sessions up to one count per workspace.
		 *
		 * Mirrors `dotsFromItems`: the ID anchors the number to the workspace row
		 * the browser itself keys (`data-row-key="workspace:<id>"`), the title is
		 * what the row displays, and a session whose workspace cannot be named is
		 * dropped rather than guessed at. Pure, so a test can drive it directly.
		 * @param ids - running session ids, from `runningSessionIds`.
		 * @param owners - sessionId → `{ id, title }` from the official workspace snapshot.
		 * @returns `[{ id, name, count }]`, busiest workspace first.
		 */
		function runningWorkspaceDots(ids, owners) {
			const counts = new Map();
			for (const id of Array.isArray(ids) ? ids : []) {
				if (typeof id !== "string" || id === "") continue;
				const owner = owners !== null && typeof owners === "object" ? owners[id] : undefined;
				const workspaceId = owner !== null && typeof owner === "object" && typeof owner.id === "string" ? owner.id : "";
				if (workspaceId === "") continue;
				const title = typeof owner.title === "string" ? owner.title : "";
				const existing = counts.get(workspaceId);
				if (existing === undefined) counts.set(workspaceId, { id: workspaceId, name: title, count: 1 });
				else existing.count++;
			}
			return [...counts.values()]
				.sort((a, b) => b.count - a.count || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
		}

		//#endregion
		//#region badge bridge
		// In-package badge bridge. Two number sources:
		//   "real"   — DSH's own pending-interaction registry (the same source the
		//              sidebar session-row marker uses): how many sessions are
		//              waiting for you right now. This is the default.
		//   "manual" — the settings test input, for eyeballing sizes and numbers.
		// `md` is the default size; `sm` keeps the original 1.0 multiplier.
		const BADGE_SCALES = { sm: 1, md: 1.15, lg: 1.3 };
		let badgeSource = "real";
		let realCount = 0;
		/** The sessions behind `realCount`, for the sidebar list (newest first). */
		let realItems = [];
		/**
		 * Which sessions are showing an unread dot right now.
		 *
		 * Read back by `collectUnread` so a change of ending KIND cannot put a lit dot
		 * out (see the reason filter there). Kept here rather than derived on the fly
		 * because the projection only carries the LATEST ending: once a newer one lands
		 * with a reason the user turned off, the one that lit the dot is no longer
		 * visible anywhere.
		 */
		let litUnreadIds = new Set();
		/**
		 * How many sessions are running right now — the official `running` fact,
		 * already folded by `runningSessionIds`. It rides the SAME bridge as the
		 * unread number because it has the same two consumers (the brand mark and
		 * the tab icon) and the two must never disagree about which of them is
		 * being shown.
		 */
		let runningTotal = 0;
		/** The sessions behind `runningTotal` (`{ id, title, where }`), for the running list. */
		let runningItems = [];
		let manualCount = 0;
		let badgeSize = "md";
		const badgeListeners = new Set();
		function normalizeCount(value) {
			const n = Number(value);
			return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
		}
		/**
		 * A stable identity for one running list.
		 *
		 * The number alone is not enough: with one session running, handing over to a
		 * DIFFERENT session keeps the count at 1, so a guard that only compares counts
		 * leaves the open list naming the session that already stopped — the mark and
		 * the tab icon stay right while the list lies. Same reason the sidebar marks
		 * key off `runningSignature`: compare the list by value.
		 * @param items - `{ id, title, where }` rows (anything else is ignored).
		 * @returns a string that changes whenever the list does.
		 */
		function runningItemsSignature(items) {
			const out = [];
			for (const item of Array.isArray(items) ? items : []) {
				if (item === null || typeof item !== "object") continue;
				out.push(`${item.id}\u0000${item.title}\u0000${item.where}`);
			}
			return out.join("\u0001");
		}
		function effectiveCount() {
			return badgeSource === "manual" ? manualCount : realCount;
		}
		function badgeSnapshot() {
			return { count: effectiveCount(), size: badgeSize, source: badgeSource, items: badgeSource === "manual" ? [] : realItems, running: runningTotal, runningItems };
		}
		function notifyBadge() {
			const snapshot = badgeSnapshot();
			badgeListeners.forEach((fn) => { try { fn(snapshot); } catch {} });
			// The header badge is a DOM node, not a listener, so it is reconciled
			// here as well as from the mutation watchdog. Idempotent either way.
			paintHeaderBadge();
			// Same number, second consumer: the OS badge behind the app icon.
			reconcileAppBadge();
		}
		/** Manual test input. */
		function emitBadge(value) {
			manualCount = normalizeCount(value);
			notifyBadge();
		}
		/** The real source: the sessions needing you, and which they are. */
		function emitRealBadge(value, items) {
			realCount = normalizeCount(value);
			realItems = Array.isArray(items) ? items : [];
			// Remember what is lit BEFORE the next round of folding can hide it: the
			// projection only carries the latest ending, so an ending whose reason is
			// turned off would otherwise erase the memory of the one that lit the dot.
			const lit = new Set();
			for (const item of realItems) {
				if (item !== null && typeof item === "object" && typeof item.id === "string" && item.id !== "") lit.add(item.id);
			}
			litUnreadIds = lit;
			notifyBadge();
		}
		/**
		 * The running sessions, as one number on the same bridge — plus the list
		 * behind it, so the yellow count can be opened like the red one.
		 *
		 * Emitted from every render of the headless badge source, so the "did it
		 * actually change" guard is what keeps a re-render from repainting the tab
		 * icon and the brand mark for nothing. It is NOT routed through
		 * `emitRealBadge`: the unread number and the running number are independent
		 * facts, and a manual test number must not disturb the other.
		 * @param value - how many sessions are running; anything non-positive is 0.
		 * @param items - `{ id, title, where }`, one per running session, in list order.
		 */
		function emitRunningState(value, items) {
			const next = normalizeCount(value);
			const nextItems = Array.isArray(items) ? items : [];
			if (next === runningTotal && runningItemsSignature(nextItems) === runningItemsSignature(runningItems)) return;
			runningTotal = next;
			runningItems = nextItems;
			notifyBadge();
		}
		function emitBadgeSize(value) {
			badgeSize = Object.prototype.hasOwnProperty.call(BADGE_SCALES, value) ? value : "md";
			notifyBadge();
		}
		function emitBadgeSource(value) {
			badgeSource = value === "manual" ? "manual" : "real";
			notifyBadge();
		}
		function subscribeBadge(fn) {
			badgeListeners.add(fn);
			return () => { badgeListeners.delete(fn); };
		}
		function badgeScale(size) {
			return BADGE_SCALES[size] || BADGE_SCALES.md;
		}
		function badgeLabel(count) {
			return count > 99 ? "99+" : String(count);
		}

		//#endregion
		//#region app badge (OS app icon)
		// The badge the OPERATING SYSTEM draws on the icon of the installed app: the
		// taskbar overlay on Windows, the Dock badge on macOS, the number on an iOS
		// home-screen icon. It is the same number the page badge shows, projected
		// onto the system icon — one number, two consumers.
		//
		// Three facts shape this region (all checked against primary sources; see
		// docs/adr/0005-app-icon-badge.md):
		//   * detecting the API is NOT delivery. Chromium on Android exposes
		//     `setAppBadge` and silently ignores it, and iOS only draws the badge
		//     once notifications have been granted. So the probe reports LOCAL facts
		//     and never promises that a badge will appear;
		//   * the OS owns the rendering. On Windows the badge is a browser-drawn
		//     overlay on the taskbar button of an OPEN window: closing the window
		//     drops it, and nothing can refresh it afterwards (no push server);
		//   * the API is write-only, so this half keeps its own count — the very
		//     `effectiveCount()` the favicon and the header badge already use.
		//
		// Everything that DECIDES is a pure function, so a test drives it with no
		// browser at all; exactly one function touches the API.
		/** Display modes that mean "this window IS the installed app", not a tab. */
		const APP_DISPLAY_MODES = ["standalone", "fullscreen", "minimal-ui", "window-controls-overlay"];

		/**
		 * Normalize what this device is, as three independent local facts.
		 *
		 * Deliberately NOT "does this platform support it": the method that works
		 * on Windows resolves and does nothing on Android, and Apple draws the
		 * badge only after notifications are granted. Neither is answerable from
		 * inside the page, so the probe stays silent about them and the copy says
		 * "whether it actually appears is up to the system" instead.
		 * @param env - `{ secure, hasApi, installed }`; anything non-boolean reads false.
		 * @returns the same three flags, normalized.
		 */
		function badgeCapabilityProbe(env) {
			const source = env !== null && typeof env === "object" ? env : {};
			return {
				secure: source.secure === true,
				hasApi: source.hasApi === true,
				installed: source.installed === true
			};
		}

		/**
		 * Read those facts off the window this code runs in.
		 *
		 * "Installed" is a display-mode match rather than `standalone` alone: the
		 * platform manifest asks for `fullscreen`, so an installed window matches
		 * THAT mode, and a standalone-only test would report "browser tab" forever.
		 * @returns the probe for this device.
		 */
		function appBadgeEnv() {
			const nav = typeof navigator === "object" && navigator !== null ? navigator : {};
			let installed = nav.standalone === true;
			if (!installed && typeof window !== "undefined" && typeof window.matchMedia === "function") {
				for (const mode of APP_DISPLAY_MODES) {
					try {
						if (window.matchMedia(`(display-mode: ${mode})`).matches === true) { installed = true; break; }
					} catch {}
				}
			}
			return badgeCapabilityProbe({
				secure: typeof window !== "undefined" && window.isSecureContext === true,
				hasApi: typeof nav.setAppBadge === "function" && typeof nav.clearAppBadge === "function",
				installed
			});
		}

		/**
		 * What the OS badge should say for a given count.
		 *
		 * The number is handed over AS IS (no `99+` clamping here): the system
		 * saturates it in its own way, and duplicating that rule is how the two
		 * projections start disagreeing. Switching the feature off clears the
		 * badge rather than abandoning it — a number left behind after "off"
		 * reads as a bug.
		 * @param count - the unread count, i.e. the number the page badge shows.
		 * @param enabled - the `appBadge` setting; only `true` enables it.
		 * @returns `{ kind: "set", value }` or `{ kind: "clear" }`.
		 */
		function appBadgeEffect(count, enabled) {
			const value = enabled === true ? normalizeCount(count) : 0;
			return value > 0 ? { kind: "set", value } : { kind: "clear" };
		}

		/**
		 * Which self-check line the settings page shows for this device.
		 *
		 * A missing probe is NOT reported as "insecure": that message tells the
		 * user to change how they reach the page, which would be chasing the
		 * wrong thing. Only a real reading may claim that.
		 * @param probe - a `badgeCapabilityProbe` result.
		 * @returns a locale key.
		 */
		function appBadgeCapabilityKey(probe) {
			if (probe === null || typeof probe !== "object") return "appBadgeProbeUnsupported";
			const facts = badgeCapabilityProbe(probe);
			if (facts.secure !== true) return "appBadgeProbeInsecure";
			if (facts.hasApi !== true) return "appBadgeProbeUnsupported";
			return facts.installed === true ? "appBadgeProbeInstalled" : "appBadgeProbeTab";
		}

		/** The last effect actually handed to the API, so a repeat is a no-op. */
		let lastAppBadgeId = null;

		/**
		 * The ONE place that talks to the Badging API.
		 *
		 * Idempotence is required here, not polish: `notifyBadge` fires on every
		 * badge change AND again from the DOM watchdog that re-asserts the tab
		 * badge, and each call costs an IPC to the browser process plus a taskbar
		 * repaint. Only a real change in the projected effect reaches the API.
		 * @param effect - an `appBadgeEffect` result.
		 * @param force - re-send even when the effect is unchanged. Used only by
		 *   the low-frequency OS-badge watchdog, because Windows/Edge can replace a
		 *   numeric badge with a notification dot after our call succeeded.
		 */
		function applyAppBadge(effect, force) {
			const intent = effect !== null && typeof effect === "object" ? effect : {};
			// Anything that is not a positive number is a clear, so a bogus effect
			// can never hand the system a `setAppBadge(0)`.
			const id = intent.kind === "set" && typeof intent.value === "number" && intent.value > 0 ? `set:${intent.value}` : "clear";
			if (id === lastAppBadgeId && force !== true) return;
			const nav = typeof navigator === "object" && navigator !== null ? navigator : null;
			if (nav === null || typeof nav.setAppBadge !== "function" || typeof nav.clearAppBadge !== "function") return;
			lastAppBadgeId = id;
			try {
				// Always a number, never the argument-less "flag" form: on WebKit a
				// no-argument call can REMOVE a badge that is already showing.
				const settled = id === "clear" ? nav.clearAppBadge() : nav.setAppBadge(intent.value);
				if (settled !== null && typeof settled === "object" && typeof settled.catch === "function") {
					settled.catch(() => {
						// The API rejected: the browser did NOT apply this effect, so
						// forget it and let the next reconcile/retry try again. Guard
						// against a newer call having replaced the remembered effect.
						if (lastAppBadgeId === id) lastAppBadgeId = null;
					});
				}
			} catch {
				// A synchronous throw means nothing was applied, so the next
				// reconcile retries instead of remembering a phantom success.
				lastAppBadgeId = null;
			}
		}

		/**
		 * Reconcile the OS badge with the page badge.
		 *
		 * Both inputs are the page's own: the number the favicon and the header
		 * badge already show, and the rule the host persists. Called from
		 * `emitUnreadConfig` (rule arrived / switch moved) and `notifyBadge`
		 * (number moved) — together those cover every way the badge can change.
		 * @param force - re-send even if the projected effect is unchanged.
		 */
		function reconcileAppBadge(force) {
			applyAppBadge(appBadgeEffect(effectiveCount(), unreadConfig.appBadge === true), force === true);
		}

		/**
		 * Keep a positive numeric badge asserted while the app window is alive.
		 *
		 * Windows/Edge can render a notification glyph (a dot) over the numeric
		 * badge after we set it; unlike the favicon, the OS badge then has no
		 * watcher to put the number back. Re-send only when the plugin's own
		 * projection says there SHOULD be a number, and never when it says clear —
		 * so a count of 0 is not repeatedly cleared and no phantom badge appears.
		 */
		function reassertAppBadge() {
			if (unreadConfig.appBadge !== true) return;
			if (normalizeCount(effectiveCount()) <= 0) return;
			reconcileAppBadge(true);
		}

		//#endregion
		//#region notifications permission (the WebKit half of app badging)
		// On WebKit the badge and the notifications permission are one feature:
		// Apple's own words are "when users allow a web app to send
		// notifications, that includes permissions for the web app to use
		// badging" — so a macOS web app added to the Dock (and an iOS
		// home-screen web app) draws NO badge until the user allows
		// notifications (sources: docs/adr/0009-notification-permission.md).
		//
		// This region does NOT gate `applyAppBadge`: Chromium needs none of it,
		// and the API only reports "not permitted" by drawing nothing, which is
		// undetectable. Keeping the call site unconditional is ADR 0005's rule;
		// what is added here is the PRECONDITION, made visible and requestable
		// from one user gesture.
		/** The three states the spec defines; anything else is "no API". */
		const NOTIFICATION_PERMISSION_STATES = ["granted", "denied", "default"];

		/**
		 * Normalize one reading of `Notification.permission` into a local fact.
		 * @param value - the raw reading; only the spec strings count.
		 * @returns `"granted" | "denied" | "default" | "unsupported"`.
		 */
		function normalizeNotificationPermission(value) {
			return typeof value === "string" && NOTIFICATION_PERMISSION_STATES.includes(value) ? value : "unsupported";
		}

		/**
		 * Normalize an already-shaped probe, so every reader of it takes dirty
		 * input the same way: only the three spec states are real, and only a
		 * strict `true` is a request entry point.
		 * @param probe - a `{ state, canRequest }` probe, or anything else.
		 * @returns the same two facts, normalized.
		 */
		function notificationPermissionFacts(probe) {
			const source = probe !== null && typeof probe === "object" ? probe : {};
			return {
				state: normalizeNotificationPermission(source.state),
				canRequest: source.canRequest === true
			};
		}

		/**
		 * Shape a raw `{ permission, canRequest }` reading, mirroring
		 * `badgeCapabilityProbe`: two independent local facts, no platform claim.
		 * @param env - the raw reading; anything else reads false.
		 * @returns the probe for this device.
		 */
		function notificationPermissionProbe(env) {
			const source = env !== null && typeof env === "object" ? env : {};
			return notificationPermissionFacts({
				state: normalizeNotificationPermission(source.permission),
				canRequest: source.canRequest === true
			});
		}

		/**
		 * Read that fact off the window this code runs in.
		 *
		 * "unsupported" covers both a browser with no Notification API and a
		 * permission string this code has never heard of — from the user's side
		 * those are the same thing: there is nothing to grant here.
		 * @returns the probe for this device.
		 */
		function notificationPermissionEnv() {
			const api = typeof Notification === "object" && Notification !== null ? Notification : null;
			return notificationPermissionProbe({
				permission: api === null ? undefined : api.permission,
				canRequest: api !== null && typeof api.requestPermission === "function"
			});
		}

		/**
		 * Which settings-page sentence describes this reading.
		 * @param probe - a `notificationPermissionProbe` result.
		 * @returns a locale key.
		 */
		function notificationPermissionKey(probe) {
			const facts = notificationPermissionFacts(probe);
			if (facts.state === "granted") return "notificationPermissionGranted";
			if (facts.state === "denied") return "notificationPermissionDenied";
			if (facts.state === "default") return "notificationPermissionDefault";
			return "notificationPermissionUnsupported";
		}

		/**
		 * Whether the "allow notifications" button can do anything.
		 *
		 * Only an undecided permission is worth a prompt: once granted there is
		 * nothing left to ask, and once denied the browser refuses to prompt
		 * again, so the settings page says where to change it instead of showing
		 * a button that would silently do nothing.
		 * @param probe - a `notificationPermissionProbe` result.
		 * @returns true only when a prompt could still decide the fact.
		 */
		function notificationPermissionRequestable(probe) {
			const facts = notificationPermissionFacts(probe);
			return facts.state === "default" && facts.canRequest === true;
		}

		/**
		 * Ask for the notifications permission — the ONE place that does.
		 *
		 * Must be called from a user gesture (the settings button's click):
		 * WebKit and Chromium both drop a prompt that no activation asked for.
		 * Resolves to a fresh probe and never rejects, so the caller can drop the
		 * result straight into React state; the old callback form (Safari 15) is
		 * why the returned promise is not the only path out.
		 * @returns a Promise for the permission probe after the prompt.
		 */
		function requestNotificationPermission() {
			const api = typeof Notification === "object" && Notification !== null ? Notification : null;
			if (api === null || typeof api.requestPermission !== "function") return Promise.resolve(notificationPermissionEnv());
			return new Promise((resolve) => {
				// The prompt's own answer is authoritative when it comes back;
				// re-reading `.permission` covers the promise form and a rejection
				// (no user gesture, or not an installed web app on WebKit).
				const settle = (value) => {
					const next = notificationPermissionEnv();
					resolve({
						state: typeof value === "string" ? normalizeNotificationPermission(value) : next.state,
						canRequest: next.canRequest
					});
				};
				let returned;
				try {
					returned = api.requestPermission(settle);
				} catch {
					settle(undefined);
					return;
				}
				if (returned !== null && typeof returned === "object" && typeof returned.then === "function") {
					returned.then(settle, () => settle(undefined));
				}
			});
		}

		/**
		 * Follow the permission while this page is open.
		 *
		 * It can move outside the page (System Settings, the browser's own
		 * settings, another tab's prompt), and a stale "not granted" beside a
		 * granted permission is exactly the kind of lie this half avoids.
		 * `permissions.query({ name: "notifications" })` is the precise channel;
		 * a re-read on focus/visibilitychange is the portable one (WebKit does
		 * not implement every permission descriptor), and both are cheap.
		 * Publishes only when the fact actually changed.
		 * @param fn - called with a fresh probe when the fact moved.
		 * @returns an unsubscribe function.
		 */
		function subscribeNotificationPermission(fn) {
			if (typeof fn !== "function") return () => {};
			const win = typeof window !== "undefined" ? window : null;
			const navigatorObject = typeof navigator === "object" && navigator !== null ? navigator : null;
			const read = () => {
				const next = notificationPermissionEnv();
				return { next, id: `${next.state}:${next.canRequest === true}` };
			};
			// Seeded with the mount reading, so mounting never re-publishes the
			// value the settings page already rendered.
			let last = read().id;
			// Fire only on a real change: the settings page already rendered the
			// mount reading, and a focus event that changed nothing must not repaint.
			const publish = () => {
				const reading = read();
				if (reading.id === last) return;
				last = reading.id;
				try { fn(reading.next); } catch {}
			};
			/** @type {Array<() => void>} */
			const unsubscribes = [];
			if (win !== null && typeof win.addEventListener === "function") {
				for (const event of ["focus", "visibilitychange", "pageshow"]) {
					win.addEventListener(event, publish);
					unsubscribes.push(() => win.removeEventListener(event, publish));
				}
			}
			try {
				if (navigatorObject !== null && navigatorObject.permissions && typeof navigatorObject.permissions.query === "function") {
					const pending = navigatorObject.permissions.query({ name: "notifications" });
					if (pending !== null && typeof pending === "object" && typeof pending.then === "function") {
						pending.then((status) => {
							if (status === null || typeof status !== "object" || typeof status.addEventListener !== "function") return;
							status.addEventListener("change", publish);
							unsubscribes.push(() => status.removeEventListener("change", publish));
						}).catch(() => {});
					}
				}
			} catch {}
			return () => {
				for (const off of unsubscribes) {
					try { off(); } catch {}
				}
				unsubscribes.length = 0;
			};
		}

		//#endregion
		//#region favicon compositing
		// The browser accepts exactly ONE image per <link rel="icon">, so a tab
		// badge cannot be layered: base icon and badge are redrawn together into a
		// canvas and the merged bitmap is handed back to the browser. Count 0 (and
		// teardown) restores the pristine platform/custom href.
		const FAVICON_SIZE = 64;
		/**
		 * How long one base-image fetch may take before the compose gives up on it.
		 *
		 * A fetch that neither loads nor errors (a stalled request, a proxy that never
		 * answers) used to leave the compose pending forever — and silently, because no
		 * error is ever raised — so the tab icon simply stopped following the numbers
		 * with nothing in the console. This timeout turns that into a reported failure
		 * the watchdog can retry.
		 */
		const FAVICON_LOAD_TIMEOUT_MS = 8000;
		let faviconBase = null;
		let composeSeq = 0;
		let faviconComposing = false;
		/** Last compose failure, so a repeated failure warns once instead of spamming. */
		let lastComposeError = null;
		/**
		 * The picture the tab is carrying right now: `未读|进行中|基图`.
		 *
		 * A `data:` href alone says nothing — an OLD bitmap and a bitmap whose compose
		 * FAILED look exactly the same from the DOM. Remembering which picture was
		 * actually written is what lets the watchdog tell "already right" from "stale
		 * but still ours", which is the hole that used to freeze the tab icon.
		 */
		let faviconDrawnSignature = "";
		/** The picture a compose is fetching right now, so a repeat cannot start a second fetch. */
		let faviconPendingSignature = "";
		/** Whether the last compose failed: the watchdog must retry instead of trusting the DOM. */
		let faviconFailed = false;
		/**
		 * Short backoff after a failed compose: 300 ms → 1 s → 2 s, then the 5-second
		 * watchdog owns it.
		 *
		 * The watchdog alone is too slow to feel like "the tab icon follows the
		 * number": a base image that is merely SLOW (a cold cache, a proxy waking up, a
		 * laptop resuming) left the badge missing for up to five seconds after a reload
		 * — and a reload is exactly when the number is freshest. Three quick attempts
		 * cover that window; a genuinely missing icon still falls through to the
		 * watchdog, which keeps warning once per reason. Any success resets the ladder.
		 */
		const FAVICON_RETRY_DELAYS_MS = [300, 1000, 2000];
		let faviconRetryTimer = 0;
		let faviconRetryStep = 0;
		function clearFaviconRetry() {
			if (faviconRetryTimer === 0) return;
			window.clearTimeout(faviconRetryTimer);
			faviconRetryTimer = 0;
		}
		/**
		 * Queue one retry of the compose that just failed.
		 *
		 * At most one timer is ever pending, and the ladder stops after the last rung
		 * (the 5-second watchdog is the safety net below it). The callback re-checks
		 * `faviconFailed`: a compose that already succeeded, or the teardown that
		 * restored the shipped icons, has cleared it — and rebuilding then would paint
		 * a number back onto a page that was deliberately left alone.
		 */
		function scheduleFaviconRetry() {
			if (faviconRetryTimer !== 0) return;
			if (faviconRetryStep >= FAVICON_RETRY_DELAYS_MS.length) return;
			const delay = FAVICON_RETRY_DELAYS_MS[faviconRetryStep];
			faviconRetryStep++;
			faviconRetryTimer = window.setTimeout(() => {
				faviconRetryTimer = 0;
				if (faviconFailed !== true) return; // already repaired, or torn down
				composeFavicon(effectiveCount(), badgeSize, true);
			}, delay);
		}
		/** Which icon the plugin considers current (filled from the status RPC). */
		let iconState = { active: false, rev: null, png: false, mime: null };
		/** The icon URL this page SHOULD be showing, per the plugin's own status. */
		function desiredIconHref() {
			if (iconState.active === true && typeof iconState.rev === "string" && iconState.rev !== "") {
				return iconState.png === true ? `/icon-custom-192.png?v=${iconState.rev}` : `/icon-custom.svg?v=${iconState.rev}`;
			}
			return "/favicon.svg";
		}
		function desiredIconType() {
			if (iconState.active !== true) return "image/svg+xml";
			return iconState.png === true ? "image/png" : (iconState.mime || "image/svg+xml");
		}
		/**
		 * One string that names one picture: which numbers, on which base.
		 *
		 * It is the identity used both to remember what was drawn and to decide whether
		 * a compose still has anything to do. The numbers are part of it on purpose —
		 * "1 unread" and "2 unread" are different pictures even though both are `data:`.
		 * @param count - the unread number this picture carries.
		 * @param runningCount - the running number this picture carries.
		 * @param base - the base icon href the numbers ride on.
		 * @returns the signature string.
		 */
		function faviconSignature(count, runningCount, base) {
			return normalizeCount(count) + "|" + normalizeCount(runningCount) + "|" + base;
		}
		/** The picture this page SHOULD be carrying right now, from live state. */
		function wantedFaviconSignature() {
			return faviconSignature(effectiveCount(), runningTotal, desiredIconHref());
		}
		/**
		 * Every `<link rel="icon">` the document carries, creating one if the page
		 * has none.
		 *
		 * DSH 0.2.x ships TWO of them — a dark and a light one, each behind a
		 * `media` query. Touching only `querySelector`'s first match left the light
		 * one pointing at the shipped favicon, and the browser honours the LAST
		 * suitable candidate, so a custom icon silently failed to apply in light
		 * mode (the tab kept the platform whale and the feature looked dead).
		 * Every write below therefore goes to all of them.
		 */
		function iconLinks() {
			const links = Array.from(document.querySelectorAll('link[rel="icon"]'));
			if (links.length > 0) return links;
			const link = document.createElement("link");
			link.rel = "icon";
			link.type = "image/svg+xml";
			link.href = "/favicon.svg";
			document.head.appendChild(link);
			return [link];
		}
		/** Authored href/type, remembered before the first write so a reset can put the shipped pair back. */
		const ICON_ORIGINALS = new WeakMap();
		function rememberIcon(link) {
			if (ICON_ORIGINALS.has(link)) return;
			ICON_ORIGINALS.set(link, { href: link.getAttribute("href"), type: link.getAttribute("type") });
		}
		/**
		 * Point every icon link at one image, so no scheme-specific sibling is left stale.
		 * Writes only on change: the head MutationObserver feeds `reconcileFavicon`,
		 * so a redundant write would re-arm the watchdog on every tick.
		 */
		function setIconEverywhere(href, type) {
			for (const link of iconLinks()) {
				rememberIcon(link);
				if (link.getAttribute("href") !== href) link.setAttribute("href", href);
				if (typeof type === "string" && type !== "") {
					if (link.getAttribute("type") !== type) link.setAttribute("type", type);
				} else if (link.getAttribute("type") !== null) link.removeAttribute("type");
			}
		}
		/**
		 * Put the authored hrefs back; a link this plugin created falls back to the
		 * platform default. Idempotent for the same watchdog reason as above, and a
		 * no-op for any link the plugin never touched — which is what keeps the
		 * documented "zero side effects while no custom icon is set" true.
		 */
		function restoreShippedIcons() {
			for (const link of iconLinks()) {
				const original = ICON_ORIGINALS.get(link);
				if (original === undefined) continue; // never touched → leave the shipped tag alone
				const href = original.href === null ? "/favicon.svg" : original.href;
				if (link.getAttribute("href") !== href) link.setAttribute("href", href);
				if (original.type === null) {
					if (link.getAttribute("type") !== null) link.removeAttribute("type");
				} else if (link.getAttribute("type") !== original.type) link.setAttribute("type", original.type);
			}
		}
		function iconLink() {
			return iconLinks()[0];
		}
		function roundRect(c2d, x, y, w, h) {
			const r = Math.min(h / 2, w / 2);
			c2d.beginPath();
			c2d.moveTo(x + r, y);
			c2d.arcTo(x + w, y, x + w, y + h, r);
			c2d.arcTo(x + w, y + h, x, y + h, r);
			c2d.arcTo(x, y + h, x, y, r);
			c2d.arcTo(x, y, x + w, y, r);
			c2d.closePath();
		}
		function drawFaviconBadge(c2d, size, count, scale) {
			const text = badgeLabel(count);
			const r = size * 0.28 * (scale || 1);
			const wide = text.length > 1;
			const w = wide ? r * 2 + size * 0.16 * (text.length - 1) : r * 2;
			const h = r * 2;
			const cx = size - w / 2 - size * 0.02;
			const cy = h / 2 + size * 0.02;
			c2d.save();
			// White ring so the badge stays readable on any base artwork.
			c2d.fillStyle = "#ffffff";
			roundRect(c2d, cx - w / 2 - size * 0.03, cy - h / 2 - size * 0.03, w + size * 0.06, h + size * 0.06);
			c2d.fill();
			c2d.fillStyle = "#e5484d";
			roundRect(c2d, cx - w / 2, cy - h / 2, w, h);
			c2d.fill();
			c2d.fillStyle = "#ffffff";
			c2d.font = `700 ${Math.round(h * (wide ? 0.56 : 0.68))}px system-ui, -apple-system, sans-serif`;
			c2d.textAlign = "center";
			c2d.textBaseline = "middle";
			c2d.fillText(text, cx, cy + size * 0.01);
			c2d.restore();
		}
		/**
		 * The common badge scale when BOTH tab-icon numbers are shown.
		 *
		 * A big red "2" beside a small yellow "1" reads as a rendering bug, so the
		 * two pills share one size: the largest that fits them stacked inside the
		 * canvas (four half-heights + the edge pads + the seam between them). The
		 * constraint is absolute — it is the canvas that is small, not the setting —
		 * so this returns a SCALE multiplier the caller folds into the normal one,
		 * and a pill drawn alone keeps whatever size the setting asks for.
		 * @param scale - the badge-size multiplier from the setting.
		 * @returns a multiplier ≤ 1 to apply to it.
		 */
		function faviconBadgeFitScale(scale) {
			const k = typeof scale === "number" && scale > 0 ? scale : 1;
			// 0.205: four half-heights plus both white rings plus a seam, inside the
			// canvas. Anything larger and the two rings merge into one blob.
			return Math.min(1, 0.205 / (0.28 * k));
		}
		/**
		 * The yellow "N running" badge on the tab icon: bottom-right.
		 *
		 * Mirrors `drawFaviconBadge` exactly — same geometry, same white ring, same
		 * digit size for the same `scale` — so the two numbers can sit one above the
		 * other as equals. Dark digits, because yellow needs dark ink.
		 * @param c2d - the tab-icon canvas context.
		 * @param size - canvas edge in px.
		 * @param count - how many sessions are running.
		 * @param scale - the badge-size multiplier (already fitted when paired).
		 */
		function drawFaviconRunningBadge(c2d, size, count, scale) {
			const text = badgeLabel(count);
			const r = size * 0.28 * (scale || 1);
			const wide = text.length > 1;
			const w = wide ? r * 2 + size * 0.16 * (text.length - 1) : r * 2;
			const h = r * 2;
			const cx = size - w / 2 - size * 0.02;
			const cy = size - h / 2 - size * 0.02;
			c2d.save();
			// White ring so the badge stays readable on any base artwork.
			c2d.fillStyle = "#ffffff";
			roundRect(c2d, cx - w / 2 - size * 0.03, cy - h / 2 - size * 0.03, w + size * 0.06, h + size * 0.06);
			c2d.fill();
			c2d.fillStyle = RUNNING_YELLOW;
			roundRect(c2d, cx - w / 2, cy - h / 2, w, h);
			c2d.fill();
			c2d.fillStyle = "#1f1f1f";
			c2d.font = `700 ${Math.round(h * (wide ? 0.56 : 0.68))}px system-ui, -apple-system, sans-serif`;
			c2d.textAlign = "center";
			c2d.textBaseline = "middle";
			c2d.fillText(text, cx, cy + size * 0.01);
			c2d.restore();
		}
		/**
		 * Load one image for the composite, with a deadline.
		 *
		 * Settles exactly once, whatever happens: a late `onload` after the timeout must
		 * not draw on top of the picture that replaced it.
		 * @param href - absolute URL of the base icon.
		 * @returns the loaded image, or a rejection whose message says why.
		 */
		function loadIconImage(href) {
			return new Promise((resolve, reject) => {
				const img = new Image();
				let done = false;
				const settle = (fn, value) => {
					if (done) return;
					done = true;
					window.clearTimeout(timer);
					fn(value);
				};
				const timer = window.setTimeout(() => { settle(reject, new Error("icon-load-timeout")); }, FAVICON_LOAD_TIMEOUT_MS);
				img.onload = () => { settle(resolve, img); };
				img.onerror = () => { settle(reject, new Error("icon-load")); };
				img.src = href;
			});
		}
		async function applyBadgeToFavicon(count, size) {
			// ONE snapshot decides this whole compose: which marks to draw AND with which
			// numbers. `runningTotal` used to be read again after the await, so a run that
			// stopped mid-fetch was painted as a yellow "0", and the two numbers could
			// come from two different moments.
			const wantedCount = normalizeCount(count);
			const runningCount = normalizeCount(runningTotal);
			const signature = faviconSignature(wantedCount, runningCount, desiredIconHref());
			// The sequence is taken BEFORE the "nothing to draw" branch: restoring the
			// plain icon has to invalidate any compose still in flight, or that older
			// bitmap lands afterwards and paints the number we just cleared back onto
			// the tab. (That is exactly the "stale dot that will not go away" report.)
			const seq = ++composeSeq;
			faviconComposing = true;
			faviconPendingSignature = signature;
			faviconFailed = false;
			try {
				if (wantedCount <= 0 && runningCount <= 0) {
					// No badge to draw. With a custom icon active the page must carry it on
					// EVERY link (a stale scheme-specific sibling outranks the one we set);
					// with none, the shipped dark/light pair goes back untouched — the
					// plugin promises zero side effects while it has no icon of its own.
					if (seq !== composeSeq) return;
					if (iconState.active === true) setIconEverywhere(desiredIconHref(), desiredIconType());
					else restoreShippedIcons();
					faviconBase = null;
					faviconDrawnSignature = signature;
					return;
				}
				// The base is resolved from the plugin's status, never from whatever the
				// page happens to carry, and never from our own previous bitmap.
				const base = desiredIconHref();
				faviconBase = { href: base, type: desiredIconType() };
				const img = await loadIconImage(new URL(base, document.baseURI).href);
				if (seq !== composeSeq) return;
				const canvas = document.createElement("canvas");
				canvas.width = FAVICON_SIZE;
				canvas.height = FAVICON_SIZE;
				const c2d = canvas.getContext("2d");
				const iw = img.naturalWidth || img.width || FAVICON_SIZE;
				const ih = img.naturalHeight || img.height || FAVICON_SIZE;
				const scale = Math.min(FAVICON_SIZE / iw, FAVICON_SIZE / ih);
				const dw = iw * scale;
				const dh = ih * scale;
				c2d.drawImage(img, (FAVICON_SIZE - dw) / 2, (FAVICON_SIZE - dh) / 2, dw, dh);
				// One size for both numbers: when they share the tab icon they shrink
				// together to the largest pair that fits, so neither reads as a bug and
				// the two can never overlap.
				const badgeUnit = badgeScale(size);
				const badgeK = wantedCount > 0 && runningCount > 0 ? badgeUnit * faviconBadgeFitScale(badgeUnit) : badgeUnit;
				if (wantedCount > 0) drawFaviconBadge(c2d, FAVICON_SIZE, wantedCount, badgeK);
				if (runningCount > 0) drawFaviconRunningBadge(c2d, FAVICON_SIZE, runningCount, badgeK);
				setIconEverywhere(canvas.toDataURL("image/png"), "image/png");
				faviconDrawnSignature = signature;
			} catch (error) {
				// Never silent: a failure here is invisible in the UI (the tab simply
				// keeps its previous icon), which once cost a whole debugging session.
				// Warn once per distinct reason so the 5s watchdog cannot spam.
				faviconFailed = true;
				warnFaviconCompose(error);
			} finally {
				if (seq === composeSeq) {
					faviconComposing = false;
					faviconPendingSignature = "";
				}
			}
		}
		/**
		 * Report a failed tab-icon composition, once per distinct reason.
		 *
		 * The 5-second watchdog retries, so repeating the same line would bury the
		 * console in noise; a NEW reason is exactly the signal worth seeing.
		 * @param error - whatever the compose threw.
		 */
		function warnFaviconCompose(error) {
			const why = String((error && error.message) || error);
			if (why === lastComposeError) return;
			lastComposeError = why;
			try { console.warn("dsh-icon-custom: 标签页红点合成失败 / favicon badge compose failed:", why); } catch {}
		}
		/**
		 * Fire-and-forget composition whose failures are still reported.
		 *
		 * `applyBadgeToFavicon` is async, so it never throws synchronously: a caller's
		 * `try { ... } catch {}` (the badge listeners all have one) cannot see its
		 * rejection, and the tab icon would simply never change with nothing in the
		 * console — the exact "no warning, no badge" state. Every call site goes through
		 * here instead.
		 *
		 * It is also the ONE place that decides whether there is anything to do: this is
		 * called on every badge notification, and a badge notification happens on every
		 * render. Without the signature guard each of those started its own base-image
		 * fetch, and on a page whose base image is slow (a reverse proxy, a cold cache,
		 * a laptop waking up) every fetch was superseded before it landed — the tab icon
		 * fell further behind the numbers with every repaint instead of catching up.
		 * @param count - sessions needing you; 0 restores the plain icon.
		 * @param size - badge size key.
		 * @param force - recompose even when this exact picture was already drawn (the
		 *   page was disturbed, the base icon changed, the last compose failed).
		 */
		function composeFavicon(count, size, force) {
			const signature = faviconSignature(count, runningTotal, desiredIconHref());
			if (signature === faviconPendingSignature) return; // this very picture is being fetched
			if (force !== true && signature === faviconDrawnSignature && faviconFailed !== true) return; // already on the tab
			try {
				Promise.resolve(applyBadgeToFavicon(count, size)).then(
					() => {
						// The compose reports its own failure through `faviconFailed` (it never
						// rejects), so this is where one becomes a SHORT retry instead of a
						// wait for the next watchdog tick. A good compose resets the ladder.
						if (faviconFailed === true) { scheduleFaviconRetry(); return; }
						faviconRetryStep = 0;
						clearFaviconRetry();
					},
					(error) => { warnFaviconCompose(error); }
				);
			} catch (error) {
				// An `async` callee never throws synchronously, so this arm is dead TODAY —
				// it is here so a future refactor (an early-returning sync path) cannot
				// quietly reintroduce the silent "no warning, no badge" state.
				warnFaviconCompose(error);
			}
		}
		/**
		 * Re-assert the tab badge after anything outside this plugin disturbed the
		 * icon link — a cached page, a browser extension, a tab move, or a plugin
		 * reload. Our own output is a `data:` URL, so any other href means the
		 * composite was replaced and has to be rebuilt from the new base.
		 *
		 * "Still ours" is not the same as "still right": a `data:` href can carry an
		 * older number, or one whose compose died halfway. Comparing the picture that
		 * was actually written against the one that is wanted now is what lets this
		 * watchdog repair those — and what makes a failed compose a retry instead of a
		 * tab icon that is frozen for the rest of the page's life.
		 */
		function reconcileFavicon() {
			// Inspect EVERY icon link: 0.2.x ships two (dark/light), and a sibling
			// left stale by anything outside the plugin must be repaired too — that
			// stale sibling is exactly what used to outrank the icon we set.
			const hrefs = iconLinks().map((candidate) => candidate.getAttribute("href"));
			const ours = hrefs.length > 0 && hrefs.every((value) => typeof value === "string" && value.slice(0, 5) === "data:");
			const wanted = wantedFaviconSignature();
			if (ours && faviconDrawnSignature === wanted && faviconFailed !== true) return; // exactly right, right now
			const count = effectiveCount();
			if (count <= 0 && normalizeCount(runningTotal) <= 0) {
				// Carries the custom icon, or puts the shipped pair back. Both writers
				// only touch a link that actually differs, so this stays a no-op once
				// the page is correct and cannot re-arm the head observer.
				composeFavicon(0, badgeSize, ours !== true);
				return;
			}
			if (faviconComposing) return; // a build is already running
			composeFavicon(count, badgeSize, ours !== true);
		}
		// A freshly applied base icon replaces whatever the browser holds, so the
		// composite must be rebuilt from the NEW base instead of the stale one.
		function refreshFaviconBase() {
			faviconBase = null;
			composeFavicon(effectiveCount(), badgeSize, true);
		}
		//#endregion

		//#region unread panel
		//#region header panel
		/**
		 * Which list is open, and where the button that opened it sits.
		 *
		 * One store for both lists, and one open slot: the two numbers sit in the same
		 * header row, so two panels open at once would stack on top of each other
		 * under the same anchor. `mode` is therefore "unread" | "running" | null, and
		 * opening either closes the other by construction.
		 *
		 * The buttons and the floating list live in two different slots, so they
		 * cannot share React state — this tiny store is what they agree through.
		 */
		let panelMode = null;
		let panelAnchor = null;
		const panelListeners = new Set();
		function emitPanel(mode, anchor) {
			panelMode = mode === "unread" || mode === "running" ? mode : null;
			if (anchor !== undefined) panelAnchor = anchor;
			panelListeners.forEach((fn) => { try { fn(); } catch {} });
		}
		function subscribePanel(fn) {
			panelListeners.add(fn);
			return () => { panelListeners.delete(fn); };
		}
		/**
		 * One marker's button: open its list, or close it when it is already the open
		 * one. Clicking the OTHER marker switches lists instead of stacking them.
		 * @param mode - "unread" (the red count) or "running" (the yellow count).
		 * @param anchor - the clicked node's viewport rect, or undefined to keep the last one.
		 */
		function togglePanel(mode, anchor) {
			emitPanel(panelMode === mode ? null : mode, anchor === undefined ? null : anchor);
		}
		/**
		 * Tells the badge source that the marks moved somewhere it did not touch —
		 * the panel's "mark all read". It must re-render to re-emit the number (which
		 * also repaints the row dots and rebuilds the tab badge).
		 */
		const unreadPokeListeners = new Set();
		function emitUnreadPoke() {
			unreadPokeListeners.forEach((fn) => { try { fn(); } catch {} });
		}
		function subscribeUnreadPoke(fn) {
			unreadPokeListeners.add(fn);
			return () => { unreadPokeListeners.delete(fn); };
		}
		/**
		 * Roll the pending sessions up to one dot per workspace.
		 *
		 * Pure: `owners` maps sessionId → `{ id, title }` from the official workspace
		 * snapshot. Both halves matter downstream: the ID anchors the marker to the
		 * row the browser itself keys (`data-row-key="workspace:<id>"`), which is what
		 * makes the folder dot survive a Workspace whose displayed name differs from
		 * the stored title, two Workspaces sharing one title, and a title that is
		 * simply empty. The title stays for the tooltip; a session with neither falls
		 * back to the cwd basename `collectUnread` already carries.
		 * @returns `[{ id, name, count }]`, busiest workspace first.
		 */
		function dotsFromItems(items, owners) {
			const counts = new Map();
			for (const item of Array.isArray(items) ? items : []) {
				if (item === null || typeof item !== "object") continue;
				const owner = owners !== null && typeof owners === "object" ? owners[item.id] : undefined;
				const title = owner !== null && typeof owner === "object" && typeof owner.title === "string" ? owner.title : "";
				const name = title !== "" ? title : (typeof item.where === "string" ? item.where : "");
				if (name === "") continue;
				const id = owner !== null && typeof owner === "object" && typeof owner.id === "string" ? owner.id : "";
				// One dot per Workspace: two Sessions of the same Workspace must not
				// produce two entries that later paint on top of each other.
				const key = id !== "" ? id : name;
				const existing = counts.get(key);
				if (existing === undefined) counts.set(key, { id, name, count: 1 });
				else existing.count++;
			}
			return [...counts.values()]
				.sort((a, b) => b.count - a.count || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
		}

		/**
		 * Group the pending rows by workspace for the sidebar list.
		 *
		 * Pure and order-preserving: rows arrive already sorted by urgency, so the
		 * group holding the most urgent row naturally comes first, and rows that
		 * carry no workspace label fall into their own unlabelled bucket.
		 * @param items - rows from `collectUnread`.
		 * @returns `[{ where, items }]`.
		 */
		function groupUnreadByWorkspace(items) {
			const groups = [];
			const index = new Map();
			for (const item of Array.isArray(items) ? items : []) {
				const where = item !== null && typeof item === "object" && typeof item.where === "string" ? item.where : "";
				let group = index.get(where);
				if (group === undefined) {
					group = { where, items: [] };
					index.set(where, group);
					groups.push(group);
				}
				group.items.push(item);
			}
			return groups;
		}
		/**
		 * Age buckets, in the shipped sidebar's own units.
		 *
		 * Same thresholds as the official `relativeTime`: under a minute "now", then
		 * minutes / hours / days / months / years. Deliberately copied instead of
		 * imported — a display plugin must not depend on a Harness Client package —
		 * but the SHAPE has to match the sidebar's, because the whole point of
		 * showing it here is that a reader can line the panel's "13小时" up with the
		 * timestamp on the row itself.
		 * @param at - host-domain epoch milliseconds.
		 * @param now - host-domain now.
		 * @returns `{ unit, n }`, `unit` in `now|minutes|hours|days|months|years`.
		 */
		function relativeAgeParts(at, now) {
			const MINUTE = 60000, HOUR = 3600000, DAY = 86400000;
			const diff = Math.max(0, now - at);
			if (diff < MINUTE) return { unit: "now", n: 0 };
			if (diff < HOUR) return { unit: "minutes", n: Math.floor(diff / MINUTE) };
			if (diff < DAY) return { unit: "hours", n: Math.floor(diff / HOUR) };
			if (diff < 30 * DAY) return { unit: "days", n: Math.floor(diff / DAY) };
			if (diff < 365 * DAY) return { unit: "months", n: Math.floor(diff / (30 * DAY)) };
			return { unit: "years", n: Math.floor(diff / (365 * DAY)) };
		}
		/**
		 * One ending's age as text ("13小时" / "13h"), or "" when there is no time.
		 * @param at - host-domain epoch milliseconds, 0/absent for "unknown".
		 * @param now - host-domain now.
		 * @param t - locale binder.
		 * @returns the label.
		 */
		function unreadAgeLabel(at, now, t) {
			if (typeof at !== "number" || !Number.isFinite(at) || at <= 0) return "";
			const { unit, n } = relativeAgeParts(at, now);
			// Same shape as the shipped sidebar's own label: the "now" bucket carries
			// no number.
			return unit === "now" ? t("ageNow") : t(`age${unit[0].toUpperCase()}${unit.slice(1)}`, { n });
		}
		/**
		 * A short, unambiguous handle for a session: the first 8 characters of its id.
		 *
		 * Two sessions can share a title — that is precisely what made one red dot look
		 * unclearable, because the row could not be told apart from its namesake — and
		 * this is what distinguishes them when the titles do not.
		 * @param id - the session id.
		 * @returns the short form, or "".
		 */
		function shortSessionId(id) {
			if (typeof id !== "string" || id === "") return "";
			const bare = id.startsWith("session-") ? id.slice("session-".length) : id;
			return bare.slice(0, 8);
		}
		/**
		 * The dim second line of one panel row: why it is listed, how long ago that
		 * was, and which session it is.
		 * @param item - a row from `collectUnread`.
		 * @param now - host-domain now.
		 * @param t - locale binder.
		 * @returns the line, already joined.
		 */
		function unreadRowSubtitle(item, now, t) {
			const parts = [item.waiting === true ? t("unreadWaiting") : t("unreadEnded")];
			// A "waiting" row's `at` is Date.now() (it has no ending of its own), so only
			// turn-end rows carry a readable age.
			if (item.waiting !== true) {
				const age = unreadAgeLabel(item.at, now, t);
				if (age !== "") parts.push(age);
			}
			const short = shortSessionId(item.id);
			if (short !== "") parts.push(short);
			return parts.join(" · ");
		}
		/**
		 * The dim second line of one running row: that it is running, and which
		 * session it is. Deliberately no age — the official session list carries no
		 * "started at" fact (only `running: boolean`), and this plugin would rather
		 * print less than invent a time. Shape matches `unreadRowSubtitle` so the two
		 * lists read as one panel with two modes.
		 * @param item - a row from the badge bridge's `runningItems`.
		 * @param t - locale binder.
		 * @returns the line, already joined.
		 */
		function runningRowSubtitle(item, t) {
			const parts = [t("runningPanelRow")];
			const short = shortSessionId(item.id);
			if (short !== "") parts.push(short);
			return parts.join(" · ");
		}
		/**
		 * What "mark all read" may actually acknowledge: the turn-end rows.
		 *
		 * A "waiting for you" row is not watermark-based at all — it is listed while
		 * that interaction is live, and no mark can clear it — so the caller must
		 * leave it alone.
		 * @param items - rows from `collectUnread`.
		 * @returns `[{ id, seenAt }]`, each carrying the `endAt` it acknowledges.
		 */
		function unreadAckTargets(items) {
			const targets = [];
			for (const item of Array.isArray(items) ? items : []) {
				if (item === null || typeof item !== "object") continue;
				if (item.waiting === true) continue;
				if (typeof item.id !== "string" || item.id === "") continue;
				if (typeof item.at !== "number" || !Number.isFinite(item.at) || item.at <= 0) continue;
				targets.push({ id: item.id, seenAt: item.at });
			}
			return targets;
		}
		//#region reveal in sidebar
		/**
		 * Locating a clicked session in the sidebar: expand its workspace, scroll to the
		 * row, light it up for a moment.
		 *
		 * The official sidebar does exactly this by itself — but ONLY for its own search
		 * results. The state behind that (`revealSessionId`) is private to that component
		 * and no Service exposes it, while `uiWorkspace.openSession` switches the main
		 * view and nothing else. So this drives the shipped rows the way a user's click
		 * would: the workspace row toggles its group, the "show more" button raises the
		 * collapsed-session limit.
		 *
		 * It therefore reads the page structure, and it is DECORATIVE: by the time it runs
		 * the session is already open. Moved markup (a DSH upgrade), a rail sidebar or an
		 * open search box all degrade to "the sidebar did not move" — never to an error,
		 * and never to a blocked click.
		 */
		const REVEAL_ROW_KEY_ATTR = "data-row-key";
		const REVEAL_FLASH_ATTR = "data-icon-custom-flash";
		const REVEAL_FLASH_STYLE_ID = "dsh-icon-custom-flash-css";
		/** How long the located row stays lit. */
		const REVEAL_FLASH_MS = 1200;
		/**
		 * How many DOM steps one reveal may take.
		 *
		 * The official flow does this in one shot by writing its own state; we only have
		 * clicks, and every click needs a commit before the row can exist. The realistic
		 * worst case is a collapsed workspace whose session sits past "show more", which
		 * releases five rows per click — so this covers a workspace of roughly twenty
		 * sessions and then stops, rather than driving a shipped control in a loop.
		 */
		const REVEAL_MAX_STEPS = 6;
		/**
		 * The flash rules: a short outline pulse, not a lasting class. The point is to say
		 * "here it is", not to leave a mark on a shipped row.
		 */
		const REVEAL_FLASH_CSS = [
			`[${REVEAL_FLASH_ATTR}]{animation:dsh-icon-custom-flash ${REVEAL_FLASH_MS}ms ease-out}`,
			`@keyframes dsh-icon-custom-flash{0%{outline:2px solid var(--dsw-alias-state-business-primary,#4d6bfe);outline-offset:-2px}100%{outline:2px solid transparent;outline-offset:-2px}}`,
			`@media (prefers-reduced-motion:reduce){[${REVEAL_FLASH_ATTR}]{animation:none;outline:2px solid var(--dsw-alias-state-business-primary,#4d6bfe);outline-offset:-2px}}`
		].join("");
		/** The row currently lit, and the timer that will un-light it. */
		let revealFlashRow = null;
		let revealFlashTimer = 0;

		/**
		 * What to do next to make one session's row visible.
		 *
		 * Pure, so the order — and the giving up — is testable without a browser: a row
		 * that is already there gets scrolled to; otherwise its workspace is expanded;
		 * otherwise "show more" is clicked; otherwise nothing is touched at all.
		 * @param state - `{ hasRow, hasWorkspace, expanded, hasOverflow, overflowExpanded, steps }`.
		 * @returns `"scroll" | "expand" | "overflow" | "give-up"`.
		 */
		function revealAction(state) {
			if (state.hasRow === true) return "scroll";
			if (state.steps >= REVEAL_MAX_STEPS) return "give-up";
			if (state.hasWorkspace === true && state.expanded !== true) return "expand";
			// `overflowExpanded` must be false: that button toggles, and this feature has
			// no business COLLAPSING a workspace the reader deliberately opened up.
			if (state.hasOverflow === true && state.overflowExpanded !== true) return "overflow";
			return "give-up";
		}

		/**
		 * The shipped row carrying one `data-row-key`, matched by VALUE.
		 *
		 * Not by a selector built from the key: session ids go into the key verbatim, so a
		 * selector would need escaping rules that a plain comparison simply does not have.
		 * @param container - the browsing region root.
		 * @param key - e.g. `session:<id>` / `workspace:<id>` / `overflow:<id>`.
		 * @returns the element, or null.
		 */
		function findRowByKey(container, key) {
			try {
				for (const node of container.querySelectorAll(`[${REVEAL_ROW_KEY_ATTR}]`)) {
					if (node.getAttribute(REVEAL_ROW_KEY_ATTR) === key) return node;
				}
			} catch { /* a broken subtree must not become a thrown click */ }
			return null;
		}

		/** One paint's worth of waiting, so a click can commit before the row is looked for. */
		function nextPaint() {
			return new Promise((resolve) => {
				try {
					if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(() => resolve());
					else window.setTimeout(resolve, 16);
				} catch { resolve(); }
			});
		}

		/** Install the flash rules once per page. */
		function ensureRevealFlashStyle() {
			try {
				if (document.getElementById(REVEAL_FLASH_STYLE_ID) !== null) return;
				const style = document.createElement("style");
				style.id = REVEAL_FLASH_STYLE_ID;
				style.textContent = REVEAL_FLASH_CSS;
				document.head.appendChild(style);
			} catch { /* styling is cosmetic; never let it reach a click */ }
		}

		/** Take the flash off, whoever put it there. Also the unload path. */
		function clearRevealFlash() {
			if (revealFlashTimer !== 0) {
				try { window.clearTimeout(revealFlashTimer); } catch { /* the page is going away */ }
				revealFlashTimer = 0;
			}
			if (revealFlashRow !== null) {
				try { revealFlashRow.removeAttribute(REVEAL_FLASH_ATTR); } catch { /* already detached */ }
				revealFlashRow = null;
			}
		}

		/**
		 * Scroll one shipped row into view and light it for a moment.
		 *
		 * `block:"nearest"` is the official call and the reason a reveal does not yank the
		 * whole list: it moves the list only as far as the row needs.
		 * @param row - the session row element.
		 */
		function flashRow(row) {
			try {
				clearRevealFlash();
				ensureRevealFlashStyle();
				row.setAttribute(REVEAL_FLASH_ATTR, "1");
				revealFlashRow = row;
				revealFlashTimer = window.setTimeout(() => { clearRevealFlash(); }, REVEAL_FLASH_MS);
			} catch { /* cosmetic */ }
			try { row.scrollIntoView({ block: "nearest" }); } catch { /* older engines take no options */ }
		}

		/**
		 * Put one session's row in front of the reader.
		 *
		 * Best effort from the first line to the last: the session is ALREADY open when
		 * this runs, so every exit here — no container, no workspace id, a sidebar that
		 * never renders the row — costs the reader nothing but the scroll.
		 * @param sessionId - the session to locate.
		 * @param workspaceId - its workspace, when the official snapshot knows one.
		 */
		async function revealSessionRow(sessionId, workspaceId) {
			if (typeof sessionId !== "string" || sessionId === "") return;
			if (unreadConfig === null || typeof unreadConfig !== "object" || unreadConfig.revealOnOpen === false) return;
			const container = workspaceDotContainer();
			if (container === null) return;
			const wsKey = typeof workspaceId === "string" && workspaceId !== "" ? `workspace:${workspaceId}` : null;
			const moreKey = typeof workspaceId === "string" && workspaceId !== "" ? `overflow:${workspaceId}` : null;
			for (let steps = 0; steps < REVEAL_MAX_STEPS; steps++) {
				const row = findRowByKey(container, `session:${sessionId}`);
				const wsRow = wsKey === null ? null : findRowByKey(container, wsKey);
				const more = moreKey === null ? null : findRowByKey(container, moreKey);
				const action = revealAction({
					hasRow: row !== null,
					hasWorkspace: wsRow !== null,
					expanded: wsRow !== null && wsRow.getAttribute("aria-expanded") === "true",
					hasOverflow: more !== null,
					overflowExpanded: more !== null && more.getAttribute("aria-expanded") === "true",
					steps
				});
				if (action === "scroll") { flashRow(row); return; }
				if (action === "give-up") return;
				const target = action === "expand" ? wsRow : more;
				if (target === null) return;
				try { target.click(); } catch { return; }
				await nextPaint();
			}
		}
		//#endregion

		//#region workspace dots
		/**
		 * One dot on each workspace row's folder icon.
		 *
		 * This is the only part of the plugin that reaches into the shipped DOM: the
		 * browsing region is a single opaque seat (`sidebar.workspaces`, kind
		 * `single`) with no per-row slots, so a marker can only be injected. It is
		 * therefore built to fail quietly — see `noteWorkspaceDotFailure`, the
		 * give-up switch, and the `workspaceDot` setting that removes it entirely.
		 */
		const WS_DOT_ATTR = "data-icon-custom-wsdot";
		const ROW_DOT_ATTR = "data-icon-custom-rowdot";
		/** The running mark's two shapes: a dot after a session title (and on a folder icon), plus the header count. */
		const RUN_DOT_ATTR = "data-icon-custom-rundot";
		const RUN_WS_ATTR = "data-icon-custom-runws";
		/**
		 * How far the folder icon's red dot steps left when the yellow dot joins it.
		 *
		 * An 8px dot plus a 2px seam: the pair then still sits over the icon's right
		 * half instead of one of them hanging off into the workspace name. The red
		 * steps back the moment the yellow is gone, so the unread marker keeps its
		 * old place whenever it is alone.
		 */
		const WS_DOT_PAIR_SHIFT = 10;
		const WS_ROW_MIN_H = 18;
		const WS_ROW_MAX_H = 56;
		const WS_ROW_MIN_W = 80;
		const WS_MAX_FAILURES = 3;
		let workspaceDots = [];
		/** One entry per unread session: `{ id, title }`, matched against the row title. */
		let sessionDots = [];
		/** One entry per RUNNING session: `{ id, title }` — same shape, same row handle. */
		let runningSessionDots = [];
		/** One entry per workspace with running sessions: `{ id, name, count }`. */
		let runningWorkspaceMarks = [];
		let workspaceDotFailures = 0;
		let workspaceDotGivenUp = false;
		let workspaceDotPainting = false;
		/** When the last paint ran, so the observer can tell our churn from everyone else's. */
		let workspaceDotPaintedAt = 0;
		/** Pending "did our markers survive?" check, one shot per creation burst. */
		let workspaceDotVerify = 0;
		/** Rows whose inline `position` we changed, and what it was before. */
		let workspaceDotRestores = [];
		const workspaceDotListeners = new Set();
		function emitSidebarMarks(marks) {
			const next = marks !== null && typeof marks === "object" ? marks : {};
			workspaceDots = Array.isArray(next.workspaces) ? next.workspaces : [];
			sessionDots = Array.isArray(next.sessions) ? next.sessions : [];
			// The running marks ride the same store and the same paint pass as the
			// unread ones, but they are a different feature: they carry their own
			// arrays, and whichever switch is off empties only its own.
			runningSessionDots = Array.isArray(next.runningSessions) ? next.runningSessions : [];
			runningWorkspaceMarks = Array.isArray(next.runningWorkspaces) ? next.runningWorkspaces : [];
			workspaceDotListeners.forEach((fn) => { try { fn(); } catch {} });
		}
		function subscribeSidebarMarks(fn) {
			workspaceDotListeners.add(fn);
			return () => { workspaceDotListeners.delete(fn); };
		}
		/** The shipped browsing region, by the official slot marker (never by class name). */
		function workspaceDotContainer() {
			return document.querySelector('[data-slot="sidebar.workspaces"]')
				|| document.querySelector('[data-slot="sidebar"]')
				|| null;
		}
		function clearWorkspaceDots() {
			try { document.querySelectorAll("[" + WS_DOT_ATTR + "],[" + ROW_DOT_ATTR + "],[" + RUN_DOT_ATTR + "],[" + RUN_WS_ATTR + "]").forEach((node) => node.remove()); } catch {}
			for (const entry of workspaceDotRestores) { try { entry.el.style.position = entry.position; } catch {} }
			workspaceDotRestores = [];
		}
		function noteWorkspaceDotFailure(why) {
			workspaceDotFailures++;
			if (workspaceDotFailures === 1) {
				try { console.warn("dsh-icon-custom: 工作区红点定位失败,已降级(不影响其他功能):", why); } catch {}
				return;
			}
			if (workspaceDotFailures < WS_MAX_FAILURES || workspaceDotGivenUp) return;
			workspaceDotGivenUp = true;
			try { console.warn("dsh-icon-custom: 工作区红点连续失败,本次会话内已自动关闭,可在设置里关掉这一项。"); } catch {}
			// Take the markers OUT rather than leaving them frozen: a stale red dot
			// that no longer reflects the rule (or that can never be cleared) is worse
			// than no marker at all, and "breaks down to not showing" is this feature's
			// stated posture.
			clearWorkspaceDots();
		}
		/** The marker already sitting in this host for that key, or null. */
		function existingMarker(host, attribute, key) {
			for (const child of host.children) {
				if (child.getAttribute(attribute) === key) return child;
			}
			return null;
		}
		/** The one element whose trimmed text is exactly this name, or null. */
		function labelElementFor(container, name) {
			const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
			let hit = null;
			let hits = 0;
			let node = walker.nextNode();
			while (node !== null) {
				if (node.nodeValue !== null && node.nodeValue.trim() === name) { hits++; hit = node.parentElement; }
				node = walker.nextNode();
			}
			return hits === 1 ? hit : null;
		}
		/**
		 * The row box + folder icon a marker should hang off.
		 *
		 * Walks up from the label until it finds a row-sized box that ALSO contains an
		 * icon sitting left of the text — the only shape that means "this is the
		 * workspace row". Requiring that icon is load-bearing: without it the label
		 * itself (or any wider wrapper) qualifies as the row, and the marker lands at
		 * the end of the text instead of on the icon.
		 * @returns `{ row, icon }`, or null when this row cannot be trusted.
		 */
		function markerTargetFor(label) {
			const labelRect = label.getBoundingClientRect();
			let element = label;
			for (let step = 0; step < 6 && element !== null && element !== undefined; step++) {
				const icon = element.querySelector("svg");
				if (icon !== null) {
					const rect = element.getBoundingClientRect();
					const iconRect = icon.getBoundingClientRect();
					if (rect.height >= WS_ROW_MIN_H && rect.height <= WS_ROW_MAX_H && rect.width >= WS_ROW_MIN_W && iconRect.left < labelRect.left) {
						return { row: element, icon };
					}
				}
				element = element.parentElement;
			}
			return null;
		}
		/**
		 * The title element a session marker hangs off.
		 *
		 * A session row has no icon to anchor on, so its marker is inserted inline right
		 * after the title. That only works when `label` is the TIGHT holder of the title
		 * text: a wrapper that merely contains it would push the marker past the
		 * timestamp, and a row holding the text directly has no inline slot at all.
		 * @returns `{ title, row }`, or null when this row cannot be trusted.
		 */
		function titleTargetFor(label, title) {
			if (label === null || label === undefined) return null;
			if (typeof label.textContent !== "string" || label.textContent.trim() !== title) return null;
			const row = label.parentElement;
			if (row === null || row === undefined || row === label) return null;
			const rect = row.getBoundingClientRect();
			if (rect.height < WS_ROW_MIN_H || rect.height > WS_ROW_MAX_H || rect.width < WS_ROW_MIN_W) return null;
			return { title: label, row };
		}
		/**
		 * The DOM row of one session, by the official row key.
		 *
		 * ui-workspace stamps every row with `data-row-key` (`session:<id>`,
		 * `workspace:<id>`, `overflow:<id>`), which is the only stable, unambiguous
		 * handle on a row: titles are neither unique (two sessions can share one) nor
		 * stable (a generated title lands later). Matching by title text used to find
		 * two rows and refuse, so a session whose title collided with another's could
		 * never be marked at all.
		 * @param container - the browsing region root.
		 * @param id - the session id.
		 * @returns the row element, or null.
		 */
		function sessionRowElement(container, id) {
			if (typeof id !== "string" || id === "") return null;
			try { return container.querySelector(`[data-row-key="session:${id}"]`); } catch { return null; }
		}
		/**
		 * Where one session's marker goes: the tight title holder INSIDE that
		 * session's own row. The row is found by `data-row-key`; the title inside it
		 * is still matched by text, because that is the element the marker hangs off.
		 *
		 * A Session whose row is NOT in the DOM — folded behind "Show more", inside a
		 * collapsed Workspace, or filtered out — gets NO marker. It used to fall back
		 * to a whole-region title match, and that guess is exactly what puts a dot on
		 * the wrong row: a DIFFERENT Session with the same title owns the only
		 * rendered text node of that name, so the folded one's marker landed on the
		 * visible one's row (two markers on one row, none on the real one). The
		 * Workspace folder dot and the pending panel already speak for Sessions whose
		 * rows are not rendered, so skipping loses no information.
		 *
		 * `legacyTitleMatch` is reserved for a build that stamps no row keys at all,
		 * where the title is the only handle that exists.
		 * @param legacyTitleMatch - whether this build predates `data-row-key`.
		 * @returns `{ title, row }`, or null when this row cannot be trusted.
		 */
		function sessionRowTarget(container, id, title, legacyTitleMatch) {
			const row = sessionRowElement(container, id);
			if (row !== null) {
				const inside = labelElementFor(row, title);
				return inside === null ? null : titleTargetFor(inside, title);
			}
			if (legacyTitleMatch !== true) return null;
			return titleTargetFor(labelElementFor(container, title), title);
		}
		/**
		 * Whether the shipped browser stamps Session rows with `data-row-key`.
		 *
		 * Asked once per paint, not once per row: the strict path is only relaxed for
		 * a build that has no row keys anywhere, never for one unlucky lookup.
		 * @param container - the browsing region root (non-null).
		 * @returns true when row keys are in use (and on any probe failure — the
		 * strict path is the safe default).
		 */
		function sessionRowKeysInUse(container) {
			try { return container.querySelector('[data-row-key^="session:"]') !== null; } catch { return true; }
		}
		/**
		 * The DOM row of one Workspace, by the official row key, or null.
		 *
		 * Same handle as `sessionRowElement`, and the reason the folder dot no longer
		 * depends on the displayed name: DSH renders a Workspace still carrying its
		 * automatic title under a localized default name, and two Workspaces can share
		 * one title, so a text match can miss or collide.
		 * @param container - the browsing region root.
		 * @param id - the Workspace id.
		 * @returns the row element, or null.
		 */
		function workspaceRowElement(container, id) {
			if (typeof id !== "string" || id === "") return null;
			try { return container.querySelector(`[data-row-key="workspace:${id}"]`); } catch { return null; }
		}
		/**
		 * The row box + folder icon a Workspace marker hangs off, from the keyed row.
		 *
		 * The key normally sits on the row itself; a build that stamps it on a group
		 * wrapper fails the row-size check, so a bounded set of that wrapper's own rows
		 * gets the same test before giving up. Either way the marker must land on a
		 * row-sized box whose LEADING glyph is the folder — requiring a left-hand icon
		 * is what keeps the dot off the end of the text.
		 * @returns `{ row, icon }`, or null when this row cannot be trusted.
		 */
		function folderTargetFor(row) {
			if (row === null || row === undefined) return null;
			const candidates = [row];
			try {
				const inner = row.querySelectorAll("div");
				for (let i = 0; i < inner.length && candidates.length < 12; i++) candidates.push(inner[i]);
			} catch { /* the keyed element alone is still worth testing */ }
			for (const candidate of candidates) {
				const rect = candidate.getBoundingClientRect();
				if (rect.height < WS_ROW_MIN_H || rect.height > WS_ROW_MAX_H || rect.width < WS_ROW_MIN_W) continue;
				const icons = candidate.querySelectorAll("svg");
				for (const icon of icons) {
					const iconRect = icon.getBoundingClientRect();
					if (iconRect.width <= 0 || iconRect.height <= 0) continue;
					if (iconRect.left - rect.left > rect.width / 3) continue;
					return { row: candidate, icon };
				}
			}
			return null;
		}
		/**
		 * The stable key a Workspace marker is stored under: its ID when known.
		 *
		 * The attribute value used to be the displayed title, which two Workspaces can
		 * share — the reconcile pass would then treat one of them as a stranger and
		 * remove a marker that is still wanted.
		 * @param entry - one `{ id, name }` entry from `dotsFromItems`.
		 * @returns the key, or undefined when the entry carries neither.
		 */
		function workspaceDotKey(entry) {
			if (entry === null || typeof entry !== "object") return undefined;
			if (typeof entry.id === "string" && entry.id !== "") return entry.id;
			return entry.name;
		}
		function paintWorkspaceDots() {
			if (workspaceDotGivenUp) return;
			const enabled = unreadConfig.workspaceDot !== false;
			const wanted = enabled ? workspaceDots : [];
			const wantedRows = enabled ? sessionDots : [];
			// A separate switch for a separate feature: the running marks keep working
			// when the unread dots are turned off, and vice versa.
			const runningEnabled = runningConfig.enabled !== false;
			const wantedRunningRows = runningEnabled ? runningSessionDots : [];
			const wantedRunningMarks = runningEnabled ? runningWorkspaceMarks : [];
			const container = workspaceDotContainer();
			workspaceDotPainting = true;
			workspaceDotPaintedAt = Date.now();
			let placed = 0;
			let created = 0;
			let missed = 0;
			try {
				// Reconcile, never wipe-and-redraw: a marker that is already correct is
				// left untouched, so one unlucky lookup (a re-render in flight, a name
				// matched twice for a moment) can no longer blink an existing dot away.
				const wantedNames = new Set(wanted.map((entry) => workspaceDotKey(entry)));
				const wantedIds = new Set(wantedRows.map((entry) => entry.id));
				const wantedRunningIds = new Set(wantedRunningRows.map((entry) => entry.id));
				const wantedRunningNames = new Set(wantedRunningMarks.map((entry) => workspaceDotKey(entry)));
				document.querySelectorAll("[" + WS_DOT_ATTR + "]").forEach((node) => {
					if (!node.isConnected || !wantedNames.has(node.getAttribute(WS_DOT_ATTR))) node.remove();
				});
				document.querySelectorAll("[" + ROW_DOT_ATTR + "]").forEach((node) => {
					if (!node.isConnected || !wantedIds.has(node.getAttribute(ROW_DOT_ATTR))) node.remove();
				});
				document.querySelectorAll("[" + RUN_DOT_ATTR + "]").forEach((node) => {
					if (!node.isConnected || !wantedRunningIds.has(node.getAttribute(RUN_DOT_ATTR))) node.remove();
				});
				document.querySelectorAll("[" + RUN_WS_ATTR + "]").forEach((node) => {
					if (!node.isConnected || !wantedRunningNames.has(node.getAttribute(RUN_WS_ATTR))) node.remove();
				});
				if (container === null) { workspaceDotPainting = false; return; } // start-up race
				const legacyTitleMatch = !sessionRowKeysInUse(container);
				for (const entry of wanted) {
					const key = workspaceDotKey(entry);
					if (key === undefined) { missed++; continue; }
					// The browser's own row key first; the title walk-up is only for a build
					// that stamps no Workspace keys (or an entry the snapshot could not name).
					const keyedRow = workspaceRowElement(container, entry.id);
					let target = keyedRow === null ? null : folderTargetFor(keyedRow);
					if (target === null && keyedRow === null) {
						const label = labelElementFor(container, entry.name);
						target = label === null ? null : markerTargetFor(label);
					}
					if (target === null) { missed++; continue; }
					const row = target.row;
					const icon = target.icon;
					const rowRect = row.getBoundingClientRect();
					const anchorRect = icon.getBoundingClientRect();
					if (window.getComputedStyle(row).position === "static") {
						workspaceDotRestores.push({ el: row, position: row.style.position });
						row.style.position = "relative";
					}
					// "Left red, right yellow": the yellow takes the corner this dot has
					// always used, and the red steps one dot to the left while the pair is
					// together (and steps back the moment the yellow is gone).
					const paired = existingMarker(row, RUN_WS_ATTR, key) !== null;
					const left = Math.round(anchorRect.right - rowRect.left - 4 - (paired ? WS_DOT_PAIR_SHIFT : 0));
					const top = Math.round(anchorRect.top - rowRect.top - 3);
					const existingDot = existingMarker(row, WS_DOT_ATTR, key);
					if (existingDot !== null) {
						if (existingDot.style.left !== left + "px") existingDot.style.left = left + "px";
						if (existingDot.style.top !== top + "px") existingDot.style.top = top + "px";
						placed++;
						continue;
					}
					const dot = document.createElement("span");
					dot.setAttribute(WS_DOT_ATTR, key);
					dot.setAttribute("aria-hidden", "true");
					dot.title = (typeof entry.name === "string" && entry.name !== "" ? entry.name : key) + " · " + entry.count;
					dot.style.cssText = "position:absolute;pointer-events:none;width:8px;height:8px;border-radius:50%;"
						+ "background:#e5484d;box-shadow:0 0 0 1.5px var(--dsw-alias-bg-layer-1,#fff);";
					dot.style.left = left + "px";
					dot.style.top = top + "px";
					row.appendChild(dot);
					placed++;
					created++;
				}
				// Workspace rows: the running mark is a yellow DOT on the folder icon
				// (the count lives in the section header, where a number is readable).
				// "Left red, right yellow": the yellow takes the corner the red has
				// always used and the red steps aside by exactly one dot.
				for (const entry of wantedRunningMarks) {
					const key = workspaceDotKey(entry);
					if (key === undefined) { missed++; continue; }
					const keyedRow = workspaceRowElement(container, entry.id);
					const target = keyedRow === null ? null : folderTargetFor(keyedRow);
					if (target === null) { missed++; continue; }
					const row = target.row;
					const runDot = existingMarker(row, RUN_WS_ATTR, key);
					const icon = target.icon;
					const rowRect = row.getBoundingClientRect();
					const anchorRect = icon.getBoundingClientRect();
					if (window.getComputedStyle(row).position === "static") {
						workspaceDotRestores.push({ el: row, position: row.style.position });
						row.style.position = "relative";
					}
					const corner = Math.round(anchorRect.right - rowRect.left - 4);
					const top = Math.round(anchorRect.top - rowRect.top - 3);
					// The red keeps the pair's LEFT seat. It is nudged here as well as in
					// its own loop because on the first paint it cannot see a yellow that
					// does not exist yet — both places compute the same number, so the
					// pair never oscillates.
					const red = existingMarker(row, WS_DOT_ATTR, key);
					if (red !== null) {
						const redLeft = corner - WS_DOT_PAIR_SHIFT;
						if (red.style.left !== redLeft + "px") red.style.left = redLeft + "px";
						if (red.style.top !== top + "px") red.style.top = top + "px";
					}
					if (runDot !== null) {
						if (runDot.style.left !== corner + "px") runDot.style.left = corner + "px";
						if (runDot.style.top !== top + "px") runDot.style.top = top + "px";
						placed++;
						continue;
					}
					const mark = document.createElement("span");
					mark.setAttribute(RUN_WS_ATTR, key);
					mark.setAttribute("aria-hidden", "true");
					mark.title = (entry.name !== "" ? entry.name : key) + " · " + entry.count;
					mark.style.cssText = "position:absolute;pointer-events:none;width:8px;height:8px;border-radius:50%;"
						+ "background:" + RUNNING_YELLOW + ";box-shadow:0 0 0 1.5px var(--dsw-alias-bg-layer-1,#fff);";
					mark.style.left = corner + "px";
					mark.style.top = top + "px";
					row.appendChild(mark);
					placed++;
					created++;
				}
				// Session rows: RED first, then YELLOW — "left red, right yellow", and a
				// fixed order no matter which of the two features changed last.
				for (const entry of wantedRows) {
					const target = sessionRowTarget(container, entry.id, entry.title, legacyTitleMatch);
					if (target === null) { missed++; continue; }
					const existing = existingMarker(target.row, ROW_DOT_ATTR, entry.id);
					if (existing !== null) {
						// Both markers can survive a repaint; keep the red in front of the
						// yellow (a red painted while the yellow was gone would otherwise
						// stay glued to the title).
						const runDot = existingMarker(target.row, RUN_DOT_ATTR, entry.id);
						if (runDot !== null && existing.nextElementSibling !== runDot) existing.insertAdjacentElement("afterend", runDot);
						placed++;
						continue;
					}
					const dot = document.createElement("span");
					dot.setAttribute(ROW_DOT_ATTR, entry.id);
					dot.setAttribute("aria-hidden", "true");
					dot.title = entry.title;
					// Tight to the title on the left, and kept off the timestamp on the
					// right: with no right margin the dot reads as part of "24 分钟".
					dot.style.cssText = "pointer-events:none;flex:none;width:8px;height:8px;border-radius:50%;"
						+ "background:#e5484d;margin:0 5px 0 6px;";
					target.title.insertAdjacentElement("afterend", dot);
					placed++;
					created++;
				}
				for (const entry of wantedRunningRows) {
					const target = sessionRowTarget(container, entry.id, entry.title, legacyTitleMatch);
					if (target === null) { missed++; continue; }
					if (existingMarker(target.row, RUN_DOT_ATTR, entry.id) !== null) { placed++; continue; }
					const runDot = document.createElement("span");
					runDot.setAttribute(RUN_DOT_ATTR, entry.id);
					runDot.setAttribute("aria-hidden", "true");
					runDot.title = entry.title;
					runDot.style.cssText = "pointer-events:none;flex:none;width:8px;height:8px;border-radius:50%;"
						+ "background:" + RUNNING_YELLOW + ";margin:0 4px 0 0;";
					const red = existingMarker(target.row, ROW_DOT_ATTR, entry.id);
					if (red !== null) red.insertAdjacentElement("afterend", runDot);
					else target.title.insertAdjacentElement("afterend", runDot);
					placed++;
					created++;
				}
			} catch (error) {
				missed++;
				noteWorkspaceDotFailure(String((error && error.message) || error));
			} finally {
				workspaceDotPainting = false;
			}
			// The breaker watches the MECHANISM, not one unlucky row: only a run that
			// placed nothing at all counts as a failure.
			if (placed > 0) workspaceDotFailures = 0;
			else if (missed > 0) noteWorkspaceDotFailure("这一轮没有任何工作区行能定位:" + missed + " 个");
			// If the shipped UI committed a re-render inside our quiet window it could
			// have taken a fresh marker with it, and we would have ignored that
			// mutation. One settle check shortly after closes that hole.
			if (created > 0) {
				if (workspaceDotVerify !== 0) window.clearTimeout(workspaceDotVerify);
				workspaceDotVerify = window.setTimeout(() => { workspaceDotVerify = 0; paintWorkspaceDots(); }, 700);
			}
		}
		//#endregion

		//#region header ring
		/**
		 * One yellow ring on the conversation header's sub-agent count.
		 *
		 * The official "N sub-agents" row is a `button[aria-haspopup="tree"]` inside
		 * the `conversation.session.header.actions` slot, and its count is the LAST
		 * `<span>` child of that button. The ring is stacked on that span's top-right
		 * corner — the same corner logic as the workspace folder's yellow dot — and it
		 * is display only: not clickable, `pointer-events:none`, `aria-hidden` because
		 * the official button's own label already announces the running count.
		 *
		 * The number is the official `subagentCatalog` projection of the session on
		 * screen, counting only DIRECT children that are running. It never joins any
		 * other count this plugin draws (sidebar dots, the top-left number, the tab
		 * icon, the OS badge), so this switch can never move one of them.
		 *
		 * Class names are build hashes and are never used; the anchor is found by the
		 * official `data-slot` plus structure/role only. Like the sidebar marks this
		 * half is injected into shipped DOM, reconciled instead of redrawn, quiet when
		 * it cannot find the anchor, and self-disabling after repeated failures.
		 */
		const HEAD_RING_ATTR = "data-icon-custom-headring";
		/** Marks the count element whose inline `position` we changed, for restore. */
		const HEAD_RING_HOST_ATTR = "data-icon-custom-headring-host";
		/** Breaker ceiling: a changed header structure must not warn forever. */
		const HEAD_RING_MAX_FAILURES = 20;
		/** The number for the session on screen; -1 means "no answer, draw nothing". */
		let headerRingValue = -1;
		let headerRingFailures = 0;
		let headerRingGivenUp = false;
		let headerRingHost = null;
		let headerRingHostPosition = "";
		let headerRingObserved = null;
		let headerRingObserver = null;
		/** The session service lookup, filled in by `apply` (may stay null). */
		let headerRingSessions = null;
		/** Throttle for the "catalog projection not loaded yet" refresh ask. */
		let headerRingRefreshSession = "";
		let headerRingRefreshAt = 0;

		/**
		 * How many DIRECT children of `sessionId` are running, from the official
		 * `subagentCatalog` projection.
		 *
		 * Grandchildren are not part of a parent's catalog, so they are excluded by
		 * construction. `status` (the official session-status map) wins over the list
		 * row exactly the way the shipped sidebar reads it. An unloaded projection is
		 * 0, never a guess.
		 * @param list - the session list snapshot (may be absent).
		 * @param status - the official session-status map (may be absent).
		 * @param sessionId - the session whose header is on screen.
		 * @returns the count of running direct children.
		 */
		function headerRingCount(list, status, sessionId) {
			if (typeof sessionId !== "string" || sessionId === "") return 0;
			if (list === null || typeof list !== "object") return 0;
			const projections = list.projectionsBySession;
			if (projections === null || typeof projections !== "object") return 0;
			const snapshot = projections[sessionId];
			const values = snapshot !== null && typeof snapshot === "object" ? snapshot.values : undefined;
			const catalog = values !== null && typeof values === "object" ? values.subagentCatalog : undefined;
			if (!Array.isArray(catalog)) return 0;
			const byId = list.byId !== null && typeof list.byId === "object" ? list.byId : {};
			const lookup = status !== null && status !== undefined && typeof status.get === "function" ? (id) => status.get(id) : () => undefined;
			let count = 0;
			for (const entry of catalog) {
				if (entry === null || typeof entry !== "object" || typeof entry.id !== "string" || entry.id === "") continue;
				const row = lookup(entry.id);
				const known = row !== null && typeof row === "object" && typeof row.running === "boolean";
				const fallback = byId[entry.id];
				const running = known ? row.running : fallback !== null && typeof fallback === "object" ? fallback.running : undefined;
				if (running === true) count++;
			}
			return count;
		}

		/**
		 * Whether that session's catalog projection is loaded at all. `undefined`
		 * means "not asked yet" — the one case worth nudging the host about (see
		 * `requestHeaderRingRefresh`); an empty array is a real answer.
		 */
		function headerRingCatalogLoaded(list, sessionId) {
			if (list === null || typeof list !== "object" || typeof sessionId !== "string" || sessionId === "") return false;
			const projections = list.projectionsBySession;
			const snapshot = projections !== null && typeof projections === "object" ? projections[sessionId] : undefined;
			const values = snapshot !== null && typeof snapshot === "object" ? snapshot.values : undefined;
			return values !== null && typeof values === "object" && Array.isArray(values.subagentCatalog);
		}

		/**
		 * Ask the host to fold that session's projections, at most once per 10 s. The
		 * service lookup is optional (`apply` fills it in): without it the next render
		 * simply tries again, which is the documented fallback.
		 */
		function requestHeaderRingRefresh(sessionId) {
			const now = Date.now();
			if (sessionId === headerRingRefreshSession && now - headerRingRefreshAt < 10000) return;
			headerRingRefreshSession = sessionId;
			headerRingRefreshAt = now;
			try {
				const service = typeof headerRingSessions === "function" ? headerRingSessions() : null;
				const refresh = service !== null && service !== undefined ? service.refreshProjections : undefined;
				if (typeof refresh !== "function") return;
				const result = refresh.call(service, sessionId);
				if (result !== null && typeof result === "object" && typeof result.catch === "function") result.catch(() => {});
			} catch { /* best effort: the next render is the fallback */ }
		}

		/** The rendered action button for the session on screen, or null. */
		function headerRingButton() {
			try {
				const slots = document.querySelectorAll('[data-slot="conversation.session.header.actions"]');
				if (slots === null || slots === undefined) return null;
				for (const slot of slots) {
					// The right sidebar keeps an embedded conversation MOUNTED while
					// collapsed (hidden by CSS and `inert`), so its header actions must
					// never be the anchor for the visible conversation's ring. Same guard
					// as `conversationOnScreen` uses for the same duplicate.
					if (typeof slot.closest === "function" && (slot.closest("[data-sidebar-right-panel]") !== null || slot.closest("[inert]") !== null)) continue;
					if (typeof slot.querySelectorAll !== "function") continue;
					for (const button of slot.querySelectorAll("button")) {
						if (button.getAttribute("aria-haspopup") === "tree") return button;
					}
				}
				return null;
			} catch { return null; }
		}

		/** The count element: the LAST `<span>` direct child of that button. */
		function headerRingCountElement(button) {
			let found = null;
			if (button === null || button === undefined || button.children === undefined) return null;
			for (const child of button.children) {
				if (child === null || child === undefined || child.tagName !== "SPAN") continue;
				if (child.getAttribute(HEAD_RING_ATTR) !== null) continue;
				found = child;
			}
			return found;
		}

		/**
		 * Whether the decoration must stay off this conversation. A sub-agent's own
		 * session renders no header row at all, so it must render no ring either.
		 */
		function headerRingSuppressed(list, sessionId) {
			if (typeof sessionId !== "string" || sessionId === "") return true;
			if (list === null || typeof list !== "object") return true;
			const byId = list.byId !== null && typeof list.byId === "object" ? list.byId : {};
			const entry = byId[sessionId];
			// No row means the page cannot prove this is not a sub-agent's own
			// conversation: suppress rather than draw on a page we cannot read.
			if (entry === null || typeof entry !== "object") return true;
			return entry.origin === "subagent";
		}

		/**
		 * The effective number to draw. `-1` (no answer) and `0` both mean "draw
		 * nothing"; the switch is the only other input. Pure, so the switch and the
		 * zero case are testable without a DOM.
		 */
		function headerRingVisibleCount(config, count) {
			const enabled = !(config !== null && typeof config === "object" && config.headerRing === false);
			if (!enabled) return -1;
			const value = Number(count);
			return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
		}

		/** Remove the ring and put the count element's own `position` back. */
		function clearHeaderRing() {
			try { document.querySelectorAll("[" + HEAD_RING_ATTR + "]").forEach((node) => node.remove()); } catch {}
			if (headerRingHost !== null) {
				try { headerRingHost.style.position = headerRingHostPosition; } catch {}
				try { headerRingHost.removeAttribute(HEAD_RING_HOST_ATTR); } catch {}
			}
			headerRingHost = null;
			headerRingHostPosition = "";
			if (headerRingObserver !== null) {
				try { headerRingObserver.disconnect(); } catch {}
				headerRingObserver = null;
			}
			headerRingObserved = null;
		}

		/** Watch the header slot, so a re-render that dropped the ring gets it back. */
		function observeHeaderRingAnchor(button) {
			if (typeof window === "undefined" || window === null || typeof window.MutationObserver !== "function") return;
			const slot = button !== null && typeof button.closest === "function" ? button.closest('[data-slot="conversation.session.header.actions"]') : null;
			if (slot === null || slot === undefined || slot === headerRingObserved) return;
			try {
				if (headerRingObserver !== null) headerRingObserver.disconnect();
				headerRingObserver = new window.MutationObserver(() => { repaintHeaderRing(); });
				headerRingObserver.observe(slot, { childList: true, subtree: true, characterData: true });
				headerRingObserved = slot;
			} catch {
				headerRingObserver = null;
				headerRingObserved = null;
			}
		}

		/** Re-run the current value; used by the observer, which has no arguments. */
		function repaintHeaderRing() {
			paintHeaderRing(runningConfig, headerRingValue);
		}

		/** Warn once, then give up for this page — the sidebar marks' exact posture. */
		function noteHeaderRingFailure(why) {
			headerRingFailures++;
			if (headerRingFailures === 1) {
				try { console.warn("dsh-icon-custom: 会话头部黄圈定位失败,已降级(不影响其他功能):", why); } catch {}
				return;
			}
			if (headerRingFailures < HEAD_RING_MAX_FAILURES || headerRingGivenUp) return;
			headerRingGivenUp = true;
			try { console.warn("dsh-icon-custom: 会话头部黄圈连续失败,本次会话内已自动关闭。"); } catch {}
			clearHeaderRing();
		}

		/**
		 * Reconcile the ring with the current number. Idempotent (writes only what
		 * differs) and quiet when the anchor is not on this page (a sub-agent's own
		 * conversation, the landing view, a boot).
		 * @param config - the running config, for the `headerRing` switch.
		 * @param count - the ring's number, from `headerRingCount`; -1 hides it.
		 */
		function paintHeaderRing(config, count) {
			if (headerRingGivenUp) return;
			const value = headerRingVisibleCount(config, count);
			if (value <= 0) { clearHeaderRing(); return; }
			const button = headerRingButton();
			// No anchor is not a failure: child sessions render no header row, and the
			// page may simply be booting. Leave whatever is there alone and wait.
			if (button === null) { clearHeaderRing(); return; }
			const anchor = headerRingCountElement(button);
			if (anchor === null) { noteHeaderRingFailure("找不到计数元素"); return; }
			try {
				if (headerRingHost !== anchor) {
					clearHeaderRing();
					headerRingHost = anchor;
					headerRingHostPosition = anchor.style.position;
					anchor.setAttribute(HEAD_RING_HOST_ATTR, "1");
					if (window.getComputedStyle(anchor).position === "static") anchor.style.position = "relative";
				}
				observeHeaderRingAnchor(button);
				let node = anchor.querySelector("[" + HEAD_RING_ATTR + "]");
				if (node === null) {
					node = document.createElement("span");
					node.setAttribute(HEAD_RING_ATTR, "1");
					// Not a control and never announced: the official button's own label
					// already speaks the running count.
					node.setAttribute("aria-hidden", "true");
					// Looks like the sidebar workspace's red count: a rounded-square pill (never a
					// full circle), with a dark number on the running yellow.
					node.style.cssText = "position:absolute;pointer-events:none;top:-6px;right:-5px;display:inline-flex;"
						+ "align-items:center;justify-content:center;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;"
						+ "border-radius:6px;background:" + RUNNING_YELLOW + ";color:#1f2328;font:inherit;font-size:11px;"
						+ "font-weight:600;line-height:16px;font-variant-numeric:tabular-nums;z-index:3;"
						+ "box-shadow:0 0 0 1.5px var(--dsw-alias-bg-layer-1,#fff)";
					anchor.appendChild(node);
				}
				const text = badgeLabel(value);
				if (node.textContent !== text) node.textContent = text;
				headerRingFailures = 0;
			} catch (error) {
				noteHeaderRingFailure(String((error && error.message) || error));
			}
		}
		//#endregion

		//#region components
		/**
		 * Headless occupant of the frame-wide `shell.overlay` slot. It reads DSH's
		 * own pending-interaction registry — the very same source that paints the
		 * sidebar session-row marker — and feeds "how many sessions are waiting for
		 * you" into the badge bridge. Renders nothing.
		 *
		 * This is the entire integration: an official standard prop goes in, a
		 * number comes out. The icon plugin never learns which plugin published an
		 * interaction, so swapping or removing any of them cannot break it — the
		 * count simply drops back to 0.
		 */
		function BadgeSource(props) {
			// The hooks below are official root-scope standard props: the session list
			// (which carries every session's `lastTurnEnd` projection value), the
			// session-status map the sidebar row marker already uses, and the workspace
			// snapshot that names each row.
			const list = typeof props.useSessions === "function" ? props.useSessions((state) => state) : undefined;
			// 0.2.x has no `useSessionPendingInteraction` — the string occurs nowhere in
			// the runtime, so this half used to contribute nothing at all. The official
			// replacement is the session-status map, whose rows carry `pendingInteraction`
			// (alongside `completionUnread`, which the shipped sidebar reads too). Reshape
			// it into the `id → { kind }` map `collectUnread` expects.
			const status = typeof props.useSessionStatus === "function" ? props.useSessionStatus((map) => map) : undefined;
			const pending = React.useMemo(() => {
				const out = new Map();
				if (status === null || status === undefined || typeof status.forEach !== "function") return out;
				status.forEach((value, id) => {
					const interaction = value !== null && typeof value === "object" ? value.pendingInteraction : undefined;
					if (interaction === null || interaction === undefined) return;
					const kind = typeof interaction === "object" && typeof interaction.kind === "string" ? interaction.kind : "";
					out.set(id, { kind });
				});
				return out;
			}, [status]);
			const workspaces = typeof props.useWorkspaces === "function" ? props.useWorkspaces((state) => state) : undefined;
			const [config, setConfig] = React.useState(unreadConfig);
			React.useEffect(() => subscribeUnreadConfig(setConfig), []);
			// The running mark's own switch. Same shape, separate feature: the two
			// never share state, so one switch can never move the other's marks.
			const [running, setRunning] = React.useState(runningConfig);
			React.useEffect(() => subscribeRunningConfig(setRunning), []);
			// Baseline new sessions; persists only when it actually learns something.
			React.useEffect(() => {
				const ids = list !== null && typeof list === "object" && Array.isArray(list.ids) ? list.ids : [];
				if (!ensureSeenBaseline(ids)) return;
				pruneSeenState();
				saveSeenState();
				// The watermark moved under a render that was already counted without it:
				// repaint in the same breath, exactly like the Host-merge path below, so
				// nothing on screen can keep a number the new baseline already answers.
				emitUnreadPoke();
			}, [list]);
			// What the page says about the screen, refreshed on the two moments that can
			// change it without the session list changing: a global panel replacing the
			// conversation (its own standard prop, the same one the shipped sidebar reads)
			// and the tab going to the background. Both are read here, not inferred, so
			// "you are looking at it" stops being a guess about stale retention.
			// Pausing signals, NOT leaving signals: they stop the stay clock without
			// touching which session this page is on (so the entered-at snapshot
			// survives). Only switching to another session counts as leaving.
			const panelActive = typeof props.usePanelInfo === "function"
				? props.usePanelInfo((info) => info !== null && typeof info === "object" && info.activePanelId !== null)
				: false;
			const [visible, setVisible] = React.useState(documentVisible);
			React.useEffect(() => {
				const onVisibility = () => setVisible(documentVisible());
				window.addEventListener("visibilitychange", onVisibility);
				return () => window.removeEventListener("visibilitychange", onVisibility);
			}, []);
			/** Looking at the conversation right now: on screen, and this tab in front. */
			const watching = visible && panelActive !== true;
			// Read the screen once per render: which session the visible conversation
			// renders (`displayed`), whether it is up but showing none (`idle` — the
			// landing view, a real "you are not in a session"), and whether it is not up
			// at all (neither ⇒ `known: false`, and the entered-at snapshots stay).
			const onScreen = conversationOnScreen();
			const viewed = viewedSessions(list, {
				displayed: onScreen.id,
				official: officialSessionId(),
				idle: onScreen.rendered === true && onScreen.id === undefined
			});
			const currentIds = viewed.ids;
			const stayKnown = viewed.known;
			const items = collectUnread(list, pending, config, seenState.seen, litUnreadIds);
			/**
			 * Map session → its Workspace from the official snapshot: the ID anchors the
			 * folder dot to the keyed row, the title is what the row displays (not always
			 * the cwd basename, and not always equal to the stored title either).
			 *
			 * The same map answers a second question: which workspace row to expand when a
			 * list row is clicked. The pending list only carries the cwd basename, which
			 * cannot be turned back into a workspace id.
			 */
			const owners = React.useMemo(() => {
				const out = {};
				const workspaceItems = workspaces !== null && typeof workspaces === "object" && Array.isArray(workspaces.items) ? workspaces.items : [];
				for (const workspace of workspaceItems) {
					if (workspace === null || typeof workspace !== "object") continue;
					if (!Array.isArray(workspace.sessionIds)) continue;
					const id = typeof workspace.workspaceId === "string" ? workspace.workspaceId : "";
					const title = typeof workspace.title === "string" ? workspace.title : "";
					for (const sessionId of workspace.sessionIds) out[sessionId] = { id, title };
				}
				return out;
			}, [workspaces]);
			/**
			 * The pending rows plus the workspace they belong to. A session the official
			 * snapshot places nowhere keeps its row untouched: `revealSessionRow` then has
			 * nothing to expand, which is the honest answer, not a guess.
			 */
			const itemsWithOwner = React.useMemo(() => items.map((item) => {
				const owner = owners[item.id];
				return owner === undefined || owner.id === "" ? item : { ...item, workspaceId: owner.id };
			}), [items, owners]);
			const count = items.length;
			// Being in a session is what marks it read — and the clock that does it is
			// armed by ENTERING the session, never by a new ending.
			//
			// `clearDelaySec` still means "stay this long before the ending counts as
			// seen" (0 = the moment you enter). What is new in 0.11.1 is WHEN the clock
			// takes its snapshot: the moment the session joins the view. An ending that
			// lands while you are already sitting there is therefore none of this
			// clock's business — it stays unread until you leave and come back. The
			// previous version re-armed on every new ending and chased the newest one,
			// so a turn that finished while you watched was auto-read `clearDelaySec`
			// seconds later: the dot for the session in front of you was a flash
			// nobody could catch. See docs/adr/0006-entry-bounded-stay-clock.md.
			//
			// Leaving tears the clock down, which is what makes the stay "continuous".
			// A reload restarts it too, since the timers only live in this page.
			//
			// One clock per session the main view shows: with two retained sessions,
			// marking only the first left the session you were reading unread forever.
			const stayIds = currentIds.slice().sort();
			const staySignature = stayIds.join("|");
			const delayMs = config.clearDelaySec * 1000;
			const [, bumpStay] = React.useState(0);
			// The panel can move the marks without going through this component
			// ("mark all read"); re-render so the number, the row dots and the tab
			// badge all follow immediately.
			const [, bumpPoke] = React.useState(0);
			React.useEffect(() => subscribeUnreadPoke(() => bumpPoke((n) => n + 1)), []);
			// The effect below is keyed on the signature, but the snapshot it marks is
			// taken from the CURRENT list; a ref is how it sees that list.
			const stayLive = React.useRef({ list });
			stayLive.current = { list };
			/**
			 * Entered-at snapshot: `id → endAt` as it stood when that session joined
			 * the view. Deliberately NOT refreshed while the session stays — that is
			 * the rule ("an ending during your stay waits for the next entry"). Only a
			 * session that LEAVES the view is forgotten, so coming back to it takes a
			 * fresh snapshot; pausing (background tab, a global panel) keeps both the
			 * session and its snapshot.
			 */
			const stayArmed = React.useRef(new Map());
			React.useEffect(() => {
				const snapshot = stayLive.current.list !== null && typeof stayLive.current.list === "object" && stayLive.current.list.byId !== null && typeof stayLive.current.list.byId === "object" ? stayLive.current.list.byId : {};
				// ONLY A KNOWN ANSWER MAY DROP A SNAPSHOT. A frame in which the page could
				// not name any session (a panel unmounting the conversation while the
				// official binding is unavailable, a DOM gap, a build without either
				// signal) is not a leave: forgetting the snapshot there is what made the
				// clock re-enter the session behind the reader's back and acknowledge an
				// ending that arrived while they were sitting in front of it.
				if (stayKnown !== false) {
					const live = new Set(stayIds);
					for (const id of Array.from(stayArmed.current.keys())) {
						if (!live.has(id)) stayArmed.current.delete(id);
					}
				}
				for (const id of stayIds) {
					if (!stayArmed.current.has(id)) stayArmed.current.set(id, lastTurnEndAt(snapshot[id]));
				}
				// Paused: nothing may be acknowledged while nobody is watching, but the
				// snapshots above stay put — that is what makes resuming continue the
				// same entry instead of silently re-entering it.
				if (staySignature === "" || watching !== true) return undefined;
				const armed = stayIds.map((id) => ({ id, endAt: stayArmed.current.get(id) }));
				let cancelled = false;
				let timer = 0;
				// Single-shot on purpose: the snapshot is fixed, so there is nothing to
				// chase. A newer ending found here belongs to the NEXT entry.
				const attempt = () => {
					if (cancelled) return;
					let changed = false;
					for (const target of armed) {
						if (typeof target.endAt !== "number" || target.endAt <= 0) continue;
						if (noteSeen(target.id, target.endAt)) changed = true;
					}
					if (changed) { saveSeenState(); bumpStay((n) => n + 1); }
				};
				if (delayMs <= 0) attempt();
				else timer = window.setTimeout(attempt, delayMs);
				return () => {
					cancelled = true;
					if (timer !== 0) window.clearTimeout(timer);
				};
			}, [staySignature, delayMs, watching, stayKnown]);
			React.useEffect(() => { emitRealBadge(count, itemsWithOwner); }, [count, itemsWithOwner]);
			/**
			 * One session's displayed title, the way the sidebar shows it.
			 *
			 * Kept in step with `collectUnread`'s own `titleOf`: the yellow dot is
			 * matched against the row's rendered text, so it must use the same
			 * `displayTitle` fallback the red dot uses, or a session whose generated
			 * title has not landed yet would get no yellow dot at all.
			 */
			const titleOf = (id, entry) => (entry !== null && typeof entry === "object" && typeof entry.displayTitle === "string" && entry.displayTitle !== "" ? entry.displayTitle : id);
			// The running fact, straight off the same two official props and with no
			// host round trip at all. `runningSignature` is what the marks effect below
			// depends on, so a list re-render with the same set of running sessions
			// does not repaint the sidebar.
			const runningIds = running.enabled === false ? [] : runningSessionIds(list, status);
			const byId = list !== null && typeof list === "object" && list.byId !== null && typeof list.byId === "object" ? list.byId : {};
			// The rows behind the yellow count, for the list it opens (`titleOf` +
			// the same workspace naming the pending list uses, so the two modes of the
			// panel cannot disagree about what a session is called or where it lives).
			const runningRows = runningIds.map((id) => ({ id, title: titleOf(id, byId[id]), where: sessionWhereOf(byId[id]), workspaceId: owners[id] === undefined ? "" : owners[id].id }));
			// Two keys for two consumers: the sidebar repaints on the SET OF IDS, while
			// the panel must also refresh when a title or a workspace changes.
			const runningSignature = runningIds.join("|");
			const runningRowSignature = runningItemsSignature(runningRows);
			const runningCount = runningIds.length;
			React.useEffect(() => { emitRunningState(runningCount, runningRows); }, [runningRowSignature]);
			// The conversation header's yellow ring: the session on screen, and ONLY
			// its direct children from the official `subagentCatalog`. A separate
			// number for a separate decoration — it never joins `runningIds`, so no
			// sidebar, tab or OS-badge count can move because of it.
			const ringSessionId = viewed.ids.length === 1 ? viewed.ids[0] : "";
			const ringSuppressed = headerRingSuppressed(list, ringSessionId);
			const ringCount = ringSuppressed ? -1 : headerRingCount(list, status, ringSessionId);
			const ringSignature = ringSessionId + "\u0000" + ringCount;
			React.useEffect(() => {
				headerRingValue = ringCount;
				// Not loaded yet is not "zero running": ask the host once, then let the
				// next render answer. Without a session service this is a quiet no-op.
				if (!ringSuppressed && !headerRingCatalogLoaded(list, ringSessionId)) requestHeaderRingRefresh(ringSessionId);
				paintHeaderRing(runningConfig, headerRingValue);
			}, [ringSignature, running.enabled, running.headerRing]);
			// The session rows, for naming the running ones the way the sidebar shows
			// them (`displayTitle`, the same fallback the red dots use).
			React.useEffect(() => {
				emitSidebarMarks({
					workspaces: dotsFromItems(items, owners),
					sessions: items.map((item) => ({ id: item.id, title: item.title })),
					// The same rows, the other fact. Both arrays travel together, so the
					// paint pass can put the yellow dot in front of the red one
					// deterministically instead of depending on which feature changed last.
					runningSessions: runningRows.map((row) => ({ id: row.id, title: row.title })),
					runningWorkspaces: runningWorkspaceDots(runningIds, owners)
				});
			}, [items, owners, runningSignature, running]);
			return null;
		}

		/**
		 * The unread badge, injected into the sidebar's section header.
		 *
		 * There is no slot to register into: `sidebar.workspaces` is a SINGLE slot
		 * owned by ui-workspace that covers the whole browsing region *including* its
		 * header, and shadowing it would mean reimplementing the shipped browser. So
		 * the badge is injected into the DOM — the same technique, the same contract,
		 * and the same failure posture as the workspace-row dots: decorative, never
		 * throws, and after repeated failures it gives up on its own with one warning.
		 *
		 * Placement is measured, not inherited, because the shipped CSS forbids the
		 * obvious approach: `.sectionHeader` is 36px tall with `overflow:hidden`, the
		 * label inside it is a 20px line box that is ALSO `overflow:hidden`, so a badge
		 * parented to the label and raised clear of the glyph is clipped to a sliver by
		 * the label's own overflow. The badge is therefore a SIBLING of the label,
		 * absolutely positioned over the label's top-right corner from its measured
		 * rect, and clamped so it never leaves the header's 36px box.
		 *
		 * The count is shown for EVERY value including zero: a grey 0 keeps the
		 * position from jumping, and doubles as the only way back to the panel once
		 * the old sidebar-foot button is gone. The YELLOW count, by contrast, has no
		 * zero state and is a button: with nothing running there is no list to open.
		 */
		const HEAD_BADGE_ATTR = "data-icon-custom-unreadbadge";
		/** The running count's own node in the same header row — bottom-right of the label. */
		const HEAD_RUN_ATTR = "data-icon-custom-runbadge";
		const HEAD_BADGE_STYLE_ID = "dsh-icon-custom-unreadbadge-css";
		const HEAD_BADGE_WIRED = "data-icon-custom-unreadbadge-wired";
		/** The yellow pill's own wiring flag — it is a button now, exactly like the red one. */
		const HEAD_RUN_WIRED = "data-icon-custom-runbadge-wired";
		const HEAD_BADGE_MAX_FAILURES = 40;
		/** How many ancestors to walk up looking for the header row. */
		const HEAD_BADGE_MAX_STEPS = 6;
		/** Raise above the label's top edge; the header only leaves 8px of headroom. */
		const HEAD_BADGE_RAISE = 7;
		/** Drop below the label's bottom edge; mirrors the raise, and still fits the 36px header. */
		const HEAD_RUN_DROP = 8;
		/** Overhang past the label's right edge. */
		const HEAD_BADGE_OVERHANG = 9;
		let headerBadgeHost = null;
		let headerBadgeHostPosition = "";
		let headerBadgeObserved = null;
		let headerBadgeObserver = null;
		let headerBadgeFailures = 0;
		let headerBadgeGivenUp = false;
		/** Locale binder, installed by `apply()` so the injected node can label itself. */
		let badgeT = null;

		/**
		 * Rules for the injected badge. A stylesheet rather than inline styles because
		 * hover and the theme-following ring cannot be expressed inline. Colours come
		 * from the official tokens wherever one exists:
		 *   * the red is the one this plugin has always drawn;
		 *   * the "nothing pending" grey is the official idle-state colour, so it
		 *     follows light/dark without naming either;
		 *   * the ring is the sidebar's own fill — that is what makes a badge sitting
		 *     on top of a glyph read as a badge instead of a smudge.
		 * The hit area grows sideways and downward only: there are just 8px above the
		 * label, so anything reaching further up is clipped by the header's overflow.
		 */
		const HEAD_BADGE_CSS = [
			`[${HEAD_BADGE_ATTR}]{position:absolute;display:none;align-items:center;justify-content:center;min-width:15px;height:15px;padding:0 3.5px;box-sizing:border-box;border:0;border-radius:999px;background:#e5484d;color:#fff;font:inherit;font-size:9.5px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em;cursor:pointer;z-index:3;box-shadow:0 0 0 1.5px var(--dsw-specific-sidebar-fill,#fff)}`,
			`[${HEAD_BADGE_ATTR}]::after{content:"";position:absolute;inset:0 -5px -5px -5px;border-radius:999px}`,
			`[${HEAD_BADGE_ATTR}]:hover{filter:brightness(1.12)}`,
			`[${HEAD_BADGE_ATTR}][data-zero="1"]{background:var(--dsw-alias-state-idle-primary,#b6bcc4)}`,
			// The running count: same pill, other corner, and now a button like the red
			// one — it opens the list of the very sessions it counts. It has no zero
			// state (a yellow 0 would be pure noise), so with nothing running there is
			// nothing to open either: the pill is simply not there.
			`[${HEAD_RUN_ATTR}]{position:absolute;display:none;align-items:center;justify-content:center;min-width:15px;height:15px;padding:0 3.5px;box-sizing:border-box;border:0;border-radius:999px;background:${RUNNING_YELLOW};color:#1f1f1f;font:inherit;font-size:9.5px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em;cursor:pointer;z-index:3;box-shadow:0 0 0 1.5px var(--dsw-specific-sidebar-fill,#fff)}`,
			`[${HEAD_RUN_ATTR}]::after{content:"";position:absolute;inset:0 -5px -5px -5px;border-radius:999px}`,
			`[${HEAD_RUN_ATTR}]:hover{filter:brightness(1.12)}`
		].join("");

		/** Install the badge rules once per page. */
		function ensureHeaderBadgeStyle() {
			try {
				if (document.getElementById(HEAD_BADGE_STYLE_ID) !== null) return;
				const style = document.createElement("style");
				style.id = HEAD_BADGE_STYLE_ID;
				style.textContent = HEAD_BADGE_CSS;
				document.head.appendChild(style);
			} catch { /* styling is cosmetic; never let it reach a render tree */ }
		}

		/**
		 * The section-header row and the label inside it.
		 *
		 * The title TEXT is deliberately not matched: it flips between 工作区 and 会话
		 * with the group-by mode and is localized, so any string table would be both
		 * incomplete and wrong half the time. Structure is stable instead —
		 * `sidebar.workspaces` is a slot root (the official renderer stamps
		 * `data-slot` on those), the header row's first button is the search control,
		 * and the label is the row's first text-bearing child that owns no button.
		 * @param container - the browsing region root.
		 * @returns `{ row, label }`, or null when this build's DOM is not recognised.
		 */
		function sectionHeaderParts(container) {
			// Our own nodes are never a stand-in for shipped controls or for the label:
			// the red badge is a button and the yellow one carries text, so either could
			// be mistaken for the search control or the label if left in the running.
			let firstButton = null;
			for (const candidate of container.querySelectorAll("button")) {
				if (candidate.getAttribute(HEAD_BADGE_ATTR) !== null) continue;
				if (candidate.getAttribute(HEAD_RUN_ATTR) !== null) continue;
				firstButton = candidate;
				break;
			}
			if (firstButton === null) return null;
			let row = firstButton.parentElement;
			for (let step = 0; step < HEAD_BADGE_MAX_STEPS && row !== null && row !== container; step++) {
				for (const child of row.children) {
					if (child === firstButton || child.contains(firstButton)) continue;
					if (child.tagName === "BUTTON") continue;
					if (child.getAttribute(HEAD_BADGE_ATTR) !== null) continue;
					if (child.getAttribute(HEAD_RUN_ATTR) !== null) continue;
					if (child.querySelector("button") !== null) continue;
					if ((child.textContent ?? "").trim() !== "") return { row, label: child };
				}
				row = row.parentElement;
			}
			return null;
		}

		/** Warn once, then give up for this page — the row dots' exact posture. */
		function noteHeaderBadgeFailure(why) {
			headerBadgeFailures++;
			if (headerBadgeFailures === 1) {
				try { console.warn("dsh-icon-custom: 工作区标题红点定位失败,已降级(不影响其他功能):", why); } catch {}
				return;
			}
			if (headerBadgeFailures < HEAD_BADGE_MAX_FAILURES || headerBadgeGivenUp) return;
			headerBadgeGivenUp = true;
			try { console.warn("dsh-icon-custom: 工作区标题红点连续失败,本次会话内已自动关闭。"); } catch {}
			// Same posture as the row dots: give up by disappearing, never by freezing a
			// number that has stopped following the rule.
			clearHeaderBadge();
		}

		/**
		 * Reconcile the header badge with the current count and the label's position.
		 *
		 * Driven by the same mutation watchdog as the row dots, so it must be
		 * idempotent: it writes only what actually differs, or the observer that
		 * called it would re-arm on its own output. Geometry is read from the live
		 * rects, so the badge follows a sidebar resize, a locale change and the
		 * label's own collapse animation without any hardcoded offsets.
		 */
		function paintHeaderBadge() {
			if (headerBadgeGivenUp) return;
			const container = workspaceDotContainer();
			if (container === null) return; // start-up race, not a failure
			const parts = sectionHeaderParts(container);
			if (parts === null) { noteHeaderBadgeFailure("找不到分区标题"); return; }
			const row = parts.row;
			const label = parts.label;
			ensureHeaderBadgeStyle();
			if (headerBadgeHost !== row) {
				if (headerBadgeHost !== null) { try { headerBadgeHost.style.position = headerBadgeHostPosition; } catch {} }
				headerBadgeHost = row;
				headerBadgeHostPosition = row.style.position;
				try { if (window.getComputedStyle(row).position === "static") row.style.position = "relative"; } catch {}
			}
			let node = row.querySelector(`[${HEAD_BADGE_ATTR}]`);
			if (node === null) {
				node = document.createElement("button");
				node.type = "button";
				node.setAttribute(HEAD_BADGE_ATTR, "1");
				// Appended AFTER the shipped controls, so it can never be mistaken for
				// the header's first button.
				row.appendChild(node);
			}
			if (node.getAttribute(HEAD_BADGE_WIRED) !== "1") {
				node.setAttribute(HEAD_BADGE_WIRED, "1");
				node.addEventListener("click", (event) => {
					// The row belongs to the sidebar; keep the click to ourselves.
					event.preventDefault();
					event.stopPropagation();
					const rect = node.getBoundingClientRect();
					// `bottom` is what the panel drops below; see unreadPanelPlacement.
					togglePanel("unread", { left: rect.left, top: rect.top, bottom: rect.bottom });
				});
			}
			const count = effectiveCount();
			const text = badgeLabel(count);
			const zero = count > 0 ? "0" : "1";
			if (node.getAttribute("data-zero") !== zero) node.setAttribute("data-zero", zero);
			if (typeof badgeT === "function") {
				const spoken = count > 0 ? badgeT("unreadPanelCount").replace("{n}", String(count)) : badgeT("unreadPanelNone");
				if (node.getAttribute("aria-label") !== spoken) {
					node.setAttribute("aria-label", spoken);
					node.setAttribute("title", spoken);
				}
			}
			if (node.textContent !== text) node.textContent = text;
			// The running count, in the same row's other corner: top-right is the unread
			// number (where it has always been), bottom-right is this one. A button, not
			// a label — it opens the list of the sessions it is counting.
			let runNode = row.querySelector(`[${HEAD_RUN_ATTR}]`);
			if (runNode === null) {
				runNode = document.createElement("button");
				runNode.type = "button";
				runNode.setAttribute(HEAD_RUN_ATTR, "1");
				// Same as the red one: appended AFTER the shipped controls, so it can
				// never be mistaken for the header's first button.
				row.appendChild(runNode);
			}
			if (runNode.getAttribute(HEAD_RUN_WIRED) !== "1") {
				runNode.setAttribute(HEAD_RUN_WIRED, "1");
				runNode.addEventListener("click", (event) => {
					// The row belongs to the sidebar; keep the click to ourselves.
					event.preventDefault();
					event.stopPropagation();
					const rect = runNode.getBoundingClientRect();
					// The same anchor shape the red badge hands over; see
					// `unreadPanelPlacement` for what `bottom` is used for.
					togglePanel("running", { left: rect.left, top: rect.top, bottom: rect.bottom });
				});
			}
			const running = normalizeCount(runningTotal);
			const runText = badgeLabel(running);
			if (typeof badgeT === "function") {
				// Says what the number is AND that it opens: it is a control now, and a
				// bare "2 running" would leave a screen reader with no idea it is one.
				const spoken = badgeT("runningPanelTrigger").replace("{n}", String(running));
				if (runNode.getAttribute("aria-label") !== spoken) {
					runNode.setAttribute("aria-label", spoken);
					runNode.setAttribute("title", spoken);
				}
			}
			if (runNode.textContent !== runText) runNode.textContent = runText;
			// The label collapses to nothing while the search box is open; the badge
			// has no meaning then, and the label's own visibility cannot hide it
			// because it is a sibling.
			const rowRect = row.getBoundingClientRect();
			const labelRect = label.getBoundingClientRect();
			if (labelRect.width < 8) {
				if (node.style.display !== "none") node.style.display = "none";
				if (runNode.style.display !== "none") runNode.style.display = "none";
			} else {
				const width = typeof node.offsetWidth === "number" && node.offsetWidth > 0 ? node.offsetWidth : 15;
				const left = Math.round(labelRect.right - rowRect.left - width + HEAD_BADGE_OVERHANG);
				// Clamped: the header clips its overflow, and only ~8px sit above the label.
				const top = Math.max(0, Math.round(labelRect.top - rowRect.top - HEAD_BADGE_RAISE));
				if (node.style.left !== `${left}px`) node.style.left = `${left}px`;
				if (node.style.top !== `${top}px`) node.style.top = `${top}px`;
				if (node.style.display !== "flex") node.style.display = "flex";
				// No zero state for the running count: it simply is not there.
				if (running <= 0) {
					if (runNode.style.display !== "none") runNode.style.display = "none";
				} else {
					const runWidth = typeof runNode.offsetWidth === "number" && runNode.offsetWidth > 0 ? runNode.offsetWidth : 15;
					const runLeft = Math.round(labelRect.right - rowRect.left - runWidth + HEAD_BADGE_OVERHANG);
					const runTop = Math.round(labelRect.bottom - rowRect.top - HEAD_RUN_DROP);
					if (runNode.style.left !== `${runLeft}px`) runNode.style.left = `${runLeft}px`;
					if (runNode.style.top !== `${runTop}px`) runNode.style.top = `${runTop}px`;
					if (runNode.style.display !== "flex") runNode.style.display = "flex";
				}
			}
			// The label animates its own width; follow it instead of waiting for the
			// next mutation, which a CSS transition never produces.
			if (typeof window.ResizeObserver === "function") {
				if (headerBadgeObserver === null) headerBadgeObserver = new window.ResizeObserver(() => { paintHeaderBadge(); });
				if (headerBadgeObserved !== label) {
					try { headerBadgeObserver.disconnect(); headerBadgeObserver.observe(label); headerBadgeObserved = label; } catch {}
				}
			}
		}

		/** Take the badge back out and restore the row's own positioning. */
		function clearHeaderBadge() {
			try { document.querySelectorAll(`[${HEAD_BADGE_ATTR}],[${HEAD_RUN_ATTR}]`).forEach((node) => node.remove()); } catch {}
			if (headerBadgeObserver !== null) {
				try { headerBadgeObserver.disconnect(); } catch {}
				headerBadgeObserver = null;
				headerBadgeObserved = null;
			}
			if (headerBadgeHost !== null) {
				try { headerBadgeHost.style.position = headerBadgeHostPosition; } catch {}
			}
			headerBadgeHost = null;
			headerBadgeHostPosition = "";
		}
		/** Gap between the panel and whatever it is anchored to. */
		const UNREAD_PANEL_GAP = 6;
		/** Breathing room from the window edges. */
		const UNREAD_PANEL_MARGIN = 8;
		/** The panel's practical width (between its minWidth and maxWidth below). */
		const UNREAD_PANEL_WIDTH = 300;
		/** How tall the scrolling session list may get before it scrolls. */
		const UNREAD_PANEL_LIST_MAX = 320;

		/**
		 * Where the unread panel goes, in viewport coordinates.
		 *
		 * It opens DOWNWARD from the badge. The original math pinned the panel's
		 * BOTTOM edge just above the anchor — correct while the trigger sat in the
		 * sidebar footer, and wrong the moment that trigger moved to the section
		 * header: the same formula then parked the panel's bottom near the top of the
		 * window and grew the panel upward, off the top of the screen (the title and
		 * the first workspace heading were what got cut off). Anchoring on the
		 * anchor's `bottom` is what drops it below the badge instead.
		 *
		 * Horizontally it stays clear of the sidebar: the panel is a frame-wide
		 * overlay, and covering the sidebar — and the very badge that opened it — was
		 * the other half of the complaint.
		 * @param anchor - the badge's viewport rect (`{left, top, bottom}`), or null.
		 * @param sidebarRight - the browsing region's right edge, or null.
		 * @param viewportWidth - window width.
		 * @param viewportHeight - window height.
		 * @returns `{ left, top, listMaxHeight }` in viewport pixels.
		 */
		function unreadPanelPlacement(anchor, sidebarRight, viewportWidth, viewportHeight) {
			let left = UNREAD_PANEL_MARGIN;
			let top = UNREAD_PANEL_MARGIN;
			if (anchor !== null && typeof anchor === "object") {
				if (typeof anchor.left === "number") left = anchor.left;
				const below = typeof anchor.bottom === "number" ? anchor.bottom : anchor.top;
				if (typeof below === "number") top = below + UNREAD_PANEL_GAP;
			}
			if (typeof sidebarRight === "number" && sidebarRight > 0) left = Math.max(left, sidebarRight + UNREAD_PANEL_GAP);
			left = Math.max(UNREAD_PANEL_MARGIN, Math.min(left, viewportWidth - UNREAD_PANEL_WIDTH - UNREAD_PANEL_MARGIN));
			top = Math.max(UNREAD_PANEL_MARGIN, top);
			// Never taller than what is left below the panel's own top, so a long list
			// scrolls inside the panel instead of pushing it off the bottom edge.
			const listMaxHeight = Math.max(120, Math.min(UNREAD_PANEL_LIST_MAX, viewportHeight - top - 72));
			return { left: Math.round(left), top: Math.round(top), listMaxHeight: Math.round(listMaxHeight) };
		}

		/**
		 * The list behind those numbers, in the frame-wide overlay layer so it escapes
		 * the sidebar's clipping and scroll container. ONE panel with two modes: the
		 * red count opens "who needs you", the yellow count opens "who is running".
		 * Clicking a row opens that session — which is also what marks an unread one
		 * read. The running mode has no "mark all read": running is a live fact, not a
		 * queue, so there is nothing there to acknowledge.
		 */
		function HeaderPopup(props) {
			const [snapshot, setSnapshot] = React.useState(badgeSnapshot);
			const [mode, setMode] = React.useState(panelMode);
			// Ages are computed against the HOST's clock (the endings are host
			// timestamps); re-tick while open so "刚刚" does not stay stale.
			const [, tick] = React.useState(0);
			React.useEffect(() => subscribeBadge(setSnapshot), []);
			React.useEffect(() => subscribePanel(() => setMode(panelMode)), []);
			React.useEffect(() => {
				if (mode === null) return undefined;
				const interval = window.setInterval(() => tick((n) => n + 1), 30000);
				return () => window.clearInterval(interval);
			}, [mode]);
			React.useEffect(() => {
				if (mode === null) return undefined;
				const onKey = (event) => { if (event.key === "Escape") emitPanel(null); };
				const onDown = (event) => {
					const node = event.target;
					if (node !== null && typeof node.closest === "function" && node.closest('[data-icon-custom-panel="1"]') !== null) return;
					emitPanel(null);
				};
				window.addEventListener("keydown", onKey);
				document.addEventListener("mousedown", onDown, true);
				return () => {
					window.removeEventListener("keydown", onKey);
					document.removeEventListener("mousedown", onDown, true);
				};
			}, [mode]);
			if (mode === null) return null;
			const t = props.t;
			/** Which of the two lists this render is: same shell, different rows. */
			const running = mode === "running";
			const anchor = panelAnchor;
			// Measured, not assumed: the panel has to clear whatever width the sidebar
			// currently has (it is resizable and collapsible).
			let sidebarRight = null;
			try {
				const region = workspaceDotContainer();
				if (region !== null) sidebarRight = region.getBoundingClientRect().right;
			} catch { /* measurement is best effort; the margin fallback still applies */ }
			const place = unreadPanelPlacement(anchor, sidebarRight, window.innerWidth, window.innerHeight);
			const style = {
				position: "fixed", left: place.left + "px", top: place.top + "px", zIndex: 60, pointerEvents: "auto",
				minWidth: "240px", maxWidth: "340px", padding: "8px", borderRadius: "12px",
				border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-1)",
				boxShadow: "0 10px 30px rgba(0,0,0,.18)", color: "var(--dsw-alias-label-primary)", fontSize: "12px"
			};
			// The rows of whichever list is open. Both carry `{ id, title, where }`;
			// only the unread ones carry an ending to acknowledge.
			const items = running
				? (Array.isArray(snapshot.runningItems) ? snapshot.runningItems : [])
				: (Array.isArray(snapshot.items) ? snapshot.items : []);
			const ackTargets = running ? [] : unreadAckTargets(items);
			/**
			 * Acknowledge every turn-end row at once.
			 *
			 * "Waiting for you" rows cannot be acknowledged (they are not watermark
			 * based), so the panel stays open while any of them remain — closing it
			 * would hide the one thing that still needs the reader.
			 */
			const markAllRead = () => {
				let changed = false;
				for (const target of ackTargets) if (noteSeen(target.id, target.seenAt)) changed = true;
				if (!changed) return;
				saveSeenState();
				emitUnreadPoke();
				if (ackTargets.length === items.length) emitPanel(null);
			};
			return React.createElement("div", { "data-icon-custom-panel": "1", style },
				React.createElement("div", { style: { fontWeight: 600, padding: "2px 6px 8px" } }, t(running ? "runningPanelTitle" : "unreadPanelTitle")),
				items.length === 0
					? React.createElement("div", { style: { padding: "2px 6px 8px", opacity: 0.7 } }, t(running ? "runningPanelEmpty" : "unreadPanelEmpty"))
					: React.createElement("div", { style: { display: "flex", flexDirection: "column", maxHeight: place.listMaxHeight + "px", overflowY: "auto" } },
						groupUnreadByWorkspace(items).map((group) => React.createElement("div", { key: group.where === "" ? "\u0000none" : group.where },
							React.createElement("div", { style: { padding: "7px 8px 3px", fontSize: "11px", fontWeight: 600, opacity: 0.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
								group.where === "" ? t("unreadPanelOther") : group.where
							),
							group.items.map((item) => React.createElement("button", {
								key: item.id, type: "button",
								onClick: () => { emitPanel(null); props.onOpen(item); },
								style: { display: "block", width: "100%", textAlign: "left", padding: "6px 8px", border: "0", borderRadius: "8px", background: "transparent", color: "inherit", font: "inherit", cursor: "pointer" }
							},
								React.createElement("span", { style: { display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, item.title),
								React.createElement("span", { style: { display: "block", opacity: 0.6, fontSize: "11px" } }, running ? runningRowSubtitle(item, t) : unreadRowSubtitle(item, hostNow(), t))
							))
						))
					),
				ackTargets.length > 0 && React.createElement("div", { style: { marginTop: "6px", paddingTop: "6px", borderTop: "1px solid var(--dsw-alias-border-l2)" } },
					React.createElement("button", {
						type: "button",
						onClick: markAllRead,
						style: { display: "block", width: "100%", padding: "5px 8px", border: "0", borderRadius: "8px", background: "transparent", color: "inherit", font: "inherit", cursor: "pointer", opacity: 0.85 }
					}, t("unreadMarkAllRead"))
				)
			);
		}

		/**
		 * The two brand-mark pill sizes.
		 *
		 * A 24px mark cannot hold two full-size numbers, and drawing one big and one
		 * small reads as a rendering bug rather than a design. So when BOTH are shown
		 * they are drawn at one common edge — the largest that still fits them stacked
		 * — while a pill shown alone keeps the normal size. Pure, so the rule is
		 * testable without React.
		 * @param size - the mark's edge in px.
		 * @param scale - the badge-size multiplier from the setting.
		 * @param hasUnread - whether the unread pill is shown.
		 * @param hasRunning - whether the running pill is shown.
		 * @returns `{ unread, running }` pill edges in px.
		 */
		function brandPillEdges(size, scale, hasUnread, hasRunning) {
			const edge = Math.max(12, Math.round(size * 0.5 * scale));
			if (hasUnread !== true || hasRunning !== true) return { unread: edge, running: edge };
			// Half the mark each, minus the seam between them.
			const shared = Math.max(9, Math.floor((size - 2) / 2));
			return { unread: shared, running: shared };
		}

		/**
		 * Sidebar brand-mark occupant (registered on the official
		 * `sidebar.brand.mark` single seat). Shows the custom icon when the
		 * logo option is on; otherwise falls back to the platform favicon mark
		 * (/favicon.svg is the same official whale). The brand NAME text is not
		 * touched — this seat is only the mark.
		 */
		function BrandMark(props) {
			const [state, setState] = React.useState(null);
			const [badge, setBadge] = React.useState(badgeSnapshot);
			React.useEffect(() => {
				const unsubscribe = subscribeLogo(setState);
				// Pull the current state on mount too, so the mark is correct
				// even when the settings panel was never opened this session.
				props.rpc.call("/api", "iconCustom/getStatus", { args: {} })
					.then((resp) => { if (resp && resp.ok === true) syncStatus(resp.value); })
					.catch(() => {});
				return unsubscribe;
			}, [props.rpc]);
			React.useEffect(() => subscribeBadge(setBadge), []);
			const size = (props && props.size) || 24;
			const custom = state && state.enabled === true && state.rev;
			const style = { width: size, height: size, objectFit: "contain", display: "block" };
			const src = custom
				? (state.png === true ? `/icon-custom-192.png?v=${state.rev}` : `/icon-custom.svg?v=${state.rev}`)
				: "/favicon.svg";
			const img = React.createElement("img", {
				src,
				alt: "",
				style
			});
			// No mark at all: keep the exact original element (no wrapper, no layout risk).
			const runningCount = normalizeCount(badge.running);
			if (badge.count <= 0 && runningCount <= 0) return img;
			// Two independent facts, two corners: the unread count owns the top-right
			// (where it has always been), the running count takes the bottom-right.
			const edges = brandPillEdges(size, badgeScale(badge.size), badge.count > 0, runningCount > 0);
			const edge = edges.unread;
			const children = [img];
			if (badge.count > 0) {
				const label = `${badgeLabel(badge.count)} pending (test)`;
				children.push(React.createElement("span", {
					key: "unread",
					title: label,
					"aria-label": label,
					style: {
						position: "absolute",
						top: 0,
						right: 0,
						minWidth: edge,
						height: edge,
						padding: "0 2px",
						boxSizing: "border-box",
						borderRadius: 999,
						background: "#e5484d",
						color: "#fff",
						border: "1.5px solid var(--dsw-alias-bg-layer-1, #fff)",
						fontSize: Math.max(8, Math.round(edge * 0.62)),
						fontWeight: 700,
						lineHeight: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontVariantNumeric: "tabular-nums",
						pointerEvents: "none"
					}
				}, badgeLabel(badge.count)));
			}
			if (runningCount > 0) {
				const label = `${badgeLabel(runningCount)} running`;
				// Same edge as the unread pill whenever both are shown (see
				// brandPillEdges): a big red beside a small yellow reads as broken.
				const runEdge = edges.running;
				children.push(React.createElement("span", {
					key: "running",
					title: label,
					"aria-label": label,
					style: {
						position: "absolute",
						bottom: 0,
						right: 0,
						minWidth: runEdge,
						height: runEdge,
						padding: "0 2px",
						boxSizing: "border-box",
						borderRadius: 999,
						background: RUNNING_YELLOW,
						color: "#1f1f1f",
						border: "1.5px solid var(--dsw-alias-bg-layer-1, #fff)",
						fontSize: Math.max(7, Math.round(runEdge * 0.62)),
						fontWeight: 700,
						lineHeight: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontVariantNumeric: "tabular-nums",
						pointerEvents: "none"
					}
				}, badgeLabel(runningCount)));
			}
			return React.createElement("span", {
				style: { position: "relative", display: "inline-flex", width: size, height: size, flex: "none" }
			}, children);
		}

		//#region hint disclosure
		/**
		 * Every long hint used to be printed in full on the settings page, which made
		 * one screen a wall of grey small print. Now each one keeps a one-line
		 * summary on the page and moves the full text behind a "?" button.
		 *
		 * The bubble's material is borrowed, its behaviour is ours:
		 *  - the official `MenuSurface` primitive as the bubble container, when this
		 *    build exposes it to plugins;
		 *  - a self-drawn bubble carrying the same inline styling otherwise.
		 * Opening and closing (click the "?", click it again, click away, Escape) is
		 * the plugin's own code on BOTH paths, and placement stays in the pure
		 * `hintBubblePlacement` below — `MenuSurface` only paints the surface, it
		 * does not position or dismiss anything.
		 *
		 * Why not the official `Tooltip` (which is what this used to use): its
		 * `label` is `string | (() => string)`
		 * (`@deepseek-ai/dsh-client-ui-primitives/lib/types/Tooltip.d.ts:20`), so it
		 * can only print plain text and can never render the emphasised phrases the
		 * requirement asks for. `MenuSurface` takes arbitrary children
		 * (`ComponentPropsWithoutRef<'div'>`), so the same self-managed disclosure
		 * can render real React nodes — hence `**bold**` becomes a real `<strong>`.
		 * See docs/adr/0012-hint-bubble-menusurface.md.
		 *
		 * The client half is loaded through the ModuleLoader's `require` with no build
		 * step, so that package can be absent or not yet materialized — a `require`
		 * miss must degrade to the fallback, never to a blank section.
		 * Note: this package is resolved by the host at require time and is therefore
		 * deliberately left out of `dsh.client.inject` and `peerDependencies`
		 * (matching the official packages), so no injection gate can block mount.
		 */
		const HINT_BUBBLE_WIDTH = 320;
		const HINT_BUBBLE_MARGIN = 8;
		const HINT_BUBBLE_GAP = 6;
		const HINT_ROW_STYLE = { display: "flex", alignItems: "flex-start", gap: "6px", marginTop: "4px" };
		const HINT_SUMMARY_STYLE = { fontSize: 11, color: "var(--dsw-alias-label-tertiary)", lineHeight: "16px" };
		const HINT_BUTTON_STYLE = { flex: "none", width: "16px", height: "16px", padding: 0, borderRadius: "50%", border: "1px solid var(--dsw-alias-border-l2)", background: "transparent", color: "var(--dsw-alias-label-tertiary)", fontSize: 11, lineHeight: "14px", textAlign: "center", cursor: "pointer" };
		/** The emphasised run: a real `<strong>`, so `**` never reaches the screen. */
		const HINT_STRONG_STYLE = { fontWeight: 600, color: "var(--dsw-alias-label-primary)" };
		/** The fallback bubble carries its own material; the official surface paints its own. */
		const HINT_BUBBLE_STYLE = { position: "fixed", zIndex: 70, padding: "8px 10px", borderRadius: "10px", border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-1)", boxShadow: "0 10px 30px rgba(0,0,0,.18)", color: "var(--dsw-alias-label-primary)", fontSize: 12, lineHeight: "18px", whiteSpace: "pre-wrap", maxHeight: "40vh", overflowY: "auto" };
		/** Placement-only style for the official surface: no fill/border/radius of ours. */
		const HINT_BUBBLE_PLACEMENT_STYLE = { position: "fixed", zIndex: 70, padding: "8px 10px", color: "var(--dsw-alias-label-primary)", fontSize: 12, lineHeight: "18px", whiteSpace: "pre-wrap", maxHeight: "40vh", overflowY: "auto" };

		/**
		 * Resolve the official MenuSurface lazily: requiring it at factory time can
		 * run before the primitive is materialized, and a miss throws (the loader's
		 * module table has no fallback entry). Success is memoized; a miss is retried
		 * on the next render, so a plugin that boots before the primitive still picks
		 * it up instead of being stuck on the fallback forever.
		 * @returns the MenuSurface component, or null when this build does not expose it.
		 */
		let officialMenuSurface = null;
		function officialHintSurface() {
			if (officialMenuSurface !== null) return officialMenuSurface;
			try {
				const primitives = require("@deepseek-ai/dsh-client-ui-primitives");
				// "Present" is the whole judgement, not "is a function": the shipped
				// `MenuSurface` is a `forwardRef` object (`lib/index.js` builds it with
				// `forwardRef(...)`, and its type is `ForwardRefExoticComponent`), so
				// `typeof` is "object". The old `typeof === "function"` test therefore
				// never matched in production and left the official branch dead. A build
				// that exposes it as a plain function still works.
				const candidate = primitives !== null && typeof primitives === "object" ? primitives.MenuSurface : undefined;
				if (candidate !== null && candidate !== undefined
					&& (typeof candidate === "function" || typeof candidate === "object")) {
					officialMenuSurface = candidate;
				}
			} catch (error) {
				officialMenuSurface = null;
			}
			return officialMenuSurface;
		}

		/**
		 * Turn one hint string into React children, converting every BALANCED
		 * `**pair**` into a real `<strong>`.
		 *
		 * Only a closed pair is markup: an unpaired `**` (or a lone marker) is kept
		 * verbatim, because dropping the characters would silently lose text — worse
		 * than showing the marker. The marker itself never reaches the screen for a
		 * balanced pair: what lands in the DOM is `<strong>pair</strong>`.
		 * @param text - the locale string, possibly carrying `**` runs.
		 * @returns an array of strings and `<strong>` elements, never empty.
		 */
		function hintTextNodes(text) {
			const source = typeof text === "string" ? text : "";
			const nodes = [];
			const bold = /\*\*([\s\S]+?)\*\*/g;
			let last = 0;
			let match;
			while ((match = bold.exec(source)) !== null) {
				if (match.index > last) nodes.push(source.slice(last, match.index));
				nodes.push(React.createElement("strong", { key: "hint-bold-" + nodes.length, style: HINT_STRONG_STYLE }, match[1]));
				last = match.index + match[0].length;
			}
			if (last < source.length) nodes.push(source.slice(last));
			if (nodes.length === 0) nodes.push(source);
			return nodes;
		}

		/**
		 * Where the fallback bubble goes: just below the button's anchor rect, clamped
		 * into the viewport. Pure, so the placement is testable without a DOM.
		 * @param anchor - the button's client rect, or null.
		 * @param viewportWidth - window width.
		 * @param viewportHeight - window height.
		 * @returns `{ left, top, width }` in viewport pixels.
		 */
		function hintBubblePlacement(anchor, viewportWidth, viewportHeight) {
			const width = Math.min(HINT_BUBBLE_WIDTH, Math.max(120, viewportWidth - HINT_BUBBLE_MARGIN * 2));
			const anchorLeft = anchor !== null && typeof anchor === "object" && typeof anchor.left === "number" ? anchor.left : HINT_BUBBLE_MARGIN;
			const anchorBottom = anchor !== null && typeof anchor === "object" && typeof anchor.bottom === "number" ? anchor.bottom : HINT_BUBBLE_MARGIN;
			const left = Math.max(HINT_BUBBLE_MARGIN, Math.min(anchorLeft, viewportWidth - width - HINT_BUBBLE_MARGIN));
			const top = Math.max(HINT_BUBBLE_MARGIN, Math.min(anchorBottom + HINT_BUBBLE_GAP, viewportHeight - HINT_BUBBLE_MARGIN));
			return { left: Math.round(left), top: Math.round(top), width: Math.round(width) };
		}

		/**
		 * The bubble node for one disclosure: the official `MenuSurface` material when
		 * `surface` is given, the self-drawn inline bubble otherwise. Pure, so both
		 * paths are exercised without a DOM; closed renders nothing.
		 *
		 * `MenuSurface` is handed placement only (position/left/top/width/scroll) and
		 * keeps its own fill, radius, border and blur; the fallback div carries the
		 * whole look itself. `compact` asks the official surface for the smaller
		 * radius a small bubble wants.
		 * @param open - whether the bubble is showing.
		 * @param surface - the official MenuSurface component, or null for the fallback.
		 * @param label - accessible name for the dialog.
		 * @param place - `{ left, top, width }` from `hintBubblePlacement`.
		 * @param text - the full hint text, `**` markers included.
		 * @returns the bubble element, or null while closed.
		 */
		function hintBubbleNode(open, surface, label, place, text) {
			if (!open) return null;
			const placement = { left: place.left + "px", top: place.top + "px", width: place.width + "px" };
			const content = hintTextNodes(text);
			if (surface === null) {
				return React.createElement("div", {
					"data-icon-custom-hint": "1",
					role: "dialog",
					"aria-label": label,
					style: { ...HINT_BUBBLE_STYLE, ...placement }
				}, ...content);
			}
			return React.createElement(surface, {
				"data-icon-custom-hint": "1",
				role: "dialog",
				"aria-label": label,
				compact: true,
				style: { ...HINT_BUBBLE_PLACEMENT_STYLE, ...placement }
			}, ...content);
		}

		/**
		 * The button plus its bubble, with the open/close state managed here — the same
		 * code on both paths, because the official surface only supplies material.
		 * Opened by the "?", closed by the same button, an outside pointerdown, or
		 * Escape. The button is the only way to open the text (hovering does not).
		 */
		function HintDisclosureBubble(props) {
			const [rect, setRect] = React.useState(null);
			const open = rect !== null;
			React.useEffect(() => {
				if (!open) return undefined;
				const onKey = (event) => { if (event.key === "Escape") setRect(null); };
				const onDown = (event) => {
					const node = event.target;
					if (node === null || typeof node.closest !== "function") return;
					// Both surfaces carry this marker (MenuSurface forwards div props), so
					// a click inside the bubble never counts as "clicked away".
					if (node.closest('[data-icon-custom-hint="1"]') !== null) return;
					if (node.closest('[data-icon-custom-hint-button="1"]') !== null) return;
					setRect(null);
				};
				window.addEventListener("keydown", onKey);
				document.addEventListener("mousedown", onDown, true);
				return () => {
					window.removeEventListener("keydown", onKey);
					document.removeEventListener("mousedown", onDown, true);
				};
			}, [open]);
			const toggle = (event) => {
				if (open) {
					setRect(null);
					return;
				}
				const node = event.currentTarget;
				setRect(node !== null && typeof node.getBoundingClientRect === "function" ? node.getBoundingClientRect() : null);
			};
			const place = hintBubblePlacement(rect, window.innerWidth, window.innerHeight);
			const button = React.createElement("button", {
				type: "button",
				"aria-label": props.label,
				title: props.label,
				"data-icon-custom-hint-button": "1",
				onClick: toggle,
				style: HINT_BUTTON_STYLE
			}, "?");
			return React.createElement(React.Fragment, null,
				button,
				hintBubbleNode(open, props.surface, props.label, place, props.text)
			);
		}

		/**
		 * One hint row: the short summary (plain text, never folded) stays on the page,
		 * the full text sits behind the "?" button. The official primitive is resolved
		 * once per row and passed down; a missing package simply means `surface === null`.
		 */
		function HintDisclosure(props) {
			return React.createElement("div", { style: HINT_ROW_STYLE },
				React.createElement("span", { style: HINT_SUMMARY_STYLE }, props.summary),
				React.createElement(HintDisclosureBubble, {
					text: props.text,
					label: props.label,
					surface: officialHintSurface()
				})
			);
		}
		//#endregion

		function FaviconSection(props) {
			const t = props.t;
			const rpc = props.rpc;
			const [status, setStatus] = React.useState(null);
			const [pwaEnabled, setPwaEnabled] = React.useState(false);
			const [logoEnabled, setLogoEnabled] = React.useState(false);
			const [busy, setBusy] = React.useState(false);
			const [error, setError] = React.useState("");
			const [notice, setNotice] = React.useState("");
			const [badgeInput, setBadgeInput] = React.useState(() => (manualCount > 0 ? String(manualCount) : ""));
			const [badgeSizeValue, setBadgeSizeValue] = React.useState(badgeSize);
			const [badgeSourceValue, setBadgeSourceValue] = React.useState(badgeSource);
			const [unread, setUnread] = React.useState(unreadConfig);
			React.useEffect(() => subscribeUnreadConfig(setUnread), []);
			// Its own switch and its own endpoint pair: the running marks must be
			// switchable without touching the unread rule (see lib/running.js).
			const [running, setRunning] = React.useState(runningConfig);
			React.useEffect(() => subscribeRunningConfig(setRunning), []);
			// Sampled when the section mounts, which is the moment the user is
			// looking at it. It reports local facts only (see badgeCapabilityProbe).
			const [appBadgeProbe] = React.useState(() => appBadgeEnv());
			// Live, unlike the capability probe above: the notifications permission
			// can move outside this page (System Settings, another tab's prompt), and
			// on WebKit the badge follows it.
			const [notificationProbe, setNotificationProbe] = React.useState(() => notificationPermissionEnv());
			const [permissionBusy, setPermissionBusy] = React.useState(false);
			// A permission granted while the page is open is the WebKit precondition
			// the badge was missing: every earlier call was dropped while there was
			// no permission to draw it, so re-assert the number the page already shows.
			const onPermissionChanged = React.useCallback((next) => {
				setNotificationProbe(next);
				if (next.state === "granted") reconcileAppBadge(true);
			}, []);
			React.useEffect(() => subscribeNotificationPermission(onPermissionChanged), [onPermissionChanged]);
			// Called straight from the click: the prompt needs a user gesture, so it
			// must never be moved into an effect.
			const onRequestPermission = React.useCallback(() => {
				setPermissionBusy(true);
				requestNotificationPermission().then((next) => {
					setPermissionBusy(false);
					onPermissionChanged(next);
				});
			}, [onPermissionChanged]);
			// Draft text for the delay box: typing must not save on every keystroke,
			// and the box has to show the CLAMPED value once the save lands (type
			// 99999 and it settles on the 600 cap instead of lying about it).
			const [clearDelayDraft, setClearDelayDraft] = React.useState(String(unreadConfig.clearDelaySec));
			React.useEffect(() => { setClearDelayDraft(String(unread.clearDelaySec)); }, [unread.clearDelaySec]);
			const inputRef = React.useRef(null);

			const load = React.useCallback(async () => {
				try {
					const resp = await rpc.call("/api", "iconCustom/getStatus", { args: {} });
					if (resp && resp.ok === true) {
						setStatus(resp.value);
						setPwaEnabled(resp.value.pwa === true);
						setLogoEnabled(resp.value.logo === true);
						syncStatus(resp.value);
					} else setError(reason(resp, t("fail")));
				} catch (e) {
					setError(String((e && e.message) || e || t("fail")));
				}
			}, [rpc, t]);

			React.useEffect(() => {
				load();
			}, [load]);

			// Update the live page icon immediately (no reload) so the change is
			// visible in this very tab; other tabs pick it up on their next render.
			const applyLive = React.useCallback((s) => {
				if (!s || s.active !== true) return;
				const href = s.png === true ? `/icon-custom-192.png?v=${s.rev}` : `/icon-custom.svg?v=${s.rev}`;
				const type = s.png === true ? "image/png" : (s.mime || "image/svg+xml");
				setIconEverywhere(href, type);
				// The base icon just changed: rebuild the composite from it.
				refreshFaviconBase();
			}, []);

			// When cleared, put the shipped dark/light pair back. Restoring the
			// authored hrefs (rather than forcing one href on every link) keeps the
			// platform's scheme-aware icons working after a reset.
			const applyDefault = React.useCallback(() => {
				restoreShippedIcons();
				refreshFaviconBase();
			}, []);

			const pick = React.useCallback(() => inputRef.current && inputRef.current.click(), []);

			// Test-only: type a number to push it into the badge bridge. Empty or 0
			// clears the badge. Not persisted — a reload starts from 0 again.
			const onBadgeInput = React.useCallback((event) => {
				const raw = String(event.target.value || "").replace(/[^0-9]/g, "");
				setBadgeInput(raw);
				emitBadge(raw === "" ? 0 : Math.min(999, parseInt(raw, 10) || 0));
			}, []);
			const onBadgeSize = React.useCallback((value) => {
				setBadgeSizeValue(value);
				emitBadgeSize(value);
			}, []);
			// "real" = DSH's pending-interaction count; "manual" = the input below.
			const onBadgeSource = React.useCallback((value) => {
				setBadgeSourceValue(value);
				emitBadgeSource(value);
			}, []);
			// One save path for the whole unread rule: the patch is merged onto the
			// current config, so every field is carried over by construction. Letting
			// each control build its own request is how a new field gets silently
			// dropped by whichever caller forgot it.
			const saveUnreadRule = React.useCallback((patch) => {
				const next = normalizeUnreadConfig({ ...unreadConfig, ...patch });
				emitUnreadConfig(next);
				// Every field is sent explicitly, and the host replaces its copy with what
				// arrives — so a field missing HERE is a field that silently reverts to its
				// default on the next page load, however well the local toggle worked.
				rpc.call("/api", "iconCustom/setUnreadRule", {
					args: { request: { reasons: next.reasons, pending: next.pending, workspaceDot: next.workspaceDot, appBadge: next.appBadge, clearDelaySec: next.clearDelaySec, revealOnOpen: next.revealOnOpen, unreadIncludeSubagents: next.unreadIncludeSubagents } }
				}).catch(() => {});
			}, [rpc]);
			// Toggle one unread reason. Applies locally at once; the host keeps the
			// durable copy so the rule survives a restart and other browsers.
			const onUnreadToggle = React.useCallback((key, checked) => {
				if (key === "pending") { saveUnreadRule({ pending: checked }); return; }
				const reasons = Object.assign({}, unreadConfig.reasons);
				reasons[key] = checked;
				saveUnreadRule({ reasons });
			}, [saveUnreadRule]);
			// The fuse for the one fragile piece (see the workspace-dots region).
			const onWorkspaceDotToggle = React.useCallback((checked) => {
				saveUnreadRule({ workspaceDot: checked });
			}, [saveUnreadRule]);
			// The second fragile piece's own fuse (see the reveal region): locating a
			// clicked session drives the shipped sidebar rows.
			const onRevealToggle = React.useCallback((checked) => {
				saveUnreadRule({ revealOnOpen: checked });
			}, [saveUnreadRule]);
			// Whether a background sub-agent settling (which makes its parent run one
			// more turn) is worth telling the person about. Same one save path, so the
			// field cannot be dropped here and silently revert to ON after a reload.
			const onIncludeSubagentsToggle = React.useCallback((checked) => {
				saveUnreadRule({ unreadIncludeSubagents: checked });
			}, [saveUnreadRule]);
			// The system-icon projection of the same number. Saved through the same
			// one save path, so this field can never be dropped by a caller.
			const onAppBadgeToggle = React.useCallback((checked) => {
				saveUnreadRule({ appBadge: checked });
			}, [saveUnreadRule]);
			// Same "one save path, merged onto the current config" discipline as the
			// unread rule, on its own endpoint: enabling or disabling the yellow marks
			// applies locally at once and is persisted for the next page load.
			const saveRunningRule = React.useCallback((patch) => {
				const next = normalizeRunningConfig({ ...runningConfig, ...patch });
				emitRunningConfig(next);
				// Both switches travel together, always: the host record is one object, and
				// a caller that remembered only one field would otherwise silently reset
				// the other one on the next load.
				rpc.call("/api", "iconCustom/setRunningRule", {
					args: { request: { enabled: next.enabled, includeSubagents: next.includeSubagents, headerRing: next.headerRing } }
				}).catch(() => {});
			}, [rpc]);
			const onRunningMarkToggle = React.useCallback((checked) => {
				saveRunningRule({ enabled: checked });
			}, [saveRunningRule]);
			const onRunningIncludeSubagentsToggle = React.useCallback((checked) => {
				saveRunningRule({ includeSubagents: checked });
			}, [saveRunningRule]);
			// Third switch of the same feature: the yellow ring on the conversation
			// header's sub-agent count. Independent by construction — nothing on the
			// sidebar, the tab icon or the OS badge reads it.
			const onHeaderRingToggle = React.useCallback((checked) => {
				saveRunningRule({ headerRing: checked });
			}, [saveRunningRule]);
			// Seconds you must stay in a session before it counts as read; 0 = as soon
			// as you enter. Clamped by the shared normalizer, so a stray keystroke can
			// never persist an absurd delay.
			const onClearDelayChange = React.useCallback((value) => {
				saveUnreadRule({ clearDelaySec: normalizeClearDelay(value) });
			}, [saveUnreadRule]);
			/** One unread checkbox; `key === "pending"` is the "someone is waiting" row. */
			const renderReasonCheckbox = (key, labelKey) => React.createElement("label", {
				key,
				style: { display: "inline-flex", alignItems: "center", gap: "6px", marginRight: "14px", marginTop: "6px", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: "pointer" }
			},
				React.createElement("input", {
					type: "checkbox",
					checked: key === "pending" ? unread.pending === true : unread.reasons[key] === true,
					onChange: (event) => onUnreadToggle(key, event.target.checked === true)
				}),
				React.createElement("span", null, t(labelKey))
			);

			const onFileChange = React.useCallback(async (event) => {
				const file = event.target.files && event.target.files[0];
				event.target.value = "";
				if (!file) return;
				setError("");
				setNotice("");
				if (file.size > 10 * 1024 * 1024) {
					setError(t("uploadHint"));
					return;
				}
				const reader = new FileReader();
				reader.onload = async () => {
					let data = typeof reader.result === "string" ? reader.result : null;
					if (!data) { setError(t("fail")); return; }
					// Rasterize SVG to PNG in the browser so the host always has
					// a rasterizable baseline and iOS/apple-touch-icon works.
					// ICO is left as-is; the host extracts its embedded PNG.
					let mime = file.type || "image/svg+xml";
					if (mime === "image/svg+xml" || /\.svg$/i.test(file.name)) {
						setBusy(true);
						try {
							data = await svgToPng(file);
							mime = "image/png";
						} catch {
							setBusy(false);
							setError(t("svgFail"));
							return;
						}
					}
					setBusy(true);
					try {
						const resp = await rpc.call("/api", "iconCustom/setIcon", {
							args: { request: { mime, name: file.name, pwa: pwaEnabled, logo: logoEnabled, data } }
						});
						if (resp && resp.ok === true) {
							setStatus(resp.value);
							setPwaEnabled(resp.value.pwa === true);
							setLogoEnabled(resp.value.logo === true);
							setNotice(t("successUpload"));
							applyLive(resp.value);
							syncStatus(resp.value);
						} else {
							setError(reason(resp, t("fail")));
						}
					} catch (e) {
						setError(String((e && e.message) || e || t("fail")));
					} finally {
						setBusy(false);
					}
				};
				reader.onerror = () => setError(t("fail"));
				reader.readAsDataURL(file);
			}, [rpc, t, pwaEnabled, logoEnabled, applyLive]);

			const onReset = React.useCallback(async () => {
				setError("");
				setNotice("");
				setBusy(true);
				try {
					const resp = await rpc.call("/api", "iconCustom/resetIcon", { args: {} });
					if (resp && resp.ok === true) {
						setStatus(resp.value);
						setPwaEnabled(false);
						setLogoEnabled(false);
						setNotice(t("successReset"));
						applyDefault();
						syncStatus(resp.value);
					} else {
						setError(reason(resp, t("fail")));
					}
				} catch (e) {
					setError(String((e && e.message) || e || t("fail")));
				} finally {
					setBusy(false);
				}
			}, [rpc, t, applyDefault]);

			const onTogglePwa = React.useCallback(async (event) => {
				const enabled = event.target.checked === true;
				setError("");
				setNotice("");
				setBusy(true);
				try {
					const resp = await rpc.call("/api", "iconCustom/setPwa", {
						args: { request: { enabled } }
					});
					if (resp && resp.ok === true) {
						setStatus(resp.value);
						setPwaEnabled(resp.value.pwa === true);
						setNotice(t("successPwa"));
						applyLive(resp.value);
					} else {
						setPwaEnabled(!enabled);
						setError(reason(resp, t("fail")));
					}
				} catch (e) {
					setPwaEnabled(!enabled);
					setError(String((e && e.message) || e || t("fail")));
				} finally {
					setBusy(false);
				}
			}, [rpc, t, applyLive]);

			const onToggleLogo = React.useCallback(async (event) => {
				const enabled = event.target.checked === true;
				setError("");
				setNotice("");
				setBusy(true);
				try {
					const resp = await rpc.call("/api", "iconCustom/setLogo", {
						args: { request: { enabled } }
					});
					if (resp && resp.ok === true) {
						setStatus(resp.value);
						setLogoEnabled(resp.value.logo === true);
						setNotice(t("successLogo"));
						syncStatus(resp.value);
					} else {
						setLogoEnabled(!enabled);
						setError(reason(resp, t("fail")));
					}
				} catch (e) {
					setLogoEnabled(!enabled);
					setError(String((e && e.message) || e || t("fail")));
				} finally {
					setBusy(false);
				}
			}, [rpc, t]);

			const active = status && status.active === true;
			const previewSrc = active ? `/icon-custom.svg?v=${status.rev}` : "/favicon.svg";

			const style = {
				row: { display: "flex", alignItems: "center", gap: "16px", padding: "12px 0" },
				meta: { flex: "1 1 auto", minWidth: "0" },
				label: { fontSize: 12, fontWeight: 600, color: "var(--dsw-alias-label-primary)", marginBottom: "4px" },
				desc: { fontSize: 12, color: "var(--dsw-alias-label-secondary)", lineHeight: "18px" },
				preview: { width: 48, height: 48, borderRadius: 10, background: "var(--dsw-alias-bg-layer-3)", border: "1px solid var(--dsw-alias-border-l2)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", overflow: "hidden" },
				img: { width: 32, height: 32, objectFit: "contain" },
				btn: { border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "var(--dsw-alias-label-primary)", background: "var(--dsw-alias-bg-layer-2)", cursor: "pointer" },
				btnPrimary: { border: "1px solid var(--dsw-alias-border-l2)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#fff", background: "var(--dsw-alias-fill-primary, #2a7de1)", cursor: "pointer" },
				btnDisabled: { opacity: 0.5, cursor: "default" },
				error: { fontSize: 12, color: "var(--dsw-alias-danger, #e5484d)", marginTop: "8px" },
				notice: { fontSize: 12, color: "var(--dsw-alias-success, #30a46c)", marginTop: "8px" },
				hint: { fontSize: 11, color: "var(--dsw-alias-label-tertiary)", marginTop: "4px", lineHeight: "16px" }
			};

			// One disclosure row per long hint: the summary is on the page, the full
			// text (and nothing else) sits behind the "?" button.
			const hintLine = (hintKey) => React.createElement(HintDisclosure, {
				key: hintKey,
				summary: t(hintKey + "Summary"),
				text: t(hintKey),
				label: t("hintMoreLabel")
			});

			return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "4px" } },
				React.createElement("div", { style: style.row },
					React.createElement("div", { style: style.preview },
						React.createElement("img", { src: previewSrc, style: style.img, alt: t("current") })
					),
					React.createElement("div", { style: style.meta },
						React.createElement("div", { style: style.label }, t("current")),
						React.createElement("div", { style: style.desc }, active
							? (status.name ? `${status.name} · ${bytesLabel(status.size)} · ${fmtTime(status.savedAt)}` : status.mime)
							: t("none"))
					)
				),
				React.createElement("div", { style: { display: "flex", gap: "8px", alignItems: "center" } },
					React.createElement("button", { type: "button", style: { ...style.btnPrimary, ...(busy ? style.btnDisabled : null) }, disabled: busy, onClick: pick },
						React.createElement("span", null, busy ? t("replacing") : (active ? t("replace") : t("upload")))
					),
					React.createElement("button", { type: "button", style: { ...style.btn, ...(busy ? style.btnDisabled : null) }, disabled: busy || !active, onClick: onReset },
						React.createElement("span", null, busy ? t("resetting") : t("reset"))
					),
					React.createElement("input", { ref: inputRef, type: "file", accept: ".svg,.png,.ico,.cur,image/svg+xml,image/png,image/x-icon", style: { display: "none" }, onChange: onFileChange })
				),
				React.createElement("label", { style: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 0 0", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: busy ? "default" : "pointer" } },
					React.createElement("input", { type: "checkbox", checked: pwaEnabled, disabled: busy || !active, onChange: onTogglePwa, style: { cursor: busy ? "default" : "pointer" } }),
					React.createElement("span", null, t("pwa"))
				),
				hintLine("pwaHint"),
				React.createElement("label", { style: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 0 0", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: busy ? "default" : "pointer" } },
					React.createElement("input", { type: "checkbox", checked: logoEnabled, disabled: busy || !active, onChange: onToggleLogo, style: { cursor: busy ? "default" : "pointer" } }),
					React.createElement("span", null, t("logo"))
				),
				hintLine("logoHint"),
				hintLine("uploadHint"),
				React.createElement("div", { style: style.hint }, t("resetHint")),
				React.createElement("div", { style: { borderTop: "1px solid var(--dsw-alias-border-l2)", marginTop: "12px", paddingTop: "12px" } },
					React.createElement("div", { style: style.label }, t("badgeTest")),
					React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" } },
						React.createElement("span", { style: style.desc }, t("badgeSourceLabel")),
						["real", "manual"].map((key) => React.createElement("button", {
							key,
							type: "button",
							onClick: () => onBadgeSource(key),
							"aria-pressed": badgeSourceValue === key,
							style: { ...(badgeSourceValue === key ? style.btnPrimary : style.btn), padding: "4px 10px" }
						}, t(key === "real" ? "badgeSourceReal" : "badgeSourceManual")))
					),
					React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" } },
						React.createElement("input", {
							type: "number",
							min: 0,
							max: 999,
							value: badgeInput,
							onChange: onBadgeInput,
							disabled: badgeSourceValue !== "manual",
							"aria-label": t("badgeTest"),
							style: { width: 88, padding: "5px 8px", fontSize: 12, borderRadius: 8, border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-2)", color: "var(--dsw-alias-label-primary)", opacity: badgeSourceValue === "manual" ? 1 : 0.45, cursor: badgeSourceValue === "manual" ? "text" : "not-allowed" }
						}),
						React.createElement("span", { style: style.desc }, t("badgeTestUnit"))
					),
					React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" } },
						React.createElement("span", { style: style.desc }, t("badgeSizeLabel")),
						["sm", "md", "lg"].map((key) => React.createElement("button", {
							key,
							type: "button",
							onClick: () => onBadgeSize(key),
							"aria-pressed": badgeSizeValue === key,
							style: { ...(badgeSizeValue === key ? style.btnPrimary : style.btn), padding: "4px 10px" }
						}, t(key === "sm" ? "badgeSizeSmall" : key === "md" ? "badgeSizeMedium" : "badgeSizeLarge")))
					),
					hintLine("badgeSizeHint"),
					React.createElement("div", { style: { marginTop: "12px" } },
						React.createElement("div", { style: style.desc }, t("unreadReasonsLabel")),
						React.createElement("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center" } },
							["completed", "error", "blocked", "max-tokens", "interrupted", "aborted:user", "aborted:other"].map((key) => renderReasonCheckbox(key, REASON_LABEL_KEYS[key])),
							renderReasonCheckbox("pending", "reasonPending")
						)
					),
					React.createElement("div", { style: { marginTop: "10px" } },
						React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: "pointer" } },
							React.createElement("input", {
								type: "checkbox",
								checked: unread.unreadIncludeSubagents !== false,
								onChange: (event) => onIncludeSubagentsToggle(event.target.checked === true),
								"aria-label": t("unreadIncludeSubagentsLabel")
							}),
							React.createElement("span", null, t("unreadIncludeSubagentsLabel"))
						),
						hintLine("unreadIncludeSubagentsHint")
					),
					React.createElement("div", { style: { marginTop: "12px" } },
						React.createElement("div", { style: style.desc }, t("clearDelayLabel")),
						React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: 12, color: "var(--dsw-alias-label-primary)" } },
							React.createElement("input", {
								type: "number", min: 0, max: UNREAD_CLEAR_DELAY_MAX_SEC, step: 1, inputMode: "numeric",
								"aria-label": t("clearDelayLabel"),
								value: clearDelayDraft,
								onChange: (event) => setClearDelayDraft(event.target.value),
								onBlur: () => onClearDelayChange(clearDelayDraft),
								onKeyDown: (event) => { if (event.key === "Enter") onClearDelayChange(clearDelayDraft); },
								style: { width: "76px", padding: "3px 6px", border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "6px", background: "transparent", color: "inherit", font: "inherit", fontSize: 12 }
							}),
							React.createElement("span", null, t("clearDelayUnit"))
						),
						hintLine("clearDelayHint")
					),
					React.createElement("div", { style: { marginTop: "10px" } },
						React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: "pointer" } },
							React.createElement("input", {
								type: "checkbox",
								checked: unread.workspaceDot !== false,
								onChange: (event) => onWorkspaceDotToggle(event.target.checked === true)
							}),
							React.createElement("span", null, t("workspaceDotLabel"))
						),
						hintLine("workspaceDotHint")
					),
					React.createElement("div", { style: { marginTop: "10px" } },
						React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: "pointer" } },
							React.createElement("input", {
								type: "checkbox",
								checked: unread.revealOnOpen !== false,
								onChange: (event) => onRevealToggle(event.target.checked === true)
							}),
							React.createElement("span", null, t("revealLabel"))
						),
						hintLine("revealHint")
					),
					React.createElement("div", { style: { marginTop: "10px" } },
						React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: "pointer" } },
							React.createElement("input", {
								type: "checkbox",
								checked: unread.appBadge !== false,
								onChange: (event) => onAppBadgeToggle(event.target.checked === true)
							}),
							React.createElement("span", null, t("appBadgeLabel"))
						),
						hintLine("appBadgeHint"),
						// What THIS device is — never a claim about the platform.
						React.createElement("div", { style: style.hint }, t(appBadgeCapabilityKey(appBadgeProbe))),
						// The WebKit precondition as a live local fact, plus the one
						// gesture that can still decide it (button only while undecided).
						React.createElement("div", { style: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", marginTop: "8px" } },
							React.createElement("span", { style: style.desc }, `${t("notificationPermissionLabel")}${t(notificationPermissionKey(notificationProbe))}`),
							notificationPermissionRequestable(notificationProbe)
								? React.createElement("button", {
									type: "button",
									style: { ...style.btn, ...(permissionBusy ? style.btnDisabled : null) },
									disabled: permissionBusy,
									onClick: onRequestPermission
								}, t("notificationPermissionButton"))
								: null
						),
						hintLine("notificationPermissionHint"),
						React.createElement("div", { style: style.hint }, t("appBadgeFootnote"))
					),
					hintLine("badgeTestHint")
				),
				// A second, independent feature in its own block: same settings page,
				// same save discipline, different fact.
				React.createElement("div", { style: { borderTop: "1px solid var(--dsw-alias-border-l2)", marginTop: "12px", paddingTop: "12px" } },
					React.createElement("div", { style: style.label }, t("runningMarkSection")),
					React.createElement("div", { style: { marginTop: "8px" } },
						React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: "pointer" } },
							React.createElement("input", {
								type: "checkbox",
								checked: running.enabled !== false,
								onChange: (event) => onRunningMarkToggle(event.target.checked === true)
							}),
							React.createElement("span", null, t("runningMarkLabel"))
						),
						hintLine("runningMarkHint"),
						// The second switch of the same feature: still no host fact, only a
						// counting rule. Nested under the first one because it only matters
						// while the marks themselves are on.
						React.createElement("div", { style: { marginTop: "6px" } },
							React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: "pointer" } },
								React.createElement("input", {
									type: "checkbox",
									checked: running.includeSubagents !== false,
									onChange: (event) => onRunningIncludeSubagentsToggle(event.target.checked === true)
								}),
								React.createElement("span", null, t("runningIncludeSubagentsLabel"))
							),
							hintLine("runningIncludeSubagentsHint")
						),
						// The third switch of the same feature: one decoration on the
						// conversation header, independent of every count above.
						React.createElement("div", { style: { marginTop: "6px" } },
							React.createElement("label", { style: { display: "inline-flex", alignItems: "center", gap: "6px", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: "pointer" } },
								React.createElement("input", {
									type: "checkbox",
									checked: running.headerRing !== false,
									onChange: (event) => onHeaderRingToggle(event.target.checked === true)
								}),
								React.createElement("span", null, t("headerRingLabel"))
							),
							hintLine("headerRingHint")
						)
					)
				),
				notice ? React.createElement("div", { style: style.notice }, notice) : null,
				error ? React.createElement("div", { style: style.error }, error) : null
			);
		}
		//#endregion

		// `sessions` is gone from this list: its only use was the removed
		// `ctx.sessions.open(id)`. Navigation now goes through an optional
		// `ctx.get("uiWorkspace")` lookup instead of a hard dependency.
		const inject = ["slots", "locale", "connection"];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-icon-custom: dictionaries");
			const t = ctx.locale.bind(NS);
			const rpc = ctx.connection.rpc;
			// The watermark's Host half rides the same connection as every other RPC.
			// Setting it here (not at module scope) is what keeps the store usable in a
			// test harness with no connection: pushes stay no-ops, the badge still works.
			seenRpc = rpc;
			// The official "Session on screen" binding, looked up lazily so a build
			// without it (or a plugin loaded before ui-session) simply answers nothing
			// and the DOM/retention fallbacks keep the behaviour this file shipped with.
			officialSessionId = () => {
				try {
					const service = ctx.get("uiSession");
					const current = service !== null && service !== undefined ? service.adapter?.current : undefined;
					const value = current !== null && current !== undefined && typeof current.getSnapshot === "function" ? current.getSnapshot() : undefined;
					const key = value !== null && typeof value === "object" ? value.key : undefined;
					return typeof key === "string" && key !== "" ? key : undefined;
				} catch { return undefined; }
			};
			// The sessions service, looked up lazily for the same reason as the binding
			// above: it is only needed to nudge the host when a session's
			// `subagentCatalog` projection has not been folded yet, and a build without
			// it simply waits for the next render (see `requestHeaderRingRefresh`).
			headerRingSessions = () => {
				try { return ctx.get("sessions"); } catch { return null; }
			};
			// Pull the host state once, so the brand mark and the badge are correct
			// before the settings section is ever opened. The unread rule rides its
			// own endpoint: the icon RPCs keep their pre-badge response shape.
			rpc.call("/api", "iconCustom/getStatus", { args: {} })
				.then((resp) => { if (resp && resp.ok === true) syncStatus(resp.value); })
				.catch(() => {});
			rpc.call("/api", "iconCustom/getUnreadRule", { args: {} })
				.then((resp) => {
					if (resp === null || typeof resp !== "object" || resp.ok !== true) return;
					// The rule response carries the Host's clock; it is what puts the seen
					// watermark (and a legacy browser-domain store) into the Host's domain.
					// It also carries the Host's watermark table, which merges in here —
					// then the first push sends the union back, which is both the migration
					// (marks this browser made before 0.11.2) and the self-heal (a Host file
					// that was lost or pruned gets this browser's copy back).
					if (resp.value !== null && typeof resp.value === "object") {
						noteHostClock(resp.value.hostNow);
						if (adoptHostSeen(resp.value.seen)) saveSeenState();
					}
					emitUnreadConfig(resp.value);
					scheduleHostSync();
				})
				.catch(() => {});
			// The running-mark switch rides its own endpoint, for the same reason it has
			// its own file: a problem in either feature must not touch the other.
			rpc.call("/api", "iconCustom/getRunningRule", { args: {} })
				.then((resp) => {
					if (resp === null || typeof resp !== "object" || resp.ok !== true) return;
					emitRunningConfig(resp.value);
				})
				.catch(() => {});
			// Keep "the last moment this browser was here" fresh, so an ending that
			// happens while the app is closed still counts as unread when you return.
			ctx.effect(() => {
				// Host domain (see the seen store): "the last moment this browser was
				// here" must be comparable with `turn/end.time`, not with the browser's
				// own clock.
				const touch = () => { seenState.lastActiveAt = hostNow(); saveSeenState(); };
				const interval = window.setInterval(touch, 20000);
				window.addEventListener("visibilitychange", touch);
				window.addEventListener("beforeunload", touch);
				return () => {
					window.clearInterval(interval);
					window.removeEventListener("visibilitychange", touch);
					window.removeEventListener("beforeunload", touch);
					touch();
				};
			}, "dsh-icon-custom: unread watermark");
			// Re-sample the Host↔browser clock offset after a sleep/resume, which is the
			// one moment the two can drift apart mid-page. Throttled: it is one small
			// RPC per visible-again, and never on beforeunload (nothing would come back).
			// The same response carries the Host's watermark, so this is also how a
			// SECOND device learns that something was read elsewhere — a page that is
			// simply left open converges within a minute without a reload. Coming back
			// into view is also the natural moment to retry a failed push.
			ctx.effect(() => {
				let sampledAt = 0;
				const sample = () => {
					if (document.visibilityState === "hidden") return;
					scheduleHostSync();
					if (Date.now() - sampledAt < 60000) return;
					sampledAt = Date.now();
					rpc.call("/api", "iconCustom/getUnreadRule", { args: {} })
						.then((resp) => {
							if (resp === null || typeof resp !== "object" || resp.ok !== true) return;
							const value = resp.value !== null && typeof resp.value === "object" ? resp.value : null;
							if (value === null) return;
							noteHostClock(value.hostNow);
							if (adoptHostSeen(value.seen)) { saveSeenState(); emitUnreadPoke(); }
						})
						.catch(() => {});
				};
				window.addEventListener("visibilitychange", sample);
				const interval = window.setInterval(sample, 60000);
				return () => {
					window.removeEventListener("visibilitychange", sample);
					window.clearInterval(interval);
				};
			}, "dsh-icon-custom: host clock sample");
			// Brand-mark seat: replaces only the whale mark (verified: a
			// third-party registration wins over the official occupant and the
			// official package's mark steps aside). The brand NAME text is a
			// separate seat and is left untouched. priority -1 is required:
			// the official occupant holds priority 0, and same-priority
			// registrations throw ("register at a different priority to shadow
			// it (lowest renders)").
			ctx.slots.inject("sidebar.brand.mark", () => ctx.slots.register({ name: "sidebar.brand.mark", priority: -1 }, (props) => React.createElement(BrandMark, { ...props, rpc })));
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "favicon",
				order: 50,
				label: () => t("nav"),
				locale: NS,
				inject: () => ({ t })
			}, (props) => React.createElement(FaviconSection, { ...props, t, rpc })));

			// The badge itself is NOT a slot occupant: it is injected into the
			// sidebar's section header by `paintHeaderBadge()` (see above), because
			// `sidebar.workspaces` is a single slot covering the whole region. Only
			// the lists they open still ride a slot — the frame-wide overlay, which
			// escapes the sidebar's clipping.
			//
			// 0.2.x has no `ctx.sessions.open(id)` (the ClientSessions service exposes
			// retain/using/retainInfo/refreshProjections/search/fork/scope/binding — no
			// navigation). Official code jumps to a session with
			// `ctx.uiWorkspace.openSession(id)` (ui-chat does exactly this), so the entry
			// is looked up optionally: navigation is best effort and must never make the
			// favicon half depend on the workspace UI being mounted.
			const openSession = (row) => {
				// A list row (`{ id, workspaceId, … }`) since 0.19.0: the workspace is what
				// the sidebar reveal needs, and the pending list cannot supply it later. A
				// bare id still opens the session — it just cannot expand anything.
				const id = row !== null && typeof row === "object" ? row.id : row;
				const workspaceId = row !== null && typeof row === "object" && typeof row.workspaceId === "string" ? row.workspaceId : "";
				try { ctx.get("uiWorkspace")?.openSession(id); } catch { /* navigation is best effort */ }
				// Deliberately not awaited, and never allowed to matter: the session is open
				// either way (see the reveal region for why this is all best effort).
				void revealSessionRow(id, workspaceId);
			};
			// The injected node labels itself for screen readers, so it needs the
			// locale binder that only exists inside `apply()`.
			badgeT = t;
			ctx.slots.inject("shell.overlay", () => ctx.slots.register(
				{ name: "shell.overlay", id: "icon-custom-header-popup", order: 30 },
				() => React.createElement(HeaderPopup, { t, onOpen: openSession })
			));

			// Real number source: a headless occupant of the frame-wide overlay
			// layer reads DSH's official pending-interaction registry and pushes it
			// into the badge bridge. No plugin is addressed by name.
			ctx.slots.inject("shell.overlay", () => ctx.slots.register(
				{ name: "shell.overlay", id: "icon-custom-badge-source" },
				(props) => React.createElement(BadgeSource, props)
			));

			// Test-only badge wiring: the settings input drives the in-package
			// bridge, the brand mark reads it through its own subscription, and
			// this effect keeps the tab icon in sync. Teardown restores the
			// pristine platform/custom icon.
			ctx.effect(() => {
				const unsubscribe = subscribeBadge((snapshot) => { composeFavicon(snapshot.count, snapshot.size); });
				// Level-triggered on purpose: (re)applying this half must adopt the
				// value that is already on the bridge. The brand mark reads it at
				// mount; the tab icon has to be told, or a plugin hot-reload would
				// leave it restored (the old effect's cleanup) until the next change.
				composeFavicon(effectiveCount(), badgeSize, true);
				return () => {
					unsubscribe();
					// Forced: the promise is that unloading this half leaves the page's
					// own icon behind, whatever this page load had drawn before.
					composeFavicon(0, badgeSize, true);
				};
			}, "dsh-icon-custom: favicon badge");
			// Watchdog. The tab icon is the one surface other parties can disturb
			// (cached HTML, browser extensions, tab moves, plugin reloads), so keep
			// re-asserting the composite instead of trusting one-shot application.
			ctx.effect(() => {
				let queued = false;
				const schedule = () => {
					if (queued) return;
					queued = true;
					window.setTimeout(() => { queued = false; reconcileFavicon(); }, 150);
				};
				const observer = new MutationObserver(schedule);
				observer.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "rel"] });
				window.addEventListener("visibilitychange", schedule);
				window.addEventListener("focus", schedule);
				const interval = window.setInterval(() => {
					reconcileFavicon();
					reassertAppBadge();
				}, 5000);
				return () => {
					observer.disconnect();
					window.removeEventListener("visibilitychange", schedule);
					window.removeEventListener("focus", schedule);
					window.clearInterval(interval);
				};
			}, "dsh-icon-custom: favicon watchdog");
			// Workspace dots: the one fragile piece. It waits for the sidebar, keeps a
			// marker on each workspace row whose folder icon it can find, and gives up
			// on its own after repeated failures. It lives entirely outside React, so a
			// throw here can never reach anyone's render tree.
			ctx.effect(() => {
				let observer = null;
				let retry = 0;
				let queued = false;
				const schedule = () => {
					if (queued) return;
					queued = true;
					window.setTimeout(() => {
						queued = false;
						paintWorkspaceDots();
						// Same region, same watchdog: the section-header badge is
						// re-injected whenever the shipped UI re-renders over it.
						paintHeaderBadge();
						// And the conversation header's ring, which lives outside this
						// container: any churn nearby is a fair moment to reconcile it.
						paintHeaderRing(runningConfig, headerRingValue);
					}, 200);
				};
				const attach = () => {
					const container = workspaceDotContainer();
					if (container === null) return false;
					observer = new MutationObserver(() => {
						if (workspaceDotPainting) return;
						// Ignore only the settle window right after our own paint. Anything
						// later — including the shipped UI re-rendering a row and taking our
						// marker with it — must trigger a reconcile, or the dot stays gone.
						if (Date.now() - workspaceDotPaintedAt < 250) return;
						schedule();
					});
					observer.observe(container, { childList: true, subtree: true });
					schedule();
					return true;
				};
				if (!attach()) retry = window.setInterval(() => { if (attach()) window.clearInterval(retry); }, 1000);
				const offDots = subscribeSidebarMarks(schedule);
				const offConfig = subscribeUnreadConfig(schedule);
				// The running marks ride the same paint pass, so their switch has to wake
				// it too — otherwise turning it off would leave the marks until the next
				// unrelated repaint.
				const offRunning = subscribeRunningConfig(schedule);
				return () => {
					if (retry !== 0) window.clearInterval(retry);
					if (workspaceDotVerify !== 0) { window.clearTimeout(workspaceDotVerify); workspaceDotVerify = 0; }
					if (observer !== null) observer.disconnect();
					offDots();
					offConfig();
					offRunning();
					clearWorkspaceDots();
					clearHeaderBadge();
					clearHeaderRing();
					// The one highlight this plugin ever puts on a SHIPPED row: it must not
					// outlive the plugin, even if the unload lands inside its flash window.
					clearRevealFlash();
				};
			}, "dsh-icon-custom: workspace dots");
			// The platform favicon.svg repaints itself for dark mode through
			// prefers-color-scheme; a composited bitmap cannot, so rebuild it —
			// forced, because the base it was built from is exactly what changed.
			ctx.on("theme/change", () => { composeFavicon(effectiveCount(), badgeSize, true); });
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
