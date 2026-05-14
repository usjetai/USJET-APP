import type { MemberSession } from "../types/member";
import { LINE_OF_SUCCESSION } from "../data/lineOfSuccession";

/** Founder master key — stealth / local cockpit testing. Stripe replaces in production. */
export const MEMBER_MASTER_KEY = "USJET-1995";
export const FOUNDER_MASTER_CUSTOMER_ID = "founder-master-1995";

/** Founder permanent test credentials — one Member ID for all gates (/member, /hangar, /intel). */
export const FOUNDER_TEST_MEMBER_ID = "USJET-AMEER";
export const FOUNDER_TEST_CUSTOMER_ID = "founder-test-ameer";
export const FOUNDER_TEST_EMAIL = "ameerkarim100@icloud.com";

/** Heir access — third generation (King Karim). Hidden succession tier for stealth build. */
export const KING_KARIM_ACCESS_KEY = "KING-KARIM";
export const KING_KARIM_CUSTOMER_ID = "heir-king-karim";

export function sessionFromMasterKey(raw: string): MemberSession | null {
  const key = raw.trim().toUpperCase();
  if (key !== MEMBER_MASTER_KEY) {
    return null;
  }

  return {
    customerId: FOUNDER_MASTER_CUSTOMER_ID,
    tier: "USJET-PRIME-ACTIVE",
    active: true,
    verifiedAt: new Date().toISOString(),
  };
}

export function sessionFromFounderTestAccess(raw: string): MemberSession | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const memberKey = trimmed.toUpperCase().replace(/\s+/g, "-");
  const email = trimmed.toLowerCase();
  if (memberKey !== FOUNDER_TEST_MEMBER_ID && email !== FOUNDER_TEST_EMAIL) {
    return null;
  }

  return {
    customerId: FOUNDER_TEST_CUSTOMER_ID,
    email: FOUNDER_TEST_EMAIL,
    tier: "USJET-PRIME-ACTIVE",
    active: true,
    verifiedAt: new Date().toISOString(),
  };
}

export function sessionFromKingKarimKey(raw: string): MemberSession | null {
  const key = raw.trim().toUpperCase().replace(/\s+/g, "-");
  if (key !== KING_KARIM_ACCESS_KEY) {
    return null;
  }

  return {
    customerId: KING_KARIM_CUSTOMER_ID,
    tier: "USJET-ROYAL-HEIR",
    active: true,
    verifiedAt: new Date().toISOString(),
  };
}

/** Re-hydrate founder master sessions after localStorage refresh. */
export function sessionFromStoredCustomerId(customerId: string): MemberSession | null {
  const id = customerId.trim();
  if (id === FOUNDER_MASTER_CUSTOMER_ID) {
    return sessionFromMasterKey(MEMBER_MASTER_KEY);
  }
  if (id === FOUNDER_TEST_CUSTOMER_ID) {
    return sessionFromFounderTestAccess(FOUNDER_TEST_MEMBER_ID);
  }
  if (id === KING_KARIM_CUSTOMER_ID) {
    return sessionFromKingKarimKey(KING_KARIM_ACCESS_KEY);
  }
  return null;
}

export function isMasterKey(raw: string): boolean {
  return raw.trim().toUpperCase() === MEMBER_MASTER_KEY;
}

export function isKingKarimAccessKey(raw: string): boolean {
  return raw.trim().toUpperCase().replace(/\s+/g, "-") === KING_KARIM_ACCESS_KEY;
}

export function isFounderTestAccess(raw: string): boolean {
  return sessionFromFounderTestAccess(raw) !== null;
}

/** Hangar metadata — third-generation legacy bay (stealth). */
export const KING_KARIM_HANGAR_META = {
  key: LINE_OF_SUCCESSION.kingKarimAccessKey,
  note: LINE_OF_SUCCESSION.kingKarimNote,
} as const;
