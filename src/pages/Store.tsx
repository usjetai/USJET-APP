import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Shirt, ExternalLink } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  STORE_HERO_KICKER,
  STORE_HERO_LEDE,
  STORE_HERO_TITLE,
  STORE_META_DESCRIPTION,
  STORE_PAGE_TITLE,
  STORE_ROUTE,
  USJET_STORE_BOOKS,
  USJET_STORE_MERCH,
  amazonKindleUrl,
  type UsjetStoreBook,
} from "../data/usjetStore";
import { wrapExternalInCockpit } from "../lib/fleetLaunchUrl";

function bookAmazonHref(book: UsjetStoreBook): string {
  return wrapExternalInCockpit(amazonKindleUrl(book.asin), {
    returnTo: STORE_ROUTE,
    label: book.title,
    callName: "Kindle",
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

  return (
    <div className="usjet-store-page page-atmosphere page-nav-offset mx-auto max-w-5xl px-4 pb-32 pt-4 sm:px-6 lg:px-8">
      <header className="usjet-store__hero">
        <p className="usjet-store__kicker">{STORE_HERO_KICKER}</p>
        <h1 className="usjet-store__title usjet-logo-stone">{STORE_HERO_TITLE}</h1>
        <p className="usjet-store__lede">{STORE_HERO_LEDE}</p>
      </header>

      <section className="usjet-store__section" aria-labelledby="usjet-store-books-heading">
        <div className="usjet-store__section-head">
          <BookOpen size={18} aria-hidden />
          <h2 id="usjet-store-books-heading">Engineering Series · Kindle</h2>
        </div>
        <p className="usjet-store__section-lede">
          Written by Founder Ameer Karim. Tap a cover to buy on Amazon Kindle — same window, cockpit return.
        </p>

        <div className="usjet-store__book-grid">
          {USJET_STORE_BOOKS.map((book) => (
            <GlassEffectContainer
              key={book.id}
              className="usjet-store__book-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
            >
              <BookCoverLink book={book} />
              <div className="usjet-store__book-body">
                <p className="usjet-store__book-series">{book.seriesLabel}</p>
                <h3 className="usjet-store__book-title">
                  <Link to={bookAmazonHref(book)} className="glass-effect-interactive">
                    {book.title}
                  </Link>
                </h3>
                <p className="usjet-store__book-subtitle">{book.subtitle}</p>
                <p className="usjet-store__book-blurb">{book.blurb}</p>
                <div className="usjet-store__book-meta">
                  <span>{book.author}</span>
                  <span>{book.priceDisplay}</span>
                </div>
                <Link
                  to={bookAmazonHref(book)}
                  className="usjet-store__cta btn-glass-prominent glass-effect-interactive"
                >
                  Get on Kindle
                  <ExternalLink size={14} aria-hidden />
                </Link>
              </div>
            </GlassEffectContainer>
          ))}
        </div>
      </section>

      <section className="usjet-store__section" aria-labelledby="usjet-store-merch-heading">
        <div className="usjet-store__section-head">
          <Shirt size={18} aria-hidden />
          <h2 id="usjet-store-merch-heading">Fleet merch</h2>
        </div>
        <p className="usjet-store__section-lede">
          Hangar apparel and gear on each aircraft product runway. Featured drops below — full fleet at Jet Fighter
          Directory.
        </p>

        <div className="usjet-store__merch-grid">
          {USJET_STORE_MERCH.map((item) => (
            <GlassEffectContainer
              key={item.id}
              className="usjet-store__merch-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
            >
              {item.imageSrc ? (
                <div className="usjet-store__merch-photo">
                  <img src={item.imageSrc} alt={item.imageAlt ?? item.title} loading="lazy" />
                </div>
              ) : null}
              <div className="usjet-store__merch-body">
                <p className="usjet-store__merch-kind">
                  {item.kind} · {item.priceDisplay}
                </p>
                <h3 className="usjet-store__merch-title">{item.title}</h3>
                <p className="usjet-store__merch-blurb">{item.blurb}</p>
                <Link to={item.href} className="usjet-store__cta btn-glass glass-effect-interactive">
                  Open product bay
                </Link>
              </div>
            </GlassEffectContainer>
          ))}
        </div>

        <p className="usjet-store__directory-link">
          <Link to="/fleet-directory" className="glass-effect-interactive">
            Browse all jet fighter product runways →
          </Link>
        </p>
      </section>

      <p className="usjet-store__return">
        <Link to="/" className="glass-effect-interactive">
          Hangar home
        </Link>
      </p>
    </div>
  );
}
