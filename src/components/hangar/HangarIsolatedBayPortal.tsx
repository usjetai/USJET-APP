import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { HangarBayExpansion } from "../../hooks/useHangarGridExpansions";
import { setHangarBayIsolation } from "../../lib/hangarBayIsolation";
import HangarToolWorkbench from "./HangarToolWorkbench";

type HangarIsolatedBayPortalProps = {
  expansions: readonly HangarBayExpansion[];
  onClose: (slot: number) => void;
};

/** Full-bleed partner view — portaled above App shell; no nav, footer, or site chrome. */
export default function HangarIsolatedBayPortal({ expansions, onClose }: HangarIsolatedBayPortalProps) {
  const open = expansions.length > 0;
  const expansionsRef = useRef(expansions);
  expansionsRef.current = expansions;

  useEffect(() => {
    setHangarBayIsolation(open);
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      const active = expansionsRef.current;
      const last = active[active.length - 1];
      if (last) {
        onClose(last.slot);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      setHangarBayIsolation(false);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const gridClass = [
    "hangar-bay-isolation__grid",
    expansions.length === 1 ? "hangar-bay-isolation__grid--single" : "",
    expansions.length === 2 ? "hangar-bay-isolation__grid--dual" : "",
    expansions.length >= 3 ? "hangar-bay-isolation__grid--multi" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div className="hangar-bay-isolation" role="presentation" data-usjet-hangar-isolation="true">
      <div className={gridClass}>
        {expansions.map((expansion) => (
          <HangarToolWorkbench
            key={`hangar-isolated-${expansion.unit.id}-slot-${expansion.slot}`}
            unit={expansion.unit}
            onClose={() => onClose(expansion.slot)}
            isolated
          />
        ))}
      </div>
    </div>,
    document.body,
  );
}
