/**
 * Stripe statement descriptors — account static + card prefix/suffix.
 * @see https://docs.stripe.com/get-started/account/statement-descriptors
 *
 * Dashboard (Settings → Business → Public details):
 * - Static statement descriptor (all charges): STRIPE_ACCOUNT_STATIC_DESCRIPTOR
 * - Shortened descriptor / prefix (cards): STRIPE_CARD_PREFIX (max 10 characters)
 *
 * Per-product card charges use prefix + ` * ` + suffix (max 22 characters total).
 * Payment Links: set the suffix on each Product / Payment Link in Dashboard, or use
 * statement_descriptor_suffix on PaymentIntents when you move to custom checkout.
 */

/**
 * Full static descriptor — Stripe Dashboard → Business → Public details.
 * Must resemble business name / URL (5–22 characters). Matches USJET LLC on file.
 */
export const STRIPE_ACCOUNT_STATIC_DESCRIPTOR = "USJET LLC PASSPORT" as const;

/**
 * Shortened descriptor (card prefix) — 2–10 characters.
 * Replace any placeholder (e.g. GRAILED.CO) with this value before saving.
 */
export const STRIPE_CARD_PREFIX = "USJET.AI" as const;

const PREFIX_LEN = STRIPE_CARD_PREFIX.length;
const CARD_DESCRIPTOR_MAX = 22;
const SUFFIX_MAX = CARD_DESCRIPTOR_MAX - PREFIX_LEN - 2; // ` * `

export type StripeDescriptorEntry = {
  id: string;
  productName: string;
  /** Card suffix only (PaymentIntent statement_descriptor_suffix). */
  cardSuffix: string;
  /** Full string customers see on card statements: PREFIX* SUFFIX */
  cardStatement: string;
  /** Non-card / account-level fallback (statement_descriptor on PaymentIntent). */
  staticDescriptor: string;
};

function buildCardStatement(suffix: string): string {
  return `${STRIPE_CARD_PREFIX}* ${suffix}`;
}

function assertSuffixLength(suffix: string, id: string): void {
  if (suffix.length > SUFFIX_MAX) {
    throw new Error(`Stripe card suffix for ${id} exceeds ${SUFFIX_MAX} chars: "${suffix}"`);
  }
}

function entry(
  id: string,
  productName: string,
  cardSuffix: string,
  staticDescriptor: string,
): StripeDescriptorEntry {
  assertSuffixLength(cardSuffix, id);
  return {
    id,
    productName,
    cardSuffix,
    cardStatement: buildCardStatement(cardSuffix),
    staticDescriptor,
  };
}

/** Canonical descriptors — keep in sync with Stripe Dashboard products. */
export const STRIPE_DESCRIPTOR_CATALOG = {
  flightPass: entry("flight-pass", "USJet Flight Pass", "FLIGHT PASS", "USJET LLC PASSPORT"),
  hangarPro: entry("hangar-pro", "Hangar Pro", "HANGAR PRO", "USJET LLC PASSPORT"),
  fleetCommand: entry("fleet-command", "Enterprise Fleet Commander", "FLEET CMD", "USJET LLC PASSPORT"),
  fleetManual: entry("fleet-manual", "Fleet Manual Professional", "MANUAL 2.5K", "USJET LLC PASSPORT"),
  codeKit: entry("code-kit", "USJET Code Kit", "CODE KIT", "USJET LLC PASSPORT"),
} as const;

/** Dashboard paste sheet for Stripe → Settings → Business → Statement descriptor. */
export const STRIPE_DESCRIPTOR_DASHBOARD_SETUP = {
  accountStatic: STRIPE_ACCOUNT_STATIC_DESCRIPTOR,
  cardPrefix: STRIPE_CARD_PREFIX,
  prefixMaxLength: 10,
  cardTotalMaxLength: 22,
  suffixMaxWithPrefix: SUFFIX_MAX,
  instructions: [
    "Set Static statement descriptor to the account value below (single brand line on non-card charges).",
    `Set Shortened descriptor (prefix) to "${STRIPE_CARD_PREFIX}" — must be ≤10 characters.`,
    "For each Product / Payment Link, add the card suffix in Dashboard OR use statement_descriptor_suffix on PaymentIntents.",
    "Do not set statement_descriptor on card PaymentIntents — use statement_descriptor_suffix only.",
  ],
  products: Object.values(STRIPE_DESCRIPTOR_CATALOG).map((row) => ({
    product: row.productName,
    cardSuffix: row.cardSuffix,
    customerSeesOnCard: row.cardStatement,
    staticOrNonCard: row.staticDescriptor,
  })),
} as const;
