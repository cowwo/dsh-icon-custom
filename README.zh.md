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

## 支持的格式

- **SVG** — 按内容(`<svg`)识别,并拦截 `<script>` / 事件属性 / `javascript:` 注入。
- **PNG** — 按魔数识别(容忍部分优化器产生的前导字节),并校验 IHDR → … → IEND 结构。
- **ICO / CUR** — CUR 当作 ICO 接受。

图标文件**原样保存,不重新编码**,因此透明背景和画质都不会损失。

## 持久化

图标按用户保存在 `$DSH_HOME/custom-favicon/`。**恢复默认**只清除当前生效标记,已保存的文件会保留,为将来的图标库 UI 做准备。

## 许可证

MIT
