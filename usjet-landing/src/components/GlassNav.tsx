import { Link, useLocation } from "wouter";
import { Lock } from "lucide-react";

const navLinks = [
  { name: "Flight Deck",    path: "/",                premium: false },
  { name: "Briefing Room",  path: "/briefing-room",   premium: false },
  { name: "Pilot's Log",    path: "/pilots-log",      premium: false },
  { name: "Mission Control",path: "/mission-control", premium: true  },
];

export function GlassNav() {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-5 flex justify-between items-center pointer-events-none nav-enter">
      <div className="pointer-events-auto">
        <Link href="/" className="text-xl font-heading font-bold tracking-tighter text-white uppercase group">
          USJET<span className="text-primary group-hover:text-white transition-colors duration-300">.ai</span>
        </Link>
      </div>

      <nav className="pointer-events-auto glass-nav rounded-full px-4 py-2 flex items-center gap-0.5 relative">
        {navLinks.map((link) => {
          const isActive = location === link.path;

          if (link.premium) {
            const isPremiumActive = isActive;
            return (
              <Link
                key={link.name}
                href={link.path}
                data-testid={`nav-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ml-1 ${
                  isPremiumActive
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "bg-amber-500/5 text-amber-400/70 border border-amber-500/15 hover:bg-amber-500/12 hover:text-amber-400 hover:border-amber-500/25"
                }`}
              >
                <Lock size={10} className="flex-shrink-0" />
                {link.name}
                {isPremiumActive && (
                  <span className="absolute inset-0 rounded-full ring-1 ring-amber-500/30 animate-pulse" />
                )}
              </Link>
            );
          }

          return (
            <Link
              key={link.name}
              href={link.path}
              data-testid={`nav-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/25 shadow-[0_0_12px_rgba(0,212,255,0.2)]"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {link.name}
              {isActive && (
                <span className="absolute inset-0 rounded-full ring-1 ring-primary/30 animate-pulse" />
              )}
            </Link>
          );
        })}

        <a
          href="mailto:contact@usjet.ai"
          data-testid="nav-link-contact"
          className="ml-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all duration-300 border border-primary/30 hover:border-primary hover:shadow-[0_0_18px_rgba(0,212,255,0.4)]"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
