import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FleetUnit } from "../types/fleet";
import { FLEET_UNIT_COUNT } from "../types/fleet";

export type HangarWorkbenchCell =
  | { mode: "unit"; unit: FleetUnit }
  | { mode: "expanded"; unit: FleetUnit };

type Expansion = { slot: number; unit: FleetUnit };

const WORKBENCH_FULL_TOAST_MS = 3400;
const WORKBENCH_TOAST_DEBOUNCE_MS = 750;

/**
 * Hangar bay floor: each expansion stays in its own grid cell (no 2×2 quad / void tiles).
 */
export function useHangarGridExpansions(
  unitBySlot: ReadonlyMap<number, FleetUnit>,
  maxExpansions: number,
) {
  const [expansions, setExpansions] = useState<Expansion[]>([]);
  const [workbenchFullToast, setWorkbenchFullToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const lastToastAtRef = useRef(0);

  const flashWorkbenchFullToast = useCallback(() => {
    const now = Date.now();
    if (now - lastToastAtRef.current < WORKBENCH_TOAST_DEBOUNCE_MS) {
      return;
    }
    lastToastAtRef.current = now;
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setWorkbenchFullToast(true);
    toastTimerRef.current = window.setTimeout(() => {
      setWorkbenchFullToast(false);
      toastTimerRef.current = null;
    }, WORKBENCH_FULL_TOAST_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const tryExpand = useCallback(
    (unit: FleetUnit) => {
      const slot = unit.slot;
      let rejectFull = false;

      setExpansions((prev) => {
        const same = prev.find((e) => e.slot === slot);
        if (same) {
          return prev.filter((e) => e.slot !== slot);
        }

        if (prev.length >= maxExpansions) {
          rejectFull = true;
          return prev;
        }

        return [...prev, { slot, unit }];
      });

      if (rejectFull) {
        flashWorkbenchFullToast();
      }
    },
    [flashWorkbenchFullToast, maxExpansions],
  );

  const closeExpansion = useCallback((slot: number) => {
    setExpansions((prev) => prev.filter((e) => e.slot !== slot));
  }, []);

  const cellPlan = useMemo(() => {
    const plan = new Map<number, HangarWorkbenchCell>();
    const expandedBySlot = new Map(expansions.map((e) => [e.slot, e.unit]));

    for (let slot = 0; slot < FLEET_UNIT_COUNT; slot++) {
      const unit = unitBySlot.get(slot);
      if (!unit) continue;

      const expandedUnit = expandedBySlot.get(slot);
      if (expandedUnit) {
        plan.set(slot, { mode: "expanded", unit: expandedUnit });
      } else {
        plan.set(slot, { mode: "unit", unit });
      }
    }

    return plan;
  }, [expansions, unitBySlot]);

  return {
    tryExpand,
    closeExpansion,
    cellPlan,
    workbenchFullToast,
  };
}
