import { useEffect } from "react";
import { syncAtmosphereWithSession } from "../../lib/usjetAtmosphere";
import { isLiveTerminalArmed } from "../../lib/protocolCeremony";

/** On load: void sky until Protocol has run; returning visitors keep warp. */
export default function UsjetAtmosphereBoot() {
  useEffect(() => {
    syncAtmosphereWithSession(isLiveTerminalArmed());
  }, []);

  return null;
}
