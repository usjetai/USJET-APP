/** Canonical hostname for hreflang, OG, canonical, JSON-LD (apex redirects to www in production). */

export const SITE_ORIGIN = "https://www.usjet.ai" as const;

export const SITE_NAME = "USJET.AI" as const;

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/founder/usjet-hero-logo.png` as const;

export const DEFAULT_OG_IMAGE_ALT = "USJET.AI — sovereign AI fleet cockpit wordmark" as const;

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
  title: "USJET.AI | Hangar Home — 30 AI Tools, One Cockpit",
  description:
    "Enter the USJET Hangar — home cockpit for blue-collar America. Open live AI workbench bays in one ship. Six free Hangar tabs. Flight Pass from $19.90/mo. Founded by Ameer Karim.",
  keywords:
    "USJET, USJET.AI, AI hangar, AI cockpit, AI tools, Hangar, Fleet runway, Flight Pass, blue-collar America, sovereign AI, Ameer Karim, enterprise AI, aviation fintech",
  ogType: "website",
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: DEFAULT_OG_IMAGE_ALT,
};

/** Exact-path SEO catalog for public marketing surfaces. */
export const ROUTE_SEO: Record<string, PageSeo> = {
  "/": DEFAULT_PAGE_SEO,
  "/fleet": {
    title: "Fleet Runway — 30 Elite AI Units | USJET.AI",
    description:
      "Launch the USJET Fleet runway: 30 networked AI units in one sovereign cockpit. Call signs, jet fighter identity, and integrated navigation — no new tabs.",
    keywords: "USJET fleet, AI runway, 30 AI tools, jet fighter callsigns, sovereign cockpit",
  },
  "/founder": {
    title: "Founder Ameer Karim — Museum of Grit | USJET.AI",
    description:
      "Meet Founder Ameer Karim. Wrenches, Not Slides — the grit story behind USJET.AI, the sovereign AI hangar built for America's labor force.",
    keywords: "Ameer Karim, USJET founder, Wrenches Not Slides, museum of grit",
  },
  "/founder/products": {
    title: "Founder Products — Merch & Gear | USJET.AI",
    description: "Founder-lined USJET products and fleet gear. Institutional merch from the sovereign hangar.",
  },
  "/blog": {
    title: "Operator Log — USJET Blog | AI Fleet Doctrine",
    description:
      "USJET Operator Log: founding dispatches, partnership doctrine, and runway intelligence for captains building with AI — not cloning it.",
    keywords: "USJET blog, operator log, AI doctrine, founder startup log",
  },
  "/ai-101": {
    title: "AI 101 — One-on-One Lesson | USJET.AI",
    description:
      "Learn Hangar, Fleet, Jet Browser, Intel, Origin, and Member. Pass the ten-question quiz for your Member Portal badge.",
  },
  "/b2b": {
    title: "B2B Industrial Backbone — Enterprise AI Hangar | USJET.AI",
    description:
      "USJET B2B: industrial backbone for enterprises that need a sovereign AI hangar, not another slide deck. Partner with the fleet.",
    keywords: "USJET B2B, enterprise AI, industrial backbone, AI hangar partnership",
  },
  "/b2k": {
    title: "B2K Enterprise Deployment | USJET.AI",
    description: "B2K enterprise deployment for USJET sovereign fleet clearance and hangar workstations.",
  },
  "/fleet-directory": {
    title: "Jet Fighter Directory — 30 Call Signs | USJET.AI",
    description:
      "Browse all 30 USJET Jet Fighter call signs. Hired developers and open recruiting bays on the sovereign fleet runway.",
    keywords: "USJET jet fighter, fleet directory, AI callsigns, hangar recruiting",
  },
  "/fleet-manual": {
    title: "Fleet Manual — Operator Doctrine | USJET.AI",
    description: "USJET Fleet Manual: operating doctrine for the 30-unit AI hangar and sovereign cockpit.",
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
  "/100k": {
    title: "Sovereign Fleet Protocol · Volume I | USJET.AI",
    description:
      "Sovereign Fleet Protocol vault — institutional clearance document for USJET fleet architecture.",
  },
  "/code-kit": {
    title: "Code Kit — USJET Engine Kit | USJET.AI",
    description: "USJET Code Kit: engine kit and developer tooling from the hangar.",
  },
  "/licensing": {
    title: "Brand Licensing | USJET.AI",
    description: "License the USJET brand, fleet identity, and hangar IP for institutional partners.",
  },
  "/support-fleet": {
    title: "Support the Fleet | USJET.AI",
    description: "Support the USJET fleet — fuel hangar growth and sovereign runway expansion.",
  },
  "/pdre": {
    title: "PDRE Partnership | USJET.AI",
    description: "PDRE partnership surface for USJET institutional collaboration.",
  },
  "/privacy": {
    title: "Privacy Policy | USJET.AI",
    description: "USJET.AI privacy policy — how we handle member and hangar data.",
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
      "Pay first, then verify. USJET Member Login with Stripe billing email and founder-issued access sentence.",
  },
  "/member": {
    title: "Member Portal | USJET.AI",
    description: "USJET Member Portal — mission projects, AI data, Hangar and Fleet launch boards.",
    noindex: true,
  },
  "/intel": {
    title: "Intel Board | USJET.AI",
    description: "USJET Intel board — partnership bays and institutional pulse for Hangar Pro clearance.",
    noindex: true,
  },
  "/origin": {
    title: "Origin Command | USJET.AI",
    description: "USJET Origin — sovereign command bay for Enterprise Commander clearance.",
    noindex: true,
  },
  "/founder-special-1995": {
    title: "Founder Special 1995 — Grit Vault | USJET.AI",
    description: "1995 Grit Vault — Founder Special clearance surface.",
    noindex: true,
  },
  "/special": {
    title: "Sovereign Access — Upgrade Tiers | USJET.AI",
    description: "USJET sovereign access tiers — Flight Pass, Hangar Pro, Enterprise Commander.",
    noindex: true,
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
      logo: `${SITE_ORIGIN}/favicon.svg`,
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
        url: `${SITE_ORIGIN}/favicon.svg`,
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
