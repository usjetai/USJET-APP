import { Wrench, GraduationCap } from "lucide-react";

const Founder = () => (
  <div className="mx-auto max-w-5xl px-6 pb-24 pt-48">
    <div className="relative overflow-hidden rounded-[4.5rem] border border-white/10 bg-white/5 p-16 text-left text-white shadow-2xl backdrop-blur-3xl md:p-20">
      <div className="absolute right-0 top-0 p-10 opacity-10">
        <Wrench size={120} />
      </div>
      <h1 className="mb-10 inline-block border-b-8 border-blue-500 pb-4 text-7xl font-black uppercase italic tracking-tighter md:text-8xl">
        Ameer Karim
      </h1>
      <p className="mb-12 max-w-2xl text-left text-2xl italic leading-relaxed text-white/70">
        Born and raised in <span className="font-bold text-blue-400">[YOUR HOMETOWN]</span>.
        <br />
        <br />
        A dual-threat innovator blending **Architectural Engineering** from New York Technical
        College with a decade of mastery as an **Auto Mechanic**.
      </p>
      <div className="mb-12 rounded-r-3xl border-l-[12px] border-blue-500 bg-blue-500/10 p-12">
        <p className="text-left text-4xl font-black italic leading-tight tracking-tight text-white md:text-5xl">
          &quot;I spent years perfecting the machines people drive. Now, I&apos;m building the
          digital architecture people think with.&quot;
        </p>
      </div>
    </div>
  </div>
);

export default Founder;
