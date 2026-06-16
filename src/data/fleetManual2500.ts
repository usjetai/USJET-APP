/** USJET Fleet Manual — Professional Edition ($2,500). */

import { STRIPE_DESCRIPTOR_CATALOG } from "./stripeStatementDescriptors";

export const FLEET_MANUAL_ROUTE = "/fleet-manual" as const;

/** Public shorthand for footer and page chrome. */
export const FLEET_MANUAL_PAGE_SHORT = "2.5K" as const;

export const FLEET_MANUAL_PRICE_DISPLAY = "$2,500" as const;

export const FLEET_MANUAL_PRICE_CENTS = 250_000 as const;

export const FLEET_MANUAL_LICENSE_CAP = 500 as const;

export const FLEET_MANUAL_TITLE = "The USJET Fleet Manual: Professional Edition" as const;

export const FLEET_MANUAL_TAGLINE = "Semper Fi · always faithful execution" as const;

export const FLEET_MANUAL_LEDE =
  "The blueprint for active implementation. This manual bridges the gap between traditional labor and AI-driven scale. If you are running a fleet, a shop, or a crew, this is your operating system." as const;

export const FLEET_MANUAL_POSITIONING = [
  "Priced at the cost of a top-tier professional tool — a no-brainer for operators moving into the AI era.",
  "Practical implementation: how to set up and run 30 AI agents to manage a labor-based business.",
  "No slow signals. No filler. Raw, actionable intelligence for shop owners, contractors, and developers with capital.",
] as const;

export const FLEET_MANUAL_FEATURES = [
  "30-agent deployment playbooks for shops, crews, and field ops",
  "Labor-to-AI handoff SOPs — intake, dispatch, billing, closeout",
  "Cockpit-ready checklists — daily, weekly, monthly command rhythm",
  "Implementation-only IP — not the Sovereign legal/capital black box",
] as const;

export const FLEET_MANUAL_SCARCITY_COPY = `Limited to ${FLEET_MANUAL_LICENSE_CAP} Professional Licenses` as const;

export const FLEET_MANUAL_CTA_LABEL = "Acquire Professional License" as const;

export const FLEET_MANUAL_STATEMENT_DESCRIPTOR = STRIPE_DESCRIPTOR_CATALOG.fleetManual.cardStatement;

export const FLEET_MANUAL_CARD_DESCRIPTOR_SUFFIX = STRIPE_DESCRIPTOR_CATALOG.fleetManual.cardSuffix;

export const FLEET_MANUAL_CHECKOUT_FOOTER = "One-time license · serious operators only" as const;
