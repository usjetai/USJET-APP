import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SilentHangarProvider } from "./context/SilentHangarContext";
import { UsjetExternalNavigationProvider } from "./context/UsjetExternalNavigationContext";
import { HardwareCartProvider } from "./context/HardwareCartContext";
import AppNav from "./components/layout/AppNav";
import UsjetReturnFab from "./components/layout/UsjetReturnFab";
import PageTransition from "./components/layout/PageTransition";
import UsjetGlobalContactBar from "./components/layout/UsjetGlobalContactBar";
import UsjetAtmosphereBoot from "./components/layout/UsjetAtmosphereBoot";
import UsjetProtocolBootOverlay from "./components/layout/UsjetProtocolBootOverlay";
import SiteLatchMenu from "./components/layout/SiteLatchMenu";
import SeoHead from "./components/layout/SeoHead";
import AnalyticsRouteTracker from "./components/layout/AnalyticsRouteTracker";

const Hangar = lazy(() => import("./pages/Hangar"));
const Fleet = lazy(() => import("./pages/Fleet"));
const Sos = lazy(() => import("./pages/Sos"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const MobileLandscapeGuide = lazy(() => import("./pages/MobileLandscapeGuide"));
const ProtocolSessionProof = lazy(() => import("./pages/ProtocolSessionProof"));
const AiComputers = lazy(() => import("./pages/AiComputers"));
const AiComputersHomes = lazy(() => import("./pages/AiComputersHomes"));
const AiComputersBusinesses = lazy(() => import("./pages/AiComputersBusinesses"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Store = lazy(() => import("./pages/Store"));
const AviationBooks = lazy(() => import("./pages/AviationBooks"));
const Cockpit = lazy(() => import("./pages/Cockpit"));

function RouteFallback() {
  return (
    <div
      className="route-suspense-fallback flex min-h-[38vh] items-center justify-center px-6"
      aria-live="polite"
    >
      <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-sky-300/55">
        Loading flight deck…
      </span>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname} routeKey={location.pathname}>
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Hangar />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/hangar" element={<Navigate to="/" replace />} />
            <Route path="/sos" element={<Sos />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/ai-101" element={<Navigate to="/" replace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/compare" element={<Navigate to="/" replace />} />
            <Route path="/compare/:slug" element={<Navigate to="/" replace />} />
            <Route path="/store" element={<Store />} />
            <Route path="/aviation-books" element={<AviationBooks />} />
            <Route path="/books" element={<Navigate to="/store" replace />} />
            <Route path="/merch" element={<Navigate to="/store" replace />} />
            <Route path="/store/ai-computers" element={<AiComputers />} />
            <Route path="/store/ai-computers/homes" element={<AiComputersHomes />} />
            <Route path="/store/ai-computers/businesses" element={<AiComputersBusinesses />} />
            <Route path="/ai-computers" element={<Navigate to="/store/ai-computers" replace />} />
            <Route path="/ai-computers/homes" element={<Navigate to="/store/ai-computers/homes" replace />} />
            <Route path="/ai-computers/businesses" element={<Navigate to="/store/ai-computers/businesses" replace />} />
            <Route path="/shop" element={<Navigate to="/store/ai-computers" replace />} />
            <Route path="/landscape" element={<MobileLandscapeGuide />} />
            <Route path="/protocol-proof" element={<ProtocolSessionProof />} />
            {/* Retired: subscriptions, member portal, collectibles, gaming, donation pages — computers-only pivot. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

function AppChrome() {
  const location = useLocation();
  const cockpitMode = location.pathname === "/cockpit";

  if (cockpitMode) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/cockpit" element={<Cockpit />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <SiteLatchMenu />
      <AppNav />
      <main className="relative z-10 flex-1">
        <AnimatedRoutes />
      </main>
    </>
  );
}

function AppShell() {
  const location = useLocation();
  const hangarEmbed =
    location.pathname === "/cockpit" &&
    new URLSearchParams(location.search).get("embed") === "hangar";

  return (
    <div
      id="usjet-app-shell"
      className={[
        "relative flex min-h-screen flex-col overflow-x-clip bg-black text-white",
        hangarEmbed ? "usjet-app-shell--hangar-embed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AppChrome />
      {hangarEmbed ? null : <UsjetGlobalContactBar />}
      <UsjetAtmosphereBoot />
      {hangarEmbed ? null : <UsjetProtocolBootOverlay />}
      {hangarEmbed ? null : <UsjetReturnFab />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <SeoHead />
      <AnalyticsRouteTracker />
      <SilentHangarProvider>
        <UsjetExternalNavigationProvider>
          <HardwareCartProvider>
            <AppShell />
          </HardwareCartProvider>
        </UsjetExternalNavigationProvider>
      </SilentHangarProvider>
    </Router>
  );
}
