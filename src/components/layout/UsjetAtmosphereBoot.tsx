import { useEffect } from "react";
import { applyPreAtmosphere, restoreAtmosphereLive } from "../../lib/usjetAtmosphere";
import { isLiveTerminalArmed } from "../../lib/protocolCeremony";

/** On load: void sky until Protocol has run; returning visitors keep warp. */
export default function UsjetAtmosphereBoot() {
  useEffect(() => {
    if (isLiveTerminalArmed()) {
      restoreAtmosphereLive();
      return;
    }
    applyPreAtmosphere();
  }, []);

  return null;
}
