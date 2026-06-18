import { useEffect } from "react";
import { bootstrapAtmosphere } from "../../lib/usjetAtmosphere";

/** Reinforce void sky on mount — warp mounts only after Protocol completes. */
export default function UsjetAtmosphereBoot() {
  useEffect(() => {
    bootstrapAtmosphere();
  }, []);

  return null;
}
