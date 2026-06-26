import { Link, NavLink } from "react-router-dom";
import UsjetWordmark from "../brand/UsjetWordmark";
import GlassEffectContainer from "./GlassEffectContainer";
import { ORIGIN_CS_ROUTE } from "../../lib/memberAccessLevel";

const FOOTER_TEXT_LINK = "footer-text-link";
const FOOTER_TEXT_LINK_PINK = "footer-text-link footer-text-link--pink";

/** Document-flow bottom strip — professional plain text links. USJET House is pink. */
export default function UsjetGlobalContactBar() {
  return (
    <footer className="usjet-global-contact-bar" aria-label="USJET site status and quick links">
      <GlassEffectContainer className="usjet-global-contact-bar__shell liquid-glass-background glass-effect glass-effect--capsule glass-tint-cyan">
        <div className="usjet-global-contact-bar__row usjet-global-contact-bar__row--head">
          <Link to="/" className="usjet-global-contact-bar__brand" aria-label="USJet.ai home">
            <UsjetWordmark size="nav" glow />
          </Link>

          <div className="usjet-global-contact-bar__status-rail" aria-label="USJET live status">
            <div className="usjet-global-contact-bar__status">
              <span className="usjet-global-contact-bar__status-label usjet-global-contact-bar__status-label--full">
                USJET System Active
              </span>
              <span className="usjet-global-contact-bar__status-label usjet-global-contact-bar__status-label--short">
                System Active
              </span>
              <span className="usjet-global-contact-bar__ping" aria-hidden />
            </div>
          </div>

          <div className="usjet-global-contact-bar__support">
            <Link to="/sos" className={FOOTER_TEXT_LINK}>SOS</Link>
            <Link to="/privacy" className={FOOTER_TEXT_LINK}>Privacy</Link>
            <Link to={ORIGIN_CS_ROUTE} className={FOOTER_TEXT_LINK}>Customer Service</Link>
          </div>
        </div>

        <nav className="usjet-global-contact-bar__row usjet-global-contact-bar__row--lanes" aria-label="USJET quick links">
          <NavLink to="/hired-hud" className={FOOTER_TEXT_LINK_PINK}>USJET House</NavLink>
          <Link to="/b2b" className={FOOTER_TEXT_LINK}>B2B</Link>
          <Link to="/b2k" className={FOOTER_TEXT_LINK}>B2K</Link>
          <Link to="/pdre" className={FOOTER_TEXT_LINK}>PDRE</Link>
          <Link to="/blog" className={FOOTER_TEXT_LINK}>Blog</Link>
          <Link to="/intelligence" className={FOOTER_TEXT_LINK}>Intel</Link>
          <Link to="/fleet-manual" className={FOOTER_TEXT_LINK}>Fleet Manual</Link>
          <Link to="/100k" className={FOOTER_TEXT_LINK}>100K</Link>
          <Link to="/founders-fuel" className={FOOTER_TEXT_LINK}>Fuel</Link>
          <Link to="/zelle" className={FOOTER_TEXT_LINK}>Zelle</Link>
          <Link to="/licensing" className={FOOTER_TEXT_LINK}>Licensing</Link>
        </nav>
      </GlassEffectContainer>
    </footer>
  );
}
