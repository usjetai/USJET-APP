/**
 * Slice the supercar pilot sheet into hired-developer ride tiles (second photo per HUD tile + hub crew).
 * Does not touch existing `-hub.webp` portraits — run `generate-hired-developer-avatars.mjs` for those.
 * Source: scripts/assets/hired-developer-hub-sheet.png (2×5 grid, portraits 1–10).
 *
 * Run: node scripts/generate-hired-developer-hub-avatars.mjs
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHEET = join(__dirname, "assets/hired-developer-hub-sheet.png");
const HUD_OUT_DIR = join(ROOT, "public/hired-hud/avatars");
const MANIFEST_PATH = join(HUD_OUT_DIR, "manifest.json");

const COLS = 5;
const ROWS = 2;
const PORTRAIT_COUNT = COLS * ROWS;

const HIRED_DEVELOPER_AVATARS = [
  { slot: 0, slug: "blue-ivy", label: "Blue Ivy", portrait: 1, aircraftSlug: "sr-71-blackbird" },
  { slot: 1, slug: "mary-stealth", label: "Mary Stealth", portrait: 2, aircraftSlug: "f-35-lightning-ii" },
  { slot: 2, slug: "chop", label: "Chop", portrait: 3, aircraftSlug: "b-21-raider" },
  { slot: 3, slug: "stick", label: "Stick", portrait: 4, aircraftSlug: "j-36" },
  { slot: 25, slug: "christal", label: "Christal", portrait: 5, aircraftSlug: "f-14-tomcat" },
  { slot: 5, slug: "aaliyah", label: "Aaliyah", portrait: 6, aircraftSlug: "yf-23-black-widow-ii" },
  { slot: 6, slug: "little-mama", label: "Little Mama", portrait: 7, aircraftSlug: "x-47b" },
  { slot: 13, slug: "light-speed", label: "Light Speed", portrait: 8, aircraftSlug: "f-22-raptor" },
  { slot: 11, slug: "kitkat", label: "Kitkat", portrait: 9, aircraftSlug: "b-1-lancer" },
  { slot: 10, slug: "rumi", label: "Rumi", portrait: 10, aircraftSlug: "b-2-spirit" },
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

async function cropHubRectangle(sheet, width, height, portraitNumber) {
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
    throw new Error("Could not read hub sheet dimensions");
  }

  const hubCache = new Map();
  const manifest = [];

  for (const dev of HIRED_DEVELOPER_AVATARS) {
    if (dev.portrait < 1 || dev.portrait > PORTRAIT_COUNT) {
      throw new Error(`Portrait ${dev.portrait} out of range for ${dev.label}`);
    }

    if (!hubCache.has(dev.portrait)) {
      hubCache.set(dev.portrait, await cropHubRectangle(sheet, width, height, dev.portrait));
    }

    const rideFilename = `bay-${String(dev.slot + 1).padStart(2, "0")}-${dev.slug}-ride.webp`;
    const hudFilename = `bay-${String(dev.slot + 1).padStart(2, "0")}-${dev.slug}.webp`;
    const hubFilename = `bay-${String(dev.slot + 1).padStart(2, "0")}-${dev.slug}-hub.webp`;

    await writeFile(join(HUD_OUT_DIR, rideFilename), hubCache.get(dev.portrait));
    console.log(`wrote ${rideFilename} ← portrait ${dev.portrait} (${dev.label})`);

    manifest.push({
      slot: dev.slot,
      slug: dev.slug,
      label: dev.label,
      portrait: dev.portrait,
      aircraftSlug: dev.aircraftSlug,
      path: `/hired-hud/avatars/${hudFilename}`,
      hubPath: `/hired-hud/avatars/${hubFilename}`,
      ridePath: `/hired-hud/avatars/${rideFilename}`,
      productPath: `/fleet/developer-avatars/${dev.aircraftSlug}.webp`,
    });
  }

  let priorManifest = {};
  try {
    priorManifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    /* fresh manifest */
  }

  await writeFile(
    MANIFEST_PATH,
    `${JSON.stringify(
      {
        generated: new Date().toISOString(),
        source: priorManifest.source ?? "scripts/assets/hired-developer-avatar-sheet.png",
        hubSource: "scripts/assets/hired-developer-hub-sheet.png",
        grid: `${ROWS}x${COLS}`,
        avatars: manifest,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`done — ${manifest.length} ride avatars for Hired HUD tiles`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
