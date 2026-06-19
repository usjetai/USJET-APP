/**
 * Key white sheet off jet captain wings badge — hub developer tile overlay.
 *
 * Run: node scripts/process-jet-captain-wings.mjs
 */
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE = join(
  ROOT,
  "scripts/assets/jet-captain-wings-source.png",
);
const OUT = join(ROOT, "public/hired-hud/jet-captain-wings.png");
const TARGET_WIDTH = 220;

function isBackgroundPixel(r, g, b) {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const spread = max - min;

  if (min >= 245 && spread <= 12) {
    return true;
  }

  if (r >= 238 && g >= 238 && b >= 238 && spread <= 16) {
    return true;
  }

  return false;
}

function floodFillBackground(data, width, height, channels) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const pushIfBg = (x, y) => {
    const idx = (y * width + x) * channels;
    if (visited[y * width + x]) {
      return;
    }
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    if (!isBackgroundPixel(r, g, b)) {
      return;
    }
    visited[y * width + x] = 1;
    queue.push([x, y]);
  };

  for (let x = 0; x < width; x += 1) {
    pushIfBg(x, 0);
    pushIfBg(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    pushIfBg(0, y);
    pushIfBg(width - 1, y);
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const idx = (y * width + x) * channels;
    data[idx + 3] = 0;

    if (x > 0) {
      pushIfBg(x - 1, y);
    }
    if (x < width - 1) {
      pushIfBg(x + 1, y);
    }
    if (y > 0) {
      pushIfBg(x, y - 1);
    }
    if (y < height - 1) {
      pushIfBg(x, y + 1);
    }
  }
}

async function main() {
  await mkdir(join(ROOT, "scripts/assets"), { recursive: true });
  await mkdir(dirname(OUT), { recursive: true });

  const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  floodFillBackground(data, info.width, info.height, info.channels);

  await sharp(data, { raw: info })
    .png()
    .trim({ threshold: 12 })
    .resize(TARGET_WIDTH, null, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(OUT);

  const meta = await sharp(OUT).metadata();
  console.log(`wrote ${OUT} (${meta.width}x${meta.height})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
