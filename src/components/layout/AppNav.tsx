import { NavLink, Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import GamingVrNavButton from "../gaming/GamingVrNavButton";
import AppNavHangarLive from "./AppNavHangarLive";
import UsjetWordmark from "../brand/UsjetWordmark";
import GlassEffectContainer from "./GlassEffectContainer";
import FleetOnlineCursorCluster from "./FleetOnlineCursorCluster";
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

const US_NEWS_AIR_COCKPIT = wrapExternalInCockpit("https://www.facebook.com/usnewsair", {
  label: "US News Air",
  returnTo: "/",
  directHandoff: true,
});

const BLUE_IVY_TIKTOK_COCKPIT = wrapExternalInCockpit(
  "https://www.tiktok.com/@blueivyc4?is_from_webapp=1&sender_device=pc",
  {
    label: "Blue Ivy C4",
    returnTo: "/",
    directHandoff: true,
  },
);

const BEYONCE_COCKPIT = wrapExternalInCockpit("https://beyonce.com/", {
  label: "Beyoncé",
  returnTo: "/",
  directHandoff: true,
});

const JAYZ_COCKPIT = wrapExternalInCockpit("https://lifeandtimes.com/", {
  label: "Life + Times",
  returnTo: "/",
  directHandoff: true,
});

const X_USAJET_COCKPIT = wrapExternalInCockpit(GAMING_X_URL, {
  label: GAMING_X_WEB,
  returnTo: "/",
  directHandoff: true,
});

const NAV_LINKS = [
  { to: "/", label: "Fleet" },
  { to: "/hired-hud", label: "USJET House" },
  { to: "/hangar", label: "Hangar" },
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
  const { session } = useMemberAuth();
  const visibleLinks = NAV_LINKS.filter((link) =>
    link.to === "/member" ? showMemberNavLink(session) : canMemberAccessRoute(link.to, session),
  );

  return (
    <header className="liquid-glass-nav sticky top-0 z-50 mx-auto w-full max-w-[min(100vw-1.25rem,72rem)] px-2 backdrop-blur-md sm:max-w-none sm:px-4">
      <GlassEffectContainer
        aria-label="USJET primary navigation"
        className="app-nav-shell app-nav-shell--two-row glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
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
                    <span className="app-nav-founder__hand" aria-hidden>
                      <svg
                        className="app-nav-founder__hand-svg"
                        viewBox="0 0 24 32"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <rect x="9.5" y="1" width="5" height="21" rx="2.4" fill="#e8c4a8" />
                        <path
                          d="M3 15 Q3 27 12 29 Q21 27 21 15 L21 12 Q12 10 3 12 Z"
                          fill="#e8c4a8"
                        />
                        <rect x="4" y="11" width="2.8" height="6" rx="1.4" fill="#c9a27a" transform="rotate(-18 5.4 14)" />
                        <rect x="7" y="12" width="2.6" height="5" rx="1.3" fill="#c9a27a" />
                        <rect x="15.5" y="12" width="2.6" height="5" rx="1.3" fill="#c9a27a" />
                        <rect x="18.2" y="11" width="2.8" height="6" rx="1.4" fill="#c9a27a" transform="rotate(18 19.6 14)" />
                      </svg>
                    </span>
                    {link.label}
                  </NavLink>
                ) : link.to === "/hired-hud" ? (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        "app-nav-usjet-house app-nav-pill btn-glass glass-effect-interactive shrink-0",
                        isActive ? "app-nav-usjet-house--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")
                    }
                    title="USJET House — hired developer live hub"
                    aria-label="USJET House — hired developer live hub"
                  >
                    <span className="app-nav-usjet-house__glow" aria-hidden />
                    <span className="app-nav-usjet-house__shine" aria-hidden />
                    <span className="app-nav-usjet-house__label">USJET House</span>
                  </NavLink>
                ) : (
                  <NavLink key={link.to} to={link.to} className={({ isActive }) => navPillClass(isActive)}>
                    {link.label}
                  </NavLink>
                ),
              )}
            </nav>
          </div>

          <div className="app-nav-row app-nav-row--secondary">
            <div className="app-nav-zone app-nav-zone--media">
              <UsjetOpsMailEnvelope className="app-nav-mail__envelope" />
              <AppNavCashAppButton />

              <NavLink
                to={BLOG_ROUTE}
                className={({ isActive }) =>
                  ["app-nav-blog btn-glass glass-effect-interactive shrink-0", isActive ? "app-nav-blog--active" : ""]
                    .filter(Boolean)
                    .join(" ")
                }
                title="USJET Operator Log — founding story, Form C dispatches, invest narrative"
                aria-label="USJET Blog — Operator Log"
              >
                <span className="app-nav-blog__reflection" aria-hidden />
                <Newspaper className="app-nav-blog__icon" size={13} strokeWidth={2.4} aria-hidden />
                <span className="app-nav-blog__label">Blog</span>
              </NavLink>

              <Link
                to={X_USAJET_COCKPIT}
                className="app-nav-pill btn-glass glass-effect-interactive shrink-0"
                title="X — @usajet"
                aria-label="X — @usajet on x.com"
              >
                X
              </Link>

              <Link
                to={US_NEWS_AIR_COCKPIT}
                className="app-nav-us btn-glass glass-effect-interactive shrink-0"
                title="US News Air — Facebook"
                aria-label="US — US News Air on Facebook"
              >
                <span className="app-nav-us__push">
                  <span className="app-nav-us__nozzle" aria-hidden />
                  <span className="app-nav-us__spray" aria-hidden>
                    <span className="app-nav-us__mist" />
                    <span className="app-nav-us__droplet app-nav-us__droplet--1" />
                    <span className="app-nav-us__droplet app-nav-us__droplet--2" />
                    <span className="app-nav-us__droplet app-nav-us__droplet--3" />
                    <span className="app-nav-us__droplet app-nav-us__droplet--4" />
                    <span className="app-nav-us__droplet app-nav-us__droplet--5" />
                    <span className="app-nav-us__droplet app-nav-us__droplet--6" />
                  </span>
                  <span className="app-nav-us__label">US</span>
                </span>
              </Link>

              <Link
                to={BLUE_IVY_TIKTOK_COCKPIT}
                className="app-nav-blue btn-glass glass-effect-interactive shrink-0"
                title="Blue Ivy C4 — TikTok"
                aria-label="Blue — Blue Ivy C4 on TikTok"
              >
                <span className="app-nav-blue__ring" aria-hidden />
                <span className="app-nav-blue__shine" aria-hidden />
                <span className="app-nav-blue__spark app-nav-blue__spark--1" aria-hidden />
                <span className="app-nav-blue__spark app-nav-blue__spark--2" aria-hidden />
                <span className="app-nav-blue__spark app-nav-blue__spark--3" aria-hidden />
                <span className="app-nav-blue__face" aria-hidden>
                  <span className="app-nav-blue__mouth" />
                  <span className="app-nav-blue__tongue" />
                </span>
                <span className="app-nav-blue__label">Blue</span>
              </Link>

              <Link
                to={BEYONCE_COCKPIT}
                className="app-nav-b btn-glass glass-effect-interactive shrink-0"
                title="Beyoncé — beyonce.com"
                aria-label="B — Beyoncé official site"
              >
                <span className="app-nav-b__glow" aria-hidden />
                <span className="app-nav-b__label">B</span>
              </Link>

              <Link
                to={JAYZ_COCKPIT}
                className="app-nav-j btn-glass glass-effect-interactive shrink-0"
                title="Life + Times — lifeandtimes.com"
                aria-label="J — Life + Times official site"
              >
                <span className="app-nav-j__glow" aria-hidden />
                <span className="app-nav-j__label">J</span>
              </Link>

              <AppNavHangarLive />

              <NavLink
                to="/b2b"
                className={({ isActive }) =>
                  ["app-nav-b2b btn-glass glass-effect-interactive shrink-0", isActive ? "app-nav-b2b--active" : ""]
                    .filter(Boolean)
                    .join(" ")
                }
                title="B2B Enterprise — industrial operating system"
                aria-label="B2B Enterprise gateway"
              >
                <span className="app-nav-b2b__reflection" aria-hidden />
                <span className="app-nav-b2b__earth" aria-hidden>
                  🌍
                </span>
                <span className="app-nav-b2b__label">B2B</span>
              </NavLink>

              <GamingVrNavButton surface="header" />
            </div>

            <div className="app-nav-zone app-nav-zone--tail">
              <MobileRotateCue />
              <FleetOnlineCursorCluster />
            </div>
          </div>
        </div>

        <div className="app-nav-zone app-nav-zone--download" aria-label="Sovereign vault download">
          <SovereignVaultGlobalDownload embedded />
        </div>
      </GlassEffectContainer>
    </header>
  );
};

export default AppNav;
