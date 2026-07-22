import { Link, NavLink } from "react-router-dom";
import UsjetWordmark from "../brand/UsjetWordmark";
import GlassEffectContainer from "./GlassEffectContainer";
import { ORIGIN_CS_ROUTE } from "../../lib/memberAccessLevel";

const YEAR = new Date().getFullYear();

function footerLinkClass({ isActive }: { isActive: boolean }) {
  return ["usjet-footer__link", isActive ? "usjet-footer__link--active" : ""].filter(Boolean).join(" ");
}

/** Document-flow site footer — professional link columns, liquid glass shell. */
export default function UsjetGlobalContactBar() {
  return (
    <footer className="usjet-global-contact-bar" aria-label="USJET site footer">
      <GlassEffectContainer className="usjet-global-contact-bar__shell liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan">
        <div className="usjet-footer__grid">
          <div className="usjet-footer__brand-col">
            <Link to="/" className="usjet-global-contact-bar__brand" aria-label="USJet.ai home">
              <UsjetWordmark size="nav" glow />
            </Link>
            <p className="usjet-footer__tagline">
              Sovereign workbench for America&apos;s labor force — grit into gold.
            </p>
            <div className="usjet-global-contact-bar__status" aria-label="USJET live status">
              <span className="usjet-global-contact-bar__status-label usjet-global-contact-bar__status-label--full">
                System Active
              </span>
              <span className="usjet-global-contact-bar__status-label usjet-global-contact-bar__status-label--short">
                Active
              </span>
              <span className="usjet-global-contact-bar__ping" aria-hidden />
            </div>
          </div>

          <nav className="usjet-footer__col" aria-label="Platform">
            <h2 className="usjet-footer__heading">Platform</h2>
            <NavLink to="/" end className={footerLinkClass}>
              Hangar
            </NavLink>
            <NavLink to="/fleet" className={footerLinkClass}>
              Fleet
            </NavLink>
            <NavLink to="/intelligence" className={footerLinkClass}>
              Intel
            </NavLink>
            <NavLink to="/jet-browser" className={footerLinkClass}>
              Jet Browser
            </NavLink>
            <NavLink to="/blog" className={footerLinkClass}>
              Blog
            </NavLink>
            <NavLink to="/fleet-manual" className={footerLinkClass}>
              Fleet Manual
            </NavLink>
          </nav>

          <nav className="usjet-footer__col" aria-label="Business">
            <h2 className="usjet-footer__heading">Business</h2>
            <NavLink to="/b2k" className={footerLinkClass}>
              B2K
            </NavLink>
            <NavLink to="/pdre" className={footerLinkClass}>
              PDRE
            </NavLink>
            <NavLink to="/licensing" className={footerLinkClass}>
              Licensing
            </NavLink>
            <NavLink to="/founders-fuel" className={footerLinkClass}>
              Fuel
            </NavLink>
            <NavLink to="/zelle" className={footerLinkClass}>
              Zelle
            </NavLink>
            <NavLink
              to="/hired-hud"
              className={({ isActive }) =>
                ["usjet-footer__link", "usjet-footer__link--house", isActive ? "usjet-footer__link--active" : ""]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              USJET House
            </NavLink>
          </nav>

          <nav className="usjet-footer__col" aria-label="Support">
            <h2 className="usjet-footer__heading">Support</h2>
            <NavLink to="/sos" className={footerLinkClass}>
              Help
            </NavLink>
            <NavLink to="/privacy" className={footerLinkClass}>
              Privacy
            </NavLink>
            <NavLink to={ORIGIN_CS_ROUTE} className={footerLinkClass}>
              Customer Service
            </NavLink>
            <NavLink to="/ai-101" className={footerLinkClass}>
              AI 101
            </NavLink>
            <NavLink to="/member" className={footerLinkClass}>
              Member
            </NavLink>
          </nav>
        </div>

        <div className="usjet-footer__legal">
          <p className="usjet-footer__copy">
            © {YEAR} USJET.AI · All rights reserved
          </p>
          <p className="usjet-footer__legal-note">One Ship · One Cockpit · Stripe-cleared members only</p>
        </div>
      </GlassEffectContainer>
    </footer>
  );
}
