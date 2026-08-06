/**
 * USJET Store — Founder books (Amazon Kindle) + fleet merchandise runway.
 * Amazon opens through /cockpit (One Ship, One Cockpit). Merch stays on-site /product pages.
 */

export const STORE_ROUTE = "/store" as const;

export const STORE_PAGE_TITLE = "Store" as const;
export const STORE_META_DESCRIPTION =
  "USJET.AI Engineering Series Kindle books by Ameer Karim, plus fleet apparel and hangar merch." as const;

export const STORE_HERO_KICKER = "Books · Merch · Hangar gear" as const;
export const STORE_HERO_TITLE = "USJET Store" as const;
export const STORE_HERO_LEDE =
  "Operator manuals from the Founder, and fleet merch from the hangar runway. Kindle on Amazon. Apparel and gear on USJET product bays." as const;

export type UsjetStoreBook = {
  id: string;
  asin: string;
  seriesOrder: number;
  title: string;
  subtitle: string;
  seriesLabel: string;
  author: string;
  priceDisplay: string;
  blurb: string;
  /** Local Amazon product-page cover (public/store/covers). */
  coverSrc: string;
  coverAlt: string;
};

/** Live Kindle titles — USJET.AI Engineering Series by Ameer Karim. */
export const USJET_STORE_BOOKS: readonly UsjetStoreBook[] = [
  {
    id: "website-building-ai",
    asin: "B0HD5GF54X",
    seriesOrder: 1,
    title: "Website Building with AI",
    subtitle: "Ship production sites with AI as co-pilot",
    seriesLabel: "USJET.AI Engineering Series · Book One",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle",
    blurb:
      "Build and ship websites with AI in the loop — from structure and copy to deploy, the Founder’s operator path.",
    coverSrc: "/store/covers/B0HD5GF54X.jpg",
    coverAlt: "Website Building with AI — Amazon Kindle cover",
  },
  {
    id: "ai-first-startup",
    asin: "B0HD658R8K",
    seriesOrder: 2,
    title: "The AI-First Startup",
    subtitle: "Building and Scaling Autonomous Platforms",
    seriesLabel: "USJET.AI Engineering Series · Book Two",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle",
    blurb:
      "How to build and scale autonomous platforms — AI-first architecture for founders who want a revenue engine, not a slide deck.",
    coverSrc: "/store/covers/B0HD658R8K.jpg",
    coverAlt: "The AI-First Startup — Amazon Kindle cover",
  },
  {
    id: "build-ai-mac",
    asin: "B0HCX896RZ",
    seriesOrder: 3,
    title: "Building an AI on Your Mac Computer",
    subtitle: "Local Models, Custom Runtimes, and Agentic Workflows",
    seriesLabel: "USJET.AI Engineering Series · Book Three",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle",
    blurb:
      "Turn Apple Silicon into a private AI hangar — Ollama, llama.cpp, MLX, agentic workflows, and keeping proprietary data local.",
    coverSrc: "/store/covers/B0HCX896RZ.jpg",
    coverAlt: "Building an AI on Your Mac Computer — Amazon Kindle cover",
  },
  {
    id: "top-30-ais",
    asin: "B0HCXQDBM3",
    seriesOrder: 4,
    title: "Top 30 AIs and What They Can Do for You",
    subtitle: "The Operator’s Field Guide to Modern Models, Runtimes, and Capabilities",
    seriesLabel: "USJET.AI Engineering Series · Book Four",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · KU",
    blurb:
      "Six pillars of modern AI — capability, token efficiency, context, and cost. Which bay to open for reasoning, local Apple Silicon, codebases, and agent loops.",
    coverSrc: "/store/covers/B0HCXQDBM3.jpg",
    coverAlt: "Top 30 AIs and What They Can Do for You — Amazon Kindle cover",
  },
  {
    id: "mastering-cursor",
    asin: "B0HD53PM9W",
    seriesOrder: 5,
    title: "Mastering Cursor",
    subtitle: "The AI-First Editor and Autonomous Coding Companion",
    seriesLabel: "USJET.AI Engineering Series · Book Five",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle",
    blurb:
      "Cursor as the hangar workbench — agentic coding, fleet workflows, and how the Founder ships sovereign software with an AI co-pilot.",
    coverSrc: "/store/covers/B0HD53PM9W.jpg",
    coverAlt: "Mastering Cursor — Amazon Kindle cover",
  },
  {
    id: "deployment-pipeline",
    asin: "B0GZJZ9TGJ",
    seriesOrder: 6,
    title: "The Deployment Pipeline",
    subtitle: "Mastering GitHub, Vercel, and Domain Management",
    seriesLabel: "USJET.AI Engineering Series · Book Six",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle",
    blurb:
      "GitHub → Vercel → domain — the Founder’s deploy path from commit to live cockpit, without leaking out of the ship.",
    coverSrc: "/store/covers/B0GZJZ9TGJ.jpg",
    coverAlt: "The Deployment Pipeline — Amazon Kindle cover",
  },
];

export type UsjetStoreMerchItem = {
  id: string;
  title: string;
  kind: string;
  priceDisplay: string;
  blurb: string;
  /** On-site product runway path. */
  href: string;
  imageSrc?: string;
  imageAlt?: string;
};

/** Featured hangar merch — full lineup lives on each /product/:callsign runway. */
export const USJET_STORE_MERCH: readonly UsjetStoreMerchItem[] = [
  {
    id: "sr71-tee",
    title: "SR-71 Blackbird Tee",
    kind: "Apparel",
    priceDisplay: "$25",
    blurb: "White crew neck with SR-71 designation and hangar branding.",
    href: "/product/sr-71-blackbird",
    imageSrc: "/fleet/sr-71-blackbird-tee-product.webp",
    imageAlt: "USJET.AI SR-71 Blackbird tee",
  },
  {
    id: "f35-tee",
    title: "F-35 Lightning II Tee",
    kind: "Apparel",
    priceDisplay: "$25",
    blurb: "Lightning II jet designation on sovereign fleet cotton.",
    href: "/product/f-35-lightning-ii",
    imageSrc: "/fleet/f-35-lightning-ii-tee-product.webp",
    imageAlt: "USJET.AI F-35 Lightning II tee",
  },
  {
    id: "f22-tee",
    title: "F-22 Raptor Tee",
    kind: "Apparel",
    priceDisplay: "$25",
    blurb: "Raptor airframe mark for the hangar floor.",
    href: "/product/f-22-raptor",
    imageSrc: "/fleet/f-22-raptor-tee-product.webp",
    imageAlt: "USJET.AI F-22 Raptor tee",
  },
  {
    id: "a12-tee",
    title: "A-12 Avenger II Tee",
    kind: "Apparel",
    priceDisplay: "$25",
    blurb: "Avenger II silhouette — museum-of-grit cotton.",
    href: "/product/a-12-avenger-ii",
    imageSrc: "/fleet/a-12-avenger-ii-tee-product.webp",
    imageAlt: "USJET.AI A-12 Avenger II tee",
  },
];

export function amazonKindleUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}`;
}
