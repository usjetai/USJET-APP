/**
 * Key white / tan sheet background from the B-21 Raider fleet emblem.
 *
 * Run: node scripts/process-b21-raider-logo.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(ROOT, "public/assets/fleet-logos/b21_raider.png");
const OUT_MAIN = SOURCE;
const OUT_RADAR = join(ROOT, "public/assets/fleet-logos/radar-transparent/b21_raider.png");
const SHEET_BG = { r: 207, g: 196, b: 166 };

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

async function keyLogo(inputPath) {
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
    .trim({ threshold: 8 })
    .resize(384, 384, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  const keyed = await keyLogo(SOURCE);
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
