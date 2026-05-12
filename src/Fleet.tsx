import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

const UNITS = [
  { id: "openai", n: "OpenAI", t: "GPT-4o", dom: "openai.com" },
  { id: "anthropic", n: "Anthropic", t: "CLAUDE 3.5", dom: "anthropic.com" },
  { id: "google", n: "Google", t: "GEMINI 1.5", dom: "deepmind.google" },
  { id: "meta", n: "Meta", t: "LLAMA 3", dom: "meta.ai" },
  { id: "xai", n: "xAI", t: "GROK-1.5", dom: "x.ai" },
  { id: "mistral", n: "Mistral", t: "LARGE 2", dom: "mistral.ai" },
  { id: "nvidia", n: "NVIDIA", t: "NVDA-AI", dom: "nvidia.com" },
  { id: "microsoft", n: "Microsoft", t: "CO-PILOT", dom: "microsoft.com" },
  ...Array.from({ length: 22 }, (_, i) => ({ id: `u${i+9}`, n: `Unit ${i+9}`, t: `JET-${i+9}`, dom: "usjet.ai" }))
];

const Fleet = () => (
  <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-8xl md:text-[11rem] font-black italic text-white uppercase leading-none tracking-tighter mb-16">
      USJET<span className="text-blue-500">.AI</span>
    </motion.h1>
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {UNITS.map((u, i) => (
        <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center group hover:bg-blue-600/10 hover:border-blue-500/50 transition-all cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-blue-900/20 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">
            <Cpu size={32} className="text-blue-500" />
          </div>
          <span className="text-[11px] font-black text-white/90 uppercase tracking-tight text-center">{u.n}</span>
          <span className="text-[9px] font-bold text-blue-500 uppercase mt-1">{u.t}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Fleet;
