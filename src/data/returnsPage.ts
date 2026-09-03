/**
 * Public Returns, Refunds & Shipping policy — `/returns`.
 * Mirrors privacyPage.ts / termsPage.ts structure.
 *
 * WHY THIS IS A STANDALONE PAGE AND NOT A SECTION OF /terms:
 * New York GBL 218-a, as amended 7 August 2025, extends the refund-policy
 * posting rule to online retailers. The policy must be displayed or linked
 * NEAR THE ITEM ITSELF, or shown before billing information is requested.
 * A clause buried in a footer-linked Terms page reached after checkout does
 * not satisfy it. Without a conforming posted policy the buyer may demand a
 * cash refund at their option for up to 30 days.
 *
 * Terms below confirmed by Ameer Karim, 2 September 2026.
 */

import { SITE_ORIGIN } from "./siteSeo";

export const RETURNS_ROUTE = "/returns" as const;

export const RETURNS_CANONICAL_URL = `${SITE_ORIGIN}${RETURNS_ROUTE}` as const;

export const RETURNS_PAGE_TITLE = "Returns, Refunds & Shipping · USJET.AI" as const;

export const RETURNS_META_DESCRIPTION =
  "USJET.AI returns and shipping policy — 14-day returns, 10% restocking on opened units, refunds to the original payment method within 7 business days, and rigs shipped within 10 business days of cleared payment." as const;

export const RETURNS_EFFECTIVE_DATE = "September 2, 2026" as const;

export const RETURNS_ENTITY = "USJET LLC" as const;

export type ReturnsSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export const RETURNS_SECTIONS: readonly ReturnsSection[] = [
  {
    id: "shipping",
    title: "Shipping",
    paragraphs: [
      "Every Operator's Rig is built to order. We buy the exact machine, configure it, test it, and ship it.",
      "Rigs ship within 10 business days of cleared payment. Tracking is provided at dispatch. Payment is by bank transfer (ACH) or check, and the 10-day clock starts when payment clears — not when the invoice is sent.",
      "If we cannot ship within that window we will contact you before the deadline and offer you the choice of a revised date or a full refund, without you having to ask for it.",
      "Orders ship to US addresses only. Risk of loss passes to you on delivery.",
    ],
  },
  {
    id: "returns",
    title: "Returns",
    paragraphs: ["We accept returns within 14 days of delivery."],
    bullets: [
      "The machine must be in original condition with all accessories and packaging.",
      "You pay return shipping. We recommend insuring it.",
      "Opened units carry a 10% restocking fee — $10 back for every $100 of the rig's price.",
      "Unopened units are refunded in full, less original shipping.",
    ],
  },
  {
    id: "books",
    title: "Books",
    paragraphs: [
      "The USJET AI Book Series is not returnable. The volumes included with a rig carry no separate charge, and books bought on their own are digital or fulfilled by Amazon under Amazon's own return policy.",
    ],
  },
  {
    id: "as-is",
    title: "Sale and \"as is\" merchandise",
    paragraphs: [
      "We do not currently sell sale-priced, clearance, refurbished, or \"as is\" merchandise. If we ever do, that listing will state its own return terms on the product page, and those terms replace this section for that item only.",
    ],
  },
  {
    id: "proof",
    title: "Proof of purchase",
    paragraphs: [
      "Your invoice number, or the email address the invoice was sent to, is sufficient. We keep a record of every machine we ship, including its serial number, so we can verify a purchase without a receipt.",
    ],
  },
  {
    id: "refunds",
    title: "How refunds are issued",
    paragraphs: [
      "Refunds go back to the original payment method — the bank account the transfer came from, or a check to the address on the order. We do not issue store credit.",
      "Refunds are issued within 7 business days of our receiving the returned machine.",
    ],
  },
  {
    id: "fees",
    title: "Fees",
    paragraphs: [
      "The only fee is the 10% restocking fee on opened units, stated above. There are no processing, handling, or cancellation fees.",
    ],
  },
  {
    id: "cancelling",
    title: "Cancelling before shipment",
    paragraphs: [
      "You may cancel any time before the rig ships, for a full refund with no restocking fee, by emailing ops@usjet.ai. Once the machine is dispatched, the 14-day return terms apply instead.",
    ],
  },
  {
    id: "damaged",
    title: "Damaged in transit",
    paragraphs: [
      "Tell us within 48 hours of delivery, with photographs. We handle the carrier claim, you are not out of pocket, and the restocking fee does not apply.",
    ],
  },
  {
    id: "how-to",
    title: "How to start a return",
    paragraphs: [
      "Email ops@usjet.ai with your invoice number and the reason. We reply with a return address and instructions within one business day.",
    ],
  },
];
