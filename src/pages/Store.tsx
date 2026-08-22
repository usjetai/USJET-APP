import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  STORE_BOOK_LINES,
  STORE_HERO_KICKER,
  STORE_HERO_LEDE,
  STORE_HERO_TITLE,
  STORE_META_DESCRIPTION,
  STORE_PAGE_TITLE,
  AMAZON_BOOK_LINK_PROPS,
  amazonKindleUrl,
  amazonSeriesUrl,
  bookHasKindle,
  bookPrimaryAsin,
  booksInLine,
  storeBookAnchor,
  type UsjetStoreBook,
} from "../data/usjetStore";

function bookAmazonHref(book: UsjetStoreBook, binding: "kindle" | "paperback" = "kindle"): string {
  const asin =
    binding === "kindle"
      ? book.kindleAsin ?? bookPrimaryAsin(book)
      : book.paperbackAsin ?? bookPrimaryAsin(book);
  return amazonKindleUrl(asin);
}

function seriesAmazonHref(binding: "kindle" | "paperback" = "kindle"): string {
  return amazonSeriesUrl(binding);
}

function BookCoverLink({ book }: { book: UsjetStoreBook }) {
  const binding = bookHasKindle(book) ? "kindle" : "paperback";
  const href = bookAmazonHref(book, binding);
  return (
    <a
      href={href}
      className="usjet-store__book-cover-link glass-effect-interactive"
      aria-label={`Open ${book.title} on Amazon`}
      {...AMAZON_BOOK_LINK_PROPS}
    >
      <img
        className="usjet-store__book-cover-img"
        src={book.coverSrc}
        alt={book.coverAlt}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}

function BookCard({ book }: { book: UsjetStoreBook }) {
  return (
    <GlassEffectContainer
      id={storeBookAnchor(book.id)}
      className="usjet-store__book-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
    >
      <BookCoverLink book={book} />
      <div className="usjet-store__book-body">
        <p className="usjet-store__book-series">{book.seriesLabel}</p>
        <h3 className="usjet-store__book-title">
          <a
            href={bookAmazonHref(book, bookHasKindle(book) ? "kindle" : "paperback")}
            className="glass-effect-interactive"
            {...AMAZON_BOOK_LINK_PROPS}
          >
            {book.title}
          </a>
        </h3>
        <p className="usjet-store__book-subtitle">{book.subtitle}</p>
        <p className="usjet-store__book-blurb">{book.blurb}</p>
        <div className="usjet-store__book-meta">
          <span>{book.author}</span>
          <span>{book.priceDisplay}</span>
        </div>
        <div className="usjet-store__book-actions mt-auto flex flex-col gap-2">
          {bookHasKindle(book) ? (
            <a
              href={bookAmazonHref(book, "kindle")}
              className="usjet-store__cta btn-glass-prominent glass-effect-interactive w-full justify-center"
              {...AMAZON_BOOK_LINK_PROPS}
            >
              Kindle Edition
              <ExternalLink size={14} className="ml-2" aria-hidden />
            </a>
          ) : null}
          {book.paperbackAsin ? (
            <a
              href={bookAmazonHref(book, "paperback")}
              className={
                bookHasKindle(book)
                  ? "usjet-store__cta btn-glass glass-effect-interactive w-full justify-center"
                  : "usjet-store__cta btn-glass-prominent glass-effect-interactive w-full justify-center"
              }
              {...AMAZON_BOOK_LINK_PROPS}
            >
              Paperback
              <ExternalLink size={14} className="ml-2" aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </GlassEffectContainer>
  );
}

export default function Store() {
  const location = useLocation();

  useEffect(() => {
    const previous = document.title;
    document.title = `${STORE_PAGE_TITLE} · USJet.ai`;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", STORE_META_DESCRIPTION);
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
        <p className="usjet-store__kicker">{STORE_HERO_KICKER}</p>
        <h1 className="usjet-store__title usjet-logo-stone">{STORE_HERO_TITLE}</h1>
        <p className="usjet-store__lede">{STORE_HERO_LEDE}</p>
      </header>

      <section className="usjet-store__section hw-store-cta" aria-labelledby="usjet-store-hardware-heading">
        <GlassEffectContainer className="hw-store-cta__card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="hw-store-cta__body">
            <p className="usjet-store__kicker">The actual product</p>
            <h2 id="usjet-store-hardware-heading" className="hw-store-cta__title">
              Computers that already have AI in them
            </h2>
            <p className="hw-store-cta__lede">
              Homes is the house shop. Business is the shop and the office. Every unit ships as an Operator&apos;s Rig —
              local engine, dashboard, private document vault, books in the box. One Rig can run up to 30 local AI
              models on the machine. Not a SaaS of 30 web AIs. We buy the exact machine and send it to you.
            </p>
          </div>
          <div className="hw-store-cta__actions">
            <Link to="/" className="btn-glass-prominent glass-effect-interactive hw-store-cta__button">
              Homes
              <ArrowRight size={14} className="ml-2" aria-hidden />
            </Link>
            <Link to="/business" className="btn-glass glass-effect-interactive hw-store-cta__button">
              Business
              <ArrowRight size={14} className="ml-2" aria-hidden />
            </Link>
          </div>
        </GlassEffectContainer>
      </section>

      {STORE_BOOK_LINES.map((line) => {
        const books = booksInLine(line.id);
        const headingId = `usjet-store-line-${line.id}`;
        return (
          <section key={line.id} className="usjet-store__section" aria-labelledby={headingId}>
            <div className="usjet-store__section-head">
              <BookOpen size={18} aria-hidden />
              <h2 id={headingId}>{line.title}</h2>
            </div>
            <div className="usjet-store__section-intro flex flex-wrap items-end justify-between gap-4">
              <p className="usjet-store__section-lede max-w-2xl">
                <span className="usjet-store__book-series">{line.kicker}</span>
                <br />
                {line.lede} Written by Ameer Karim. Tap a cover to open Amazon in a new tab.
              </p>
              {line.amazonSeries ? (
                <div className="flex gap-3 mb-2">
                  <a
                    href={seriesAmazonHref("kindle")}
                    className="btn-glass text-xs uppercase tracking-widest glass-effect-interactive"
                    {...AMAZON_BOOK_LINK_PROPS}
                  >
                    Kindle Series
                    <ExternalLink size={12} className="ml-2" aria-hidden />
                  </a>
                  <a
                    href={seriesAmazonHref("paperback")}
                    className="btn-glass text-xs uppercase tracking-widest glass-effect-interactive"
                    {...AMAZON_BOOK_LINK_PROPS}
                  >
                    Paperback Series
                    <ExternalLink size={12} className="ml-2" aria-hidden />
                  </a>
                </div>
              ) : null}
            </div>

            <div className="usjet-store__book-grid">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="usjet-store__return">
        <Link to="/" className="glass-effect-interactive">
          Homes
        </Link>
      </p>
    </div>
  );
}
