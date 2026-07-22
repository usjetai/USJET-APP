import { Link } from "react-router-dom";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { mailtoUsjetOps } from "../../lib/usjetContact";

const INSTITUTIONAL_MAILTO = mailtoUsjetOps("Intel — institutional / strategic partnership inquiry");

/**
 * Intel bottom deck — institutional invite (not ad inventory). Hold line: no live partner APIs;
 * OPS email + internal SOS only (integrated nav).
 */
export default function IntelPartnershipInvite() {
  return (
    <section className="intel-partnership-invite-section" aria-labelledby="intel-partnership-invite-heading">
      <GlassEffectContainer className="intel-partnership-invite-section__container">
        <div className="intel-partnership-invite liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan">
          <p className="intel-partnership-invite__eyebrow">Publisher · platform owner</p>
          <h2 id="intel-partnership-invite-heading" className="intel-partnership-invite__headline">
            Corporate invite — reserved Intel placement
          </h2>
          <p className="intel-partnership-invite__body">
            Strategic integration partners lease prime digital real estate inside the fleet command center — retainer and placement, not affiliate rows. If your institution wants a sovereign seat at this table, route through OPS with a clear mandate and clearance contact.
          </p>
          <div className="intel-partnership-invite__actions">
            <a
              href={INSTITUTIONAL_MAILTO}
              className="intel-partnership-invite__primary btn-glass glass-effect-interactive"
            >
              Email OPS — institutional lane
            </a>
            <Link to="/sos" className="intel-partnership-invite__secondary btn-glass glass-effect-interactive">
              Human operating window (SOS)
            </Link>
          </div>
          <p className="intel-partnership-invite__note">
            Reserved bays display mock telemetry only — no live exchange handoff in this build.
          </p>
        </div>
      </GlassEffectContainer>
      <p className="intel-partnership-invite-section__footer">
        <a href={INSTITUTIONAL_MAILTO} className="intel-partnership-invite-section__footer-link glass-effect-interactive">
          Institutional Inquiries & Strategic Partnerships
        </a>
      </p>
    </section>
  );
}
