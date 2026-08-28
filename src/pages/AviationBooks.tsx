import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  AVIATION_BOOKS,
  AVIATION_BOOKS_HERO_KICKER,
  AVIATION_BOOKS_HERO_LEDE,
  AVIATION_BOOKS_HERO_TITLE,
  AVIATION_BOOKS_META_DESCRIPTION,
  AVIATION_BOOKS_PAGE_TITLE,
  AVIATION_BOOKS_ROUTE,
  aviationBookAmazonUrl,
  aviationBookAnchor,
  aviationBookKindleUrl,
  aviationBookPaperbackUrl,
  type AviationBook,
} from "../data/aviationBooks";
import { wrapExternalInCockpit } from "../lib/fleetLaunchUrl";

function cockpitAmazonHref(url: string, label: string, callName: string): string {
  return wrapExternalInCockpit(url, {
    returnTo: AVIATION_BOOKS_ROUTE,
    label,
    callName,
    directHandoff: true,
  });
}

function bookCoverHref(book: AviationBook): string | null {
  const url = aviationBookAmazonUrl(book);
  if (!url) {
    return null;
  }
  return cockpitAmazonHref(url, book.title, book.kindleAsin ? "Kindle" : "Amazon");
}

function BookCover({ book }: { book: AviationBook }) {
  const href = bookCoverHref(book);
  const cover = book.coverSrc ? (
    <img
      className="usjet-store__book-cover-img"
      src={book.coverSrc}
      alt={book.coverAlt}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <div className="usjet-store__book-cover-placeholder" role="img" aria-label={`${book.title} — cover pending`}>
      <span className="usjet-store__book-cover-placeholder-kicker">Cover pending</span>
      <span className="usjet-store__book-cover-placeholder-title">{book.title}</span>
    </div>
  );

  if (!href) {
    return <div className="usjet-store__book-cover-link">{cover}</div>;
  }

  return (
    <Link
      to={href}
      className="usjet-store__book-cover-link glass-effect-interactive"
      aria-label={`Open ${book.title} on Amazon`}
    >
      {cover}
    </Link>
  );
}

function BookBuyActions({ book }: { book: AviationBook }) {
  const kindleUrl = aviationBookKindleUrl(book);
  const paperbackUrl = aviationBookPaperbackUrl(book);
  const hasBothFormats = Boolean(kindleUrl && paperbackUrl);

  if (hasBothFormats && kindleUrl && paperbackUrl) {
    return (
      <div className="usjet-store__book-actions usjet-store__book-actions--split mt-auto">
        <Link
          to={cockpitAmazonHref(kindleUrl, `${book.title} (Kindle)`, "Kindle")}
          className="usjet-store__cta btn-glass-prominent glass-effect-interactive"
        >
          Kindle · $4.99
          <ExternalLink size={14} aria-hidden />
        </Link>
        <Link
          to={cockpitAmazonHref(paperbackUrl, `${book.title} (Paperback)`, "Paperback")}
          className="usjet-store__cta btn-glass glass-effect-interactive"
        >
          Paperback · $14.99
          <ExternalLink size={14} aria-hidden />
        </Link>
      </div>
    );
  }

  const singleUrl = paperbackUrl ?? kindleUrl;
  if (!singleUrl) {
    return (
      <p className="usjet-store__cta usjet-store__cta--pending" role="status">
        Amazon link pending
      </p>
    );
  }

  return (
    <div className="usjet-store__book-actions mt-auto">
      <Link
        to={cockpitAmazonHref(singleUrl, book.title, "Amazon")}
        className="usjet-store__cta btn-glass-prominent glass-effect-interactive w-full justify-center"
      >
        Buy on Amazon
        <ExternalLink size={14} className="ml-2" aria-hidden />
      </Link>
    </div>
  );
}

export default function AviationBooks() {
  const location = useLocation();

  useEffect(() => {
    const previous = document.title;
    document.title = `${AVIATION_BOOKS_PAGE_TITLE} · USJet.ai`;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", AVIATION_BOOKS_META_DESCRIPTION);
    return () => {
      document.title = previous;
      meta?.setAttribute("content", previousDescription);
    };
  }, []);

  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) {
      return;
    }
    const node = document.getElementById(id);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

  return (
    <div className="usjet-store-page page-atmosphere page-nav-offset mx-auto max-w-5xl px-4 pb-32 pt-4 sm:px-6 lg:px-8">
      <header className="usjet-store__hero">
        <p className="usjet-store__kicker">{AVIATION_BOOKS_HERO_KICKER}</p>
        <h1 className="usjet-store__title usjet-logo-stone">{AVIATION_BOOKS_HERO_TITLE}</h1>
        <p className="usjet-store__lede">{AVIATION_BOOKS_HERO_LEDE}</p>
      </header>

      <section className="usjet-store__section" aria-labelledby="aviation-books-heading">
        <div className="usjet-store__section-head">
          <BookOpen size={18} aria-hidden />
          <h2 id="aviation-books-heading">Aviation Coloring · Enemy Skies</h2>
        </div>
        <p className="usjet-store__section-lede max-w-2xl">
          Written by Founder Ameer Karim. Coloring titles are paperback. Novels ship Kindle and paperback. Tap a
          cover to view on Amazon — same window, cockpit return.
        </p>

        <div className="usjet-store__book-grid">
          {AVIATION_BOOKS.map((book) => {
            const titleHref = bookCoverHref(book);

            return (
              <GlassEffectContainer
                key={book.id}
                id={aviationBookAnchor(book.id)}
                className="usjet-store__book-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
              >
                <BookCover book={book} />
                <div className="usjet-store__book-body">
                  <p className="usjet-store__book-series">{book.seriesLabel}</p>
                  <h3 className="usjet-store__book-title">
                    {titleHref ? (
                      <Link to={titleHref} className="glass-effect-interactive">
                        {book.title}
                      </Link>
                    ) : (
                      book.title
                    )}
                  </h3>
                  {book.subtitle ? <p className="usjet-store__book-subtitle">{book.subtitle}</p> : null}
                  <p className="usjet-store__book-blurb">{book.blurb}</p>
                  <div className="usjet-store__book-meta">
                    <span>{book.author}</span>
                    <span>{book.priceDisplay}</span>
                  </div>
                  <BookBuyActions book={book} />
                </div>
              </GlassEffectContainer>
            );
          })}
        </div>
      </section>

      <p className="usjet-store__return">
        <Link to="/store" className="glass-effect-interactive">
          Operator manuals
        </Link>
      </p>
    </div>
  );
}
