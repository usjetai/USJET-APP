/**
 * Export all 30 Jet Fighter call-sign profile pages as JPEGs.
 * Output: export/jetfighter-pages-jpegs/{slug}.jpg + manifest.json
 *
 * Usage: npm run export:jetfighter-pages-jpegs
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "export", "jetfighter-pages-jpegs");
const LOCAL_PLAYWRIGHT = join(ROOT, ".playwright-browsers");
const DEV_PORT = 5184;
const DEV_ORIGIN = `http://127.0.0.1:${DEV_PORT}`;

if (existsSync(LOCAL_PLAYWRIGHT)) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = LOCAL_PLAYWRIGHT;
}

function slugifyFleetCallsign(callsign) {
  return callsign
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseJetFighterPages() {
  const src = readFileSync(join(ROOT, "src/data/fleetManifest.ts"), "utf8");
  const re = /callsign:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const callsign = m[1];
    out.push({
      callsign,
      slug: slugifyFleetCallsign(callsign),
      path: `/fleet-directory/${slugifyFleetCallsign(callsign)}`,
    });
  }
  return out;
}

const JETFIGHTER_PAGES = parseJetFighterPages();
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

async function captureJetFighterPages() {
  const { chromium } = await import("playwright");
  const dev = await startDevServer();
  const browser = await launchBrowser(chromium);

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
    await page.addStyleTag({
      content: "body { background: #020617 !important; }",
    });

    for (const jet of JETFIGHTER_PAGES) {
      await page.goto(`${DEV_ORIGIN}${jet.path}`, { waitUntil: "networkidle", timeout: 120_000 });
      await page.waitForSelector(".fleet-callsign-hero", { timeout: 30_000 });
      await page.waitForTimeout(350);

      const hero = page.locator(".fleet-callsign-hero").first();
      const heroPath = join(OUT_DIR, `${jet.slug}-hero.jpg`);
      await hero.screenshot({ path: heroPath, type: "jpeg", quality: 92 });

      const icon = page.locator(".fleet-callsign-hero__icon").first();
      const iconPath = join(OUT_DIR, `${jet.slug}-aircraft.jpg`);
      if ((await icon.count()) > 0) {
        await icon.screenshot({ path: iconPath, type: "jpeg", quality: 92 });
      }

      manifest.push({
        callsign: jet.callsign,
        slug: jet.slug,
        route: jet.path,
        heroFile: `${jet.slug}-hero.jpg`,
        aircraftFile: `${jet.slug}-aircraft.jpg`,
      });
      console.info(`[ok] ${jet.callsign} → ${jet.slug}`);
    }
  } finally {
    await browser.close();
    dev.kill("SIGTERM");
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.info(`Jet Fighter pages → JPEG export (${JETFIGHTER_PAGES.length} call signs):`, OUT_DIR);
  await captureJetFighterPages();
  await writeFile(
    join(OUT_DIR, "manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: JETFIGHTER_PAGES.length,
        callSigns: manifest,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.info(`Done — ${manifest.length} Jet Fighter pages exported.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
