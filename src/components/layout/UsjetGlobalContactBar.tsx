import GlassEffectContainer from "./GlassEffectContainer";
import Usa250Countdown from "./Usa250Countdown";
import { mailtoUsjetOps, USJET_OPS_EMAIL } from "../../lib/usjetContact";

/** Fixed liquid-glass strip — ops inbox on every route (including cockpit). */
export default function UsjetGlobalContactBar() {
  return (
    <footer className="usjet-global-contact-bar" aria-label="Site status and operations contact">
      <GlassEffectContainer className="usjet-global-contact-bar__shell liquid-glass-background glass-effect glass-effect--capsule glass-tint-cyan">
        <div className="usjet-global-contact-bar__status" aria-hidden>
          <span className="usjet-global-contact-bar__ping" />
          <span>USJET System Active</span>
        </div>
        <Usa250Countdown />
        <a
          href={mailtoUsjetOps()}
          className="usjet-global-contact-bar__ops btn-glass glass-effect-interactive glass-tint-cyan"
          aria-label={`Email USJET operations at ${USJET_OPS_EMAIL}`}
        >
          {USJET_OPS_EMAIL}
        </a>
      </GlassEffectContainer>
    </footer>
  );
}
