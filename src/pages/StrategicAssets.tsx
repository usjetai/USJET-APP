import { useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink, Radio, Satellite } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  STRATEGIC_ASSETS_PAGE_TITLE,
  STRATEGIC_ASSETS_ROUTE,
  STRATEGIC_GATE_CTA_LABEL,
  STRATEGIC_GATE_TITLE,
  STRATEGIC_HERO_KICKER,
  STRATEGIC_LEVERAGE_POINTS,
  STRATEGIC_META_DESCRIPTION,
  STRATEGIC_SOVEREIGNTY_NARRATIVE,
  STRATEGIC_SOVEREIGNTY_TITLE,
  STRATEGIC_WIKIPEDIA_CALLOUT,
  STRATEGIC_WIKIPEDIA_FOOTNOTE,
  USA_JET_AIRLINES_WIKI_TITLE,
  USA_JET_AIRLINES_WIKI_URL,
  strategicGateBody,
} from "../data/strategicAssetsPage";

const GATE_ROUTE = "/licensing" as const;

function MorphHeroVisual() {
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
          <linearGradient id="sa-jet-grad" x1="40" y1="120" x2="480" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e0f2fe" stopOpacity="0.92" />
            <stop offset="0.42" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#6366f1" stopOpacity="0.06" />
          </linearGradient>
        </defs>
        <path
          d="M48 138h116l108-72 76 72h152l28 34H48z"
          stroke="url(#sa-jet-grad)"
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
        <span />
      </div>
    </div>
  );
}

export default function StrategicAssets() {
  useEffect(() => {
    const previous = document.title;
    document.title = `${STRATEGIC_ASSETS_PAGE_TITLE} · USJet.ai`;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", STRATEGIC_META_DESCRIPTION);
    document.documentElement.classList.add("strategic-assets-page-root");
    return () => {
      document.title = previous;
      meta?.setAttribute("content", previousDescription);
      document.documentElement.classList.remove("strategic-assets-page-root");
    };
  }, []);

  return (
    <div className="strategic-assets-page page-atmosphere page-nav-offset mx-auto max-w-4xl px-4 pb-32 pt-4 sm:px-6 lg:px-8">
      <header className="strategic-assets-hero" aria-labelledby="strategic-hero-title">
        <MorphHeroVisual />
        <GlassEffectContainer className="strategic-assets-hero__glass glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="strategic-assets-hero__inner">
            <p className="strategic-assets-hero__kicker">
              <Satellite size={13} aria-hidden />
              {STRATEGIC_HERO_KICKER}
            </p>
            <h1 id="strategic-hero-title" className="strategic-assets-hero__title">
              {STRATEGIC_SOVEREIGNTY_TITLE}
            </h1>
            <p className="strategic-assets-hero__lede">{STRATEGIC_SOVEREIGNTY_NARRATIVE}</p>
          </div>
        </GlassEffectContainer>
      </header>

      <section className="strategic-assets-leverage" aria-labelledby="strategic-leverage-heading">
        <h2 id="strategic-leverage-heading" className="strategic-assets-leverage__title">
          Leverage rails
        </h2>
        <div className="strategic-assets-leverage__grid">
          {STRATEGIC_LEVERAGE_POINTS.map((point) => (
            <GlassEffectContainer
              key={point.id}
              className="strategic-assets-mini glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
            >
              <div className="strategic-assets-mini__inner">
                <h3 className="strategic-assets-mini__title">{point.title}</h3>
                <p className="strategic-assets-mini__copy">{point.body}</p>
              </div>
            </GlassEffectContainer>
          ))}
        </div>
      </section>

      <section className="strategic-assets-wiki" aria-labelledby="strategic-wiki-heading">
        <GlassEffectContainer className="strategic-assets-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-purple">
          <div className="strategic-assets-card__inner">
            <div className="strategic-assets-card__mark">
              <BookOpen size={22} aria-hidden />
            </div>
            <div className="strategic-assets-card__body">
              <h2 id="strategic-wiki-heading" className="strategic-assets-card__title">
                {USA_JET_AIRLINES_WIKI_TITLE}
              </h2>
              <p className="strategic-assets-card__callout">{STRATEGIC_WIKIPEDIA_CALLOUT}</p>
              <p className="strategic-assets-card__foot">{STRATEGIC_WIKIPEDIA_FOOTNOTE}</p>
              <a
                href={USA_JET_AIRLINES_WIKI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="strategic-assets-card__cta btn-glass glass-effect-interactive glass-tint-cyan"
              >
                Read USA Jet Airlines on Wikipedia
                <ExternalLink size={12} aria-hidden />
              </a>
            </div>
          </div>
        </GlassEffectContainer>
      </section>

      <section className="strategic-assets-counter" aria-labelledby="strategic-gate-heading">
        <GlassEffectContainer className="strategic-assets-counter__shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
          <div className="strategic-assets-counter__inner">
            <p className="strategic-assets-counter__pulse" aria-hidden>
              <Radio size={28} aria-hidden />
            </p>
            <h2 id="strategic-gate-heading" className="strategic-assets-counter__title">
              <span className="strategic-assets-counter__blink" />
              {STRATEGIC_GATE_TITLE}
            </h2>
            <p className="strategic-assets-counter__copy">{strategicGateBody()}</p>
            <Link to={GATE_ROUTE} className="strategic-assets-counter__btn btn-glass-prominent glass-effect-interactive glass-tint-gold">
              {STRATEGIC_GATE_CTA_LABEL}
            </Link>
            <p className="strategic-assets-counter__trail">
              Executive surface · internal path{" "}
              <code className="strategic-assets-counter__code">{STRATEGIC_ASSETS_ROUTE}</code>
            </p>
          </div>
        </GlassEffectContainer>
      </section>

      <footer className="strategic-assets-cross">
        <Link to="/sovereignty" className="strategic-assets-cross__link">
          Sovereign acquisition protocol
        </Link>
        <span aria-hidden className="strategic-assets-cross__dot">
          ·
        </span>
        <Link to="/licensing" className="strategic-assets-cross__link">
          Brand Licensing
        </Link>
      </footer>
    </div>
  );
}
