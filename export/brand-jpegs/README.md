# USJET brand JPEG exports

Raster exports of logos, buttons, badges, and vector marks from the sovereign cockpit codebase.

**Regenerate:** from repo root:

```bash
npm run export:brand-jpegs
```

If Playwright capture fails on first run:

```bash
npx playwright install chromium
```

**Includes:** stone wordmark (nav + hero), glass buttons, member prime badges, fleet capability badges, sovereign star (default + steel), ten aircraft silhouettes, founder worker wireframes, gaming key + VR marks, Zelle mark, public favicons, and founder hero logo.

See `manifest.json` for the file list and generation timestamp.
