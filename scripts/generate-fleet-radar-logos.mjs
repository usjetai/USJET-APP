/**
 * Key light sheet/white backgrounds out of fleet logos for the Hired HUD radar scope.
 * Output: public/assets/fleet-logos/radar-transparent/*.png
 *
 * Run: node scripts/generate-fleet-radar-logos.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public/assets/fleet-logos/radar-transparent");

/** Tan sheet color from usjet-fleet-sheet-source.png */
const SHEET_BG = { r: 207, g: 196, b: 166 };

const SOURCES = [
  ...new Set([
    "public/assets/fleet-logos/f22_raptor.png",
    "public/assets/fleet-logos/f35_lightning_ii.png",
    "public/assets/fleet-logos/b21_raider.png",
    "public/assets/fleet-logos/j36_fighter.png",
    "public/assets/fleet-logos/ngad_platform.png",
    "public/assets/fleet-logos/yf23_black_widow_ii.png",
    "public/assets/fleet-logos/x47b.png",
    "public/assets/fleet-logos/x37b.png",
    "public/assets/fleet-logos/x51_waverider.png",
    "public/assets/fleet-logos/pca_aircraft.png",
    "public/assets/fleet-logos/b2_spirit.png",
    "public/assets/fleet-logos/b1_lancer.png",
    "public/assets/fleet-logos/a12_avenger_ii.png",
    "public/assets/fleet-logos/sr72_darkstar.png",
    "public/assets/fleet-logos/fb22.png",
    "public/assets/fleet-logos/f15ex_eagle_ii.png",
    "public/assets/fleet-logos/f16v_viper.png",
    "public/assets/fleet-logos/fa18_super_hornet.png",
    "public/assets/fleet-logos/a10_warthog.png",
    "public/assets/fleet-logos/f117_nighthawk.png",
    "public/assets/fleet-logos/mq25_stingray.png",
    "public/assets/fleet-logos/mq28_ghost_bat.png",
    "public/assets/fleet-logos/xq58_valkyrie.png",
    "public/assets/fleet-logos/rq180.png",
    "public/assets/fleet-logos/rq4_global_hawk.png",
    "public/assets/fleet-logos/f14_tomcat.png",
    "public/assets/fleet-logos/f4_phantom_ii.png",
    "public/assets/fleet-logos/f104_starfighter.png",
    "public/assets/fleet-logos/f86_sabre.png",
    "public/assets/fleet-logos/x59_quesst.png",
    "public/fleet/sr71-blackbird-logo.png",
  ]),
];

function isBackgroundPixel(r, g, b) {
  if (r >= 232 && g >= 232 && b >= 232) {
    return true;
  }

  const dr = r - SHEET_BG.r;
  const dg = g - SHEET_BG.g;
  const db = b - SHEET_BG.b;
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);
  if (distance <= 36 && r >= 150 && g >= 140 && b >= 120) {
    return true;
  }

  if (r >= 210 && g >= 200 && b >= 175 && Math.abs(r - g) < 24) {
    return true;
  }

  return false;
}

async function keyLogo(relativePath) {
  const inputPath = join(ROOT, relativePath);
  const filename = basename(relativePath);
  const outputPath = join(OUT_DIR, filename);

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

  await sharp(data, { raw: { width, height, channels } }).png().toFile(outputPath);
  return filename;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = [];

  for (const source of SOURCES) {
    const filename = await keyLogo(source);
    manifest.push({ source, radarPath: `/assets/fleet-logos/radar-transparent/${filename}` });
    console.log(`wrote radar-transparent/${filename}`);
  }

  await writeFile(
    join(OUT_DIR, "manifest.json"),
    `${JSON.stringify({ generated: new Date().toISOString(), logos: manifest }, null, 2)}\n`,
    "utf8",
  );

  console.log(`done — ${manifest.length} radar scope logos`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
