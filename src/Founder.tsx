import React from 'react';
import { Wrench, GraduationCap } from 'lucide-react';

const Founder = () => (
  <div className="pt-48 pb-24 px-6 max-w-5xl mx-auto">
    <div className="p-16 md:p-20 rounded-[4.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden text-white text-left">
      <div className="absolute top-0 right-0 p-10 opacity-10"><Wrench size={120}/></div>
      <h1 className="text-7xl md:text-8xl font-black italic uppercase mb-10 border-b-8 border-blue-500 pb-4 inline-block tracking-tighter">Ameer Karim</h1>
      <p className="text-white/70 italic text-2xl leading-relaxed mb-12 max-w-2xl text-left">
        Born and raised in <span className="text-blue-400 font-bold">[YOUR HOMETOWN]</span>. 
        <br /><br />
        A dual-threat innovator blending **Architectural Engineering** from New York Technical College with a decade of mastery as an **Auto Mechanic**.
      </p>
      <div className="p-12 border-l-[12px] border-blue-500 bg-blue-500/10 mb-12 rounded-r-3xl">
        <p className="text-white font-black text-4xl md:text-5xl italic leading-tight tracking-tight text-left">
          "I spent years perfecting the machines people drive. Now, I'm building the digital architecture people think with."
        </p>
      </div>
    </div>
  </div>
);

export default Founder;