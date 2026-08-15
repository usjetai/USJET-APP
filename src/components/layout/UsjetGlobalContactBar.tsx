import { Link, NavLink } from "react-router-dom";
import UsjetWordmark from "../brand/UsjetWordmark";
import GlassEffectContainer from "./GlassEffectContainer";
import { ORIGIN_CS_ROUTE } from "../../lib/memberAccessLevel";
import { USJET_BUSINESS_ADDRESS_LINES } from "../../lib/usjetContact";
import { USJET_STORE_BOOKS, storeBookPath } from "../../data/usjetStore";

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

            <div className="usjet-footer__books-grid mt-8 flex flex-wrap justify-center gap-5">
              {USJET_STORE_BOOKS.map((book) => (
                <Link
                  key={book.id}
                  to={storeBookPath(book.id)}
                  className="usjet-footer__book-link overflow-hidden rounded-lg border border-white/10 transition-transform hover:scale-110 glass-effect-interactive"
                  aria-label={`${book.title} — open Store`}
                  style={{ width: '100px', flexShrink: 0 }}
                >
                  <img
                    src={book.coverSrc}
                    alt=""
                    className="usjet-footer__book-cover w-full aspect-[5/8] object-cover opacity-80 hover:opacity-100 transition-opacity shadow-lg"
                    loading="lazy"
                  />
                </Link>
              ))}
            </div>
          </div>

          <nav className="usjet-footer__col" aria-label="Platform">
            <h2 className="usjet-footer__heading">Rigs</h2>
            <NavLink to="/" end className={footerLinkClass}>
              Hangar · Home
            </NavLink>
            <NavLink to="/fleet" className={footerLinkClass}>
              Fleet · Business
            </NavLink>
            <NavLink to="/store/ai-computers" className={footerLinkClass}>
              Full lineup
            </NavLink>
            <NavLink to="/store" className={footerLinkClass}>
              Manuals
            </NavLink>
            <NavLink to="/ai-101" className={footerLinkClass}>
              How local AI works
            </NavLink>
            <NavLink to="/special" className={footerLinkClass}>
              Pricing
            </NavLink>
          </nav>

          <nav className="usjet-footer__col" aria-label="Business">
            <h2 className="usjet-footer__heading">Ship</h2>
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
          <p className="usjet-footer__copy">© {YEAR} USJET.AI · All rights reserved</p>
          <p className="usjet-footer__legal-note">One Ship · One Cockpit · Stripe-cleared members only</p>
        </div>
      </GlassEffectContainer>
    </footer>
  );
}
