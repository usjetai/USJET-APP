/**
 * SEO money pages — capture AI buyers who need a hangar, not another chatbot.
 * Aligns with COMPETITIVE_POSITIONING_JUL_2026 + Direct Landing Protocol.
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
  /** Competitive alternative id from competitivePositioning.ts */
  alternativeId: (typeof COMPETITIVE_ALTERNATIVES)[number]["id"];
  /** Primary Stripe extraction offer for this intent */
  primaryOfferId: SeoMoneyOfferId;
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

export const SEO_MONEY_OFFERS = {
  "flight-pass": {
    id: "flight-pass" as const,
    name: FLIGHT.offer,
    priceDisplay: FLIGHT.priceDisplay,
    buyBecause: FLIGHT.buyBecause,
    ctaLabel: `Clear Flight Pass — ${FLIGHT.priceDisplay}`,
    href: FLIGHT_PASS_DIRECT_URL,
  },
  "hangar-pro": {
    id: "hangar-pro" as const,
    name: HANGAR.offer,
    priceDisplay: HANGAR.priceDisplay,
    buyBecause: HANGAR.buyBecause,
    ctaLabel: `Clear Hangar Pro — ${HANGAR.priceDisplay}`,
    href: HANGAR_PRO_DIRECT_URL,
  },
  enterprise: {
    id: "enterprise" as const,
    name: ENTERPRISE.offer,
    priceDisplay: ENTERPRISE.priceDisplay,
    buyBecause: ENTERPRISE.buyBecause,
    ctaLabel: `Clear Enterprise — ${ENTERPRISE.priceDisplay}`,
    href: ENTERPRISE_DIRECT_URL,
  },
} as const;

export const SEO_MONEY_HUB_PATH = "/compare" as const;

export const SEO_MONEY_HUB_SEO: SeoMoneyPageSeo = {
  title: "USJET vs ChatGPT, AI Tool Sprawl & Custom Builds | Compare",
  description:
    "Stop tab-hopping ChatGPT, Claude, Midjourney, and homemade agent glue. USJET is the sovereign AI hangar — 30 tools, one cockpit. Compare Flight Pass, Hangar Pro, and Enterprise.",
  keywords:
    "ChatGPT alternative, AI tool stack, AI hangar, custom AI platform alternative, USJET vs ChatGPT, AI cockpit for teams, Flight Pass",
  ogType: "website",
};

export const SEO_MONEY_PAGES: readonly SeoMoneyPage[] = [
  {
    slug: "chatgpt-alternative",
    path: "/compare/chatgpt-alternative",
    alternativeId: "generic-ai",
    primaryOfferId: "flight-pass",
    eyebrow: "vs generic AI chat",
    h1: "ChatGPT alternative for operators who need a hangar — not another tab",
    lede:
      "Generic AI is one wrench in a drawer. USJET is the hangar: thirty specialized partner AIs, same cockpit, Member ID clearance — built for people who fix things.",
    problemTitle: "What ChatGPT alone never becomes",
    problemBody:
      "One general model for every job means copy-paste prompts, lost context, no fleet specialization, and no institutional hangar. You keep paying for chat while the workbench stays fragmented.",
    solutionTitle: "What USJET replaces",
    solutionBody:
      "Flight Pass puts you on the runway: Hangar workbench, all 30 Fleet bays, Member Portal — formation instead of another browser bookmark.",
    proofPoints: [
      "Thirty specialized AIs under one roof — mission routing beats clone-everything chat",
      "One Ship, One Cockpit — partners launch in-window, no brand leak",
      "Stripe-only Member ID — no Google/Apple OAuth side doors",
      "Wrenches, Not Slides — institutional hangar for labor, not pitch decks",
    ],
    faqs: [
      {
        question: "Is USJET a ChatGPT alternative?",
        answer:
          "USJET is the hangar those chats never become. You still use elite AI partners — but inside one sovereign cockpit with Hangar, Fleet, and Member clearance instead of tab sprawl.",
      },
      {
        question: "Why not just keep using ChatGPT?",
        answer:
          "ChatGPT is a strong wrench. Operators lose time hopping ChatGPT, Claude, Midjourney, docs, and dashboards. Flight Pass collapses that habit into one ship for $19.90/mo.",
      },
      {
        question: "How fast can I clear Flight Pass?",
        answer:
          "One Stripe click lands on the hard-wired Flight Pass Payment Link. After clearance, verify with billing email + Member ID — no OAuth.",
      },
    ],
    seo: {
      title: "ChatGPT Alternative for Teams & Operators | USJET Hangar",
      description:
        "Looking for a ChatGPT alternative that is actually a hangar? USJET puts 30 AI tools in one cockpit. Flight Pass from $19.90/mo — exit fragmented free tabs.",
      keywords:
        "ChatGPT alternative, ChatGPT for teams, AI hangar, AI cockpit, Claude alternative stack, Midjourney workflow, Flight Pass, USJET.AI",
      ogType: "website",
    },
  },
  {
    slug: "ai-tool-sprawl",
    path: "/compare/ai-tool-sprawl",
    alternativeId: "fragmented-stack",
    primaryOfferId: "hangar-pro",
    eyebrow: "vs fragmented AI stacks",
    h1: "End AI tool sprawl — one cockpit for fleet, hangar, and intel",
    lede:
      "Separate tabs for chatbots, docs, dispatch notes, training, and intel dashboards each bring their own login and support queue. USJET collapses five browser habits into one sovereign flight deck.",
    problemTitle: "The hidden tax of AI tool sprawl",
    problemBody:
      "Fragmented aviation/ops and AI software stacks feel cheap until you count tab-hopping, lost context, and the second product login for markets/intel. Crews do not need another SaaS tile — they need formation.",
    solutionTitle: "Hangar Pro: fleet + board together",
    solutionBody:
      "Hangar Pro keeps the full Flight Pass runway and adds the Intel Pulse board — high-velocity operator sync without bolting on a separate dashboard.",
    proofPoints: [
      "Hangar workbench + 30-unit Fleet runway + Member missions in one brand",
      "Integrated Navigation — same-window launches, Cockpit return bar",
      "Intel board as institutional real estate for crews who run the board and the bay",
      "Managed support via Origin CS and ops@usjet.ai when you need a human",
    ],
    faqs: [
      {
        question: "What is AI tool sprawl?",
        answer:
          "AI tool sprawl is paying for and hopping across ChatGPT, Claude, Midjourney, docs, LMS, and ad-hoc dashboards with no command layer. USJET is the command layer.",
      },
      {
        question: "Why Hangar Pro instead of Flight Pass?",
        answer:
          "If you only need the hangar and fleet, start with Flight Pass. Hangar Pro is for crews who need fleet networking and institutional intel in the same cockpit.",
      },
      {
        question: "Does USJET replace my bookmark collection?",
        answer:
          "Yes — that is the point. Bookmark directories and AI tool roundups are not a command layer. USJET is One Ship, One Cockpit.",
      },
    ],
    seo: {
      title: "Stop AI Tool Sprawl — One Cockpit for 30 AIs | USJET",
      description:
        "Tired of AI tool sprawl? USJET Hangar Pro unifies fleet AIs and Intel in one cockpit — $49.95/mo. No more tab-hopping chatbots, docs, and dashboards.",
      keywords:
        "AI tool sprawl, AI tool stack, AI workspace for teams, replace ChatGPT tabs, AI hangar, Hangar Pro, USJET.AI",
      ogType: "website",
    },
  },
  {
    slug: "custom-ai-build",
    path: "/compare/custom-ai-build",
    alternativeId: "custom-build",
    primaryOfferId: "enterprise",
    eyebrow: "vs custom internal builds",
    h1: "Skip the custom AI build — buy the command layer already flying",
    lede:
      "Internal engineering and agency projects to stitch agents, auth, and dashboards burn months of runway. Enterprise Fleet Commander is the sovereign command layer you would otherwise invent.",
    problemTitle: "Custom builds spend runway inventing the hangar",
    problemBody:
      "Homegrown agent glue creates auth sprawl, iframe graves, and founder time as glue. You pay twice: once to build, again to maintain — while competitors clear Stripe and fly.",
    solutionTitle: "Enterprise: Origin-seated command",
    solutionBody:
      "Enterprise includes Hangar Pro plus Origin (Aura) as the command node — teach, route, and orchestrate partner AIs from one seat. Ship-ready: Stripe clearance, Liquid Glass hangar, Integrated Navigation.",
    proofPoints: [
      "Ship-ready cockpit now — revenue architecture without a six-month build ticket",
      "Origin command coaching + AI-101 flight school — training in the same brand",
      "Tiered Intel and Origin without inventing your own access model",
      "Competitive alternative to fragmented stacks, generic AI, and custom builds in one bundle",
    ],
    faqs: [
      {
        question: "Should we build our own multi-agent command layer?",
        answer:
          "Only if you want to spend runway inventing the hangar. Enterprise is the command layer already cleared — Stripe Member ID, fleet orchestration, Origin seated.",
      },
      {
        question: "What does Enterprise replace?",
        answer:
          "Hiring an agency or internal team to build multi-agent auth, dashboards, and training from scratch — plus the ops burden of keeping that glue alive.",
      },
      {
        question: "Is Enterprise only for aviation?",
        answer:
          "USJET is aerospace-specific in culture and cockpit metaphor, built for blue-collar and fleet operators. The product is a sovereign AI hangar — command, training, intelligence, managed support.",
      },
    ],
    seo: {
      title: "Custom AI Build Alternative — Enterprise Command Layer | USJET",
      description:
        "About to build a custom AI command platform? USJET Enterprise ($199.99/mo) is the Origin-seated fleet command layer — already flying, Stripe-cleared.",
      keywords:
        "custom AI platform alternative, multi-agent command layer, build vs buy AI, enterprise AI cockpit, Origin Aura, USJET Enterprise",
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
