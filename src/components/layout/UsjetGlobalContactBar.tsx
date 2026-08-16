import { Link, NavLink } from "react-router-dom";
import UsjetWordmark from "../brand/UsjetWordmark";
import GlassEffectContainer from "./GlassEffectContainer";
import { USJET_BUSINESS_ADDRESS_LINES, mailtoUsjetOps } from "../../lib/usjetContact";

const YEAR = new Date().getFullYear();

function footerLinkClass({ isActive }: { isActive: boolean }) {
  return ["usjet-footer__link", isActive ? "usjet-footer__link--active" : ""].filter(Boolean).join(" ");
}

/** Document-flow site footer — four equal columns, liquid glass shell. */
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
              AI computers for homes and businesses — the Operator&apos;s Rig, not a chatbot tab.
            </p>
            <address className="usjet-footer__address">
              {USJET_BUSINESS_ADDRESS_LINES.map((line) => (
                <span key={line} className="usjet-footer__address-line">
                  {line}
                </span>
              ))}
            </address>
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

          <nav className="usjet-footer__col" aria-label="Shop">
            <h2 className="usjet-footer__heading">Shop</h2>
            <NavLink to="/" end className={footerLinkClass}>
              Homes
            </NavLink>
            <NavLink to="/fleet" className={footerLinkClass}>
              Business
            </NavLink>
            <NavLink to="/store/ai-computers" className={footerLinkClass}>
              Full lineup
            </NavLink>
            <NavLink to="/compare" className={footerLinkClass}>
              Compare
            </NavLink>
          </nav>

          <nav className="usjet-footer__col" aria-label="Company">
            <h2 className="usjet-footer__heading">Company</h2>
            <NavLink to="/blog" className={footerLinkClass}>
              Operator Log
            </NavLink>
            <NavLink to="/ai-101" className={footerLinkClass}>
              AI 101
            </NavLink>
            <NavLink to="/sos" className={footerLinkClass}>
              Help
            </NavLink>
            <a href={mailtoUsjetOps()} className="usjet-footer__link">
              Customer Service
            </a>
          </nav>

          <nav className="usjet-footer__col" aria-label="Legal">
            <h2 className="usjet-footer__heading">Legal</h2>
            <NavLink to="/privacy" className={footerLinkClass}>
              Privacy
            </NavLink>
            <NavLink to="/terms" className={footerLinkClass}>
              Terms
            </NavLink>
          </nav>
        </div>

        <div className="usjet-footer__legal">
          <p className="usjet-footer__copy">© {YEAR} USJET.AI · All rights reserved</p>
          <p className="usjet-footer__legal-note">AI computers for homes and businesses — one-time purchase, Stripe checkout.</p>
        </div>
      </GlassEffectContainer>
    </footer>
  );
}
