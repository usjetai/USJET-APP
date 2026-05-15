import { Link } from "react-router-dom";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { getDaysUntilUsa250 } from "../../lib/usa250Countdown";
import {
  SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY,
  SOVEREIGN_BLUEPRINT_PRICE_DISPLAY,
  SOVEREIGN_PRICE_DEADLINE_BODY,
  SOVEREIGN_PRICE_DEADLINE_HEADLINE,
  SOVEREIGN_PRICE_DEADLINE_LABEL,
  SOVEREIGN_VAULT_ROUTE,
} from "../../data/sovereignBlueprint100k";

export default function Sovereign100kDeadlineHero() {
  const days = getDaysUntilUsa250();

  return (
    <GlassEffectContainer className="sovereign-deadline-hero glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
      <div className="sovereign-deadline-hero__inner">
        <p className="sovereign-deadline-hero__kicker">Founding floor · deadline absolute</p>
        <h2 className="sovereign-deadline-hero__title">{SOVEREIGN_PRICE_DEADLINE_HEADLINE}</h2>
        <p className="sovereign-deadline-hero__body">{SOVEREIGN_PRICE_DEADLINE_BODY}</p>
        <div className="sovereign-deadline-hero__prices">
          <span className="sovereign-deadline-hero__now">{SOVEREIGN_BLUEPRINT_PRICE_DISPLAY} today</span>
          <span className="sovereign-deadline-hero__arrow" aria-hidden>
            →
          </span>
          <span className="sovereign-deadline-hero__then">{SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY} on {SOVEREIGN_PRICE_DEADLINE_LABEL}</span>
        </div>
        <p className="sovereign-deadline-hero__countdown">
          T−<span className="sovereign-deadline-hero__days">{days}</span> days to USA 250
        </p>
        <Link to={SOVEREIGN_VAULT_ROUTE} className="sovereign-deadline-hero__cta btn-glass glass-effect-interactive">
          Enter the vault before repricing
        </Link>
      </div>
    </GlassEffectContainer>
  );
}
