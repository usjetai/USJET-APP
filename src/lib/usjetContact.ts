/** Single USJET inbox — all site contact mailto links use this address. */
export const USJET_OPS_EMAIL = "ops@usjet.ai";

/** @deprecated All routes consolidated to ops@usjet.ai — forward at Porkbun → iCloud. */
export const USJET_APP_EMAIL = USJET_OPS_EMAIL;

/** Cash App cashtag — peer payments / tips / manual settlement. */
export const USJET_CASH_APP_CASHTAG = "$USJET" as const;

export const USJET_CASH_APP_URL = "https://cash.app/$USJET" as const;

/** Institutional identity — founder grit: eight years in the trade (est. 2018). */
export const USJET_ENTITY_FOOTER = "USJET LLC · Established in 2018" as const;

/** Support routing — Origin first; email is async (founder not on-call). */
export const SUPPORT_POLICY = {
  primary: "Instant help: Origin (voice AI)",
  email: `Email ${USJET_OPS_EMAIL}: responses within 1–3 business days`,
} as const;

/** Founder inbox — member gate demo + internal; configure after MX records. */
export const USJET_FOUNDER_EMAIL = "founder@usjet.ai";

/** Optional billing correspondence address. */
export const USJET_BILLING_EMAIL = "billing@usjet.ai";

export function mailtoUsjetOps(subject?: string): string {
  const base = `mailto:${USJET_OPS_EMAIL}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

export function mailtoUsjetApp(subject?: string): string {
  const base = `mailto:${USJET_APP_EMAIL}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** Member Portal — assignment save acknowledgement (institutional hold line). */
export const MEMBER_ASSIGNMENT_HOLD_MESSAGE =
  "Our representatives are still helping other customers. Please continue to hold." as const;
