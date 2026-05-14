/** Flight Pass ($19.90/mo) — hard-wired Stripe Payment Link (Direct Landing Protocol). */
export const FLIGHT_PASS_DIRECT_URL = "https://buy.stripe.com/8x25kDeSG2JB38d39Bdwc02";

/** Hangar Pro ($49.95/mo) — hard-wired Stripe Payment Link (Direct Landing Protocol). */
export const HANGAR_PRO_DIRECT_URL = "https://buy.stripe.com/5kQ8wP11Qbg75gl4dFdwc03";

/** Enterprise Fleet Commander ($199.99/mo) — hard-wired Stripe Payment Link (Direct Landing Protocol). */
export const ENTERPRISE_DIRECT_URL = "https://buy.stripe.com/cNi6oHcKy4RJ38d11tdwc04";

export type StripeTierPaymentId = "founder" | "hangar-pro" | "fleet-command";

/** Flight Pass ($19.90/mo) — env override when set, else FLIGHT_PASS_DIRECT_URL. */
export function resolveFounderPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_FOUNDER_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : FLIGHT_PASS_DIRECT_URL;
}

/** Hangar Pro ($49.95/mo) — env override when set, else HANGAR_PRO_DIRECT_URL. */
export function resolveHangarProPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_PRO_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : HANGAR_PRO_DIRECT_URL;
}

/** Enterprise ($199.99/mo) — env override when set, else ENTERPRISE_DIRECT_URL. */
export function resolveEnterprisePaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_ENTERPRISE_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : ENTERPRISE_DIRECT_URL;
}

/** Resolve the direct extraction port for a Special-page tier. */
export function resolvePaymentLinkForTier(tierId: StripeTierPaymentId): string {
  switch (tierId) {
    case "founder":
      return resolveFounderPaymentLink();
    case "hangar-pro":
      return resolveHangarProPaymentLink();
    case "fleet-command":
      return resolveEnterprisePaymentLink();
  }
}

/** Returns true when a Stripe Payment Link URL is configured and safe to navigate to. */
export function isUsableStripePaymentLink(url: string | undefined): url is string {
  const trimmed = url?.trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed.includes("your_stripe_link_here")) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" && parsed.hostname.endsWith("stripe.com");
  } catch {
    return false;
  }
}
