import { useEffect } from "react";
import IntelligenceFuelVisual from "../components/growth/IntelligenceFuelVisual";
import IntelligenceTierCard from "../components/growth/IntelligenceTierCard";
import FleetManualArtifact from "../components/growth/FleetManualArtifact";
import SovereignProtocolBookArtifact from "../components/growth/SovereignProtocolBookArtifact";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  REVENUE_ARCHITECTURE_EYEBROW,
  REVENUE_ARCHITECTURE_LEDE,
  REVENUE_ARCHITECTURE_TITLE,
  REVENUE_TIER_ANCHOR,
  REVENUE_TIER_COMMUNITY,
  REVENUE_TIER_OPERATOR,
  REVENUE_TRANSFERABLE_BULLETS,
  REVENUE_TRANSFERABLE_COPY,
  REVENUE_TRANSFERABLE_TITLE,
} from "../data/revenueArchitecture";

export default function IntelligenceAssets() {
  useEffect(() => {
    const prev = document.title;
    document.title = "USJET Intelligence Assets · Revenue Architecture";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET three-tier revenue engine — Founder's Fuel $19.90/mo, Fleet Manual $2,500, Sovereign Fleet Protocol $100,000.",
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
            <p className="intelligence-transferable__kicker">Sovereign Vault · IP ladder</p>
            <h2 id="intelligence-transferable-heading" className="intelligence-transferable__title">
              {REVENUE_TRANSFERABLE_TITLE}
            </h2>
            <p className="intelligence-transferable__copy">{REVENUE_TRANSFERABLE_COPY}</p>
            <ul className="intelligence-transferable__list">
              {REVENUE_TRANSFERABLE_BULLETS.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </GlassEffectContainer>
      </section>

      <div className="intelligence-page__ladder">
        <IntelligenceTierCard
          kind="protocol"
          tierLabel={REVENUE_TIER_ANCHOR.tierLabel}
          name={REVENUE_TIER_ANCHOR.name}
          subtitle={REVENUE_TIER_ANCHOR.subtitle}
          priceDisplay={REVENUE_TIER_ANCHOR.priceDisplay}
          period={REVENUE_TIER_ANCHOR.period}
          stripeDescription={REVENUE_TIER_ANCHOR.stripeDescription}
          logic={REVENUE_TIER_ANCHOR.logic}
          cta={REVENUE_TIER_ANCHOR.cta}
          detailRoute={REVENUE_TIER_ANCHOR.detailRoute}
          visual={<SovereignProtocolBookArtifact />}
          featured
        />

        <IntelligenceTierCard
          kind="manual"
          tierLabel={REVENUE_TIER_OPERATOR.tierLabel}
          name={REVENUE_TIER_OPERATOR.name}
          subtitle={REVENUE_TIER_OPERATOR.subtitle}
          priceDisplay={REVENUE_TIER_OPERATOR.priceDisplay}
          period={REVENUE_TIER_OPERATOR.period}
          stripeDescription={REVENUE_TIER_OPERATOR.stripeDescription}
          logic={REVENUE_TIER_OPERATOR.logic}
          cta={REVENUE_TIER_OPERATOR.cta}
          detailRoute={REVENUE_TIER_OPERATOR.detailRoute}
          visual={<FleetManualArtifact />}
        />

        <IntelligenceTierCard
          kind="fuel"
          tierLabel={REVENUE_TIER_COMMUNITY.tierLabel}
          name={REVENUE_TIER_COMMUNITY.name}
          priceDisplay={REVENUE_TIER_COMMUNITY.priceDisplay}
          period={REVENUE_TIER_COMMUNITY.period}
          stripeDescription={REVENUE_TIER_COMMUNITY.stripeDescription}
          logic={REVENUE_TIER_COMMUNITY.logic}
          cta={REVENUE_TIER_COMMUNITY.cta}
          detailRoute={REVENUE_TIER_COMMUNITY.detailRoute}
          visual={<IntelligenceFuelVisual />}
        />
      </div>
    </div>
  );
}
