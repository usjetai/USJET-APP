# Developer pages — logos, badges, vectors (JPEG)

Raster exports from **builder / developer surfaces only** — not the full site brand pack.

## Pages covered

| Route | Folder |
|-------|--------|
| `/code-kit` | `code-kit/` |
| `/landscape` | `landscape/` |
| `/sovereignty` | `sovereignty/` |
| `/ai-101` | `ai-101/` |
| `/protocol-proof` | `protocol-proof/` |
| `/b2k` | `b2k/` |

## What is exported

Only three asset types per page:

- **logos** — marks, icon locks, code-access chips
- **badges** — page badges, curriculum pills, protocol swatches
- **vectors** — inline SVG / hero airframe / package icons

Buttons and full-page screenshots are **not** included.

## Regenerate

```bash
npm run export:developer-pages-jpegs
```

Requires a local dev server spin-up (script starts Vite on port `5183`) and Playwright Chromium (see repo `.playwright-browsers` or `npx playwright install chromium`).

Config source: `src/data/developerPagesExport.ts`
