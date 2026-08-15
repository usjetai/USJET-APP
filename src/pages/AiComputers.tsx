import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Home } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  HARDWARE_AUDIENCE_META,
  HARDWARE_HERO_KICKER,
  HARDWARE_HERO_LEDE,
  HARDWARE_HERO_TITLE,
  hardwareProductsByAudience,
} from "../data/aiHardware";

const AUDIENCE_ICONS = {
  home: Home,
  business: Building2,
} as const;

export default function AiComputers() {
  useEffect(() => {
    const previous = document.title;
    document.title = "AI Computers · Homes & Businesses · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", HARDWARE_HERO_LEDE);
    return () => {
      document.title = previous;
      meta?.setAttribute("content", previousDescription);
    };
  }, []);

  return (
    <div className="usjet-store-page hw-page page-atmosphere page-nav-offset mx-auto max-w-5xl px-4 pb-32 pt-4 sm:px-6 lg:px-8">
      <header className="usjet-store__hero hw-hero">
        <p className="usjet-store__kicker">{HARDWARE_HERO_KICKER}</p>
        <h1 className="usjet-store__title usjet-logo-stone">{HARDWARE_HERO_TITLE}</h1>
        <p className="usjet-store__lede">{HARDWARE_HERO_LEDE}</p>
      </header>

      <p className="hw-page__fulfillment-note">
        Pick Homes or Businesses. No SKU sits on both pages. We buy the exact unit, put a Jarvis on it, and ship it.
      </p>

      <div className="hw-hub-grid">
        {(Object.keys(HARDWARE_AUDIENCE_META) as Array<keyof typeof HARDWARE_AUDIENCE_META>).map((audience) => {
          const meta = HARDWARE_AUDIENCE_META[audience];
          const Icon = AUDIENCE_ICONS[audience];
          const count = hardwareProductsByAudience(audience).length;
          return (
            <GlassEffectContainer
              key={audience}
              className="hw-hub-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
            >
              <Icon size={28} aria-hidden className="hw-hub-card__icon" />
              <h2 className="hw-hub-card__title">{meta.label}</h2>
              <p className="hw-hub-card__lede">{meta.lede}</p>
              <p className="hw-hub-card__count">{count} machines</p>
              <Link to={meta.route} className="hw-hub-card__cta btn-glass-prominent glass-effect-interactive">
                Shop {meta.label}
                <ArrowRight size={14} className="ml-2" aria-hidden />
              </Link>
            </GlassEffectContainer>
          );
        })}
      </div>

      <p className="usjet-store__return">
        <Link to="/store" className="glass-effect-interactive">
          Back to Manuals
        </Link>
      </p>
    </div>
  );
}
