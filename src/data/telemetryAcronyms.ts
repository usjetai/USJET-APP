import type { Ai101GlossaryCore } from "./ai101GlossaryTypes";

/**
 * Mission Projects / bay / clearance vocabulary tied to Member Portal telemetry
 * and fleet workstation surfaces (not market data).
 */
export const TELEMETRY_ACRONYM_ENTRIES: readonly Ai101GlossaryCore[] = [
  { code: "AURA", phrase: "Fleet aura mode", meaning: "Visual state line for a bay’s listening / processing posture on the grid." },
  { code: "BAY", phrase: "Hangar / runway bay", meaning: "One numbered workstation cell hosting a fleet unit card or Intel monitor tile." },
  { code: "CALLSIGN", phrase: "Unit callsign", meaning: "Short tactical label for a fleet unit shown beside its name on cards and boards." },
  { code: "CLEAR", phrase: "Clearance rank", meaning: "Numeric gate (0–3) that decides which routes open in the capsule nav and Tier gates." },
  { code: "COCKPIT", phrase: "Integrated cockpit", meaning: "Same-window partner frame launched from a bay with the cockpit return bar." },
  { code: "CUST", phrase: "Customer ID", meaning: "Stripe-issued customer identifier used to key Member Portal projects on this device." },
  { code: "FORK", phrase: "Session fork", meaning: "Parallel Member Portal sessions counted on a mission row when multiple tabs stay open." },
  { code: "MISSION", phrase: "Mission project", meaning: "Named Member Portal project grouping fleet assignments and saved mission records." },
  { code: "SESSION", phrase: "Portal usage session", meaning: "Timed stretch while the Member tab is focused; shown in the usage history stack." },
  { code: "SLOT", phrase: "Manifest slot index", meaning: "Zero-based bay index (0–29) that drives accent colors and fleet ordering site-wide." },
] as const;
