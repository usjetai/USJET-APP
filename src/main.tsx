import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { MemberAuthProvider } from "./context/MemberAuthContext";
import { bootstrapAtmosphere } from "./lib/usjetAtmosphere";
import { initAnalytics } from "./lib/analytics";
import { inject } from "@vercel/analytics";

/** Black void on every load — warp unlocks when Protocol ceremony completes. */
bootstrapAtmosphere();

/** Load web analytics (dormant unless VITE_GA4_MEASUREMENT_ID is set). */
initAnalytics();

/** Initialize Vercel Web Analytics */
inject();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemberAuthProvider>
      <App />
    </MemberAuthProvider>
  </StrictMode>,
);
