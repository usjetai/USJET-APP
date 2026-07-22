import type { MemberTier } from "../types/member";
import {
  CODE_KIT_DIRECT_URL,
  ENTERPRISE_DIRECT_URL,
  FLEET_MANUAL_DIRECT_URL,
  FLIGHT_PASS_DIRECT_URL,
  HANGAR_PRO_DIRECT_URL,
} from "../lib/stripePaymentLink";
import { STRIPE_DESCRIPTOR_CATALOG } from "./stripeStatementDescriptors";
import { MEMBER_DECK_HOOK, MEMBER_DECK_PERIOD, MEMBER_DECK_PRICE_DISPLAY, MEMBER_DECK_STRIPE_METADATA } from "./memberDeckStripe";

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

export type MemberDeckProduct = Omit<StripeTierProduct, "id"> & { id: "member-deck" };

/** USJet Member Deck ($5/mo) — Member Portal + member tools only. */
export const MEMBER_DECK_STRIPE: MemberDeckProduct = {
  id: "member-deck",
  name: "USJet Member Deck",
  hook: MEMBER_DECK_HOOK,
  priceCents: 500,
  priceDisplay: MEMBER_DECK_PRICE_DISPLAY,
  period: MEMBER_DECK_PERIOD,
  description:
    "Paid entry to the Member Portal — telemetry, project tracker, vitals, and your clearance ladder. Does not unlock Hangar, Intel, or Origin; upgrade to Flight Pass or higher inside the ship.",
  features: [
    "Member Portal + Your AI data board",
    "Fleet usage telemetry",
    "Project tracker & member vitals",
  ],
  statementDescriptor: STRIPE_DESCRIPTOR_CATALOG.memberDeck.cardStatement,
  cardDescriptorSuffix: STRIPE_DESCRIPTOR_CATALOG.memberDeck.cardSuffix,
  metadata: {
    [STRIPE_METADATA_KEYS.tier]: MEMBER_DECK_STRIPE_METADATA.tier,
    [STRIPE_METADATA_KEYS.accessLevel]: MEMBER_DECK_STRIPE_METADATA.access_level,
  },
  memberTier: "USJET-PRIME-ACTIVE",
  paymentLinkEnvKey: "VITE_STRIPE_MEMBER_DECK_PAYMENT_LINK",
  badge: "Portal entry",
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
  statementDescriptor: STRIPE_DESCRIPTOR_CATALOG.flightPass.cardStatement,
  cardDescriptorSuffix: STRIPE_DESCRIPTOR_CATALOG.flightPass.cardSuffix,
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
  statementDescriptor: STRIPE_DESCRIPTOR_CATALOG.hangarPro.cardStatement,
  cardDescriptorSuffix: STRIPE_DESCRIPTOR_CATALOG.hangarPro.cardSuffix,
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
  hook: "Command tier · Origin Bay 30 authority",
  priceCents: 19999,
  priceDisplay: "$199.99",
  period: "/mo",
  description:
    "The only clearance that seats you at Origin — Aura teaches and orchestrates all twenty-nine partner AIs from one command node. Lock in $199.99/mo for one year before USA 250: on July 4, 2026, Enterprise Commander rises to $500/mo.",
  features: [
    'Direct "Master Lock" Protocol Access',
    "Origin command — teach, route, and orchestrate all 29 partner AIs",
    "Real-Time Titans Intel Dashboard (Crypto/NYSE)",
    "Dedicated Fleet Command Channel",
    "Priority Revenue-Engine Support",
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

const STRIPE_ACCESS_PRODUCTS = [MEMBER_DECK_STRIPE, ...STRIPE_TIER_PRODUCTS] as const;

/** Upgrade tiers shown inside Member Portal (excludes $5 deck). */
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
