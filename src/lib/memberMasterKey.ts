/**
 * Founder identity — used ONLY as a convenience flag on top of a session that has
 * already passed real Stripe verification (see api/verify-member.ts). This file
 * used to also contain hardcoded skeleton keys (MEMBER_MASTER_KEY, KING_KARIM_ACCESS_KEY,
 * etc.) that let anyone with the string — visible in the shipped client bundle —
 * bypass Stripe entirely. Removed. There is no client-side auth bypass anymore:
 * every session comes from a real, server-verified Stripe lookup.
 */

/** Founder's own billing email — grants full clearance only on a session that already verified via real Stripe lookup. */
export const FOUNDER_TEST_EMAIL = "ameerkarim100@icloud.com";
