/**
 * Process the X-37B OTV logo: convert alpha-matte line art to white
 * outline on transparent, export fleet emblem.
 *
 * Run: node scripts/process-x37b-logo.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "assets/x37b-source.png");
const OUT_MAIN = join(ROOT, "public/assets/fleet-logos/x37b.png");
const OUT_RADAR = join(ROOT, "public/assets/fleet-logos/radar-transparent/x37b.png");
const TARGET = 384;
const ALPHA_THRESHOLD = 25;

async function keyToPng(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const output = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += channels) {
    const alpha = data[i + 3];

    if (alpha > ALPHA_THRESHOLD) {
      output[i] = 255;
      output[i + 1] = 255;
      output[i + 2] = 255;
      output[i + 3] = alpha;
    }
  }

  return sharp(output, { raw: { width, height, channels } })
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
