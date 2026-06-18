import { useEffect } from "react";
import { restoreAtmosphereLive } from "../../lib/usjetAtmosphere";

/** Keep hyperspace atmosphere armed on every route — Protocol boot is a layer on top. */
export default function UsjetAtmosphereBoot() {
  useEffect(() => {
    restoreAtmosphereLive();
  }, []);

  return null;
}
