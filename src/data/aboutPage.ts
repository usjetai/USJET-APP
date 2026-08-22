/** Public About — `/about`. Facts already on the ledger. No invented biography. */

import { FOUNDER_PUBLIC_NAME, FOUNDER_PUBLIC_NAME_KICKER } from "./founderManifesto";
import { SITE_ORIGIN } from "./siteSeo";
import {
  USJET_BUSINESS_ADDRESS_LINES,
  USJET_BUSINESS_PHONE_DISPLAY,
  USJET_ENTITY_FOOTER,
  USJET_OPS_EMAIL,
} from "../lib/usjetContact";

export const ABOUT_ROUTE = "/about" as const;

export const ABOUT_CANONICAL_URL = `${SITE_ORIGIN}${ABOUT_ROUTE}` as const;

export const ABOUT_PAGE_TITLE = "About — Ameer Karim & USJET LLC | USJET.AI" as const;

export const ABOUT_META_DESCRIPTION =
  "USJET.AI is operated by USJET LLC. Founder Ameer Karim. We sell the Operator's Rig — a computer with a local assistant already on it." as const;

export const ABOUT_FOUNDER_NAME = FOUNDER_PUBLIC_NAME;

export const ABOUT_FOUNDER_KICKER = FOUNDER_PUBLIC_NAME_KICKER;

export const ABOUT_ENTITY_LINE = USJET_ENTITY_FOOTER;

export const ABOUT_SECTIONS = [
  {
    id: "who",
    title: "Who this is",
    paragraphs: [
      `${FOUNDER_PUBLIC_NAME} is the founder of USJET.AI. The company on the invoice is USJET LLC, established in 2018.`,
      "We sell computers that already have a local assistant on them — the Operator's Rig. Homes is the house shop. Business is the shop and office shop. Manuals are the books. That is the product.",
    ],
  },
  {
    id: "what",
    title: "What we will not invent on this page",
    paragraphs: [
      "This is not a magazine profile. There is no staged biography, no fake customer photos, and no review reel. If you need a human, write ops@usjet.ai or call the number on the header.",
    ],
  },
] as const;

export const ABOUT_FACTS = [
  { label: "Founder", value: FOUNDER_PUBLIC_NAME },
  { label: "Company", value: "USJET LLC" },
  { label: "Established", value: "2018" },
  { label: "Mail", value: USJET_BUSINESS_ADDRESS_LINES.join(", ") },
  { label: "Ops", value: USJET_OPS_EMAIL },
  { label: "Phone", value: USJET_BUSINESS_PHONE_DISPLAY },
] as const;
