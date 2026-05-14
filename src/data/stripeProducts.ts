import type { MemberTier } from "../types/member";

/** Stripe product metadata keys — paste identical keys in Stripe Dashboard. */
export const STRIPE_METADATA_KEYS = {
  tier: "tier",
  accessLevel: "access_level",
  legacyId: "legacy_id",
} as const;

export type StripeProductMetadata = {
  [STRIPE_METADATA_KEYS.tier]: string;
  [STRIPE_METADATA_KEYS.accessLevel]: string;
  [STRIPE_METADATA_KEYS.legacyId]?: string;
};

export type StripeMemberAccess = {
  tier: MemberTier;
  stripeTier?: string;
  accessLevel?: string;
  legacyId?: string;
};

export type StripeTierProduct = {
  id: "founder" | "hangar-pro" | "fleet-command";
  name: string;
  hook: string;
  priceCents: number;
  priceDisplay: string;
  period: string;
  description: string;
  features: readonly string[];
  statementDescriptor: string;
  metadata: StripeProductMetadata;
  memberTier: MemberTier;
  paymentLinkEnvKey: string;
  highlighted?: boolean;
  badge?: string;
};

/** USJet Flight Pass ($19.90/mo) — entry clearance tier. */
export const FLIGHT_PASS_STRIPE: StripeTierProduct = {
  id: "founder",
  name: "USJet Flight Pass",
  hook: "Entry clearance · first on the runway",
  priceCents: 1990,
  priceDisplay: "$19.90",
  period: "/mo",
  description:
    "Your clearance into the sovereign hangar. Thirty AI bays, live Intel, and fleet protocol locked to your Member ID—built for operators who measure worth in what they fix, not what they pitch.",
  features: [
    "30-Tool AI Fleet Access",
    "Sovereign Cockpit Interface",
    "Unlimited Access to Captain Aura",
    "Standard Hangar Support",
  ],
  statementDescriptor: "USJET.AI-FLIGHT-PASS",
  metadata: {
    [STRIPE_METADATA_KEYS.tier]: "RECRUIT",
    [STRIPE_METADATA_KEYS.accessLevel]: "LVL_01",
  },
  memberTier: "USJET-PRIME-ACTIVE",
  paymentLinkEnvKey: "VITE_STRIPE_FOUNDER_PAYMENT_LINK",
  highlighted: true,
  badge: "Most chosen",
};

/** Bank-ready Hangar Pro ($49.95/mo) — mirror in Stripe Product settings. */
export const HANGAR_PRO_STRIPE: StripeTierProduct = {
  id: "hangar-pro",
  name: "Hangar Pro",
  hook: "Operator tier · full fleet sync",
  priceCents: 4995,
  priceDisplay: "$49.95",
  period: "/mo",
  description:
    "Full access to the USJET Sovereign Cockpit. Includes real-time AI Fleet networking, 30-unit Hangar connectivity, and live Intel Pulse dashboard (Crypto/NYSE). Integrated for high-velocity labor and enterprise founders. No dead iframes—direct flight links only.",
  features: [
    "Full Hangar Automation Suite",
    'High-Velocity Logistics AI',
    'Priority "Wrenches, Not Slides" Toolset',
    "Integrated Multi-AI Networking",
  ],
  statementDescriptor: "USJET.AI-HANGAR-PRO",
  metadata: {
    [STRIPE_METADATA_KEYS.tier]: "OPERATOR",
    [STRIPE_METADATA_KEYS.accessLevel]: "LVL_02",
  },
  memberTier: "USJET-PRIME-ACTIVE",
  paymentLinkEnvKey: "VITE_STRIPE_PRO_PAYMENT_LINK",
};

/** USJET Enterprise Fleet Commander ($199.99/mo) — sovereign command tier. */
export const FLEET_COMMANDER_STRIPE: StripeTierProduct = {
  id: "fleet-command",
  name: "USJET Enterprise Fleet Commander",
  hook: "Command tier · crew-scale sovereignty",
  priceCents: 19999,
  priceDisplay: "$199.99",
  period: "/mo",
  description:
    "Command-level sovereignty for distributed crews and institutional operators. Unlimited workbench concurrency, custom fleet manifest, dedicated liaison, and audit-grade exports—one cockpit, zero external leaks.",
  features: [
    'Direct "Master Lock" Protocol Access',
    "Real-Time Titans Intel Dashboard (Crypto/NYSE)",
    "Dedicated Fleet Command Channel",
    "Priority Revenue-Engine Support",
  ],
  statementDescriptor: "USJET.AI-FLEET-CMD",
  metadata: {
    [STRIPE_METADATA_KEYS.tier]: "COMMANDER",
    [STRIPE_METADATA_KEYS.accessLevel]: "LVL_03_SOVEREIGN",
    [STRIPE_METADATA_KEYS.legacyId]: "AM_KARIM_SUCCESSION",
  },
  memberTier: "USJET-PRIME-ACTIVE",
  paymentLinkEnvKey: "VITE_STRIPE_ENTERPRISE_PAYMENT_LINK",
};

export const STRIPE_TIER_PRODUCTS = [
  FLIGHT_PASS_STRIPE,
  HANGAR_PRO_STRIPE,
  FLEET_COMMANDER_STRIPE,
] as const;

/** Dashboard paste sheet — Product → Description, Statement descriptor, Metadata. */
export const HANGAR_PRO_STRIPE_DASHBOARD = {
  productName: HANGAR_PRO_STRIPE.name,
  description: HANGAR_PRO_STRIPE.description,
  statementDescriptor: HANGAR_PRO_STRIPE.statementDescriptor,
  metadata: HANGAR_PRO_STRIPE.metadata,
  recurringPrice: HANGAR_PRO_STRIPE.priceDisplay + HANGAR_PRO_STRIPE.period,
} as const;

function normalizeMetaValue(value: string | undefined): string | undefined {
  return value?.trim().toUpperCase() || undefined;
}

/** Map Stripe Product metadata to MemberSession fields without touching master keys. */
export function memberAccessFromStripeMetadata(
  metadata: Record<string, string> | null | undefined,
  fallback: MemberTier = "USJET-PRIME-ACTIVE",
): StripeMemberAccess {
  if (!metadata) {
    return { tier: fallback };
  }

  const stripeTier = metadata[STRIPE_METADATA_KEYS.tier]?.trim();
  const accessLevel = metadata[STRIPE_METADATA_KEYS.accessLevel]?.trim();
  const legacyId = metadata[STRIPE_METADATA_KEYS.legacyId]?.trim();

  const normalizedTier = normalizeMetaValue(stripeTier);
  const normalizedAccess = normalizeMetaValue(accessLevel);

  for (const product of STRIPE_TIER_PRODUCTS) {
    const productTier = normalizeMetaValue(product.metadata[STRIPE_METADATA_KEYS.tier]);
    const productAccess = normalizeMetaValue(product.metadata[STRIPE_METADATA_KEYS.accessLevel]);

    if (
      (normalizedTier && normalizedTier === productTier) ||
      (normalizedAccess && normalizedAccess === productAccess)
    ) {
      return {
        tier: product.memberTier,
        stripeTier: stripeTier ?? product.metadata[STRIPE_METADATA_KEYS.tier],
        accessLevel: accessLevel ?? product.metadata[STRIPE_METADATA_KEYS.accessLevel],
        legacyId: legacyId ?? product.metadata[STRIPE_METADATA_KEYS.legacyId],
      };
    }
  }

  return {
    tier: fallback,
    stripeTier,
    accessLevel,
    legacyId,
  };
}

/** @deprecated Use memberAccessFromStripeMetadata — kept for callers needing tier only. */
export function memberTierFromStripeMetadata(
  metadata: Record<string, string> | null | undefined,
  fallback: MemberTier = "USJET-PRIME-ACTIVE",
): MemberTier {
  return memberAccessFromStripeMetadata(metadata, fallback).tier;
}
