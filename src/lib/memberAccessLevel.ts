import type { MemberSession } from "../types/member";
import { FOUNDER_TEST_CUSTOMER_ID, FOUNDER_TEST_EMAIL } from "./memberMasterKey";

/** Intel Top 10 — Hangar Pro (LVL_02) or Enterprise (LVL_03) clearance required. */
export const INTEL_TOP10_MIN_ACCESS_LEVEL = 2;

/** Minimum clearance rank per route — 0 = Fleet/Hangar browse (guest + Tier 1). */
export const ROUTE_MIN_CLEARANCE: Record<string, number> = {
  "/": 0,
  "/hangar": 0,
  "/intel": 2,
  "/founder": 2,
  "/member": 2,
  "/origin": 3,
  "/founder-special-1995": 3,
  "/special": 0,
};

export function normalizeRoutePath(path: string): string {
  const base = path.split("?")[0]?.split("#")[0] ?? "/";
  if (base.length > 1 && base.endsWith("/")) {
    return base.slice(0, -1);
  }
  return base || "/";
}

export function routeMinClearanceRank(path: string): number {
  return ROUTE_MIN_CLEARANCE[normalizeRoutePath(path)] ?? 0;
}

export function isFounderGodMode(session: MemberSession | null | undefined): boolean {
  if (!session?.active) {
    return false;
  }
  if (session.founderGodMode) {
    return true;
  }
  const email = session.email?.trim().toLowerCase();
  return session.customerId === FOUNDER_TEST_CUSTOMER_ID || email === FOUNDER_TEST_EMAIL;
}

export function canAccessRoute(path: string, clearanceRank: number, founderGodMode = false): boolean {
  if (founderGodMode) {
    return true;
  }
  return clearanceRank >= routeMinClearanceRank(path);
}

export function clearanceTierLabel(minRank: number): string {
  if (minRank >= 3) {
    return "Enterprise Commander";
  }
  if (minRank >= 2) {
    return "Hangar Pro";
  }
  if (minRank >= 1) {
    return "Flight Pass";
  }
  return "Member clearance";
}

export function clearanceTierPrice(minRank: number): string {
  if (minRank >= 3) {
    return "$199.99/mo";
  }
  if (minRank >= 2) {
    return "$49.95/mo";
  }
  return "$19.90/mo";
}

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

  if (isFounderGodMode(session)) {
    return 3;
  }

  if (session.tier === "USJET-ROYAL-HEIR") {
    return 3;
  }

  return Math.max(accessLevelRank(session.accessLevel), stripeTierRank(session.stripeTier));
}

export function hasIntelTop10Clearance(session: MemberSession | null | undefined): boolean {
  if (isFounderGodMode(session)) {
    return true;
  }
  return memberClearanceRank(session) >= INTEL_TOP10_MIN_ACCESS_LEVEL;
}

export function canMemberAccessRoute(
  path: string,
  session: MemberSession | null | undefined,
): boolean {
  const godMode = isFounderGodMode(session);
  const rank = memberClearanceRank(session);
  return canAccessRoute(path, rank, godMode);
}

/** Hangar workbench simultaneous bay caps by clearance rank (0 = teaser / no session). */
export const HANGAR_BAY_LIMIT_TEASER = 2;
export const HANGAR_BAY_LIMIT_FLIGHT_PASS = 4;
export const HANGAR_BAY_LIMIT_HANGAR_PRO = 6;
export const HANGAR_BAY_LIMIT_ENTERPRISE = 10;

export function getHangarBayLimit(session: MemberSession | null | undefined): number {
  const rank = memberClearanceRank(session);
  if (rank >= 3) {
    return HANGAR_BAY_LIMIT_ENTERPRISE;
  }
  if (rank === 2) {
    return HANGAR_BAY_LIMIT_HANGAR_PRO;
  }
  if (rank === 1) {
    return HANGAR_BAY_LIMIT_FLIGHT_PASS;
  }
  return HANGAR_BAY_LIMIT_TEASER;
}

export type HangarBayLimitToast = {
  title: string;
  body: string;
  showUpgradeLink: boolean;
};

export function hangarBayLimitToast(session: MemberSession | null | undefined): HangarBayLimitToast {
  const rank = memberClearanceRank(session);
  const limit = getHangarBayLimit(session);

  if (rank === 0) {
    return {
      title: "Preview limit",
      body: `Teaser holds ${limit} bays — Flight Pass unlocks 4 cockpits.`,
      showUpgradeLink: true,
    };
  }
  if (rank === 1) {
    return {
      title: "Hangar full",
      body: `Flight Pass holds ${limit} bays — upgrade for more.`,
      showUpgradeLink: true,
    };
  }
  if (rank === 2) {
    return {
      title: "Hangar full",
      body: `Hangar Pro holds ${limit} bays — upgrade for Enterprise command.`,
      showUpgradeLink: true,
    };
  }
  return {
    title: "Hangar full",
    body: `${limit} workstations are live. Close one to open another cockpit.`,
    showUpgradeLink: false,
  };
}

export function hangarBayHeroBadge(session: MemberSession | null | undefined): string {
  const rank = memberClearanceRank(session);
  const limit = getHangarBayLimit(session);

  if (rank === 0) {
    return `${limit} bays · preview access`;
  }
  if (rank === 1) {
    return `${limit} bays · $19.90/mo`;
  }
  if (rank === 2) {
    return `${limit} bays · Hangar Pro`;
  }
  return `${limit} bays · Enterprise command`;
}
