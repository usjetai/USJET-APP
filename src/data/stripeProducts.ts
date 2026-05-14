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

/** USJet Flight Pass ($19.95/mo) — launch clearance tier. */
export const FLIGHT_PASS_STRIPE: StripeTierProduct = {
  id: "founder",
  name: "USJet Flight Pass",
  hook: "Launch clearance · first on the runway",
  priceCents: 1995,
  priceDisplay: "$19.95",
  period: "/mo",
  description:
    "Your clearance into the sovereign hangar. Thirty AI bays, live Intel, and fleet protocol locked to your Member ID—built for operators who measure worth in what they fix, not what they pitch.",
  features: [
    "Full 30-unit Hangar bay access",
    "Intel Pulse — Crypto & NYSE live board",
    "USJET Fleet Protocol routing",
    "Stripe Member ID — cockpit gate unlock",
  ],
  statementDescriptor: "USJET.AI-FLIGHT-PASS",
  metadata: {
    [STRIPE_METADATA_KEYS.role]: "FLIGHT-CLEARANCE",
    [STRIPE_METADATA_KEYS.access]: "HANGAR-ENTRY",
    [STRIPE_METADATA_KEYS.tier]: "LAUNCH-RATE",
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
    "Full access to the USJET Sovereign Cockpit. Real-time AI Fleet networking, 30-unit Hangar connectivity, and live Intel Pulse (Crypto/NYSE). Integrated for high-velocity labor and enterprise founders. No dead iframes—direct flight links only.",
  features: [
    "Everything in Flight Pass",
    "Real-time AI Fleet networking",
    "Live Intel Pulse — dual market feed",
    "Direct flight links — no dead iframes",
    "PRIME-OPERATOR Member ID clearance",
  ],
  statementDescriptor: "USJET.AI-HANGAR-PRO",
  metadata: {
    [STRIPE_METADATA_KEYS.role]: "PRIME-OPERATOR",
    [STRIPE_METADATA_KEYS.access]: "FULL-FLEET-SYNC",
    [STRIPE_METADATA_KEYS.tier]: "FOUNDER-LEVEL",
  },
  memberTier: "USJET-PRIME-ACTIVE",
  paymentLinkEnvKey: "VITE_STRIPE_PRO_PAYMENT_LINK",
};

/** USJET Enterprise Fleet Commander ($199.99/mo) — crew-scale command. */
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
    "Everything in Hangar Pro",
    "Unlimited workbench bays",
    "Custom fleet manifest & SLA routing",
    "Dedicated success liaison",
    "SSO, audit exports & enterprise Member ID",
  ],
  statementDescriptor: "USJET.AI-FLEET-CMD",
  metadata: {
    [STRIPE_METADATA_KEYS.role]: "FLEET-COMMANDER",
    [STRIPE_METADATA_KEYS.access]: "ENTERPRISE-SOVEREIGN",
    [STRIPE_METADATA_KEYS.tier]: "COMMAND-LEVEL",
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

  for (const product of STRIPE_TIER_PRODUCTS) {
    const productRole = product.metadata[STRIPE_METADATA_KEYS.role].toUpperCase();
    const productAccess = product.metadata[STRIPE_METADATA_KEYS.access].toUpperCase();
    const productTier = product.metadata[STRIPE_METADATA_KEYS.tier].toUpperCase();

    if (role === productRole || access === productAccess || tier === productTier) {
      return product.memberTier;
    }
  }

  return fallback;
}
