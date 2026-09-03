# PWA 图标通过「精确路由覆盖 manifest」实现,而非另存一份

## Status

accepted

## Context

要让上传的图标同时成为 PWA 安装图标,必须改站点的 web app manifest(`/manifest.webmanifest`,由 `@deepseek-ai/dsh-web-frontend/dist/` 提供):浏览器安装应用时从它读取 `icons` 数组。选择实现方式时考虑:平台 manifest 的字段(id/name/short_name/start_url/scope/display)会随发行版演进,复制一份在自己的包里会过期;而未启用该选项时,manifest 必须与平台完全一致,不能有任何副作用。

## Decision

插件在启动时注册 `dsh-host-webserver` 的**精确路由** `/manifest.webmanifest`。`dsh-host-webserver` 的匹配顺序是 exact 表 → prefix 表 → fallback(静态 dist 服务),所以该路由优先于静态文件,无需改动任何平台文件。路由行为:

- 未启用 PWA 选项 → 返回平台 manifest 的**原始字节**(启动时通过 `createRequire` 解析 `@deepseek-ai/dsh-web-frontend/dist/manifest.webmanifest` 读取并缓存),对平台完全透明;
- 启用 PWA 选项 → 在缓存的平台 manifest 副本上仅替换 `icons` 数组,指向 `/icon-custom.svg?v=<rev>`,其余字段保持平台原样。

`createRequire` 解析失败时(如在 harness node_modules 之外开发)回退到与当前平台 manifest 内容一致的常量。

## Consequences

- 平台 manifest 字段变化后插件自动跟随,不需要发版维护;
- 未启用选项时 HTTP 行为与平台静态服务等同(仅多了 `cache-control: no-cache`,便于启用后尽快生效);
- 需要精确路由与平台静态文件路径一致,若未来平台在别的路径提供 manifest,需要同步更新;
- 回退常量是 duplicative 的:平台 manifest 变更后若插件运行在解析失败环境,会落后于真实平台内容(仅影响开发环境)。
