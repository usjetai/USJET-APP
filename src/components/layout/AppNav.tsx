import { NavLink, Link } from "react-router-dom";
import UsjetWordmark from "../brand/UsjetWordmark";
import AppNavPhoneBadge from "./AppNavPhoneBadge";

/** Instagram header badge was retired from the nav (not linked anywhere
 * else on the site) — AppNavInstagramBadge.tsx is left in place, unused,
 * in case it's wanted again (e.g. in a footer). */

/** Tier names confirmed 2 Sep 2026: Solo (one person, one desk), Crew (a shop
 * or office sharing one rig). Fleet (several machines) is reserved and not yet
 * offered, so it has no nav entry. The routes didn't change — only the labels. */
const NAV_LINKS = [
  { to: "/", label: "Solo", title: "Operator's Rig — Solo: one person, one desk" },
  { to: "/fleet", label: "Crew", title: "Operator's Rig — Crew: a shop or office sharing one rig" },
  { to: "/store", label: "Manuals", title: "The manual set that ships with every rig" },
  { to: "/blog", label: "Log", title: "Operator log" },
] as const;

const navPillClass = (isActive: boolean) =>
  [
    "app-nav-pill btn-glass glass-effect-interactive shrink-0",
    isActive ? "app-nav-pill--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

const AppNav = () => {
  return (
    <header className="liquid-glass-nav sticky top-0 z-50 mx-auto w-full max-w-[min(100vw-1.25rem,72rem)] px-2 sm:max-w-none sm:px-4">
      <div className="app-nav-shell" aria-label="USJET primary navigation">
        <div className="app-nav-body">
          <div className="app-nav-row app-nav-row--primary">
            <div className="app-nav-zone app-nav-zone--brand">
              <Link to="/" className="nav-brand-usjet shrink-0" aria-label="USJet.ai home">
                <UsjetWordmark size="nav" />
              </Link>
            </div>

            <span className="app-nav-divider" aria-hidden />

            <nav className="app-nav-zone app-nav-zone--routes" aria-label="Primary navigation">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  title={link.title}
                  className={({ isActive }) => navPillClass(isActive)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="app-nav-zone app-nav-zone--social">
              <AppNavPhoneBadge />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppNav;
