import { Link, Navigate, useParams } from "react-router-dom";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  getCompetitiveAlternative,
  getSeoMoneyPageBySlug,
  SEO_MONEY_HUB_PATH,
  SEO_MONEY_OFFERS,
  SEO_MONEY_PAGES,
} from "../data/seoMoneyPages";

export default function ComparePage() {
  const { slug } = useParams<{ slug: string }>();
  const page = getSeoMoneyPageBySlug(slug);

  if (!page) {
    return <Navigate to={SEO_MONEY_HUB_PATH} replace />;
  }

  const alternative = getCompetitiveAlternative(page);
  const primary = SEO_MONEY_OFFERS[page.primaryOfferId];
  const siblings = SEO_MONEY_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <div className="compare-page compare-page--detail page-atmosphere page-nav-offset mx-auto max-w-3xl px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <header className="compare-page__hero">
        <UsjetWordmark size="hero" glow className="compare-page__wordmark" />
        <p className="compare-page__eyebrow">{page.eyebrow}</p>
        <h1 className="compare-page__title">{page.h1}</h1>
        <p className="compare-page__lede">{page.lede}</p>
        <div className="compare-page__cta-row">
          <a
            href={primary.href}
            className="compare-page__cta btn-glass-prominent glass-effect-interactive glass-tint-cyan"
          >
            {primary.ctaLabel}
          </a>
          <Link to="/" className="compare-page__cta-secondary btn-glass glass-effect-interactive">
            Enter Hangar free
          </Link>
        </div>
        <p className="compare-page__secure">Secure Stripe checkout · Member ID clearance · no OAuth</p>
      </header>

      <section className="compare-page__split" aria-labelledby="compare-problem-heading">
        <GlassEffectContainer className="compare-panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="compare-panel__inner">
            <p className="compare-panel__kicker">{alternative.label}</p>
            <h2 id="compare-problem-heading" className="compare-panel__title">
              {page.problemTitle}
            </h2>
            <p className="compare-panel__copy">{page.problemBody}</p>
            <p className="compare-panel__copy compare-panel__copy--muted">{alternative.prospectUses}</p>
          </div>
        </GlassEffectContainer>
      </section>

      <section className="compare-page__split" aria-labelledby="compare-solution-heading">
        <GlassEffectContainer className="compare-panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="compare-panel__inner">
            <p className="compare-panel__kicker">USJET advantage</p>
            <h2 id="compare-solution-heading" className="compare-panel__title">
              {page.solutionTitle}
            </h2>
            <p className="compare-panel__copy">{page.solutionBody}</p>
            <p className="compare-panel__copy">{alternative.usjetAdvantage}</p>
            <p className="compare-panel__objection">{alternative.objectionHandle}</p>
          </div>
        </GlassEffectContainer>
      </section>

      <section className="compare-page__proof" aria-labelledby="compare-proof-heading">
        <h2 id="compare-proof-heading" className="compare-page__section-title">
          Why captains clear here
        </h2>
        <ul className="compare-page__list">
          {page.proofPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </section>

      <section className="compare-page__offer-band" aria-labelledby="compare-offer-heading">
        <GlassEffectContainer className="compare-offer glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="compare-offer__inner">
            <p className="compare-offer__kicker">Direct Landing Protocol</p>
            <h2 id="compare-offer-heading" className="compare-offer__title">
              {primary.name} · {primary.priceDisplay}
            </h2>
            <p className="compare-offer__copy">{primary.buyBecause}</p>
            <a
              href={primary.href}
              className="compare-page__cta btn-glass-prominent glass-effect-interactive glass-tint-cyan"
            >
              {primary.ctaLabel}
            </a>
          </div>
        </GlassEffectContainer>
      </section>

      <section className="compare-page__faq" aria-labelledby="compare-faq-heading">
        <h2 id="compare-faq-heading" className="compare-page__section-title">
          FAQ
        </h2>
        <div className="compare-faq__list">
          {page.faqs.map((faq) => (
            <details key={faq.question} className="compare-faq__item">
              <summary className="compare-faq__question">{faq.question}</summary>
              <p className="compare-faq__answer">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="compare-page__siblings" aria-label="More comparisons">
        <p className="compare-page__siblings-label">Also compare</p>
        <ul className="compare-page__siblings-list">
          {siblings.map((sib) => (
            <li key={sib.slug}>
              <Link to={sib.path} className="compare-page__sibling-link glass-effect-interactive">
                {sib.eyebrow} →
              </Link>
            </li>
          ))}
          <li>
            <Link to={SEO_MONEY_HUB_PATH} className="compare-page__sibling-link glass-effect-interactive">
              All comparisons →
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
