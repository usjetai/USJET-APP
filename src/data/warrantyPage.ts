/**
 * USJET Limited Warranty — `/warranty`.
 *
 * SHAPE IS LEGALLY DRIVEN. The Magnuson-Moss Warranty Act requires a written
 * warranty on a consumer product over $15 to be a single document, in plain
 * language, containing nine specific disclosures, conspicuously designated
 * "Full" or "Limited", and available to the buyer BEFORE the sale
 * (16 CFR 701.3(a), 15 USC 2303, 16 CFR 702.3).
 *
 * Two things here are not stylistic and must not be "tidied":
 *   1. The anti-tying language (15 USC 2302(c)). "Warranty void if opened" or
 *      "void if third-party parts" clauses are UNLAWFUL. We exclude damage
 *      CAUSED BY such work — that is a causation exclusion, not a tie.
 *   2. Implied warranties are LIMITED IN DURATION, never disclaimed
 *      (15 USC 2308). The two "some states do not allow..." sentences are
 *      required verbatim-equivalents and must stay.
 *
 * Pre-sale availability also requires the URL plus a non-internet contact
 * route printed on the box, and a printed copy inside every rig.
 */

import { SITE_ORIGIN } from "./siteSeo";

export const WARRANTY_ROUTE = "/warranty" as const;

export const WARRANTY_CANONICAL_URL = `${SITE_ORIGIN}${WARRANTY_ROUTE}` as const;

export const WARRANTY_PAGE_TITLE = "USJET Limited Warranty · USJET.AI" as const;

export const WARRANTY_META_DESCRIPTION =
  "The USJET Limited Warranty — 90 days on the configuration and software setup of every Operator's Rig, how to get service, and how Apple's own hardware warranty applies alongside it." as const;

export const WARRANTY_EFFECTIVE_DATE = "September 2, 2026" as const;

export const WARRANTY_ENTITY = "USJET LLC" as const;

export const WARRANTY_DESIGNATION = "Limited Warranty" as const;

export type WarrantySection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export const WARRANTY_SECTIONS: readonly WarrantySection[] = [
  {
    id: "covers",
    title: "What this warranty covers",
    paragraphs: [
      "This Limited Warranty covers the configuration and software setup USJET performed on your Operator's Rig: the local AI engine and its installed models, the operator dashboard, the document vault setup, and the machine arriving in working order as configured.",
    ],
  },
  {
    id: "excludes",
    title: "What it does not cover",
    paragraphs: [],
    bullets: [
      "The Apple hardware. The Mac is covered by Apple's own one-year limited hardware warranty — see \"Your Apple warranty\" below.",
      "Software you install yourself, and changes you make to the configuration.",
      "Data loss. Keep your own backups; we cannot recover your files.",
      "The content of anything the AI models produce. Local models are third-party open-weight software supplied under their own licenses, and their output is not warranted by anyone, including us.",
      "Damage from accident, liquid, power events, or misuse.",
    ],
  },
  {
    id: "opening",
    title: "Opening the machine does not void this warranty",
    paragraphs: [
      "Opening the machine or installing your own software does not void this warranty. We only exclude damage actually caused by such work. Any sticker, seal, or clause claiming otherwise would be unlawful, and we do not use one.",
    ],
  },
  {
    id: "who",
    title: "Who it covers",
    paragraphs: [
      "The original purchaser of the rig from USJET LLC. It is not transferable.",
    ],
  },
  {
    id: "duration",
    title: "How long it lasts",
    paragraphs: ["90 days from the delivery date."],
  },
  {
    id: "remedy",
    title: "What we will do",
    paragraphs: [
      "At our option and at our expense, we will remotely re-configure or re-image the software setup, or walk you through doing it. If the fault cannot be fixed remotely we will arrange return shipping at our cost and repair or replace the configuration.",
      "You are responsible for backing up your own data before any service.",
    ],
  },
  {
    id: "service",
    title: "How to get warranty service",
    paragraphs: [
      "Email ops@usjet.ai with your invoice number and the machine's serial number, or call (516) 305-3396, or write to USJET LLC, 2248 Broadway 1482, New York, NY 10024. We reply within one business day.",
    ],
  },
  {
    id: "dispute",
    title: "Informal dispute settlement",
    paragraphs: [
      "USJET does not operate an informal dispute settlement mechanism. You may pursue any remedy available to you under law.",
    ],
  },
  {
    id: "apple",
    title: "Your Apple warranty",
    paragraphs: [
      "Your Mac is a new machine purchased by USJET LLC and configured before shipment. Apple's one-year limited hardware warranty applies and began on USJET's purchase date, not on your delivery date — so less than twelve months will remain when it reaches you. The exact remaining term, the serial number, and USJET's dated proof of purchase ship with the machine.",
      "Apple hardware service goes to Apple, not to us.",
      "USJET LLC is not affiliated with, authorized by, sponsored by, or endorsed by Apple Inc. Apple, Mac, Mac mini, and macOS are trademarks of Apple Inc.",
    ],
  },
  {
    id: "implied",
    title: "Implied warranties",
    paragraphs: [
      "Any implied warranties, including the implied warranties of merchantability and fitness for a particular purpose, are limited in duration to 90 days, the same as this written warranty.",
      "Some states do not allow limitations on how long an implied warranty lasts, so the above limitation may not apply to you.",
    ],
  },
  {
    id: "consequential",
    title: "Incidental and consequential damages",
    paragraphs: [
      "USJET LLC is not liable for incidental or consequential damages, including lost data, lost profits, or business interruption.",
      "Some states do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation or exclusion may not apply to you.",
    ],
  },
  {
    id: "rights",
    title: "Your legal rights",
    paragraphs: [
      "This warranty gives you specific legal rights, and you may also have other rights which vary from State to State.",
    ],
  },
];
