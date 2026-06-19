/**
 * Process the new F-35 Lightning II top-view logo: key white sheet + watermark,
 * trim, and export canonical fleet emblem + radar-transparent variant.
 *
 * Run: node scripts/process-f35-lightning-ii-logo.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "assets/f35-lightning-ii-source.jpg");
const OUT_MAIN = join(ROOT, "public/assets/fleet-logos/f35_lightning_ii.png");
const OUT_RADAR = join(ROOT, "public/assets/fleet-logos/radar-transparent/f35_lightning_ii.png");
const TARGET = 384;

function shouldKeepPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const avg = (r + g + b) / 3;

  if (min >= 244) {
    return false;
  }

  if (avg >= 236) {
    return false;
  }

  if (max - min <= 14 && avg >= 208) {
    return false;
  }

  return true;
}

/** Adobe Stock vertical ID strip — left margin only; jet art starts farther right. */
function isStockMetadataPixel(x) {
  return x < 40;
}

async function keyToPng(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (!shouldKeepPixel(r, g, b) || isStockMetadataPixel(x)) {
        data[i + 3] = 0;
      }
    }
  }

  return sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 8 })
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
