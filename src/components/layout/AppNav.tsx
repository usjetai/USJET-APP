import { NavLink, Link } from "react-router-dom";
import UsjetWordmark from "../brand/UsjetWordmark";
import AppNavInstagramBadge from "./AppNavInstagramBadge";
import AppNavPhoneBadge from "./AppNavPhoneBadge";

const NAV_LINKS = [
  { to: "/", label: "Homes", title: "Home AI computers" },
  { to: "/business", label: "Business", title: "Business AI computers" },
  { to: "/store", label: "Manuals", title: "AI Book Series" },
  { to: "/blog", label: "Log", title: "Operator Log" },
  { to: "/about", label: "About", title: "Ameer Karim · USJET LLC" },
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

            <nav className="app-nav-zone app-nav-zone--routes" aria-label="Shop">
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
              <AppNavInstagramBadge />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppNav;
