/**
 * Compare pages — Operator's Rig hardware vs ChatGPT, tool sprawl, and custom installs.
 * Leftover Stripe subscriptions stay as a quiet door; they are not the product.
 */

import {
  COMPETITIVE_ALTERNATIVES,
  COMPETITIVE_POSITIONING_THESIS,
  OFFER_BUYING_REASONS,
  USJET_REPLACES,
  USJET_UNIQUE_BUNDLE,
} from "./competitivePositioning";
import {
  ENTERPRISE_DIRECT_URL,
  FLIGHT_PASS_DIRECT_URL,
  HANGAR_PRO_DIRECT_URL,
} from "../lib/stripePaymentLink";

const MONEY_PAGE_ORIGIN = "https://www.usjet.ai" as const;

export type SeoMoneyOfferId = "flight-pass" | "hangar-pro" | "enterprise";

export type SeoMoneyFaq = {
  question: string;
  answer: string;
};

export type SeoMoneyPageSeo = {
  title: string;
  description: string;
  keywords?: string;
  ogType?: "website" | "article" | "product";
};

export type SeoMoneyPage = {
  slug: string;
  path: string;
  alternativeId: (typeof COMPETITIVE_ALTERNATIVES)[number]["id"];
  eyebrow: string;
  h1: string;
  lede: string;
  problemTitle: string;
  problemBody: string;
  solutionTitle: string;
  solutionBody: string;
  proofPoints: readonly string[];
  faqs: readonly SeoMoneyFaq[];
  seo: SeoMoneyPageSeo;
};

const FLIGHT = OFFER_BUYING_REASONS.find((o) => o.id === "flight-pass")!;
const HANGAR = OFFER_BUYING_REASONS.find((o) => o.id === "hangar-pro")!;
const ENTERPRISE = OFFER_BUYING_REASONS.find((o) => o.id === "enterprise")!;

/** Leftover Stripe products — kept so the Payment Links are not deleted. Not shop CTAs. */
export const SEO_MONEY_OFFERS = {
  "flight-pass": {
    id: "flight-pass" as const,
    name: FLIGHT.offer,
    priceDisplay: FLIGHT.priceDisplay,
    buyBecause: FLIGHT.buyBecause,
    ctaLabel: `Leftover monthly link — ${FLIGHT.priceDisplay}`,
    href: FLIGHT_PASS_DIRECT_URL,
  },
  "hangar-pro": {
    id: "hangar-pro" as const,
    name: HANGAR.offer,
    priceDisplay: HANGAR.priceDisplay,
    buyBecause: HANGAR.buyBecause,
    ctaLabel: `Leftover monthly link — ${HANGAR.priceDisplay}`,
    href: HANGAR_PRO_DIRECT_URL,
  },
  enterprise: {
    id: "enterprise" as const,
    name: ENTERPRISE.offer,
    priceDisplay: ENTERPRISE.priceDisplay,
    buyBecause: ENTERPRISE.buyBecause,
    ctaLabel: `Leftover monthly link — ${ENTERPRISE.priceDisplay}`,
    href: ENTERPRISE_DIRECT_URL,
  },
} as const;

export const LEFTOVER_FLIGHT_PASS = {
  kicker: "Leftover Stripe link",
  title: `Flight Pass · ${FLIGHT.priceDisplay}`,
  body: "This is a leftover monthly subscription from an earlier version of this site. It is not the Operator's Rig. You do not need it to buy a computer or a book.",
  href: FLIGHT_PASS_DIRECT_URL,
  ctaLabel: `Optional leftover link · ${FLIGHT.priceDisplay}`,
} as const;

export const SEO_MONEY_HUB_PATH = "/compare" as const;

export const SEO_MONEY_HUB_SEO: SeoMoneyPageSeo = {
  title: "USJET Operator's Rig vs ChatGPT Cloud | Compare",
  description:
    "USJET sells computers with a local assistant already installed. Compare the Operator's Rig to ChatGPT tabs, tool sprawl, and custom local-AI installs.",
  keywords:
    "ChatGPT alternative, local AI computer, Operator's Rig, USJET vs ChatGPT, buy AI computer, private local LLM",
  ogType: "website",
};

export const SEO_MONEY_PAGES: readonly SeoMoneyPage[] = [
  {
    slug: "chatgpt-alternative",
    path: "/compare/chatgpt-alternative",
    alternativeId: "generic-ai",
    eyebrow: "vs generic AI chat",
    h1: "A computer with a Jarvis vs another ChatGPT tab",
    lede:
      "ChatGPT is a rented brain in a browser. The Operator's Rig is a computer that already has a local assistant on it — your files stay on the box.",
    problemTitle: "What a cloud chat never becomes",
    problemBody:
      "A monthly chat tab is fine until you paste family or shop files into someone else's server, lose the thread, and still do not own a machine that thinks when the internet is ugly.",
    solutionTitle: "What USJET sells instead",
    solutionBody:
      "We buy the listed computer, install the local stack (engine, screen, private document vault, manuals), and ship it talking. One-time hardware. Not another $20 chat bill as the product.",
    proofPoints: [
      "Models run on THIS computer — Ollama is the engine",
      "The screen looks like ChatGPT; the files stay home",
      "USJET.AI Engineering Series ships in the box",
      "Stripe checkout on the tile — USJET LLC on the invoice",
    ],
    faqs: [
      {
        question: "Is USJET a ChatGPT alternative?",
        answer:
          "USJET is a computer with a local assistant already installed. You can still use cloud chats if you want. The product is the machine, not a wrapper around ChatGPT.",
      },
      {
        question: "Why not just keep using ChatGPT?",
        answer:
          "ChatGPT is a strong wrench. It is also a rented brain. An Operator's Rig keeps the model and your documents on hardware you own.",
      },
      {
        question: "Do I need a monthly subscription to buy the computer?",
        answer:
          "No. Homes and Business are one-time hardware. A leftover $19.90/mo Stripe link still exists from an earlier version of this site. You do not need it to buy a rig.",
      },
    ],
    seo: {
      title: "ChatGPT Alternative — Local AI Computer | USJET",
      description:
        "Looking for a ChatGPT alternative you actually own? USJET sells the Operator's Rig — a computer with a local assistant already on it.",
      keywords:
        "ChatGPT alternative, local AI computer, private LLM, Operator's Rig, buy AI computer, USJET.AI",
      ogType: "website",
    },
  },
  {
    slug: "ai-tool-sprawl",
    path: "/compare/ai-tool-sprawl",
    alternativeId: "fragmented-stack",
    eyebrow: "vs fragmented AI stacks",
    h1: "Stop stacking mute boxes and cloud logins — buy one rig that already thinks",
    lede:
      "Amazon Mac Mini plus three weekends of Docker, plus five cloud logins, is not a product. The Operator's Rig is the machine with the stack already on it.",
    problemTitle: "The hidden tax of AI tool sprawl",
    problemBody:
      "Separate tabs for chat, docs, and dashboards each bring their own login. A mute computer from a box store still leaves you in terminal-hell. That is the tax.",
    solutionTitle: "One computer. One stack. The books in the box.",
    solutionBody:
      "Engine, ChatGPT-like screen, private vault, AI Book Series, one-click desktop start. Homes for the house. Business for the shop. That is the shop.",
    proofPoints: [
      "We buy the exact SKU and load it — no dropship substitution",
      "AnythingLLM reads YOUR PDFs on the box",
      "Manuals are the Engineering Series, not a PDF dump",
      "ops@usjet.ai for orders and a box that landed wrong",
    ],
    faqs: [
      {
        question: "What is AI tool sprawl?",
        answer:
          "Paying for and hopping across ChatGPT, Claude, docs, and dashboards with no computer that actually belongs to you. USJET sells the computer.",
      },
      {
        question: "Does this replace a bookmark collection of AI tools?",
        answer:
          "Yes — that is the point. Bookmarks are not a machine. The Operator's Rig is.",
      },
      {
        question: "Is there a monthly plan I have to buy?",
        answer:
          "No. The shop is computers and books. A leftover monthly Stripe link exists; it is not required.",
      },
    ],
    seo: {
      title: "Stop AI Tool Sprawl — Buy a Local AI Computer | USJET",
      description:
        "Tired of AI tool sprawl? USJET ships an Operator's Rig — local engine, screen, private vault, and manuals on real hardware.",
      keywords:
        "AI tool sprawl, local AI computer, replace ChatGPT tabs, Operator's Rig, buy AI computer, USJET.AI",
      ogType: "website",
    },
  },
  {
    slug: "custom-ai-build",
    path: "/compare/custom-ai-build",
    alternativeId: "custom-build",
    eyebrow: "vs custom local-AI installs",
    h1: "Skip the custom local-AI build — buy a rig that already runs",
    lede:
      "Hiring a shop to stand up Docker, RAG, and dashboards burns weeks. USJET already cleared the installer. You buy the computer.",
    problemTitle: "Custom builds spend runway inventing the installer",
    problemBody:
      "Homegrown local-LLM glue dies when the kid who set it up leaves. You pay twice: once to build, again to keep it alive.",
    solutionTitle: "We buy it. We load it. We ship it.",
    solutionBody:
      "Listed SKU, Operator's Rig stack, manuals in the box. Stripe checkout. USJET LLC on the invoice. You did not invent an installer.",
    proofPoints: [
      "Same-day talking box — not three weekends in a forum",
      "Homes and Business lineups with live Stripe buy links",
      "Manufacturer warranties on the machine; ops@usjet.ai for the order",
      "No invented reviews, no fake 30-day slogan",
    ],
    faqs: [
      {
        question: "Should we build our own local LLM workstation?",
        answer:
          "Only if you want to spend runway inventing the installer. The Operator's Rig is the machine already loaded.",
      },
      {
        question: "What does this replace?",
        answer:
          "A mute Mac from a box store plus forum threads — or hiring someone to stand up Ollama, a chat UI, and a document vault from scratch.",
      },
      {
        question: "Is this only for aviation shops?",
        answer:
          "The voice is aviation. The product is a computer with a local assistant, plus the books. Homes and Business.",
      },
    ],
    seo: {
      title: "Custom Local AI Build Alternative — Operator's Rig | USJET",
      description:
        "About to hire a shop to stand up a local LLM? USJET sells the Operator's Rig — we buy the computer, load the stack, and ship it.",
      keywords:
        "custom AI workstation, local LLM computer, build vs buy local AI, Operator's Rig, USJET",
      ogType: "website",
    },
  },
] as const;

export function getSeoMoneyPageBySlug(slug: string | undefined): SeoMoneyPage | undefined {
  if (!slug) {
    return undefined;
  }
  return SEO_MONEY_PAGES.find((page) => page.slug === slug);
}

export function getCompetitiveAlternative(page: SeoMoneyPage) {
  return COMPETITIVE_ALTERNATIVES.find((a) => a.id === page.alternativeId)!;
}

export function buildSeoMoneyFaqJsonLd(page: SeoMoneyPage): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildSeoMoneyWebPageJsonLd(page: SeoMoneyPage): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.seo.title,
    description: page.seo.description,
    url: `${MONEY_PAGE_ORIGIN}${page.path}`,
    isPartOf: { "@type": "WebSite", name: "USJET.AI", url: MONEY_PAGE_ORIGIN },
    about: COMPETITIVE_POSITIONING_THESIS,
  };
}

export const SEO_MONEY_HUB_THESIS = COMPETITIVE_POSITIONING_THESIS;
export const SEO_MONEY_REPLACES = USJET_REPLACES;
export const SEO_MONEY_BUNDLE = USJET_UNIQUE_BUNDLE;
