/**
 * Generate USJET.AI fleet tee product mockups for every aircraft product page.
 * White crew neck tee, black USJET.AI chest text, aircraft logo centered below.
 *
 * Run: node scripts/generate-fleet-tee-products.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public/fleet");
const LOGO_DIR = join(ROOT, "public/assets/fleet-logos");

const CANVAS = 1024;
const SHEET_BG = { r: 207, g: 196, b: 166 };

/** Slug, display name (for logs), logo file relative to public/ */
const FLEET_TEE_AIRCRAFT = [
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
  { slug: "f-a-18-block-iii", name: "F/A-18 Block III", logo: "/assets/fleet-logos/fa18_super_hornet.png" },
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
  { slug: "f-86-sabre", name: "F-86 Sabre", logo: "/assets/fleet-logos/f86_sabre.png" },
  { slug: "x-59-quesst", name: "X-59 QueSST", logo: "/assets/fleet-logos/x59_quesst.png" },
];

function createTeeMockupSvg() {
  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e8e8e8"/>
      <stop offset="100%" stop-color="#c8c8c8"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="${CANVAS}" height="${CANVAS}" fill="url(#bg)"/>
  <g filter="url(#shadow)">
    <path fill="#ffffff" d="M 220 260 L 310 210 L 400 250 L 512 230 L 624 250 L 714 210 L 804 260 L 770 340 L 790 920 L 234 920 L 254 340 Z"/>
    <path fill="#f0f0f0" d="M 430 250 Q 512 270 594 250 Q 560 310 512 315 Q 464 310 430 250 Z"/>
    <path fill="#ffffff" d="M 220 260 L 180 340 L 210 380 L 254 340 Z"/>
    <path fill="#ffffff" d="M 804 260 L 844 340 L 814 380 L 770 340 Z"/>
    <path fill="#f5f5f5" d="M 234 920 L 254 340 L 770 340 L 790 920 Z" opacity="0.35"/>
  </g>
  <text x="512" y="430" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" letter-spacing="3" fill="#111111">USJET.AI</text>
</svg>`);
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
    const nearWhite = r > 240 && g > 240 && b > 240;
    if (nearTan || nearWhite) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function loadLogoPipeline(logo) {
  const inputPath = join(ROOT, "public", logo.replace(/^\//, ""));
  if (logo.startsWith("/fleet/")) {
    return sharp(inputPath).ensureAlpha();
  }
  return removeTanBackground(logo);
}

async function generateTee({ slug, name, logo }) {
  const outPath = join(OUT_DIR, `${slug}-tee-product.webp`);
  const base = await sharp(createTeeMockupSvg()).png().toBuffer();

  const logoPipeline = await loadLogoPipeline(logo);
  const logoMeta = await logoPipeline.metadata();
  const logoMaxWidth = 300;
  const logoMaxHeight = 200;
  const scale = Math.min(logoMaxWidth / logoMeta.width, logoMaxHeight / logoMeta.height, 1);
  const logoWidth = Math.round(logoMeta.width * scale);
  const logoHeight = Math.round(logoMeta.height * scale);

  const logoBuffer = await (await loadLogoPipeline(logo))
    .resize(logoWidth, logoHeight, { fit: "inside" })
    .png()
    .toBuffer();

  const left = Math.round((CANVAS - logoWidth) / 2);
  const top = 470;

  await sharp(base)
    .composite([{ input: logoBuffer, left, top }])
    .webp({ quality: 90 })
    .toFile(outPath);

  return { slug, name, outPath: `public/fleet/${slug}-tee-product.webp` };
}

await mkdir(OUT_DIR, { recursive: true });
const results = [];
for (const aircraft of FLEET_TEE_AIRCRAFT) {
  results.push(await generateTee(aircraft));
  console.log(`✓ ${aircraft.slug}`);
}

const manifestPath = join(OUT_DIR, "tee-product-manifest.json");
await writeFile(manifestPath, JSON.stringify(results, null, 2));
console.log(`\nGenerated ${results.length} tee product images.`);
