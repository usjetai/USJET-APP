import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import UsjetStarEmblem from "../components/brand/UsjetStarEmblem";
import DirectFuelCashButton from "../components/fuel/DirectFuelCashButton";
import ZelleFuelChip from "../components/fuel/ZelleFuelChip";
import SupporterWall from "../components/fuel/SupporterWall";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  DIRECT_FUEL_HOOK,
  DIRECT_FUEL_IMPACT,
  DIRECT_FUEL_INCENTIVE,
  DIRECT_FUEL_RECOGNITION,
  DIRECT_FUEL_TAGLINE,
  DIRECT_FUEL_TITLE,
  DIRECT_FUEL_TRANSPARENCY,
  USJET_CASH_APP_URL,
} from "../data/directFuelCash";

export default function DirectFuel() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Direct Fuel · Cash App $USJET · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Fuel USJET directly via Cash App $USJET. First Responders Wall — early patrons get recognized as the fleet scales.",
    );
    document.documentElement.classList.add("direct-fuel-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("direct-fuel-page-root");
    };
  }, []);

  return (
    <div className="direct-fuel-page page-atmosphere page-nav-offset mx-auto max-w-4xl px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <div className="direct-fuel-page__star-wrap" aria-hidden>
        <UsjetStarEmblem className="direct-fuel-page__star" decorative />
      </div>

      <header className="direct-fuel-page__hero text-center">
        <p className="direct-fuel-page__eyebrow">
          <Flame size={14} aria-hidden />
          {DIRECT_FUEL_TAGLINE}
        </p>
        <h1 className="direct-fuel-page__title">{DIRECT_FUEL_TITLE}</h1>
        <p className="direct-fuel-page__hook">{DIRECT_FUEL_HOOK}</p>
      </header>

      <div className="direct-fuel-page__cta-wrap">
        <DirectFuelCashButton variant="hero" />
        <div className="direct-fuel-page__zelle-wrap">
          <ZelleFuelChip variant="hero" />
        </div>
        <p className="direct-fuel-page__cta-note">
          Opens{" "}
          <a href={USJET_CASH_APP_URL} target="_blank" rel="noopener noreferrer" className="direct-fuel-page__link">
            cash.app/$USJET
          </a>{" "}
          — add your Cash App handle in the payment note.
        </p>
      </div>

      <GlassEffectContainer className="direct-fuel-page__copy glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="direct-fuel-page__copy-inner">
          <article className="direct-fuel-page__block">
            <h2 className="direct-fuel-page__block-title">Direct impact</h2>
            <p>{DIRECT_FUEL_IMPACT}</p>
          </article>
          <article className="direct-fuel-page__block">
            <h2 className="direct-fuel-page__block-title">The recognition loop</h2>
            <p>{DIRECT_FUEL_RECOGNITION}</p>
          </article>
          <article className="direct-fuel-page__block">
            <h2 className="direct-fuel-page__block-title">Transparency</h2>
            <p>{DIRECT_FUEL_TRANSPARENCY}</p>
          </article>
          <article className="direct-fuel-page__block direct-fuel-page__block--incentive">
            <h2 className="direct-fuel-page__block-title">Why latecomers fuel you back</h2>
            <p>{DIRECT_FUEL_INCENTIVE}</p>
          </article>
        </div>
      </GlassEffectContainer>

      <SupporterWall />

      <p className="direct-fuel-page__footer-links">
        Prefer Stripe tiers?{" "}
        <Link to="/founders-fuel" className="direct-fuel-page__link">
          Founder&apos;s Fuel
        </Link>{" "}
        ·{" "}
        <Link to="/support-fleet" className="direct-fuel-page__link">
          Support the Fleet
        </Link>{" "}
        ·{" "}
        <Link to="/founder" className="direct-fuel-page__link">
          Founder story
        </Link>
      </p>
    </div>
  );
}
