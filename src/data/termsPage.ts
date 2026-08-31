/** Public Terms of Service — `/terms`. Mirrors privacyPage.ts structure. */

import { SITE_ORIGIN } from "./siteSeo";

export const TERMS_ROUTE = "/terms" as const;

export const TERMS_CANONICAL_URL = `${SITE_ORIGIN}${TERMS_ROUTE}` as const;

export const TERMS_PAGE_TITLE = "Terms of Service · USJET.AI" as const;

export const TERMS_META_DESCRIPTION =
  "USJET.AI Terms of Service — AI Computers hardware orders, AI Book Series, shipping and returns, AI-output disclaimers, and account terms." as const;

/**
 * NOTE for Ameer / counsel: this is a first-pass draft covering the mechanics
 * already live on the site (hardware checkout, AI chat surfaces reached from
 * product pages). Two things below are placeholders that need a human decision,
 * marked inline:
 *   1. Governing law / venue (state of LLC formation not present anywhere in the repo).
 *   2. Hardware return window + restocking fee — a real business policy, not a legal one.
 * This has not been reviewed by an attorney. Get one before treating it as final,
 * especially given the live Form C / Wefunder crowdfunding activity referenced below.
 */
export const TERMS_EFFECTIVE_DATE = "August 31, 2026" as const;

export const TERMS_ENTITY = "USJET LLC" as const;

export type TermsSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    paragraphs: [
      "These Terms of Service (\"Terms\") govern your use of USJET.AI — the AI Computers hardware store, AI Book Series, and all associated pages (the \"Service\") — operated by USJET LLC (\"USJET,\" \"we,\" \"us\").",
      "By using the Service or placing an order, you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the Service.",
      "You must be at least 18 years old, or the age of majority in your jurisdiction, and able to form a binding contract to use the Service.",
    ],
  },
  {
    id: "hardware-orders",
    title: "AI Computers — hardware orders",
    paragraphs: [
      "AI Computers listings (Homes and Businesses lineups) are sold by USJET, not drop-shipped: we purchase the listed unit and configure it as an Operator's Rig (Ollama, Open WebUI, AnythingLLM, AI Book Series) before shipping. Each order is a one-time purchase — there is no subscription or recurring charge.",
      "Prices, specs, and availability shown on the site can change without notice until you complete Stripe checkout. Orders ship to US addresses only. Risk of loss passes to you on delivery to the shipping carrier.",
      "Items marked \"Talk to order\" are configured to your specification after you contact ops@usjet.ai; price and availability for those units are confirmed directly with you before any charge.",
      "[Placeholder — confirm and publish your actual policy] Defective-on-arrival units may be returned within 30 days of delivery for repair, replacement, or refund at USJET's discretion. Change-of-mind returns, if offered, may carry a restocking fee and require the unit in original condition. Original manufacturer warranties (Apple, AMD OEM, etc.) apply in addition to, not in place of, any policy stated here.",
    ],
  },
  {
    id: "books",
    title: "AI Book Series — Amazon orders",
    paragraphs: [
      "AI Book Series titles (Kindle and paperback) are sold and fulfilled by Amazon, not USJET. Clicking a book's buy button takes you to that title's Amazon listing; Amazon's own terms, pricing, and return policy govern that purchase.",
    ],
  },
  {
    id: "ai-content",
    title: "AI-generated content",
    paragraphs: [
      "Some AI Computers product pages let you launch a partner AI assistant (for example, from an on-page chat tile) to preview what the machine's local AI stack can do. These launches are AI-generated using third-party models. Responses can be incomplete, outdated, or wrong.",
      "Nothing produced by these AI surfaces is professional legal, medical, financial, or safety advice. You are responsible for independently verifying anything you rely on before acting on it.",
      "Do not use the Service to generate content that is illegal, infringing, or intended to impersonate a real person or another AI partner.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    bullets: [
      "No reverse-engineering, scraping, or reselling access to the Service.",
      "No automated abuse of chat or checkout surfaces beyond normal interactive use.",
      "No unlawful, harassing, or infringing use of the Service.",
    ],
    paragraphs: [],
  },
  {
    id: "ip",
    title: "Intellectual property",
    paragraphs: [
      "USJET, the USJET logo, Operator's Rig, and related marks are the property of USJET LLC. Site content and the AI Book Series are protected by copyright and other applicable laws.",
      "Nothing in these Terms grants you rights to USJET's trademarks or content beyond what's needed to use the Service as intended.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party services",
    paragraphs: [
      "The Service relies on third-party providers, including Stripe (payments), Amazon (book fulfillment), Google Analytics (site analytics), and AI providers (OpenAI, Google Vertex AI, and/or OpenRouter-routed models) used by the on-page partner AI launches described above. Those providers process data under their own terms and privacy policies.",
      "A partner AI launch may load a partner's own page inside the same browser window; once you interact with a partner module, that partner's own terms apply to that interaction.",
    ],
  },
  {
    id: "investment",
    title: "Crowdfunding & investment content",
    paragraphs: [
      "Operator Log posts referencing a Form C filing, community equity round, or Wefunder relaunch are informational updates only. This website is not itself an offer to sell securities.",
      "Any actual offer, subscription agreement, or investment is made exclusively through Wefunder's registered funding portal under Regulation Crowdfunding, governed by the definitive offering documents filed with the SEC and posted on Wefunder — not by this page. If anything on usjet.ai conflicts with the official Wefunder listing or Form C, the Wefunder listing and Form C control.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    paragraphs: [
      "THE SERVICE AND ALL CONTENT ARE PROVIDED \"AS IS\" AND \"AS AVAILABLE,\" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT, TO THE MAXIMUM EXTENT PERMITTED BY LAW.",
      "We do not guarantee the Service will be uninterrupted, error-free, or that AI-generated output will be accurate.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, USJET LLC WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.",
      "USJET's total liability for any claim relating to the Service will not exceed the amount you paid USJET in the twelve months before the claim arose. This limitation does not apply where prohibited by law.",
    ],
  },
  {
    id: "indemnification",
    title: "Indemnification",
    paragraphs: [
      "You agree to indemnify and hold USJET LLC harmless from claims, damages, and expenses arising from your misuse of the Service or violation of these Terms.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing law & disputes",
    paragraphs: [
      "[Placeholder — confirm with counsel] These Terms are governed by the laws of the state in which USJET LLC is organized, without regard to conflict-of-laws principles. Disputes will be resolved in the state or federal courts located in that state, and you consent to jurisdiction there.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    paragraphs: [
      "We may suspend or terminate access to the Service for anyone who violates these Terms. You may stop using the Service at any time.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    paragraphs: [
      "We may update these Terms as the platform evolves. The effective date above will change when we do. Continued use after an update means you accept the revised Terms.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "Questions about these Terms: ops@usjet.ai. Institutional entity: USJET LLC · Established in 2018.",
    ],
  },
];
