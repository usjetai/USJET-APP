import { useEffect, useState } from "react";
import {
  isAtmosphereLive,
  USJET_ATMOSPHERE_LIVE_EVENT,
  USJET_ATMOSPHERE_RESET_EVENT,
} from "../lib/usjetAtmosphere";

/** Tracks Protocol-gated warp layers — off until ceremony completes. */
export function useAtmosphereLive(): boolean {
  const [live, setLive] = useState(() => isAtmosphereLive());

  useEffect(() => {
    const sync = () => setLive(isAtmosphereLive());
    sync();
    window.addEventListener(USJET_ATMOSPHERE_LIVE_EVENT, sync);
    window.addEventListener(USJET_ATMOSPHERE_RESET_EVENT, sync);
    return () => {
      window.removeEventListener(USJET_ATMOSPHERE_LIVE_EVENT, sync);
      window.removeEventListener(USJET_ATMOSPHERE_RESET_EVENT, sync);
    };
  }, []);

  return live;
}
