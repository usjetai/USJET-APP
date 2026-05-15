import { NavLink, Link } from "react-router-dom";
import UsjetWordmark from "../brand/UsjetWordmark";
import FleetCommand from "../fleet/FleetCommand";
import GlassEffectContainer from "./GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { canMemberAccessRoute, memberClearanceRank, routeMinClearanceRank } from "../../lib/memberAccessLevel";
import { stripeCheckoutCockpitPath } from "../../lib/stripeCockpitHandoff";

const NAV_LINKS = [
  { to: "/", label: "Fleet" },
  { to: "/blog", label: "Blog" },
  { to: "/ai-101", label: "AI 101" },
  { to: "/sos", label: "SOS" },
  { to: "/hangar", label: "Hangar" },
  { to: "/intel", label: "Intel" },
  { to: "/founder", label: "Founder" },
  { to: "/origin", label: "Origin" },
  { to: "/member", label: "Member" },
] as const;

function navLockedGlowClass(to: string): string {
  const need = routeMinClearanceRank(to);
  if (need >= 3) {
    return "app-nav__link--locked app-nav__link--locked-enterprise";
  }
  if (need >= 2) {
    return "app-nav__link--locked app-nav__link--locked-hangar-pro";
  }
  if (need >= 1) {
    return "app-nav__link--locked app-nav__link--locked-flight-pass";
  }
  return "";
}

const AppNav = () => {
  const { session } = useMemberAuth();
  const rank = memberClearanceRank(session);
  const canAccessSpecial = canMemberAccessRoute("/special", session);
  /**
   * Blue "Founder Special" strip: aggressive free-tier Flight Pass surface ($19.90 in stripePaymentLink).
   * Hide once member has active paid clearance at Flight Pass or above — they no longer need the promo rail.
   * (Guests and unpaid sessions still see checkout handoff; paid members use subdued /special when eligible.)
   */
  const showFlightPassPromoStrip = !(session?.active === true && rank >= 1);

  return (
    <header className="liquid-glass-nav sticky top-0 z-50 mx-auto w-full max-w-[min(100vw-1.25rem,56rem)] px-2 backdrop-blur-md sm:max-w-none sm:px-4">
      <GlassEffectContainer
        aria-label="USJET primary navigation"
        className={[
          "glass-effect glass-effect--capsule liquid-glass-background glass-tint-cyan",
          "flex max-w-full flex-wrap items-center gap-3 overflow-x-auto p-3 px-5 sm:gap-4 sm:p-4 sm:px-6 lg:gap-6 lg:px-8",
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
          {NAV_LINKS.map((link) => {
            const unlocked = canMemberAccessRoute(link.to, session);
            const lockedGlow = unlocked ? "" : navLockedGlowClass(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "btn-glass glass-effect-interactive shrink-0 px-3 py-1.5 text-[10px] font-black uppercase italic tracking-widest sm:text-[11px]",
                    "inline-flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/80",
                    lockedGlow,
                    isActive ? "text-white ring-1 ring-cyan-400/35" : "text-white/45 hover:text-white",
                  ].join(" ")
                }
                aria-label={unlocked ? link.label : `${link.label}, locked — opens clearance gate`}
              >
                {link.label}
                {!unlocked ? <span className="sr-only">(locked clearance)</span> : null}
              </NavLink>
            );
          })}
        </nav>

        <FleetCommand />

        {showFlightPassPromoStrip ? (
          <>
            <span className="hidden h-7 w-px shrink-0 bg-white/10 lg:block" aria-hidden />

            <Link
              to={stripeCheckoutCockpitPath("/member/login", "founder")}
              className="btn-glass-prominent glass-effect-interactive glass-tint-blue shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200/90"
              aria-label="Flight Pass — Stripe checkout in cockpit ($19.90 per month)"
            >
              <span className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-black uppercase tracking-tighter">Founder Special</span>
                <span className="text-[14px] font-black italic">
                  $19.90<span className="text-[9px] lowercase opacity-70">/mo</span>
                </span>
              </span>
            </Link>
          </>
        ) : canAccessSpecial ? (
          <>
            <span className="hidden h-7 w-px shrink-0 bg-white/10 lg:block" aria-hidden />

            <NavLink
              to="/special"
              className={({ isActive }) =>
                [
                  "btn-glass glass-effect-interactive shrink-0 px-3 py-2 text-[10px] font-black uppercase italic tracking-widest sm:text-[11px]",
                  isActive ? "ring-1 ring-cyan-400/35" : "",
                ].join(" ")
              }
            >
              <span className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-black uppercase tracking-tighter">Founder Special</span>
                <span className="text-[10px] font-semibold normal-case tracking-tight text-white/75">Tier checkout</span>
              </span>
            </NavLink>
          </>
        ) : null}
      </GlassEffectContainer>
    </header>
  );
};

export default AppNav;
