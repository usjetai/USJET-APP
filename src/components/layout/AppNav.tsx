import { NavLink, Link } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import UsjetWordmark from "../brand/UsjetWordmark";
import FleetCommand from "../fleet/FleetCommand";
import GlassEffectContainer from "./GlassEffectContainer";
import { useMemberAuth } from "../../context/MemberAuthContext";
import { canMemberAccessRoute } from "../../lib/memberAccessLevel";

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
            const locked = !canMemberAccessRoute(link.to, session);

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    "btn-glass glass-effect-interactive shrink-0 px-3 py-1.5 text-[10px] font-black uppercase italic tracking-widest sm:text-[11px]",
                    "inline-flex items-center gap-1.5",
                    isActive ? "text-white ring-1 ring-cyan-400/35" : "text-white/45 hover:text-white",
                    locked ? "opacity-70" : "",
                  ].join(" ")
                }
              >
                {link.label}
                {locked ? <Lock size={11} className="shrink-0 text-cyan-300/80" aria-label="Clearance required" /> : null}
              </NavLink>
            );
          })}
        </nav>

        <FleetCommand />

        <span className="hidden h-7 w-px shrink-0 bg-white/10 lg:block" aria-hidden />

        <NavLink
          to="/special"
          className={({ isActive }) =>
            [
              "btn-glass-prominent glass-effect-interactive glass-tint-blue shrink-0",
              isActive ? "ring-2 ring-cyan-400/45" : "",
            ].join(" ")
          }
        >
          <ShieldCheck size={16} className="animate-pulse text-white" aria-hidden />
          <span className="flex flex-col items-start leading-none">
            <span className="text-[9px] font-black uppercase tracking-tighter">Founder Special</span>
            <span className="text-[14px] font-black italic">
              $19.90<span className="text-[9px] lowercase opacity-70">/mo</span>
            </span>
          </span>
        </NavLink>
      </GlassEffectContainer>
    </header>
  );
};

export default AppNav;
