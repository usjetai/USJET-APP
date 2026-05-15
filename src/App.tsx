import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AppNav from "./components/layout/AppNav";
import PageTransition from "./components/layout/PageTransition";
import UsjetGlobalContactBar from "./components/layout/UsjetGlobalContactBar";
import WarpBackground from "./components/layout/WarpBackground";
import GlobalVideoBackground from "./components/layout/GlobalVideoBackground";
import TierRouteGate from "./components/member/TierRouteGate";
import Fleet from "./pages/Fleet";
import Hangar from "./pages/Hangar";
import Intel from "./pages/Intel";
import Founder from "./pages/Founder";
import Origin from "./pages/Origin";
import FounderSpecial1995 from "./pages/FounderSpecial1995";
import Special from "./pages/Special";
import MemberPortal from "./pages/MemberPortal";
import MemberLogin from "./pages/MemberLogin";
import Sos from "./pages/Sos";
import Ai101 from "./pages/Ai101";
import Cockpit from "./pages/Cockpit";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname} routeKey={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Fleet />} />
          <Route path="/login" element={<MemberLogin />} />
          <Route
            path="/hangar"
            element={
              <TierRouteGate path="/hangar" pageLabel="Hangar">
                <Hangar />
              </TierRouteGate>
            }
          />
          <Route
            path="/intel"
            element={
              <TierRouteGate path="/intel" pageLabel="Intel">
                <Intel />
              </TierRouteGate>
            }
          />
          <Route path="/founder" element={<Founder />} />
          <Route path="/sos" element={<Sos />} />
          <Route path="/ai-101" element={<Ai101 />} />
          <Route
            path="/origin"
            element={
              <TierRouteGate path="/origin" pageLabel="Origin">
                <Origin />
              </TierRouteGate>
            }
          />
          <Route
            path="/founder-special-1995"
            element={
              <TierRouteGate path="/founder-special-1995" pageLabel="1995 Grit Vault">
                <FounderSpecial1995 />
              </TierRouteGate>
            }
          />
          <Route
            path="/special"
            element={
              <TierRouteGate path="/special" pageLabel="Founder Special">
                <Special />
              </TierRouteGate>
            }
          />
          <Route path="/member/login" element={<MemberLogin />} />
          <Route
            path="/member"
            element={
              <TierRouteGate path="/member" pageLabel="Member Portal">
                <MemberPortal />
              </TierRouteGate>
            }
          />
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
