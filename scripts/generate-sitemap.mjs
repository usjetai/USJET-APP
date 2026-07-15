import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://www.usjet.ai";

/**
 * Public marketing + conversion surfaces only.
 * Gated routes (/member, /intel, /origin, /special, /cockpit, /founder-special-1995)
 * stay out of the sitemap — they send noindex via SeoHead.
 */
const STATIC_ENTRIES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/fleet", changefreq: "weekly", priority: "0.98" },
  { path: "/founder", changefreq: "weekly", priority: "0.92" },
  { path: "/blog", changefreq: "daily", priority: "0.95" },
  { path: "/fleet-directory", changefreq: "weekly", priority: "0.9" },
  { path: "/fleet-manual", changefreq: "weekly", priority: "0.88" },
  { path: "/ai-101", changefreq: "weekly", priority: "0.86" },
  { path: "/b2b", changefreq: "weekly", priority: "0.9" },
  { path: "/b2k", changefreq: "weekly", priority: "0.75" },
  { path: "/intelligence", changefreq: "weekly", priority: "0.88" },
  { path: "/strategic-assets", changefreq: "weekly", priority: "0.82" },
  { path: "/sovereignty", changefreq: "weekly", priority: "0.85" },
  { path: "/founders-fuel", changefreq: "weekly", priority: "0.9" },
  { path: "/cash", changefreq: "weekly", priority: "0.8" },
  { path: "/zelle", changefreq: "monthly", priority: "0.65" },
  { path: "/gaming", changefreq: "weekly", priority: "0.8" },
  { path: "/vr", changefreq: "weekly", priority: "0.78" },
  { path: "/gamers", changefreq: "weekly", priority: "0.76" },
  { path: "/x", changefreq: "daily", priority: "0.72" },
  { path: "/100k", changefreq: "monthly", priority: "0.78" },
  { path: "/code-kit", changefreq: "weekly", priority: "0.8" },
  { path: "/licensing", changefreq: "weekly", priority: "0.78" },
  { path: "/support-fleet", changefreq: "weekly", priority: "0.72" },
  { path: "/pdre", changefreq: "monthly", priority: "0.6" },
  { path: "/hired-hud", changefreq: "weekly", priority: "0.7" },
  { path: "/hoops", changefreq: "monthly", priority: "0.55" },
  { path: "/founder/products", changefreq: "monthly", priority: "0.7" },
  { path: "/sos", changefreq: "monthly", priority: "0.55" },
  { path: "/privacy", changefreq: "yearly", priority: "0.45" },
  { path: "/login", changefreq: "monthly", priority: "0.5" },
  { path: "/member/login", changefreq: "monthly", priority: "0.55" },
  { path: "/llms.txt", changefreq: "monthly", priority: "0.7" },
];

function parseBlogPosts() {
  const src = readFileSync(join(ROOT, "src/data/usjetBlog.ts"), "utf8");
  const re = /slug:\s*"([^"]+)"[\s\S]*?publishedAt:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({ slug: m[1], lastmod: m[2] });
  }
  return out;
}

function slugifyFleetCallsign(callsign) {
  return callsign
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugifyAircraftOfficialName(name) {
  return name
    .replace(/\([^)]*\)/g, " ")
    .replace(/·.*$/, " ")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFleetCallsignPages() {
  const src = readFileSync(join(ROOT, "src/data/fleetManifest.ts"), "utf8");
  const re = /callsign:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({ path: `/fleet-directory/${slugifyFleetCallsign(m[1])}` });
  }
  return out;
}

/** Product pages keyed off aircraftSlug in fleetDirectorySeo (same slugify rules). */
function parseFleetProductPages() {
  const rosterSrc = readFileSync(join(ROOT, "src/data/fleetRoster.ts"), "utf8");
  const manifestSrc = readFileSync(join(ROOT, "src/data/fleetManifest.ts"), "utf8");

  // Prefer aircraftSlug strings already present in fleetDirectorySeo build — fall back to callsign slugs.
  const directorySrc = readFileSync(join(ROOT, "src/data/fleetDirectorySeo.ts"), "utf8");
  const aircraftNameFn = directorySrc.includes("slugifyAircraftOfficialName");

  const callsigns = [];
  const callsignRe = /callsign:\s*"([^"]+)"/g;
  let m;
  while ((m = callsignRe.exec(manifestSrc)) !== null) {
    callsigns.push(m[1]);
  }

  // Product URLs use aircraftSlug; for sitemap coverage emit both callsign-based product paths
  // that getFleetDirectoryEntryBySlug can resolve (callsign slug OR aircraft slug).
  const paths = new Set();
  for (const callsign of callsigns) {
    const slug = slugifyFleetCallsign(callsign);
    paths.add(`/product/${slug}`);
  }

  // Also pull official aircraft names from fleetRoster display helpers if present as string literals
  // (best-effort). Primary coverage is callsign slug which the resolver accepts.
  void rosterSrc;
  void aircraftNameFn;
  void slugifyAircraftOfficialName;

  return [...paths].map((path) => ({ path }));
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const today = new Date().toISOString().slice(0, 10);
const blogPosts = parseBlogPosts();
const fleetCallsignPages = parseFleetCallsignPages();
const fleetProductPages = parseFleetProductPages();

const urlRows = [];

for (const row of STATIC_ENTRIES) {
  const loc = `${SITE}${row.path === "/" ? "/" : row.path}`;
  urlRows.push(
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${row.changefreq}</changefreq>\n    <priority>${row.priority}</priority>\n  </url>`,
  );
}

for (const page of fleetCallsignPages) {
  const loc = `${SITE}${page.path}`;
  urlRows.push(
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.78</priority>\n  </url>`,
  );
}

for (const page of fleetProductPages) {
  const loc = `${SITE}${page.path}`;
  urlRows.push(
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.74</priority>\n  </url>`,
  );
}

for (const post of blogPosts) {
  const loc = `${SITE}/blog/${post.slug}`;
  urlRows.push(
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${post.lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`,
  );
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlRows.join("\n")}
</urlset>
`;

const outPath = join(ROOT, "public/sitemap.xml");
writeFileSync(outPath, xml, "utf8");
console.info(`sitemap written (${urlRows.length} URLs) → ${outPath}`);
