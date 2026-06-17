/**
 * Slice the naval officer portrait sheet into hired-developer profile avatars.
 * Source: scripts/assets/hired-developer-avatar-sheet.png (2×5 grid, portraits 1–10).
 *
 * Run: node scripts/generate-hired-developer-avatars.mjs
 */
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SHEET = join(__dirname, "assets/hired-developer-avatar-sheet.png");
const HUD_OUT_DIR = join(ROOT, "public/hired-hud/avatars");
const PRODUCT_OUT_DIR = join(ROOT, "public/fleet/developer-avatars");

const COLS = 5;
const ROWS = 2;
const PORTRAIT_COUNT = COLS * ROWS;

/** Portrait 2 — Mary Stealth keeps original fair skin from the sheet. */
const FAIR_SKIN_PORTRAIT = 2;

/** Ten sovereign hired developers — order matches founder portrait sheet 1–10. */
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

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) {
    return [0, 0, l];
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case rn:
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
      break;
    case gn:
      h = ((bn - rn) / d + 2) / 6;
      break;
    default:
      h = ((rn - gn) / d + 4) / 6;
      break;
  }
  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  const hn = ((h % 360) + 360) % 360 / 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hueToRgb = (t) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };
  return [
    Math.round(hueToRgb(hn + 1 / 3) * 255),
    Math.round(hueToRgb(hn) * 255),
    Math.round(hueToRgb(hn - 1 / 3) * 255),
  ];
}

function isLikelySkinPixel(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  if (l > 0.9 || l < 0.24) return false;
  if (s < 0.09) return false;
  if (g > r + 8 || b > r) return false;
  if (r > 210 && g > 200 && b > 185) return false;
  if (Math.abs(r - g) < 18 && Math.abs(g - b) < 24 && l > 0.76) return false;
  if (h > 62 && h < 335) return false;
  if (l > 0.68 && s > 0.42 && h >= 30 && h <= 56) return false;
  return r >= g - 4 && g >= b - 10;
}

function shiftPixelToBrownSkin(r, g, b, strength = 0.78) {
  if (!isLikelySkinPixel(r, g, b)) return [r, g, b];
  const [h, s, l] = rgbToHsl(r, g, b);
  const targetH = 26;
  const targetS = Math.min(0.54, Math.max(0.3, s * 1.02 + 0.1));
  const targetL = Math.max(0.36, Math.min(0.54, l * 0.5 + 0.12));
  const nextH = h + (targetH - h) * strength;
  const nextS = s + (targetS - s) * strength;
  const nextL = l + (targetL - l) * strength;
  return hslToRgb(nextH, nextS, nextL).map((v) => Math.max(0, Math.min(255, v)));
}

function applyBrownSkinTone(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const [nr, ng, nb] = shiftPixelToBrownSkin(r, g, b);
    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
  }
}

function portraitCell(portraitNumber) {
  const index = portraitNumber - 1;
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  return { col, row };
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

/** Full numbered rectangle from the 2×5 sheet — for hub crew + monitor tiles. */
async function cropHubRectangle(sheet, width, height, portraitNumber, brownSkin = true) {
  const { left, top, rawWidth, rawHeight } = cellBounds(width, height, portraitNumber);
  const insetX = Math.round(rawWidth * 0.02);
  const insetY = Math.round(rawHeight * 0.02);

  const extractWidth = Math.max(1, rawWidth - insetX * 2);
  const extractHeight = Math.max(1, rawHeight - insetY * 2);
  const targetWidth = 512;
  const targetHeight = Math.max(1, Math.round(targetWidth * (extractHeight / extractWidth)));

  const resized = sharp(sheet)
    .extract({
      left: left + insetX,
      top: top + insetY,
      width: extractWidth,
      height: extractHeight,
    })
    .resize(targetWidth, targetHeight, { fit: "fill" });

  if (!brownSkin) {
    return resized.webp({ quality: 90 }).toBuffer();
  }

  const { data, info } = await resized.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  applyBrownSkinTone(data, info.channels);
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .webp({ quality: 90 })
    .toBuffer();
}

/** Tighter face crop for product pages and circular fallbacks. */
async function cropPortrait(sheet, width, height, portraitNumber, brownSkin = true) {
  const { left, top, rawWidth, rawHeight } = cellBounds(width, height, portraitNumber);

  const insetX = Math.round(rawWidth * 0.08);
  const insetTop = Math.round(rawHeight * 0.05);
  const insetBottom = Math.round(rawHeight * 0.16);

  const resized = sharp(sheet)
    .extract({
      left: left + insetX,
      top: top + insetTop,
      width: Math.max(1, rawWidth - insetX * 2),
      height: Math.max(1, rawHeight - insetTop - insetBottom),
    })
    .resize(640, 640, { fit: "cover", position: "top" });

  if (!brownSkin) {
    return resized.webp({ quality: 90 }).toBuffer();
  }

  const { data, info } = await resized.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  applyBrownSkinTone(data, info.channels);
  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .webp({ quality: 90 })
    .toBuffer();
}

async function pruneStaleWebps(dir, keepNames) {
  const keep = new Set(keepNames);
  for (const name of await readdir(dir)) {
    if (name.endsWith(".webp") && !keep.has(name)) {
      await unlink(join(dir, name));
      console.log(`removed stale ${name}`);
    }
  }
}

async function main() {
  await mkdir(HUD_OUT_DIR, { recursive: true });
  await mkdir(PRODUCT_OUT_DIR, { recursive: true });
  const sheet = await sharp(SHEET).toBuffer();
  const { width, height } = await sharp(sheet).metadata();
  if (!width || !height) {
    throw new Error("Could not read avatar sheet dimensions");
  }

  const portraitCache = new Map();
  const hubCache = new Map();
  const manifest = [];
  const hudKeep = [];
  const productKeep = [];

  for (const dev of HIRED_DEVELOPER_AVATARS) {
    if (dev.portrait < 1 || dev.portrait > PORTRAIT_COUNT) {
      throw new Error(`Portrait ${dev.portrait} out of range for ${dev.label}`);
    }

    const brownSkin = dev.portrait !== FAIR_SKIN_PORTRAIT;

    if (!portraitCache.has(dev.portrait)) {
      portraitCache.set(dev.portrait, await cropPortrait(sheet, width, height, dev.portrait, brownSkin));
    }

    if (!hubCache.has(dev.portrait)) {
      hubCache.set(dev.portrait, await cropHubRectangle(sheet, width, height, dev.portrait, brownSkin));
    }

    const buffer = portraitCache.get(dev.portrait);
    const hubBuffer = hubCache.get(dev.portrait);
    const hudFilename = `bay-${String(dev.slot + 1).padStart(2, "0")}-${dev.slug}.webp`;
    const hubFilename = `bay-${String(dev.slot + 1).padStart(2, "0")}-${dev.slug}-hub.webp`;
    const productFilename = `${dev.aircraftSlug}.webp`;

    await writeFile(join(HUD_OUT_DIR, hudFilename), buffer);
    await writeFile(join(HUD_OUT_DIR, hubFilename), hubBuffer);
    await writeFile(join(PRODUCT_OUT_DIR, productFilename), buffer);
    hudKeep.push(hudFilename);
    hudKeep.push(hubFilename);
    productKeep.push(productFilename);

    manifest.push({
      slot: dev.slot,
      slug: dev.slug,
      label: dev.label,
      portrait: dev.portrait,
      aircraftSlug: dev.aircraftSlug,
      path: `/hired-hud/avatars/${hudFilename}`,
      hubPath: `/hired-hud/avatars/${hubFilename}`,
      productPath: `/fleet/developer-avatars/${productFilename}`,
    });
    console.log(
      `wrote ${hubFilename} + ${hudFilename} + ${productFilename} ← portrait ${dev.portrait}${dev.portrait === FAIR_SKIN_PORTRAIT ? " (fair skin)" : " (brown skin)"}`,
    );
  }

  await pruneStaleWebps(HUD_OUT_DIR, hudKeep);
  await pruneStaleWebps(PRODUCT_OUT_DIR, productKeep);

  await writeFile(
    join(HUD_OUT_DIR, "manifest.json"),
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

  console.log(`done — ${manifest.length} hired developer avatars for HUD + product pages`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
