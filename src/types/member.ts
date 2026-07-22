export type MemberTier = "USJET-PRIME-ACTIVE" | "USJET-ROYAL-HEIR" | "INACTIVE" | "PENDING";

export type MemberSession = {
  customerId: string;
  name?: string;
  email?: string;
  tier: MemberTier;
  active: boolean;
  verifiedAt: string;
  stripeTier?: string;
  accessLevel?: string;
  legacyId?: string;
  /** Founder-only — bypasses all tier route gates (Ameer Karim). */
  founderGodMode?: boolean;
};

export type VerifyMemberResponse = {
  active: boolean;
  customerId: string;
  name?: string;
  tier: MemberTier;
  email?: string;
  stripeTier?: string;
  accessLevel?: string;
  legacyId?: string;
};
