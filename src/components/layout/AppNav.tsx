import { NavLink, Link } from "react-router-dom";
import UsjetWordmark from "../brand/UsjetWordmark";
import GlassEffectContainer from "./GlassEffectContainer";
import AppNavInstagramBadge from "./AppNavInstagramBadge";
import { useMemberAuth } from "../../context/MemberAuthContext";
import OriginGateLink from "../origin/OriginGateLink";
import { canMemberAccessRoute, showMemberNavLink } from "../../lib/memberAccessLevel";

const NAV_LINKS = [
  { to: "/", label: "Hangar" },
  { to: "/fleet", label: "Fleet" },
  { to: "/jet-browser", label: "Jet Browser" },
  { to: "/intel", label: "Intel" },
  { to: "/origin", label: "Origin" },
  { to: "/member", label: "Member" },
] as const;

const navPillClass = (isActive: boolean) =>
  [
    "app-nav-pill btn-glass glass-effect-interactive shrink-0",
    isActive ? "app-nav-pill--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

const AppNav = () => {
  const { session } = useMemberAuth();
  const visibleLinks = NAV_LINKS.filter((link) =>
    link.to === "/member" ? showMemberNavLink(session) : canMemberAccessRoute(link.to, session),
  );
  return (
    <header className="liquid-glass-nav sticky top-0 z-50 mx-auto w-full max-w-[min(100vw-1.25rem,72rem)] px-2 backdrop-blur-md sm:max-w-none sm:px-4">
      <GlassEffectContainer
        aria-label="USJET primary navigation"
        className="app-nav-shell glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
      >
        <div className="app-nav-body">
          <div className="app-nav-row app-nav-row--primary">
            <div className="app-nav-zone app-nav-zone--brand">
              <Link to="/" className="nav-brand-usjet shrink-0" aria-label="USJet.ai home">
                <UsjetWordmark size="nav" />
              </Link>
            </div>

            <span className="app-nav-divider" aria-hidden />

            <nav className="app-nav-zone app-nav-zone--routes" aria-label="Fleet routes">
              {visibleLinks.map((link) =>
                link.to === "/origin" ? (
                  <OriginGateLink
                    key={link.to}
                    className="app-nav-pill btn-glass glass-effect-interactive shrink-0 text-white/45 hover:text-white"
                  />
                ) : (
                  <NavLink key={link.to} to={link.to} className={({ isActive }) => navPillClass(isActive)}>
                    {link.label}
                  </NavLink>
                ),
              )}
            </nav>

            <div className="app-nav-zone app-nav-zone--social">
              <AppNavInstagramBadge />
            </div>
          </div>
        </div>
      </GlassEffectContainer>
    </header>
  );
};

export default AppNav;
