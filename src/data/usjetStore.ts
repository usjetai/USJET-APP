/**
 * USJET Store — Founder books (Amazon Kindle).
 * Amazon opens through /cockpit (One Ship, One Cockpit).
 */

export const STORE_ROUTE = "/store" as const;

export function storeBookAnchor(bookId: string): string {
  return `store-book-${bookId}`;
}

export function storeBookPath(bookId: string): string {
  return `${STORE_ROUTE}#${storeBookAnchor(bookId)}`;
}

export const STORE_PAGE_TITLE = "Manuals" as const;
export const STORE_META_DESCRIPTION =
  "USJET Operator manuals — AI Book Series by Ameer Karim. The books that ship with computers that already have AI in them." as const;

export const STORE_HERO_KICKER = "Manuals · AI Book Series" as const;
export const STORE_HERO_TITLE = "How to run the Rig" as const;
export const STORE_HERO_LEDE =
  "Every Operator's Rig ships with the AI Book Series. These are the Founder's engineering books — Kindle and paperback — for the humans who just bought a computer that thinks." as const;

export type UsjetStoreBook = {
  id: string;
  seriesOrder: number;
  title: string;
  subtitle: string;
  seriesLabel: string;
  author: string;
  priceDisplay: string;
  blurb: string;
  /** Kindle ASIN (default buy link). */
  asin: string;
  /** Optional Paperback ASIN for the print edition. */
  paperbackAsin?: string;
  /** Local Amazon product-page cover (public/store/covers). */
  coverSrc: string;
  coverAlt: string;
};

/** USJET.AI Engineering Series ASIN (Amazon series page). */
export const AMAZON_SERIES_ASIN = "B0HCZ9141C" as const;

/** Live Kindle titles — USJET.AI Engineering Series by Ameer Karim. */
export const USJET_STORE_BOOKS: readonly UsjetStoreBook[] = [
  {
    id: "website-building-ai",
    seriesOrder: 1,
    title: "Website Building with AI",
    subtitle: "From prompt to production — building, deploying, and scaling with AI-first tools.",
    seriesLabel: "USJET.AI Engineering Series · Book One",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "Build and ship websites with AI in the loop — from structure and copy to deploy, the Founder’s operator path.",
    asin: "B0HD5GF54X",
    paperbackAsin: "B0HD1H7BLB",
    coverSrc: "/store/covers/B0HD5GF54X.jpg",
    coverAlt: "Website Building with AI — Amazon Kindle cover",
  },
  {
    id: "ai-first-startup",
    seriesOrder: 2,
    title: "The AI-First Startup",
    subtitle: "Building and Scaling Autonomous Platforms",
    seriesLabel: "USJET.AI Engineering Series · Book Two",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "How to build and scale autonomous platforms — AI-first architecture for founders who want a revenue engine, not a slide deck.",
    asin: "B0HD658R8K",
    paperbackAsin: "B0HD1NHWFN",
    coverSrc: "/store/covers/B0HD658R8K.jpg",
    coverAlt: "The AI-First Startup — Amazon Kindle cover",
  },
  {
    id: "build-ai-mac",
    seriesOrder: 3,
    title: "Building an AI on Your Mac Computer",
    subtitle: "Local Models, Custom Runtimes, and Agentic Workflows",
    seriesLabel: "USJET.AI Engineering Series · Book Three",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "Turn Apple Silicon into a private AI hangar — Ollama, llama.cpp, MLX, agentic workflows, and keeping proprietary data local.",
    asin: "B0HCX896RZ",
    paperbackAsin: "B0HD5JLYWR",
    coverSrc: "/store/covers/B0HCX896RZ.jpg",
    coverAlt: "Building an AI on Your Mac Computer — Amazon Kindle cover",
  },
  {
    id: "top-30-ais",
    seriesOrder: 4,
    title: "Top 30 AIs and What They Can Do for You",
    subtitle: "The Operator’s Field Guide to Modern Models, Runtimes, and Capabilities",
    seriesLabel: "USJET.AI Engineering Series · Book Four",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "Six pillars of modern AI — capability, token efficiency, context, and cost. Which bay to open for reasoning, local Apple Silicon, codebases, and agent loops.",
    asin: "B0HCXQDBM3",
    paperbackAsin: "B0HCZFW626",
    coverSrc: "/store/covers/B0HCXQDBM3.jpg",
    coverAlt: "Top 30 AIs and What They Can Do for You — Amazon Kindle cover",
  },
  {
    id: "mastering-cursor",
    seriesOrder: 5,
    title: "Mastering Cursor",
    subtitle: "The AI-First Editor and Autonomous Coding Companion",
    seriesLabel: "USJET.AI Engineering Series · Book Five",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "Cursor as the hangar workbench — agentic coding, fleet workflows, and how the Founder ships sovereign software with an AI co-pilot.",
    asin: "B0HD53PM9W",
    paperbackAsin: "B0HD4NDBGQ",
    coverSrc: "/store/covers/B0HD53PM9W.jpg",
    coverAlt: "Mastering Cursor — Amazon Kindle cover",
  },
  {
    id: "deployment-pipeline",
    seriesOrder: 6,
    title: "The Deployment Pipeline",
    subtitle: "Mastering GitHub, Vercel, and Domain Management",
    seriesLabel: "USJET.AI Engineering Series · Book Six",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "GitHub → Vercel → domain — the Founder’s deploy path from commit to live cockpit, without leaking out of the ship.",
    asin: "B0GZJZ9TGJ",
    paperbackAsin: "B0HD641SJ8",
    coverSrc: "/store/covers/B0GZJZ9TGJ.jpg",
    coverAlt: "The Deployment Pipeline — Amazon Kindle cover",
  },
];

export function amazonKindleUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}`;
}

export function amazonPaperbackUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?binding=paperback`;
}

export function amazonSeriesUrl(binding: "kindle" | "paperback" = "kindle"): string {
  const suffix = binding === "paperback" ? "?binding=paperback&ref_=saga_sdp_cft_dsk" : "";
  return `https://www.amazon.com/dp/${AMAZON_SERIES_ASIN}${suffix}`;
}
