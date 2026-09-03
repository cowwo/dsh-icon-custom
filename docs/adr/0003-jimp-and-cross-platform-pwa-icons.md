# 用 Jimp + 浏览器 canvas 自动派生跨平台 PWA 图标,SVG/ICO 先归一化成 PNG

## Status

accepted

## Context

v0.5.x 时 PWA 图标是「原样透传」:manifest 的 `icons` 只指向用户上传的原始文件(`/icon-custom.svg`),`apple-touch-icon` 只在源是 PNG 时生效。实测发现安卓 Edge「添加至主屏幕」后图标是**空白灰块**,原因是用户上传的是 2048×2048、2.3MB 的 PNG——安卓启动器通常只正确渲染标准尺寸(192/512),超大、超重的图标容易退化。

要「一份上传图同时适配安卓 / iOS / 平板」,必须:

1. 为安卓生成标准尺寸(192、512)且带 `maskable` 版本;
2. 为 iOS 生成 180×180 **不透明** PNG(`apple-touch-icon` 只认 PNG,且不接受透明图);
3. 支持 SVG / ICO 上传时也能出这些规格。

实现方式需要选一个栅格化/缩放引擎。候选:原生二进制(sharp,靠 libvips,能读 SVG、性能好)、纯 JS(jimp)。选型约束是这个插件运行在 DSH 严格的 pnpm 供应链环境里,且是发给他人安装的插件——原生二进制容易触发 `allowBuilds` 拦截和平台专用二进制下载问题。

## Decision

### 依赖:Jimp,j并进 `dependencies`
- 用 **Jimp**(纯 JS,无原生二进制、无构建脚本)作为 `dependencies`,插件**自带** jimp,不依赖宿主是否已装。
- 理由:jimp 无 `postinstall` / `gypfile` / 原生依赖,不会触发 DSH 的供应链构建放行;`jimp@1.6.1` 已发布很久,不会踩 `minimumReleaseAge`。代价是放弃「零依赖」卖点,体积 +3.3MB,以及 jimp **不能读 SVG**。

### SVG:浏览器 canvas 栅格化,而非 jimp
- SVG 在**客户端**用 `Image` + `canvas` 画到 512×512,`toDataURL('image/png')` 转成 PNG base64 再传给后端。
- 理由:浏览器可靠地渲染 SVG;jimp 读不了 SVG。这是让 jimp「支持 SVG」的正确接缝。
- 转出的 PNG 画到白底(不透明),同时为 iOS 触屏图标铺垫。

### ICO:后端提取内嵌 PNG,而非浏览器
- ICO 在**后端**解析目录(6 字节头 + 16 字节条目),取第一条内嵌的 PNG 图像作为栅格化基准。
- 理由:浏览器 `<img>` / canvas **不可靠地**渲染 `.ico`(Chrome/Firefox 的 `Image` 常不把 ico 当作可绘制图像,`drawImage` 会失败),所以不能走客户端的 canvas 路线,只能在后端字节级提取。仅含 BMP 帧的老式 ICO 无法栅格化,回退为原样透传。

### 派生态
- 后端用 jimp 从栅格化基准生成 `library/<id>.derived/` 下的四张 PNG:`192`(`any`)、`512`(`any`)、`512-maskable`(不透明背景)、`apple-180`(180×180,不透明)。
- `maskable` / `apple` 用白色画布 `composite` 填充成不透明,确保安卓启动器裁剪干净、iOS 显示实心磁贴。
- manifest 的 `icons` 改为这三条(any/any/maskable),`apple-touch-icon` 指向 `apple-180.png`。
- favicon / logo 渲染也优先用 `192.png`,避免超大原图在部分环境下崩溃。

### 兜底
- 任何派生失败(不可解码、BMP-only ICO、jimp 异常)都**不阻塞**:记录 `derived: false`,`pngBaseline: null`,回退到「原样透传」——favicon 照常工作,只是多尺寸 PWA/logo 集合不生效。
- 旧版本已存在、无派生目录的记录在 `_load` 时**懒派生**,失败保持 `derived: false`。

## Consequences

- 一份上传图即可在安卓、iOS、平板得到正确图标,不再出现空白灰块;
- SVG、ICO(含 PNG 内嵌)都能自动归一化出可用 PNG;
- 插件现有 `jimp` 依赖,不再是零依赖;安装体积增加约 3.3MB(纯 JS,无原生坑);
- jimp 不能解码 SVG 的短板由「浏览器 canvas 栅格化」补上,但需要一次额外的客户端转换(有 `Image` + `canvas` 开销,低频上传可接受);
- ICO 若只含 BMP 帧(老式),无法自动转换,回退透传;这也是唯一无法覆盖的格式边界;
- 新增 `status.png` 布尔字段,客户端据此决定 favicon/logo 用派生 PNG 还是原图。
