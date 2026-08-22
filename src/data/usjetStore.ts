/**
 * USJET Store — live KDP titles by Ameer Karim.
 * Amazon book links open amazon.com in a new tab (not a /cockpit handoff).
 * Do not add unpublished titles (Sixth Sky is not live).
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
  "Books by Ameer Karim — USJET.AI Engineering Series, Enemy Skies, and Jet Fighter coloring books. Kindle and paperback on Amazon." as const;

export const STORE_HERO_KICKER = "Manuals · books by Ameer Karim" as const;
export const STORE_HERO_TITLE = "How to run the Rig — and more" as const;
export const STORE_HERO_LEDE =
  "Three live lines. The Engineering Series ships with the Operator's Rig. Enemy Skies is military-aviation romance. Jet Fighter coloring books are paperback-only, 8.5×11. All by Ameer Karim." as const;

export type StoreBookLineId = "engineering" | "enemy-skies" | "jet-fighter-coloring";

export type UsjetStoreBook = {
  id: string;
  lineId: StoreBookLineId;
  seriesOrder: number;
  title: string;
  subtitle: string;
  seriesLabel: string;
  author: string;
  priceDisplay: string;
  blurb: string;
  /** Kindle ASIN when a Kindle edition is live. */
  kindleAsin?: string;
  /** Paperback ASIN when a print edition is live. */
  paperbackAsin?: string;
  /** Cover ASIN file in public/store/covers. */
  coverSrc: string;
  coverAlt: string;
};

export type UsjetStoreBookLine = {
  id: StoreBookLineId;
  title: string;
  kicker: string;
  lede: string;
  /** Amazon series page — Engineering Series only. */
  amazonSeries?: boolean;
};

export const STORE_BOOK_LINES: readonly UsjetStoreBookLine[] = [
  {
    id: "engineering",
    title: "USJET.AI Engineering Series",
    kicker: "Operator manuals",
    lede: "The books that ship with a computer that already has AI in it. Kindle $9.99 · paperback as listed.",
    amazonSeries: true,
  },
  {
    id: "enemy-skies",
    title: "Enemy Skies",
    kicker: "Military-aviation romance",
    lede: "Kindle $9.99 · paperback $14.99.",
  },
  {
    id: "jet-fighter-coloring",
    title: "Jet Fighter Coloring Book Series",
    kicker: "Paperback only · 8.5×11",
    lede: "Paperback $9.99. No Kindle edition.",
  },
] as const;

/** USJET.AI Engineering Series ASIN (Amazon series page). */
export const AMAZON_SERIES_ASIN = "B0HCZ9141C" as const;

/** All live KDP titles — never include unpublished work. */
export const USJET_STORE_BOOKS: readonly UsjetStoreBook[] = [
  {
    id: "website-building-ai",
    lineId: "engineering",
    seriesOrder: 1,
    title: "Website Building with AI",
    subtitle: "From prompt to production — building, deploying, and scaling with AI-first tools.",
    seriesLabel: "USJET.AI Engineering Series · Book One",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "Build and ship websites with AI in the loop — from structure and copy to deploy, the Founder’s operator path.",
    kindleAsin: "B0HD5GF54X",
    paperbackAsin: "B0HD1H7BLB",
    coverSrc: "/store/covers/B0HD5GF54X.jpg",
    coverAlt: "Website Building with AI — Amazon Kindle cover",
  },
  {
    id: "ai-first-startup",
    lineId: "engineering",
    seriesOrder: 2,
    title: "The AI-First Startup",
    subtitle: "Building and Scaling Autonomous Platforms",
    seriesLabel: "USJET.AI Engineering Series · Book Two",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "How to build and scale autonomous platforms — AI-first architecture for founders who want a revenue engine, not a slide deck.",
    kindleAsin: "B0HD658R8K",
    paperbackAsin: "B0HD1NHWFN",
    coverSrc: "/store/covers/B0HD658R8K.jpg",
    coverAlt: "The AI-First Startup — Amazon Kindle cover",
  },
  {
    id: "build-ai-mac",
    lineId: "engineering",
    seriesOrder: 3,
    title: "Building an AI on Your Mac Computer",
    subtitle: "Local Models, Custom Runtimes, and Agentic Workflows",
    seriesLabel: "USJET.AI Engineering Series · Book Three",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "Turn Apple Silicon into a private local AI box — Ollama, llama.cpp, MLX, agentic workflows, and keeping proprietary data on the machine.",
    kindleAsin: "B0HCX896RZ",
    paperbackAsin: "B0HD5JLYWR",
    coverSrc: "/store/covers/B0HCX896RZ.jpg",
    coverAlt: "Building an AI on Your Mac Computer — Amazon Kindle cover",
  },
  {
    id: "top-30-ais",
    lineId: "engineering",
    seriesOrder: 4,
    title: "Top 30 AIs and What They Can Do for You",
    subtitle: "The Operator’s Field Guide to Modern Models, Runtimes, and Capabilities",
    seriesLabel: "USJET.AI Engineering Series · Book Four",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "A field guide to local models — capability, context, and cost. One Operator's Rig can run up to 30 local AI models on the machine. Not a SaaS of 30 web AIs.",
    kindleAsin: "B0HCXQDBM3",
    paperbackAsin: "B0HCZFW626",
    coverSrc: "/store/covers/B0HCXQDBM3.jpg",
    coverAlt: "Top 30 AIs and What They Can Do for You — Amazon Kindle cover",
  },
  {
    id: "deployment-pipeline",
    lineId: "engineering",
    seriesOrder: 5,
    title: "The Deployment Pipeline",
    subtitle: "Mastering GitHub, Vercel, and Domain Management",
    seriesLabel: "USJET.AI Engineering Series · Book Five",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "GitHub → Vercel → domain — the Founder’s deploy path from commit to live site.",
    kindleAsin: "B0GZJZ9TGJ",
    paperbackAsin: "B0HD641SJ8",
    coverSrc: "/store/covers/B0GZJZ9TGJ.jpg",
    coverAlt: "The Deployment Pipeline — Amazon Kindle cover",
  },
  {
    id: "mastering-cursor",
    lineId: "engineering",
    seriesOrder: 6,
    title: "Mastering Cursor",
    subtitle: "The AI-First Editor and Autonomous Coding Companion",
    seriesLabel: "USJET.AI Engineering Series · Book Six",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb:
      "Cursor as the workbench — agentic coding, local workflows, and how the Founder ships software with an AI co-pilot.",
    kindleAsin: "B0HD53PM9W",
    paperbackAsin: "B0HD4NDBGQ",
    coverSrc: "/store/covers/B0HD53PM9W.jpg",
    coverAlt: "Mastering Cursor — Amazon Kindle cover",
  },
  {
    id: "enemys-kiss",
    lineId: "enemy-skies",
    seriesOrder: 1,
    title: "The Enemy's Kiss",
    subtitle: "Enemy Skies · Book One",
    seriesLabel: "Enemy Skies · Book One",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb: "Military-aviation romance by Ameer Karim. Kindle and paperback.",
    kindleAsin: "B0HFXLM27H",
    paperbackAsin: "B0HFYWSQC1",
    coverSrc: "/store/covers/B0HFXLM27H.jpg",
    coverAlt: "The Enemy's Kiss — Amazon Kindle cover",
  },
  {
    id: "wings-of-betrayal",
    lineId: "enemy-skies",
    seriesOrder: 2,
    title: "Wings of Betrayal",
    subtitle: "Enemy Skies · Book Two",
    seriesLabel: "Enemy Skies · Book Two",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Kindle · $14.99 Paperback",
    blurb: "Military-aviation romance by Ameer Karim. Kindle and paperback.",
    kindleAsin: "B0HFYZX72C",
    paperbackAsin: "B0HG1SF44F",
    coverSrc: "/store/covers/B0HFYZX72C.jpg",
    coverAlt: "Wings of Betrayal — Amazon Kindle cover",
  },
  {
    id: "jet-fighters-coloring",
    lineId: "jet-fighter-coloring",
    seriesOrder: 1,
    title: "Jet Fighters: A Coloring Book",
    subtitle: "8.5×11 paperback",
    seriesLabel: "Jet Fighter Coloring Book Series · Book One",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Paperback",
    blurb: "Paperback coloring book. 8.5×11. No Kindle edition.",
    paperbackAsin: "B0HFSNZR3Z",
    coverSrc: "/store/covers/B0HFSNZR3Z.jpg",
    coverAlt: "Jet Fighters: A Coloring Book — Amazon paperback cover",
  },
  {
    id: "generation-6-coloring",
    lineId: "jet-fighter-coloring",
    seriesOrder: 2,
    title: "Generation 6: The Next Fighter Jets",
    subtitle: "8.5×11 paperback",
    seriesLabel: "Jet Fighter Coloring Book Series · Book Two",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Paperback",
    blurb: "Paperback coloring book. 8.5×11. No Kindle edition.",
    paperbackAsin: "B0HFH9LC14",
    coverSrc: "/store/covers/B0HFH9LC14.jpg",
    coverAlt: "Generation 6: The Next Fighter Jets — Amazon paperback cover",
  },
];

export function booksInLine(lineId: StoreBookLineId): UsjetStoreBook[] {
  return USJET_STORE_BOOKS.filter((book) => book.lineId === lineId).sort(
    (a, b) => a.seriesOrder - b.seriesOrder,
  );
}

export function bookHasKindle(book: UsjetStoreBook): boolean {
  return Boolean(book.kindleAsin);
}

export function bookPrimaryAsin(book: UsjetStoreBook): string {
  return book.kindleAsin ?? book.paperbackAsin ?? "";
}

export function amazonKindleUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}`;
}

export function amazonPaperbackUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}`;
}

export function amazonSeriesUrl(binding: "kindle" | "paperback" = "kindle"): string {
  const suffix = binding === "paperback" ? "?binding=paperback&ref_=saga_sdp_cft_dsk" : "";
  return `https://www.amazon.com/dp/${AMAZON_SERIES_ASIN}${suffix}`;
}

/** Native Amazon tab — bypasses the same-window /cockpit intercept. */
export const AMAZON_BOOK_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
  "data-usjet-external-leak": "true",
} as const;
