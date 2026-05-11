import { useState } from "react";
import { Link } from "wouter";
import { ExternalLink, Star, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { AI_TOOLS, CATEGORIES, type AiTool } from "@/lib/ai-tools";
import { ToolLogo } from "@/components/ToolLogo";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rating ? "text-primary fill-primary" : "text-white/20 fill-white/20"}
        />
      ))}
    </div>
  );
}

function ReviewBox({ tool, index }: { tool: AiTool; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      id={`tool-${tool.slug}`}
      data-testid={`review-box-${tool.slug}`}
      className="review-box animate-fade-in-up"
      style={{ animationDelay: `${(index % 10) * 0.06}s`, animationFillMode: "both" }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center p-1.5 overflow-hidden">
          <ToolLogo slug={tool.slug} name={tool.name} size={34} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-primary/80 font-medium px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5">
              {tool.category}
            </span>
            <StarRating rating={tool.rating} />
          </div>
          <h3 className="text-lg font-heading font-bold text-white leading-tight">
            {tool.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">by {tool.maker}</p>
        </div>
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`link-tool-${tool.slug}`}
          className="flex-shrink-0 p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Tagline */}
      <p className="text-sm text-white/70 italic mb-4 leading-relaxed border-l-2 border-primary/30 pl-3">
        "{tool.tagline}"
      </p>

      {/* Specialty tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Captain's Review — always visible */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-px bg-primary/40" />
          <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">Captain's Review</span>
          <div className="w-5 h-px bg-primary/40" />
        </div>
        <p className="text-sm text-white/75 leading-relaxed">
          {tool.captainsReview}
        </p>
      </div>

      {/* How it works — expandable */}
      <button
        onClick={() => setExpanded((e) => !e)}
        data-testid={`expand-${tool.slug}`}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200 mt-2 group"
      >
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        <span className="group-hover:underline underline-offset-2">
          {expanded ? "Hide technical details" : "How it works"}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tool.howItWorks}
          </p>
        </div>
      )}
    </div>
  );
}

export default function BriefingRoom() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? AI_TOOLS.filter((t) => t.category === activeCategory)
    : AI_TOOLS;

  return (
    <div className="pt-28 pb-24 px-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-5 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Page 2 · The Briefing Room
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
          Intelligence Dossiers
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Detailed breakdowns on every AI platform in the USJet arsenal. Real assessments. No marketing fluff. Just mission-critical intelligence.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCategory(null)}
          data-testid="filter-all"
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
            activeCategory === null
              ? "bg-primary/15 text-primary border-primary/30 shadow-[0_0_10px_rgba(0,212,255,0.15)]"
              : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
          }`}
        >
          <Filter size={11} className="inline mr-1.5" />
          All {AI_TOOLS.length}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary/15 text-primary border-primary/30 shadow-[0_0_10px_rgba(0,212,255,0.15)]"
                : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Review grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tool, i) => (
          <ReviewBox key={tool.slug} tool={tool} index={i} />
        ))}
      </div>

      {/* Back link */}
      <div className="mt-16 pt-8 border-t border-white/8 flex items-center justify-between">
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
          ← Back to Flight Deck
        </Link>
        <Link href="/pilots-log" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
          Pilot's Log →
        </Link>
      </div>
    </div>
  );
}
