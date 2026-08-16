import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = "https://www.usjet.ai";

/**
 * Public marketing + conversion surfaces only.
 * Gated routes (/member, /intel, /origin, /special, /cockpit)
 * stay out of the sitemap — they send noindex via SeoHead.
 */
const STATIC_ENTRIES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/fleet", changefreq: "weekly", priority: "0.98" },
  { path: "/blog", changefreq: "daily", priority: "0.95" },
  { path: "/compare", changefreq: "weekly", priority: "0.96" },
  { path: "/compare/chatgpt-alternative", changefreq: "weekly", priority: "0.95" },
  { path: "/compare/ai-tool-sprawl", changefreq: "weekly", priority: "0.95" },
  { path: "/compare/custom-ai-build", changefreq: "weekly", priority: "0.95" },
  { path: "/compare/chatgpt-vs-claude-vs-gemini-one-screen", changefreq: "weekly", priority: "0.95" },
  { path: "/compare/best-ai-tools-for-contractors", changefreq: "weekly", priority: "0.95" },
  { path: "/compare/blue-collar-ai-tools", changefreq: "weekly", priority: "0.95" },
  { path: "/compare/all-in-one-ai-dashboard", changefreq: "weekly", priority: "0.95" },
  { path: "/ai-101", changefreq: "weekly", priority: "0.86" },
  { path: "/store/ai-computers", changefreq: "weekly", priority: "0.9" },
  { path: "/store/ai-computers/homes", changefreq: "weekly", priority: "0.93" },
  { path: "/store/ai-computers/businesses", changefreq: "weekly", priority: "0.93" },
  { path: "/sos", changefreq: "monthly", priority: "0.55" },
  { path: "/privacy", changefreq: "yearly", priority: "0.45" },
  { path: "/terms", changefreq: "yearly", priority: "0.45" },
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

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const today = new Date().toISOString().slice(0, 10);
const blogPosts = parseBlogPosts();

const urlRows = [];

for (const row of STATIC_ENTRIES) {
  const loc = `${SITE}${row.path === "/" ? "/" : row.path}`;
  urlRows.push(
    `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${row.changefreq}</changefreq>\n    <priority>${row.priority}</priority>\n  </url>`,
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
