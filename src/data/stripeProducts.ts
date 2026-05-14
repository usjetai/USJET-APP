import type { MemberTier } from "../types/member";

/** Stripe product / price metadata keys — paste identical keys in Stripe Dashboard. */
export const STRIPE_METADATA_KEYS = {
  role: "Role",
  access: "Access",
  tier: "Tier",
} as const;

export type StripeProductMetadata = {
  [STRIPE_METADATA_KEYS.role]: string;
  [STRIPE_METADATA_KEYS.access]: string;
  [STRIPE_METADATA_KEYS.tier]: string;
};

/** Bank-ready Hangar Pro ($49.95/mo) — mirror in Stripe Product settings. */
export const HANGAR_PRO_STRIPE = {
  id: "hangar-pro",
  name: "Hangar Pro",
  priceCents: 4995,
  priceDisplay: "$49.95",
  period: "/mo",
  statementDescriptor: "USJET.AI-HANGAR-PRO",
  description:
    "Full access to the USJET Sovereign Cockpit. Includes real-time AI Fleet networking, 30-unit Hangar connectivity, and live Intel Pulse dashboard (Crypto/NYSE). Integrated for high-velocity labor and enterprise founders. No dead iframes—direct flight links only.",
  metadata: {
    [STRIPE_METADATA_KEYS.role]: "PRIME-OPERATOR",
    [STRIPE_METADATA_KEYS.access]: "FULL-FLEET-SYNC",
    [STRIPE_METADATA_KEYS.tier]: "FOUNDER-LEVEL",
  } satisfies StripeProductMetadata,
  /** Internal cockpit tier granted when Stripe metadata matches Hangar Pro. */
  memberTier: "USJET-PRIME-ACTIVE" as MemberTier,
  paymentLinkEnvKey: "VITE_STRIPE_PRO_PAYMENT_LINK",
} as const;

/** Dashboard paste sheet — Product → Description, Statement descriptor, Metadata. */
export const HANGAR_PRO_STRIPE_DASHBOARD = {
  productName: HANGAR_PRO_STRIPE.name,
  description: HANGAR_PRO_STRIPE.description,
  statementDescriptor: HANGAR_PRO_STRIPE.statementDescriptor,
  metadata: HANGAR_PRO_STRIPE.metadata,
  recurringPrice: HANGAR_PRO_STRIPE.priceDisplay + HANGAR_PRO_STRIPE.period,
} as const;

/** Map Stripe Product metadata to internal MemberTier without touching master keys. */
export function memberTierFromStripeMetadata(
  metadata: Record<string, string> | null | undefined,
  fallback: MemberTier = "USJET-PRIME-ACTIVE",
): MemberTier {
  if (!metadata) {
    return fallback;
  }

  const role = metadata[STRIPE_METADATA_KEYS.role]?.trim().toUpperCase();
  const access = metadata[STRIPE_METADATA_KEYS.access]?.trim().toUpperCase();
  const tier = metadata[STRIPE_METADATA_KEYS.tier]?.trim().toUpperCase();

  const hangarProRole = HANGAR_PRO_STRIPE.metadata[STRIPE_METADATA_KEYS.role].toUpperCase();
  const hangarProAccess = HANGAR_PRO_STRIPE.metadata[STRIPE_METADATA_KEYS.access].toUpperCase();
  const hangarProTier = HANGAR_PRO_STRIPE.metadata[STRIPE_METADATA_KEYS.tier].toUpperCase();

  if (
    role === hangarProRole ||
    access === hangarProAccess ||
    tier === hangarProTier
  ) {
    return HANGAR_PRO_STRIPE.memberTier;
  }

  return fallback;
}
