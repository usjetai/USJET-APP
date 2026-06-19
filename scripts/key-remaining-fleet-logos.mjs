/**
 * Key tan/white sheet backgrounds out of remaining opaque fleet logos.
 * Writes transparent 384×384 PNGs to main + radar-transparent folders.
 *
 * Run: node scripts/key-remaining-fleet-logos.mjs
 */
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MAIN_DIR = join(ROOT, "public/assets/fleet-logos");
const RADAR_DIR = join(MAIN_DIR, "radar-transparent");
const TARGET = 384;

/** Tan sheet from usjet-fleet-sheet-source.png */
const SHEET_BG = { r: 207, g: 196, b: 166 };

const OPAQUE_LOGOS = [
  "a10_warthog.png",
  "a12_avenger_ii.png",
  "f104_starfighter.png",
  "f117_nighthawk.png",
  "f15ex_eagle_ii.png",
  "f16v_viper.png",
  "f4_phantom_ii.png",
  "f86_sabre.png",
  "fa18_super_hornet.png",
  "fb22.png",
  "mq25_stingray.png",
  "mq28_ghost_bat.png",
  "rq180.png",
  "rq4_global_hawk.png",
  "sr72_darkstar.png",
  "x59_quesst.png",
  "xq58_valkyrie.png",
];

function isBackgroundPixel(r, g, b) {
  if (r >= 232 && g >= 232 && b >= 232) {
    return true;
  }

  const dr = r - SHEET_BG.r;
  const dg = g - SHEET_BG.g;
  const db = b - SHEET_BG.b;
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);
  if (distance <= 40 && r >= 145 && g >= 135 && b >= 110) {
    return true;
  }

  if (r >= 200 && g >= 190 && b >= 165 && Math.abs(r - g) < 28) {
    return true;
  }

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  if (min >= 218 && max - min <= 14) {
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

  for (let x = 0; x < width; x++) {
    pushIfBg(x, 0);
    pushIfBg(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
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

async function keyLogo(filename) {
  const inputPath = join(MAIN_DIR, filename);
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

  floodFillBackground(data, width, height, channels);

  return sharp(data, { raw: { width, height, channels } })
    .png()
    .trim({ threshold: 12 })
    .resize(TARGET, TARGET, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(RADAR_DIR, { recursive: true });

  for (const filename of OPAQUE_LOGOS) {
    const keyed = await keyLogo(filename);
    await sharp(keyed).toFile(join(MAIN_DIR, filename));
    await sharp(keyed).toFile(join(RADAR_DIR, filename));

    const { data } = await sharp(join(MAIN_DIR, filename)).raw().toBuffer({ resolveWithObject: true });
    let opaque = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 20) {
        opaque++;
      }
    }
    const pct = ((opaque / (data.length / 4)) * 100).toFixed(1);
    console.log(`✓ ${filename} — ${pct}% opaque pixels`);
  }

  console.log(`done — keyed ${OPAQUE_LOGOS.length} fleet logos`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
