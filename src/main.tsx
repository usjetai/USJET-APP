import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { MemberAuthProvider } from "./context/MemberAuthContext";
import { bootstrapAtmosphere } from "./lib/usjetAtmosphere";

/** Black void on every load — warp unlocks when Protocol ceremony completes. */
bootstrapAtmosphere();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemberAuthProvider>
      <App />
    </MemberAuthProvider>
  </StrictMode>,
);
