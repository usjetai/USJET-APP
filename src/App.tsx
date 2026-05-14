import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AppNav from "./components/layout/AppNav";
import PageTransition from "./components/layout/PageTransition";
import Usa250Countdown from "./components/layout/Usa250Countdown";
import MovingBackground from "./components/layout/MovingBackground";
import GlobalVideoBackground from "./components/layout/GlobalVideoBackground";
import Fleet from "./pages/Fleet";
import Hangar from "./pages/Hangar";
import Intel from "./pages/Intel";
import Founder from "./pages/Founder";
import Origin from "./pages/Origin";
import FounderSpecial1995 from "./pages/FounderSpecial1995";
import Special from "./pages/Special";
import MemberPortal from "./pages/MemberPortal";

const globalAtmosphereStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: -10,
  pointerEvents: "none",
} as const;

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname} routeKey={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Fleet />} />
          <Route path="/hangar" element={<Hangar />} />
          <Route path="/intel" element={<Intel />} />
          <Route path="/founder" element={<Founder />} />
          <Route path="/origin" element={<Origin />} />
          <Route path="/founder-special-1995" element={<FounderSpecial1995 />} />
          <Route path="/special" element={<Special />} />
          <Route path="/member" element={<MemberPortal />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white">
        <div id="global-atmosphere" style={globalAtmosphereStyle}>
          <div aria-hidden className="moving-clouds" />
        </div>

        <GlobalVideoBackground />

        <MovingBackground />

        <div aria-hidden className="aviation-pulse aviation-pulse--warp" />

        <AppNav />

        <main className="relative z-10">
          <AnimatedRoutes />
        </main>

        <div className="fixed bottom-5 left-4 right-4 z-[100] flex flex-col gap-1.5 text-[9px] font-black uppercase italic tracking-[0.3em] text-white/30 sm:bottom-6 sm:left-8 sm:right-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="h-2 w-2 shrink-0 animate-ping rounded-full bg-blue-500" />
            <span>USJET System Active // Port 8080</span>
          </div>
          <Usa250Countdown />
        </div>
      </div>
    </Router>
  );
}
