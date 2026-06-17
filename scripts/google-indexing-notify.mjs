/**
 * Optional Google Indexing API notifier (batch URL_UPDATED).
 *
 * Requirements:
 *   - GCP project with "Web Search Indexing API" enabled
 *   - Service account added as owner in Google Search Console
 *   - Env: GOOGLE_SERVICE_ACCOUNT_JSON — raw JSON of the service account key
 *
 * Reads URLs from public/sitemap.xml (<loc>). Run after build:
 *     npm run build && npm run seo:ping-indexing
 *
 * Without credentials, exits 0 (no-op) so CI does not fail.
 */

import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function parseSitemapLocs() {
  const path = join(ROOT, "public/sitemap.xml");
  if (!existsSync(path)) {
    console.warn("No public/sitemap.xml — run npm run build (prebuild generates sitemap) first.");
    return [];
  }
  const xml = readFileSync(path, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const credRaw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!credRaw) {
    console.info("seo:ping-indexing — GOOGLE_SERVICE_ACCOUNT_JSON not set; skipping Indexing API.");
    return;
  }

  let GoogleAuth;
  try {
    ({ GoogleAuth } = await import("google-auth-library"));
  } catch {
    console.warn("Install devDependency: google-auth-library — npm i -D google-auth-library");
    process.exit(0);
  }

  const urls = parseSitemapLocs();
  if (!urls.length) {
    return;
  }

  let credentials;
  try {
    credentials = JSON.parse(credRaw);
  } catch {
    console.error("GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON.");
    process.exit(1);
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) {
    console.error("Could not obtain access token for Indexing API.");
    process.exit(1);
  }

  const endpoint = "https://indexing.googleapis.com/v3/urlNotifications:publish";
  let ok = 0;
  let fail = 0;

  for (const url of urls) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, type: "URL_UPDATED" }),
    });
    if (res.ok) {
      ok += 1;
    } else {
      fail += 1;
      const text = await res.text();
      console.warn(`Indexing API ${res.status} for ${url}: ${text.slice(0, 200)}`);
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  console.info(`Indexing API complete: ${ok} ok, ${fail} failed (${urls.length} total).`);
}

await main();
