import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { MemberAuthProvider } from "./context/MemberAuthContext";
import { restoreAtmosphereLive } from "./lib/usjetAtmosphere";
import { initAnalytics } from "./lib/analytics";

/** Warp on immediately — no Protocol boot theater on the hardware shop. */
restoreAtmosphereLive();

/** Load web analytics (dormant unless VITE_GA4_MEASUREMENT_ID is set). */
initAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemberAuthProvider>
      <App />
    </MemberAuthProvider>
  </StrictMode>,
);
