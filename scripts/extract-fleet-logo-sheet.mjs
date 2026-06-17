/**
 * Extract 30 Master Fleet logos from the USJET beige portrait reference sheet.
 * Preserves the sheet's tan background color in each logo tile.
 *
 * Run: node scripts/extract-fleet-logo-sheet.mjs [path-to-sheet.png]
 */
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DEFAULT_SHEET = join(ROOT, "public/assets/fleet-logos/usjet-fleet-sheet-source.png");
const OUT_DIR = join(ROOT, "public/assets/fleet-logos");

/** Sampled from usjet-fleet-sheet-source.png empty regions. */
const SHEET_BG = { r: 207, g: 196, b: 166, alpha: 255 };

/** 4-column portrait grid on 616×1024 reference art. */
const COLS = [
  [42, 158],
  [158, 274],
  [274, 390],
  [410, 574],
];
const ROWS = [
  [190, 285],
  [304, 405],
  [418, 534],
  [534, 620],
  [620, 700],
  [700, 775],
  [775, 850],
  [880, 998],
];

function cell(row, col) {
  const [x0, x1] = COLS[col];
  const [y0, y1] = ROWS[row];
  return [x0, y0, x1, y1];
}

/** Center US JET · QX58 hero illustration (3/4 view). */
const CENTER_XQ58 = [190, 385, 425, 575];

const SILHOUETTE_HEIGHT_FRACTION = 0.72;

/** Slot index → crop rect [x0, y0, x1, y1]. */
const SLOT_RECTS = [
  cell(0, 0), // f22
  cell(0, 3), // f35
  cell(0, 1), // b21
  cell(7, 2), // j36
  cell(4, 0), // ngad (PCA proxy)
  cell(0, 2), // yf23
  cell(2, 0), // x47b
  cell(2, 1), // x37b
  cell(2, 1), // x51 (X-37B proxy)
  cell(3, 3), // pca
  cell(1, 0), // b2
  cell(1, 1), // b1
  cell(3, 0), // a12
  cell(6, 0), // darkstar (RQ-180 proxy)
  cell(1, 2), // fb22
  cell(1, 3), // f15ex
  cell(4, 3), // f16v
  cell(7, 3), // fa18
  cell(5, 0), // a10
  cell(5, 1), // f117
  cell(5, 2), // mq25
  cell(5, 3), // mq28
  CENTER_XQ58, // xq58
  cell(6, 1), // rq180
  cell(6, 2), // globalHawk (RQ-4)
  cell(6, 3), // f14
  cell(7, 0), // f4
  cell(7, 1), // f104
  cell(7, 1), // f86 (F-104 proxy)
  cell(4, 3), // x59 (F-16V proxy)
];

const ASSETS = [
  { out: "f22_raptor.png", aircraftType: "f22" },
  { out: "f35_lightning_ii.png", aircraftType: "f35" },
  { out: "b21_raider.png", aircraftType: "b21" },
  { out: "j36_fighter.png", aircraftType: "j36" },
  { out: "ngad_platform.png", aircraftType: "ngad" },
  { out: "yf23_black_widow_ii.png", aircraftType: "yf23" },
  { out: "x47b.png", aircraftType: "x47b" },
  { out: "x37b.png", aircraftType: "x37b" },
  { out: "x51_waverider.png", aircraftType: "x51" },
  { out: "pca_aircraft.png", aircraftType: "pca" },
  { out: "b2_spirit.png", aircraftType: "b2" },
  { out: "b1_lancer.png", aircraftType: "b1" },
  { out: "a12_avenger_ii.png", aircraftType: "a12" },
  { out: "sr72_darkstar.png", aircraftType: "darkstar" },
  { out: "fb22.png", aircraftType: "fb22" },
  { out: "f15ex_eagle_ii.png", aircraftType: "f15ex" },
  { out: "f16v_viper.png", aircraftType: "f16v" },
  { out: "fa18_super_hornet.png", aircraftType: "fa18" },
  { out: "a10_warthog.png", aircraftType: "a10" },
  { out: "f117_nighthawk.png", aircraftType: "f117" },
  { out: "mq25_stingray.png", aircraftType: "mq25" },
  { out: "mq28_ghost_bat.png", aircraftType: "mq28" },
  { out: "xq58_valkyrie.png", aircraftType: "xq58" },
  { out: "rq180.png", aircraftType: "rq180" },
  { out: "rq4_global_hawk.png", aircraftType: "globalHawk" },
  { out: "f14_tomcat.png", aircraftType: "f14" },
  { out: "f4_phantom_ii.png", aircraftType: "f4" },
  { out: "f104_starfighter.png", aircraftType: "f104" },
  { out: "f86_sabre.png", aircraftType: "f86" },
  { out: "x59_quesst.png", aircraftType: "x59" },
];

const PROXY_SLOTS = new Set([4, 8, 13, 22, 28, 29]);

function silhouetteRect([x0, y0, x1, y1]) {
  const height = y1 - y0;
  return [x0, y0, x1, Math.round(y0 + height * SILHOUETTE_HEIGHT_FRACTION)];
}

async function extractSlot(sheetPath, rect) {
  const [x0, y0, x1, y1] = silhouetteRect(rect);
  const width = x1 - x0;
  const height = y1 - y0;

  return sharp(sheetPath)
    .extract({ left: x0, top: y0, width, height })
    .resize(384, 384, {
      fit: "contain",
      background: SHEET_BG,
    })
    .png()
    .toBuffer();
}

async function main() {
  const sheetPath = process.argv[2] ? join(process.cwd(), process.argv[2]) : DEFAULT_SHEET;
  await mkdir(OUT_DIR, { recursive: true });

  const manifest = [];

  for (let i = 0; i < ASSETS.length; i++) {
    const asset = ASSETS[i];
    const rect = SLOT_RECTS[i];
    const png = await extractSlot(sheetPath, rect);
    await writeFile(join(OUT_DIR, asset.out), png);
    manifest.push({
      file: asset.out,
      aircraftType: asset.aircraftType,
      slot: i,
      rect,
      silhouetteRect: silhouetteRect(rect),
      background: SHEET_BG,
      note: PROXY_SLOTS.has(i) ? "Proxy crop — matched sibling on reference sheet" : null,
    });
    console.log(`✓ ${asset.out}`);
  }

  if (sheetPath !== DEFAULT_SHEET) {
    await copyFile(sheetPath, DEFAULT_SHEET);
  }

  await writeFile(
    join(OUT_DIR, "manifest.json"),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceSheet: "usjet-fleet-sheet-source.png",
        sheetSize: "616x1024 portrait",
        background: SHEET_BG,
        assets: manifest,
      },
      null,
      2,
    )}\n`,
  );

  await writeFile(
    join(OUT_DIR, "README.md"),
    `# USJET Master Fleet logos

Source: \`usjet-fleet-sheet-source.png\` — Founder beige portrait reference sheet.

Regenerate: \`npm run extract:fleet-logos\`

Each tile keeps the sheet's tan background (\`#cfc4a6\` / rgb(207, 196, 166)) with white aircraft art as printed.
`,
  );

  console.log(`\nWrote ${manifest.length} logos to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
