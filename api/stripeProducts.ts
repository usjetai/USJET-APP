/** Server mirror of `src/data/stripeProducts.ts` — keep metadata keys in sync. */

export const STRIPE_METADATA_KEYS = {
  tier: "tier",
  accessLevel: "access_level",
  legacyId: "legacy_id",
} as const;

const TIER_METADATA = [
  { tier: "RECRUIT", access_level: "LVL_01" },
  { tier: "OPERATOR", access_level: "LVL_02" },
  { tier: "COMMANDER", access_level: "LVL_03_SOVEREIGN", legacy_id: "AM_KARIM_SUCCESSION" },
] as const;

export type MemberTier = "USJET-PRIME-ACTIVE" | "USJET-ROYAL-HEIR" | "INACTIVE" | "PENDING";

export type StripeMemberAccess = {
  tier: MemberTier;
  stripeTier?: string;
  accessLevel?: string;
  legacyId?: string;
};

function normalizeMetaValue(value: string | undefined): string | undefined {
  return value?.trim().toUpperCase() || undefined;
}

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

  for (const product of TIER_METADATA) {
    const productTier = normalizeMetaValue(product.tier);
    const productAccess = normalizeMetaValue(product.access_level);

    if (
      (normalizedTier && normalizedTier === productTier) ||
      (normalizedAccess && normalizedAccess === productAccess)
    ) {
      return {
        tier: "USJET-PRIME-ACTIVE",
        stripeTier: stripeTier ?? product.tier,
        accessLevel: accessLevel ?? product.access_level,
        legacyId: legacyId ?? ("legacy_id" in product ? product.legacy_id : undefined),
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

export function memberTierFromStripeMetadata(
  metadata: Record<string, string> | null | undefined,
  fallback: MemberTier = "USJET-PRIME-ACTIVE",
): MemberTier {
  return memberAccessFromStripeMetadata(metadata, fallback).tier;
}

export function productMetadataFromSubscription(
  subscription: {
    metadata?: Record<string, string> | null;
    items: { data: Array<{ price?: { product?: unknown } | null }> };
  },
): Record<string, string> | undefined {
  const item = subscription.items.data[0];
  const product = item?.price?.product;

  if (product && typeof product === "object" && product !== null && "metadata" in product) {
    const meta = (product as { metadata?: Record<string, string> }).metadata;
    if (meta && Object.keys(meta).length > 0) {
      return meta;
    }
  }

  if (subscription.metadata && Object.keys(subscription.metadata).length > 0) {
    return subscription.metadata;
  }

  return undefined;
}
