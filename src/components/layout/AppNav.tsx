import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Fleet" },
  { to: "/hangar", label: "Hangar" },
  { to: "/intel", label: "Intel" },
  { to: "/founder", label: "Founder" },
  { to: "/origin", label: "Origin" },
] as const;

const AppNav = () => (
  <nav className="fixed left-1/2 top-8 z-[100] flex -translate-x-1/2 items-center gap-8 rounded-full border border-white/10 bg-black/80 p-4 px-10 shadow-2xl backdrop-blur-2xl">
    <div className="flex gap-8 border-r border-white/10 pr-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-[11px] font-black uppercase italic tracking-widest text-white/40 transition-all hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </div>

    <a
      href="https://buy.stripe.com/your_stripe_link_here"
      target="_blank"
      rel="noreferrer"
      className="group flex transform items-center gap-3 rounded-full bg-blue-600 px-6 py-2 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:bg-blue-500 active:scale-95"
    >
      <ShieldCheck size={16} className="animate-pulse text-white" />
      <div className="flex flex-col items-start leading-none">
        <span className="text-[9px] font-black uppercase tracking-tighter">Founder Special</span>
        <span className="text-[14px] font-black italic">
          $19.95<span className="text-[9px] lowercase opacity-70">/mo</span>
        </span>
      </div>
    </a>
  </nav>
);

export default AppNav;
