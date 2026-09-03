import {
  buildSeoMoneyFaqJsonLd,
  buildSeoMoneyWebPageJsonLd,
  SEO_MONEY_HUB_PATH,
  SEO_MONEY_HUB_SEO,
  SEO_MONEY_PAGES,
} from "./seoMoneyPages";
import { HARDWARE_PRODUCTS, HARDWARE_ROUTE, HARDWARE_BUSINESSES_ROUTE, HARDWARE_HOMES_ROUTE, HARDWARE_AUDIENCE_META, hardwareProductsByAudience, type HardwareAudience, type HardwareProduct } from "./aiHardware";

/** Canonical hostname for hreflang, OG, canonical, JSON-LD (apex redirects to www in production). */

export const SITE_ORIGIN = "https://www.usjet.ai" as const;

export const SITE_NAME = "USJET.AI" as const;

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/brand/usjet-logo.png` as const;

export const DEFAULT_OG_IMAGE_ALT = "USJET — official logo" as const;

export type PageSeo = {
  title: string;
  description: string;
  /** Comma-separated keywords for legacy crawlers */
  keywords?: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  ogImageAlt?: string;
  /** When true, search engines should not index this URL */
  noindex?: boolean;
  /** Optional JSON-LD object(s) merged into page schema script */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

/** Hangar home — primary commercial + crawl target. */
export const DEFAULT_PAGE_SEO: PageSeo = {
  title: "USJET.AI | Homes — AI Computers",
  description:
    "USJET Hangar: computers that already have AI in them for the house. Private local models, Operator's Rig stack, shipped to your door. Founded by Ameer Karim.",
  keywords:
    "USJET, home AI computer, local AI, Mac Mini, Operator's Rig, Ollama, AnythingLLM, private AI, Ameer Karim, buy AI computer, mini PC for local AI, best mini PC for Ollama, local LLM computer, Mac Mini for local AI",
  ogType: "website",
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: DEFAULT_OG_IMAGE_ALT,
};

/** Exact-path SEO catalog for public marketing surfaces. */
export const ROUTE_SEO: Record<string, PageSeo> = {
  "/": DEFAULT_PAGE_SEO,
  "/fleet": {
    title: "Business — AI Computers & Servers | USJET.AI",
    description:
      "USJET Fleet: business computers and always-on AI servers. Mac Studio, 64GB–128GB mini PCs, office brains that stay on. Operator's Rig — not a cloud chatbot.",
    keywords:
      "business AI computer, AI server, Mac Studio, local LLM office, USJET Fleet, Ryzen AI Max+ 395 mini PC, Beelink GTR9 Pro, Minisforum MS-A2, buy AI computer",
  },
  "/blog": {
    title: "Operator Log — USJET Blog | AI Fleet Doctrine",
    description:
      "USJET Operator Log: founding dispatches, local-AI buyer's guides, partnership doctrine, and runway intelligence — not a news feed.",
    keywords: "USJET blog, operator log, AI doctrine, founder startup log, best computer for local AI, Ollama buyer's guide",
  },
  [SEO_MONEY_HUB_PATH]: {
    ...SEO_MONEY_HUB_SEO,
  },
  ...Object.fromEntries(
    SEO_MONEY_PAGES.map((page) => [
      page.path,
      {
        ...page.seo,
        jsonLd: [buildSeoMoneyWebPageJsonLd(page), buildSeoMoneyFaqJsonLd(page)],
      } satisfies PageSeo,
    ]),
  ),
  "/ai-101": {
    title: "AI 101 — One-on-One Lesson | USJET.AI",
    description: "Learn how local AI computers work, in plain English — one lesson before you buy.",
  },
  "/store": {
    title: "Manuals — AI Book Series | USJET.AI",
    description:
      "USJET Engineering Series on Kindle and paperback — the operator manuals for a computer that already has AI in it.",
    keywords:
      "USJET store, AI engineering books, Ameer Karim books, local AI manuals, Operator's Rig books",
    ogType: "product",
  },
  "/aviation-books": {
    title: "Aviation Books — Coloring + Enemy Skies | USJET.AI",
    description:
      "Aviation books by Ameer Karim: Jet Fighters and Generation 6 coloring books, plus Enemy Skies novels Wings of Betrayal and The Enemy's Kiss. Buy on Amazon.",
    keywords:
      "aviation coloring book, jet fighter coloring book, Generation 6 coloring book, Wings of Betrayal, The Enemy's Kiss, Ameer Karim books, USJET books",
    ogType: "product",
  },
  "/press": {
    title: "Press — The Complete Shelf | USJET.AI",
    description:
      "Aviation books and operator manuals on one hardcover stack. Click a volume, buy on Amazon, same window.",
    ogType: "product",
  },
  [HARDWARE_ROUTE]: {
    title: "Buy AI Computers for Local AI & LLMs — Homes & Businesses | USJET.AI",
    description:
      "Order a computer configured to run AI models locally. Separate Homes and Businesses lineups — Operator's Rig, sourced and shipped by USJET.",
    keywords:
      "buy AI computer, mini PC for local AI, AI computer for home, AI computer for business, Mac Mini for local AI, Ryzen AI Max+ 395 mini PC",
    ogType: "product",
    jsonLd: buildHardwareHubJsonLd(),
  },
  [HARDWARE_HOMES_ROUTE]: {
    title: "AI Computers for Homes — Mac Mini, MacBook, Mini PC | USJET.AI",
    description:
      "Home AI computers with a personal Jarvis already on the machine. Mac Mini M4, MacBook Air, MacBook Pro, Beelink SER9 Pro, Minisforum UM890 Pro.",
    keywords:
      "AI computer for home, Mac Mini for local AI, MacBook Air M4 local AI, Beelink SER9 Pro, Minisforum UM890 Pro, build your own jarvis, jarvis ai assistant computer, personal ai assistant hardware",
    ogType: "product",
    jsonLd: buildHardwareCatalogJsonLd("home"),
  },
  [HARDWARE_BUSINESSES_ROUTE]: {
    title: "AI Computers for Businesses — Mac Studio, Mini PCs, Workstations | USJET.AI",
    description:
      "Business AI computers and servers. Minisforum MS-A2, Beelink GTR9 Pro, Mac Studio, RTX 5090 and 128GB workstation servers — Operator's Rig, shipped by USJET.",
    keywords:
      "AI computer for business, Mac Studio, Beelink GTR9 Pro, Minisforum MS-A2, RTX 5090 AI workstation, local LLM server",
    ogType: "product",
    jsonLd: buildHardwareCatalogJsonLd("business"),
  },
  "/privacy": {
    title: "Privacy Policy | USJET.AI",
    description: "USJET.AI privacy policy — how we handle member and hangar data.",
  },
  "/terms": {
    title: "Terms of Service | USJET.AI",
    description: "USJET.AI Terms of Service — subscriptions, AI Computers hardware orders, shipping and returns, AI-output disclaimers.",
  },
  "/waiting-list": {
    title: "Reserve an Operator's Rig — USJET",
    description:
      "Join the list for the next Operator's Rig: a Mac that arrives with a local AI stack already installed and configured. No payment taken, nothing owed.",
  },
  "/returns": {
    title: "Returns, Refunds & Shipping | USJET.AI",
    description:
      "14-day returns, 10% restocking on opened units, refunds to the original payment method within 7 business days, rigs shipped within 10 business days of cleared payment.",
  },
  "/warranty": {
    title: "USJET Limited Warranty | USJET.AI",
    description:
      "90 days on the configuration and software setup of every Operator's Rig, how to get service, and how Apple's own hardware warranty applies alongside it.",
  },
  "/sos": {
    title: "Help Center | USJET.AI",
    description: "USJET Help — orders, shipping, and setup for your AI computer.",
  },
  "/cockpit": {
    title: "Cockpit | USJET.AI",
    description: "USJET Cockpit — integrated partner launch inside one ship.",
    noindex: true,
  },
  "/landscape": {
    title: "Landscape View Guide | USJET.AI",
    description: "Rotate to landscape for the best USJET hangar cockpit experience on mobile.",
    noindex: true,
  },
  "/protocol-proof": {
    title: "Protocol Proof | USJET.AI",
    description: "USJET protocol session proof surface.",
    noindex: true,
  },
};

/** Normalize SPA path for canonical (no hash/query, no trailing slash except root). */
export function normalizeSeoPath(pathname: string): string {
  const raw = pathname.split("?")[0]?.split("#")[0] ?? "/";
  const trimmed = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;
  return trimmed || "/";
}

export function canonicalHref(pathname: string): string {
  const path = normalizeSeoPath(pathname);
  if (path === "/") {
    return `${SITE_ORIGIN}/`;
  }
  return `${SITE_ORIGIN}${path}`;
}

function withDefaults(seo: PageSeo): PageSeo {
  return {
    ...DEFAULT_PAGE_SEO,
    ...seo,
    ogImage: seo.ogImage ?? DEFAULT_OG_IMAGE,
    ogImageAlt: seo.ogImageAlt ?? DEFAULT_OG_IMAGE_ALT,
    ogType: seo.ogType ?? "website",
  };
}

/**
 * Resolve page SEO for any SPA path — exact catalog, then dynamic blog / fleet / product.
 * Callers may pass pre-resolved dynamic payloads to avoid circular imports at module load.
 */
export function resolveStaticRouteSeo(pathname: string): PageSeo {
  const path = normalizeSeoPath(pathname);
  const exact = ROUTE_SEO[path];
  if (exact) {
    return withDefaults(exact);
  }
  return withDefaults(DEFAULT_PAGE_SEO);
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["USJET", "USJet.ai", "usjet.ai"],
    url: SITE_ORIGIN,
    description: DEFAULT_PAGE_SEO.description,
    publisher: {
      "@type": "Organization",
      name: "USJET LLC",
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/brand/usjet-logo.png`,
      founder: { "@type": "Person", name: "Ameer Karim" },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_ORIGIN}/fleet-directory`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFaqJsonLd(faqs: readonly { question: string; answer: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildArticleJsonLd(input: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { "@type": "Person", name: "Ameer Karim" },
    publisher: {
      "@type": "Organization",
      name: "USJET LLC",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/brand/usjet-logo.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
    image: DEFAULT_OG_IMAGE,
  };
}

export function buildProductJsonLd(input: {
  name: string;
  description: string;
  url: string;
  brand?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: input.url,
    brand: { "@type": "Brand", name: input.brand ?? SITE_NAME },
    image: DEFAULT_OG_IMAGE,
    offers: {
      "@type": "Offer",
      url: `${SITE_ORIGIN}/`,
      priceCurrency: "USD",
      price: "19.90",
      availability: "https://schema.org/InStock",
      description: "Flight Pass monthly — Hangar access",
    },
  };
}

/** Product + Offer JSON-LD for a single AI Computers SKU. */
export function buildHardwareProductJsonLd(product: HardwareProduct): Record<string, unknown> {
  const audience = product.missions[0];
  const audienceRoute = HARDWARE_AUDIENCE_META[audience].route;
  const url = `${SITE_ORIGIN}${audienceRoute}#${product.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${product.configLabel} — Operator's Rig`,
    description: `${product.blurb} ${product.goodFor}`,
    url,
    brand: { "@type": "Brand", name: product.brand },
    category: "Computers",
    image: `${SITE_ORIGIN}${product.imageSrc}`,
    offers: {
      "@type": "Offer",
      url: product.stripePaymentLink ?? url,
      priceCurrency: "USD",
      price: String(product.priceUsd),
      availability: product.contactToOrder
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "USJET LLC" },
    },
  };
}

/** CollectionPage + ItemList JSON-LD for the /store/ai-computers catalog. */
export function buildHardwareCatalogJsonLd(audience?: HardwareAudience): Record<string, unknown> {
  const products = audience ? hardwareProductsByAudience(audience) : [...HARDWARE_PRODUCTS];
  const meta = audience ? HARDWARE_AUDIENCE_META[audience] : null;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: meta ? `${meta.title} | USJET.AI` : "AI Computers — Order Local AI Hardware | USJET.AI",
    description: meta?.lede ??
      "Order computers configured to run AI models locally. Every unit ships as a USJET Operator's Rig.",
    url: `${SITE_ORIGIN}${meta?.route ?? HARDWARE_ROUTE}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: buildHardwareProductJsonLd(product),
      })),
    },
  };
}

export function buildHardwareHubJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Computers — Homes & Businesses | USJET.AI",
    description:
      "Order computers configured to run AI models locally: separate Homes and Businesses lineups. Every unit ships as a USJET Operator's Rig.",
    url: `${SITE_ORIGIN}${HARDWARE_ROUTE}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: HARDWARE_PRODUCTS.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: buildHardwareProductJsonLd(product),
      })),
    },
  };
}
