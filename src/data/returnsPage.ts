/**
 * Public Returns & warranty — `/returns`.
 * Only restates what is already published in Terms. Does not invent a 30-day policy.
 */

import { SITE_ORIGIN } from "./siteSeo";
import { TERMS_EFFECTIVE_DATE, TERMS_ENTITY, TERMS_ROUTE } from "./termsPage";

export const RETURNS_ROUTE = "/returns" as const;

export const RETURNS_CANONICAL_URL = `${SITE_ORIGIN}${RETURNS_ROUTE}` as const;

export const RETURNS_PAGE_TITLE = "Returns & Warranty | USJET.AI" as const;

export const RETURNS_META_DESCRIPTION =
  "USJET.AI returns and warranty: manufacturer coverage on the hardware, how to reach ops@usjet.ai, and what the published Terms actually say." as const;

export const RETURNS_SECTIONS = [
  {
    id: "hardware",
    title: "Operator's Rig hardware",
    paragraphs: [
      `${TERMS_ENTITY} sells the listed computer, configures it as an Operator's Rig, and ships to U.S. addresses. That mechanic is in the Terms (effective ${TERMS_EFFECTIVE_DATE}).`,
      "Original manufacturer warranties (Apple, AMD OEM, and the other brands on the tiles) apply to the machine itself. Those warranties sit in addition to, not in place of, anything USJET publishes.",
      "A numbered USJET return window and restocking fee are marked as a placeholder in the Terms — they are not a confirmed store policy on this page. Do not assume a 30-day no-questions return.",
      "If a unit arrives damaged, dead, or missing the install we sold, write ops@usjet.ai with your Stripe receipt and photos. We will handle that as an order problem, not as a slogan.",
    ],
  },
  {
    id: "cockpit",
    title: "Optional monthly cockpit (Flight Pass and up)",
    paragraphs: [
      "Flight Pass ($19.90/mo), Hangar Pro ($49.95/mo), and Enterprise Commander ($199.99/mo) are recurring Stripe subscriptions. Cancel any time through Stripe or by emailing ops@usjet.ai.",
      "Cancellation stops future renewals. The current billing period is not refunded unless the law requires it. That is the published Terms line — not a new promise.",
    ],
  },
  {
    id: "legal",
    title: "The full agreement",
    paragraphs: [
      `This page is a plain-language map of ${TERMS_ROUTE}. If anything here conflicts with the Terms, the Terms control.`,
    ],
  },
] as const;
