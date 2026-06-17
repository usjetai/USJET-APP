import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileStack, Plane, Fuel } from "lucide-react";
import B2bBriefingWizard from "../components/b2b/B2bBriefingWizard";
import WefunderCovenantBridge from "../components/campaign/WefunderCovenantBridge";
import UsjetStarEmblem from "../components/brand/UsjetStarEmblem";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  B2B_BRIEFING_KICKER,
  B2B_BRIEFING_SUB,
  B2B_BRIEFING_TITLE,
  B2B_DIGITAL_FOREMAN_TITLE,
  B2B_FOREMAN_PILLARS,
  B2B_HANGAR_INTEGRATION_BULLETS,
  B2B_HANGAR_INTEGRATION_COPY,
  B2B_HANGAR_INTEGRATION_TITLE,
  B2B_HEADLINE,
  B2B_LEDE,
  B2B_SECTOR_TAG,
  B2B_SOVEREIGN_ANCHOR_COPY,
  B2B_TAGLINE,
} from "../data/b2bEnterprise";
import { SOVEREIGN_BLUEPRINT_PRICE_DISPLAY } from "../data/sovereignBlueprint100k";

const FOREMAN_ICONS = { hangar: FileStack, "flight-path": Plane, refuel: Fuel } as const;

export default function B2bEnterprise() {
  useEffect(() => {
    const previous = document.title;
    document.title = "B2B Industrial Backbone · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET.AI industrial intelligence layer for America's fleet — Digital Foreman, Hangar integration, executive briefing. Labor Operating System for enterprise.",
    );
    document.documentElement.classList.add("b2b-page-root");
    return () => {
      document.title = previous;
      meta?.setAttribute("content", previousDescription);
      document.documentElement.classList.remove("b2b-page-root");
    };
  }, []);

  return (
    <div className="b2b-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-36 pt-0 sm:px-6 lg:px-8">
      <section className="b2b-hero" aria-labelledby="b2b-hero-heading">
        <div className="b2b-hero__video" aria-hidden>
          <div className="b2b-hero__video-scan" />
          <div className="b2b-hero__video-grid" />
        </div>
        <GlassEffectContainer className="b2b-hero__glass glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-forge">
          <div className="b2b-hero__inner">
            <UsjetStarEmblem className="b2b-hero__star" variant="steel" decorative />
            <p className="b2b-hero__sector">{B2B_SECTOR_TAG}</p>
            <p className="b2b-hero__eyebrow">{B2B_TAGLINE}</p>
            <h1 id="b2b-hero-heading" className="b2b-hero__title">
              {B2B_HEADLINE}
            </h1>
            <p className="b2b-hero__lede">{B2B_LEDE}</p>
          </div>
        </GlassEffectContainer>
      </section>

      <section className="b2b-page__foreman" aria-labelledby="b2b-foreman-heading">
        <h2 id="b2b-foreman-heading" className="b2b-page__section-title">
          {B2B_DIGITAL_FOREMAN_TITLE}
        </h2>
        <div className="b2b-foreman-grid">
          {B2B_FOREMAN_PILLARS.map((pillar) => {
            const Icon = FOREMAN_ICONS[pillar.id as keyof typeof FOREMAN_ICONS] ?? FileStack;
            return (
              <GlassEffectContainer
                key={pillar.id}
                className="b2b-foreman-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-forge"
              >
                <div className="b2b-foreman-card__inner">
                  <Icon size={20} className="b2b-foreman-card__icon" aria-hidden />
                  <p className="b2b-foreman-card__subtitle">{pillar.subtitle}</p>
                  <h3 className="b2b-foreman-card__title">{pillar.title}</h3>
                  <p className="b2b-foreman-card__body">{pillar.body}</p>
                </div>
              </GlassEffectContainer>
            );
          })}
        </div>
      </section>

      <section className="b2b-page__hangar" aria-labelledby="b2b-hangar-heading">
        <GlassEffectContainer className="b2b-hangar glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-forge">
          <div className="b2b-hangar__inner">
            <p className="b2b-hangar__blueprint" aria-hidden>
              ◈ BLUEPRINT LAYER ◈
            </p>
            <h2 id="b2b-hangar-heading" className="b2b-hangar__title">
              {B2B_HANGAR_INTEGRATION_TITLE}
            </h2>
            <p className="b2b-hangar__copy">{B2B_HANGAR_INTEGRATION_COPY}</p>
            <ul className="b2b-hangar__list">
              {B2B_HANGAR_INTEGRATION_BULLETS.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </GlassEffectContainer>
      </section>

      <section className="b2b-page__trust" aria-labelledby="b2b-trust-heading">
        <GlassEffectContainer className="b2b-trust glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-forge">
          <div className="b2b-trust__inner">
            <p className="b2b-trust__kicker">Sovereign anchor</p>
            <h2 id="b2b-trust-heading" className="b2b-trust__title">
              Priority institutional logic
            </h2>
            <p className="b2b-trust__copy">
              {B2B_SOVEREIGN_ANCHOR_COPY}{" "}
              <Link to="/100k" className="b2b-trust__inline-link">
                Review {SOVEREIGN_BLUEPRINT_PRICE_DISPLAY} Protocol →
              </Link>
            </p>
          </div>
        </GlassEffectContainer>
      </section>

      <section className="b2b-page__covenant" aria-labelledby="b2b-covenant-heading">
        <GlassEffectContainer className="b2b-covenant glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
          <div className="b2b-covenant__inner">
            <p className="b2b-covenant__kicker">Community round · Relaunch live</p>
            <h2 id="b2b-covenant-heading" className="b2b-covenant__title">
              Join the 5% Covenant
            </h2>
            <p className="b2b-covenant__copy">
              The Hangar campaign is live on Wefunder again. Enterprise briefings run on this page—the community equity
              lane opens through the relaunch link below.
            </p>
            <WefunderCovenantBridge variant="prominent" showTicker />
          </div>
        </GlassEffectContainer>
      </section>

      <section className="b2b-page__inquiry" aria-labelledby="b2b-inquiry-heading">
        <GlassEffectContainer className="b2b-inquiry-shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-forge">
          <div className="b2b-inquiry-shell__inner">
            <p className="b2b-inquiry-shell__kicker">{B2B_BRIEFING_KICKER}</p>
            <h2 id="b2b-inquiry-heading" className="b2b-inquiry-shell__title">
              {B2B_BRIEFING_TITLE}
            </h2>
            <p className="b2b-inquiry-shell__sub">{B2B_BRIEFING_SUB}</p>
            <B2bBriefingWizard />
          </div>
        </GlassEffectContainer>
      </section>

      <p className="b2b-page__footer-links">
        <Link to="/intelligence" className="b2b-page__footer-link">
          Sovereign value ladder
        </Link>
        {" · "}
        <Link to="/100k" className="b2b-page__footer-link">
          Vault
        </Link>
      </p>
    </div>
  );
}
