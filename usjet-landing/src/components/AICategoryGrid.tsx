import { Link } from "wouter";
import { AI_TOOLS } from "@/lib/ai-tools";
import { ToolLogo } from "@/components/ToolLogo";

type TileSize = "1x1" | "2x1" | "1x2" | "2x2";

const LAYOUT_PATTERN: TileSize[] = [
  "2x1","1x1","1x2","1x1","1x1","2x1",
  "1x1","1x2","2x1","1x1","1x1","2x2",
  "1x1","2x1","1x1","1x1","1x2","1x1",
  "2x1","1x1","1x1","1x2","2x1","1x1",
  "1x1","1x1","2x1","1x2","1x1","1x1",
];

const ROTATIONS = [
  "rotate(-1.2deg)","rotate(0.8deg)","rotate(-0.5deg)","rotate(1.1deg)",
  "rotate(0deg)","rotate(-0.9deg)","rotate(0.6deg)","rotate(-0.3deg)",
  "rotate(1.4deg)","rotate(-0.7deg)","rotate(0.4deg)","rotate(-1.0deg)",
  "rotate(0.9deg)","rotate(-0.6deg)","rotate(1.2deg)","rotate(-0.4deg)",
  "rotate(0.3deg)","rotate(-1.5deg)","rotate(0.7deg)","rotate(-0.8deg)",
  "rotate(1.1deg)","rotate(-0.2deg)","rotate(0.5deg)","rotate(-1.3deg)",
  "rotate(0.8deg)","rotate(-0.5deg)","rotate(1.0deg)","rotate(-0.7deg)",
  "rotate(0.2deg)","rotate(-1.1deg)",
];

function colSpan(size: TileSize) {
  return size === "2x1" || size === "2x2" ? "col-span-2" : "col-span-1";
}
function rowSpan(size: TileSize) {
  return size === "1x2" || size === "2x2" ? "row-span-2" : "row-span-1";
}

export function AICategoryGrid() {
  return (
    <section id="products" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-14 max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-primary mb-3 font-medium">Intelligence Roster</p>
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-white">
          30 AI Tools.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300">
            All Fully Briefed.
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl">
          Every platform evaluated, stress-tested, and cleared by the Captain. Click any tile for the full intelligence dossier.
        </p>
      </div>

      <div
        className="organic-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridAutoRows: "minmax(110px, auto)",
          gap: "10px",
        }}
      >
        {AI_TOOLS.map((tool, i) => {
          const size = LAYOUT_PATTERN[i] ?? "1x1";
          const rotation = ROTATIONS[i % ROTATIONS.length];
          const isLarge = size === "2x2";
          const isWide = size === "2x1";
          const isTall = size === "1x2";
          const logoSize = isLarge ? 36 : 24;

          return (
            <Link
              key={tool.slug}
              href={`/briefing-room#tool-${tool.slug}`}
              data-testid={`tile-tool-${tool.slug}`}
              className={`group relative overflow-hidden rounded-xl ai-tile cursor-pointer ${colSpan(size)} ${rowSpan(size)} animate-fade-in-up`}
              style={{
                animationDelay: `${i * 0.035}s`,
                animationFillMode: "both",
                transform: rotation,
                transition: "transform 0.35s ease, box-shadow 0.35s ease",
                padding: isLarge ? "20px" : isTall ? "18px" : isWide ? "16px" : "14px",
              }}
            >
              <div className="aurora-sweep absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 30% 30%, rgba(0,212,255,0.06) 0%, transparent 70%)" }}
              />

              <div className="relative z-10 flex flex-col h-full">
                {/* Logo */}
                <div className={`rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center mb-3 flex-shrink-0 group-hover:border-primary/25 group-hover:bg-white/8 transition-all duration-300 p-1.5 ${isLarge ? "w-14 h-14" : "w-9 h-9"}`}>
                  <ToolLogo
                    slug={tool.slug}
                    name={tool.name}
                    size={logoSize}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <h3 className={`font-semibold text-white leading-snug group-hover:text-primary transition-colors duration-300 ${isLarge ? "text-sm mb-2" : isTall ? "text-xs mb-1.5" : "text-[11px] mb-1"}`}>
                  {tool.name}
                </h3>

                {(isLarge || isTall || isWide) && (
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {tool.tagline}
                  </p>
                )}

                {isLarge && (
                  <div className="mt-auto pt-3">
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-2 flex items-center justify-between">
                  <p className={`text-muted-foreground leading-tight ${isLarge ? "text-[11px]" : "text-[10px]"}`}>
                    {tool.maker}
                  </p>
                  <span className="text-[9px] text-primary/50 group-hover:text-primary transition-colors duration-300 font-medium tracking-wide">
                    BRIEF →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/briefing-room"
          data-testid="link-to-briefing-room"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/15 text-white text-sm font-medium hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300"
        >
          View All 30 Intelligence Dossiers →
        </Link>
      </div>
    </section>
  );
}
