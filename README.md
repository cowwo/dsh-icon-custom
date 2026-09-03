# dsh-icon-custom

Customize the browser tab icon (favicon) for DSH: upload an SVG / PNG / ICO / JPEG from the settings page, it applies instantly and persists across reloads and restarts. From 0.7.0 the PWA / logo path derives the canonical icon sizes automatically so the same upload works on Android, iOS and tablets.

Pure-JS dependency (`jimp`) — no native binaries, so it installs cleanly under pnpm's supply-chain policy.

## Install

```sh
dsh plugin --profile web add dsh-icon-custom
```

Scoped name: `@cowwo/dsh-icon-custom`.

## Usage

1. Open **Settings → icon管理**.
2. Click **上传图标** and pick an SVG, PNG or ICO (up to 10 MB).
3. The current tab icon changes immediately; it is persisted under `$DSH_HOME/custom-favicon/`.
4. Click **恢复默认** to clear the custom icon and fall back to the platform favicon.

## PWA install icon

Tick **同时替换 PWA 安装图标** (checked state is remembered per icon) to also replace the icon of the installed PWA — the icon used on the desktop / home screen after the site is installed as an app. The plugin rewrites the `/manifest.webmanifest` icons entry to a canonical derived PNG set: **192×192 `any`**, **512×512 `any`**, and a **512×512 `maskable`** variant (opaque background) so Android launchers crop cleanly. For iPhones/iPads a `<link rel="apple-touch-icon">` points at a derived **180×180 opaque PNG** (iOS ignores SVG touch-icons and transparent images).

SVG is rasterized to a 512×512 PNG in the browser before upload, and ICO has its embedded PNG extracted server-side, so any format produces a usable cross-platform icon. A derivation failure falls back to serving the original upload. A well-prepared **512×512 PNG** gives the best results.

The option is **off by default**: without it, behavior is identical to before and the platform manifest is served verbatim. Browsers re-check the manifest on their own schedule, so an **already-installed** PWA usually keeps its old icon until you re-install it (or the browser picks up the new `src` on its next manifest fetch).

![PWA install icon option](./docs/pwa-option.png)

When the site is installed as an app, the browser's install dialog picks the custom icon up:

![PWA install dialog](./docs/install-dialog.png)

## Page logo mark

Tick **同时替换页面 Logo 图标** to also replace the whale mark at the top-left of the DSH page — the mark beside the `deepseek HARNESS` brand name. The brand **text is untouched**; the mark falls back to the official whale while the option is off. The change applies instantly and persists across reloads/restarts.

Notes:

- The option is **off by default**.
- It can be toggled at any time after upload — no re-upload needed.
- This only affects the sidebar brand mark (the one next to `deepseek HARNESS`); PWA/installed-app icons are a separate option above.

## Format support

- **SVG** — recognized by content (`<svg`), validated against script / event‑handler / `javascript:` injection. Rasterized to PNG in the browser before upload.
- **PNG** — recognized by magic bytes (tolerates a stray leading byte some optimizers emit), structurally checked to IHDR → … → IEND.
- **ICO / CUR** — CUR is accepted as ICO. Its embedded PNG is extracted server-side; a BMP-only ICO is not rasterizable and falls back to the original.
- **JPEG** — accepted as-is and treated as a raster baseline.

The uploaded file is stored verbatim (never re‑encoded) so the favicon keeps its transparency and quality; the derived PWA / logo PNG set is generated separately from it.

## Persistence

Icons are stored per‑user under `$DSH_HOME/custom-favicon/`. "Reset" only clears the active marker; stored files are kept for a future icon‑library UI.

## License

MIT
