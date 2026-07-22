import { useEffect } from "react";
import { Link } from "react-router-dom";
import B2kHelpActions from "../components/b2k/B2kHelpActions";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import RevenueValueLadder from "../components/growth/RevenueValueLadder";
import {
  B2K_COMING_SOON_COPY,
  B2K_HEADLINE,
  B2K_INFO_BULLETS,
  B2K_LEDE,
  B2K_PAGE_SHORT,
  B2K_PRICE_DISPLAY,
  B2K_STATUS,
  B2K_TAGLINE,
} from "../data/b2k";

export default function B2k() {
  useEffect(() => {
    const prev = document.title;
    document.title = "B2K · Enterprise Deployment · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET B2K — $2,000 enterprise deployment lane. Coming soon. Scoped AI implementation below the Fleet Manual.",
    );
    document.documentElement.classList.add("b2k-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("b2k-page-root");
    };
  }, []);

  return (
    <div className="b2k-page page-atmosphere page-nav-offset mx-auto max-w-5xl px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <div className="b2k-page__grid" aria-hidden />

      <header className="b2k-page__hero">
        <p className="b2k-page__badge" aria-label="B2K page">
          {B2K_PAGE_SHORT}
        </p>
        <p className="b2k-page__status">{B2K_STATUS}</p>
        <p className="b2k-page__eyebrow">{B2K_TAGLINE}</p>
        <h1 className="b2k-page__title">{B2K_HEADLINE}</h1>
        <p className="b2k-page__price">{B2K_PRICE_DISPLAY}</p>
        <p className="b2k-page__lede">{B2K_LEDE}</p>
      </header>

      <B2kHelpActions />

      <RevenueValueLadder />

      <GlassEffectContainer className="b2k-page__soon glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="b2k-page__soon-inner">
          <p className="b2k-page__soon-kicker">Deployment status</p>
          <p className="b2k-page__soon-copy">{B2K_COMING_SOON_COPY}</p>
        </div>
      </GlassEffectContainer>

      <section className="b2k-page__info" aria-labelledby="b2k-info-heading">
        <h2 id="b2k-info-heading" className="b2k-page__section-title">
          What B2K includes
        </h2>
        <ul className="b2k-page__info-list">
          {B2K_INFO_BULLETS.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className="b2k-page__info-foot">
          Need enterprise scale today?{" "}
          <Link to="/fleet-manual" className="b2k-page__inline-link">
            Fleet Manual ($2,500)
          </Link>
        </p>
      </section>
    </div>
  );
}
