/**
 * Process the X-47B UCAS logo: crop top plan view only, key white sheet
 * and drop shadow, export upright transparent emblem.
 *
 * Run: node scripts/process-x47b-logo.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "assets/x47b-source.png");
const OUT_MAIN = join(ROOT, "public/assets/fleet-logos/x47b.png");
const OUT_RADAR = join(ROOT, "public/assets/fleet-logos/radar-transparent/x47b.png");
const TARGET = 384;
/** Right-side top plan view in the 3-view composite. */
const TOP_VIEW_CROP = { left: 230, top: 30, width: 470, height: 290 };

function isWhitePixel(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= 235 && max - min <= 20;
}

function isShadowPixel(r, g, b) {
  const avg = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  return avg <= 95 && spread <= 35;
}

function removeDropShadow(data, output, width, height, channels) {
  const total = width * height;
  const shadow = new Uint8Array(total);
  const queue = [];

  for (let x = 0; x < width; x++) {
    const index = x;
    const offset = index * channels;
    if (output[offset + 3] > 0 && isShadowPixel(data[offset], data[offset + 1], data[offset + 2])) {
      queue.push(index);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const index = queue[head++];
    if (shadow[index]) {
      continue;
    }

    shadow[index] = 1;
    const x = index % width;
    const y = (index - x) / width;

    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
        continue;
      }

      const neighbor = ny * width + nx;
      const offset = neighbor * channels;
      if (output[offset + 3] === 0 || shadow[neighbor]) {
        continue;
      }

      if (isShadowPixel(data[offset], data[offset + 1], data[offset + 2])) {
        queue.push(neighbor);
      }
    }
  }

  for (let index = 0; index < total; index++) {
    if (shadow[index]) {
      output[index * channels + 3] = 0;
    }
  }
}

async function keyToPng(inputPath) {
  const cropped = await sharp(inputPath)
    .extract(TOP_VIEW_CROP)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cropped;
  const { width, height, channels } = info;
  const output = Buffer.from(data);

  for (let i = 0; i < data.length; i += channels) {
    if (isWhitePixel(data[i], data[i + 1], data[i + 2])) {
      output[i + 3] = 0;
    }
  }

  removeDropShadow(data, output, width, height, channels);

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
