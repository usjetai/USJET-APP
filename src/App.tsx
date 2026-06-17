import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { OriginLimitedOfferProvider } from "./context/OriginLimitedOfferContext";
import { SilentHangarProvider } from "./context/SilentHangarContext";
import AppNav from "./components/layout/AppNav";
import PageTransition from "./components/layout/PageTransition";
import UsjetGlobalContactBar from "./components/layout/UsjetGlobalContactBar";
import UsjetAtmosphereBoot from "./components/layout/UsjetAtmosphereBoot";
import UsjetProtocolBootOverlay from "./components/layout/UsjetProtocolBootOverlay";
import WarpBackground from "./components/layout/WarpBackground";
import GlobalBackgroundBeat from "./components/layout/GlobalBackgroundBeat";
import GlobalVideoBackground from "./components/layout/GlobalVideoBackground";
import SiteAudioPrime from "./components/layout/SiteAudioPrime";
import { GLOBAL_BACKGROUND_BEAT_ENABLED } from "./data/globalBackgroundBeat";
import SiteLatchMenu from "./components/layout/SiteLatchMenu";
import TierRouteGate from "./components/member/TierRouteGate";
import CanonicalHead from "./components/layout/CanonicalHead";

const Fleet = lazy(() => import("./pages/Fleet"));
const Hangar = lazy(() => import("./pages/Hangar"));
const Intel = lazy(() => import("./pages/Intel"));
const Founder = lazy(() => import("./pages/Founder"));
const Origin = lazy(() => import("./pages/Origin"));
const FounderSpecial1995 = lazy(() => import("./pages/FounderSpecial1995"));
const Special = lazy(() => import("./pages/Special"));
const MemberPortal = lazy(() => import("./pages/MemberPortal"));
const MemberLogin = lazy(() => import("./pages/MemberLogin"));
const Sos = lazy(() => import("./pages/Sos"));
const Ai101 = lazy(() => import("./pages/Ai101"));
const CodeKit = lazy(() => import("./pages/CodeKit"));
const DirectFuel = lazy(() => import("./pages/DirectFuel"));
const DirectFuelZelle = lazy(() => import("./pages/DirectFuelZelle"));
const MobileLandscapeGuide = lazy(() => import("./pages/MobileLandscapeGuide"));
const ProtocolSessionProof = lazy(() => import("./pages/ProtocolSessionProof"));
const PdrePartnership = lazy(() => import("./pages/PdrePartnership"));
const BrandLicensing = lazy(() => import("./pages/BrandLicensing"));
const SupportFleet = lazy(() => import("./pages/SupportFleet"));
const FoundersFuel = lazy(() => import("./pages/FoundersFuel"));
const FleetDirectory = lazy(() => import("./pages/FleetDirectory"));
const FleetCallsignPage = lazy(() => import("./pages/FleetCallsignPage"));
const FleetProductPage = lazy(() => import("./pages/FleetProductPage"));
const FleetManual = lazy(() => import("./pages/FleetManual"));
const IntelligenceAssets = lazy(() => import("./pages/IntelligenceAssets"));
const StrategicAssets = lazy(() => import("./pages/StrategicAssets"));
const Sovereignty = lazy(() => import("./pages/Sovereignty"));
const SovereignBlueprint100k = lazy(() => import("./pages/SovereignBlueprint100k"));
const B2bEnterprise = lazy(() => import("./pages/B2bEnterprise"));
const B2k = lazy(() => import("./pages/B2k"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Cockpit = lazy(() => import("./pages/Cockpit"));
const Gamers = lazy(() => import("./pages/Gamers"));
const Gaming = lazy(() => import("./pages/Gaming"));
const HiredHud = lazy(() => import("./pages/HiredHud"));

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
            <Route path="/gaming" element={<Gaming />} />
            <Route path="/vr" element={<Gaming />} />
            <Route path="/gamers" element={<Gamers />} />
            <Route path="/sos" element={<Sos />} />
            <Route path="/ai-101" element={<Ai101 />} />
            <Route path="/code-kit" element={<CodeKit />} />
            <Route path="/b2b" element={<B2bEnterprise />} />
            <Route path="/b2k" element={<B2k />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/pdre" element={<PdrePartnership />} />
            <Route path="/licensing" element={<BrandLicensing />} />
            <Route path="/support-fleet" element={<SupportFleet />} />
            <Route path="/intelligence" element={<IntelligenceAssets />} />
            <Route path="/strategic-assets" element={<StrategicAssets />} />
            <Route path="/sovereignty" element={<Sovereignty />} />
            <Route path="/founders-fuel" element={<FoundersFuel />} />
            <Route path="/cash" element={<DirectFuel />} />
            <Route path="/zelle" element={<DirectFuelZelle />} />
            <Route path="/landscape" element={<MobileLandscapeGuide />} />
            <Route path="/protocol-proof" element={<ProtocolSessionProof />} />
            <Route path="/fleet-manual" element={<FleetManual />} />
            <Route path="/fleet-directory" element={<FleetDirectory />} />
            <Route path="/fleet-directory/:callsign" element={<FleetCallsignPage />} />
            <Route path="/product/:callsign" element={<FleetProductPage />} />
            <Route path="/hired-hud" element={<HiredHud />} />
            <Route path="/100k" element={<SovereignBlueprint100k />} />
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
      <WarpBackground />
      <GlobalVideoBackground />
      {GLOBAL_BACKGROUND_BEAT_ENABLED ? <GlobalBackgroundBeat /> : null}
      {GLOBAL_BACKGROUND_BEAT_ENABLED ? <SiteAudioPrime /> : null}
      <div aria-hidden className="aviation-pulse aviation-pulse--warp" />
      <SiteLatchMenu />
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
      <CanonicalHead />
      <OriginLimitedOfferProvider>
        <SilentHangarProvider>
          <div
            id="usjet-app-shell"
            className="relative min-h-screen overflow-x-hidden bg-transparent text-white"
          >
            <AppChrome />
            <UsjetGlobalContactBar />
            <UsjetAtmosphereBoot />
            <UsjetProtocolBootOverlay />
          </div>
        </SilentHangarProvider>
      </OriginLimitedOfferProvider>
    </Router>
  );
}
