import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Zap } from "lucide-react";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import FoundersFuelCheckoutCard from "../components/growth/FoundersFuelCheckoutCard";
import FleetStatusShare from "../components/growth/FleetStatusShare";
import LiveFuelActivityToast from "../components/growth/LiveFuelActivityToast";
import RevenueValueLadder from "../components/growth/RevenueValueLadder";
import { FOUNDERS_FUEL_SOCIAL_PROOF } from "../data/foundersFuel";
import { FLEET_MANUAL_PRICE_DISPLAY, FLEET_MANUAL_ROUTE } from "../data/fleetManual2500";
import { SOVEREIGN_PRICE_DEADLINE_SHORT, SOVEREIGN_VAULT_ROUTE } from "../data/sovereignBlueprint100k";

function useSprintCountdown() {
  const target = useMemo(() => {
    const end = new Date();
    end.setHours(end.getHours() + 15, end.getMinutes(), end.getSeconds(), 0);
    return end.getTime();
  }, []);

  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  return { hours, minutes, seconds };
}

export default function FoundersFuel() {
  const countdown = useSprintCountdown();

  useEffect(() => {
    const prev = document.title;
    document.title = "Founder's Fuel — Fuel the Fleet · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Fuel the USJET fleet for $19.90/mo. Fund the next dev sprint and unlock early access to the 30-AI Intel dashboard.",
    );
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="founders-fuel-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-2 sm:px-6 lg:px-8">
      <LiveFuelActivityToast enabled />

      <header className="founders-fuel-page__hero mb-10 text-center sm:mb-12">
        <p className="founders-fuel-page__eyebrow">Hustle protocol · hunger-to-code engine</p>
        <h1 className="founders-fuel-page__title">
          Founder&apos;s <span className="founders-fuel-page__title-accent">Fuel</span>
        </h1>
        <p className="founders-fuel-page__lede mx-auto max-w-2xl text-pretty">
          We&apos;re pivoting from building to acquiring. Fifty fuels at $19.90 fills the fridge and funds the next
          15-hour dev sprint — the community keeps the code moving.
        </p>

        <GlassEffectContainer className="founders-fuel-page__countdown glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <div className="founders-fuel-page__countdown-inner">
            <Clock size={16} aria-hidden />
            <span className="founders-fuel-page__countdown-label">Sprint window</span>
            <span className="founders-fuel-page__countdown-time">
              {String(countdown.hours).padStart(2, "0")}:{String(countdown.minutes).padStart(2, "0")}:
              {String(countdown.seconds).padStart(2, "0")}
            </span>
          </div>
        </GlassEffectContainer>
      </header>

      <RevenueValueLadder active="fuel" />

      <div className="founders-fuel-page__grid">
        <div className="founders-fuel-page__main">
          <FoundersFuelCheckoutCard />
        </div>
        <aside className="founders-fuel-page__aside">
          <GlassEffectContainer className="founders-fuel-page__proof glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
            <div className="founders-fuel-page__proof-inner">
              <p className="founders-fuel-page__proof-kicker">
                <Users size={14} aria-hidden /> Social proof
              </p>
              <ul className="founders-fuel-page__quotes">
                {FOUNDERS_FUEL_SOCIAL_PROOF.map((item) => (
                  <li key={item.attribution}>
                    <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
                    <cite>{item.attribution}</cite>
                  </li>
                ))}
              </ul>
            </div>
          </GlassEffectContainer>

          <GlassEffectContainer className="founders-fuel-page__share glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
            <div className="founders-fuel-page__share-inner">
              <p className="founders-fuel-page__share-kicker">
                <Zap size={14} aria-hidden /> Traffic loop
              </p>
              <p className="founders-fuel-page__share-copy">
                Post your fleet status — auto-generated card with live fuel metrics for X / LinkedIn.
              </p>
              <FleetStatusShare />
            </div>
          </GlassEffectContainer>
        </aside>
      </div>

      <p className="founders-fuel-page__footer-links mt-10 text-center">
        <Link to="/fleet-directory" className="founders-fuel-page__link glass-effect-interactive">
          Fleet Directory (SEO)
        </Link>
        {" · "}
        <Link to="/support-fleet" className="founders-fuel-page__link glass-effect-interactive">
          Support the Fleet
        </Link>
        {" · "}
        <Link to={FLEET_MANUAL_ROUTE} className="founders-fuel-page__link glass-effect-interactive">
          Fleet Manual ({FLEET_MANUAL_PRICE_DISPLAY})
        </Link>
        {" · "}
        <Link to={SOVEREIGN_VAULT_ROUTE} className="founders-fuel-page__link glass-effect-interactive">
          Sovereign Vault ({SOVEREIGN_PRICE_DEADLINE_SHORT})
        </Link>
        {" · "}
        <Link to="/" className="founders-fuel-page__link glass-effect-interactive">
          Fleet home
        </Link>
      </p>
    </div>
  );
}
