/**
 * Process the B-2 Spirit logo: key white sheet, keep main silhouette,
 * rotate upright (nose top), export transparent fleet emblem.
 *
 * Run: node scripts/process-b2-spirit-logo.mjs
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(__dirname, "assets/b2-spirit-source.png");
const OUT_MAIN = join(ROOT, "public/assets/fleet-logos/b2_spirit.png");
const OUT_RADAR = join(ROOT, "public/assets/fleet-logos/radar-transparent/b2_spirit.png");
const TARGET = 384;

function isBackgroundPixel(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const spread = max - min;

  if (min >= 248 && spread <= 10) {
    return true;
  }

  if (r >= 242 && g >= 242 && b >= 242 && spread <= 12) {
    return true;
  }

  return false;
}

function largestForegroundComponent(foreground, width, height) {
  const total = width * height;
  const labels = new Int32Array(total);
  let nextLabel = 1;
  let bestLabel = 0;
  let bestSize = 0;

  for (let index = 0; index < total; index++) {
    if (!foreground[index] || labels[index]) {
      continue;
    }

    const label = nextLabel++;
    const queue = [index];
    let size = 0;
    labels[index] = label;

    let head = 0;
    while (head < queue.length) {
      const current = queue[head++];
      size += 1;

      const x = current % width;
      const y = (current - x) / width;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          continue;
        }

        const neighbor = ny * width + nx;
        if (foreground[neighbor] && !labels[neighbor]) {
          labels[neighbor] = label;
          queue.push(neighbor);
        }
      }
    }

    if (size > bestSize) {
      bestSize = size;
      bestLabel = label;
    }
  }

  const keep = new Uint8Array(total);
  for (let index = 0; index < total; index++) {
    if (labels[index] === bestLabel) {
      keep[index] = 1;
    }
  }

  return keep;
}

async function keyToPng(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const total = width * height;
  const foreground = new Uint8Array(total);

  for (let index = 0; index < total; index++) {
    const offset = index * channels;
    if (!isBackgroundPixel(data[offset], data[offset + 1], data[offset + 2])) {
      foreground[index] = 1;
    }
  }

  const aircraft = largestForegroundComponent(foreground, width, height);
  const output = Buffer.from(data);

  for (let index = 0; index < total; index++) {
    output[index * channels + 3] = aircraft[index] ? 255 : 0;
  }

  return sharp(output, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 10 })
    .rotate(180, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
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
