import type { MemberSession } from "../types/member";

/** Intel Top 10 — Hangar Pro (LVL_02) or Enterprise (LVL_03) clearance required. */
export const INTEL_TOP10_MIN_ACCESS_LEVEL = 2;

export function accessLevelRank(accessLevel?: string): number {
  if (!accessLevel) {
    return 0;
  }

  const normalized = accessLevel.trim().toUpperCase();
  const match = normalized.match(/LVL_0?(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }

  if (normalized.includes("SOVEREIGN") || normalized.includes("COMMANDER")) {
    return 3;
  }
  if (normalized.includes("OPERATOR")) {
    return 2;
  }
  if (normalized.includes("RECRUIT")) {
    return 1;
  }

  return 0;
}

export function stripeTierRank(stripeTier?: string): number {
  if (!stripeTier) {
    return 0;
  }

  const tier = stripeTier.trim().toUpperCase();
  if (tier === "COMMANDER" || tier.includes("SOVEREIGN")) {
    return 3;
  }
  if (tier === "OPERATOR") {
    return 2;
  }
  if (tier === "RECRUIT") {
    return 1;
  }

  return 0;
}

/** Numeric clearance rank — 0 = none, 1 = Flight Pass, 2 = Hangar Pro, 3 = Enterprise / heir. */
export function memberClearanceRank(session: MemberSession | null | undefined): number {
  if (!session?.active) {
    return 0;
  }

  if (session.tier === "USJET-ROYAL-HEIR") {
    return 3;
  }

  return Math.max(accessLevelRank(session.accessLevel), stripeTierRank(session.stripeTier));
}

export function hasIntelTop10Clearance(session: MemberSession | null | undefined): boolean {
  return memberClearanceRank(session) >= INTEL_TOP10_MIN_ACCESS_LEVEL;
}
