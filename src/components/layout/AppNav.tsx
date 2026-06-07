import { NavLink, Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import GamingVrNavButton from "../gaming/GamingVrNavButton";
import AppNavHangarLive from "./AppNavHangarLive";
import UsjetWordmark from "../brand/UsjetWordmark";
import GlassEffectContainer from "./GlassEffectContainer";
import FleetOnlineCursorCluster from "./FleetOnlineCursorCluster";
import MobileRotateCue from "./MobileRotateCue";
import FooterSurpriseWrap from "./FooterSurpriseWrap";
import { BLOG_ROUTE } from "../../data/usjetBlog";
import { useMemberAuth } from "../../context/MemberAuthContext";
import OriginGateLink from "../origin/OriginGateLink";
import { canMemberAccessRoute, showMemberNavLink } from "../../lib/memberAccessLevel";
import { wrapExternalInCockpit } from "../../lib/fleetLaunchUrl";

const US_NEWS_AIR_COCKPIT = wrapExternalInCockpit("https://www.facebook.com/usnewsair", {
  label: "US News Air",
  returnTo: "/",
});

const BLUE_IVY_TIKTOK_COCKPIT = wrapExternalInCockpit(
  "https://www.tiktok.com/@blueivyc4?is_from_webapp=1&sender_device=pc",
  {
    label: "Blue Ivy C4",
    returnTo: "/",
  },
);

const NAV_LINKS = [
  { to: "/", label: "Fleet" },
  { to: "/hangar", label: "Hangar" },
  { to: "/intel", label: "Intel" },
  { to: "/founder", label: "Founder" },
  { to: "/origin", label: "Origin" },
  { to: "/member", label: "Member" },
] as const;

const AppNav = () => {
  const { session } = useMemberAuth();
  const visibleLinks = NAV_LINKS.filter((link) =>
    link.to === "/member" ? showMemberNavLink(session) : canMemberAccessRoute(link.to, session),
  );
  const showFounderSpecial = canMemberAccessRoute("/special", session);

  return (
    <header className="liquid-glass-nav sticky top-0 z-50 mx-auto w-full max-w-[min(100vw-1.25rem,56rem)] px-2 backdrop-blur-md sm:max-w-none sm:px-4">
      <GlassEffectContainer
        aria-label="USJET primary navigation"
        className={[
          "glass-effect glass-effect--capsule liquid-glass-background glass-tint-cyan",
          "flex max-w-full flex-wrap items-center gap-2 overflow-x-auto p-3 px-5 sm:gap-3 sm:p-4 sm:px-6 lg:gap-4 lg:px-8",
        ].join(" ")}
      >
        <Link to="/" className="nav-brand-usjet shrink-0" aria-label="USJet.ai home">
          <UsjetWordmark size="nav" />
        </Link>

        <span className="hidden h-7 w-px shrink-0 bg-white/10 sm:block" aria-hidden />

        <nav
          className="flex min-w-0 max-w-full shrink gap-2 overflow-x-auto border-white/10 pr-2 sm:gap-3 sm:border-r sm:pr-6"
          aria-label="Fleet routes"
        >
          {visibleLinks.map((link) =>
            link.to === "/origin" ? (
              <OriginGateLink
                key={link.to}
                className={[
                  "btn-glass glass-effect-interactive shrink-0 px-3 py-1.5 text-[10px] font-black uppercase italic tracking-widest sm:text-[11px]",
                  "inline-flex items-center gap-1.5",
                  "text-white/45 hover:text-white",
                ].join(" ")}
              />
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "btn-glass glass-effect-interactive shrink-0 px-3 py-1.5 text-[10px] font-black uppercase italic tracking-widest sm:text-[11px]",
                    "inline-flex items-center gap-1.5",
                    isActive ? "text-white ring-1 ring-cyan-400/35" : "text-white/45 hover:text-white",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

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

        <div className="app-nav-tail ml-auto flex shrink-0 flex-wrap items-center gap-2">
          {showFounderSpecial ? (
            <>
              <span className="hidden h-7 w-px shrink-0 bg-white/10 lg:block" aria-hidden />
              <MobileRotateCue />
              <NavLink
                to="/special"
                className={({ isActive }) =>
                  [
                    "btn-glass-prominent glass-effect-interactive glass-tint-blue shrink-0",
                    isActive ? "ring-2 ring-cyan-400/45" : "",
                  ].join(" ")
                }
              >
                <span className="flex flex-col items-start leading-none">
                  <span className="text-[9px] font-black uppercase tracking-tighter">Founder Special</span>
                  <span className="text-[14px] font-black italic">
                    $19.90<span className="text-[9px] lowercase opacity-70">/mo</span>
                  </span>
                </span>
              </NavLink>
            </>
          ) : (
            <MobileRotateCue />
          )}
          <FleetOnlineCursorCluster />
        </div>
      </GlassEffectContainer>
    </header>
  );
};

export default AppNav;
