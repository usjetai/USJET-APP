import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  anchorIndexForSlot,
  MAX_SIMULTANEOUS_WORKBENCHES,
  quadSlotIndices,
  quadsOverlap,
} from "../lib/intelGridExpansion";
import type { FleetUnit } from "../types/fleet";
import { FLEET_UNIT_COUNT } from "../types/fleet";

export type FleetWorkbenchCell =
  | { mode: "void" }
  | { mode: "unit"; unit: FleetUnit }
  | { mode: "expanded"; unit: FleetUnit };

/** Each entry is one 2×2 bay: unique `anchor` (grid top-left) + full `unit` (own `href`, `id`). Up to three non-overlapping bays — they never share state or overwrite each other. */
type Expansion = { anchor: number; unit: FleetUnit };

const WORKBENCH_FULL_TOAST_MS = 3400;
const WORKBENCH_TOAST_DEBOUNCE_MS = 750;

/**
 * Shared 2×2 expansion state for Intel monitors and Hangar fleet tiles (same 6×5 slot grid).
 */
export function useFleetGridExpansions(unitBySlot: ReadonlyMap<number, FleetUnit>) {
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
      const anchor = anchorIndexForSlot(unit.slot);
      let rejectFull = false;

      setExpansions((prev) => {
        const same = prev.find((e) => e.anchor === anchor && e.unit.id === unit.id);
        if (same) {
          return prev.filter((e) => e.anchor !== anchor);
        }

        if (prev.some((e) => e.anchor === anchor)) {
          return prev;
        }

        if (prev.some((e) => quadsOverlap(e.anchor, anchor))) {
          return prev;
        }

        if (prev.length >= MAX_SIMULTANEOUS_WORKBENCHES) {
          rejectFull = true;
          return prev;
        }

        return [...prev, { anchor, unit }];
      });

      if (rejectFull) {
        flashWorkbenchFullToast();
      }
    },
    [flashWorkbenchFullToast],
  );

  const closeExpansion = useCallback((anchor: number) => {
    setExpansions((prev) => prev.filter((e) => e.anchor !== anchor));
  }, []);

  const cellPlan = useMemo(() => {
    const plan = new Map<number, FleetWorkbenchCell>();

    for (let slot = 0; slot < FLEET_UNIT_COUNT; slot++) {
      const unit = unitBySlot.get(slot);
      if (!unit) continue;

      let assigned = false;
      for (const ex of expansions) {
        const quad = quadSlotIndices(ex.anchor);
        if (!quad.includes(slot)) continue;
        assigned = true;
        if (ex.anchor === slot) {
          plan.set(slot, { mode: "expanded", unit: ex.unit });
        } else {
          plan.set(slot, { mode: "void" });
        }
        break;
      }

      if (!assigned) {
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
