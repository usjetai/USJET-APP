import { Link } from "react-router-dom";
import UsjetWordmark from "../brand/UsjetWordmark";
import AircraftIcon from "../icons/AircraftIcons";
import GlassEffectContainer from "./GlassEffectContainer";
import Usa250Countdown from "./Usa250Countdown";
import { ORIGIN_CS_ROUTE } from "../../lib/memberAccessLevel";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../../lib/usjetContact";

/** Fixed bottom strip — home, jet, status, USA 250, SOS (emergency blink), CS/OPS (periodic shine). */
export default function UsjetGlobalContactBar() {
  return (
    <footer className="usjet-global-contact-bar" aria-label="USJET site status and quick links">
      <GlassEffectContainer className="usjet-global-contact-bar__shell liquid-glass-background glass-effect glass-effect--capsule glass-tint-cyan">
        <div className="usjet-global-contact-bar__start">
          <span className="usjet-global-contact-bar__jet" aria-hidden>
            <AircraftIcon aircraftType="f22" accentId="footer-corner-f22" className="usjet-global-contact-bar__jet-icon" />
          </span>
          <Link
            to="/"
            className="usjet-global-contact-bar__brand btn-glass glass-effect-interactive"
            aria-label="USJet.ai home"
          >
            <UsjetWordmark size="nav" glow />
          </Link>
        </div>

        <div className="usjet-global-contact-bar__tail">
          <div className="usjet-global-contact-bar__status">
            <span className="usjet-global-contact-bar__status-label">USJET System Active</span>
            <span className="usjet-global-contact-bar__ping" aria-hidden />
          </div>
          <Usa250Countdown variant="footerStrip" />
          <Link to="/sos" className="usjet-global-contact-bar__sos btn-glass glass-effect-interactive">
            SOS
          </Link>
          <Link
            to={ORIGIN_CS_ROUTE}
            className="usjet-global-contact-bar__cs btn-glass glass-effect-interactive glass-tint-cyan"
          >
            <span className="usjet-global-contact-bar__cs-label">Customer Service</span>
          </Link>
          <a
            href={mailtoUsjetOps()}
            className="usjet-global-contact-bar__ops btn-glass glass-effect-interactive glass-tint-cyan"
            aria-label={`Email USJET operations at ${USJET_OPS_EMAIL}`}
          >
            <span className="usjet-global-contact-bar__ops-label">{USJET_OPS_EMAIL}</span>
          </a>
        </div>
      </GlassEffectContainer>
    </footer>
  );
}
