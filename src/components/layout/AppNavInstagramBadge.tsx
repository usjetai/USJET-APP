import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import {
  GAMING_INSTAGRAM_HANDLE_DISPLAY,
  GAMING_INSTAGRAM_PROFILE_URL,
} from "../../data/gamingInstagram";
import { wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";

const INSTAGRAM_COCKPIT = wrapExternalInCockpit(GAMING_INSTAGRAM_PROFILE_URL, {
  label: `Instagram ${GAMING_INSTAGRAM_HANDLE_DISPLAY}`,
  returnTo: "/",
  directHandoff: true,
});

/** Header Instagram chip — gradient badge → @usjet via cockpit handoff. */
export default function AppNavInstagramBadge() {
  return (
    <Link
      to={INSTAGRAM_COCKPIT}
      className="app-nav-instagram btn-glass glass-effect-interactive shrink-0"
      title={`Instagram ${GAMING_INSTAGRAM_HANDLE_DISPLAY}`}
      aria-label={`Instagram ${GAMING_INSTAGRAM_HANDLE_DISPLAY}`}
    >
      <span className="app-nav-instagram__halo" aria-hidden />
      <span className="app-nav-instagram__shine" aria-hidden />
      <span className="app-nav-instagram__icon" aria-hidden>
        <Instagram size={11} strokeWidth={2.4} />
      </span>
      <span className="app-nav-instagram__label">{GAMING_INSTAGRAM_HANDLE_DISPLAY}</span>
    </Link>
  );
}
