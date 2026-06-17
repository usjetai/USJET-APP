/**
 * Slice the cockpit portrait sheet into fleet runway avatars for hired developers.
 * Source: scripts/assets/hired-developer-cockpit-sheet.png (2×5 grid, portraits 1–10).
 *
 * Run: node scripts/generate-hired-developer-cockpit-avatars.mjs
 */
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHEET = join(__dirname, "assets/hired-developer-cockpit-sheet.png");
const OUT_DIR = join(ROOT, "public/fleet/hired-developer-cockpits");

const COLS = 5;
const ROWS = 2;

/** Ten sovereign hired developers — portrait numbers match the numbered cockpit sheet. */
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

async function cropCockpitPortrait(sheet, width, height, portraitNumber) {
  const { left, top, rawWidth, rawHeight } = cellBounds(width, height, portraitNumber);
  const insetX = Math.round(rawWidth * 0.015);
  const insetY = Math.round(rawHeight * 0.015);

  return sharp(sheet)
    .extract({
      left: left + insetX,
      top: top + insetY,
      width: Math.max(1, rawWidth - insetX * 2),
      height: Math.max(1, rawHeight - insetY * 2),
    })
    .resize(480, 680, { fit: "cover", position: "top" })
    .webp({ quality: 90 })
    .toBuffer();
}

async function pruneStaleWebps(dir, keepNames) {
  const keep = new Set(keepNames);
  for (const name of await readdir(dir)) {
    if (name.endsWith(".webp") && !keep.has(name)) {
      await unlink(join(dir, name));
    }
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const sheet = await sharp(SHEET).toBuffer();
  const { width, height } = await sharp(sheet).metadata();
  if (!width || !height) {
    throw new Error("Could not read cockpit sheet dimensions");
  }

  const portraitCache = new Map();
  const manifest = [];
  const keep = [];

  for (const dev of HIRED_DEVELOPER_AVATARS) {
    if (!portraitCache.has(dev.portrait)) {
      portraitCache.set(dev.portrait, await cropCockpitPortrait(sheet, width, height, dev.portrait));
    }

    const filename = `bay-${String(dev.slot + 1).padStart(2, "0")}-${dev.slug}.webp`;
    await writeFile(join(OUT_DIR, filename), portraitCache.get(dev.portrait));
    keep.push(filename);

    manifest.push({
      slot: dev.slot,
      slug: dev.slug,
      label: dev.label,
      portrait: dev.portrait,
      fleetCockpitPath: `/fleet/hired-developer-cockpits/${filename}`,
    });
    console.log(`wrote ${filename} ← cockpit portrait ${dev.portrait}`);
  }

  await pruneStaleWebps(OUT_DIR, keep);

  await writeFile(
    join(OUT_DIR, "manifest.json"),
    `${JSON.stringify(
      {
        generated: new Date().toISOString(),
        source: "scripts/assets/hired-developer-cockpit-sheet.png",
        grid: `${ROWS}x${COLS}`,
        avatars: manifest,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`done — ${manifest.length} fleet cockpit portraits`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
