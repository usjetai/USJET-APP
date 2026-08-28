/**
 * USJET Aviation Books — coloring titles + Enemy Skies novels.
 * Live Amazon dp links supplied by the Founder (Aug 2026).
 * Amazon opens through /cockpit (One Ship, One Cockpit).
 */

/** Canonical Amazon product URL — exact `/dp/{ASIN}` form, no invented query params. */
export function aviationAmazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}`;
}

export const AVIATION_BOOKS_ROUTE = "/aviation-books" as const;

export function aviationBookAnchor(bookId: string): string {
  return `aviation-book-${bookId}`;
}

export const AVIATION_BOOKS_PAGE_TITLE = "Aviation Books" as const;
export const AVIATION_BOOKS_META_DESCRIPTION =
  "Aviation books by Ameer Karim — Jet Fighters and Generation 6 coloring books, plus the Enemy Skies novels Wings of Betrayal and The Enemy's Kiss. Buy on Amazon." as const;

export const AVIATION_BOOKS_HERO_KICKER = "Aviation Books · Ameer Karim" as const;
export const AVIATION_BOOKS_HERO_TITLE = "Color the fleet. Fly the story." as const;
export const AVIATION_BOOKS_HERO_LEDE =
  "Two coloring books for the jets. Two Enemy Skies novels for the people who fly them. Amazon — same window, cockpit return." as const;

export type AviationBook = {
  id: string;
  title: string;
  subtitle: string;
  seriesLabel: string;
  author: string;
  priceDisplay: string;
  blurb: string;
  /** Kindle ASIN. Live on fiction titles only. */
  kindleAsin?: string;
  /** Paperback ASIN. Coloring titles are paperback-only. */
  paperbackAsin?: string;
  /** Local cover under public/aviation-books/covers. Omit for a labeled placeholder. */
  coverSrc?: string;
  coverAlt: string;
};

export const AVIATION_BOOKS: readonly AviationBook[] = [
  {
    id: "jet-fighters-coloring",
    title: "Jet Fighters: A Coloring Book",
    subtitle: "From Classic Phantoms to 6th-Generation Concepts",
    seriesLabel: "Aviation Coloring Series · Book 1",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Paperback",
    blurb:
      "39 hand-drawn military jets — F-14, SR-71, F-22, F-35, and next-generation concepts. Bold single-sided line art for markers, gel pens, or colored pencils. 8.5\" × 11\".",
    paperbackAsin: "B0HFSNZR3Z",
    coverSrc: "/aviation-books/covers/jet-fighters.jpg",
    coverAlt: "Jet Fighters: A Coloring Book — front cover",
  },
  {
    id: "generation-6-coloring",
    title: "Generation 6: The Next Fighter Jets: A Coloring Book",
    subtitle: "",
    seriesLabel: "Aviation Coloring Series · Book 2",
    author: "Ameer Karim",
    priceDisplay: "$9.99 Paperback",
    blurb:
      "35 sixth-generation fighter concepts — F-47 NGAD, F/A-XX, GCAP/Tempest, J-36, loyal wingmen, and tailless stealth silhouettes. Clean line art, 8.5\" × 11\", single-sided pages.",
    paperbackAsin: "B0HFH9LC14",
    coverSrc: "/aviation-books/covers/generation-6.jpg",
    coverAlt: "Generation 6: The Next Fighter Jets — coloring book cover",
  },
  {
    id: "wings-of-betrayal",
    title: "Wings of Betrayal",
    subtitle: "One Final Flight to Stop a War",
    seriesLabel: "Enemy Skies · Book Two",
    author: "Ameer Karim",
    priceDisplay: "$4.99 Kindle · $14.99 Paperback",
    blurb:
      "Two enemy pilots. One impossible love. Six months after the ceasefire, Hawk and Nova are hiding a secret that could end both careers — until a masked militia stages an attack built to look like Hawk's own wing pulled the trigger.",
    kindleAsin: "B0HFYZX72C",
    paperbackAsin: "B0HG1SF44F",
    coverSrc: "/aviation-books/covers/wings-of-betrayal.jpg",
    coverAlt: "Wings of Betrayal by Ameer Karim — Kindle cover",
  },
  {
    id: "enemys-kiss",
    title: "The Enemy's Kiss",
    subtitle: "Two enemies. One sky. No way home.",
    seriesLabel: "Enemy Skies · Book One",
    author: "Ameer Karim",
    priceDisplay: "$4.99 Kindle · $14.99 Paperback",
    blurb:
      "A military romance-thriller of forbidden attraction and high-stakes dogfights — the first Enemy Skies novel, and the story that puts Captain James \"Hawk\" Hawkins and Natalia \"Nova\" Petrova in the same sky.",
    kindleAsin: "B0HFXLM27H",
    paperbackAsin: "B0HFYWSQC1",
    coverSrc: "/aviation-books/covers/enemys-kiss.jpg",
    coverAlt: "The Enemy's Kiss by Ameer Karim — Kindle cover",
  },
];

/** Cover / title link: Kindle when both formats are live, otherwise the single live edition. */
export function aviationBookAmazonUrl(book: AviationBook): string | null {
  if (book.kindleAsin) {
    return aviationAmazonUrl(book.kindleAsin);
  }
  if (book.paperbackAsin) {
    return aviationAmazonUrl(book.paperbackAsin);
  }
  return null;
}

export function aviationBookKindleUrl(book: AviationBook): string | null {
  return book.kindleAsin ? aviationAmazonUrl(book.kindleAsin) : null;
}

export function aviationBookPaperbackUrl(book: AviationBook): string | null {
  return book.paperbackAsin ? aviationAmazonUrl(book.paperbackAsin) : null;
}
