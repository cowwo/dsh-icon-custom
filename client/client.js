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
			workspaceDotLabel: "在工作区和会话行上显示红点(实验)",
			workspaceDotHint: "在侧栏工作区那一行的文件夹图标上点一个小红点。这一项是贴着页面结构做的,DSH 升级后可能失效;失效时只会变成\"不显示\",不会影响红点数字、清单、跳转这些功能,随时可以关掉它。",
			badgeTestHint: "真实未读 = 有会话发生了上面勾选的情况、而且你还没看过它(打开该会话即视为已读)。正在看的会话和子代理不计。手动模式:自己填数字试看效果。刷新页面后回到真实未读。"
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
			workspaceDotLabel: "Dots on workspace and session rows (experimental)",
			workspaceDotHint: "Adds a small red dot to the folder icon of each workspace row. This one reads the page structure, so a DSH upgrade may break it; when it does it simply stops showing, never affecting the counts, the list, or navigation. Turn it off any time.",
			badgeTestHint: "Real unread = a session ended for one of the checked reasons and you have not looked at it yet (opening a session marks it read). The session you are viewing and sub-agents never count. Manual = type a number to preview. Resets to Real on reload."
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
		let unreadConfig = { reasons: { ...UNREAD_FALLBACK_REASONS }, pending: true, workspaceDot: true };
		const unreadConfigListeners = new Set();
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
				workspaceDot: typeof source.workspaceDot === "boolean" ? source.workspaceDot : true
			};
		}
		function emitUnreadConfig(input) {
			unreadConfig = normalizeUnreadConfig(input);
			unreadConfigListeners.forEach((fn) => { try { fn(unreadConfig); } catch {} });
		}
		function subscribeUnreadConfig(fn) {
			unreadConfigListeners.add(fn);
			return () => { unreadConfigListeners.delete(fn); };
		}

		const SEEN_STORE_KEY = "dsh-icon-custom.unread-seen.v1";
		const SEEN_MAX = 400;
		function loadSeenState() {
			try {
				const raw = JSON.parse(window.localStorage.getItem(SEEN_STORE_KEY) || "null");
				if (raw === null || typeof raw !== "object") return { lastActiveAt: 0, seen: {} };
				const seen = raw.seen !== null && typeof raw.seen === "object" ? raw.seen : {};
				return { lastActiveAt: typeof raw.lastActiveAt === "number" ? raw.lastActiveAt : 0, seen };
			} catch { return { lastActiveAt: 0, seen: {} }; }
		}
		const seenState = loadSeenState();
		/** When this browser last had the app open before this page load. */
		const seenBootAt = seenState.lastActiveAt > 0 ? seenState.lastActiveAt : 0;
		function saveSeenState() {
			try { window.localStorage.setItem(SEEN_STORE_KEY, JSON.stringify(seenState)); } catch {}
		}
		function pruneSeenState() {
			const ids = Object.keys(seenState.seen);
			if (ids.length <= SEEN_MAX) return;
			ids.sort((a, b) => seenState.seen[b] - seenState.seen[a]);
			for (const id of ids.slice(SEEN_MAX)) delete seenState.seen[id];
		}
		/** Record that this browser is looking at a session right now. */
		function noteSeen(sessionId) {
			if (typeof sessionId !== "string" || sessionId === "") return false;
			seenState.seen[sessionId] = Date.now();
			return true;
		}
		/**
		 * First sight of a session is watermarked at the last time this browser was
		 * here — so an ending that happened while the app was closed still counts as
		 * unread, while endings from before the plugin was installed do not.
		 * @returns whether anything was learned (callers persist only then).
		 */
		function ensureSeenBaseline(ids) {
			const fallback = seenBootAt > 0 ? seenBootAt : Date.now();
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
		 * The session the main view is showing.
		 *
		 * DSH 0.2.x carries NO `current` field in the session-list snapshot — it is
		 * written with exactly `ids` / `byId` / `phase` / `projectionsBySession`. The
		 * official signal is the row's `retainedBy.mainView` retention count, the same
		 * one ui-layout's DocumentTitle, ui-cordis, ui-open-in-app and ui-session read.
		 * Reading `list.current` here made `noteSeen()` a no-op, so the seen watermark
		 * never advanced and an unread dot could never be cleared by opening the
		 * session. Runtimes that do expose `current` are still honoured first.
		 * @param list - the session list snapshot (may be absent).
		 * @returns the id being viewed, or undefined.
		 */
		function currentSessionId(list) {
			if (list === null || typeof list !== "object") return undefined;
			if (typeof list.current === "string" && list.current !== "") return list.current;
			const byId = list.byId;
			if (byId === null || typeof byId !== "object") return undefined;
			for (const session of Object.values(byId)) {
				if (session === null || typeof session !== "object") continue;
				const retainedBy = session.retainedBy;
				const count = retainedBy !== null && typeof retainedBy === "object" ? retainedBy.mainView : undefined;
				if (typeof count === "number" && count > 0) return session.id;
			}
			return undefined;
		}
		/**
		 * How many sessions deserve the badge right now: endings whose reason is
		 * enabled and that this browser has not seen since, plus sessions waiting
		 * for you (when that source is enabled). Sub-agent sessions and the session
		 * you are looking at never count.
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
			const current = currentSessionId(list);
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
					if (id === current) continue;
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
						if (id === current) return;
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
		function toggleUnreadPanel(anchor) {
			emitUnreadPanel(!unreadPanelOpen, anchor === undefined ? null : anchor);
		}
		/**
		 * Roll the pending sessions up to one dot per workspace.
		 *
		 * Pure: `titles` maps sessionId → the workspace title the sidebar shows
		 * (assembled from the official workspace snapshot); a session missing from it
		 * falls back to the cwd basename `collectUnread` already carries.
		 * @returns `[{ name, count }]`, busiest workspace first.
		 */
		function dotsFromItems(items, titles) {
			const counts = new Map();
			for (const item of Array.isArray(items) ? items : []) {
				if (item === null || typeof item !== "object") continue;
				const mapped = titles !== null && typeof titles === "object" ? titles[item.id] : undefined;
				const name = typeof mapped === "string" && mapped !== "" ? mapped : (typeof item.where === "string" ? item.where : "");
				if (name === "") continue;
				counts.set(name, (counts.get(name) || 0) + 1);
			}
			return [...counts.entries()]
				.map(([name, count]) => ({ name, count }))
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
				const wantedNames = new Set(wanted.map((entry) => entry.name));
				const wantedIds = new Set(wantedRows.map((entry) => entry.id));
				document.querySelectorAll("[" + WS_DOT_ATTR + "]").forEach((node) => {
					if (!node.isConnected || !wantedNames.has(node.getAttribute(WS_DOT_ATTR))) node.remove();
				});
				document.querySelectorAll("[" + ROW_DOT_ATTR + "]").forEach((node) => {
					if (!node.isConnected || !wantedIds.has(node.getAttribute(ROW_DOT_ATTR))) node.remove();
				});
				if (container === null) { workspaceDotPainting = false; return; } // start-up race
				for (const entry of wanted) {
					const label = labelElementFor(container, entry.name);
					const target = label === null ? null : markerTargetFor(label);
					if (target === null) { missed++; continue; }
					const row = target.row;
					if (existingMarker(row, WS_DOT_ATTR, entry.name) !== null) { placed++; continue; }
					const icon = target.icon;
					const rowRect = row.getBoundingClientRect();
					const anchorRect = icon.getBoundingClientRect();
					if (window.getComputedStyle(row).position === "static") {
						workspaceDotRestores.push({ el: row, position: row.style.position });
						row.style.position = "relative";
					}
					const dot = document.createElement("span");
					dot.setAttribute(WS_DOT_ATTR, entry.name);
					dot.setAttribute("aria-hidden", "true");
					dot.title = entry.name + " · " + entry.count;
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
					const label = labelElementFor(container, entry.title);
					const target = titleTargetFor(label, entry.title);
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
			// Looking at a session marks it seen; the count also excludes it outright.
			const currentId = currentSessionId(list);
			React.useEffect(() => {
				if (noteSeen(currentId)) saveSeenState();
			}, [currentId]);
			const items = collectUnread(list, pending, config, seenState.seen);
			const count = items.length;
			React.useEffect(() => { emitRealBadge(count, items); }, [count, items]);
			// The workspace rows are labelled with the workspace TITLE, which is not
			// always the cwd basename, so map session → title from the official snapshot.
			React.useEffect(() => {
				const titles = {};
				const list = workspaces !== null && typeof workspaces === "object" && Array.isArray(workspaces.items) ? workspaces.items : [];
				for (const workspace of list) {
					if (workspace === null || typeof workspace !== "object") continue;
					const title = typeof workspace.title === "string" ? workspace.title : "";
					if (title === "" || !Array.isArray(workspace.sessionIds)) continue;
					for (const id of workspace.sessionIds) titles[id] = title;
				}
				emitSidebarMarks({
					workspaces: dotsFromItems(items, titles),
					sessions: items.map((item) => ({ id: item.id, title: item.title }))
				});
			}, [items, workspaces]);
			return null;
		}

		/**
		 * The sidebar-foot entry: a bell carrying the unread count, beside the
		 * shipped Settings and Cordis buttons. Both that seat and the overlay list
		 * are additive (`replaceRisk: none`) — a fresh id is added beside the others,
		 * nothing shipped is shadowed.
		 */
		function UnreadFooterButton(props) {
			const [snapshot, setSnapshot] = React.useState(badgeSnapshot);
			const [open, setOpen] = React.useState(unreadPanelOpen);
			const ref = React.useRef(null);
			React.useEffect(() => subscribeBadge(setSnapshot), []);
			React.useEffect(() => subscribeUnreadPanel(() => setOpen(unreadPanelOpen)), []);
			const t = props.t;
			const count = snapshot.count;
			const wide = props.wide !== false;
			const label = count > 0 ? t("unreadPanelCount").replace("{n}", String(count)) : t("unreadPanelNone");
			const onClick = () => {
				const node = ref.current;
				const rect = node !== null && typeof node.getBoundingClientRect === "function" ? node.getBoundingClientRect() : null;
				toggleUnreadPanel(rect === null ? null : { left: rect.left, top: rect.top });
			};
			return React.createElement("button", {
				ref, type: "button", onClick, title: label, "aria-label": label, "aria-expanded": open,
				style: {
					position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px",
					height: "32px", width: wide ? "auto" : "32px", padding: wide ? "0 10px" : "0",
					border: "1px solid var(--dsw-alias-border-l2)", borderRadius: "8px", background: "transparent",
					color: "var(--dsw-alias-label-primary)", cursor: "pointer", font: "inherit", fontSize: "12px",
					opacity: count > 0 ? 1 : 0.55
				}
			},
				React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", style: { flex: "none" } },
					React.createElement("path", { d: "M8 2.2a3.6 3.6 0 0 0-3.6 3.6v2.4L3.2 11h9.6l-1.2-2.8V5.8A3.6 3.6 0 0 0 8 2.2Z", stroke: "currentColor", strokeWidth: 1.3, strokeLinejoin: "round" }),
					React.createElement("path", { d: "M6.4 12.8a1.6 1.6 0 0 0 3.2 0", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" })
				),
				wide ? React.createElement("span", null, t("unreadPanelShort")) : null,
				count > 0 ? React.createElement("span", {
					"aria-hidden": "true",
					style: { position: "absolute", top: "-6px", right: "-6px", minWidth: "16px", height: "16px", padding: "0 4px", boxSizing: "border-box", borderRadius: "999px", background: "#e5484d", color: "#fff", fontSize: "10px", fontWeight: 700, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", fontVariantNumeric: "tabular-nums", pointerEvents: "none" }
				}, badgeLabel(count)) : null
			);
		}

		/**
		 * The list behind that number, in the frame-wide overlay layer so it escapes
		 * the sidebar's clipping and scroll container. Clicking a row opens that
		 * session — which is also what marks it read.
		 */
		function UnreadPopup(props) {
			const [snapshot, setSnapshot] = React.useState(badgeSnapshot);
			const [open, setOpen] = React.useState(unreadPanelOpen);
			React.useEffect(() => subscribeBadge(setSnapshot), []);
			React.useEffect(() => subscribeUnreadPanel(() => setOpen(unreadPanelOpen)), []);
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
			const style = {
				position: "fixed", left: "12px", bottom: "52px", zIndex: 60, pointerEvents: "auto",
				minWidth: "240px", maxWidth: "340px", padding: "8px", borderRadius: "12px",
				border: "1px solid var(--dsw-alias-border-l2)", background: "var(--dsw-alias-bg-layer-1)",
				boxShadow: "0 10px 30px rgba(0,0,0,.18)", color: "var(--dsw-alias-label-primary)", fontSize: "12px"
			};
			if (anchor !== null && typeof anchor === "object") {
				style.left = Math.max(8, Math.round(anchor.left)) + "px";
				style.bottom = Math.max(8, Math.round(window.innerHeight - anchor.top + 6)) + "px";
			}
			const items = Array.isArray(snapshot.items) ? snapshot.items : [];
			return React.createElement("div", { "data-icon-custom-unread": "1", style },
				React.createElement("div", { style: { fontWeight: 600, padding: "2px 6px 8px" } }, t("unreadPanelTitle")),
				items.length === 0
					? React.createElement("div", { style: { padding: "2px 6px 8px", opacity: 0.7 } }, t("unreadPanelEmpty"))
					: React.createElement("div", { style: { display: "flex", flexDirection: "column", maxHeight: "320px", overflowY: "auto" } },
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
								React.createElement("span", { style: { display: "block", opacity: 0.6, fontSize: "11px" } }, item.waiting === true ? t("unreadWaiting") : t("unreadEnded"))
							))
						))
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
			// Toggle one unread reason. Applies locally at once; the host keeps the
			// durable copy so the rule survives a restart and other browsers.
			const onUnreadToggle = React.useCallback((key, checked) => {
				const current = unreadConfig;
				const reasons = Object.assign({}, current.reasons);
				let pending = current.pending;
				if (key === "pending") pending = checked;
				else reasons[key] = checked;
				const next = normalizeUnreadConfig({ reasons, pending, workspaceDot: current.workspaceDot });
				emitUnreadConfig(next);
				rpc.call("/api", "iconCustom/setUnreadRule", {
					args: { request: { reasons: next.reasons, pending: next.pending, workspaceDot: next.workspaceDot } }
				}).catch(() => {});
			}, [rpc]);
			// The fuse for the one fragile piece (see the workspace-dots region).
			const onWorkspaceDotToggle = React.useCallback((checked) => {
				const next = normalizeUnreadConfig({ reasons: unreadConfig.reasons, pending: unreadConfig.pending, workspaceDot: checked });
				emitUnreadConfig(next);
				rpc.call("/api", "iconCustom/setUnreadRule", {
					args: { request: { reasons: next.reasons, pending: next.pending, workspaceDot: next.workspaceDot } }
				}).catch(() => {});
			}, [rpc]);
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
			// Pull the host state once, so the brand mark and the badge are correct
			// before the settings section is ever opened. The unread rule rides its
			// own endpoint: the icon RPCs keep their pre-badge response shape.
			rpc.call("/api", "iconCustom/getStatus", { args: {} })
				.then((resp) => { if (resp && resp.ok === true) syncStatus(resp.value); })
				.catch(() => {});
			rpc.call("/api", "iconCustom/getUnreadRule", { args: {} })
				.then((resp) => { if (resp && resp.ok === true) emitUnreadConfig(resp.value); })
				.catch(() => {});
			// Keep "the last moment this browser was here" fresh, so an ending that
			// happens while the app is closed still counts as unread when you return.
			ctx.effect(() => {
				const touch = () => { seenState.lastActiveAt = Date.now(); saveSeenState(); };
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

			// Additive seats for "where exactly?" — a foot entry beside the shipped
			// Settings/Cordis buttons, and the frame-wide overlay for its list. A fresh
			// id is added beside the others; nothing shipped is shadowed.
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
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register(
				{ name: "sidebar.footer.action", id: "icon-custom-unread", order: 20, label: () => t("unreadPanelShort") },
				(props) => React.createElement(UnreadFooterButton, { ...props, t, onOpen: openSession })
			));
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
				const interval = window.setInterval(reconcileFavicon, 5000);
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
					window.setTimeout(() => { queued = false; paintWorkspaceDots(); }, 200);
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
