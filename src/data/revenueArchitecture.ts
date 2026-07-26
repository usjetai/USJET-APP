/** USJET Revenue Architecture — three-tier intelligence ladder. */

export const INTELLIGENCE_ROUTE = "/intelligence" as const;

export const REVENUE_ARCHITECTURE_EYEBROW = "Semper Fi · always faithful execution" as const;

export const REVENUE_ARCHITECTURE_TITLE = "USJET Intelligence Assets" as const;

export const REVENUE_ARCHITECTURE_LEDE =
  "Semper Fi — always faithful execution. Information that doesn't sleep. Intelligence that doesn't quit. Professional utility at the top; community momentum at the base." as const;

export const REVENUE_TRANSFERABLE_TITLE = "Transferable intellectual real estate" as const;

export const REVENUE_TRANSFERABLE_COPY =
  "As the USJET Fleet expands, the market value of this IP is projected to appreciate. These products are designed as transferable assets — not disposable subscriptions." as const;

export const REVENUE_TRANSFERABLE_BULLETS = [
  "Flight Pass ($19.90/mo): Full Hangar + all 30 Fleet AIs + Member Portal.",
  "Hangar Pro ($49.95/mo): Everything in Flight Pass + live Intel board.",
  "Enterprise Commander ($199.99/mo): Everything in Hangar Pro + Origin command.",
] as const;

export const REVENUE_TIER_BUILDER = {
  id: "code",
  tierLabel: "Builder tier",
  name: "USJET Developer’s Engine Kit",
  subtitle: "Source Code & Logic",
  priceDisplay: "$499.00",
  period: "",
  stripeDescription:
    "Production-ready USJET codebase: Liquid Glass React/Tailwind library, 30-agent orchestration framework, and Stripe lead-gen templates. Professional-grade builder asset — zero bloat.",
  logic: "For developers and tech-forward operators who want the engine room, not just the cockpit.",
  cta: "Acquire Engine Kit",
  detailRoute: "/code-kit",
} as const;

export const REVENUE_TIER_COMMUNITY = {
  id: "fuel",
  tierLabel: "Community tier",
  name: "Founder's Fuel",
  priceDisplay: "$19.90",
  period: "/mo",
  stripeDescription:
    "Fuel the mission of USJET.AI. This tier supports the 15-hour dev sprints and the expansion of the AI Fleet for blue-collar America. Members receive early-access intelligence reports and a status badge within the USJET ecosystem.",
  logic: "Low-friction entry for supporters. Fuel the fleet, unlock early access, keep the code moving.",
  cta: "Fuel the mission",
  detailRoute: "/founders-fuel",
} as const;

export const REVENUE_TIER_OPERATOR = {
  id: "hangar-pro",
  tierLabel: "Operator tier",
  name: "Hangar Pro",
  subtitle: "Fleet + live Intel",
  priceDisplay: "$49.95",
  period: "/mo",
  stripeDescription:
    "Everything in Flight Pass plus the live Intel board — Crypto and NYSE pulse in the same cockpit. High-velocity operator sync with no second login.",
  logic: "For crews who run the board and the bay together.",
  cta: "Clear Hangar Pro",
  detailRoute: "/special?tier=hangar-pro",
} as const;

export const REVENUE_TIERS = [REVENUE_TIER_COMMUNITY, REVENUE_TIER_OPERATOR] as const;
