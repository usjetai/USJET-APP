import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNav from "./components/layout/AppNav";
import MovingBackground from "./components/layout/MovingBackground";
import Fleet from "./pages/Fleet";
import Hangar from "./pages/Hangar";
import Intel from "./pages/Intel";
import Founder from "./pages/Founder";
import Origin from "./pages/Origin";

const globalAtmosphereStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: -10,
  pointerEvents: "none",
} as const;

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white">
        <div id="global-atmosphere" style={globalAtmosphereStyle}>
          <div aria-hidden className="moving-clouds" />
        </div>

        <MovingBackground />

        <AppNav />

        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Fleet />} />
            <Route path="/hangar" element={<Hangar />} />
            <Route path="/intel" element={<Intel />} />
            <Route path="/founder" element={<Founder />} />
            <Route path="/origin" element={<Origin />} />
          </Routes>
        </main>

        <div className="fixed bottom-6 left-8 z-[100] flex items-center gap-4 text-[9px] font-black uppercase italic tracking-[0.3em] text-white/30">
          <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
          USJET System Active // Port 8080
        </div>
      </div>
    </Router>
  );
}
