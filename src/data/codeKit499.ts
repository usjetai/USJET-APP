/** USJET Developer’s Engine Kit — Source Code & Logic ($499). */

import { STRIPE_DESCRIPTOR_CATALOG } from "./stripeStatementDescriptors";

export const CODE_KIT_ROUTE = "/code-kit" as const;

export const CODE_KIT_PAGE_SHORT = "Code" as const;

export const CODE_KIT_PRICE_DISPLAY = "$499.00" as const;

export const CODE_KIT_PRICE_CENTS = 49_900 as const;

export const CODE_KIT_STRIPE_PRODUCT_NAME = "USJET Code Kit" as const;

export const CODE_KIT_TITLE = "USJET Developer’s Engine Kit" as const;

export const CODE_KIT_SUBTITLE = "Source Code & Logic Kit" as const;

export const CODE_KIT_TAGLINE = "Engine room · professional grade" as const;

export const CODE_KIT_LEDE =
  "Production-ready codebase — not a tutorial. The exact React, Tailwind, orchestration, and conversion layers fueling the USJET fleet. Build an industrial-grade AI interface in hours, not months." as const;

export const CODE_KIT_GUARANTEE =
  "Optimized for performance. Zero bloat. This is the exact code fueling the USJET fleet. Build your own industrial-grade AI interface in hours, not months." as const;

export const CODE_KIT_PACKAGES = [
  {
    id: "liquid-glass",
    title: "Liquid Glass Component Library",
    detail: "React + Tailwind modules for the high-tech UI — glass surfaces, runway cards, and cockpit chrome.",
  },
  {
    id: "fleet-logic",
    title: "30-Agent Logic Framework",
    detail: "Prompt-engineering and orchestration patterns used to run the fleet — bay routing, host rotation, static curriculum voice.",
  },
  {
    id: "revenue-templates",
    title: "Stripe Lead-Gen Templates",
    detail: "High-conversion checkout and enterprise briefing flows — the same architecture behind the $2,500 tier.",
  },
] as const;

export const CODE_KIT_CTA_LABEL = "Acquire Engine Kit" as const;

export const CODE_KIT_NAV_BUTTON = "Access Source & Logic (Code)" as const;

export const CODE_KIT_STATEMENT_DESCRIPTOR = STRIPE_DESCRIPTOR_CATALOG.codeKit.cardStatement;

export const CODE_KIT_CARD_DESCRIPTOR_SUFFIX = STRIPE_DESCRIPTOR_CATALOG.codeKit.cardSuffix;

export const CODE_KIT_CHECKOUT_FOOTER = "One-time license · builders and tech-forward operators" as const;

export const CODE_KIT_ENGINE_ROOM_EYEBROW = "Engine room" as const;

export const CODE_KIT_ENGINE_ROOM_TITLE = "USJET Source Code & Logic Kit" as const;
