/** Canonical hostname for hreflang, OG, canonical, JSON-LD (apex redirects to www in production). */

export const SITE_ORIGIN = "https://www.usjet.ai" as const;

/** Normalize SPA path for canonical (no hash/query, no trailing slash except root — Google treats both similarly; www is canonical.) */
export function normalizeSeoPath(pathname: string): string {
  const raw = pathname.split("?")[0]?.split("#")[0] ?? "/";
  const trimmed = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;
  return trimmed || "/";
}

export function canonicalHref(pathname: string): string {
  const path = normalizeSeoPath(pathname);
  if (path === "/") {
    return `${SITE_ORIGIN}/`;
  }
  return `${SITE_ORIGIN}${path}`;
}
