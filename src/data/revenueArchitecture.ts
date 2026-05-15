/** USJET Revenue Architecture — three-tier intelligence ladder. */

export const INTELLIGENCE_ROUTE = "/intelligence" as const;

export const REVENUE_ARCHITECTURE_EYEBROW = "Semper Fi · always faithful execution" as const;

export const REVENUE_ARCHITECTURE_TITLE = "USJET Intelligence Assets" as const;

export const REVENUE_ARCHITECTURE_LEDE =
  "Semper Fi — always faithful execution. Information that doesn't sleep. Intelligence that doesn't quit. Institutional power at the top; professional utility in the middle; community momentum at the base." as const;

export const REVENUE_TRANSFERABLE_TITLE = "Transferable intellectual real estate" as const;

export const REVENUE_TRANSFERABLE_COPY =
  "Ownership of the Sovereign Protocol is a primary capital asset. As the USJET Fleet expands, the market value of this specific IP is projected to appreciate. These products are designed as transferable assets — not disposable subscriptions." as const;

export const REVENUE_TRANSFERABLE_BULLETS = [
  "Founder's Fuel ($19.90/mo): Support the dev. Low-friction entry that builds the community.",
  "Code Kit ($499): Builder tier — Liquid Glass UI, 30-agent orchestration, Stripe and B2B conversion templates.",
  "Fleet Manual ($2,500): Professional operator level — hardcover/digital hybrid implementation of the fleet.",
  "Sovereign Protocol ($100,000): Institutional Vault — first blueprint for 30 AI agents as legal business partners.",
] as const;

export const REVENUE_TIER_BUILDER = {
  id: "code",
  tierLabel: "Builder tier",
  name: "USJET Developer’s Engine Kit",
  subtitle: "Source Code & Logic",
  priceDisplay: "$499.00",
  period: "",
  stripeDescription:
    "Production-ready USJET codebase: Liquid Glass React/Tailwind library, 30-agent orchestration framework, and Stripe plus B2B lead-gen templates. Professional-grade builder asset — zero bloat.",
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
  id: "manual",
  tierLabel: "Operator tier",
  name: "The USJET Fleet Manual",
  subtitle: "Professional Edition",
  priceDisplay: "$2,500",
  period: "",
  stripeDescription:
    "The professional-grade implementation guide for blue-collar AI transition. This manual provides the direct operational logic to integrate AI agents into existing labor workflows, shop management, and logistics. High-efficiency, actionable intelligence for the serious operator. Includes digital manual access and priority fleet updates.",
  logic: "No slow signals. A professional tool priced like a top-tier diagnostic — for shop owners and fleet managers.",
  cta: "Buy now",
  detailRoute: "/fleet-manual",
} as const;

export const REVENUE_TIER_ANCHOR = {
  id: "protocol",
  tierLabel: "Anchor tier",
  name: "The Sovereign Fleet Protocol",
  subtitle: "Volume I · Hardcover Vault Edition",
  priceDisplay: "$100,000",
  period: "",
  stripeDescription:
    'The definitive blueprint for Human-AI Enterprise Integration. This restricted-access protocol details the legal, capital, and technical architecture of the 30-Agent USJET Fleet. Designed as a transferable Intellectual Property asset with high appreciation potential. Includes the first-ever physical hardcover "Vault Edition." Restricted to institutional-grade acquisition.',
  logic: "Transferable capital asset. 30 AI agents as legal business partners — confidentiality-gated acquisition.",
  cta: "Buy now",
  detailRoute: "/100k",
} as const;

export const REVENUE_TIERS = [REVENUE_TIER_COMMUNITY, REVENUE_TIER_OPERATOR, REVENUE_TIER_ANCHOR] as const;
