export type MemberTier = "USJET-PRIME-ACTIVE" | "USJET-ROYAL-HEIR" | "INACTIVE" | "PENDING";

export type MemberSession = {
  customerId: string;
  email?: string;
  tier: MemberTier;
  active: boolean;
  verifiedAt: string;
};

export type VerifyMemberResponse = {
  active: boolean;
  customerId: string;
  tier: MemberTier;
  email?: string;
};
