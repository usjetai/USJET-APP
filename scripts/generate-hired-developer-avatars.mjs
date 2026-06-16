/**
 * Slice the naval officer portrait sheet into hired-developer profile avatars.
 * Source: scripts/assets/hired-developer-avatar-sheet.png (2×5 grid, portraits 1–10).
 *
 * Run: node scripts/generate-hired-developer-avatars.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHEET = join(__dirname, "assets/hired-developer-avatar-sheet.png");
const OUT_DIR = join(ROOT, "public/hired-hud/avatars");

const COLS = 5;
const ROWS = 2;
const PORTRAIT_COUNT = COLS * ROWS;

/** Hired roster slots — matches FLEET_HIRED_SLOTS (hired status only). */
const HIRED_DEVELOPER_AVATARS = [
  { slot: 0, slug: "blue-ivy", label: "Blue Ivy", portrait: 1 },
  { slot: 1, slug: "mary-stealth", label: "Mary Stealth", portrait: 2 },
  { slot: 2, slug: "chop", label: "Chop", portrait: 3 },
  { slot: 4, slug: "grok-developer", label: "Grok Developer", portrait: 4 },
  { slot: 5, slug: "aaliyah", label: "Aaliyah", portrait: 5 },
  { slot: 7, slug: "luma-dream", label: "Luma Dream", portrait: 6 },
  { slot: 8, slug: "sora-developer", label: "Sora Developer", portrait: 7 },
  { slot: 10, slug: "rumi", label: "Rumi", portrait: 8 },
  { slot: 11, slug: "kitkat", label: "Kitkat", portrait: 9 },
  { slot: 12, slug: "firefly-developer", label: "Firefly Developer", portrait: 10 },
  { slot: 19, slug: "heygen-developer", label: "HeyGen Developer", portrait: 1 },
  { slot: 20, slug: "v0-developer", label: "v0 Developer", portrait: 2 },
  { slot: 22, slug: "copilot-developer", label: "Copilot Developer", portrait: 3 },
  { slot: 23, slug: "consensus-developer", label: "Consensus Developer", portrait: 4 },
  { slot: 24, slug: "gamma-developer", label: "Gamma Developer", portrait: 5 },
  { slot: 27, slug: "otter-developer", label: "Otter Developer", portrait: 6 },
];

function portraitCell(portraitNumber) {
  const index = portraitNumber - 1;
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return { col, row };
}

async function cropPortrait(sheet, width, height, portraitNumber) {
  const { col, row } = portraitCell(portraitNumber);
  const cellWidth = Math.floor(width / COLS);
  const cellHeight = Math.floor(height / ROWS);
  const left = col * cellWidth;
  const top = row * cellHeight;

  return sharp(sheet)
    .extract({
      left,
      top,
      width: col === COLS - 1 ? width - left : cellWidth,
      height: row === ROWS - 1 ? height - top : cellHeight,
    })
    .resize(512, 512, { fit: "cover", position: "top" })
    .webp({ quality: 88 })
    .toBuffer();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const sheet = await sharp(SHEET).toBuffer();
  const { width, height } = await sharp(sheet).metadata();
  if (!width || !height) {
    throw new Error("Could not read avatar sheet dimensions");
  }

  const portraitCache = new Map();
  const manifest = [];

  for (const dev of HIRED_DEVELOPER_AVATARS) {
    if (dev.portrait < 1 || dev.portrait > PORTRAIT_COUNT) {
      throw new Error(`Portrait ${dev.portrait} out of range for ${dev.label}`);
    }

    if (!portraitCache.has(dev.portrait)) {
      portraitCache.set(dev.portrait, await cropPortrait(sheet, width, height, dev.portrait));
    }

    const filename = `bay-${String(dev.slot + 1).padStart(2, "0")}-${dev.slug}.webp`;
    const outPath = join(OUT_DIR, filename);
    await writeFile(outPath, portraitCache.get(dev.portrait));
    manifest.push({
      slot: dev.slot,
      slug: dev.slug,
      label: dev.label,
      portrait: dev.portrait,
      path: `/hired-hud/avatars/${filename}`,
    });
    console.log(`wrote ${filename} ← portrait ${dev.portrait}`);
  }

  await writeFile(
    join(OUT_DIR, "manifest.json"),
    `${JSON.stringify(
      {
        generated: new Date().toISOString(),
        source: "scripts/assets/hired-developer-avatar-sheet.png",
        grid: `${ROWS}x${COLS}`,
        avatars: manifest,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  console.log(`done — ${manifest.length} hired developer avatars from portrait sheet`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
