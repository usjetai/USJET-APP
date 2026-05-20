/**
 * Export USJET logos, badges, buttons, and vector marks as JPEGs.
 * Output: export/brand-jpegs/
 *
 * Usage: npm run export:brand-jpegs
 */
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const LOCAL_PLAYWRIGHT = join(ROOT, ".playwright-browsers");
if (existsSync(LOCAL_PLAYWRIGHT)) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = LOCAL_PLAYWRIGHT;
}
const OUT_DIR = join(ROOT, "export", "brand-jpegs");
const ASSETS_DIR = join(__dirname, "brand-export", "assets");
const CAPTURE_HTML = join(__dirname, "brand-export", "capture.html");
const BG = { r: 2, g: 6, b: 23 };

const STROKE =
  'fill="none" stroke="white" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"';

function wrapAircraftSvg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-hidden="true"><g>${inner}</g></svg>`;
}

function wrapWorkerSvg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-hidden="true"><g>${inner}</g></svg>`;
}

/** Inline vector marks mirrored from src/components (fleet + brand). */
const GENERATED_SVGS = {
  "usjet-star-emblem-default": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="g" x1="12" y1="8" x2="108" y2="112" gradientUnits="userSpaceOnUse"><stop stop-color="#22d3ee"/><stop offset="0.45" stop-color="#fbbf24"/><stop offset="1" stop-color="#06b6d4"/></linearGradient></defs><polygon points="60,6 74,42 112,42 82,64 92,102 60,80 28,102 38,64 8,42 46,42" fill="url(#g)"/><circle cx="60" cy="58" r="8" fill="rgba(2,8,23,0.55)" stroke="rgba(103,232,249,0.45)" stroke-width="1.5"/></svg>`,
  "usjet-star-emblem-steel": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="gs" x1="12" y1="8" x2="108" y2="112" gradientUnits="userSpaceOnUse"><stop stop-color="#94a3b8"/><stop offset="0.45" stop-color="#e2e8f0"/><stop offset="1" stop-color="#64748b"/></linearGradient></defs><polygon points="60,6 74,42 112,42 82,64 92,102 60,80 28,102 38,64 8,42 46,42" fill="url(#gs)"/><circle cx="60" cy="58" r="8" fill="rgba(2,8,23,0.55)" stroke="rgba(148,163,184,0.55)" stroke-width="1.5"/></svg>`,
  "ai101-partner-stars": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 120"><defs><linearGradient id="h" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="rgba(251,191,36,0.95)"/><stop offset="100%" stop-color="rgba(245,158,11,0.7)"/></linearGradient><linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="rgba(34,211,238,0.95)"/><stop offset="100%" stop-color="rgba(6,182,212,0.75)"/></linearGradient></defs><path d="M 70 28 L 78 52 L 104 52 L 83 66 L 91 92 L 70 78 L 49 92 L 57 66 L 36 52 L 62 52 Z" fill="url(#h)"/><path d="M 210 28 L 218 52 L 244 52 L 223 66 L 231 92 L 210 78 L 189 92 L 197 66 L 176 52 L 202 52 Z" fill="url(#a)"/><path d="M 108 60 Q 140 42 172 60" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" stroke-dasharray="4 6"/><circle cx="140" cy="48" r="3" fill="rgba(255,255,255,0.35)"/></svg>`,
  "aircraft-sr71": wrapAircraftSvg(`<path ${STROKE} d="M40 5 Q38.5 37.5 40 70 Q41.5 37.5 40 5"/><path ${STROKE} d="M40 14 C32 22 8 46 4 54 L18 58 L40 42 L62 58 L76 54 C72 46 48 22 40 14 Z"/><path ${STROKE} d="M40 14 L40 42"/><ellipse ${STROKE} cx="22" cy="44" rx="4.2" ry="6"/><ellipse ${STROKE} cx="58" cy="44" rx="4.2" ry="6"/><path ${STROKE} d="M36 66 L40 74 L44 66"/><path ${STROKE} d="M20 50 L12 54 M60 50 L68 54"/>`),
  "aircraft-f22": wrapAircraftSvg(`<path ${STROKE} d="M40 7 Q38.5 36.5 40 66 Q41.5 36.5 40 7"/><path ${STROKE} d="M40 16 L6 44 L22 50 L40 38 L58 50 L74 44 Z"/><path ${STROKE} d="M34 62 L40 72 L46 62"/><path ${STROKE} d="M18 42 L8 48 M62 42 L72 48"/><path ${STROKE} d="M35 24 L45 24"/>`),
  "aircraft-f35": wrapAircraftSvg(`<path ${STROKE} d="M40 8 Q38.5 36 40 64 Q41.5 36 40 8"/><path ${STROKE} d="M40 18 C34 24 16 40 12 46 L26 50 L40 40 L54 50 L68 46 C64 40 46 24 40 18 Z"/><path ${STROKE} d="M36 58 L40 66 L44 58"/><path ${STROKE} d="M22 40 L14 44 M58 40 L66 44"/>`),
  "aircraft-b2": wrapAircraftSvg(`<path ${STROKE} d="M40 8 C28 12 6 38 4 44 L16 52 L32 46 L40 54 L48 46 L64 52 L76 44 C74 38 52 12 40 8 Z"/><path ${STROKE} d="M40 8 Q40 30 40 54"/><path ${STROKE} d="M32 16 C32 12 48 12 48 16"/><path ${STROKE} d="M18 48 L10 44 M62 48 L70 44"/>`),
  "aircraft-b52": wrapAircraftSvg(`<path ${STROKE} d="M40 8 Q38.5 35 40 62 Q41.5 35 40 8"/><path ${STROKE} d="M4 36 Q40 34 76 36"/><path ${STROKE} d="M12 36 L12 40 M22 36 L22 40 M32 36 L32 40 M48 36 L48 40 M58 36 L58 40 M68 36 L68 40"/><path ${STROKE} d="M28 56 L52 56"/><path ${STROKE} d="M18 34 L10 30 M62 34 L70 30"/><path ${STROKE} d="M36 20 L44 20"/>`),
  "aircraft-c130": wrapAircraftSvg(`<path ${STROKE} d="M40 12 Q38.5 36 40 60 Q41.5 36 40 12"/><path ${STROKE} d="M6 28 Q40 26 74 28"/><path ${STROKE} d="M32 56 L48 56"/><path ${STROKE} d="M40 60 L40 66 M34 66 L46 66"/><ellipse ${STROKE} cx="18" cy="28" rx="3.2" ry="3.2"/><ellipse ${STROKE} cx="30" cy="28" rx="3.2" ry="3.2"/><ellipse ${STROKE} cx="50" cy="28" rx="3.2" ry="3.2"/><ellipse ${STROKE} cx="62" cy="28" rx="3.2" ry="3.2"/><path ${STROKE} d="M18 24 L18 20 M30 24 L30 20 M50 24 L50 20 M62 24 L62 20"/>`),
  "aircraft-global-hawk": wrapAircraftSvg(`<path ${STROKE} d="M40 14 Q38.5 36 40 58 Q41.5 36 40 14"/><path ${STROKE} d="M2 38 Q40 36 78 38"/><path ${STROKE} d="M2 38 L6 42 M78 38 L74 42"/><path ${STROKE} d="M34 12 C34 9 46 9 46 12"/><path ${STROKE} d="M40 58 L40 64 M34 64 L46 64"/>`),
  "aircraft-v22": wrapAircraftSvg(`<path ${STROKE} d="M40 14 Q38.5 35 40 56 Q41.5 35 40 14"/><path ${STROKE} d="M10 34 Q40 32 70 34"/><path ${STROKE} d="M32 54 L48 54"/><ellipse ${STROKE} cx="10" cy="34" rx="7.5" ry="7.5"/><ellipse ${STROKE} cx="70" cy="34" rx="7.5" ry="7.5"/><path ${STROKE} d="M10 26 L10 42 M2 34 L18 34"/><path ${STROKE} d="M70 26 L70 42 M62 34 L78 34"/><path ${STROKE} d="M10 20 L10 16 M70 20 L70 16"/>`),
  "aircraft-cessna": wrapAircraftSvg(`<path ${STROKE} d="M40 10 Q38.5 33 40 56 Q41.5 33 40 10"/><path ${STROKE} d="M14 26 Q40 24 66 26"/><path ${STROKE} d="M34 54 L46 54"/><circle ${STROKE} cx="40" cy="9" r="2.8"/><path ${STROKE} d="M40 9 L40 5 M36 5 L44 5"/>`),
  "aircraft-bizjet": wrapAircraftSvg(`<path ${STROKE} d="M40 9 Q38.5 33.5 40 58 Q41.5 33.5 40 9"/><path ${STROKE} d="M14 36 Q40 34 66 36"/><path ${STROKE} d="M22 36 L28 42 M58 36 L52 42"/><path ${STROKE} d="M40 58 L40 64 M34 64 L46 64"/><ellipse ${STROKE} cx="33" cy="48" rx="2.4" ry="3.8"/><ellipse ${STROKE} cx="47" cy="48" rx="2.4" ry="3.8"/><path ${STROKE} d="M38 18 L42 18"/>`),
  "founder-worker-origin": wrapWorkerSvg(`<path ${STROKE} d="M8 68 L72 68"/><path ${STROKE} d="M10 68 L14 62 L18 68"/><path ${STROKE} d="M62 68 L66 62 L70 68"/><circle ${STROKE} cx="46" cy="18" r="5.5"/><path ${STROKE} d="M46 23.5 L44 34 L40 48 L38 62 L42 68"/><path ${STROKE} d="M44 34 L52 36 L56 42"/><path ${STROKE} d="M40 48 L32 50 L28 56 L26 68"/><path ${STROKE} d="M40 48 L48 62 L54 68"/><path ${STROKE} d="M52 36 L58 30 L62 24"/><rect ${STROKE} x="56" y="20" width="10" height="8" rx="1.5"/><path ${STROKE} d="M58 24 L64 24"/>`),
  "founder-worker-wrenches": wrapWorkerSvg(`<path ${STROKE} d="M6 70 L74 70"/><rect ${STROKE} x="14" y="58" width="28" height="12" rx="2"/><path ${STROKE} d="M18 58 L18 54 M38 58 L38 54"/><circle ${STROKE} cx="34" cy="22" r="5.5"/><path ${STROKE} d="M34 27.5 L30 38 L26 50 L24 62"/><path ${STROKE} d="M30 38 L40 40 L46 46"/><path ${STROKE} d="M26 50 L18 54 L14 62"/><path ${STROKE} d="M26 50 L34 58 L40 62"/><path ${STROKE} d="M46 46 L54 50 L58 56 L60 62"/><path ${STROKE} d="M48 44 L56 38 L62 34 L68 32"/><path ${STROKE} d="M62 34 L66 30 L70 28"/><path ${STROKE} d="M66 30 L70 34 L68 38 L64 36"/><path ${STROKE} d="M34 16 L38 12 L42 14 L40 18"/>`),
  "founder-worker-industry-first": wrapWorkerSvg(`<path ${STROKE} d="M8 68 L72 68"/><path ${STROKE} d="M20 68 L22 60 L24 68"/><path ${STROKE} d="M56 68 L58 60 L60 68"/><circle ${STROKE} cx="40" cy="20" r="5.5"/><path ${STROKE} d="M32 18 L48 18 L50 14 L30 14 Z"/><path ${STROKE} d="M40 25.5 L38 36 L36 48 L34 62 L38 68"/><path ${STROKE} d="M40 25.5 L42 36 L44 48 L46 62 L42 68"/><path ${STROKE} d="M38 36 L28 38 L22 44"/><path ${STROKE} d="M42 36 L52 38 L58 44"/><path ${STROKE} d="M22 44 L18 50 L16 58"/><path ${STROKE} d="M58 44 L62 50 L64 58"/><path ${STROKE} d="M52 42 L60 36 L66 30"/><ellipse ${STROKE} cx="64" cy="28" rx="4" ry="6"/><path ${STROKE} d="M60 28 L68 28"/><path ${STROKE} d="M12 52 L20 48 L24 52 L20 56 Z"/>`),
};

/** Static files under public/ to rasterize (brand / UI marks). */
const PUBLIC_RASTER_SOURCES = [
  { rel: "favicon.svg", out: "public-favicon" },
  { rel: "favicon-32x32.png", out: "public-favicon-32" },
  { rel: "apple-touch-icon.png", out: "public-apple-touch-icon" },
  { rel: "mobile-rotate-phones.svg", out: "public-mobile-rotate-phones" },
  { rel: "mobile-rotate-cue.png", out: "public-mobile-rotate-cue" },
  { rel: "mobile-rotate-cue-sprite.png", out: "public-mobile-rotate-cue-sprite" },
  { rel: "gaming/vr-headset-icon.svg", out: "public-gaming-vr-headset-icon" },
  { rel: "founder/usjet-hero-logo.png", out: "public-founder-hero-logo" },
];

const manifest = [];

async function toJpeg(input, outputPath, { density } = {}) {
  let pipeline = sharp(input, density ? { density } : undefined);
  const meta = await pipeline.metadata();
  if (meta.width && meta.width < 400 && (meta.format === "svg" || density)) {
    pipeline = sharp(input, { density: density ?? 300 });
  }
  await pipeline.flatten({ background: BG }).jpeg({ quality: 92, mozjpeg: true }).toFile(outputPath);
}

async function exportGeneratedSvgs() {
  await mkdir(ASSETS_DIR, { recursive: true });
  for (const [name, svg] of Object.entries(GENERATED_SVGS)) {
    const svgPath = join(ASSETS_DIR, `${name}.svg`);
    await writeFile(svgPath, svg, "utf8");
    const dest = join(OUT_DIR, `${name}.jpg`);
    await toJpeg(svgPath, dest, { density: 240 });
    manifest.push({ file: `${name}.jpg`, source: `generated:${name}.svg` });
  }
}

async function exportAssetFolder() {
  let files = [];
  try {
    files = await readdir(ASSETS_DIR);
  } catch {
    return;
  }
  for (const file of files) {
    if (!file.endsWith(".svg") || GENERATED_SVGS[file.replace(/\.svg$/, "")]) {
      continue;
    }
    const stem = file.replace(/\.svg$/, "");
    await toJpeg(join(ASSETS_DIR, file), join(OUT_DIR, `${stem}.jpg`), { density: 240 });
  }
}

async function exportPublicFiles() {
  for (const { rel, out } of PUBLIC_RASTER_SOURCES) {
    const src = join(ROOT, "public", rel);
    const dest = join(OUT_DIR, `${out}.jpg`);
    await toJpeg(src, dest);
    manifest.push({ file: `${out}.jpg`, source: `public/${rel}` });
  }
}

function startStaticServer() {
  const mime = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".js": "application/javascript",
  };

  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const urlPath = (req.url ?? "/").split("?")[0];
        let filePath;
        if (urlPath === "/scripts/brand-export/capture.html" || urlPath === "/capture.html") {
          filePath = CAPTURE_HTML;
        } else if (urlPath.startsWith("/src/")) {
          filePath = join(ROOT, urlPath.slice(1));
        } else {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        const ext = extname(filePath);
        const body = await readFile(filePath);
        res.writeHead(200, { "Content-Type": mime[ext] ?? "application/octet-stream" });
        res.end(body);
      } catch {
        res.writeHead(500);
        res.end("Error");
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function launchBrowser(chromium) {
  try {
    return await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    return chromium.launch({ headless: true });
  }
}

async function exportRenderedSurfaces() {
  const { chromium } = await import("playwright");
  const { server, port } = await startStaticServer();
  const browser = await launchBrowser(chromium);
  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 2400 } });
    await page.goto(`http://127.0.0.1:${port}/scripts/brand-export/capture.html`, {
      waitUntil: "networkidle",
    });
    await page.waitForTimeout(600);
    const ids = await page.$$eval("[data-export-id]", (nodes) =>
      nodes.map((node) => node.getAttribute("data-export-id")).filter(Boolean),
    );
    for (const id of ids) {
      const locator = page.locator(`[data-export-id="${id}"]`);
      const out = join(OUT_DIR, `${id}.jpg`);
      await locator.screenshot({ path: out, type: "jpeg", quality: 92, omitBackground: false });
      manifest.push({ file: `${id}.jpg`, source: "capture" });
    }
  } finally {
    await browser.close();
    server.close();
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.info("Exporting brand JPEGs →", OUT_DIR);
  await exportGeneratedSvgs();
  await exportAssetFolder();
  await exportPublicFiles();
  try {
    await exportRenderedSurfaces();
  } catch (err) {
    console.warn("Playwright capture skipped — install Chrome or run: npx playwright install chromium");
    console.warn(err instanceof Error ? err.message : err);
  }
  await writeFile(
    join(OUT_DIR, "manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), count: manifest.length, files: manifest }, null, 2),
    "utf8",
  );
  console.info(`Done — ${manifest.length} JPEG entries recorded in manifest.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
