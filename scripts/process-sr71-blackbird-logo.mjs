/**
 * Process the SR-71 Blackbird top-view logo: key white sheet + sticker border,
 * strip bottom-right metadata text, export fleet emblem + radar variant.
 *
 * Run: node scripts/process-sr71-blackbird-logo.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "assets/sr71-blackbird-source.png");
const OUT_MAIN = join(ROOT, "public/fleet/sr71-blackbird-logo.png");
const OUT_RADAR = join(ROOT, "public/assets/fleet-logos/radar-transparent/sr71-blackbird-logo.png");
const TARGET = 512;

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

  if (max - min <= 18 && avg >= 188) {
    return false;
  }

  return true;
}

/** Bottom-right stock ID / watermark text — outside the main dark silhouette fill. */
function isStockMetadataPixel(x, y, width, height, r, g, b) {
  const avg = (r + g + b) / 3;
  const inMetadataCorner = x > width * 0.6 && y > height * 0.72;
  if (!inMetadataCorner) {
    return false;
  }

  return avg >= 78;
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

      if (!shouldKeepPixel(r, g, b) || isStockMetadataPixel(x, y, width, height, r, g, b)) {
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
