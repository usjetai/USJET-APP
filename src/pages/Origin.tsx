import { Mic, Shield, Volume2 } from "lucide-react";
import AuraFrame from "../components/aura/AuraFrame";

const Origin = () => (
  <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black font-sans">
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="grid h-full w-full grid-cols-[repeat(30,1fr)] grid-rows-[repeat(30,1fr)] border-[#ffffff05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
        {[...Array(900)].map((_, i) => (
          <div key={i} className="border-[0.5px] border-[#ffffff03]" />
        ))}
      </div>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-[450px] w-[450px] animate-ping rounded-full border border-blue-500/10 opacity-20" />
        <div className="absolute h-[350px] w-[350px] animate-pulse rounded-full border border-white/5" />

        <AuraFrame aura="listening" variant="orb" className="h-72 w-72">
          <Shield className="relative z-20 h-16 w-16 text-white/80" strokeWidth={1} />
        </AuraFrame>

        <button
          type="button"
          className="group absolute -left-28 rounded-full border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-blue-400/50 hover:bg-white/10"
        >
          <Mic className="h-8 w-8 text-white/40 transition-colors group-hover:text-blue-400" />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-white/20 group-hover:text-blue-400">
            Listen
          </span>
        </button>

        <button
          type="button"
          className="group absolute -right-28 rounded-full border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl transition-all hover:border-blue-400/50 hover:bg-white/10"
        >
          <Volume2 className="h-8 w-8 text-white/40 transition-colors group-hover:text-blue-400" />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-white/20 group-hover:text-blue-400">
            Speak
          </span>
        </button>
      </div>

      <div className="mt-24 text-center">
        <p className="mb-2 text-[11px] font-light uppercase tracking-[0.8em] text-white/30">
          Origin Intelligence Core
        </p>
        <div className="mx-auto h-px w-48 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <p className="mt-4 animate-pulse font-mono text-[10px] uppercase tracking-widest text-blue-400/60">
          Status: Online // 8080 Active
        </p>
      </div>
    </div>

    <div className="absolute bottom-10 left-10 font-mono text-[10px] uppercase tracking-tighter text-white/20">
      <p>Lat: 40.7128° N</p>
      <p>Long: 74.0060° W</p>
    </div>

    <div className="absolute bottom-10 right-10 text-right font-mono text-[10px] uppercase tracking-tighter text-white/20">
      <p>Protocol: USJET-v5</p>
      <p>System: Liquid Glass</p>
    </div>
  </div>
);

export default Origin;
