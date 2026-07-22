import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Layers, Scale, Satellite, Sparkles } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import SilentHangarTikTokEmbed from "../components/media/SilentHangarTikTokEmbed";
import SilentHangarYouTubeEmbed from "../components/media/SilentHangarYouTubeEmbed";
import {
  DOMAIN_HANDLE_FRAMEWORK_TITLE,
  DOMAIN_HANDLE_STEPS,
  EMPIRE_BUILDER_BOOK_PRICE_DISPLAY,
  EMPIRE_BUILDER_BOOK_TITLE,
  EMPIRE_BUILDER_CTA_NOTE,
  EMPIRE_BUILDER_SECTION_LEDE,
  EVIDENCE_SECTION_BODY,
  EVIDENCE_SECTION_TITLE,
  SETTLEMENT_SECTION_BODY,
  SOVEREIGNTY_DOTCOM_BTN_SUB,
  SOVEREIGNTY_EVIDENCE_TIKTOK,
  SOVEREIGNTY_EVIDENCE_VIDEOS,
  SOVEREIGNTY_HERO_KICKER,
  SOVEREIGNTY_HERO_TAGLINE,
  SOVEREIGNTY_META_DESCRIPTION,
  SOVEREIGNTY_OFFICIAL_TOPIC,
  SOVEREIGNTY_PAGE_TITLE,
  SOVEREIGNTY_ROUTE,
} from "../data/sovereigntyPage";
import { isUsableStripePaymentLink, resolveDigitalSovereigntyBookPaymentLink } from "../lib/stripePaymentLink";
import { resolveUsjetComUrl, USJET_COM_LABEL } from "../lib/usjetDomains";
import { FOUNDER_DAY_ZERO_LEDGER_ARCHIVE, FOUNDER_GENESIS_DAY_ZERO_LOG } from "../data/founderManifesto";

function SovereigntyHeroVisual() {
  return (
    <div className="strategic-assets-hero__visual" aria-hidden>
      <div className="strategic-assets-hero__mist" />
      <div className="strategic-assets-hero__grid-sweep" />
      <svg
        className="strategic-assets-hero__airframe"
        viewBox="0 0 520 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sovereignty-jet-grad" x1="40" y1="120" x2="480" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e0f2fe" stopOpacity="0.92" />
            <stop offset="0.42" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#6366f1" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <path
          d="M48 138h116l108-72 76 72h152l28 34H48z"
          stroke="url(#sovereignty-jet-grad)"
          strokeWidth="2.25"
          strokeLinejoin="round"
          opacity="0.92"
        />
        <path
          d="M92 154l148-108 148 108"
          stroke="rgba(248,250,252,0.16)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path d="M196 154h236" stroke="rgba(34,211,238,0.35)" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
      <div className="strategic-assets-hero__starfield">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default function Sovereignty() {
  const bookUrl = resolveDigitalSovereigntyBookPaymentLink();
  const comUrl = resolveUsjetComUrl();
  const hasYoutubeEvidence = SOVEREIGNTY_EVIDENCE_VIDEOS.length > 0;
  const hasTikTokEvidence = SOVEREIGNTY_EVIDENCE_TIKTOK.length > 0;
  const hasEvidence = hasYoutubeEvidence || hasTikTokEvidence;

  useEffect(() => {
    const previous = document.title;
    document.title = `${SOVEREIGNTY_PAGE_TITLE} · USJet.ai`;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", SOVEREIGNTY_META_DESCRIPTION);
    document.documentElement.classList.add("sovereignty-page-root");
    return () => {
      document.title = previous;
      meta?.setAttribute("content", previousDescription);
      document.documentElement.classList.remove("sovereignty-page-root");
    };
  }, []);

  return (
    <div className="sovereignty-page strategic-assets-page page-atmosphere page-nav-offset mx-auto max-w-4xl px-4 pb-32 pt-4 sm:px-6 lg:px-8">
      {/* Sovereignty: Day Zero genesis ledger seal — Sovereign Master Log footprint (May 15, 2026) */}
      <header className="strategic-assets-hero" aria-labelledby="sovereignty-hero-title">
        <SovereigntyHeroVisual />
        <GlassEffectContainer className="strategic-assets-hero__glass glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-purple">
          <div className="strategic-assets-hero__inner">
            <p className="strategic-assets-hero__kicker">
              <Satellite size={13} aria-hidden />
              {SOVEREIGNTY_HERO_KICKER}
            </p>
            <h1 id="sovereignty-hero-title" className="strategic-assets-hero__title">
              {SOVEREIGNTY_OFFICIAL_TOPIC}
            </h1>
            <p className="sovereignty-hero-tagline">{SOVEREIGNTY_HERO_TAGLINE}</p>
            <div className="sovereignty-hero-actions">
              <a
                href={comUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sovereignty-hero-actions__com btn-glass-prominent glass-effect-interactive glass-tint-cyan"
              >
                Secure {USJET_COM_LABEL}
                <ExternalLink size={13} aria-hidden />
              </a>
              <p className="sovereignty-hero-actions__sub">{SOVEREIGNTY_DOTCOM_BTN_SUB}</p>
            </div>
            <p className="strategic-assets-hero__lede">{SETTLEMENT_SECTION_BODY}</p>
          </div>
        </GlassEffectContainer>
      </header>

      <section className="sovereignty-framework" aria-labelledby="framework-title">
        <div className="sovereignty-framework__mark" aria-hidden>
          <Layers size={20} />
        </div>
        <h2 id="framework-title" className="sovereignty-framework__title">
          {DOMAIN_HANDLE_FRAMEWORK_TITLE}
        </h2>
        <ol className="sovereignty-steps">
          {DOMAIN_HANDLE_STEPS.map((step, index) => (
            <li key={step.id} className="sovereignty-steps__item">
              <GlassEffectContainer className="sovereignty-steps__card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
                <div className="sovereignty-steps__inner">
                  <span className="sovereignty-steps__index" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="sovereignty-steps__head">{step.title}</h3>
                    <p className="sovereignty-steps__copy">{step.body}</p>
                  </div>
                </div>
              </GlassEffectContainer>
            </li>
          ))}
        </ol>
      </section>

      <section className="sovereignty-evidence" aria-labelledby="evidence-title">
        <div className="sovereignty-evidence__header">
          <div className="sovereignty-evidence__mark" aria-hidden>
            <Sparkles size={20} />
          </div>
          <h2 id="evidence-title" className="sovereignty-evidence__title">
            {EVIDENCE_SECTION_TITLE}
          </h2>
          <p className="sovereignty-evidence__lede">{EVIDENCE_SECTION_BODY}</p>
        </div>

        {hasEvidence ? (
          <div className="sovereignty-evidence__grid">
            {hasYoutubeEvidence
              ? SOVEREIGNTY_EVIDENCE_VIDEOS.map((clip) => (
                  <figure key={clip.videoId} className="sovereignty-evidence__cell sovereignty-evidence__cell--youtube">
                    <SilentHangarYouTubeEmbed videoId={clip.videoId} title={clip.title} />
                    <figcaption className="sovereignty-evidence__caption">{clip.title}</figcaption>
                  </figure>
                ))
              : null}
            {hasTikTokEvidence
              ? SOVEREIGNTY_EVIDENCE_TIKTOK.map((post) => (
                  <figure key={post.postId} className="sovereignty-evidence__cell sovereignty-evidence__cell--tiktok">
                    <SilentHangarTikTokEmbed
                      postId={post.postId}
                      postUrl={post.postUrl}
                      className="sovereignty-evidence-tiktok-shell"
                      wrapClassName="sovereignty-evidence-tiktok-wrap"
                    >
                      <section>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          title={post.profileHandle}
                          href={post.profileUrl}
                        >
                          {post.profileHandle}
                        </a>
                        <p />
                        <a target="_blank" rel="noopener noreferrer" title={post.musicTitle} href={post.musicUrl}>
                          {post.musicLabel}
                        </a>
                      </section>
                    </SilentHangarTikTokEmbed>
                    <figcaption className="sovereignty-evidence__caption">{post.figureCaption}</figcaption>
                  </figure>
                ))
              : null}
          </div>
        ) : (
          <GlassEffectContainer className="sovereignty-evidence__placeholder glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
            <p className="sovereignty-evidence__placeholder-copy">
              Evidence slots use Silent Hangar wiring. Add rows to{" "}
              <code className="sovereignty-evidence__code">SOVEREIGNTY_EVIDENCE_TIKTOK</code> or{" "}
              <code className="sovereignty-evidence__code">SOVEREIGNTY_EVIDENCE_VIDEOS</code> in{" "}
              <code className="sovereignty-evidence__code">src/data/sovereigntyPage.ts</code>.
            </p>
          </GlassEffectContainer>
        )}
      </section>

      <section className="sovereignty-book" aria-labelledby="book-cta-title">
        <GlassEffectContainer className="sovereignty-book__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
          <div className="sovereignty-book__inner">
            <div className="sovereignty-book__mark" aria-hidden>
              <Scale size={22} />
            </div>
            <h2 id="book-cta-title" className="sovereignty-book__title">
              Empire builder&apos;s desk
            </h2>
            <p className="sovereignty-book__lede">{EMPIRE_BUILDER_SECTION_LEDE}</p>
            <p className="sovereignty-book__note">{EMPIRE_BUILDER_CTA_NOTE}</p>
            {isUsableStripePaymentLink(bookUrl) ? (
              <a
                href={bookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sovereignty-book__btn btn-glass-prominent glass-effect-interactive glass-tint-gold"
              >
                Secure the digital book · {EMPIRE_BUILDER_BOOK_PRICE_DISPLAY}
              </a>
            ) : (
              <Link to="/cash" className="sovereignty-book__btn btn-glass-prominent glass-effect-interactive glass-tint-gold">
                Request checkout · {EMPIRE_BUILDER_BOOK_TITLE}
              </Link>
            )}
          </div>
        </GlassEffectContainer>
      </section>

      <section className="sovereignty-day-zero" aria-label="Day Zero sovereign genesis ledger seal">
        <details className="sovereignty-day-zero__vault">
          <summary className="sovereignty-day-zero__summary">
            Day Zero archive · Sovereign genesis ledger (sealed {FOUNDER_GENESIS_DAY_ZERO_LOG.sealedDate})
          </summary>
          <p className="sovereignty-day-zero__logline">{FOUNDER_GENESIS_DAY_ZERO_LOG.logTitle}</p>
          <p className="sovereignty-day-zero__doctrine">{FOUNDER_GENESIS_DAY_ZERO_LOG.directive}</p>
          <pre className="sovereignty-day-zero__pre" tabIndex={0}>
            <code>{FOUNDER_DAY_ZERO_LEDGER_ARCHIVE}</code>
          </pre>
          <p className="sovereignty-day-zero__orders">{FOUNDER_GENESIS_DAY_ZERO_LOG.fleetMessage}</p>
        </details>
      </section>

      <footer className="strategic-assets-cross sovereignty-cross">
        <Link to="/strategic-assets" className="strategic-assets-cross__link">
          Strategic assets dashboard
        </Link>
        <span aria-hidden className="strategic-assets-cross__dot">
          ·
        </span>
        <span className="sovereignty-cross__path">
          <code>{SOVEREIGNTY_ROUTE}</code>
        </span>
      </footer>
    </div>
  );
}
