/** Public ops inbox — mailto on site; requires MX at registrar (see .env.example). */
export const USJET_OPS_EMAIL = "ops@usjet.ai";

/** Institutional identity — founder grit: eight years in the trade (est. 2018). */
export const USJET_ENTITY_FOOTER = "USJET LLC · Established in 2018" as const;

/** Support routing — Origin first; email is async (founder not on-call). */
export const SUPPORT_POLICY = {
  primary: "SOS lane: Origin (voice AI)",
  email: `For customer service, email OPS at ${USJET_OPS_EMAIL}`,
} as const;

/** Founder inbox — member gate demo + internal; configure after MX records. */
export const USJET_FOUNDER_EMAIL = "founder@usjet.ai";

/** Optional billing correspondence address. */
export const USJET_BILLING_EMAIL = "billing@usjet.ai";

export function mailtoUsjetOps(subject?: string): string {
  const base = `mailto:${USJET_OPS_EMAIL}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** Member Portal — assignment save acknowledgement (institutional hold line). */
export const MEMBER_ASSIGNMENT_HOLD_MESSAGE =
  "Our representatives are still helping other customers. Please continue to hold." as const;
