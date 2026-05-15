import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Cpu, ShieldCheck, Zap } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import GamingFounderKeyEmblem from "../components/gaming/GamingFounderKeyEmblem";
import GamingHangarLive from "../components/gaming/GamingHangarLive";
import GamingLegacyBackdrop from "../components/gaming/GamingLegacyBackdrop";
import GamingPortalJumps from "../components/gaming/GamingPortalJumps";
import GamingVrIcon from "../components/gaming/GamingVrIcon";
import GamingVrVisor from "../components/gaming/GamingVrVisor";
import {
  GAMER_FOUNDER_CTA,
  GAMER_FOUNDER_ENTRY_KICKER,
  GAMER_FOUNDER_KIT_FEATURES_LEGACY,
  LEGACY_ENGINE_ANTI_CRIME,
  LEGACY_ENGINE_HEADLINE,
  LEGACY_ENGINE_HUD_BADGE,
  LEGACY_ENGINE_MANIFESTO_BODY,
  LEGACY_ENGINE_MANIFESTO_LEDE,
  GAMING_WEALTH_PIPELINE_STAGES,
  GAMING_WEALTH_PIPELINE_TITLE,
} from "../data/gamingLegacyEngine";
import {
  GAMER_FOUNDER_KIT_HOOK,
  GAMER_FOUNDER_KIT_PRICE,
  GAMER_FOUNDER_KIT_TITLE,
  GAMING_ANCHOR_KIT,
  GAMING_CONCEPT_COPY,
  GAMING_CONCEPT_TITLE,
  GAMING_HEADLINE,
  GAMING_PAGE_TITLE,
  GAMING_TWITCH_DISPLAY,
  GAMING_TWITCH_URL,
  GAMING_X_URL,
  GAMING_X_WEB,
  GAMING_VR_AI_PILLARS,
  GAMING_VR_AI_TITLE,
  GAMING_ANCHOR_DIRECTIVE,
  GAMING_ANCHOR_MANIFESTO,
  GAMING_ANCHOR_PIPELINE,
} from "../data/gamingPortal";
import { HANGAR_LIVE_TWITCH_HOOK } from "../data/liveHangar";
import { CODE_KIT_ROUTE } from "../data/codeKit499";
import { GAMING_INSTAGRAM_PROFILE_URL, GAMING_INSTAGRAM_HANDLE_DISPLAY } from "../data/gamingInstagram";
import { isUsableStripePaymentLink, resolveGamerFounderKitPaymentLink } from "../lib/stripePaymentLink";

export default function Gaming() {
  const kitLink = resolveGamerFounderKitPaymentLink();
  const kitReady = isUsableStripePaymentLink(kitLink);

  useEffect(() => {
    const prev = document.title;
    document.title = `${GAMING_PAGE_TITLE} · USJet.ai`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Legacy Engine gamer portal — Twitch Hangar Cam, Instagram, X signals, TikTok proof, Silent Hangar audio, and $99 Founder’s Entry Key.",
    );
    document.documentElement.classList.add("gaming-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("gaming-page-root");
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      return;
    }
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <GamingLegacyBackdrop />

      <div className="gaming-page gaming-legacy-engine page-atmosphere page-nav-offset relative z-[2] mx-auto max-w-5xl px-4 pb-36 pt-4 sm:px-6 lg:max-w-6xl">
        <GamingPortalJumps />

        <header className="gaming-page__hero">
          <div className="gaming-page__hero-grid">
            <div className="gaming-page__hero-copy">
              <p className="gaming-page__badge">
                <GamingVrIcon variant="badge" />
                {LEGACY_ENGINE_HUD_BADGE}
              </p>
              <h1 className="gaming-page__title">{LEGACY_ENGINE_HEADLINE}</h1>
              <p className="gaming-page__lede gaming-page__lede--tagline">{GAMING_HEADLINE}</p>
              <p className="gaming-page__hangar-teaser">{HANGAR_LIVE_TWITCH_HOOK}</p>
              <GlassEffectContainer className="gaming-hud-frame gaming-page__concept glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-purple">
                <div className="gaming-page__concept-inner">
                  <p className="gaming-page__concept-kicker">{GAMING_CONCEPT_TITLE}</p>
                  <p className="gaming-page__concept-copy">{GAMING_CONCEPT_COPY}</p>
                </div>
              </GlassEffectContainer>
            </div>
            <GamingVrVisor />
          </div>
        </header>

        <section
          id={GAMING_ANCHOR_MANIFESTO}
          className="gaming-page__manifesto gaming-legacy-manifesto"
          aria-labelledby="gaming-legacy-manifesto-title"
        >
          <h2 id="gaming-legacy-manifesto-title" className="gaming-page__section-title gaming-page__section-title--manifesto">
            Legacy &gt; leisure · Spatial intelligence for industry
          </h2>
          <GlassEffectContainer className="gaming-hud-frame gaming-page__manifesto-panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-purple">
            <div className="gaming-page__manifesto-inner">
              <p className="gaming-page__manifesto-lede">{LEGACY_ENGINE_MANIFESTO_LEDE}</p>
              <p className="gaming-page__manifesto-body">{LEGACY_ENGINE_MANIFESTO_BODY}</p>
            </div>
          </GlassEffectContainer>
        </section>

        <section
          id={GAMING_ANCHOR_DIRECTIVE}
          className="gaming-page__directive gaming-legacy-directive"
          aria-labelledby="gaming-anti-crime-title"
        >
          <GlassEffectContainer className="gaming-hud-frame gaming-page__directive-panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-purple">
            <div className="gaming-page__directive-inner">
              <div className="gaming-page__directive-mark">
                <ShieldCheck size={22} aria-hidden />
              </div>
              <div>
                <h2 id="gaming-anti-crime-title" className="gaming-page__directive-title">
                  Anti-crime directive
                </h2>
                <p className="gaming-page__directive-copy">{LEGACY_ENGINE_ANTI_CRIME}</p>
              </div>
            </div>
          </GlassEffectContainer>
        </section>

        <section
          id={GAMING_ANCHOR_PIPELINE}
          className="gaming-page__pipeline gaming-legacy-pipeline"
          aria-labelledby="gaming-wealth-pipeline-title"
        >
          <h2 id="gaming-wealth-pipeline-title" className="gaming-page__section-title">
            {GAMING_WEALTH_PIPELINE_TITLE}
          </h2>
          <div className="gaming-page__pipeline-grid">
            {GAMING_WEALTH_PIPELINE_STAGES.map((stage) => (
              <GlassEffectContainer
                key={stage.id}
                className="gaming-hud-frame gaming-page__pipeline-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-purple"
              >
                <div className="gaming-page__pipeline-inner">
                  <p className="gaming-page__pipeline-tier">{stage.tier}</p>
                  <p className="gaming-page__pipeline-price">{stage.price}</p>
                  <p className="gaming-page__pipeline-body">{stage.body}</p>
                  {stage.href.startsWith("#") ? (
                    <a href={stage.href} className="gaming-page__pipeline-cta btn-glass glass-effect-interactive">
                      {stage.cta}
                    </a>
                  ) : (
                    <Link to={stage.href} className="gaming-page__pipeline-cta btn-glass glass-effect-interactive">
                      {stage.cta}
                    </Link>
                  )}
                </div>
              </GlassEffectContainer>
            ))}
          </div>
        </section>

        <section id="gaming-vr-ai" className="gaming-page__vr-ai" aria-labelledby="gaming-vr-ai-title">
          <h2 id="gaming-vr-ai-title" className="gaming-page__section-title">
            <Cpu size={18} aria-hidden />
            {GAMING_VR_AI_TITLE}
          </h2>
          <div className="gaming-page__pillar-grid">
            {GAMING_VR_AI_PILLARS.map((pillar) => (
              <GlassEffectContainer
                key={pillar.id}
                className="gaming-hud-frame gaming-page__pillar glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-purple"
              >
                <div className="gaming-page__pillar-inner">
                  <Zap size={14} className="gaming-page__pillar-icon" aria-hidden />
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                </div>
              </GlassEffectContainer>
            ))}
          </div>
        </section>

        <GamingHangarLive />

        <GlassEffectContainer
          id={GAMING_ANCHOR_KIT}
          className="gaming-hud-frame gaming-page__kit glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-purple"
        >
          <div className="gaming-page__kit-inner">
            <div className="gaming-page__kit-brand">
              <GamingFounderKeyEmblem />
              <div className="gaming-page__kit-brand-copy">
                <p className="gaming-page__kit-kicker">{GAMER_FOUNDER_ENTRY_KICKER}</p>
                <h2 className="gaming-page__kit-title">{GAMER_FOUNDER_KIT_TITLE}</h2>
              </div>
            </div>
            <p className="gaming-page__kit-price">{GAMER_FOUNDER_KIT_PRICE}</p>
            <p className="gaming-page__kit-hook">{GAMER_FOUNDER_KIT_HOOK}</p>
            <ul className="gaming-page__kit-list">
              {GAMER_FOUNDER_KIT_FEATURES_LEGACY.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {kitReady ? (
              <a href={kitLink} className="gaming-page__kit-cta btn-glass-prominent glass-effect-interactive glass-tint-purple">
                {GAMER_FOUNDER_CTA}
              </a>
            ) : (
              <p className="gaming-page__kit-note">
                Paste your Stripe Payment Link into <code>VITE_STRIPE_GAMER_FOUNDER_KIT_PAYMENT_LINK</code>, then redeploy.
              </p>
            )}
            <p className="gaming-page__kit-footer">
              <Link to="/hangar" className="gaming-page__link">
                Enter Hangar
              </Link>
              {" · "}
              <Link to="/ai-101" className="gaming-page__link">
                AI 101
              </Link>
              {" · "}
              <Link to={CODE_KIT_ROUTE} className="gaming-page__link">
                Developer Code Kit
              </Link>
            </p>
            <div className="gaming-page__kit-social" role="group" aria-label="Live channels and social">
              <a
                href={GAMING_TWITCH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gaming-page__social-chip btn-glass glass-effect-interactive glass-tint-cyan"
              >
                Twitch {GAMING_TWITCH_DISPLAY}
              </a>
              <a
                href={GAMING_INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gaming-page__social-chip btn-glass glass-effect-interactive gaming-page__social-chip--ig"
              >
                Instagram {GAMING_INSTAGRAM_HANDLE_DISPLAY}
              </a>
              <a
                href={GAMING_X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gaming-page__social-chip btn-glass glass-effect-interactive gaming-page__social-chip--x"
              >
                X {GAMING_X_WEB}
              </a>
            </div>
          </div>
        </GlassEffectContainer>
      </div>
    </>
  );
}
