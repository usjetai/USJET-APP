import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Zap, ShieldCheck } from 'lucide-react';

// --- IMPORT YOUR SPECIALIZED BAYS ---
import Fleet from './Fleet';
import Intel from './Intel';
import Founder from './Founder';
import Hangar from './Hangar';

const MovingBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
    {[...Array(8)].map((_, i) => (
      <motion.div key={i} initial={{ x: '-100%', y: `${Math.random() * 100}%`, opacity: 0 }}
        animate={{ x: '250%', opacity: [0, 0.3, 0] }}
        transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: "linear", delay: i * 2 }}
        className="absolute h-[1px] w-[400px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
    ))}
  </div>
);

export default function App() {
  return (
    <Router>
      <MovingBackground />
      
      {/* GLOBAL NAVIGATION */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-8 p-4 px-10 rounded-full border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl">
        <div className="flex gap-8 border-r border-white/10 pr-8">
          <Link to="/" className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all italic">Fleet</Link>
          <Link to="/intel" className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all italic">Intel</Link>
          <Link to="/founder" className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all italic">Founder</Link>
        </div>

        {/* THE REVENUE BUTTON - $19.95 FOUNDER SPECIAL */}
        <a 
          href="https://buy.stripe.com/your_stripe_link_here" 
          target="_blank" 
          rel="noreferrer"
          className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
        >
          <ShieldCheck size={16} className="text-white animate-pulse" />
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] font-black uppercase tracking-tighter">Founder Special</span>
            <span className="text-[14px] font-black italic">$19.95<span className="text-[9px] lowercase opacity-70">/mo</span></span>
          </div>
        </a>
      </nav>

      {/* PAGE CONTENT CONTAINER */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Fleet />} />
          <Route path="/intel" element={<Intel />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/hangar" element={<Hangar />} />
        </Routes>
      </div>

      {/* FOOTER / STATUS BAR */}
      <div className="fixed bottom-6 left-8 z-[100] flex items-center gap-4 text-white/30 text-[9px] font-black uppercase tracking-[0.3em] italic">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        USJET System Active // Port 8080
      </div>
    </Router>
  );
}