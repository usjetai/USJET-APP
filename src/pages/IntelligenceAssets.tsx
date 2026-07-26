import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  REVENUE_ARCHITECTURE_EYEBROW,
  REVENUE_ARCHITECTURE_LEDE,
  REVENUE_ARCHITECTURE_TITLE,
} from "../data/revenueArchitecture";
import { STRIPE_TIER_PRODUCTS } from "../data/stripeProducts";

export default function IntelligenceAssets() {
  useEffect(() => {
    const prev = document.title;
    document.title = "USJET Intelligence Assets · Clearance Tiers";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET clearance tiers — Flight Pass $19.90/mo, Hangar Pro $49.95/mo, Enterprise Commander $199.99/mo.",
    );
    document.documentElement.classList.add("intelligence-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("intelligence-page-root");
    };
  }, []);

  return (
    <div className="intelligence-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <div className="intelligence-page__backdrop" aria-hidden />

      <header className="intelligence-page__hero">
        <p className="intelligence-page__eyebrow">{REVENUE_ARCHITECTURE_EYEBROW}</p>
        <h1 className="intelligence-page__title">{REVENUE_ARCHITECTURE_TITLE}</h1>
        <p className="intelligence-page__lede">{REVENUE_ARCHITECTURE_LEDE}</p>
      </header>

      <section className="intelligence-page__transferable" aria-labelledby="intelligence-transferable-heading">
        <GlassEffectContainer className="intelligence-transferable glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
          <div className="intelligence-transferable__inner">
            <p className="intelligence-transferable__kicker">Subscription clearance</p>
            <h2 id="intelligence-transferable-heading" className="intelligence-transferable__title">
              Three tiers. Three prices. One cockpit.
            </h2>
            <p className="intelligence-transferable__copy">
              We sell clearance into the hangar — not books. Pick Flight Pass, Hangar Pro, or Enterprise
              Commander and Stripe issues your Member ID.
            </p>
            <ul className="intelligence-transferable__list">
              <li>Flight Pass ($19.90/mo): Hangar + all 30 Fleet AIs + Member Portal</li>
              <li>Hangar Pro ($49.95/mo): Everything in Flight Pass + live Intel board</li>
              <li>Enterprise ($199.99/mo): Everything in Hangar Pro + Origin command</li>
            </ul>
            <Link to="/special" className="btn-glass-prominent glass-effect-interactive mt-6 inline-flex">
              View full pricing
            </Link>
          </div>
        </GlassEffectContainer>
      </section>

      <div className="intelligence-page__ladder grid gap-5 lg:grid-cols-3">
        {STRIPE_TIER_PRODUCTS.map((tier) => (
          <GlassEffectContainer
            key={tier.id}
            className={[
              "intelligence-tier-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan",
              tier.highlighted ? "intelligence-tier-card--featured" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="intelligence-tier-card__inner">
              {tier.badge ? <p className="intelligence-tier-card__tier-label">{tier.badge}</p> : null}
              <h2 className="intelligence-tier-card__name">{tier.name}</h2>
              <p className="intelligence-tier-card__price">
                {tier.priceDisplay}
                <span className="intelligence-tier-card__period">{tier.period}</span>
              </p>
              <p className="intelligence-tier-card__logic">{tier.hook}</p>
              <ul className="special-tier-card__features mt-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="special-tier-card__feature">
                    <Check size={14} aria-hidden className="special-tier-card__check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="intelligence-tier-card__actions mt-6">
                <Link
                  to={`/special?tier=${tier.id}`}
                  className="intelligence-tier-card__buy btn-glass-prominent glass-effect-interactive"
                >
                  Clear {tier.priceDisplay}
                  {tier.period}
                </Link>
              </div>
            </div>
          </GlassEffectContainer>
        ))}
      </div>
    </div>
  );
}
