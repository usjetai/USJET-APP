import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Zap, ShieldCheck } from 'lucide-react';

const PREMIUM_UNITS = [
  { n: "OpenAI Terminal", link: "https://chatgpt.com", status: "Active" },
  { n: "Claude Command", link: "https://claude.ai", status: "Active" },
  { n: "Gemini Pro", link: "https://gemini.google.com", status: "Active" },
  { n: "Grok Portal", link: "https://x.com/i/grok", status: "Active" },
  { n: "Llama Local", link: "https://llama.meta.com", status: "Active" },
  { n: "Mistral HQ", link: "https://chat.mistral.ai", status: "Active" },
  // ... rest of the 30 units
];

const Hangar = () => (
  <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
      <div className="text-left">
        <div className="flex items-center gap-3 text-blue-500 mb-4 font-black uppercase tracking-[0.3em]">
          <ShieldCheck size={20} />
          <span>Founder's Access Granted</span>
        </div>
        <h1 className="text-7xl md:text-8xl font-black italic text-white uppercase leading-none tracking-tighter">
          THE <span className="text-blue-500 font-outline-2">HANGAR</span>
        </h1>
      </div>
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
        <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Member ID Status</p>
        <p className="text-green-500 font-mono text-xl">USJET-PRIME-ACTIVE</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PREMIUM_UNITS.map((unit, i) => (
        <a key={i} href={unit.link} target="_blank" rel="noreferrer" 
           className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-blue-500/50 transition-all group relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Zap size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-black text-blue-500 border border-blue-500/30 px-3 py-1 rounded-full uppercase italic">
              Unlocking...
            </span>
          </div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
            {unit.n}
          </h3>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest italic">Instant Access Link</p>
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Unlock size={100} className="text-white" />
          </div>
        </a>
      ))}
    </div>
  </div>
);

export default Hangar;