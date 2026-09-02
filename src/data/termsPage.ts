/** Public Terms of Service — `/terms`. Mirrors privacyPage.ts structure. */

import { SITE_ORIGIN } from "./siteSeo";

export const TERMS_ROUTE = "/terms" as const;

export const TERMS_CANONICAL_URL = `${SITE_ORIGIN}${TERMS_ROUTE}` as const;

export const TERMS_PAGE_TITLE = "Terms of Service · USJET.AI" as const;

export const TERMS_META_DESCRIPTION =
  "USJET.AI Terms of Service — Operator's Rig hardware orders, shipping, returns and warranty, subscription clearance tiers, AI-output disclaimers, and account terms." as const;

/**
 * NOTE for Ameer / counsel: this is a first-pass draft covering the mechanics
 * already live on the site (subscriptions, hardware checkout, AI chat surfaces).
 * Two things below are placeholders that need a human decision, marked inline:
 *   1. Governing law / venue (state of LLC formation not present anywhere in the repo).
 *   2. Hardware return window + restocking fee — a real business policy, not a legal one.
 * This has not been reviewed by an attorney. Get one before treating it as final,
 * especially given the live Form C / Wefunder crowdfunding activity referenced below.
 */
export const TERMS_EFFECTIVE_DATE = "August 16, 2026" as const;

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
      "These Terms of Service (\"Terms\") govern your use of USJET.AI — the sovereign AI fleet cockpit, Member Portal, AI Computers hardware store, and all associated pages (the \"Service\") — operated by USJET LLC (\"USJET,\" \"we,\" \"us\").",
      "By using the Service, placing an order, or clearing a subscription tier, you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the Service.",
      "You must be at least 18 years old, or the age of majority in your jurisdiction, and able to form a binding contract to use the Service.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts & member verification",
    paragraphs: [
      "USJET does not offer Google, Apple, or other OAuth sign-in. Clearance is Stripe-only: you pay through a Stripe Payment Link, then verify with your billing email and Member ID.",
      "You are responsible for keeping your billing email and Member ID confidential and for all activity under your membership. Notify ops@usjet.ai immediately of any suspected unauthorized access.",
    ],
  },
  {
    id: "subscriptions",
    title: "Subscription tiers & billing",
    paragraphs: [
      "Flight Pass ($19.90/mo), Hangar Pro ($49.95/mo), and Enterprise Commander ($199.99/mo) are recurring subscriptions billed through Stripe and renew automatically each period until cancelled.",
      "Cancel any time through Stripe's customer portal or by emailing ops@usjet.ai. Cancellation stops future renewals; it does not refund the current billing period unless required by law.",
      "We may change subscription pricing or included features prospectively. Material changes will be reflected on /special before they take effect for new billing periods.",
    ],
  },
  {
    id: "hardware-orders",
    title: "AI Computers — hardware orders",
    paragraphs: [
      "AI Computers listings (Homes and Businesses lineups) are sold by USJET, not drop-shipped: we purchase the listed unit and configure it as an Operator's Rig (Ollama, Open WebUI, AnythingLLM, AI Book Series) before shipping.",
      "Prices, specs, and availability shown on the site can change without notice until you complete Stripe checkout. Orders ship to US addresses only. Risk of loss passes to you on delivery to the shipping carrier.",
      "Items marked \"Talk to order\" are configured to your specification after you contact ops@usjet.ai; price and availability for those units are confirmed directly with you before any charge.",
      "Returns are accepted within 14 days of delivery, in original condition with all accessories. Buyer pays return shipping, opened units carry a 10% restocking fee, and refunds are issued to the original payment method within 7 business days of our receiving the return. Cancelling before the rig ships is free. The full policy, including shipping times and damaged-in-transit handling, is at /returns and controls if anything here conflicts with it.",
      "The USJET Limited Warranty covers the configuration and software setup we performed, for 90 days from delivery — see /warranty. Original manufacturer warranties (Apple in particular) apply in addition to, not in place of, it, and Apple's one-year term begins on USJET's purchase date rather than your delivery date.",
    ],
  },
  {
    id: "ai-content",
    title: "AI-generated content",
    paragraphs: [
      "Origin, the Fleet bay assistants, and other in-product chat surfaces are AI-generated using third-party models (including OpenAI, Google Vertex AI, and OpenRouter-routed models). Responses can be incomplete, outdated, or wrong.",
      "Nothing produced by these AI surfaces is professional legal, medical, financial, or safety advice. You are responsible for independently verifying anything you rely on before acting on it.",
      "Do not use the Service to generate content that is illegal, infringing, or intended to impersonate a real person or another AI partner — see the Anti-Clone doctrine on the Operator Log for why cloning is against the spirit of the product, not just the rule.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    bullets: [
      "No reverse-engineering, scraping, or reselling access to gated surfaces (Hangar, Fleet, Intel, Origin, Member Portal).",
      "No attempting to bypass Stripe-based verification or access another member's account or data.",
      "No automated abuse of chat or API surfaces beyond normal interactive use.",
      "No unlawful, harassing, or infringing use of the Service.",
    ],
    paragraphs: [],
  },
  {
    id: "ip",
    title: "Intellectual property",
    paragraphs: [
      "USJET, the USJET logo, Operator's Rig, and related marks are the property of USJET LLC. Site content, fleet call-sign branding, and the AI Book Series are protected by copyright and other applicable laws.",
      "Nothing in these Terms grants you rights to USJET's trademarks or content beyond what's needed to use the Service as intended.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party services",
    paragraphs: [
      "The Service relies on third-party providers, including Stripe (payments), Google Analytics (site analytics), and OpenAI / Google Vertex AI / OpenRouter (AI chat features). Those providers process data under their own terms and privacy policies.",
      "Fleet and Hangar modules may load partner sites inside the cockpit in the same browser window; once you interact with a partner module, that partner's own terms apply to that interaction.",
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
      "These Terms are governed by the laws of the State of New York, without regard to conflict-of-laws principles. Disputes will be resolved in the state or federal courts located in New York, and you consent to jurisdiction there.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    paragraphs: [
      "We may suspend or terminate access to the Service for any account that violates these Terms. You may stop using the Service and cancel any subscription at any time.",
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
