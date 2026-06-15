/**
 * Fetch public-domain / openly licensed aircraft SVGs from Wikimedia Commons
 * into public/assets/vectors/. Run: node scripts/fetch-fleet-vector-assets.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "assets", "vectors");
const UA = "USJET-AssetBot/1.0 (https://www.usjet.ai; fleet vector acquisition)";

/** Fleet type → Wikimedia Commons file title */
const ASSETS = [
  {
    out: "sr71.svg",
    commons: "Lockheed SR-71A 3view.svg",
    note: "USAF public domain — SR-71 Blackbird top plan (cropped from 3-view)",
    threeView: true,
  },
  {
    out: "f22.svg",
    commons: "Lockheed YF-22 Lightning II 3-view.svg",
    note: "F-22 Raptor prototype top plan (cropped from YF-22 3-view)",
    threeView: true,
  },
  {
    out: "f35.svg",
    commons: "F16 drawing.svg",
    note: "US Government — F-16 top plan (cropped from 3-view; F-35 tier)",
    threeView: true,
  },
  {
    out: "b2.svg",
    commons: "B-2 Sprit template.svg",
    note: "B-2 Spirit plan template",
  },
  {
    out: "b52.svg",
    commons: "Boeing B-52 Stratofortress evolution, part 1.svg",
    note: "B-52 Stratofortress evolution silhouette",
  },
  {
    out: "c130.svg",
    commons: "Lockheed C-130H Hercules Line Drawing.svg",
    note: "C-130H Hercules top plan (cropped from line drawing)",
    threeView: true,
  },
  {
    out: "globalHawk.svg",
    commons: "General Atomics MQ-1 Predator miniature profile silhouette.svg",
    note: "UAV silhouette (Global Hawk tier — MQ-1 Predator PD SVG)",
  },
  {
    out: "v22.svg",
    commons: "Bell Boeing MV-22 Osprey line drawing.svg",
    note: "MV-22 Osprey top plan (cropped from line drawing)",
    threeView: true,
  },
  {
    out: "cessna.svg",
    commons: "Robin DR400 silhouette.svg",
    note: "Light GA silhouette (open bay placeholder)",
  },
  {
    out: "bizjet.svg",
    commons: "Generic turbofan airplane.svg",
    note: "Generic turbofan plan view",
  },
];

async function commonsUrl(fileTitle) {
  const title = encodeURIComponent(`File:${fileTitle}`);
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    throw new Error(`Commons API ${res.status} for ${fileTitle}`);
  }
  const data = await res.json();
  const page = Object.values(data.query.pages)[0];
  const url = page?.imageinfo?.[0]?.url;
  if (!url) {
    throw new Error(`No image URL for ${fileTitle}`);
  }
  return url;
}

const TOP_VIEW_FRACTION = 0.38;

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

/** Crop 3-view orthographic sheets to the top plan view only. */
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

function normalizeSvg(svg, outName, asset) {
  const start = svg.indexOf("<svg");
  if (start < 0) {
    throw new Error(`Invalid SVG for ${outName}`);
  }
  let body = svg.slice(start).trim();
  body = extractTopPlanView(body, asset);
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

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest = [];

  for (const asset of ASSETS) {
    const url = await commonsUrl(asset.commons);
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) {
      throw new Error(`Download failed ${res.status}: ${asset.commons}`);
    }
    const raw = await res.text();
    const normalized = normalizeSvg(raw, asset.out, asset);
    const dest = join(OUT_DIR, asset.out);
    await writeFile(dest, normalized, "utf8");
    manifest.push({ file: asset.out, commons: asset.commons, sourceUrl: url, note: asset.note });
    console.log(`✓ ${asset.out} ← ${asset.commons}`);
  }

  const readme = `# Fleet aircraft vectors (Wikimedia Commons)

Regenerate: \`node scripts/fetch-fleet-vector-assets.mjs\`

| File | Commons source | Notes |
|------|----------------|-------|
${manifest.map((m) => `| \`${m.file}\` | [${m.commons}](https://commons.wikimedia.org/wiki/File:${encodeURIComponent(m.commons).replace(/%20/g, "_")}) | ${m.note} |`).join("\n")}

All assets are SVG format with \`preserveAspectRatio="xMidYMid meet"\`. Multi-view Commons sources are cropped to the **top plan view** for fleet logos.
`;

  await writeFile(join(OUT_DIR, "README.md"), readme, "utf8");
  await writeFile(join(OUT_DIR, "manifest.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), assets: manifest }, null, 2)}\n`, "utf8");
  console.log(`\nWrote ${manifest.length} vectors to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
