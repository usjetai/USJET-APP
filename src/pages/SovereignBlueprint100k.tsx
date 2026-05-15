import { useEffect } from "react";
import { Link } from "react-router-dom";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import SovereignBlueprint100kVault from "../components/growth/SovereignBlueprint100kVault";
import SovereignIpAppreciationChart from "../components/growth/SovereignIpAppreciationChart";
import SovereignProtocolBookArtifact from "../components/growth/SovereignProtocolBookArtifact";
import Sovereign100kDeadlineHero from "../components/growth/Sovereign100kDeadlineHero";
import RevenueValueLadder from "../components/growth/RevenueValueLadder";
import {
  SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY,
  SOVEREIGN_BLUEPRINT_PRICE_DISPLAY,
  SOVEREIGN_BLUEPRINT_PRICE_SHORT,
  SOVEREIGN_PRICE_DEADLINE_LABEL,
  SOVEREIGN_VALUE_PROPOSITIONS,
  SOVEREIGN_VOLUME_PITCH,
  SOVEREIGN_VOLUME_SUBTITLE,
  SOVEREIGN_VOLUME_TITLE,
} from "../data/sovereignBlueprint100k";

export default function SovereignBlueprint100k() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Sovereign Fleet Protocol · Volume I · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      `Sovereign Fleet Protocol Volume I — ${SOVEREIGN_BLUEPRINT_PRICE_DISPLAY} until ${SOVEREIGN_PRICE_DEADLINE_LABEL}, then ${SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY}. USA 250 institutional deadline.`,
    );
    document.documentElement.classList.add("vault-100k-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("vault-100k-page-root");
    };
  }, []);

  return (
    <div className="vault-100k-page page-atmosphere page-nav-offset mx-auto max-w-5xl px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <div className="vault-100k-page__obsidian" aria-hidden />

      <Sovereign100kDeadlineHero />

      <RevenueValueLadder active="protocol" />

      <header className="vault-100k-page__hero vault-100k-page__hero--with-banner">
        <p className="vault-100k-page__price-top" aria-label={`Institutional clearance ${SOVEREIGN_BLUEPRINT_PRICE_DISPLAY}`}>
          <span className="vault-100k-page__price-top-short">{SOVEREIGN_BLUEPRINT_PRICE_SHORT}</span>
          <span className="vault-100k-page__price-top-full">{SOVEREIGN_BLUEPRINT_PRICE_DISPLAY}</span>
        </p>
        <p className="vault-100k-page__eyebrow">Sovereign Vault · Restricted Asset</p>
        <h1 className="vault-100k-page__title">{SOVEREIGN_VOLUME_TITLE}</h1>
        <p className="vault-100k-page__subtitle">{SOVEREIGN_VOLUME_SUBTITLE}</p>
      </header>

      <section className="vault-100k-page__showcase">
        <SovereignProtocolBookArtifact />
        <div className="vault-100k-page__pitch">
          {SOVEREIGN_VOLUME_PITCH.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="vault-100k-page__pitch-p">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="vault-100k-page__value" aria-labelledby="vault-value-heading">
        <h2 id="vault-value-heading" className="vault-100k-page__section-title">
          The Value Proposition
        </h2>
        <ul className="vault-100k-page__value-list">
          {SOVEREIGN_VALUE_PROPOSITIONS.map((item) => (
            <li key={item.title}>
              <GlassEffectContainer className="vault-100k-page__value-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
                <div className="vault-100k-page__value-card-inner">
                  <h3 className="vault-100k-page__value-card-title">{item.title}</h3>
                  <p className="vault-100k-page__value-card-body">{item.body}</p>
                </div>
              </GlassEffectContainer>
            </li>
          ))}
        </ul>
      </section>

      <section className="vault-100k-page__liquidity">
        <SovereignIpAppreciationChart />
      </section>

      <section className="vault-100k-page__acquire" aria-labelledby="vault-acquire-heading">
        <h2 id="vault-acquire-heading" className="vault-100k-page__section-title vault-100k-page__section-title--center">
          Acquire Volume I
        </h2>
        <SovereignBlueprint100kVault />
      </section>

      <footer className="vault-100k-page__footer">
        <Link to="/founders-fuel" className="vault-100k-page__fuel-link">
          Supporter tier · Founder&apos;s Fuel
        </Link>
      </footer>
    </div>
  );
}
