# dsh-favicon-custom

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
