import { Link } from "react-router-dom";
import GlassEffectContainer from "./GlassEffectContainer";
import Usa250Countdown from "./Usa250Countdown";
import { ORIGIN_CS_ROUTE } from "../../lib/memberAccessLevel";
import {
  mailtoUsjetOps,
  SUPPORT_POLICY,
  USJET_ENTITY_FOOTER,
  USJET_OPS_EMAIL,
} from "../../lib/usjetContact";

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
        <div className="usjet-global-contact-bar__meta">
          <p className="usjet-global-contact-bar__policy" title={`${SUPPORT_POLICY.primary}. ${SUPPORT_POLICY.email}.`}>
            <span>{SUPPORT_POLICY.primary}</span>
            <span className="usjet-global-contact-bar__policy-sep" aria-hidden>
              ·
            </span>
            <span>{SUPPORT_POLICY.email}</span>
          </p>
          <p className="usjet-global-contact-bar__entity">{USJET_ENTITY_FOOTER}</p>
        </div>
        <div className="usjet-global-contact-bar__actions">
          <Link
            to="/sos"
            className="usjet-global-contact-bar__cs btn-glass glass-effect-interactive glass-tint-cyan"
          >
            SOS
          </Link>
          <Link
            to={ORIGIN_CS_ROUTE}
            className="usjet-global-contact-bar__cs btn-glass glass-effect-interactive glass-tint-cyan"
          >
            Customer Service
          </Link>
          <a
            href={mailtoUsjetOps()}
            className="usjet-global-contact-bar__ops btn-glass glass-effect-interactive glass-tint-cyan"
            aria-label={`Email USJET operations at ${USJET_OPS_EMAIL}`}
          >
            {USJET_OPS_EMAIL}
          </a>
        </div>
      </GlassEffectContainer>
    </footer>
  );
}
