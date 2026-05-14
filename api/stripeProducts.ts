/** Server mirror of `src/data/stripeProducts.ts` — keep metadata keys in sync. */

export const STRIPE_METADATA_KEYS = {
  role: "Role",
  access: "Access",
  tier: "Tier",
} as const;

const HANGAR_PRO_METADATA = {
  [STRIPE_METADATA_KEYS.role]: "PRIME-OPERATOR",
  [STRIPE_METADATA_KEYS.access]: "FULL-FLEET-SYNC",
  [STRIPE_METADATA_KEYS.tier]: "FOUNDER-LEVEL",
} as const;

export type MemberTier = "USJET-PRIME-ACTIVE" | "USJET-ROYAL-HEIR" | "INACTIVE" | "PENDING";

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

  if (
    role === HANGAR_PRO_METADATA.Role ||
    access === HANGAR_PRO_METADATA.Access ||
    tier === HANGAR_PRO_METADATA.Tier
  ) {
    return "USJET-PRIME-ACTIVE";
  }

  return fallback;
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
