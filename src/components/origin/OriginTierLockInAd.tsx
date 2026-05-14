import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import {
  ORIGIN_TIER_FUTURE_PRICE_DISPLAY,
  ORIGIN_TIER_LOCK_DEADLINE_LABEL,
  ORIGIN_TIER_LOCK_PRICE_DISPLAY,
  ORIGIN_TIER_LOCK_YEAR_NOTE,
} from "../../data/originTierPromo";
import { getDaysUntilUsa250 } from "../../lib/usa250Countdown";

const ENTERPRISE_CHECKOUT_PATH = "/special?tier=fleet-command";

type PriceBlockProps = {
  label: string;
  price: string;
  note: string;
  variant: "now" | "future";
};

function PriceBlock({ label, price, note, variant }: PriceBlockProps) {
  const blockClass =
    variant === "future"
      ? "origin-tier-lock-in-ad__price-block origin-tier-lock-in-ad__price-block--future"
      : "origin-tier-lock-in-ad__price-block";
  const priceClass =
    variant === "future" ? "origin-tier-lock-in-ad__price-future" : "origin-tier-lock-in-ad__price-now";

  return (
    <div className={blockClass}>
      <span className="origin-tier-lock-in-ad__price-label">{label}</span>
      <span className={priceClass}>
        {price}
        <span className="origin-tier-lock-in-ad__price-period">/mo</span>
      </span>
      <span className="origin-tier-lock-in-ad__price-note">{note}</span>
    </div>
  );
}

export default function OriginTierLockInAd() {
  const [daysLeft, setDaysLeft] = useState(() => getDaysUntilUsa250());

  useEffect(() => {
    const refresh = () => setDaysLeft(getDaysUntilUsa250());
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="origin-tier-lock-in-ad" aria-labelledby="origin-tier-lock-in-heading">
      <GlassEffectContainer className="origin-tier-lock-in-ad__glass glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan flex-col items-stretch gap-0 p-0">
        <span className="origin-tier-lock-in-ad__glow" aria-hidden />
        <span className="origin-tier-lock-in-ad__glow origin-tier-lock-in-ad__glow--gold" aria-hidden />

        <header className="origin-tier-lock-in-ad__head">
          <p className="origin-tier-lock-in-ad__kicker">
            <Sparkles size={12} aria-hidden />
            USA 250 · Origin command tier
          </p>
          <h2 id="origin-tier-lock-in-heading" className="origin-tier-lock-in-ad__title">
            Why Origin commands {ORIGIN_TIER_LOCK_PRICE_DISPLAY}
          </h2>
          <p className="origin-tier-lock-in-ad__lede">
            Enterprise Fleet Commander is the only clearance that seats you at Bay 30 — Aura orchestrates all
            twenty-nine partner AIs, issues flight plans, and holds institutional Intel at command authority.
            One cockpit. Zero vendor silos. Crew-scale sovereignty.
          </p>
        </header>

        <div className="origin-tier-lock-in-ad__body">
          <p className="origin-tier-lock-in-ad__countdown" aria-live="polite">
            <span className="origin-tier-lock-in-ad__countdown-label">T-minus</span>
            <span className="origin-tier-lock-in-ad__countdown-days">{daysLeft}</span>
            <span className="origin-tier-lock-in-ad__countdown-label">
              days to {ORIGIN_TIER_LOCK_DEADLINE_LABEL}
            </span>
          </p>

          <div className="origin-tier-lock-in-ad__price-row">
            <PriceBlock
              label="Lock today"
              price={ORIGIN_TIER_LOCK_PRICE_DISPLAY}
              note="One-year rate hold"
              variant="now"
            />
            <div className="origin-tier-lock-in-ad__price-arrow" aria-hidden>
              →
            </div>
            <PriceBlock
              label={`After ${ORIGIN_TIER_LOCK_DEADLINE_LABEL}`}
              price={ORIGIN_TIER_FUTURE_PRICE_DISPLAY}
              note="USA Anniversary Day · USA 250"
              variant="future"
            />
          </div>
        </div>

        <footer className="origin-tier-lock-in-ad__footer">
          <Link
            to={ENTERPRISE_CHECKOUT_PATH}
            className="origin-tier-lock-in-ad__cta btn-glass-prominent glass-effect-interactive"
          >
            Lock in Enterprise Commander
          </Link>
          <p className="origin-tier-lock-in-ad__fine">{ORIGIN_TIER_LOCK_YEAR_NOTE}</p>
        </footer>
      </GlassEffectContainer>
    </section>
  );
}