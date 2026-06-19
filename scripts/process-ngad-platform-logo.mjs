/**
 * Process the NGAD sixth-gen logo: crop the white-panel aircraft art only,
 * key the sheet white, export upright transparent emblem.
 *
 * Run: node scripts/process-ngad-platform-logo.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "assets/ngad-platform-source-v2.png");
const OUT_MAIN = join(ROOT, "public/assets/fleet-logos/ngad_platform.png");
const OUT_RADAR = join(ROOT, "public/assets/fleet-logos/radar-transparent/ngad_platform.png");
const TARGET = 384;
/** Left white panel in the composite source (colored aircraft only). */
const PANEL_CROP = { left: 49, top: 36, width: 217, height: 407 };

function isBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const spread = max - min;

  if (min >= 232 && spread <= 18) {
    return true;
  }

  if (r >= 210 && g >= 210 && b >= 210 && spread <= 24) {
    return true;
  }

  return false;
}

async function keyToPng(inputPath) {
  const cropped = await sharp(inputPath)
    .extract(PANEL_CROP)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cropped;
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
