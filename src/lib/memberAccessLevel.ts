import type { MemberSession } from "../types/member";
import { FLEET_UNIT_COUNT } from "../types/fleet";
import { isSitePreviewPromoActive } from "./sitePreviewPromo";
import { FOUNDER_TEST_EMAIL } from "./memberMasterKey";

/** Intel Top 10 — Hangar Pro (LVL_02) or Enterprise (LVL_03) clearance required. */
export const INTEL_TOP10_MIN_ACCESS_LEVEL = 2;

/** Guest-only surface — Hangar home (3 free tabs), Fleet (10 free bays), Stripe login, fleet cockpit handoff. */
export const GUEST_PUBLIC_ROUTES = [
  "/",
  "/hired-hud",
  "/hangar",
  "/fleet",
  "/member/login",
  "/login",
  "/cockpit",
  "/sos",
  "/privacy",
  "/terms",
  "/ai-101",
  "/code-kit",
  "/blog",
  "/compare",
  "/cash",
  "/support-fleet",
  "/intelligence",
  "/strategic-assets",
  "/sovereignty",
  "/founders-fuel",
  "/store",
  "/aviation-books",
  "/press",
  "/store/ai-computers",
  "/ai-computers",
  "/workbench",
  "/fleet-runway",
  "/special",
  "/pricing",
  "/fleet-directory",
  "/gamers",
  "/gaming",
  "/vr",
  "/x",
  "/hoops",
  "/app/hoops",
  "/jet-browser",
  "/intel",
] as const;

/**
 * Minimum clearance rank per route.
 * 0 = public (guest): Hangar home (3 free tabs), Fleet (10 free AI bays), Intel open board (tiers TBD), member login, fleet cockpit handoff.
 * 1 = Flight Pass+: all 30 fleet AIs, full Hangar tabs, Member Portal.
 * 2 = Hangar Pro+: reserved for future Intel tier lock.
 * 3 = Enterprise Commander: Origin.
 */
export const ROUTE_MIN_CLEARANCE: Record<string, number> = {
  "/": 0,
  "/fleet": 0,
  "/hired-hud": 0,
  "/sos": 0,
  "/privacy": 0,
  "/terms": 0,
  "/ai-101": 0,
  "/code-kit": 0,
  "/blog": 0,
  "/compare": 0,
  "/compare/chatgpt-alternative": 0,
  "/compare/ai-tool-sprawl": 0,
  "/compare/custom-ai-build": 0,
  "/cash": 0,
  "/support-fleet": 0,
  "/intelligence": 0,
  "/strategic-assets": 0,
  "/sovereignty": 0,
  "/founders-fuel": 0,
  "/store": 0,
  "/aviation-books": 0,
  "/press": 0,
  "/store/ai-computers": 0,
  "/ai-computers": 0,
  "/workbench": 0,
  "/fleet-runway": 0,
  "/special": 0,
  "/pricing": 0,
  "/fleet-directory": 0,
  "/gamers": 0,
  "/gaming": 0,
  "/vr": 0,
  "/x": 0,
  "/hoops": 0,
  "/app/hoops": 0,
  "/jet-browser": 0,
  "/member/login": 0,
  "/login": 0,
  "/cockpit": 0,
  "/hangar": 0,
  "/member": 1,
  "/intel": 0,
  "/origin": 3,
};

export function normalizeRoutePath(path: string): string {
  const base = path.split("?")[0]?.split("#")[0] ?? "/";
  if (base.length > 1 && base.endsWith("/")) {
    return base.slice(0, -1);
  }
  return base || "/";
}

export function routeMinClearanceRank(path: string): number {
  const normalized = normalizeRoutePath(path);
  if (normalized in ROUTE_MIN_CLEARANCE) {
    return ROUTE_MIN_CLEARANCE[normalized];
  }
  if (normalized.startsWith("/blog/")) return 0;
  if (normalized.startsWith("/store/ai-computers/")) return 0;
  if (normalized.startsWith("/press")) return 0;
  if (normalized.startsWith("/compare/")) return 0;
  if (normalized.startsWith("/fleet-directory/")) return 0;
  if (normalized.startsWith("/product/")) return 0;
  return 1;
}

export function isGuestPublicRoute(path: string): boolean {
  return routeMinClearanceRank(path) === 0;
}

/**
 * True only for a session that already passed real Stripe verification
 * (see api/verify-member.ts) AND carries the founder's own billing email.
 * There is no way to set this without a genuine, server-verified Stripe lookup.
 */
export function isFounderGodMode(session: MemberSession | null | undefined): boolean {
  if (!session?.active) {
    return false;
  }
  const email = session.email?.trim().toLowerCase();
  return email === FOUNDER_TEST_EMAIL;
}

export function canAccessRoute(path: string, clearanceRank: number, founderGodMode = false): boolean {
  if (founderGodMode) {
    return true;
  }
  return clearanceRank >= routeMinClearanceRank(path);
}

export function clearanceTierLabel(minRank: number): string {
  if (minRank >= 1) {
    return "Flight Pass";
  }
  return "Member clearance";
}

export function clearanceTierPrice(_minRank: number): string {
  return "$19.90/mo";
}

export type ClearanceStripeTierId = "founder" | "hangar-pro" | "fleet-command";

export function clearanceTierStripeId(_minRank: number): ClearanceStripeTierId {
  return "founder";
}

export function tierRouteGateCopy(path: string, minRank: number): { title: string; body: string } {
  const tierLabel = clearanceTierLabel(minRank);
  const tierPrice = clearanceTierPrice(minRank);
  const normalized = normalizeRoutePath(path);

  if (normalized === "/member") {
    return {
      title: "Member Portal — Flight Pass required",
      body:
        "Pay Flight Pass ($19.90/mo) on Stripe, then verify with billing email and your Member ID. Flight Pass unlocks the Member Portal, full Hangar tabs, and the fleet runway. Hangar Pro adds Intel; Enterprise adds Origin.",
    };
  }
  if (normalized === "/" || normalized === "/hangar") {
    return {
      title: "Hangar tabs locked — Flight Pass required",
      body: `First ${HANGAR_BAY_LIMIT_FREE} hangar tabs are free. ${tierLabel} (${tierPrice}) unlocks the rest of the workbench.`,
    };
  }
  if (normalized === "/fleet") {
    return {
      title: "Fleet runway locked — Flight Pass required",
      body: `${tierLabel} (${tierPrice}) unlocks the full 30-AI fleet runway. Pay on Stripe, verify on Member Login, then launch every bay from one cockpit.`,
    };
  }
  if (normalized === "/intel") {
    return {
      title: "Intel board locked at your tier",
      body: `${tierLabel} (${tierPrice}) unlocks the Intel museum of grit. Flight Pass clears Hangar + Member; upgrade for the institutional board.`,
    };
  }
  if (normalized === "/origin") {
    return {
      title: "Origin command locked at your tier",
      body: `${tierLabel} (${tierPrice}) unlocks Origin — the sovereign hardware arc. Enterprise Commander clears the runway.`,
    };
  }
  return {
    title: `${normalized.replace(/^\//, "") || "Route"} is locked at your tier`,
    body: `${tierLabel} (${tierPrice}) unlocks this route. Upgrade clearance to enter the sovereign cockpit — no external leaks, one ship.`,
  };
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
  // Retired Member Deck metadata — no longer grants portal access.
  if (normalized.includes("LVL_00") || normalized.includes("MEMBER_DECK")) {
    return 0;
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
  // Retired Member Deck tier tag — no longer grants portal access.
  if (tier === "MEMBER" || tier === "MEMBER_DECK") {
    return 0;
  }
  if (tier === "RECRUIT") {
    return 1;
  }

  return 0;
}

/** Flight Pass+ unlocks Member Portal (retired $5 Member Deck no longer grants access). */
export function hasMemberPortalAccess(session: MemberSession | null | undefined): boolean {
  if (!session?.active) {
    return false;
  }
  if (isFounderGodMode(session)) {
    return true;
  }
  return memberClearanceRank(session) >= 1;
}

/** @deprecated Use hasMemberPortalAccess — Member Deck product removed. */
export const hasMemberDeckAccess = hasMemberPortalAccess;

/** Human tier label for strips, Aura, and member-facing copy. */
export function memberClearanceDisplayLabel(session: MemberSession | null | undefined): string {
  if (!session?.active) {
    return "Guest";
  }
  if (isFounderGodMode(session)) {
    return "God mode";
  }
  const rank = memberClearanceRank(session);
  if (rank >= 3 || session.tier === "USJET-ROYAL-HEIR") {
    return "Enterprise Commander";
  }
  if (rank >= 2) {
    return "Hangar Pro";
  }
  if (rank >= 1) {
    return "Flight Pass";
  }
  return "Guest clearance";
}

/** Tenure since Stripe verification — for MEMBER_CONTEXT and Origin strip. */
export function membershipTenureLabel(verifiedAt: string): string {
  const verified = new Date(verifiedAt);
  if (Number.isNaN(verified.getTime())) {
    return "tenure unknown";
  }

  const days = Math.max(0, Math.floor((Date.now() - verified.getTime()) / (1000 * 60 * 60 * 24)));
  if (days < 1) {
    return "verified today";
  }
  if (days === 1) {
    return "1 day aboard";
  }
  if (days < 30) {
    return `${days} days aboard`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} aboard`;
  }

  const years = Math.floor(days / 365);
  const remMonths = Math.floor((days % 365) / 30);
  if (remMonths === 0) {
    return `${years} year${years === 1 ? "" : "s"} aboard`;
  }
  return `${years}y ${remMonths}mo aboard`;
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
  if (isSitePreviewPromoActive()) {
    return true;
  }
  if (isFounderGodMode(session)) {
    return true;
  }
  return memberClearanceRank(session) >= INTEL_TOP10_MIN_ACCESS_LEVEL;
}

export function canMemberAccessRoute(
  path: string,
  session: MemberSession | null | undefined,
): boolean {
  const normalized = normalizeRoutePath(path);

  if (isSitePreviewPromoActive() && routeMinClearanceRank(path) > 0) {
    return true;
  }

  const godMode = isFounderGodMode(session);
  const rank = memberClearanceRank(session);
  return canAccessRoute(path, rank, godMode);
}

/** Nav always shows Member — route may still gate at /member. */
export function showMemberNavLink(_session: MemberSession | null | undefined): boolean {
  return true;
}

/** Customer Service treasure path — guests land on Origin in limited CS mode. */
export const ORIGIN_CS_ENTRY = "customer-service";

export const ORIGIN_CS_ROUTE = `/origin?entry=${ORIGIN_CS_ENTRY}`;

export function isOriginCustomerServiceEntry(searchOrPath: string): boolean {
  const raw = searchOrPath.trim();
  const query = raw.startsWith("?")
    ? raw.slice(1)
    : raw.includes("?")
      ? (raw.split("?")[1]?.split("#")[0] ?? "")
      : raw;
  return new URLSearchParams(query).get("entry") === ORIGIN_CS_ENTRY;
}

/** Hangar workbench simultaneous bay caps by clearance rank (0 = free guest tabs). */
export const HANGAR_BAY_LIMIT_FREE = 3;
/** @deprecated Prefer HANGAR_BAY_LIMIT_FREE — guests get three free tabs. */
export const HANGAR_BAY_LIMIT_TEASER = HANGAR_BAY_LIMIT_FREE;
/** Flight Pass+ can open every hangar bay at once (full 30-unit floor). */
export const HANGAR_BAY_LIMIT_FLIGHT_PASS = FLEET_UNIT_COUNT;
export const HANGAR_BAY_LIMIT_HANGAR_PRO = FLEET_UNIT_COUNT;
export const HANGAR_BAY_LIMIT_ENTERPRISE = FLEET_UNIT_COUNT;

export function getHangarBayLimit(session: MemberSession | null | undefined): number {
  if (isSitePreviewPromoActive()) {
    return HANGAR_BAY_LIMIT_ENTERPRISE;
  }
  const rank = memberClearanceRank(session);
  if (rank >= 1) {
    return HANGAR_BAY_LIMIT_FLIGHT_PASS;
  }
  return HANGAR_BAY_LIMIT_FREE;
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
      title: "Free tab limit",
      body: `First ${limit} hangar tabs are free — Flight Pass ($19.90/mo) unlocks the rest.`,
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
  const limit = getHangarBayLimit(session);

  if (isSitePreviewPromoActive()) {
    return `${limit} tabs · full site preview`;
  }

  const rank = memberClearanceRank(session);

  if (rank === 0) {
    return `${limit} free tabs · Flight Pass unlocks rest`;
  }
  if (rank === 1) {
    return `${limit} tabs · Flight Pass $19.90/mo`;
  }
  if (rank === 2) {
    return `${limit} tabs · Hangar Pro`;
  }
  return `${limit} tabs · Enterprise command`;
}
