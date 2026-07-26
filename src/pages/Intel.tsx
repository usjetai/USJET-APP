import { useMemo, type ReactNode } from "react";

import IntelExpandedWorkbench from "../components/intel/IntelExpandedWorkbench";
import IntelMonitor from "../components/intel/IntelMonitor";
import { IntelLiveMarketProvider } from "../context/IntelLiveMarketContext";
import { fleetManifest } from "../data/fleetManifest";
import { useFleetGridExpansions } from "../hooks/useFleetGridExpansions";
import { type FleetUnit, FLEET_UNIT_COUNT, HANGAR_COLUMNS, HANGAR_ROWS } from "../types/fleet";

const intelUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);

const unitBySlot = new Map<number, FleetUnit>(intelUnits.map((u) => [u.slot, u]));

/** Temporary open board — every tile can open to view prices; tier caps later. */
const INTEL_OPEN_BOARD_MAX = FLEET_UNIT_COUNT;

function IntelPageContent() {
  const { tryExpand, closeExpansion, cellPlan, workbenchFullToast } = useFleetGridExpansions(unitBySlot, {
    maxSimultaneous: INTEL_OPEN_BOARD_MAX,
    replaceOnConflict: true,
  });

  const gridCells = useMemo(() => {
    const out: ReactNode[] = [];

    for (let slot = 0; slot < FLEET_UNIT_COUNT; slot++) {
      const cell = cellPlan.get(slot);
      if (!cell) continue;

      const r0 = Math.floor(slot / HANGAR_COLUMNS);
      const c0 = slot % HANGAR_COLUMNS;
      const gridRow = r0 + 1;
      const gridColumn = c0 + 1;

      if (cell.mode === "void") {
        out.push(
          <div
            key={`void-${slot}`}
            className="intel-grid__void"
            style={{ gridRow, gridColumn }}
            aria-hidden
          />,
        );
        continue;
      }

      if (cell.mode === "expanded") {
        out.push(
          <IntelExpandedWorkbench
            key={`expanded-${slot}`}
            unit={cell.unit}
            onClose={() => closeExpansion(slot)}
            gridStyle={{
              gridRow: `${gridRow} / span 2`,
              gridColumn: `${gridColumn} / span 2`,
            }}
          />,
        );
        continue;
      }

      out.push(
        <IntelMonitor
          key={`mon-${slot}`}
          unit={cell.unit}
          index={slot}
          onExpandRequest={() => tryExpand(cell.unit)}
          style={{ gridRow, gridColumn }}
        />,
      );
    }

    return out;
  }, [cellPlan, closeExpansion, tryExpand]);

  return (
    <div className="intel-page">
      {workbenchFullToast ? (
        <div className="intel-hangar-toast" role="status" aria-live="polite" aria-atomic="true">
          <p className="intel-hangar-toast__title">Hangar full</p>
          <p className="intel-hangar-toast__body">
            Close a workstation to open another 2×2 bay.
          </p>
        </div>
      ) : null}

      <div className="intel-page__shell page-atmosphere page-nav-offset mx-auto max-w-[88rem] px-4 pb-24 sm:px-6 lg:px-8">
        <div className="intel-page__grid-intro">
          <p className="intel-page__grid-kicker">Intel monitor grid</p>
          <p className="intel-page__grid-copy">
            {HANGAR_COLUMNS} wide · {HANGAR_ROWS} deep · {FLEET_UNIT_COUNT} fleet tiles · live Coinbase spot + NYSE
            board — click any tile to open prices (open board while we wire tiers).
          </p>
        </div>

        <div className="intel-grid-wrap">
          <div className="intel-grid grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">{gridCells}</div>
        </div>
      </div>
    </div>
  );
}

const Intel = () => (
  <IntelLiveMarketProvider>
    <IntelPageContent />
  </IntelLiveMarketProvider>
);

export default Intel;
