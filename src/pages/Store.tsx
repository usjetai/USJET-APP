import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  STORE_HERO_KICKER,
  STORE_HERO_LEDE,
  STORE_HERO_TITLE,
  STORE_META_DESCRIPTION,
  STORE_PAGE_TITLE,
  STORE_ROUTE,
  USJET_STORE_BOOKS,
  amazonKindleUrl,
  amazonPaperbackUrl,
  amazonSeriesUrl,
  storeBookAnchor,
  type UsjetStoreBook,
} from "../data/usjetStore";
import { wrapExternalInCockpit } from "../lib/fleetLaunchUrl";

function bookAmazonHref(book: UsjetStoreBook, binding: "kindle" | "paperback" = "kindle"): string {
  const url = binding === "kindle" 
    ? amazonKindleUrl(book.asin) 
    : amazonPaperbackUrl(book.paperbackAsin || book.asin);
    
  return wrapExternalInCockpit(url, {
    returnTo: STORE_ROUTE,
    label: `${book.title} (${binding})`,
    callName: binding === "kindle" ? "Kindle" : "Paperback",
    directHandoff: true,
  });
}

function seriesAmazonHref(binding: "kindle" | "paperback" = "kindle"): string {
  return wrapExternalInCockpit(amazonSeriesUrl(binding), {
    returnTo: STORE_ROUTE,
    label: `USJET.AI Engineering Series (${binding})`,
    callName: "Amazon Series",
    directHandoff: true,
  });
}

function BookCoverLink({ book }: { book: UsjetStoreBook }) {
  const href = bookAmazonHref(book);
  return (
    <Link
      to={href}
      className="usjet-store__book-cover-link glass-effect-interactive"
      aria-label={`Open ${book.title} on Amazon Kindle`}
    >
      <img
        className="usjet-store__book-cover-img"
        src={book.coverSrc}
        alt={book.coverAlt}
        loading="lazy"
        decoding="async"
      />
    </Link>
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
              Homes is the personal rig. Business is the shop and the office setup. Every unit ships as an Operator&apos;s Rig —
              local engine, dashboard, private document vault, AI Book Series. We buy the exact machine and send
              it to you.
            </p>
          </div>
          <div className="hw-store-cta__actions">
            <Link to="/" className="btn-glass-prominent glass-effect-interactive hw-store-cta__button">
              Homes
              <ArrowRight size={14} className="ml-2" aria-hidden />
            </Link>
            <Link to="/fleet" className="btn-glass glass-effect-interactive hw-store-cta__button">
              Business
              <ArrowRight size={14} className="ml-2" aria-hidden />
            </Link>
          </div>
        </GlassEffectContainer>
      </section>

      <section className="usjet-store__section" aria-labelledby="usjet-store-books-heading">
        <div className="usjet-store__section-head">
          <BookOpen size={18} aria-hidden />
          <h2 id="usjet-store-books-heading">Engineering Series · Amazon</h2>
        </div>
        <div className="usjet-store__section-intro flex flex-wrap items-end justify-between gap-4">
          <p className="usjet-store__section-lede max-w-2xl">
            Written by Founder Ameer Karim. Available on Kindle and Paperback. 
            Tap a cover to view on Amazon — same window, cockpit return.
          </p>
          <div className="flex gap-3 mb-2">
            <Link 
              to={seriesAmazonHref("kindle")} 
              className="btn-glass text-xs uppercase tracking-widest glass-effect-interactive"
            >
              Kindle Series
              <ExternalLink size={12} className="ml-2" aria-hidden />
            </Link>
            <Link 
              to={seriesAmazonHref("paperback")} 
              className="btn-glass text-xs uppercase tracking-widest glass-effect-interactive"
            >
              Paperback Series
              <ExternalLink size={12} className="ml-2" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="usjet-store__book-grid">
          {USJET_STORE_BOOKS.map((book) => (
            <GlassEffectContainer
              key={book.id}
              id={storeBookAnchor(book.id)}
              className="usjet-store__book-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
            >
              <BookCoverLink book={book} />
              <div className="usjet-store__book-body">
                <p className="usjet-store__book-series">{book.seriesLabel}</p>
                <h3 className="usjet-store__book-title">
                  <Link to={bookAmazonHref(book, "kindle")} className="glass-effect-interactive">
                    {book.title}
                  </Link>
                </h3>
                <p className="usjet-store__book-subtitle">{book.subtitle}</p>
                <p className="usjet-store__book-blurb">{book.blurb}</p>
                <p className="usjet-store__book-hardware-cta">{book.hardwareCta}</p>
                <div className="usjet-store__book-meta">
                  <span>{book.author}</span>
                  <span>{book.priceDisplay}</span>
                </div>
                <div className="usjet-store__book-actions mt-auto flex flex-col gap-2">
                  <Link
                    to={bookAmazonHref(book, "kindle")}
                    className="usjet-store__cta btn-glass-prominent glass-effect-interactive w-full justify-center"
                  >
                    Kindle Edition
                    <ExternalLink size={14} className="ml-2" aria-hidden />
                  </Link>
                  {book.paperbackAsin && (
                    <Link
                      to={bookAmazonHref(book, "paperback")}
                      className="usjet-store__cta btn-glass glass-effect-interactive w-full justify-center"
                    >
                      Paperback
                      <ExternalLink size={14} className="ml-2" aria-hidden />
                    </Link>
                  )}
                </div>
              </div>
            </GlassEffectContainer>
          ))}
        </div>
      </section>

      <p className="usjet-store__return">
        <Link to="/" className="glass-effect-interactive">
          Back to Home
        </Link>
      </p>
    </div>
  );
}
