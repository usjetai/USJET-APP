/** Member Deck ($5/mo) — paste your live Payment Link after creating the product in Stripe. */
export const MEMBER_DECK_DIRECT_URL = "";

/** Flight Pass ($19.90/mo) — hard-wired Stripe Payment Link (Direct Landing Protocol). */
export const FLIGHT_PASS_DIRECT_URL = "https://buy.stripe.com/00w4gzaCq83V5gl8tVdwc01";

/** Hangar Pro ($49.95/mo) — hard-wired Stripe Payment Link (Direct Landing Protocol). */
export const HANGAR_PRO_DIRECT_URL = "https://buy.stripe.com/5kQ8wP11Qbg75gl4dFdwc03";

/** Enterprise Fleet Commander ($199.99/mo) — hard-wired Stripe Payment Link (Direct Landing Protocol). */
export const ENTERPRISE_DIRECT_URL = "https://buy.stripe.com/cNi6oHcKy4RJ38d11tdwc04";

/** Sovereign Fleet Protocol Volume I ($100,000) — hard-wired Stripe Payment Link. */
export const BLUEPRINT_100K_DIRECT_URL = "https://buy.stripe.com/bJeeVd39Y2JBaAF9xZdwc05";

/** USJET Code Kit ($499) — paste live Payment Link from Stripe Dashboard. */
export const CODE_KIT_DIRECT_URL = "";

/** Fleet Manual Professional ($2,500) — hard-wired Stripe Payment Link. */
export const FLEET_MANUAL_DIRECT_URL = "https://buy.stripe.com/14AaEX7qefwn8sxh0rdwc06";

/** SR-71 Blackbird diecast model — hard-wired Stripe Payment Link for the product page. */
export const SR71_BLACKBIRD_PRODUCT_DIRECT_URL = "https://buy.stripe.com/8x2aEX39YfwndMRbG7dwc0r";

/** SR-71 Blackbird diecast model — env override when set, else SR71_BLACKBIRD_PRODUCT_DIRECT_URL. */
export function resolveSr71BlackbirdProductPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_SR71_BLACKBIRD_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : SR71_BLACKBIRD_PRODUCT_DIRECT_URL;
}

/** USJET.AI SR-71 Tee — hard-wired Stripe Payment Link for the product lineup. */
export const SR71_BLACKBIRD_TEE_DIRECT_URL = "https://buy.stripe.com/aFa28r7qe0Bt38dbG7dwc0u";

/** USJET.AI SR-71 Tee — env override when set, else SR71_BLACKBIRD_TEE_DIRECT_URL. */
export function resolveSr71BlackbirdTeePaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_SR71_BLACKBIRD_TEE_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : SR71_BLACKBIRD_TEE_DIRECT_URL;
}

/** F-35 Lightning II plastic model kit — hard-wired Stripe Payment Link for the product page. */
export const F35_LIGHTNING_II_PRODUCT_DIRECT_URL = "https://buy.stripe.com/dRm14n9ymbg738ddOfdwc0s";

/** F-35 Lightning II plastic model kit — env override when set, else F35_LIGHTNING_II_PRODUCT_DIRECT_URL. */
export function resolveF35LightningIiProductPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_F35_LIGHTNING_II_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : F35_LIGHTNING_II_PRODUCT_DIRECT_URL;
}

/** B-21 Raider 3D print model — hard-wired Stripe Payment Link for the product page. */
export const B21_RAIDER_PRODUCT_DIRECT_URL = "https://buy.stripe.com/fZu6oH4e283VaAF8tVdwc0t";

/** B-21 Raider 3D print model — env override when set, else B21_RAIDER_PRODUCT_DIRECT_URL. */
export function resolveB21RaiderProductPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_B21_RAIDER_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : B21_RAIDER_PRODUCT_DIRECT_URL;
}

/** J-36 (US JET Concept) model kit — hard-wired Stripe Payment Link for the product page. */
export const J36_PRODUCT_DIRECT_URL = "https://buy.stripe.com/8x214n25UfwncIN9xZdwc0v";

/** J-36 model kit — env override when set, else J36_PRODUCT_DIRECT_URL. */
export function resolveJ36ProductPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_J36_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : J36_PRODUCT_DIRECT_URL;
}

/** USJET Code Kit ($499) — env override when set, else CODE_KIT_DIRECT_URL when configured. */
export function resolveCodeKitPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_CODE_KIT_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : CODE_KIT_DIRECT_URL.trim();
}

/** Fleet Manual Professional ($2,500) — env override when set, else FLEET_MANUAL_DIRECT_URL. */
export function resolveFleetManualPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_FLEET_MANUAL_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : FLEET_MANUAL_DIRECT_URL;
}

/** Sovereign Fleet Blueprint ($100,000) — env override when set, else BLUEPRINT_100K_DIRECT_URL. */
export function resolve100kPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_100K_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : BLUEPRINT_100K_DIRECT_URL;
}

export type StripeTierPaymentId = "founder" | "hangar-pro" | "fleet-command";

/** Gamer-Founder Kit ($99) — env override when set. */
export const GAMER_FOUNDER_KIT_DIRECT_URL = "";

export function resolveGamerFounderKitPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_GAMER_FOUNDER_KIT_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : GAMER_FOUNDER_KIT_DIRECT_URL.trim();
}

/** Member Deck ($5/mo) — env override when set, else MEMBER_DECK_DIRECT_URL. */
export function resolveMemberDeckPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_MEMBER_DECK_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : MEMBER_DECK_DIRECT_URL.trim();
}

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

/** Digital Sovereignty playbook ($49) — Stripe Payment Link when published. */
export const DIGITAL_SOVEREIGNTY_BOOK_DIRECT_URL = "";

/** Digital Sovereignty playbook ($49) — env override when set. */
export function resolveDigitalSovereigntyBookPaymentLink(): string {
  const url = import.meta.env.VITE_STRIPE_DIGITAL_SOVEREIGNTY_BOOK_PAYMENT_LINK?.trim();
  return isUsableStripePaymentLink(url) ? url : DIGITAL_SOVEREIGNTY_BOOK_DIRECT_URL.trim();
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
