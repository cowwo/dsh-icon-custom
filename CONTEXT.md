# dsh-icon-custom

一个 DSH 插件,让用户在设置页上传一张自定义标签页图标(SVG / PNG / ICO),替换浏览器的默认 favicon;上传后当前标签页立即生效,并跨刷新/重启保留。存储在每用户自己的 `$DSH_HOME` 下,面向“将来做成图标库”预留结构。

## Language

**自定义图标 (custom icon)**:
用户上传、覆盖平台默认 favicon 的那张图标。
_Avoid_: 图片、logo、上传的图

**平台默认图标 (platform default)**:
Web 应用自带、内置的 favicon;当没有生效的自定义图标时浏览器使用它。
_Avoid_: 默认图标、官方图标

**当前生效图标 (active icon)**:
标记“浏览器现在该用哪张自定义图标”的那条状态;“恢复默认”只清掉这个标记。
_Avoid_: 选中项、activeItem

**恢复默认 (reset)**:
清除“当前生效图标”标记,让浏览器回落到平台默认图标;磁盘上的图标文件**保留**,不删除。
_Avoid_: 清除、删除全部

**立即生效 (instant apply)**:
上传后当前已经打开的标签页图标立刻变化,不需要手动刷新页面。
_Avoid_: 下次刷新才变

**跨重启保留 (persist)**:
自定义图标在刷新页面、重开浏览器、重启 DSH 进程后仍然沿用。
_Avoid_: 临时、仅会话

**每用户独立 (per-user)**:
每台机器 / 每个用户各自一套自定义图标,存放在各自 `$DSH_HOME` 下,彼此不共享。
_Avoid_: 全局共用

**图标库存储 (icon storage)**:
`$DSH_HOME/custom-favicon/` 下,每个图标一个独立文件 + 一份索引;本轮只用其中一个槽,结构面向将来多图标预留。
_Avoid_: 缓存、临时目录

**图标库 (icon library)**:
将来用户保存多张图标、点击切换的集合概念;本轮**不做**,仅为它预留存储结构。
_Avoid_: 图库、历史记录

**格式魔数识别 (content sniffing)**:
根据文件内容的固定字节(而非文件扩展名或声明的 mime)判断真实格式,并容忍个别前导字节。SVG 同时做安全拦截。
_Avoid_: 按后缀判断、看 mime 判断

**PWA 安装图标 (PWA install icon)**:
网页「安装为应用 / 添加到主屏幕」后,桌面与启动器上显示的图标;由站点 web app manifest(`/manifest.webmanifest`)的 `icons` 数组决定,和标签页 favicon 是两回事。
_Avoid_: App 图标、桌面图标

**平台 manifest (platform manifest)**:
DSH 前端随发行版内置的 PWA 清单(`@deepseek-ai/dsh-web-frontend/dist/manifest.webmanifest`);未启用 PWA 选项时原样透传,启用时只改写其 `icons` 数组。
_Avoid_: manifest 文件、清单

**PWA 图标选项 (pwa option)**:
图标记录上的 `pwa` 标记(默认 false);为 true 时,当前生效图标同时替换平台 manifest 中的 PWA 安装图标。
_Avoid_: PWA 开关、pwaEnabled 状态

**apple-touch-icon**:
index.html 中针对 iOS「添加到主屏幕」的图标链接;iOS 只接受 PNG,不支持 SVG。
_Avoid_: 触摸图标

**页面 Logo 图标 (page logo mark)**:
网页界面左上角品牌 logo 里的鲸鱼图标(侧边栏 `sidebar.brand.mark` 席位);替换它不影响 `deepseek HARNESS` 文字。
_Avoid_: 顶部图、标题图标

**品牌文字 (brand name)**:
左上角 `deepseek HARNESS` 字样,与鲸鱼图标是两个独立席位;本插件只替换图标席位。
_Avoid_: 标题文字、logo 全称

**页面 Logo 选项 (logo option)**:
图标记录上的 `logo` 标记(默认 false);为 true 时,当前生效图标同时替换侧边栏品牌鲸鱼图标。
_Avoid_: logo 开关、logoEnabled 状态

**PNG 基准 (PNG baseline)**:
从上传的任意格式归一化出的一个可用 PNG 字节串(SVG 由浏览器 canvas 栅格化,ICO 由后端提取内嵌 PNG,PNG/JPEG 直接透传)。它是派生态和 PWA/logo 渲染的共同输入;`status.png` 为 true 时代表已有。
_Avoid_: 原图、源文件

**派生图 (derived icons)**:
后端用 Jimp 从 PNG 基准生成的 `library/<id>.derived/` 下的一组标准尺寸 PNG:`192`(`any`)、`512`(`any`)、`512-maskable`(不透明背景)、`apple-180`(180×180,不透明),用于安卓 manifest 条目与 iOS 触屏图标。
_Avoid_: 缩略图、裁剪图

**maskable 图标**:
PWA 清单里 `purpose: "maskable"` 的图标,Android 启动器会把它按设备密度裁成圆角/圆形;插件用不透明白底填充,确保裁剪干净。
_Avoid_: 圆形图标、自适应图标

**派生失败回退 (derivation fallback)**:
当某个图标无法被栅格化(如仅含 BMP 帧的老式 ICO)或 Jimp 解码出错时,不阻塞上传——记录 `derived: false`、`pngBaseline: null`,回退为「原样透传」,favicon 照常工作,仅多尺寸 PWA/logo 集合不生效。
_Avoid_: 报错、放弃

**未读红点 (unread badge)**:
**页内**红点:标签页图标、左上角 Logo、侧栏工作区/会话行上"有会话发生了事情、而你还没处理"的红底数字角标;数字是**会话数**而非事件数。与系统图标上的**应用图标角标**是同一个数字的两个投影。
_Avoid_: 通知数、消息数、待办数

**已读水位线 (seen watermark)**:
「这条会话我看过了」的标记,**真相在宿主**(`$DSH_HOME/custom-favicon/unread-seen.json`,`{ version, seen: { 会话id → endAt } }`):任何一台设备上看过,所有设备都不再提醒。每个浏览器保留一份**缓存兼离线队列**(localStorage),红点永远读本地那份,所以页面不等往返、断网照常工作;打开页面时把并集推回宿主一次(逐会话取 max、标记永不倒退),这同时就是迁移与自愈。水位线标的是"这个会话我上次看到什么时候";**进入会话并连续待满设置里的秒数**(默认 0 秒 = 进入即抬高)才抬高水位线,是"已处理"的判据。**计时由"进入会话"上弦,上弦那一刻的快照是固定的**:只承认进入时**已经存在**的那次结束;你人已经在会话里时又结束的那一轮**不上弦、也不追认**,只能等你切走再进来才消(0.11.1 起,见 ADR 0006)。中途切走会清零重数,刷新页面也重新数。水位线记的是**被确认的那次 `turn/end.endAt` 本身(宿主时钟)**,不是浏览器的 `Date.now()`——时间戳两边不同钟,红点就会永远清不掉。主视图同时保留多个会话时(切换会话的瞬间、或旧保留没释放),**每个会话各上各的弦**,不是只认第一个。
_Avoid_: 已读数据库、每台设备各一份已读

**结束原因 (turn-end reason)**:
官方 `turn/end` 的 `reason.kind`(`completed` / `error` / `blocked` / `max-tokens` / `interrupted` / `aborted`);`aborted` 再按取消来源拆成"我自己停止"与"其他中断"。设置页按这些项逐条勾选。
_Avoid_: 状态、结果类型

**数据来源 (number source)**:
红点数字的来源,`真实未读`(默认,官方事实折叠而来)或 `手动测试`(设置页手填,仅用于试看效果)。
_Avoid_: 模式、开关

**应用图标角标 (app icon badge)**:
操作系统层面的角标:Windows 任务栏按钮上的覆盖图标/系统徽章、macOS Dock 角标、安卓启动器圆点、iOS 主屏图标上的数字。它与页内红点**同值**,由设置里独立的开关控制。样子由浏览器/系统决定(Windows 上 Chrome 画深色圆 + 白字;Edge 走 Windows 系统徽章通道,是否显示数字由 Edge/Windows 决定),插件只能决定"设几"和"清空";它有一个低频看门狗会重设正向数字,但画成数字还是点最终仍由系统决定。
_Avoid_: 系统红点、桌面图标红点、badge 徽标

**角标投影 (badge projection)**:
把"未读数是几"换算成"这次该设数字、还是该清空"的那段**纯计算**;不碰浏览器、不发请求,所以能脱离页面直接测。
_Avoid_: 角标逻辑、badge 状态

**角标能力探测 (badge capability probe)**:
只回答本机此刻的三个事实——是不是安全上下文、有没有这个 API、是不是已安装的应用。它**不**回答"这个平台理论上支不支持",也**不**回答"角标会不会真的出现"(**探测到 API ≠ 角标会出现**:安卓与 Linux 上方法存在但静默无效,WebKit 上还额外要求通知权限)。通知权限是**另一个**探测(见下条),因为它要求一次用户手势,而且是活的。
_Avoid_: 平台支持检测、兼容性判断

**通知权限 (notifications permission)**:
本机此刻的通知授权读数(`granted` / `denied` / `default`,或"本机没有 Notification API"),只报本机事实。它是 **WebKit 角标的前置条件**(Apple 把角标权限绑在通知权限上),但 Chromium 的角标不需要它,所以它**不**参与"该不该调 `setAppBadge`"的判断——只是设置页上的一行读数加一个「允许通知」按钮(只在"还没问过"时出现)。它与角标能力探测分开,并且是**活的**:页面外的改动(系统设置、别的标签页的弹窗)会被订阅到;刚变成"已授予"时立刻把当前数字重设一遍。
_Avoid_: 通知开关、系统权限状态

**角标投递 (badge delivery)**:
角标是否真的出现在系统图标上——由操作系统决定,页面**无法探测**。所以能力探测只报本机事实,文案里固定带一句"是否真正显示由系统决定"。
_Avoid_: 角标生效、显示成功
