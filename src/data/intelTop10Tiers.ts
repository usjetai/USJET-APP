export type IntelTop10TierId =
  | "titan"
  | "oracle"
  | "sentinel"
  | "vanguard"
  | "sovereign"
  | "aegis"
  | "citadel"
  | "forge"
  | "arbiter"
  | "phalanx";

export type IntelTop10Tier = {
  id: IntelTop10TierId;
  /** Display slot — partnership row 03–12 */
  slot: string;
  name: string;
  status: string;
  tagline: string;
  tintClass: string;
  accent: string;
  accentBright: string;
  ekgSeed: number;
};

/** Top 10 partnership tiers — museum-of-grit institutional statuses. */
export const INTEL_TOP10_TIERS: IntelTop10Tier[] = [
  {
    id: "titan",
    slot: "03",
    name: "TITAN",
    status: "RESERVED FOR TITANS",
    tagline: "Premier exchange · sovereign liquidity desk",
    tintClass: "glass-tint-gold",
    accent: "#ffd700",
    accentBright: "#ffe566",
    ekgSeed: 3,
  },
  {
    id: "oracle",
    slot: "04",
    name: "ORACLE",
    status: "ORACLE CLEARANCE",
    tagline: "Predictive intel · institutional signal feed",
    tintClass: "glass-tint-violet",
    accent: "#a78bfa",
    accentBright: "#c4b5fd",
    ekgSeed: 4,
  },
  {
    id: "sentinel",
    slot: "05",
    name: "SENTINEL",
    status: "SENTINEL WATCH",
    tagline: "Risk radar · compliance-grade perimeter",
    tintClass: "glass-tint-emerald",
    accent: "#34d399",
    accentBright: "#6ee7b7",
    ekgSeed: 5,
  },
  {
    id: "vanguard",
    slot: "06",
    name: "VANGUARD",
    status: "VANGUARD POST",
    tagline: "Front-line market ops · field telemetry",
    tintClass: "glass-tint-cyan",
    accent: "#22d3ee",
    accentBright: "#67e8f9",
    ekgSeed: 6,
  },
  {
    id: "sovereign",
    slot: "07",
    name: "SOVEREIGN",
    status: "SOVEREIGN SEAT",
    tagline: "Family-office grade · legacy capital bay",
    tintClass: "glass-tint-sovereign",
    accent: "#e2e8f0",
    accentBright: "#f8fafc",
    ekgSeed: 7,
  },
  {
    id: "aegis",
    slot: "08",
    name: "AEGIS",
    status: "AEGIS SHIELD",
    tagline: "Custody partners · vault-class integration",
    tintClass: "glass-tint-blue",
    accent: "#3b82f6",
    accentBright: "#60a5fa",
    ekgSeed: 8,
  },
  {
    id: "citadel",
    slot: "09",
    name: "CITADEL",
    status: "CITADEL HOLD",
    tagline: "Fortress liquidity · grit-built reserves",
    tintClass: "glass-tint-amber",
    accent: "#fbbf24",
    accentBright: "#fcd34d",
    ekgSeed: 9,
  },
  {
    id: "forge",
    slot: "10",
    name: "FORGE",
    status: "FORGE BAY",
    tagline: "Industrial fintech · blue-collar rails",
    tintClass: "glass-tint-forge",
    accent: "#f97316",
    accentBright: "#fdba74",
    ekgSeed: 10,
  },
  {
    id: "arbiter",
    slot: "11",
    name: "ARBITER",
    status: "ARBITER CHANNEL",
    tagline: "Settlement desk · cross-venue execution",
    tintClass: "glass-tint-arbiter",
    accent: "#fb7185",
    accentBright: "#fda4af",
    ekgSeed: 11,
  },
  {
    id: "phalanx",
    slot: "12",
    name: "PHALANX",
    status: "PHALANX LINE",
    tagline: "Fleet-wide syndicate · unified cockpit API",
    tintClass: "glass-tint-phalanx",
    accent: "#14b8a6",
    accentBright: "#5eead4",
    ekgSeed: 12,
  },
];

const TOP10_PITCH =
  "This bay is reserved for a premier Financial/Crypto partner. 30 AI units. 1 Unified Cockpit. Your data here.";

export function getTop10TierPitch(tier: IntelTop10Tier): string {
  return `${tier.name} tier — ${tier.tagline}. ${TOP10_PITCH}`;
}
