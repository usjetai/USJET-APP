/**
 * Generate USJET.AI fleet trucker cap mockups — foam front: USJET.AI brand, jet emblem, jet name only.
 *
 * Run: node scripts/generate-fleet-cap-products.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public/fleet");
const CAP_BASE = join(__dirname, "assets/cap-base.png");

const CANVAS = 1024;
const SHEET_BG = { r: 207, g: 196, b: 166 };

const BRAND_Y = 216;
const LOGO_TOP = 238;
const LOGO_MAX_WIDTH = 360;
const LOGO_MAX_HEIGHT = 176;
const JET_NAME_Y = 432;

const FLEET_CAP_AIRCRAFT = [
  { slug: "sr-71-blackbird", name: "SR-71 Blackbird", logo: "/fleet/sr71-blackbird-logo.png" },
  { slug: "f-35-lightning-ii", name: "F-35 Lightning II", logo: "/assets/fleet-logos/f35_lightning_ii.png" },
  { slug: "b-21-raider", name: "B-21 Raider", logo: "/assets/fleet-logos/b21_raider.png" },
  { slug: "j-36", name: "J-36", logo: "/assets/fleet-logos/j36_fighter.png" },
  { slug: "ngad-platform", name: "NGAD Platform", logo: "/assets/fleet-logos/ngad_platform.png" },
  { slug: "yf-23-black-widow-ii", name: "YF-23 Black Widow II", logo: "/assets/fleet-logos/yf23_black_widow_ii.png" },
  { slug: "x-47b", name: "X-47B", logo: "/assets/fleet-logos/x47b.png" },
  { slug: "x-37b", name: "X-37B", logo: "/assets/fleet-logos/x37b.png" },
  { slug: "x-51-waverider", name: "X-51 Waverider", logo: "/assets/fleet-logos/x51_waverider.png" },
  { slug: "pca", name: "PCA", logo: "/assets/fleet-logos/pca_aircraft.png" },
  { slug: "b-2-spirit", name: "B-2 Spirit", logo: "/assets/fleet-logos/b2_spirit.png" },
  { slug: "b-1-lancer", name: "B-1 Lancer", logo: "/assets/fleet-logos/b1_lancer.png" },
  { slug: "a-12-avenger-ii", name: "A-12 Avenger II", logo: "/assets/fleet-logos/a12_avenger_ii.png" },
  { slug: "f-22-raptor", name: "F-22 Raptor", logo: "/assets/fleet-logos/f22_raptor.png" },
  { slug: "fb-22", name: "FB-22", logo: "/assets/fleet-logos/fb22.png" },
  { slug: "f-15ex-eagle-ii", name: "F-15EX Eagle II", logo: "/assets/fleet-logos/f15ex_eagle_ii.png" },
  { slug: "f-16v-viper", name: "F-16V Viper", logo: "/assets/fleet-logos/f16v_viper.png" },
  { slug: "f-a-18-block-iii", name: "F/A-18 Super Hornet", logo: "/assets/fleet-logos/fa18_super_hornet.png" },
  { slug: "a-10-warthog", name: "A-10 Warthog", logo: "/assets/fleet-logos/a10_warthog.png" },
  { slug: "f-117-nighthawk", name: "F-117 Nighthawk", logo: "/assets/fleet-logos/f117_nighthawk.png" },
  { slug: "mq-25-stingray", name: "MQ-25 Stingray", logo: "/assets/fleet-logos/mq25_stingray.png" },
  { slug: "mq-28-ghost-bat", name: "MQ-28 Ghost Bat", logo: "/assets/fleet-logos/mq28_ghost_bat.png" },
  { slug: "xq-58-valkyrie", name: "XQ-58 Valkyrie", logo: "/assets/fleet-logos/xq58_valkyrie.png" },
  { slug: "rq-180", name: "RQ-180", logo: "/assets/fleet-logos/rq180.png" },
  { slug: "rq-4-global-hawk", name: "RQ-4 Global Hawk", logo: "/assets/fleet-logos/rq4_global_hawk.png" },
  { slug: "f-14-tomcat", name: "F-14 Tomcat", logo: "/assets/fleet-logos/f14_tomcat.png" },
  { slug: "f-4-phantom-ii", name: "F-4 Phantom II", logo: "/assets/fleet-logos/f4_phantom_ii.png" },
  { slug: "f-104-starfighter", name: "F-104 Starfighter", logo: "/assets/fleet-logos/f104_starfighter.png" },
  { slug: "f-86-sabre", name: "F/A-XX", logo: "/assets/fleet-logos/fa_xx.png" },
  { slug: "x-59-quesst", name: "X-59 QueSST", logo: "/assets/fleet-logos/x59_quesst.png" },
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function capJetLabel(name) {
  return name.replace(" (US JET Concept)", "").trim();
}

function jetNameFontSize(name) {
  if (name.length > 24) {
    return 13;
  }
  if (name.length > 18) {
    return 14;
  }
  return 16;
}

function createCapDesignSvg(jetName) {
  const safeJet = escapeXml(capJetLabel(jetName));
  const jetFontSize = jetNameFontSize(safeJet);

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <text x="512" y="${BRAND_Y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" letter-spacing="2.4" fill="#111111">USJET.AI</text>
  <text x="512" y="${JET_NAME_Y}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${jetFontSize}" font-weight="700" letter-spacing="1" fill="#1a1a1a">${safeJet}</text>
</svg>`);
}

async function loadCapBase() {
  return sharp(CAP_BASE)
    .resize(CANVAS, CANVAS, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0 },
    })
    .png()
    .toBuffer();
}

async function removeTanBackground(inputPath) {
  const { data, info } = await sharp(join(ROOT, "public", inputPath.replace(/^\//, "")))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const nearTan =
      Math.abs(r - SHEET_BG.r) < 30 &&
      Math.abs(g - SHEET_BG.g) < 30 &&
      Math.abs(b - SHEET_BG.b) < 30;
    if (nearTan) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function prepareGarmentLogo(logo) {
  const inputPath = join(ROOT, "public", logo.replace(/^\//, ""));
  let pipeline =
    logo.startsWith("/fleet/") || logo.startsWith("/assets/")
      ? await (logo.startsWith("/fleet/")
          ? sharp(inputPath).ensureAlpha()
          : removeTanBackground(logo))
      : sharp(inputPath).ensureAlpha();

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  let lumSum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 20) {
      lumSum += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      count++;
    }
  }

  const avgLum = count ? lumSum / count : 128;
  if (avgLum > 185) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 20) {
        data[i] = 26;
        data[i + 1] = 26;
        data[i + 2] = 26;
      }
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function generateCap({ slug, name, logo }) {
  const outPath = join(OUT_DIR, `${slug}-cap-product.webp`);
  const base = await loadCapBase();
  const designLayer = await sharp(createCapDesignSvg(name)).png().toBuffer();

  const logoPipeline = await prepareGarmentLogo(logo);
  const logoMeta = await logoPipeline.metadata();
  const scale = Math.min(LOGO_MAX_WIDTH / logoMeta.width, LOGO_MAX_HEIGHT / logoMeta.height);
  const logoWidth = Math.round(logoMeta.width * scale);
  const logoHeight = Math.round(logoMeta.height * scale);
  const logoBuffer = await logoPipeline.resize(logoWidth, logoHeight, { fit: "inside" }).png().toBuffer();
  const logoLeft = Math.round((CANVAS - logoWidth) / 2);
  const logoTop = Math.round(LOGO_TOP + (LOGO_MAX_HEIGHT - logoHeight) / 2);

  await sharp(base)
    .composite([
      { input: designLayer, left: 0, top: 0 },
      { input: logoBuffer, left: logoLeft, top: logoTop },
    ])
    .webp({ quality: 92 })
    .toFile(outPath);

  return { slug, name, outPath: `public/fleet/${slug}-cap-product.webp` };
}

await mkdir(OUT_DIR, { recursive: true });
const results = [];
for (const aircraft of FLEET_CAP_AIRCRAFT) {
  results.push(await generateCap(aircraft));
  console.log(`✓ ${aircraft.slug}`);
}

const manifestPath = join(OUT_DIR, "cap-product-manifest.json");
await writeFile(manifestPath, JSON.stringify(results, null, 2));
console.log(`\nGenerated ${results.length} cap product images.`);
