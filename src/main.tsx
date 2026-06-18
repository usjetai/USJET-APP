import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { MemberAuthProvider } from "./context/MemberAuthContext";
import { syncAtmosphereWithSession } from "./lib/usjetAtmosphere";
import { isLiveTerminalArmed } from "./lib/protocolCeremony";

/** Black void on first visit; warp unlocks when Protocol ceremony completes. */
syncAtmosphereWithSession(isLiveTerminalArmed());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemberAuthProvider>
      <App />
    </MemberAuthProvider>
  </StrictMode>,
);
