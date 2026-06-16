/**
 * Export logos, badges, and vectors from developer-facing pages only.
 * Output: export/developer-pages-jpegs/{page}/{kind}-{file}.jpg
 *
 * Usage: npm run export:developer-pages-jpegs
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "export", "developer-pages-jpegs");
const LOCAL_PLAYWRIGHT = join(ROOT, ".playwright-browsers");
const DEV_PORT = 5183;
const DEV_ORIGIN = `http://127.0.0.1:${DEV_PORT}`;

if (existsSync(LOCAL_PLAYWRIGHT)) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = LOCAL_PLAYWRIGHT;
}

/** Inline mirror of src/data/developerPagesExport.ts (Node cannot import TS without build). */
const DEVELOPER_PAGES = [
  {
    path: "/code-kit",
    slug: "code-kit",
    captures: [
      { kind: "badges", selector: ".code-kit-page__badge", file: "page-badge" },
      { kind: "logos", selector: ".code-kit-page__badge-icon", file: "badge-icon-brackets" },
      { kind: "badges", selector: ".code-kit-checkout__badge-row", file: "checkout-badge-row" },
      { kind: "vectors", selector: ".ai101-engine-room__package-icon", file: "engine-package-icon", all: true, scroll: true },
      { kind: "vectors", selector: ".ai101-engine-room__guarantee-icon", file: "engine-guarantee-icon", scroll: true },
    ],
  },
  {
    path: "/landscape",
    slug: "landscape",
    captures: [
      { kind: "vectors", selector: ".mobile-landscape-page__icon-hero", file: "rotate-phones-vector" },
      { kind: "badges", selector: ".mobile-landscape-page__eyebrow", file: "eyebrow-badge" },
    ],
  },
  {
    path: "/sovereignty",
    slug: "sovereignty",
    captures: [
      { kind: "vectors", selector: ".strategic-assets-hero__airframe", file: "hero-airframe-vector" },
      { kind: "logos", selector: ".sovereignty-framework__mark", file: "framework-mark" },
      { kind: "logos", selector: ".sovereignty-evidence__mark", file: "evidence-mark" },
      { kind: "logos", selector: ".sovereignty-book__mark", file: "book-mark" },
    ],
  },
  {
    path: "/ai-101",
    slug: "ai-101",
    captures: [
      { kind: "badges", selector: ".ai101-page__hero .rounded-full", file: "guest-curriculum-badge" },
      { kind: "logos", selector: ".ai101-code-access-btn", file: "code-access-logo-btn" },
      { kind: "vectors", selector: ".ai101-partner__stars-svg", file: "partner-stars-vector", scroll: true },
      { kind: "vectors", selector: ".ai101-engine-room__package-icon", file: "engine-package-icon", all: true, scroll: true },
      { kind: "vectors", selector: ".ai101-calibration__trigger-icon", file: "calibration-step-icon", all: true, scroll: true },
      { kind: "badges", selector: ".fleet-command--ceremony", file: "protocol-ceremony-badge", scroll: true },
    ],
  },
  {
    path: "/protocol-proof",
    slug: "protocol-proof",
    captures: [
      { kind: "badges", selector: ".protocol-proof-page__swatch", file: "session-swatch", all: true },
      { kind: "badges", selector: ".protocol-proof-page__eyebrow", file: "eyebrow-badge" },
    ],
  },
  {
    path: "/b2k",
    slug: "b2k",
    captures: [
      { kind: "badges", selector: ".b2k-page__badge", file: "page-badge" },
      { kind: "logos", selector: ".b2k-help-actions__envelope-icon", file: "app-crew-envelope-icon" },
    ],
  },
];

const manifest = [];

function waitForServer(url, attempts = 60) {
  return new Promise((resolve, reject) => {
    let n = 0;
    const tick = async () => {
      n += 1;
      try {
        const res = await fetch(url);
        if (res.ok) {
          resolve();
          return;
        }
      } catch {
        /* retry */
      }
      if (n >= attempts) {
        reject(new Error(`Dev server did not start at ${url}`));
        return;
      }
      setTimeout(tick, 500);
    };
    tick();
  });
}

function startDevServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "npm",
      ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(DEV_PORT), "--strictPort"],
      { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, BROWSER: "none" } },
    );
    let settled = false;
    child.stderr?.on("data", (chunk) => process.stderr.write(chunk));
    child.stdout?.on("data", (chunk) => process.stdout.write(chunk));
    waitForServer(`${DEV_ORIGIN}/`)
      .then(() => {
        if (!settled) {
          settled = true;
          resolve(child);
        }
      })
      .catch((err) => {
        if (!settled) {
          settled = true;
          child.kill("SIGTERM");
          reject(err);
        }
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

async function captureDeveloperPages() {
  const { chromium } = await import("playwright");
  const dev = await startDevServer();
  const browser = await launchBrowser(chromium);

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });
    await page.addStyleTag({
      content: "body { background: #020617 !important; }",
    });

    for (const devPage of DEVELOPER_PAGES) {
      const pageDir = join(OUT_DIR, devPage.slug);
      await mkdir(pageDir, { recursive: true });

      await page.goto(`${DEV_ORIGIN}${devPage.path}`, { waitUntil: "networkidle", timeout: 120_000 });
      await page.waitForTimeout(400);

      for (const cap of devPage.captures) {
        const locator = page.locator(cap.selector);
        const count = await locator.count();
        if (count === 0) {
          console.warn(`[skip] ${devPage.slug} — no match: ${cap.selector}`);
          continue;
        }

        const shots = cap.all ? count : 1;
        for (let i = 0; i < shots; i += 1) {
          const target = cap.all ? locator.nth(i) : locator.first();
          if (cap.scroll) {
            await target.scrollIntoViewIfNeeded();
            await page.waitForTimeout(200);
          }
          const suffix = cap.all ? `-${String(i + 1).padStart(2, "0")}` : "";
          const outName = `${cap.kind}-${cap.file}${suffix}.jpg`;
          const outPath = join(pageDir, outName);
          await target.screenshot({ path: outPath, type: "jpeg", quality: 92 });
          manifest.push({
            page: devPage.slug,
            route: devPage.path,
            kind: cap.kind,
            file: `${devPage.slug}/${outName}`,
            selector: cap.selector,
          });
          console.info(`[ok] ${devPage.slug}/${outName}`);
        }
      }
    }
  } finally {
    await browser.close();
    dev.kill("SIGTERM");
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.info("Developer pages → JPEG export:", OUT_DIR);
  await captureDeveloperPages();
  await writeFile(
    join(OUT_DIR, "manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pages: DEVELOPER_PAGES.map((p) => p.slug),
        count: manifest.length,
        items: manifest,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.info(`Done — ${manifest.length} JPEGs (logos, badges, vectors only).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
