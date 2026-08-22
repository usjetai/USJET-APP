import { Link } from "react-router-dom";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  SEO_MONEY_BUNDLE,
  SEO_MONEY_HUB_THESIS,
  SEO_MONEY_OFFERS,
  SEO_MONEY_PAGES,
  SEO_MONEY_REPLACES,
} from "../data/seoMoneyPages";

export default function CompareHub() {
  const flight = SEO_MONEY_OFFERS["flight-pass"];

  return (
    <div className="compare-page page-atmosphere page-nav-offset mx-auto max-w-4xl px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <header className="compare-page__hero">
        <UsjetWordmark size="hero" glow className="compare-page__wordmark" />
        <p className="compare-page__eyebrow">Compare · hardware first</p>
        <h1 className="compare-page__title">
          A computer with a Jarvis vs ChatGPT, tool sprawl, and a custom build
        </h1>
        <p className="compare-page__lede">{SEO_MONEY_HUB_THESIS}</p>
        <div className="compare-page__cta-row">
          <Link to="/" className="compare-page__cta btn-glass-prominent glass-effect-interactive glass-tint-cyan">
            Shop the Operator&apos;s Rig
          </Link>
          <a
            href={flight.href}
            className="compare-page__cta-secondary btn-glass glass-effect-interactive"
            data-usjet-external-leak="true"
          >
            Optional cockpit · {flight.priceDisplay}
          </a>
        </div>
      </header>

      <section className="compare-page__lanes" aria-labelledby="compare-lanes-heading">
        <h2 id="compare-lanes-heading" className="compare-page__section-title">
          Choose your fight
        </h2>
        <div className="compare-page__lane-grid">
          {SEO_MONEY_PAGES.map((page) => {
            const offer = SEO_MONEY_OFFERS[page.primaryOfferId];
            return (
              <GlassEffectContainer
                key={page.slug}
                className="compare-lane glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
              >
                <div className="compare-lane__inner">
                  <p className="compare-lane__eyebrow">{page.eyebrow}</p>
                  <h3 className="compare-lane__title">{page.h1}</h3>
                  <p className="compare-lane__lede">{page.lede}</p>
                  <p className="compare-lane__offer">
                    Hardware first. Optional cockpit: {offer.name} · {offer.priceDisplay}
                  </p>
                  <Link
                    to={page.path}
                    className="compare-lane__link glass-effect-interactive"
                  >
                    Read the comparison →
                  </Link>
                </div>
              </GlassEffectContainer>
            );
          })}
        </div>
      </section>

      <section className="compare-page__replaces" aria-labelledby="compare-replaces-heading">
        <GlassEffectContainer className="compare-panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="compare-panel__inner">
            <h2 id="compare-replaces-heading" className="compare-page__section-title">
              What USJET replaces
            </h2>
            <ul className="compare-page__list">
              {SEO_MONEY_REPLACES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </GlassEffectContainer>
      </section>

      <section className="compare-page__bundle" aria-labelledby="compare-bundle-heading">
        <h2 id="compare-bundle-heading" className="compare-page__section-title">
          Optional cockpit bundle
        </h2>
        <ul className="compare-page__bundle-grid">
          {SEO_MONEY_BUNDLE.map((item) => (
            <li key={item.id} className="compare-bundle-item">
              <h3 className="compare-bundle-item__title">{item.title}</h3>
              <p className="compare-bundle-item__body">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
