import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { MemberAuthProvider } from "./context/MemberAuthContext";
import { restoreAtmosphereLive } from "./lib/usjetAtmosphere";

/** Warp tunnel is always live — Protocol ceremony is an overlay, not a gate. */
restoreAtmosphereLive();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemberAuthProvider>
      <App />
    </MemberAuthProvider>
  </StrictMode>,
);
