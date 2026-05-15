import { useEffect, useState } from "react";
import {
  FOOTER_SURPRISE_LANE_A_SEC,
  FOOTER_SURPRISE_LANE_B_SEC,
  FOOTER_SURPRISE_LANE_C_SEC,
  FOOTER_SURPRISE_PULSE_MS,
  hashFooterChipSeed,
  pickFooterSurpriseEffect,
  pickLaneDelaySec,
  type FooterSurpriseEffect,
} from "../lib/footerSurpriseEffects";

function laneClass(lane: "l0" | "l1" | "l2", effect: FooterSurpriseEffect | null): string {
  return effect ? `footer-surprise-${lane}--${effect}` : "";
}

/**
 * Three independent random-effect timers per footer chip (additive to existing CSS).
 */
export function useFooterSurprise(chipId: string): string {
  const [lane0, setLane0] = useState<FooterSurpriseEffect | null>(null);
  const [lane1, setLane1] = useState<FooterSurpriseEffect | null>(null);
  const [lane2, setLane2] = useState<FooterSurpriseEffect | null>(null);

  useEffect(() => {
    let alive = true;
    const timers: number[] = [];
    const seed = hashFooterChipSeed(chipId);

    const armLane = (
      laneIndex: number,
      intervals: readonly number[],
      setEffect: (effect: FooterSurpriseEffect | null) => void,
    ) => {
      const tick = () => {
        if (!alive) return;
        const delayMs = pickLaneDelaySec(intervals) * 1000;
        timers.push(
          window.setTimeout(() => {
            if (!alive) return;
            const effect = pickFooterSurpriseEffect();
            setEffect(effect);
            timers.push(
              window.setTimeout(() => {
                if (alive) setEffect(null);
              }, FOOTER_SURPRISE_PULSE_MS),
            );
            tick();
          }, delayMs),
        );
      };

      timers.push(window.setTimeout(tick, (seed % 2400) + laneIndex * 1300));
    };

    armLane(0, FOOTER_SURPRISE_LANE_A_SEC, setLane0);
    armLane(1, FOOTER_SURPRISE_LANE_B_SEC, setLane1);
    armLane(2, FOOTER_SURPRISE_LANE_C_SEC, setLane2);

    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [chipId]);

  return ["footer-surprise", laneClass("l0", lane0), laneClass("l1", lane1), laneClass("l2", lane2)]
    .filter(Boolean)
    .join(" ");
}
