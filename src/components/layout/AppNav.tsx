import { NavLink, Link, useLocation } from "react-router-dom";
import { Newspaper } from "lucide-react";
import GamingVrNavButton from "../gaming/GamingVrNavButton";
import AppNavHangarLive from "./AppNavHangarLive";
import UsjetWordmark from "../brand/UsjetWordmark";
import GlassEffectContainer from "./GlassEffectContainer";
import MobileRotateCue from "./MobileRotateCue";
import AppNavCashAppButton from "./AppNavCashAppButton";
import UsjetOpsMailEnvelope from "./UsjetOpsMailEnvelope";
import { BLOG_ROUTE } from "../../data/usjetBlog";
import { useMemberAuth } from "../../context/MemberAuthContext";
import OriginGateLink from "../origin/OriginGateLink";
import { canMemberAccessRoute, showMemberNavLink } from "../../lib/memberAccessLevel";
import { wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";
import SovereignVaultGlobalDownload from "../growth/SovereignVaultGlobalDownload";
import { GAMING_X_URL, GAMING_X_WEB } from "../../data/gamingPortal";

const X_USAJET_COCKPIT = wrapExternalInCockpit(GAMING_X_URL, {
  label: GAMING_X_WEB,
  returnTo: "/",
  directHandoff: true,
});

const NAV_LINKS = [
  { to: "/", label: "Hangar" },
  { to: "/fleet", label: "Fleet" },
  { to: "/intel", label: "Intel" },
  { to: "/founder", label: "Founder" },
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
  const location = useLocation();
  const { session } = useMemberAuth();
  const visibleLinks = NAV_LINKS.filter((link) =>
    link.to === "/member" ? showMemberNavLink(session) : canMemberAccessRoute(link.to, session),
  );
  const showNavDownload = location.pathname !== "/";

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
                ) : link.to === "/founder" ? (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        "app-nav-founder app-nav-pill btn-glass glass-effect-interactive shrink-0",
                        "relative inline-flex items-center gap-1.5 overflow-visible",
                        isActive ? "app-nav-pill--active" : "text-white/45 hover:text-white",
                      ].join(" ")
                    }
                  >
                    {link.label}
                  </NavLink>
                ) : (
                  <NavLink key={link.to} to={link.to} className={({ isActive }) => navPillClass(isActive)}>
                    {link.label}
                  </NavLink>
                ),
              )}
            </nav>
          </div>
        </div>

        {showNavDownload ? (
          <div className="app-nav-zone app-nav-zone--download" aria-label="Sovereign vault download">
            <SovereignVaultGlobalDownload embedded />
          </div>
        ) : null}
      </GlassEffectContainer>
    </header>
  );
};

export default AppNav;
