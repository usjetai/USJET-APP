import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  AVIATION_BOOKS,
  aviationBookAmazonUrl,
  aviationBookKindleUrl,
  aviationBookPaperbackUrl,
  aviationBookAnchor,
  type AviationBook,
} from "../../data/aviationBooks";
import { wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function shelfHref(url: string, label: string, callName: string): string {
  return wrapExternalInCockpit(url, {
    returnTo: "/aviation-books",
    label,
    callName,
    directHandoff: true,
  });
}

function ShelfBuyActions({ book }: { book: AviationBook }) {
  const kindleUrl = aviationBookKindleUrl(book);
  const paperbackUrl = aviationBookPaperbackUrl(book);
  const hasBoth = Boolean(kindleUrl && paperbackUrl);

  if (hasBoth && kindleUrl && paperbackUrl) {
    return (
      <div className="usjet-shelf__actions">
        <Link
          to={shelfHref(kindleUrl, `${book.title} (Kindle)`, "Kindle")}
          className="usjet-shelf__cta usjet-shelf__cta--primary glass-effect-interactive"
        >
          Kindle · {book.kindlePriceDisplay ?? "$4.99"}
          <ExternalLink size={13} aria-hidden />
        </Link>
        <Link
          to={shelfHref(paperbackUrl, `${book.title} (Paperback)`, "Paperback")}
          className="usjet-shelf__cta glass-effect-interactive"
        >
          Paperback · {book.paperbackPriceDisplay ?? "$14.99"}
          <ExternalLink size={13} aria-hidden />
        </Link>
      </div>
    );
  }

  const singleUrl = paperbackUrl ?? kindleUrl;
  if (!singleUrl) {
    return <p className="usjet-shelf__cta usjet-shelf__cta--pending">Amazon link pending</p>;
  }

  return (
    <div className="usjet-shelf__actions">
      <Link
        to={shelfHref(singleUrl, book.title, "Amazon")}
        className="usjet-shelf__cta usjet-shelf__cta--primary glass-effect-interactive"
      >
        Inspect on Amazon
        <ExternalLink size={13} aria-hidden />
      </Link>
    </div>
  );
}

export default function AviationShelf({ books = AVIATION_BOOKS }: { books?: readonly AviationBook[] }) {
  const [index, setIndex] = useState(0);
  const total = books.length;
  const book = books[index];
  const prefersReducedMotion = useReducedMotion();
  const dragAccum = useRef(0);
  const wheelLock = useRef(false);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % total) + total) % total);
    },
    [total],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const spineOrder = useMemo(() => books.map((b, i) => ({ b, i })), [books]);

  function handleWheel(e: React.WheelEvent) {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 12 || wheelLock.current) return;
    wheelLock.current = true;
    if (delta > 0) next();
    else prev();
    window.setTimeout(() => {
      wheelLock.current = false;
    }, 320);
  }

  return (
    <section className="usjet-shelf" aria-roledescription="carousel" aria-label="Aviation books shelf">
      <div className="usjet-shelf__frame">
        <GlassEffectContainer className="usjet-shelf__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <p className="usjet-shelf__kicker">Aviation Books Shelf</p>
          <div className="usjet-shelf__counter" aria-live="polite">
            <button type="button" className="usjet-shelf__arrow glass-effect-interactive" onClick={prev} aria-label="Previous book">
              <ChevronLeft size={16} aria-hidden />
            </button>
            <span className="usjet-shelf__counter-text">
              {pad2(index + 1)} / {pad2(total)}
            </span>
            <button type="button" className="usjet-shelf__arrow glass-effect-interactive" onClick={next} aria-label="Next book">
              <ChevronRight size={16} aria-hidden />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={book.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="usjet-shelf__info"
            >
              <p className="usjet-shelf__series">{book.seriesLabel}</p>
              <h2 className="usjet-shelf__title">{book.title}</h2>
              {book.subtitle ? <p className="usjet-shelf__subtitle">{book.subtitle}</p> : null}
              <p className="usjet-shelf__blurb">{book.blurb}</p>
              <div className="usjet-shelf__meta">
                <span>{book.author}</span>
                <span>{book.priceDisplay}</span>
              </div>
              <ShelfBuyActions book={book} />
              <a href={`#${aviationBookAnchor(book.id)}`} className="usjet-shelf__jump">
                View in full catalog ↓
              </a>
            </motion.div>
          </AnimatePresence>
        </GlassEffectContainer>

        <div className="usjet-shelf__stage" onWheel={handleWheel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={book.id}
              className="usjet-shelf__featured"
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {book.coverSrc ? (
                <img src={book.coverSrc} alt={book.coverAlt} className="usjet-shelf__featured-img" draggable={false} />
              ) : (
                <div className="usjet-shelf__featured-placeholder">{book.title}</div>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="usjet-shelf__row"
            drag="x"
            dragElastic={0.12}
            dragConstraints={{ left: 0, right: 0 }}
            onDrag={(_, info) => {
              dragAccum.current += info.delta.x;
            }}
            onDragEnd={() => {
              if (dragAccum.current < -40) next();
              else if (dragAccum.current > 40) prev();
              dragAccum.current = 0;
            }}
          >
            {spineOrder.map(({ b, i }) => {
              const distance = i - index;
              const active = i === index;
              return (
                <button
                  key={b.id}
                  type="button"
                  className={`usjet-shelf__spine${active ? " usjet-shelf__spine--active" : ""}`}
                  style={{
                    transform: `translateX(${distance * 14}px) scale(${active ? 1 : 0.82})`,
                    opacity: active ? 1 : Math.max(0.35, 1 - Math.abs(distance) * 0.22),
                    zIndex: total - Math.abs(distance),
                  }}
                  onClick={() => goTo(i)}
                  aria-label={`Show ${b.title}`}
                  aria-current={active}
                >
                  {b.coverSrc ? (
                    <img src={b.coverSrc} alt="" draggable={false} />
                  ) : (
                    <span className="usjet-shelf__spine-label">{b.title}</span>
                  )}
                </button>
              );
            })}
          </motion.div>

          <div className="usjet-shelf__ticks" role="tablist" aria-label="Jump to book">
            {spineOrder.map(({ i }) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`usjet-shelf__tick${i === index ? " usjet-shelf__tick--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Book ${i + 1}`}
              />
            ))}
          </div>
          <p className="usjet-shelf__hint">Drag · Scroll · Arrow Keys</p>
        </div>
      </div>
    </section>
  );
}
