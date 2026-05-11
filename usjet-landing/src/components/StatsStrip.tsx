const stats = [
  { value: "99.97%", label: "Uptime SLA" },
  { value: "12B+", label: "Flight Data Points" },
  { value: "340+", label: "Aviation Partners" },
  { value: "47", label: "Countries Served" },
];

export function StatsStrip() {
  return (
    <section className="relative border-y border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-white/5">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-center px-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 stat-glow">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-primary uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
