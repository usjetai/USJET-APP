/**
 * Key light sheet/white backgrounds out of fleet logos for the Hired HUD radar scope.
 * Output: public/assets/fleet-logos/radar-transparent/*.png
 *
 * Run: node scripts/generate-fleet-radar-logos.mjs
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MAIN_DIR = join(ROOT, "public/assets/fleet-logos");
const OUT_DIR = join(MAIN_DIR, "radar-transparent");

/** Tan sheet color from usjet-fleet-sheet-source.png */
const SHEET_BG = { r: 207, g: 196, b: 166 };

async function discoverSources() {
  const files = await readdir(MAIN_DIR);
  const mains = files.filter((file) => file.endsWith(".png") && file !== "usjet-fleet-sheet-source.png");
  return [
    ...new Set([
      ...mains.map((file) => `public/assets/fleet-logos/${file}`),
      "public/fleet/sr71-blackbird-logo.png",
    ]),
  ];
}

function isBackgroundPixel(r, g, b) {
  if (r >= 232 && g >= 232 && b >= 232) {
    return true;
  }

  const dr = r - SHEET_BG.r;
  const dg = g - SHEET_BG.g;
  const db = b - SHEET_BG.b;
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);
  if (distance <= 36 && r >= 150 && g >= 140 && b >= 120) {
    return true;
  }

  if (r >= 210 && g >= 200 && b >= 175 && Math.abs(r - g) < 24) {
    return true;
  }

  return false;
}

async function keyLogo(relativePath) {
  const inputPath = join(ROOT, relativePath);
  const filename = basename(relativePath);
  const outputPath = join(OUT_DIR, filename);

  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let opaque = 0;
  for (let i = 3; i < data.length; i += channels) {
    if (data[i] > 20) {
      opaque++;
    }
  }
  const alreadyKeyed = opaque / (data.length / channels) < 0.85;

  if (alreadyKeyed) {
    await sharp(inputPath).png().toFile(outputPath);
    return filename;
  }

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isBackgroundPixel(r, g, b)) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(outputPath);
  return filename;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = [];
  const SOURCES = await discoverSources();

  for (const source of SOURCES) {
    const filename = await keyLogo(source);
    manifest.push({ source, radarPath: `/assets/fleet-logos/radar-transparent/${filename}` });
    console.log(`wrote radar-transparent/${filename}`);
  }

  await writeFile(
    join(OUT_DIR, "manifest.json"),
    `${JSON.stringify({ generated: new Date().toISOString(), logos: manifest }, null, 2)}\n`,
    "utf8",
  );

  console.log(`done — ${manifest.length} radar scope logos`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
