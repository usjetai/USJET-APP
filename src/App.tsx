import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AppNav from "./components/layout/AppNav";
import PageTransition from "./components/layout/PageTransition";
import UsjetGlobalContactBar from "./components/layout/UsjetGlobalContactBar";
import WarpBackground from "./components/layout/WarpBackground";
import GlobalVideoBackground from "./components/layout/GlobalVideoBackground";
import Fleet from "./pages/Fleet";
import Hangar from "./pages/Hangar";
import Intel from "./pages/Intel";
import Founder from "./pages/Founder";
import Origin from "./pages/Origin";
import FounderSpecial1995 from "./pages/FounderSpecial1995";
import Special from "./pages/Special";
import MemberPortal from "./pages/MemberPortal";
import Cockpit from "./pages/Cockpit";

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

function AppChrome() {
  const location = useLocation();
  const cockpitMode = location.pathname === "/cockpit";

  if (cockpitMode) {
    return (
      <Routes>
        <Route path="/cockpit" element={<Cockpit />} />
      </Routes>
    );
  }

  return (
    <>
      <WarpBackground />
      <GlobalVideoBackground />
      <div aria-hidden className="aviation-pulse aviation-pulse--warp" />
      <AppNav />
      <main className="relative z-10">
        <AnimatedRoutes />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-x-hidden bg-transparent text-white">
        <AppChrome />
        <UsjetGlobalContactBar />
      </div>
    </Router>
  );
}
