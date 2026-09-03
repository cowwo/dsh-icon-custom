# dsh-icon-custom

自定义 DSH 浏览器标签页图标(favicon):在设置页上传 SVG / PNG / ICO,立即生效并持久保存,刷新或重启后都保留。

零第三方运行时依赖。

## 安装

```sh
dsh plugin --profile web add dsh-icon-custom
```

带 scope 的包名:`@cowwo/dsh-icon-custom`。

## 使用

1. 打开**设置 → icon管理**。
2. 点击**上传图标**,选择 SVG、PNG 或 ICO(最大 10 MB)。
3. 当前标签页图标立即替换;文件会保存到 `$DSH_HOME/custom-favicon/`。
4. 点击**恢复默认**清除自定义图标,回到平台默认图标。

## PWA 安装图标

勾选**同时替换 PWA 安装图标**(勾选状态按图标记录保存),网页「安装为应用 / 添加到主屏幕」后,桌面和启动器上的图标也会换成你上传的这张。插件会把 `/manifest.webmanifest` 的 icons 项改写为你的图标(SVG 标注 `sizes: "any"`,PNG 按真实尺寸标注,ICO 取第一条目尺寸);在 iPhone/iPad 上还会把 `<link rel="apple-touch-icon">` 指向你的图标——但这只在你的图标是 **PNG** 时有效(iOS 不支持 SVG 触屏图标)。

![同时替换 PWA 安装图标选项](./docs/pwa-option.png)

把网页「安装为应用」时,浏览器弹出的安装对话框也会显示你的图标:

![PWA 安装对话框](./docs/install-dialog.png)

## 页面 Logo 图标

勾选**同时替换页面 Logo 图标**,网页左上角品牌 logo 里的**鲸鱼图标**就会换成你上传的这张——`deepseek HARNESS` 文字不受影响。选项关闭时显示官方鲸鱼;改动立即生效,刷新/重启都保留。

说明:

- 该选项**默认不勾选**。
- 上传后随时可以勾选/取消,不用重新上传文件。
- 只影响侧边栏的品牌图标(deepseek HARNESS 旁边那只);PWA 安装图标是上面的另一个选项。

说明:

- 该选项**默认不勾选**:不勾选时行为与之前完全一致,平台 manifest 原样透传。
- 上传后随时可以勾选/取消,不用重新上传文件。
- 浏览器按自己的节奏重新检查 manifest;**已经安装**的应用通常要等重新安装(或浏览器下一次 manifest 更新读到新的 `src`)才会换图标。
- PWA 图标推荐上传 **PNG**(桌面 / 启动器图标通常会被栅格化);复用同一张上传图,不重新编码。

## 支持的格式

- **SVG** — 按内容(`<svg`)识别,并拦截 `<script>` / 事件属性 / `javascript:` 注入。
- **PNG** — 按魔数识别(容忍部分优化器产生的前导字节),并校验 IHDR → … → IEND 结构。
- **ICO / CUR** — CUR 当作 ICO 接受。

图标文件**原样保存,不重新编码**,因此透明背景和画质都不会损失。

## 持久化

图标按用户保存在 `$DSH_HOME/custom-favicon/`。**恢复默认**只清除当前生效标记,已保存的文件会保留,为将来的图标库 UI 做准备。

## 许可证

MIT
