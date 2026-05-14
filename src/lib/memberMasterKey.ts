import type { MemberSession } from "../types/member";
import { LINE_OF_SUCCESSION } from "../data/lineOfSuccession";

/** Founder master key — stealth / local cockpit testing. Stripe replaces in production. */
export const MEMBER_MASTER_KEY = "USJET-1995";
export const FOUNDER_MASTER_CUSTOMER_ID = "founder-master-1995";

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

/** Hangar metadata — third-generation legacy bay (stealth). */
export const KING_KARIM_HANGAR_META = {
  key: LINE_OF_SUCCESSION.kingKarimAccessKey,
  note: LINE_OF_SUCCESSION.kingKarimNote,
} as const;
