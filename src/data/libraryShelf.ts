import {
  AVIATION_BOOKS,
  aviationBookAnchor,
  aviationBookKindleUrl,
  aviationBookPaperbackUrl,
} from "./aviationBooks";
import { USJET_STORE_BOOKS, amazonKindleUrl, amazonPaperbackUrl, storeBookAnchor } from "./usjetStore";
import { wrapExternalInCockpit } from "../lib/fleetLaunchUrl";

export const PRESS_ROUTE = "/press" as const;

export type LibraryShelfCta = {
  label: string;
  to: string;
};

/** Shared volume for the Press stack pages. */
export type LibraryShelfVolume = {
  id: string;
  title: string;
  subtitle?: string;
  seriesLabel: string;
  author: string;
  blurb: string;
  priceDisplay: string;
  coverSrc?: string;
  catalogAnchor: string;
  primaryCta?: LibraryShelfCta;
  secondaryCta?: LibraryShelfCta;
};

function cockpitHref(url: string, returnTo: string, label: string, callName: string): string {
  return wrapExternalInCockpit(url, {
    returnTo,
    label,
    callName,
    directHandoff: true,
  });
}

export function aviationPressVolumes(): LibraryShelfVolume[] {
  return AVIATION_BOOKS.map((book) => {
    const kindleUrl = aviationBookKindleUrl(book);
    const paperbackUrl = aviationBookPaperbackUrl(book);
    const primaryUrl = kindleUrl ?? paperbackUrl;
    const primaryLabel = kindleUrl
      ? `Kindle · ${book.kindlePriceDisplay ?? "$4.99"}`
      : paperbackUrl
        ? `Paperback · ${book.paperbackPriceDisplay ?? "$9.99"}`
        : undefined;
    return {
      id: book.id,
      title: book.title,
      subtitle: book.subtitle || undefined,
      seriesLabel: book.seriesLabel,
      author: book.author,
      blurb: book.blurb,
      priceDisplay: book.priceDisplay,
      coverSrc: book.coverSrc,
      catalogAnchor: aviationBookAnchor(book.id),
      primaryCta:
        primaryUrl && primaryLabel
          ? {
              label: primaryLabel,
              to: cockpitHref(primaryUrl, PRESS_ROUTE, book.title, kindleUrl ? "Kindle" : "Amazon"),
            }
          : undefined,
      secondaryCta:
        kindleUrl && paperbackUrl
          ? {
              label: `Paperback · ${book.paperbackPriceDisplay ?? "$14.99"}`,
              to: cockpitHref(paperbackUrl, PRESS_ROUTE, `${book.title} (Paperback)`, "Paperback"),
            }
          : undefined,
    };
  });
}

export function manualsPressVolumes(): LibraryShelfVolume[] {
  return USJET_STORE_BOOKS.map((book) => ({
    id: book.id,
    title: book.title,
    subtitle: book.subtitle,
    seriesLabel: book.seriesLabel,
    author: book.author,
    blurb: book.blurb,
    priceDisplay: book.priceDisplay,
    coverSrc: book.coverSrc,
    catalogAnchor: storeBookAnchor(book.id),
    primaryCta: {
      label: "Kindle Edition",
      to: cockpitHref(amazonKindleUrl(book.asin), PRESS_ROUTE, `${book.title} (Kindle)`, "Kindle"),
    },
    secondaryCta: book.paperbackAsin
      ? {
          label: "Paperback",
          to: cockpitHref(amazonPaperbackUrl(book.paperbackAsin), PRESS_ROUTE, `${book.title} (Paperback)`, "Paperback"),
        }
      : undefined,
  }));
}

export function allPressVolumes(): LibraryShelfVolume[] {
  return [...aviationPressVolumes(), ...manualsPressVolumes()];
}
