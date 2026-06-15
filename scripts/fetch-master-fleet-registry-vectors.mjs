/**
 * Fetch public-domain / open-license SVG silhouettes for all 30 Master Fleet
 * Registry aircraft into public/assets/vectors/ with descriptive filenames.
 *
 * Run: node scripts/fetch-master-fleet-registry-vectors.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "assets", "vectors");
const UA = "USJET-AssetBot/1.0 (https://www.usjet.ai; master fleet vector acquisition)";

const TOP_VIEW_FRACTION = 0.38;

/** @type {Array<{
 *   out: string;
 *   aircraft: string;
 *   source: "commons" | "openclipart" | "generated";
 *   commons?: string;
 *   url?: string;
 *   note: string;
 *   threeView?: boolean;
 *   viewBoxCrop?: { xFraction?: number; yFraction?: number; wFraction?: number; hFraction?: number };
 *   proxyOf?: string;
 * }>} */
const REGISTRY = [
  {
    out: "f22_raptor.svg",
    aircraft: "F-22 Raptor",
    source: "commons",
    commons: "Lockheed Martin F-22 Raptor 3-view.svg",
    note: "USAF PD — F-22 Raptor top plan (cropped from 3-view)",
    threeView: true,
  },
  {
    out: "f35_lightning_ii.svg",
    aircraft: "F-35 Lightning II",
    source: "commons",
    commons: "F16 drawing.svg",
    note: "US Government PD — F-16 top plan proxy for F-35 Lightning II tier",
    threeView: true,
    proxyOf: "F-35 Lightning II",
  },
  {
    out: "b21_raider.svg",
    aircraft: "B-21 Raider",
    source: "commons",
    commons: "B-2 Sprit template.svg",
    note: "B-2 Spirit plan template proxy for B-21 flying-wing bomber",
    proxyOf: "B-21 Raider",
  },
  {
    out: "j36_fighter.svg",
    aircraft: "J-36 Fighter",
    source: "commons",
    commons: "Lockheed YF-22 Lightning II 3-view.svg",
    note: "YF-22 prototype top plan proxy for J-36 sixth-gen concept",
    threeView: true,
    proxyOf: "J-36 Fighter",
  },
  {
    out: "ngad_platform.svg",
    aircraft: "NGAD Platform",
    source: "commons",
    commons: "YF-22 et YF-23.svg",
    note: "YF-23 plan (right half of composite) proxy for NGAD sixth-gen platform",
    viewBoxCrop: { xFraction: 0.52, wFraction: 0.48 },
    proxyOf: "NGAD Platform",
  },
  {
    out: "yf23_black_widow_ii.svg",
    aircraft: "YF-23 Black Widow II",
    source: "commons",
    commons: "YF-22 et YF-23.svg",
    note: "YF-23 Black Widow II top plan (right half of YF-22/YF-23 composite)",
    viewBoxCrop: { xFraction: 0.52, wFraction: 0.48 },
  },
  {
    out: "x47b.svg",
    aircraft: "X-47B",
    source: "commons",
    commons: "X-47B.svg",
    note: "Northrop Grumman X-47B UCAS plan view",
    threeView: true,
  },
  {
    out: "x37b.svg",
    aircraft: "X-37B",
    source: "commons",
    commons: "Generic turbofan airplane.svg",
    note: "Generic turbofan plan proxy for X-37B orbital test vehicle",
    proxyOf: "X-37B",
  },
  {
    out: "x51_waverider.svg",
    aircraft: "X-51 Waverider",
    source: "commons",
    commons: "Generic turbofan airplane.svg",
    note: "Generic plan proxy for X-51 hypersonic cruiser (no PD SVG found)",
    proxyOf: "X-51 Waverider",
  },
  {
    out: "pca_aircraft.svg",
    aircraft: "PCA Aircraft",
    source: "commons",
    commons: "Lockheed YF-22 Lightning II 3-view.svg",
    note: "YF-22 top plan proxy for PCA (Penetrating Counter Air) concept",
    threeView: true,
    proxyOf: "PCA Aircraft",
  },
  {
    out: "b2_spirit.svg",
    aircraft: "B-2 Spirit",
    source: "commons",
    commons: "B-2 Sprit template.svg",
    note: "B-2 Spirit plan template",
  },
  {
    out: "b1_lancer.svg",
    aircraft: "B-1 Lancer",
    source: "commons",
    commons: "Boeing B-52 Stratofortress evolution, part 1.svg",
    note: "B-52 evolution silhouette proxy for B-1 Lancer swept-wing bomber",
    proxyOf: "B-1 Lancer",
  },
  {
    out: "a12_avenger_ii.svg",
    aircraft: "A-12 Avenger II",
    source: "commons",
    commons: "Lockheed F-117A Nighthawk.svg",
    note: "F-117 plan proxy for A-12 Avenger II stealth strike concept",
    proxyOf: "A-12 Avenger II",
  },
  {
    out: "sr72_darkstar.svg",
    aircraft: "SR-72 DarkStar",
    source: "commons",
    commons: "Lockheed SR-71A 3view.svg",
    note: "SR-71 Blackbird top plan proxy for SR-72 DarkStar concept",
    threeView: true,
    proxyOf: "SR-72 DarkStar",
  },
  {
    out: "fb22.svg",
    aircraft: "FB-22",
    source: "commons",
    commons: "Lockheed YF-22 Lightning II 3-view.svg",
    note: "YF-22 top plan proxy for FB-22 regional bomber concept",
    threeView: true,
    proxyOf: "FB-22",
  },
  {
    out: "f15ex_eagle_ii.svg",
    aircraft: "F-15EX Eagle II",
    source: "commons",
    commons: "McDonnell Douglas F-15 Eagle 3-view.svg",
    note: "F-15 Eagle top plan (cropped from 3-view)",
    threeView: true,
  },
  {
    out: "f16v_viper.svg",
    aircraft: "F-16V Viper",
    source: "commons",
    commons: "F16 drawing.svg",
    note: "F-16 Fighting Falcon top plan (cropped from 3-view)",
    threeView: true,
  },
  {
    out: "fa18_super_hornet.svg",
    aircraft: "FA-18 Super Hornet",
    source: "openclipart",
    url: "https://openclipart.org/download/325489/fa-18-hornet.svg",
    note: "OpenClipart CC0 — U.S. Navy F/A-18 Hornet (public domain source art)",
  },
  {
    out: "a10_warthog.svg",
    aircraft: "A-10 Warthog",
    source: "commons",
    commons: "Fairchild Republic A-10 Thunderbolt II 3-view.svg",
    note: "A-10 Thunderbolt II top plan (cropped from 3-view)",
    threeView: true,
  },
  {
    out: "f117_nighthawk.svg",
    aircraft: "F-117 Nighthawk",
    source: "commons",
    commons: "Lockheed F-117A Nighthawk.svg",
    note: "F-117A Nighthawk plan view",
  },
  {
    out: "mq25_stingray.svg",
    aircraft: "MQ-25 Stingray",
    source: "commons",
    commons: "General Atomics MQ-1 Predator miniature profile silhouette.svg",
    note: "MQ-1 Predator UAV silhouette proxy for MQ-25 Stingray tanker drone",
    proxyOf: "MQ-25 Stingray",
  },
  {
    out: "mq28_ghost_bat.svg",
    aircraft: "MQ-28 Ghost Bat",
    source: "commons",
    commons: "General Atomics MQ-1 Predator miniature profile silhouette.svg",
    note: "MQ-1 Predator UAV silhouette proxy for MQ-28 Ghost Bat",
    proxyOf: "MQ-28 Ghost Bat",
  },
  {
    out: "xq58_valkyrie.svg",
    aircraft: "XQ-58 Valkyrie",
    source: "commons",
    commons: "Generic turbofan airplane.svg",
    note: "Generic plan proxy for XQ-58 Valkyrie loyal wingman (no PD SVG found)",
    proxyOf: "XQ-58 Valkyrie",
  },
  {
    out: "rq180.svg",
    aircraft: "RQ-180",
    source: "commons",
    commons: "General Atomics MQ-1 Predator miniature profile silhouette.svg",
    note: "MQ-1 Predator silhouette proxy for RQ-180 stealth ISR",
    proxyOf: "RQ-180",
  },
  {
    out: "rq4_global_hawk.svg",
    aircraft: "RQ-4 Global Hawk",
    source: "commons",
    commons: "General Atomics MQ-1 Predator miniature profile silhouette.svg",
    note: "MQ-1 Predator silhouette proxy for RQ-4 Global Hawk HALE UAV",
    proxyOf: "RQ-4 Global Hawk",
  },
  {
    out: "f14_tomcat.svg",
    aircraft: "F-14 Tomcat",
    source: "generated",
    note: "USJET wireframe paths derived from PD Grumman F-14 Tomcat.png plan proportions (Commons: no SVG line art)",
  },
  {
    out: "f4_phantom_ii.svg",
    aircraft: "F-4 Phantom II",
    source: "commons",
    commons: "McDonnell Douglas F-4E Phantom II 3-view line drawing.svg",
    note: "F-4E Phantom II top plan (cropped from 3-view)",
    threeView: true,
  },
  {
    out: "f104_starfighter.svg",
    aircraft: "F-104 Starfighter",
    source: "commons",
    commons: "Lockheed F-104C Starfighter.svg",
    note: "F-104 Starfighter plan view",
  },
  {
    out: "f86_sabre.svg",
    aircraft: "F-86 Sabre",
    source: "commons",
    commons: "North American F-86K Sabre line drawings.svg",
    note: "F-86 Sabre top plan (cropped from line drawings)",
    threeView: true,
  },
  {
    out: "x59_quesst.svg",
    aircraft: "X-59 QueSST",
    source: "commons",
    commons: "Generic turbofan airplane.svg",
    note: "Generic plan proxy for X-59 QueSST low-boom demonstrator",
    proxyOf: "X-59 QueSST",
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveCommonsUrls(fileTitles) {
  const unique = [...new Set(fileTitles)];
  const map = new Map();
  const chunkSize = 8;

  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    const titles = chunk.map((f) => `File:${f}`).join("|");
    const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|mime&format=json`;
    const res = await fetch(api, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      throw new Error(`Commons API ${res.status}`);
    }
    const data = await res.json();
    for (const page of Object.values(data.query.pages)) {
      const title = page.title?.replace(/^File:/, "");
      const info = page.imageinfo?.[0];
      if (title && info?.url && info.mime === "image/svg+xml") {
        map.set(title, info.url);
      }
    }
    if (i + chunkSize < unique.length) {
      await sleep(1200);
    }
  }

  return map;
}

function parseSvgNumber(value) {
  if (!value) {
    return null;
  }
  const num = Number.parseFloat(String(value).replace(/[a-z%]+$/i, "").trim());
  return Number.isFinite(num) ? num : null;
}

function parseViewBox(svg) {
  const match = svg.match(/viewBox="([^"]+)"/i);
  if (!match) {
    return null;
  }
  const parts = match[1].trim().split(/[\s,]+/).map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
    return null;
  }
  return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
}

function pathPointSamples(d) {
  const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi)?.map(Number) ?? [];
  const points = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    points.push({ x: nums[i], y: nums[i + 1] });
  }
  return points;
}

function contentBBox(svg) {
  const paths = [...svg.matchAll(/\sd="([^"]+)"/gi)].map((m) => m[1]);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const d of paths) {
    for (const { x, y } of pathPointSamples(d)) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (!Number.isFinite(minX)) {
    return null;
  }

  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function resolveCanvasBox(svg) {
  const viewBox = parseViewBox(svg);
  if (viewBox) {
    return viewBox;
  }

  const width = parseSvgNumber(svg.match(/\bwidth="([^"]+)"/i)?.[1]);
  const height = parseSvgNumber(svg.match(/\bheight="([^"]+)"/i)?.[1]);
  if (width && height) {
    return { x: 0, y: 0, w: width, h: height };
  }

  return contentBBox(svg);
}

function setViewBox(svg, x, y, w, h) {
  const pad = Math.max(w, h) * 0.03;
  const vb = `${x - pad} ${y - pad} ${w + pad * 2} ${h + pad * 2}`;
  if (/viewBox="/i.test(svg)) {
    return svg.replace(/viewBox="[^"]*"/i, `viewBox="${vb}"`);
  }
  return svg.replace(/<svg\b/i, `<svg viewBox="${vb}"`);
}

function extractTopPlanView(svg, { threeView = false } = {}) {
  if (!threeView) {
    return svg;
  }

  const canvas = resolveCanvasBox(svg);
  if (!canvas || canvas.h <= 0 || canvas.w <= 0) {
    return svg;
  }

  const topHeight = canvas.h * TOP_VIEW_FRACTION;
  return setViewBox(svg, canvas.x, canvas.y, canvas.w, topHeight);
}

function applyViewBoxCrop(svg, crop) {
  const canvas = resolveCanvasBox(svg);
  if (!canvas) {
    return svg;
  }

  const xFrac = crop.xFraction ?? 0;
  const yFrac = crop.yFraction ?? 0;
  const wFrac = crop.wFraction ?? 1;
  const hFrac = crop.hFraction ?? 1;

  const x = canvas.x + canvas.w * xFrac;
  const y = canvas.y + canvas.h * yFrac;
  const w = canvas.w * wFrac;
  const h = canvas.h * hFrac;

  return setViewBox(svg, x, y, w, h);
}

function normalizeSvg(svg, asset) {
  const start = svg.indexOf("<svg");
  if (start < 0) {
    throw new Error(`Invalid SVG for ${asset.out}`);
  }
  let body = svg.slice(start).trim();
  body = extractTopPlanView(body, asset);
  if (asset.viewBoxCrop) {
    body = applyViewBoxCrop(body, asset.viewBoxCrop);
  }
  if (!/preserveAspectRatio=/i.test(body)) {
    body = body.replace(/<svg\b/i, '<svg preserveAspectRatio="xMidYMid meet"');
  } else {
    body = body.replace(/preserveAspectRatio="[^"]*"/i, 'preserveAspectRatio="xMidYMid meet"');
  }
  if (!/role=/i.test(body)) {
    body = body.replace(/<svg\b/i, '<svg role="img" aria-hidden="true"');
  }
  return `${body}\n`;
}

function f14TomcatWireframeSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
  <g fill="none" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M60 6 C44 10 18 34 14 46 L28 48 L42 40 L60 52 L78 40 L92 48 L106 46 C102 34 76 10 60 6 Z" />
    <path d="M60 6 L60 52" />
    <path d="M42 22 L78 22" />
    <path d="M24 38 L8 46 M96 38 L112 46" />
    <path d="M34 48 L22 56 M86 48 L98 56" />
  </g>
</svg>
`;
}

async function downloadText(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (res.ok) {
      const text = await res.text();
      if (text.includes("<svg")) {
        return text;
      }
      throw new Error(`Not SVG content from ${url}`);
    }
    if (attempt < retries) {
      await sleep(1500 * attempt);
    } else {
      throw new Error(`Download failed ${res.status}: ${url}`);
    }
  }
  throw new Error(`Download failed: ${url}`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const commonsTitles = REGISTRY.filter((a) => a.source === "commons").map((a) => a.commons);
  const commonsMap = await resolveCommonsUrls(commonsTitles);

  const manifest = [];
  const downloadedUrls = new Map();

  for (const asset of REGISTRY) {
    let raw;

    if (asset.source === "generated") {
      raw = f14TomcatWireframeSvg();
    } else if (asset.source === "openclipart") {
      raw = await downloadText(asset.url);
      await sleep(800);
    } else {
      const url = commonsMap.get(asset.commons);
      if (!url) {
        throw new Error(`No Commons SVG URL for ${asset.commons} (${asset.out})`);
      }
      if (!downloadedUrls.has(url)) {
        downloadedUrls.set(url, await downloadText(url));
        await sleep(900);
      }
      raw = downloadedUrls.get(url);
    }

    const normalized = normalizeSvg(raw, asset);
    await writeFile(join(OUT_DIR, asset.out), normalized, "utf8");

    manifest.push({
      file: asset.out,
      aircraft: asset.aircraft,
      source: asset.source,
      commons: asset.commons ?? null,
      url: asset.url ?? commonsMap.get(asset.commons ?? "") ?? null,
      note: asset.note,
      proxyOf: asset.proxyOf ?? null,
      threeView: Boolean(asset.threeView),
      viewBoxCrop: asset.viewBoxCrop ?? null,
    });

    console.log(`✓ ${asset.out} ← ${asset.commons ?? asset.url ?? "generated"}`);
  }

  const readme = `# Master Fleet Registry vectors

Regenerate: \`npm run fetch:master-fleet-vectors\`

30 aircraft silhouettes for the USJET Master Fleet Registry. Sources are Wikimedia Commons (public domain / US Government), OpenClipart (CC0), or USJET-generated wireframes where no PD SVG exists.

| File | Aircraft | Source | Notes |
|------|----------|--------|-------|
${manifest
  .map((m) => {
    const src =
      m.source === "commons"
        ? `[${m.commons}](https://commons.wikimedia.org/wiki/File:${encodeURIComponent(m.commons).replace(/%20/g, "_")})`
        : m.source === "openclipart"
          ? `[OpenClipart](${m.url})`
          : "USJET generated";
  return `| \`${m.file}\` | ${m.aircraft} | ${src} | ${m.note}${m.proxyOf ? ` *(proxy)*` : ""} |`;
  })
  .join("\n")}

All assets use \`preserveAspectRatio="xMidYMid meet"\`. Multi-view Commons sheets are cropped to the **top plan view** for fleet wireframe icons.
`;

  await writeFile(join(OUT_DIR, "README.md"), readme, "utf8");
  await writeFile(
    join(OUT_DIR, "manifest.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), registryCount: manifest.length, assets: manifest }, null, 2)}\n`,
    "utf8",
  );

  console.log(`\nWrote ${manifest.length} vectors to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
