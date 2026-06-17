/**
 * Slice the supercar pilot sheet into hired-developer super tiles (third photo per HUD tile + hub crew).
 * Does not touch existing `-hub.webp` portraits or `-ride.webp` motorcycle tiles.
 * Source: scripts/assets/hired-developer-supercar-sheet.png (2×5 grid, portraits 1–10).
 *
 * Run: node scripts/generate-hired-developer-supercar-avatars.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHEET = join(__dirname, "assets/hired-developer-supercar-sheet.png");
const HUD_OUT_DIR = join(ROOT, "public/hired-hud/avatars");

const COLS = 5;
const ROWS = 2;
const PORTRAIT_COUNT = COLS * ROWS;

const HIRED_DEVELOPER_AVATARS = [
  { slot: 0, slug: "blue-ivy", label: "Blue Ivy", portrait: 1 },
  { slot: 1, slug: "mary-stealth", label: "Mary Stealth", portrait: 2 },
  { slot: 2, slug: "chop", label: "Chop", portrait: 3 },
  { slot: 3, slug: "stick", label: "Stick", portrait: 4 },
  { slot: 25, slug: "christal", label: "Christal", portrait: 5 },
  { slot: 5, slug: "aaliyah", label: "Aaliyah", portrait: 6 },
  { slot: 6, slug: "little-mama", label: "Little Mama", portrait: 7 },
  { slot: 13, slug: "light-speed", label: "Light Speed", portrait: 8 },
  { slot: 11, slug: "kitkat", label: "Kitkat", portrait: 9 },
  { slot: 10, slug: "rumi", label: "Rumi", portrait: 10 },
];

function portraitCell(portraitNumber) {
  const index = portraitNumber - 1;
  return { col: index % COLS, row: Math.floor(index / COLS) };
}

function cellBounds(width, height, portraitNumber) {
  const { col, row } = portraitCell(portraitNumber);
  const cellWidth = Math.floor(width / COLS);
  const cellHeight = Math.floor(height / ROWS);
  const left = col * cellWidth;
  const top = row * cellHeight;
  const rawWidth = col === COLS - 1 ? width - left : cellWidth;
  const rawHeight = row === ROWS - 1 ? height - top : cellHeight;
  return { left, top, rawWidth, rawHeight };
}

async function cropSuperRectangle(sheet, width, height, portraitNumber) {
  const { left, top, rawWidth, rawHeight } = cellBounds(width, height, portraitNumber);
  const insetX = Math.round(rawWidth * 0.015);
  const insetY = Math.round(rawHeight * 0.015);
  const extractWidth = Math.max(1, rawWidth - insetX * 2);
  const extractHeight = Math.max(1, rawHeight - insetY * 2);
  const targetWidth = 512;
  const targetHeight = Math.max(1, Math.round(targetWidth * (extractHeight / extractWidth)));

  return sharp(sheet)
    .extract({
      left: left + insetX,
      top: top + insetY,
      width: extractWidth,
      height: extractHeight,
    })
    .resize(targetWidth, targetHeight, { fit: "fill" })
    .webp({ quality: 90 })
    .toBuffer();
}

async function main() {
  await mkdir(HUD_OUT_DIR, { recursive: true });
  const sheet = await sharp(SHEET).toBuffer();
  const { width, height } = await sharp(sheet).metadata();
  if (!width || !height) {
    throw new Error("Could not read supercar sheet dimensions");
  }

  const superCache = new Map();

  for (const dev of HIRED_DEVELOPER_AVATARS) {
    if (dev.portrait < 1 || dev.portrait > PORTRAIT_COUNT) {
      throw new Error(`Portrait ${dev.portrait} out of range for ${dev.label}`);
    }

    if (!superCache.has(dev.portrait)) {
      superCache.set(dev.portrait, await cropSuperRectangle(sheet, width, height, dev.portrait));
    }

    const superFilename = `bay-${String(dev.slot + 1).padStart(2, "0")}-${dev.slug}-super.webp`;
    await writeFile(join(HUD_OUT_DIR, superFilename), superCache.get(dev.portrait));
    console.log(`wrote ${superFilename} ← portrait ${dev.portrait} (${dev.label})`);
  }

  console.log(`done — ${HIRED_DEVELOPER_AVATARS.length} super avatars for Hired HUD tiles`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

