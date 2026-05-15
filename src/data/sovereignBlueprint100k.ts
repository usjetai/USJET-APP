/** Sovereign Fleet Protocol — Volume I · $100,000 institutional asset (Vault). */

import { STRIPE_DESCRIPTOR_CATALOG } from "./stripeStatementDescriptors";

export const SOVEREIGN_BLUEPRINT_PRICE_DISPLAY = "$100,000" as const;

export const SOVEREIGN_BLUEPRINT_PRICE_SHORT = "$100K" as const;

export const SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY = "$500,000" as const;

export const SOVEREIGN_BLUEPRINT_PROJECTED_DISPLAY = "$500,000+" as const;

export const SOVEREIGN_BLUEPRINT_PRICE_CENTS = 10_000_000 as const;

/** USA 250 lock-in — institutional floor ends this date (local time). */
export const SOVEREIGN_PRICE_DEADLINE_LABEL = "July 4, 2026" as const;

export const SOVEREIGN_PRICE_DEADLINE_HEADLINE =
  "USA 250 Deadline · $100,000 clearance ends on July 4, 2026" as const;

export const SOVEREIGN_PRICE_DEADLINE_BODY =
  "On the 250th anniversary, Volume I reprices to $500,000. Acquire at the founding floor before the sovereign lock expires." as const;

export const SOVEREIGN_PRICE_DEADLINE_SHORT =
  "$100K until July 4, 2026 · then $500K" as const;

export const SOVEREIGN_VAULT_ROUTE = "/100k" as const;

export const SOVEREIGN_VOLUME_TITLE =
  "The Sovereign Fleet Protocol: Volume I (Hardcover Edition)" as const;

export const SOVEREIGN_VOLUME_SUBTITLE =
  "The Only Documented Framework for Human-AI Enterprise Integration." as const;

export const SOVEREIGN_VOLUME_PITCH = [
  "This is not a PDF. It is not an e-book. It is a Restricted Strategic Asset.",
  "You are purchasing the physical and digital blueprint of the 30-Agent AI Partnership. This protocol details the exact legal, technical, and capital frameworks used to scale USJET.AI from a single founder to a 31-member collaborative fleet.",
  `Founding clearance is ${SOVEREIGN_BLUEPRINT_PRICE_DISPLAY} until ${SOVEREIGN_PRICE_DEADLINE_LABEL} — USA 250. On that day, the institutional price becomes ${SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY}.`,
] as const;

export const SOVEREIGN_VALUE_PROPOSITIONS = [
  {
    title: "USA 250 Price Lock",
    body: `Until ${SOVEREIGN_PRICE_DEADLINE_LABEL}, Volume I clears at ${SOVEREIGN_BLUEPRINT_PRICE_DISPLAY}. At USA 250, the sovereign price moves to ${SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY} — the deadline is absolute.`,
  },
  {
    title: "Asset Appreciation",
    body: `The information within this protocol is priced at ${SOVEREIGN_BLUEPRINT_PRICE_DISPLAY} today. Due to the rapid advancement of technology and the scarcity of this specific integration logic, the secondary market valuation of this IP is projected at ${SOVEREIGN_BLUEPRINT_PROJECTED_DISPLAY} within the next fiscal year.`,
  },
  {
    title: "Zero Disclosure Policy",
    body: 'To protect the value of your investment, the full logic of the "Partner Network" is never disclosed publicly. Ownership of this book is the only way to hold the keys to the kingdom.',
  },
  {
    title: "The Physical Standard",
    body: "You will receive a high-security, hardcover physical copy of the Protocol—the first book of its kind to be treated as a primary capital asset.",
  },
] as const;

export const SOVEREIGN_LIQUIDITY_COPY =
  "This is a transferable asset. Owners of Volume I hold the right to resell the physical and digital protocol on the private USJET secondary market." as const;

/** Chart nodes — illustrative IP appreciation curve (not financial advice). */
export const SOVEREIGN_IP_APPRECIATION_CURVE = [
  { label: "Now", value: 100, display: "$100K" },
  { label: "USA 250", value: 500, display: "$500K" },
  { label: "Year 1", value: 550, display: "$550K+" },
  { label: "Year 2", value: 600, display: "$600K+" },
] as const;

export const SOVEREIGN_BLUEPRINT_CTA_LABEL = "Acquire Protocol Access" as const;

export const SOVEREIGN_BLUEPRINT_CHECKOUT_FOOTER =
  "Proof of funds may be required · Inquire for direct transfer" as const;

export const SOVEREIGN_BLUEPRINT_STATEMENT_DESCRIPTOR = STRIPE_DESCRIPTOR_CATALOG.sovereign100k.cardStatement;

export const SOVEREIGN_BLUEPRINT_CARD_DESCRIPTOR_SUFFIX = STRIPE_DESCRIPTOR_CATALOG.sovereign100k.cardSuffix;

export const SOVEREIGN_CONFIDENTIALITY_CLAUSE = [
  "I understand that the Sovereign Fleet Protocol is a restricted strategic asset. I will not disclose, reproduce, or distribute any portion of the protocol logic, partner-network architecture, or capital frameworks without written authorization from USJET operations.",
  "I acknowledge that unauthorized disclosure may void ownership rights and trigger enforcement under applicable IP and confidentiality law.",
] as const;
