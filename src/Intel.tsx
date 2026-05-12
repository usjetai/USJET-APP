import React from 'react';
import { Activity, Newspaper, TrendingUp } from 'lucide-react';

const INTEL_DATA = [
  { n: "OpenAI", d: "Industry leader in large language models. Creators of GPT-4o and Sora. Their architecture focuses on multi-modal reasoning and creative content generation at scale. Currently the standard for conversational AI globally." },
  { n: "Google Gemini", d: "Deeply integrated into the world's most powerful search ecosystem. Gemini features massive context windows and native multi-modal processing. It is built for speed, accuracy, and enterprise-grade search capabilities." },
  { n: "Anthropic", d: "Specializes in 'Constitutional AI' and safety. Claude is known for human-like writing, complex coding abilities, and high-reliability reasoning. A top choice for developers who require precision and safety-first logic." }
];

const Intel = () => (
  <div className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
    <div className="mb-12 p-4 bg-blue-600/10 border-y border-blue-500/30 overflow-hidden whitespace-nowrap">
      <div className="flex gap-12 animate-pulse">
         <span className="text-white font-black italic">BTC: $62,450 <TrendingUp size={14} className="inline text-green-500"/></span>
         <span className="text-white font-black italic">NVDA: $895.40 <TrendingUp size={14} className="inline text-green-500"/></span>
         <span className="text-white font-black italic">ETH: $2,980 <TrendingUp size={14} className="inline text-green-500"/></span>
         <span className="text-white font-black italic">USJET: ACTIVE <TrendingUp size={14} className="inline text-blue-500"/></span>
      </div>
    </div>
    <div className="flex items-center gap-5 mb-16 border-b border-blue-500/20 pb-8 text-white text-left">
      <Activity className="text-blue-500" size={48} />
      <h2 className="text-7xl font-black italic uppercase tracking-tighter">Intel Stream</h2>
    </div>
    <div className="grid grid-cols-1 gap-8">
      {INTEL_DATA.map((u, i) => (
        <div key={i} className="p-10 rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-xl text-left">
          <h3 className="text-4xl font-black text-white italic uppercase mb-4 tracking-tight">{u.n} Intelligence</h3>
          <p className="text-white/60 text-lg italic leading-relaxed">{u.d}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Intel;