/** Public ops inbox — mailto on site; requires MX at registrar (see .env.example). */
export const USJET_OPS_EMAIL = "ops@usjet.ai";

/** Founder inbox — member gate demo + internal; configure after MX records. */
export const USJET_FOUNDER_EMAIL = "founder@usjet.ai";

/** Optional billing correspondence address. */
export const USJET_BILLING_EMAIL = "billing@usjet.ai";

export function mailtoUsjetOps(subject?: string): string {
  const base = `mailto:${USJET_OPS_EMAIL}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
