import { useEffect } from "react";
import { restoreAtmosphereLive } from "../../lib/usjetAtmosphere";

/** Keep warp live — do not drop the shop into the Protocol void. */
export default function UsjetAtmosphereBoot() {
  useEffect(() => {
    restoreAtmosphereLive();
  }, []);

  return null;
}
