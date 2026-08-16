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
    description:
      "Learn Hangar, Fleet, Jet Browser, Intel, Origin, and Member. Pass the ten-question quiz for your Member Portal badge.",
  },
  "/fleet-directory": {
    title: "Jet Fighter Directory — 30 Call Signs | USJET.AI",
    description:
      "Browse all 30 USJET Jet Fighter call signs. Hired developers and open recruiting bays on the sovereign fleet runway.",
    keywords: "USJET jet fighter, fleet directory, AI callsigns, hangar recruiting",
  },
  "/fleet-manual": {
    title: "Pricing — Clearance Tiers | USJET.AI",
    description:
      "USJET clearance tiers — Flight Pass $19.90/mo, Hangar Pro $49.95/mo, Enterprise Commander $199.99/mo.",
  },
  "/intelligence": {
    title: "Intelligence Assets — Revenue Architecture | USJET.AI",
    description:
      "USJET Intelligence Assets: revenue architecture and partnership real estate for Titans who need America's labor audience.",
  },
  "/strategic-assets": {
    title: "Strategic Assets Ledger | USJET.AI",
    description: "Strategic assets of USJET.AI — brand, fleet architecture, and sovereign platform inventory.",
  },
  "/sovereignty": {
    title: "Sovereignty Archive — Day Zero Ledger | USJET.AI",
    description:
      "USJET Sovereignty archive: Day Zero founder ledger, empire reboot posture, and institutional grit.",
  },
  "/store": {
    title: "Manuals — AI Book Series | USJET.AI",
    description:
      "Order AI computers built for local models — Mac Mini, MacBook Air, Mac Studio, and Ryzen AI Max+ 395 mini PCs — plus the USJET Engineering Series on Kindle.",
    keywords:
      "buy AI computer, local AI hardware, AI ready computer, USJET store, AI engineering books, Ameer Karim books",
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
  "/founders-fuel": {
    title: "Founder's Fuel — Fuel the Fleet | USJET.AI",
    description: "Fuel the USJET fleet. Founder's Fuel channels direct support into hangar and runway growth.",
  },
  "/cash": {
    title: "Direct Fuel · Cash App $USJET | USJET.AI",
    description: "Send direct fuel via Cash App $USJET. Support the founder runway and fleet build.",
  },
  "/zelle": {
    title: "Direct Fuel · Zelle | USJET.AI",
    description: "Send direct fuel via Zelle to support USJET hangar growth.",
  },
  "/gaming": {
    title: "USJET Gaming — AAA Portal | USJET.AI",
    description: "USJET Gaming portal — AAA and VR surfaces from the sovereign hangar.",
  },
  "/vr": {
    title: "USJET VR Portal | USJET.AI",
    description: "USJET VR portal — immersive hangar experiences from the sovereign fleet.",
  },
  "/gamers": {
    title: "Gamers Deck | USJET.AI",
    description: "USJET Gamers deck — entry to gaming and VR surfaces in the hangar.",
  },
  "/x": {
    title: "X Signal Deck · @usajet | USJET.AI",
    description: "USJET X signal deck — live brand signal and fleet broadcasts.",
  },
  "/code-kit": {
    title: "Code Kit — USJET Engine Kit | USJET.AI",
    description: "USJET Code Kit: engine kit and developer tooling from the hangar.",
  },
  "/support-fleet": {
    title: "Support the Fleet | USJET.AI",
    description: "Support the USJET fleet — fuel hangar growth and sovereign runway expansion.",
  },
  "/privacy": {
    title: "Privacy Policy | USJET.AI",
    description: "USJET.AI privacy policy — how we handle member and hangar data.",
  },
  "/terms": {
    title: "Terms of Service | USJET.AI",
    description: "USJET.AI Terms of Service — subscriptions, AI Computers hardware orders, shipping and returns, AI-output disclaimers.",
  },
  "/sos": {
    title: "Help Center | USJET.AI",
    description:
      "USJET Help — login, Hangar tiles, plans, and Origin. Full curriculum lives on AI 101.",
  },
  "/hired-hud": {
    title: "Hired HUD — Developer Roster | USJET.AI",
    description: "Hired HUD: USJET developer roster and hangar assignment board.",
  },
  "/jet-browser": {
    title: "Jet Browser | USJET.AI",
    description:
      "USJET Jet Browser — load any domain into Hangar-style tiles. Enlarge, work, shrink. One ship, one cockpit.",
  },
  "/hoops": {
    title: "Jet Hoops | USJET.AI",
    description: "Jet Hoops — USJET hangar sports surface.",
  },
  "/login": {
    title: "Member Login — Stripe Clearance | USJET.AI",
    description:
      "Log in to USJET Member Portal with billing email and Member ID. Stripe-only — no Google or Apple OAuth.",
  },
  "/member/login": {
    title: "Member Login — Stripe Clearance | USJET.AI",
    description:
      "Pay first, then verify. USJET Member Login with Stripe billing email and Member ID.",
  },
  "/member": {
    title: "Member Portal | USJET.AI",
    description: "USJET Member Portal — mission projects, AI data, Hangar and Fleet launch boards.",
    noindex: true,
  },
  "/intel": {
    title: "Intel Board — Live Coinbase + NYSE | USJET.AI",
    description:
      "USJET Intel board — live Coinbase spot and NYSE TradingView boards across the fleet monitor grid. Open any tile for prices.",
  },
  "/origin": {
    title: "Origin Command | USJET.AI",
    description: "USJET Origin — sovereign command bay for Enterprise Commander clearance.",
    noindex: true,
  },
  "/special": {
    title: "Pricing — Flight Pass · Hangar Pro · Enterprise | USJET.AI",
    description:
      "USJET clearance pricing: Flight Pass $19.90/mo, Hangar Pro $49.95/mo, Enterprise Commander $199.99/mo — features and Stripe checkout.",
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
