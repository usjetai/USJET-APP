export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-[800px] h-[800px] border border-white/5 rounded-full absolute animate-spin-slow" />
        <div className="w-[1100px] h-[1100px] border border-dashed border-white/5 rounded-full absolute animate-spin-reverse" />
        <div className="w-[600px] h-[600px] rounded-full absolute" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center mt-12 animate-hero-rise">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Military-Grade Intelligence
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white tracking-tight leading-[1.1] mb-6">
          Command the Sky with{" "}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-blue-600">
            Absolute Precision
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Built for aerospace engineers, flight operators, and defense contractors.
          USJET.ai processes billions of telemetry points to deliver superhuman decision superiority.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            data-testid="button-initialize"
            className="relative group overflow-hidden px-8 py-4 rounded-md bg-white text-black font-semibold text-lg transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Initialize Platform
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute -inset-1 rounded-md hero-glow -z-10 animate-pulse" />
          </button>

          <button
            data-testid="button-architecture"
            className="px-8 py-4 rounded-md bg-white/5 text-white border border-white/10 font-semibold text-lg hover:bg-white/10 transition-colors duration-300"
          >
            View Architecture
          </button>
        </div>
      </div>

      {/* Radar sweep arc decoration */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none opacity-10">
        <div className="absolute inset-0 border-t border-l border-r border-primary/30 rounded-t-full" />
        <div className="absolute inset-[60px] border-t border-l border-r border-primary/20 rounded-t-full" />
        <div className="absolute inset-[120px] border-t border-l border-r border-primary/15 rounded-t-full" />
        <div className="absolute bottom-0 left-1/2 h-[450px] w-px bg-gradient-to-t from-primary/0 via-primary/40 to-primary/0 animate-radar-sweep origin-bottom" />
      </div>
    </section>
  );
}
