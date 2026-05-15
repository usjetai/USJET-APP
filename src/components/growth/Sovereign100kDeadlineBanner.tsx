import { Link, useLocation } from "react-router-dom";
import { getDaysUntilUsa250 } from "../../lib/usa250Countdown";
import {
  SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY,
  SOVEREIGN_BLUEPRINT_PRICE_DISPLAY,
  SOVEREIGN_PRICE_DEADLINE_LABEL,
  SOVEREIGN_VAULT_ROUTE,
} from "../../data/sovereignBlueprint100k";

/** USA 250 institutional price deadline — shown across the fleet surface. */
export default function Sovereign100kDeadlineBanner() {
  const location = useLocation();
  const days = getDaysUntilUsa250();

  if (location.pathname === "/cockpit") {
    return null;
  }

  return (
    <aside className="sovereign-deadline-banner" aria-label="USA 250 protocol price deadline">
      <Link to={SOVEREIGN_VAULT_ROUTE} className="sovereign-deadline-banner__link">
        <span className="sovereign-deadline-banner__flag">USA 250</span>
        <span className="sovereign-deadline-banner__copy">
          <strong>{SOVEREIGN_BLUEPRINT_PRICE_DISPLAY}</strong> Volume I ends{" "}
          <strong>{SOVEREIGN_PRICE_DEADLINE_LABEL}</strong> · reprices to{" "}
          <strong>{SOVEREIGN_BLUEPRINT_FUTURE_PRICE_DISPLAY}</strong>
        </span>
        <span className="sovereign-deadline-banner__countdown">T−{days} days</span>
      </Link>
    </aside>
  );
}
