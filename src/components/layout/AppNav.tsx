import { NavLink, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import GlassEffectContainer from "./GlassEffectContainer";

const NAV_LINKS = [
  { to: "/", label: "Fleet" },
  { to: "/hangar", label: "Hangar" },
  { to: "/intel", label: "Intel" },
  { to: "/founder", label: "Founder" },
  { to: "/origin", label: "Origin" },
] as const;

const AppNav = () => (
  <header className="liquid-glass-nav fixed left-1/2 top-8 z-[100] w-full max-w-[min(100vw-1.25rem,56rem)] -translate-x-1/2 px-2 sm:max-w-none sm:px-0">
    <GlassEffectContainer
      aria-label="USJET primary navigation"
      className={[
        "glass-effect glass-effect--capsule liquid-glass-background glass-tint-cyan",
        "max-w-full gap-4 overflow-x-auto p-3 px-5 sm:gap-6 sm:p-4 sm:px-8 lg:gap-8 lg:px-10",
      ].join(" ")}
    >
      <Link
        to="/"
        className="nav-brand-usjet shrink-0 font-aviation text-[10px] font-black uppercase italic tracking-[0.14em] text-white/95 sm:text-[11px] sm:tracking-[0.18em]"
        aria-label="USJet.ai home"
      >
        USJET<span className="text-blue-500">.AI</span>
      </Link>

      <span className="hidden h-7 w-px shrink-0 bg-white/10 sm:block" aria-hidden />

      <nav className="flex min-w-0 shrink gap-2 border-white/10 pr-3 sm:gap-3 sm:border-r sm:pr-8" aria-label="Fleet routes">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                "btn-glass glass-effect-interactive shrink-0 px-3 py-1.5 text-[10px] font-black uppercase italic tracking-widest sm:text-[11px]",
                isActive ? "text-white ring-1 ring-cyan-400/35" : "text-white/45 hover:text-white",
              ].join(" ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <a
        href="https://buy.stripe.com/your_stripe_link_here"
        target="_blank"
        rel="noreferrer"
        className="btn-glass-prominent glass-effect-interactive glass-tint-blue shrink-0"
      >
        <ShieldCheck size={16} className="animate-pulse text-white" aria-hidden />
        <span className="flex flex-col items-start leading-none">
          <span className="text-[9px] font-black uppercase tracking-tighter">Founder Special</span>
          <span className="text-[14px] font-black italic">
            $19.95<span className="text-[9px] lowercase opacity-70">/mo</span>
          </span>
        </span>
      </a>
    </GlassEffectContainer>
  </header>
);

export default AppNav;
