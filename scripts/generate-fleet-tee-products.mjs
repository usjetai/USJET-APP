/**
 * Generate USJET.AI fleet tee product mockups — interior chest design with developer
 * portrait, name, jet name, AI name, and aircraft emblem.
 *
 * Run: node scripts/generate-fleet-tee-products.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { resolveTeeCrew } from "./fleet-tee-roster.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public/fleet");
const TEE_BASE = join(__dirname, "assets/tee-base.png");

const CANVAS = 1024;
const SHEET_BG = { r: 207, g: 196, b: 166 };

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

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function fitText(text, maxChars) {
  if (text.length <= maxChars) {
    return text;
  }
  return `${text.slice(0, maxChars - 1)}…`;
}

function createInteriorDesignSvg({ developerName, aiDomain, jetName, hasPortrait }) {
  const safeDeveloper = developerName ? escapeXml(fitText(developerName.toUpperCase(), 22)) : "";
  const safeJet = escapeXml(fitText(jetName, 28));
  const safeAi = escapeXml(fitText(aiDomain, 34));

  const aiFontSize = safeAi.length > 22 ? 15 : safeAi.length > 18 ? 16 : 18;

  const portraitY = hasPortrait ? 352 : 0;
  const nameY = hasPortrait ? 518 : 372;
  const jetY = hasPortrait ? 556 : 418;
  const aiY = hasPortrait ? 586 : 452;
  const logoY = hasPortrait ? 612 : 488;
  const dividerY = hasPortrait ? 332 : 348;

  const developerBlock = developerName
    ? `<text x="512" y="${nameY}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" letter-spacing="2.5" fill="#111111">${safeDeveloper}</text>`
    : "";

  const portraitPlaceholder = hasPortrait
    ? ""
    : `<text x="512" y="392" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="2" fill="#444444">SOVEREIGN FLEET CREW</text>`;

  return Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <text x="512" y="308" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="800" letter-spacing="3.5" fill="#111111">USJET.AI</text>
  <line x1="332" y1="${dividerY}" x2="692" y2="${dividerY}" stroke="#222222" stroke-width="2" opacity="0.55"/>
  ${portraitPlaceholder}
  ${developerBlock}
  <text x="512" y="${jetY}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="700" letter-spacing="1.2" fill="#1a1a1a">JET · ${safeJet}</text>
  <text x="512" y="${aiY}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${aiFontSize}" font-weight="600" letter-spacing="1.1" fill="#444444">AI · ${safeAi}</text>
  <rect id="logo-slot" x="312" y="${logoY}" width="400" height="170" fill="none"/>
</svg>`);
}

async function loadTeeBase() {
  return sharp(TEE_BASE)
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

async function createCircularPortrait(portraitPath, size) {
  const inputPath = join(ROOT, "public", portraitPath.replace(/^\//, ""));
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`,
  );
  const ring = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size + 12}" height="${size + 12}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${(size + 12) / 2}" cy="${(size + 12) / 2}" r="${size / 2 + 4}" fill="none" stroke="#111111" stroke-width="4"/>
  <circle cx="${(size + 12) / 2}" cy="${(size + 12) / 2}" r="${size / 2 + 1}" fill="none" stroke="#d4d4d4" stroke-width="1.5"/>
</svg>`);

  const portrait = await sharp(inputPath)
    .resize(size, size, { fit: "cover", position: "centre" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(ring)
    .composite([{ input: portrait, left: 6, top: 6 }])
    .png()
    .toBuffer();
}

async function generateTee({ slug, name, logo }) {
  const outPath = join(OUT_DIR, `${slug}-tee-product.webp`);
  const crew = resolveTeeCrew(slug);
  const base = await loadTeeBase();
  const designSvg = createInteriorDesignSvg({
    developerName: crew.developerName,
    aiDomain: crew.aiDomain,
    jetName: name,
    hasPortrait: crew.hasPortrait,
  });
  const designLayer = await sharp(designSvg).png().toBuffer();

  const logoMaxWidth = crew.hasPortrait ? 320 : 360;
  const logoMaxHeight = crew.hasPortrait ? 150 : 190;
  const logoTop = crew.hasPortrait ? 618 : 494;

  const logoPipeline = await prepareGarmentLogo(logo);
  const logoMeta = await logoPipeline.metadata();
  const scale = Math.min(logoMaxWidth / logoMeta.width, logoMaxHeight / logoMeta.height);
  const logoWidth = Math.round(logoMeta.width * scale);
  const logoHeight = Math.round(logoMeta.height * scale);
  const logoBuffer = await logoPipeline.resize(logoWidth, logoHeight, { fit: "inside" }).png().toBuffer();
  const logoLeft = Math.round((CANVAS - logoWidth) / 2);

  const composites = [
    { input: designLayer, left: 0, top: 0 },
    { input: logoBuffer, left: logoLeft, top: logoTop },
  ];

  if (crew.hasPortrait && crew.portrait) {
    const portraitSize = 132;
    const portraitBuffer = await createCircularPortrait(crew.portrait, portraitSize);
    composites.splice(1, 0, {
      input: portraitBuffer,
      left: Math.round((CANVAS - portraitSize - 12) / 2),
      top: 346,
    });
  }

  await sharp(base).composite(composites).webp({ quality: 92 }).toFile(outPath);

  return {
    slug,
    name,
    developerName: crew.developerName,
    aiDomain: crew.aiDomain,
    hasPortrait: crew.hasPortrait,
    outPath: `public/fleet/${slug}-tee-product.webp`,
  };
}

await mkdir(OUT_DIR, { recursive: true });
const results = [];
for (const aircraft of FLEET_TEE_AIRCRAFT) {
  results.push(await generateTee(aircraft));
  console.log(`✓ ${aircraft.slug}${results.at(-1).developerName ? ` · ${results.at(-1).developerName}` : ""}`);
}

const manifestPath = join(OUT_DIR, "tee-product-manifest.json");
await writeFile(manifestPath, JSON.stringify(results, null, 2));
console.log(`\nGenerated ${results.length} crew tee product images.`);
