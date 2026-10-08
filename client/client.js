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
			successPwa: "PWA 图标设置已更新",
			logo: "同时替换页面 Logo 图标",
			logoHint: "把网页左上角品牌 logo 里的鲸鱼图标换成这张(不影响 deepseek HARNESS 文字)。",
			successLogo: "页面 Logo 已更新",
			fail: "操作失败",
			noFile: "请先选择图标文件",
			badgeTest: "未读红点",
			badgeSourceLabel: "数据来源:",
			badgeSourceReal: "真实未读",
			badgeSourceManual: "手动测试",
			badgeTestUnit: "0 = 不显示",
			badgeSizeLabel: "红点大小:",
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
			unreadPanelShort: "待处理",
			unreadPanelCount: "{n} 个待处理",
			unreadPanelNone: "暂无待处理",
			unreadPanelTitle: "待处理的会话",
			unreadPanelEmpty: "现在没有需要你处理的事情",
			unreadWaiting: "在等你",
			unreadEnded: "刚结束,还没看",
			unreadPanelOther: "其他",
			unreadMarkAllRead: "全部标记已读",
			/** 与官方侧栏同一形状("13小时"),方便和列表里的时间戳逐字对上。 */
			ageNow: "刚刚",
			ageMinutes: "{n}分钟",
			ageHours: "{n}小时",
			ageDays: "{n}天",
			ageMonths: "{n}个月",
			ageYears: "{n}年",
			workspaceDotLabel: "在工作区和会话行上显示红点(实验)",
			workspaceDotHint: "在侧栏工作区那一行的文件夹图标上点一个小红点(收起的工作区里有多少未读,就看它),有未读的会话在其标题右边也跟一个小红点。会话行上的点只在那一行真的显示着时才画:折叠起来的会话由工作区那一行的点和「待处理」清单代表。这一项是贴着页面结构做的,DSH 升级后可能失效;失效时只会变成\"不显示\",不会影响红点数字、清单、跳转这些功能,随时可以关掉它。",
			appBadgeLabel: "在系统应用图标上显示红点",
			appBadgeHint: "安装为应用后,把同一个数字也放到系统图标上:Windows 是任务栏图标上的角标,macOS 是 Dock 角标,iOS 是主屏图标上的数字。样子由系统决定——Windows 上 Chrome 画深色圆+白字,Edge 走 Windows 系统徽章通道(是否显示数字由 Edge/Windows 决定);插件会周期重设数字,但只在应用窗口开着时更新。",
			appBadgeFootnote: "角标只在应用窗口开着时由本插件更新;数字超过 99 时由系统显示为 99+。",
			appBadgeProbeInstalled: "当前环境:已安装为应用,本机可以设置角标。是否真正显示由系统决定。",
			appBadgeProbeTab: "当前环境:浏览器标签页(不是安装的应用)——安装为应用后才会显示角标。",
			appBadgeProbeUnsupported: "当前环境:本机没有这个能力(当前浏览器不支持应用角标)。",
			appBadgeProbeInsecure: "当前环境:不是安全上下文(请用 localhost 或 https 访问),系统角标不可用。",
			badgeTestHint: "真实未读 = 有会话发生了上面勾选的情况、而且你还没看过它(打开该会话即视为已读)。你正开着的会话也算——窗口可能被最小化、页面可能切到后台,这里无从判断你在不在看,所以不做这个区分。只有子代理不计。手动模式:自己填数字试看效果。刷新页面后回到真实未读。",
			clearDelayLabel: "进入会话后多久算已读:",
			clearDelayUnit: "秒",
			clearDelayHint: "填 0 = 进去就算已读(红点立即消失)。大于 0 时,你要在那个会话里连续待满这么多秒它才算看过:中途切走会清零重数,刷新页面也重新数。**计时只认\"你进入会话时已经存在的结束\"**——你人已经在里面的时候又跑完一轮,那一轮不算数:它会一直亮着,等你切走再进来才会清。上限 600 秒。已读记在宿主($DSH_HOME/custom-favicon/unread-seen.json):任何一台设备上看过,所有设备都不再提醒;浏览器那份只是缓存,清站点数据不会把已读丢回去。"
		};
		const en = {
			nav: "Favicon",
			current: "Current icon",
			none: "Using the platform default icon",
			upload: "Upload",
			uploadHint: "SVG, PNG or ICO, up to 10 MB. SVG is auto-rasterized to PNG, and sizes are derived to fit Android/iOS/tablet home-screen icons. Applies instantly and persists across reloads.",
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
			successPwa: "PWA icon setting updated",
			logo: "Also replace the page logo mark",
			logoHint: "Replaces the whale mark beside the brand name in the top-left (the deepseek HARNESS text stays).",
			successLogo: "Page logo updated",
			fail: "Operation failed",
			noFile: "Choose a file first",
			badgeTest: "Unread badge",
			badgeSourceLabel: "Number source:",
			badgeSourceReal: "Real unread",
			badgeSourceManual: "Manual",
			badgeTestUnit: "0 = hidden",
			badgeSizeLabel: "Badge size:",
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
			unreadPanelShort: "Pending",
			unreadPanelCount: "{n} pending",
			unreadPanelNone: "Nothing pending",
			unreadPanelTitle: "Sessions needing you",
			unreadPanelEmpty: "Nothing needs you right now",
			unreadWaiting: "waiting for you",
			unreadEnded: "ended, not seen yet",
			unreadPanelOther: "Other",
			unreadMarkAllRead: "Mark all read",
			/** Same shape as the shipped sidebar ("13h"), so the two can be read side by side. */
			ageNow: "now",
			ageMinutes: "{n}min",
			ageHours: "{n}h",
			ageDays: "{n}d",
			ageMonths: "{n}mo",
			ageYears: "{n}y",
			workspaceDotLabel: "Dots on workspace and session rows (experimental)",
			workspaceDotHint: "Adds a small red dot to the folder icon of each workspace row (a collapsed workspace shows how many of its sessions are unread there), and one beside the title of every unread session row. A session dot is only drawn while that row is really rendered: folded sessions are represented by their workspace row's dot and the pending panel. This one reads the page structure, so a DSH upgrade may break it; when it does it simply stops showing, never affecting the counts, the list, or navigation. Turn it off any time.",
			appBadgeLabel: "Badge the system app icon",
			appBadgeHint: "Once installed as an app, the same number also goes to the system icon: a taskbar badge on Windows, a Dock badge on macOS, a number on the iOS home-screen icon. The system decides how it looks — on Windows, Chrome draws a dark circle with white text, while Edge goes through the Windows badge channel (whether it shows the number is up to Edge/Windows). The plugin re-asserts the number periodically, but only while the app window is open.",
			appBadgeFootnote: "The badge is only updated by this plugin while the app window is open; above 99 the system shows 99+.",
			appBadgeProbeInstalled: "This environment: installed as an app, so this device can set a badge. Whether it actually appears is up to the system.",
			appBadgeProbeTab: "This environment: a browser tab (not an installed app) — install as an app to get a badge.",
			appBadgeProbeUnsupported: "This environment: no app-badge capability in this browser.",
			appBadgeProbeInsecure: "This environment: not a secure context (use localhost or https) — the system badge is unavailable.",
			badgeTestHint: "Real unread = a session ended for one of the checked reasons and you have not looked at it yet (opening a session marks it read). The session you are viewing counts too — the window may be minimised or the page in the background, so this half cannot tell whether you are looking, and does not pretend to. Only sub-agents never count. Manual = type a number to preview. Resets to Real on reload.",
			clearDelayLabel: "Mark read after staying:",
			clearDelayUnit: "seconds",
			clearDelayHint: "0 = read as soon as you enter (the dot clears at once). Above 0 you must stay in that session for this many seconds before it counts as read: leaving it resets the clock, and so does a reload. The clock only ever covers **the ending that was already there when you entered** — a turn that finishes while you are sitting in the session does not count: it stays red until you leave and come back. Capped at 600 seconds. Read state lives on the Host ($DSH_HOME/custom-favicon/unread-seen.json): read on any device means read on every device, and the browser's own copy is only a cache — clearing site data no longer throws it away."
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
			iconState = {
				active: known && status.active === true,
				rev: known && typeof status.rev === "string" && status.rev !== "" ? status.rev : null,
				png: known && status.png === true,
				mime: known && typeof status.mime === "string" ? status.mime : null
			};
			reconcileFavicon();
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
		let unreadConfig = { reasons: { ...UNREAD_FALLBACK_REASONS }, pending: true, workspaceDot: true, appBadge: UNREAD_APP_BADGE_FALLBACK, clearDelaySec: 0 };
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
				clearDelaySec: normalizeClearDelay(source.clearDelaySec)
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
				pending = seenRpc.call("/api", "iconCustom/setUnreadSeen", { args: { marks } });
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
		 * Every session the main view is showing.
		 *
		 * The official signal is the row's `retainedBy.mainView` retention count, the
		 * same one ui-layout's DocumentTitle, ui-cordis, ui-open-in-app and ui-session
		 * read (`list.current` is honoured first for runtimes that expose it).
		 *
		 * It returns ALL of them, not one. The pane retains the incoming session
		 * BEFORE it releases the outgoing one, and a retention that outlives its pane
		 * can leave an old session looking "current" for good — and picking a single
		 * id then meant the session you were actually reading was never marked read:
		 * the dot stayed red however long you stayed in it. Each retained session
		 * gets its own stay clock instead.
		 * @param list - the session list snapshot (may be absent).
		 * @returns the ids being viewed, in list order; `[]` when there are none.
		 */
		function currentSessionIds(list) {
			if (list === null || typeof list !== "object") return [];
			if (typeof list.current === "string" && list.current !== "") return [list.current];
			const byId = list.byId;
			if (byId === null || typeof byId !== "object") return [];
			const ids = [];
			for (const session of Object.values(byId)) {
				if (session === null || typeof session !== "object") continue;
				const retainedBy = session.retainedBy;
				const count = retainedBy !== null && typeof retainedBy === "object" ? retainedBy.mainView : undefined;
				if (typeof count === "number" && count > 0 && typeof session.id === "string" && session.id !== "") ids.push(session.id);
			}
			return ids;
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
		 * How many sessions deserve the badge right now: endings whose reason is
		 * enabled and that this browser has not seen since, plus sessions waiting
		 * for you (when that source is enabled). Only sub-agent sessions never count.
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
		 * @returns the badge number.
		 */
		function collectUnread(list, pending, config, seen) {
			const reasons = config !== null && typeof config === "object" && config.reasons !== null && typeof config.reasons === "object" ? config.reasons : {};
			// The watermark is a parameter, not module state: this stays a pure
			// decision function that a test can drive with any marks it likes.
			const marks = seen !== null && typeof seen === "object" ? seen : {};
			/** { id, title, waiting, kind, at } — newest first, "in wait" ahead of "ended". */
			const hits = [];
			const ids = new Set();
			const byId = list !== null && typeof list === "object" && list.byId !== null && typeof list.byId === "object" ? list.byId : {};
			const titleOf = (id, entry) => (entry !== null && typeof entry === "object" && typeof entry.displayTitle === "string" && entry.displayTitle !== "" ? entry.displayTitle : id);
			// Which workspace the session lives in. The sidebar's own workspace rows are
			// labelled with this cwd basename, so the list points at the same place the
			// reader sees — the sidebar group cannot be expanded for us (that state is
			// private to the shipped browser), so naming it is the honest substitute.
			const whereOf = (entry) => {
				const cwd = entry !== null && typeof entry === "object" && typeof entry.cwd === "string" ? entry.cwd : "";
				if (cwd === "") return "";
				const parts = cwd.replace(/[\\/]+$/, "").split(/[\\/]/);
				return parts[parts.length - 1] || cwd;
			};
			if (list !== null && typeof list === "object") {
				const order = Array.isArray(list.ids) ? list.ids : Object.keys(byId);
				for (const id of order) {
					const entry = byId[id];
					if (entry === null || typeof entry !== "object") continue;
					if (entry.origin === "subagent") continue;
					const values = entry.projectionValues;
					const value = values !== null && typeof values === "object" ? values[LAST_TURN_END_KEY] : undefined;
					if (value === null || typeof value !== "object") continue;
					const endAt = typeof value.endAt === "number" ? value.endAt : 0;
					const seenAt = marks[id];
					if (endAt <= 0 || typeof seenAt !== "number" || endAt <= seenAt) continue;
					// Unknown reasons (a newer DSH adds one) stay hidden until the user
					// turns them on, so a vocabulary growth can never surprise the badge.
					if (reasons[value.reason] !== true) continue;
					ids.add(id);
					hits.push({ id, title: titleOf(id, entry), where: whereOf(entry), waiting: false, kind: value.reason, at: endAt });
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
						hits.push({ id, title: titleOf(id, byId[id]), where: whereOf(byId[id]), waiting: true, kind, at: Date.now() });
					});
				}
			}
			hits.sort((a, b) => (b.waiting === true ? 1 : 0) - (a.waiting === true ? 1 : 0) || b.at - a.at);
			return hits;
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
		let manualCount = 0;
		let badgeSize = "md";
		const badgeListeners = new Set();
		function normalizeCount(value) {
			const n = Number(value);
			return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
		}
		function effectiveCount() {
			return badgeSource === "manual" ? manualCount : realCount;
		}
		function badgeSnapshot() {
			return { count: effectiveCount(), size: badgeSize, source: badgeSource, items: badgeSource === "manual" ? [] : realItems };
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
		//#region favicon compositing
		// The browser accepts exactly ONE image per <link rel="icon">, so a tab
		// badge cannot be layered: base icon and badge are redrawn together into a
		// canvas and the merged bitmap is handed back to the browser. Count 0 (and
		// teardown) restores the pristine platform/custom href.
		const FAVICON_SIZE = 64;
		let faviconBase = null;
		let composeSeq = 0;
		let faviconComposing = false;
		/** Last compose failure, so a repeated failure warns once instead of spamming. */
		let lastComposeError = null;
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
		function loadIconImage(href) {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error("icon-load"));
				img.src = href;
			});
		}
		async function applyBadgeToFavicon(count, size) {
			const base = desiredIconHref();
			if (count <= 0) {
				// No badge to draw. With a custom icon active the page must carry it on
				// EVERY link (a stale scheme-specific sibling outranks the one we set);
				// with none, the shipped dark/light pair goes back untouched — the
				// plugin promises zero side effects while it has no icon of its own.
				if (iconState.active === true) setIconEverywhere(base, desiredIconType());
				else restoreShippedIcons();
				faviconBase = null;
				return;
			}
			// The base is resolved from the plugin's status, never from whatever the
			// page happens to carry, and never from our own previous bitmap.
			faviconBase = { href: base, type: desiredIconType() };
			const seq = ++composeSeq;
			faviconComposing = true;
			try {
				const img = await loadIconImage(new URL(faviconBase.href, document.baseURI).href);
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
				drawFaviconBadge(c2d, FAVICON_SIZE, count, badgeScale(size));
				setIconEverywhere(canvas.toDataURL("image/png"), "image/png");
			} catch (error) {
				// Never silent: a failure here is invisible in the UI (the tab simply
				// keeps its previous icon), which once cost a whole debugging session.
				// Warn once per distinct reason so the 5s watchdog cannot spam.
				const why = String((error && error.message) || error);
				if (why !== lastComposeError) {
					lastComposeError = why;
					try { console.warn("dsh-icon-custom: 标签页红点合成失败 / favicon badge compose failed:", why); } catch {}
				}
			} finally {
				if (seq === composeSeq) faviconComposing = false;
			}
		}
		/**
		 * Re-assert the tab badge after anything outside this plugin disturbed the
		 * icon link — a cached page, a browser extension, a tab move, or a plugin
		 * reload. Our own output is a `data:` URL, so any other href means the
		 * composite was replaced and has to be rebuilt from the new base.
		 */
		function reconcileFavicon() {
			// Inspect EVERY icon link: 0.2.x ships two (dark/light), and a sibling
			// left stale by anything outside the plugin must be repaired too — that
			// stale sibling is exactly what used to outrank the icon we set.
			const hrefs = iconLinks().map((candidate) => candidate.getAttribute("href"));
			const ours = hrefs.length > 0 && hrefs.every((value) => typeof value === "string" && value.slice(0, 5) === "data:");
			if (effectiveCount() <= 0) {
				// Carries the custom icon, or puts the shipped pair back. Both writers
				// only touch a link that actually differs, so this stays a no-op once
				// the page is correct and cannot re-arm the head observer.
				applyBadgeToFavicon(0);
				return;
			}
			if (ours || faviconComposing) return; // already showing, or a build is running
			applyBadgeToFavicon(effectiveCount(), badgeSize);
		}
		// A freshly applied base icon replaces whatever the browser holds, so the
		// composite must be rebuilt from the NEW base instead of the stale one.
		function refreshFaviconBase() {
			faviconBase = null;
			applyBadgeToFavicon(effectiveCount(), badgeSize);
		}
		//#endregion

		//#region unread panel
		/**
		 * Whether the "which sessions?" list is open, and where its button sits.
		 * The foot entry and the floating list live in two different slots, so they
		 * cannot share React state — this tiny store is what they agree through.
		 */
		let unreadPanelOpen = false;
		let unreadPanelAnchor = null;
		const unreadPanelListeners = new Set();
		function emitUnreadPanel(open, anchor) {
			unreadPanelOpen = open === true;
			if (anchor !== undefined) unreadPanelAnchor = anchor;
			unreadPanelListeners.forEach((fn) => { try { fn(); } catch {} });
		}
		function subscribeUnreadPanel(fn) {
			unreadPanelListeners.add(fn);
			return () => { unreadPanelListeners.delete(fn); };
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
		function toggleUnreadPanel(anchor) {
			emitUnreadPanel(!unreadPanelOpen, anchor === undefined ? null : anchor);
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
		const WS_ROW_MIN_H = 18;
		const WS_ROW_MAX_H = 56;
		const WS_ROW_MIN_W = 80;
		const WS_MAX_FAILURES = 3;
		let workspaceDots = [];
		/** One entry per unread session: `{ id, title }`, matched against the row title. */
		let sessionDots = [];
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
			try { document.querySelectorAll("[" + WS_DOT_ATTR + "],[" + ROW_DOT_ATTR + "]").forEach((node) => node.remove()); } catch {}
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
				document.querySelectorAll("[" + WS_DOT_ATTR + "]").forEach((node) => {
					if (!node.isConnected || !wantedNames.has(node.getAttribute(WS_DOT_ATTR))) node.remove();
				});
				document.querySelectorAll("[" + ROW_DOT_ATTR + "]").forEach((node) => {
					if (!node.isConnected || !wantedIds.has(node.getAttribute(ROW_DOT_ATTR))) node.remove();
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
					if (existingMarker(row, WS_DOT_ATTR, key) !== null) { placed++; continue; }
					const icon = target.icon;
					const rowRect = row.getBoundingClientRect();
					const anchorRect = icon.getBoundingClientRect();
					if (window.getComputedStyle(row).position === "static") {
						workspaceDotRestores.push({ el: row, position: row.style.position });
						row.style.position = "relative";
					}
					const dot = document.createElement("span");
					dot.setAttribute(WS_DOT_ATTR, key);
					dot.setAttribute("aria-hidden", "true");
					dot.title = (typeof entry.name === "string" && entry.name !== "" ? entry.name : key) + " · " + entry.count;
					dot.style.cssText = "position:absolute;pointer-events:none;width:8px;height:8px;border-radius:50%;"
						+ "background:#e5484d;box-shadow:0 0 0 1.5px var(--dsw-alias-bg-layer-1,#fff);"
						+ "left:" + Math.round(anchorRect.right - rowRect.left - 4) + "px;"
						+ "top:" + Math.round(anchorRect.top - rowRect.top - 3) + "px;";
					row.appendChild(dot);
					placed++;
					created++;
				}
				// Session rows: the marker rides inline right after the title, so it stays
				// beside the name whatever the timestamp happens to say.
				for (const entry of wantedRows) {
					const target = sessionRowTarget(container, entry.id, entry.title, legacyTitleMatch);
					if (target === null) { missed++; continue; }
					if (existingMarker(target.row, ROW_DOT_ATTR, entry.id) !== null) { placed++; continue; }
					const dot = document.createElement("span");
					dot.setAttribute(ROW_DOT_ATTR, entry.id);
					dot.setAttribute("aria-hidden", "true");
					dot.title = entry.title;
					// Tight to the title on the left, and kept off the timestamp on the
					// right: with no right margin the dot reads as part of "24 分钟".
					dot.style.cssText = "pointer-events:none;flex:none;width:8px;height:8px;border-radius:50%;"
						+ "background:#e5484d;margin:0 4px 0 6px;";
					target.title.insertAdjacentElement("afterend", dot);
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
			// Baseline new sessions; persists only when it actually learns something.
			React.useEffect(() => {
				const ids = list !== null && typeof list === "object" && Array.isArray(list.ids) ? list.ids : [];
				if (!ensureSeenBaseline(ids)) return;
				pruneSeenState();
				saveSeenState();
			}, [list]);
			const currentIds = currentSessionIds(list);
			const items = collectUnread(list, pending, config, seenState.seen);
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
			 * the rule ("an ending during your stay waits for the next entry"). A
			 * session that leaves is forgotten, so coming back takes a fresh snapshot.
			 */
			const stayArmed = React.useRef(new Map());
			React.useEffect(() => {
				const snapshot = stayLive.current.list !== null && typeof stayLive.current.list === "object" && stayLive.current.list.byId !== null && typeof stayLive.current.list.byId === "object" ? stayLive.current.list.byId : {};
				const live = new Set(stayIds);
				for (const id of Array.from(stayArmed.current.keys())) {
					if (!live.has(id)) stayArmed.current.delete(id);
				}
				for (const id of stayIds) {
					if (!stayArmed.current.has(id)) stayArmed.current.set(id, lastTurnEndAt(snapshot[id]));
				}
				if (staySignature === "") return undefined;
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
			}, [staySignature, delayMs]);
			React.useEffect(() => { emitRealBadge(count, items); }, [count, items]);
			// Map session → its Workspace from the official snapshot: the ID anchors the
			// folder dot to the keyed row, the title is what the row displays (not always
			// the cwd basename, and not always equal to the stored title either).
			React.useEffect(() => {
				const owners = {};
				const list = workspaces !== null && typeof workspaces === "object" && Array.isArray(workspaces.items) ? workspaces.items : [];
				for (const workspace of list) {
					if (workspace === null || typeof workspace !== "object") continue;
					if (!Array.isArray(workspace.sessionIds)) continue;
					const id = typeof workspace.workspaceId === "string" ? workspace.workspaceId : "";
					const title = typeof workspace.title === "string" ? workspace.title : "";
					for (const sessionId of workspace.sessionIds) owners[sessionId] = { id, title };
				}
				emitSidebarMarks({
					workspaces: dotsFromItems(items, owners),
					sessions: items.map((item) => ({ id: item.id, title: item.title }))
				});
			}, [items, workspaces]);
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
		 * the old sidebar-foot button is gone.
		 */
		const HEAD_BADGE_ATTR = "data-icon-custom-unreadbadge";
		const HEAD_BADGE_STYLE_ID = "dsh-icon-custom-unreadbadge-css";
		const HEAD_BADGE_WIRED = "data-icon-custom-unreadbadge-wired";
		const HEAD_BADGE_MAX_FAILURES = 40;
		/** How many ancestors to walk up looking for the header row. */
		const HEAD_BADGE_MAX_STEPS = 6;
		/** Raise above the label's top edge; the header only leaves 8px of headroom. */
		const HEAD_BADGE_RAISE = 7;
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
			`[${HEAD_BADGE_ATTR}][data-zero="1"]{background:var(--dsw-alias-state-idle-primary,#b6bcc4)}`
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
			// Our own badge is a button too; never let it stand in for the search
			// control, or the row anchor would resolve to the wrong element.
			let firstButton = null;
			for (const candidate of container.querySelectorAll("button")) {
				if (candidate.getAttribute(HEAD_BADGE_ATTR) !== null) continue;
				firstButton = candidate;
				break;
			}
			if (firstButton === null) return null;
			let row = firstButton.parentElement;
			for (let step = 0; step < HEAD_BADGE_MAX_STEPS && row !== null && row !== container; step++) {
				for (const child of row.children) {
					if (child === firstButton || child.contains(firstButton)) continue;
					if (child.tagName === "BUTTON") continue;
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
					toggleUnreadPanel({ left: rect.left, top: rect.top, bottom: rect.bottom });
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
			// The label collapses to nothing while the search box is open; the badge
			// has no meaning then, and the label's own visibility cannot hide it
			// because it is a sibling.
			const rowRect = row.getBoundingClientRect();
			const labelRect = label.getBoundingClientRect();
			if (labelRect.width < 8) {
				if (node.style.display !== "none") node.style.display = "none";
			} else {
				const width = typeof node.offsetWidth === "number" && node.offsetWidth > 0 ? node.offsetWidth : 15;
				const left = Math.round(labelRect.right - rowRect.left - width + HEAD_BADGE_OVERHANG);
				// Clamped: the header clips its overflow, and only ~8px sit above the label.
				const top = Math.max(0, Math.round(labelRect.top - rowRect.top - HEAD_BADGE_RAISE));
				if (node.style.left !== `${left}px`) node.style.left = `${left}px`;
				if (node.style.top !== `${top}px`) node.style.top = `${top}px`;
				if (node.style.display !== "flex") node.style.display = "flex";
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
			try { document.querySelectorAll(`[${HEAD_BADGE_ATTR}]`).forEach((node) => node.remove()); } catch {}
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
		 * The list behind that number, in the frame-wide overlay layer so it escapes
		 * the sidebar's clipping and scroll container. Clicking a row opens that
		 * session — which is also what marks it read.
		 */
		function UnreadPopup(props) {
			const [snapshot, setSnapshot] = React.useState(badgeSnapshot);
			const [open, setOpen] = React.useState(unreadPanelOpen);
			// Ages are computed against the HOST's clock (the endings are host
			// timestamps); re-tick while open so "刚刚" does not stay stale.
			const [, tick] = React.useState(0);
			React.useEffect(() => subscribeBadge(setSnapshot), []);
			React.useEffect(() => subscribeUnreadPanel(() => setOpen(unreadPanelOpen)), []);
			React.useEffect(() => {
				if (!open) return undefined;
				const interval = window.setInterval(() => tick((n) => n + 1), 30000);
				return () => window.clearInterval(interval);
			}, [open]);
			React.useEffect(() => {
				if (!open) return undefined;
				const onKey = (event) => { if (event.key === "Escape") emitUnreadPanel(false); };
				const onDown = (event) => {
					const node = event.target;
					if (node !== null && typeof node.closest === "function" && node.closest('[data-icon-custom-unread="1"]') !== null) return;
					emitUnreadPanel(false);
				};
				window.addEventListener("keydown", onKey);
				document.addEventListener("mousedown", onDown, true);
				return () => {
					window.removeEventListener("keydown", onKey);
					document.removeEventListener("mousedown", onDown, true);
				};
			}, [open]);
			if (!open) return null;
			const t = props.t;
			const anchor = unreadPanelAnchor;
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
			const items = Array.isArray(snapshot.items) ? snapshot.items : [];
			const ackTargets = unreadAckTargets(items);
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
				if (ackTargets.length === items.length) emitUnreadPanel(false);
			};
			return React.createElement("div", { "data-icon-custom-unread": "1", style },
				React.createElement("div", { style: { fontWeight: 600, padding: "2px 6px 8px" } }, t("unreadPanelTitle")),
				items.length === 0
					? React.createElement("div", { style: { padding: "2px 6px 8px", opacity: 0.7 } }, t("unreadPanelEmpty"))
					: React.createElement("div", { style: { display: "flex", flexDirection: "column", maxHeight: place.listMaxHeight + "px", overflowY: "auto" } },
						groupUnreadByWorkspace(items).map((group) => React.createElement("div", { key: group.where === "" ? "\u0000none" : group.where },
							React.createElement("div", { style: { padding: "7px 8px 3px", fontSize: "11px", fontWeight: 600, opacity: 0.55, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
								group.where === "" ? t("unreadPanelOther") : group.where
							),
							group.items.map((item) => React.createElement("button", {
								key: item.id, type: "button",
								onClick: () => { emitUnreadPanel(false); props.onOpen(item.id); },
								style: { display: "block", width: "100%", textAlign: "left", padding: "6px 8px", border: "0", borderRadius: "8px", background: "transparent", color: "inherit", font: "inherit", cursor: "pointer" }
							},
								React.createElement("span", { style: { display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, item.title),
								React.createElement("span", { style: { display: "block", opacity: 0.6, fontSize: "11px" } }, unreadRowSubtitle(item, hostNow(), t))
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
			// No badge: keep the exact original element (no wrapper, no layout risk).
			if (badge.count <= 0) return img;
			const edge = Math.max(12, Math.round(size * 0.5 * badgeScale(badge.size)));
			const label = `${badgeLabel(badge.count)} pending (test)`;
			return React.createElement("span", {
				style: { position: "relative", display: "inline-flex", width: size, height: size, flex: "none" }
			},
				img,
				React.createElement("span", {
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
				}, badgeLabel(badge.count))
			);
		}

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
			// Sampled when the section mounts, which is the moment the user is
			// looking at it. It reports local facts only (see badgeCapabilityProbe).
			const [appBadgeProbe] = React.useState(() => appBadgeEnv());
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
				rpc.call("/api", "iconCustom/setUnreadRule", {
					args: { request: { reasons: next.reasons, pending: next.pending, workspaceDot: next.workspaceDot, appBadge: next.appBadge, clearDelaySec: next.clearDelaySec } }
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
			// The system-icon projection of the same number. Saved through the same
			// one save path, so this field can never be dropped by a caller.
			const onAppBadgeToggle = React.useCallback((checked) => {
				saveUnreadRule({ appBadge: checked });
			}, [saveUnreadRule]);
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
				React.createElement("div", { style: style.hint }, t("pwaHint")),
				React.createElement("label", { style: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 0 0", fontSize: 12, color: "var(--dsw-alias-label-primary)", cursor: busy ? "default" : "pointer" } },
					React.createElement("input", { type: "checkbox", checked: logoEnabled, disabled: busy || !active, onChange: onToggleLogo, style: { cursor: busy ? "default" : "pointer" } }),
					React.createElement("span", null, t("logo"))
				),
				React.createElement("div", { style: style.hint }, t("logoHint")),
				React.createElement("div", { style: style.hint }, t("uploadHint")),
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
					React.createElement("div", { style: { marginTop: "12px" } },
						React.createElement("div", { style: style.desc }, t("unreadReasonsLabel")),
						React.createElement("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center" } },
							["completed", "error", "blocked", "max-tokens", "interrupted", "aborted:user", "aborted:other"].map((key) => renderReasonCheckbox(key, REASON_LABEL_KEYS[key])),
							renderReasonCheckbox("pending", "reasonPending")
						)
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
						React.createElement("div", { style: style.hint }, t("clearDelayHint"))
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
						React.createElement("div", { style: style.hint }, t("workspaceDotHint"))
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
						React.createElement("div", { style: style.hint }, t("appBadgeHint")),
						// What THIS device is — never a claim about the platform.
						React.createElement("div", { style: style.hint }, t(appBadgeCapabilityKey(appBadgeProbe))),
						React.createElement("div", { style: style.hint }, t("appBadgeFootnote"))
					),
					React.createElement("div", { style: style.hint }, t("badgeTestHint"))
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
			// the list it opens still rides a slot — the frame-wide overlay, which
			// escapes the sidebar's clipping.
			//
			// 0.2.x has no `ctx.sessions.open(id)` (the ClientSessions service exposes
			// retain/using/retainInfo/refreshProjections/search/fork/scope/binding — no
			// navigation). Official code jumps to a session with
			// `ctx.uiWorkspace.openSession(id)` (ui-chat does exactly this), so the entry
			// is looked up optionally: navigation is best effort and must never make the
			// favicon half depend on the workspace UI being mounted.
			const openSession = (id) => {
				try { ctx.get("uiWorkspace")?.openSession(id); } catch { /* navigation is best effort */ }
			};
			// The injected node labels itself for screen readers, so it needs the
			// locale binder that only exists inside `apply()`.
			badgeT = t;
			ctx.slots.inject("shell.overlay", () => ctx.slots.register(
				{ name: "shell.overlay", id: "icon-custom-unread-popup", order: 30 },
				() => React.createElement(UnreadPopup, { t, onOpen: openSession })
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
				const unsubscribe = subscribeBadge((snapshot) => { applyBadgeToFavicon(snapshot.count, snapshot.size); });
				// Level-triggered on purpose: (re)applying this half must adopt the
				// value that is already on the bridge. The brand mark reads it at
				// mount; the tab icon has to be told, or a plugin hot-reload would
				// leave it restored (the old effect's cleanup) until the next change.
				applyBadgeToFavicon(effectiveCount(), badgeSize);
				return () => {
					unsubscribe();
					applyBadgeToFavicon(0);
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
				return () => {
					if (retry !== 0) window.clearInterval(retry);
					if (workspaceDotVerify !== 0) { window.clearTimeout(workspaceDotVerify); workspaceDotVerify = 0; }
					if (observer !== null) observer.disconnect();
					offDots();
					offConfig();
					clearWorkspaceDots();
					clearHeaderBadge();
				};
			}, "dsh-icon-custom: workspace dots");
			// The platform favicon.svg repaints itself for dark mode through
			// prefers-color-scheme; a composited bitmap cannot, so rebuild it.
			ctx.on("theme/change", () => { applyBadgeToFavicon(effectiveCount(), badgeSize); });
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
