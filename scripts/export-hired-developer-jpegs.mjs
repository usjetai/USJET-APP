/**
 * Export all 17 hired developer US fighter jet vectors as JPEGs.
 * Output: export/hired-developers-jpegs/ + manifest.json
 *
 * Usage: npm run export:hired-developer-jpegs
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "export", "hired-developers-jpegs");
const BG = { r: 2, g: 6, b: 23 };

const STROKE =
  'fill="none" stroke="white" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"';

function wrapAircraftSvg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-hidden="true"><g>${inner}</g></svg>`;
}

const AIRCRAFT_SVGS = {
  sr71: wrapAircraftSvg(
    `<path ${STROKE} d="M40 5 Q38.5 37.5 40 70 Q41.5 37.5 40 5"/><path ${STROKE} d="M40 14 C32 22 8 46 4 54 L18 58 L40 42 L62 58 L76 54 C72 46 48 22 40 14 Z"/><path ${STROKE} d="M40 14 L40 42"/><ellipse ${STROKE} cx="22" cy="44" rx="4.2" ry="6"/><ellipse ${STROKE} cx="58" cy="44" rx="4.2" ry="6"/><path ${STROKE} d="M36 66 L40 74 L44 66"/><path ${STROKE} d="M20 50 L12 54 M60 50 L68 54"/>`,
  ),
  f22: wrapAircraftSvg(
    `<path ${STROKE} d="M40 7 Q38.5 36.5 40 66 Q41.5 36.5 40 7"/><path ${STROKE} d="M40 16 L6 44 L22 50 L40 38 L58 50 L74 44 Z"/><path ${STROKE} d="M34 62 L40 72 L46 62"/><path ${STROKE} d="M18 42 L8 48 M62 42 L72 48"/><path ${STROKE} d="M35 24 L45 24"/>`,
  ),
  f35: wrapAircraftSvg(
    `<path ${STROKE} d="M40 8 Q38.5 36 40 64 Q41.5 36 40 8"/><path ${STROKE} d="M40 18 C34 24 16 40 12 46 L26 50 L40 40 L54 50 L68 46 C64 40 46 24 40 18 Z"/><path ${STROKE} d="M36 58 L40 66 L44 58"/><path ${STROKE} d="M22 40 L14 44 M58 40 L66 44"/>`,
  ),
};

/** Seventeen hired developers — slots, partners, US aircraft names, vector tier. */
const HIRED_DEVELOPERS = [
  { slot: 0, bay: "01", name: "Gemini 3.1", callsign: "BLACKBIRD-01", aircraftOfficialName: "SR-71 Blackbird", aircraftType: "sr71" },
  { slot: 1, bay: "02", name: "ChatGPT-5", callsign: "RAPTOR-01", aircraftOfficialName: "F-22 Raptor", aircraftType: "f22" },
  { slot: 2, bay: "03", name: "Claude 3.5", callsign: "LIGHTNING-01", aircraftOfficialName: "F-35 Lightning II", aircraftType: "f35" },
  { slot: 4, bay: "05", name: "Grok 4.1", callsign: "FELON-01", aircraftOfficialName: "F-15 Eagle", aircraftType: "f22" },
  { slot: 5, bay: "06", name: "Cursor", callsign: "NIGHTHAWK-01", aircraftOfficialName: "F/A-18 Super Hornet", aircraftType: "f35" },
  { slot: 7, bay: "08", name: "Luma Dream", callsign: "X15-ALPHA", aircraftOfficialName: "X-15 Experimental", aircraftType: "sr71" },
  { slot: 8, bay: "09", name: "Sora 2", callsign: "VEO-PRO", aircraftOfficialName: "SR-71B Trainer", aircraftType: "sr71" },
  { slot: 10, bay: "11", name: "Leonardo.ai", callsign: "MIRAGE-01", aircraftOfficialName: "F-35A Lightning II", aircraftType: "f35" },
  { slot: 11, bay: "12", name: "Runway", callsign: "STRATO-01", aircraftOfficialName: "F-16 Fighting Falcon", aircraftType: "f35" },
  { slot: 12, bay: "13", name: "Firefly", callsign: "JUMPJET-01", aircraftOfficialName: "F/A-18E Super Hornet", aircraftType: "f35" },
  { slot: 19, bay: "20", name: "HeyGen", callsign: "HAWK-01", aircraftOfficialName: "F-35C Carrier", aircraftType: "f35" },
  { slot: 20, bay: "21", name: "v0.dev", callsign: "OSPREY-01", aircraftOfficialName: "A-10 Thunderbolt II", aircraftType: "f22" },
  { slot: 22, bay: "23", name: "GitHub Copilot", callsign: "WARTHOG-01", aircraftOfficialName: "F-22 Raptor", aircraftType: "f22" },
  { slot: 23, bay: "24", name: "Consensus", callsign: "DRAGON-01", aircraftOfficialName: "YF-12 Interceptor", aircraftType: "sr71" },
  { slot: 24, bay: "25", name: "Gamma", callsign: "GALAXY-01", aircraftOfficialName: "F-35B STOVL", aircraftType: "f35" },
  { slot: 27, bay: "28", name: "Otter.ai", callsign: "SENTRY-01", aircraftOfficialName: "F-4 Phantom II", aircraftType: "f22" },
  { slot: 29, bay: "30", name: "USJet Origin", callsign: "COMMAND-01", aircraftOfficialName: "F-22 Raptor · Command", aircraftType: "f22", rosterStatus: "command" },
];

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function toJpeg(svg, outputPath) {
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(512, 512, { fit: "contain", background: BG })
    .flatten({ background: BG })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outputPath);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const exported = [];

  for (const dev of HIRED_DEVELOPERS) {
    const svg = AIRCRAFT_SVGS[dev.aircraftType];
    if (!svg) {
      throw new Error(`Missing SVG for aircraft type ${dev.aircraftType}`);
    }
    const fileBase = `bay-${dev.bay}-${slugify(dev.callsign)}-${slugify(dev.aircraftOfficialName)}`;
    const fileName = `${fileBase}.jpg`;
    const outputPath = join(OUT_DIR, fileName);
    await toJpeg(svg, outputPath);
    exported.push({
      ...dev,
      rosterStatus: dev.rosterStatus ?? "hired",
      file: fileName,
      path: `export/hired-developers-jpegs/${fileName}`,
    });
    console.log(`✓ ${fileName}`);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    count: exported.length,
    hiredDevelopers: exported,
  };
  await writeFile(join(OUT_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\nExported ${exported.length} hired developer JPEGs → ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
