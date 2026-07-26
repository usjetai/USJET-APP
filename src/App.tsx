import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { OriginLimitedOfferProvider } from "./context/OriginLimitedOfferContext";
import { SilentHangarProvider } from "./context/SilentHangarContext";
import { UsjetExternalNavigationProvider } from "./context/UsjetExternalNavigationContext";
import AppNav from "./components/layout/AppNav";
import UsjetReturnFab from "./components/layout/UsjetReturnFab";
import PageTransition from "./components/layout/PageTransition";
import UsjetGlobalContactBar from "./components/layout/UsjetGlobalContactBar";
import UsjetAtmosphereBoot from "./components/layout/UsjetAtmosphereBoot";
import UsjetProtocolBootOverlay from "./components/layout/UsjetProtocolBootOverlay";
import GlobalBackgroundBeat from "./components/layout/GlobalBackgroundBeat";
import GlobalVideoBackground from "./components/layout/GlobalVideoBackground";
import WarpBackground from "./components/layout/WarpBackground";
import SiteAudioPrime from "./components/layout/SiteAudioPrime";
import YouTubeAudioBackground from "./components/layout/YouTubeAudioBackground";
import { GLOBAL_BACKGROUND_BEAT_ENABLED } from "./data/globalBackgroundBeat";
import SiteLatchMenu from "./components/layout/SiteLatchMenu";
import TierRouteGate from "./components/member/TierRouteGate";
import SeoHead from "./components/layout/SeoHead";
import AnalyticsRouteTracker from "./components/layout/AnalyticsRouteTracker";
import { useAtmosphereLive } from "./hooks/useAtmosphereLive";

const Fleet = lazy(() => import("./pages/Fleet"));
const Hangar = lazy(() => import("./pages/Hangar"));
const Intel = lazy(() => import("./pages/Intel"));
const Origin = lazy(() => import("./pages/Origin"));
const Special = lazy(() => import("./pages/Special"));
const MemberPortal = lazy(() => import("./pages/MemberPortal"));
const MemberLogin = lazy(() => import("./pages/MemberLogin"));
const Sos = lazy(() => import("./pages/Sos"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Ai101 = lazy(() => import("./pages/Ai101"));
const CodeKit = lazy(() => import("./pages/CodeKit"));
const DirectFuel = lazy(() => import("./pages/DirectFuel"));
const DirectFuelZelle = lazy(() => import("./pages/DirectFuelZelle"));
const MobileLandscapeGuide = lazy(() => import("./pages/MobileLandscapeGuide"));
const ProtocolSessionProof = lazy(() => import("./pages/ProtocolSessionProof"));
const SupportFleet = lazy(() => import("./pages/SupportFleet"));
const FoundersFuel = lazy(() => import("./pages/FoundersFuel"));
const FleetDirectory = lazy(() => import("./pages/FleetDirectory"));
const FleetCallsignPage = lazy(() => import("./pages/FleetCallsignPage"));
const FleetProductPage = lazy(() => import("./pages/FleetProductPage"));
const IntelligenceAssets = lazy(() => import("./pages/IntelligenceAssets"));
const StrategicAssets = lazy(() => import("./pages/StrategicAssets"));
const Sovereignty = lazy(() => import("./pages/Sovereignty"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CompareHub = lazy(() => import("./pages/CompareHub"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const Cockpit = lazy(() => import("./pages/Cockpit"));
const Gamers = lazy(() => import("./pages/Gamers"));
const Gaming = lazy(() => import("./pages/Gaming"));
const HiredHud = lazy(() => import("./pages/HiredHud"));
const Hoops = lazy(() => import("./pages/Hoops"));
const JetBrowser = lazy(() => import("./pages/JetBrowser"));
const X = lazy(() => import("./pages/X"));

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
            <Route
              path="/"
              element={
                <TierRouteGate path="/" pageLabel="Hangar">
                  <Hangar />
                </TierRouteGate>
              }
            />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/hangar" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<MemberLogin />} />
            <Route
              path="/intel"
              element={
                <TierRouteGate path="/intel" pageLabel="Intel">
                  <Intel />
                </TierRouteGate>
              }
            />
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/vr" element={<Gaming />} />
            <Route path="/gamers" element={<Gamers />} />
            <Route path="/x" element={<X />} />
            <Route path="/sos" element={<Sos />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/ai-101" element={<Ai101 />} />
            <Route path="/code-kit" element={<CodeKit />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/compare" element={<CompareHub />} />
            <Route path="/compare/:slug" element={<ComparePage />} />
            <Route path="/support-fleet" element={<SupportFleet />} />
            <Route path="/intelligence" element={<IntelligenceAssets />} />
            <Route path="/strategic-assets" element={<StrategicAssets />} />
            <Route path="/sovereignty" element={<Sovereignty />} />
            <Route path="/founders-fuel" element={<FoundersFuel />} />
            <Route path="/cash" element={<DirectFuel />} />
            <Route path="/zelle" element={<DirectFuelZelle />} />
            <Route path="/landscape" element={<MobileLandscapeGuide />} />
            <Route path="/protocol-proof" element={<ProtocolSessionProof />} />
            <Route path="/fleet-manual" element={<Navigate to="/special" replace />} />
            <Route path="/pricing" element={<Navigate to="/special" replace />} />
            <Route path="/fleet-directory" element={<FleetDirectory />} />
            <Route path="/fleet-directory/:callsign" element={<FleetCallsignPage />} />
            <Route path="/product/:callsign" element={<FleetProductPage />} />
            <Route path="/hired-hud" element={<HiredHud />} />
            <Route path="/hoops" element={<Hoops />} />
            <Route path="/app/hoops" element={<Hoops />} />
            <Route
              path="/jet-browser"
              element={
                <TierRouteGate path="/jet-browser" pageLabel="Jet Browser">
                  <JetBrowser />
                </TierRouteGate>
              }
            />
            <Route
              path="/origin"
              element={
                <TierRouteGate path="/origin" pageLabel="Origin">
                  <Origin />
                </TierRouteGate>
              }
            />
            <Route path="/special" element={<Special />} />
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
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
}

function AppChrome() {
  const location = useLocation();
  const cockpitMode = location.pathname === "/cockpit";
  const atmosphereLive = useAtmosphereLive();

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
      <WarpBackground />
      {atmosphereLive ? <GlobalVideoBackground /> : null}
      {atmosphereLive ? (
        <>
          <YouTubeAudioBackground />
          {GLOBAL_BACKGROUND_BEAT_ENABLED ? <GlobalBackgroundBeat /> : null}
          {GLOBAL_BACKGROUND_BEAT_ENABLED ? <SiteAudioPrime /> : null}
        </>
      ) : null}
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
        "relative flex min-h-screen flex-col overflow-x-hidden bg-transparent text-white",
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
      <OriginLimitedOfferProvider>
        <SilentHangarProvider>
          <UsjetExternalNavigationProvider>
            <AppShell />
          </UsjetExternalNavigationProvider>
        </SilentHangarProvider>
      </OriginLimitedOfferProvider>
    </Router>
  );
}
