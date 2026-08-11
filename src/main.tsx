import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import "./index.css";
import App from "./App";
import { MemberAuthProvider } from "./context/MemberAuthContext";
import { bootstrapAtmosphere } from "./lib/usjetAtmosphere";
import { initAnalytics } from "./lib/analytics";

/** Black void on every load — warp unlocks when Protocol ceremony completes. */
bootstrapAtmosphere();

/** Load web analytics (dormant unless VITE_GA4_MEASUREMENT_ID is set). */
initAnalytics();

/** Vercel Web Analytics + Speed Insights — live traffic in the Vercel dashboard. */
inject();
injectSpeedInsights();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemberAuthProvider>
      <App />
    </MemberAuthProvider>
  </StrictMode>,
);
