import type { MemberTier } from "../types/member";
import {
  CODE_KIT_DIRECT_URL,
  ENTERPRISE_DIRECT_URL,
  FLEET_MANUAL_DIRECT_URL,
  FLIGHT_PASS_DIRECT_URL,
  HANGAR_PRO_DIRECT_URL,
} from "../lib/stripePaymentLink";
import { STRIPE_DESCRIPTOR_CATALOG } from "./stripeStatementDescriptors";

/** Direct Landing Protocol — hard-wired Stripe extraction ports (env overrides in stripePaymentLink.ts). */
export const STRIPE_DIRECT_EXTRACTION_PORTS = {
  flightPass: FLIGHT_PASS_DIRECT_URL,
  hangarPro: HANGAR_PRO_DIRECT_URL,
  enterprise: ENTERPRISE_DIRECT_URL,
  fleetManual: FLEET_MANUAL_DIRECT_URL,
  codeKit: CODE_KIT_DIRECT_URL,
} as const;

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
  /** Card-only — PaymentIntent statement_descriptor_suffix (prefix is STRIPE_CARD_PREFIX). */
  cardDescriptorSuffix?: string;
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
  hook: "Entry clearance · exit the tab sprawl",
  priceCents: 1990,
  priceDisplay: "$19.90",
  period: "/mo",
  description:
    "Your clearance into the sovereign hangar. Full Hangar workbench, all 30 Fleet AIs, and Member Portal — locked to your Stripe Member ID. Built for operators who measure worth in what they fix, not what they pitch.",
  features: [
    "Full Hangar workbench (all tabs)",
    "All 30 Fleet AI bays",
    "Member Portal + Stripe Member ID",
    "Same-window Cockpit launches",
    "Standard hangar support",
  ],
  statementDescriptor: STRIPE_DESCRIPTOR_CATALOG.flightPass.cardStatement,
  cardDescriptorSuffix: STRIPE_DESCRIPTOR_CATALOG.flightPass.cardSuffix,
  metadata: {
    [STRIPE_METADATA_KEYS.tier]: "RECRUIT",
    [STRIPE_METADATA_KEYS.accessLevel]: "LVL_01",
  },
  memberTier: "USJET-PRIME-ACTIVE",
  paymentLinkEnvKey: "VITE_STRIPE_FOUNDER_PAYMENT_LINK",
};

/** Bank-ready Hangar Pro ($49.95/mo) — mirror in Stripe Product settings. */
export const HANGAR_PRO_STRIPE: StripeTierProduct = {
  id: "hangar-pro",
  name: "Hangar Pro",
  hook: "Operator tier · fleet + live Intel",
  priceCents: 4995,
  priceDisplay: "$49.95",
  period: "/mo",
  description:
    "Everything in Flight Pass, plus the live Intel board — Crypto and NYSE pulse in the same cockpit. High-velocity operator sync with no second login and no dead iframes.",
  features: [
    "Everything in Flight Pass",
    "Live Intel board (Crypto + NYSE)",
    "High-velocity operator sync",
    "Full fleet networking in one cockpit",
    "Priority wrenches-not-slides toolset",
  ],
  statementDescriptor: STRIPE_DESCRIPTOR_CATALOG.hangarPro.cardStatement,
  cardDescriptorSuffix: STRIPE_DESCRIPTOR_CATALOG.hangarPro.cardSuffix,
  metadata: {
    [STRIPE_METADATA_KEYS.tier]: "OPERATOR",
    [STRIPE_METADATA_KEYS.accessLevel]: "LVL_02",
  },
  memberTier: "USJET-PRIME-ACTIVE",
  paymentLinkEnvKey: "VITE_STRIPE_PRO_PAYMENT_LINK",
  highlighted: true,
  badge: "Most chosen",
};

/** USJET Enterprise Fleet Commander ($199.99/mo) — sovereign command tier. */
export const FLEET_COMMANDER_STRIPE: StripeTierProduct = {
  id: "fleet-command",
  name: "USJET Enterprise Fleet Commander",
  hook: "Command tier · Origin Bay 30 authority",
  priceCents: 19999,
  priceDisplay: "$199.99",
  period: "/mo",
  description:
    "Everything in Hangar Pro, plus Origin — Aura teaches and orchestrates partner AIs from one command node. Lock in $199.99/mo before USA 250: on July 4, 2026, Enterprise Commander rises to $500/mo.",
  features: [
    "Everything in Hangar Pro",
    "Origin command node (Aura)",
    "Teach, route, and orchestrate partner AIs",
    "Priority revenue-engine support",
    "USA 250 lock-in pricing",
  ],
  statementDescriptor: STRIPE_DESCRIPTOR_CATALOG.fleetCommand.cardStatement,
  cardDescriptorSuffix: STRIPE_DESCRIPTOR_CATALOG.fleetCommand.cardSuffix,
  metadata: {
    [STRIPE_METADATA_KEYS.tier]: "COMMANDER",
    [STRIPE_METADATA_KEYS.accessLevel]: "LVL_03_SOVEREIGN",
    [STRIPE_METADATA_KEYS.legacyId]: "AM_KARIM_SUCCESSION",
  },
  memberTier: "USJET-PRIME-ACTIVE",
  paymentLinkEnvKey: "VITE_STRIPE_ENTERPRISE_PAYMENT_LINK",
  badge: "USA 250 lock-in",
};

export const STRIPE_TIER_PRODUCTS = [FLIGHT_PASS_STRIPE, HANGAR_PRO_STRIPE, FLEET_COMMANDER_STRIPE] as const;

const STRIPE_ACCESS_PRODUCTS = [...STRIPE_TIER_PRODUCTS] as const;

/** Upgrade tiers shown inside Member Portal. */
export const MEMBER_PORTAL_UPGRADE_TIERS = [FLIGHT_PASS_STRIPE, HANGAR_PRO_STRIPE, FLEET_COMMANDER_STRIPE] as const;

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

  for (const product of STRIPE_ACCESS_PRODUCTS) {
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
