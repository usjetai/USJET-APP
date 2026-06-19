/**
 * Process the F-22 Raptor logo: key light gray sheet, export upright transparent emblem.
 *
 * Run: node scripts/process-f22-raptor-logo.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "assets/f22-raptor-source.png");
const OUT_MAIN = join(ROOT, "public/assets/fleet-logos/f22_raptor.png");
const OUT_RADAR = join(ROOT, "public/assets/fleet-logos/radar-transparent/f22_raptor.png");
const TARGET = 384;
const SHEET_BG = { r: 230, g: 231, b: 233 };

function isBackgroundPixel(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const spread = max - min;
  const avg = (r + g + b) / 3;

  const dr = r - SHEET_BG.r;
  const dg = g - SHEET_BG.g;
  const db = b - SHEET_BG.b;
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);

  if (distance <= 12 && spread <= 10) {
    return true;
  }

  if (min >= 224 && spread <= 12) {
    return true;
  }

  if (avg >= 218 && spread <= 14) {
    return true;
  }

  return false;
}

async function keyToPng(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (isBackgroundPixel(r, g, b)) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 10 })
    .resize(TARGET, TARGET, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  const keyed = await keyToPng(SOURCE);
  await sharp(keyed).toFile(OUT_MAIN);
  await sharp(keyed).toFile(OUT_RADAR);

  const meta = await sharp(OUT_MAIN).metadata();
  console.log(`wrote ${OUT_MAIN} (${meta.width}x${meta.height})`);
  console.log(`wrote ${OUT_RADAR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
