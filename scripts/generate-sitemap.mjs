import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://www.usjet.ai";

/** Core + conversion surfaces — align with `src/App.tsx` public marketing routes. */
const STATIC_ENTRIES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/founder", changefreq: "weekly", priority: "0.88" },
  { path: "/gaming", changefreq: "weekly", priority: "0.86" },
  { path: "/vr", changefreq: "weekly", priority: "0.82" },
  { path: "/gamers", changefreq: "weekly", priority: "0.8" },
  { path: "/x", changefreq: "daily", priority: "0.76" },
  { path: "/sovereignty", changefreq: "weekly", priority: "0.85" },
  { path: "/strategic-assets", changefreq: "weekly", priority: "0.85" },
  { path: "/intelligence", changefreq: "weekly", priority: "0.95" },
  { path: "/founders-fuel", changefreq: "weekly", priority: "0.95" },
  { path: "/cash", changefreq: "weekly", priority: "0.88" },
  { path: "/zelle", changefreq: "monthly", priority: "0.65" },
  { path: "/blog", changefreq: "daily", priority: "0.92" },
  { path: "/hangar", changefreq: "weekly", priority: "0.9" },
  { path: "/intel", changefreq: "weekly", priority: "0.9" },
  { path: "/origin", changefreq: "monthly", priority: "0.72" },
  { path: "/founder-special-1995", changefreq: "monthly", priority: "0.78" },
  { path: "/special", changefreq: "monthly", priority: "0.65" },
  { path: "/sos", changefreq: "monthly", priority: "0.55" },
  { path: "/privacy", changefreq: "yearly", priority: "0.5" },
  { path: "/ai-101", changefreq: "weekly", priority: "0.84" },
  { path: "/code-kit", changefreq: "weekly", priority: "0.8" },
  { path: "/b2b", changefreq: "weekly", priority: "0.9" },
  { path: "/b2k", changefreq: "weekly", priority: "0.75" },
  { path: "/pdre", changefreq: "monthly", priority: "0.6" },
  { path: "/licensing", changefreq: "weekly", priority: "0.78" },
  { path: "/support-fleet", changefreq: "weekly", priority: "0.72" },
  { path: "/fleet-manual", changefreq: "weekly", priority: "0.9" },
  { path: "/fleet-directory", changefreq: "weekly", priority: "0.85" },
  { path: "/100k", changefreq: "monthly", priority: "0.72" },
  { path: "/landscape", changefreq: "yearly", priority: "0.35" },
  { path: "/protocol-proof", changefreq: "monthly", priority: "0.45" },
  { path: "/login", changefreq: "yearly", priority: "0.4" },
  { path: "/member/login", changefreq: "yearly", priority: "0.4" },
  { path: "/member", changefreq: "monthly", priority: "0.6" },
  { path: "/cockpit", changefreq: "weekly", priority: "0.7" },
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

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const today = new Date().toISOString().slice(0, 10);
const blogPosts = parseBlogPosts();
const fleetCallsignPages = parseFleetCallsignPages();

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
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.72</priority>\n  </url>`,
  );
}

for (const post of blogPosts) {
  const loc = `${SITE}/blog/${post.slug}`;
  urlRows.push(
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${post.lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
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
