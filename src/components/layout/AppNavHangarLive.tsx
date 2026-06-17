import { HANGAR_LIVE_NAV_LABEL, HANGAR_LIVE_NAV_SHORT } from "../../data/liveHangar";
import { gamingHangarHashLink } from "../../data/gamingPortal";

/** Glowing pulse — jumps to Live Hangar on the Game page. */
export default function AppNavHangarLive() {
  return (
    <a
      href={gamingHangarHashLink()}
      className="app-nav-hangar-live btn-glass glass-effect-interactive shrink-0"
      title={`${HANGAR_LIVE_NAV_LABEL} — Game page live deck`}
      aria-label={`${HANGAR_LIVE_NAV_LABEL} — open Game page live Hangar`}
    >
      <span className="app-nav-hangar-live__glow" aria-hidden />
      <span className="app-nav-hangar-live__pulse" aria-hidden />
      <span className="app-nav-hangar-live__label app-nav-hangar-live__label--full">{HANGAR_LIVE_NAV_LABEL}</span>
      <span className="app-nav-hangar-live__label app-nav-hangar-live__label--short">{HANGAR_LIVE_NAV_SHORT}</span>
    </a>
  );
}
