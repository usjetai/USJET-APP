import { Link } from "wouter";
import { Wrench, Cpu, Plane, Star, ArrowRight } from "lucide-react";

const timeline = [
  {
    year: "Early Days",
    icon: Wrench,
    title: "Grease, Steel & Getting It Done",
    body: "It started under the belly of aircraft — not in a boardroom. Years spent as a mechanic, diagnosing systems that others had given up on, learning that every problem has a root cause if you're willing to look hard enough. Aviation taught patience, precision, and respect for the machine. The job was physical, the stakes were real, and the feedback was immediate: either it works or it doesn't.",
  },
  {
    year: "The Turn",
    icon: Cpu,
    title: "When the Tools Changed",
    body: "The first time I saw an AI analyze a maintenance log and flag an anomaly that a seasoned engineer had missed, something shifted. It wasn't threatening — it was familiar. A better tool for a job I already understood. I'd spent years learning to trust instruments over intuition when the two conflicted. AI was another instrument. The question wasn't whether to use it. It was how to use it well.",
  },
  {
    year: "The Study",
    icon: Star,
    title: "Two Years in the Cockpit of AI",
    body: "What followed was methodical — the same approach I'd applied to aircraft systems. Every major AI platform tested, documented, and evaluated against real operational scenarios. Not benchmarks. Not marketing copy. Actual missions: Can this tool help a dispatch team under pressure? Can it process a 400-page maintenance manual in minutes? Can it brief a crew in 30 seconds? The answers formed the Briefing Room you're reading now.",
  },
  {
    year: "Today",
    icon: Plane,
    title: "USJET.ai — Cleared for Takeoff",
    body: "USJET.ai is built for the people who keep aviation running. The mechanics, the ops managers, the dispatchers, the instructors, the safety officers — the ones whose work doesn't get written up in tech blogs. This platform exists to translate the AI revolution into operational language: what each tool actually does, when to use it, and what the Captain's verdict is after real-world evaluation. No hype. Just intelligence.",
  },
];

export default function PilotsLog() {
  return (
    <div className="pt-28 pb-24 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-5 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Page 3 · The Pilot's Log
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
          From the Hangar<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-sky-400 to-white">
            to the Cloud
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A mechanic's journey through the AI revolution — and why someone who spent years under aircraft is now building intelligence infrastructure for the people who fly them.
        </p>
      </div>

      {/* Opening pull quote */}
      <blockquote className="relative mb-16 pl-6 border-l-2 border-primary/50">
        <div className="absolute -left-px top-0 w-0.5 h-full bg-gradient-to-b from-primary/80 via-primary/30 to-transparent" />
        <p className="text-xl md:text-2xl font-heading text-white/90 italic leading-relaxed">
          "In aviation, you learn to trust the instruments — not because the gauges are always right, but because you've verified them, tested them, and understand their limits. That's exactly how I approach AI."
        </p>
        <footer className="mt-3 text-sm text-muted-foreground not-italic">— The Founder, USJet.ai</footer>
      </blockquote>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />

        <div className="space-y-14">
          {timeline.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.year}
                data-testid={`timeline-item-${i}`}
                className="relative pl-16 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.15}s`, animationFillMode: "both" }}
              >
                {/* Icon node */}
                <div className="absolute left-0 w-12 h-12 rounded-full bg-black/60 border border-primary/30 flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(0,212,255,0.12)]">
                  <Icon size={18} className="text-primary" />
                </div>

                {/* Content */}
                <div className="pilots-log-card">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs uppercase tracking-widest text-primary font-semibold">{item.year}</span>
                    <div className="h-px flex-1 bg-white/8" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing section */}
      <div className="mt-20 pt-12 border-t border-white/8">
        <div className="pilots-log-card text-center">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">The Mission Continues</h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
            Every tool in the Briefing Room has been personally evaluated, stress-tested against real aviation scenarios, and rated honestly. This isn't curation for affiliate revenue. It's a maintenance log for the AI era — kept by someone who knows what it means for a system to actually work when lives depend on it.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/briefing-room"
              data-testid="link-to-briefing-room"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] transition-all duration-300"
            >
              Read the Intelligence Dossiers
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/"
              data-testid="link-to-flight-deck"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/15 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-300"
            >
              Return to Flight Deck
            </Link>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="mt-12 flex items-center justify-between">
        <Link href="/briefing-room" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← Briefing Room
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          Flight Deck →
        </Link>
      </div>
    </div>
  );
}
