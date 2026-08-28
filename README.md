# dsh-icon-custom

Customize the browser tab icon (favicon) for DSH: upload an SVG / PNG / ICO from the settings page, it applies instantly and persists across reloads and restarts.

Zero third‑party runtime dependencies.

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

## Format support

- **SVG** — recognized by content (`<svg`), validated against script / event‑handler / `javascript:` injection.
- **PNG** — recognized by magic bytes (tolerates a stray leading byte some optimizers emit), structurally checked to IHDR → … → IEND.
- **ICO / CUR** — CUR is accepted as ICO.

Files are stored verbatim (never re‑encoded), so transparency and quality are preserved.

## Persistence

Icons are stored per‑user under `$DSH_HOME/custom-favicon/`. "Reset" only clears the active marker; stored files are kept for a future icon‑library UI.

## License

MIT
