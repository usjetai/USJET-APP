import { useMemo, type ReactNode } from "react";
import AircraftIcon from "../components/icons/AircraftIcons";
import IntelExpandedWorkbench from "../components/intel/IntelExpandedWorkbench";
import IntelMonitor from "../components/intel/IntelMonitor";
import IntelReservedBay from "../components/intel/IntelReservedBay";
import IntelFleetVitals from "../components/intel/IntelFleetVitals";
import IntelPulseDashboard from "../components/intel/IntelPulseDashboard";
import IntelTop10Section from "../components/intel/IntelTop10Section";
import { fleetBayAccentStyle } from "../data/fleetBayAccents";
import { fleetManifest } from "../data/fleetManifest";
import { useFleetGridExpansions } from "../hooks/useFleetGridExpansions";
import { MAX_SIMULTANEOUS_WORKBENCHES } from "../lib/intelGridExpansion";
import { type FleetUnit, FLEET_UNIT_COUNT, HANGAR_COLUMNS, HANGAR_ROWS } from "../types/fleet";

const intelUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);

const unitBySlot = new Map<number, FleetUnit>(intelUnits.map((u) => [u.slot, u]));

const BORDER_FORMATION = [
  { accentId: "intel-border-l-1", aircraftType: "f22" as const, slotClass: "intel-page__escort-slot--wing", slot: 0 },
  { accentId: "intel-border-l-2", aircraftType: "sr71" as const, slotClass: "intel-page__escort-slot--lead", slot: 1 },
  { accentId: "intel-border-l-3", aircraftType: "f35" as const, slotClass: "intel-page__escort-slot--wing", slot: 2 },
];

const Intel = () => {
  const { tryExpand, closeExpansion, cellPlan, workbenchFullToast } = useFleetGridExpansions(unitBySlot);

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

      if (slot === 0 || slot === 1) {
        const unit = cell.unit ?? unitBySlot.get(slot);
        if (!unit) {
          continue;
        }

        out.push(
          <IntelReservedBay
            key={`reserved-${slot}`}
            variant={slot === 0 ? "market" : "crypto"}
            unit={unit}
            index={slot}
            style={{ gridRow, gridColumn }}
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

  // Founder review — Intel Top 10 gated to Tier 2+ in IntelTop10Section
  return (
    <div className="intel-page">
      {workbenchFullToast ? (
        <div className="intel-hangar-toast" role="status" aria-live="polite" aria-atomic="true">
          <p className="intel-hangar-toast__title">Hangar full</p>
          <p className="intel-hangar-toast__body">
            Three workstations are live. Close one to open another 2×2 bay.
          </p>
        </div>
      ) : null}

      <div className="intel-page__escort intel-page__escort--left" aria-hidden>
        {BORDER_FORMATION.map((jet) => (
          <span
            key={jet.accentId}
            className={`intel-page__escort-slot intel-page__escort-slot--bay-accent ${jet.slotClass}`}
            style={fleetBayAccentStyle(jet.slot)}
          >
            <AircraftIcon aircraftType={jet.aircraftType} accentId={jet.accentId} className="intel-page__border-jet" />
          </span>
        ))}
      </div>
      <div className="intel-page__escort intel-page__escort--right" aria-hidden>
        {BORDER_FORMATION.map((jet) => (
          <span
            key={`${jet.accentId}-r`}
            className={`intel-page__escort-slot intel-page__escort-slot--bay-accent ${jet.slotClass}`}
            style={fleetBayAccentStyle(jet.slot)}
          >
            <AircraftIcon aircraftType={jet.aircraftType} accentId={`${jet.accentId}-r`} className="intel-page__border-jet" />
          </span>
        ))}
      </div>

      <div className="intel-page__shell page-atmosphere page-nav-offset mx-auto max-w-[88rem] px-4 pb-24 sm:px-6 lg:px-8">
        <IntelFleetVitals />
        <IntelPulseDashboard />
        <IntelTop10Section />

        <div className="intel-page__grid-intro">
          <p className="intel-page__grid-kicker">Monitor grid</p>
          <p className="intel-page__grid-copy">
            {HANGAR_COLUMNS} wide · {HANGAR_ROWS} deep · {FLEET_UNIT_COUNT} feeds · click a bay to expand (max{" "}
            {MAX_SIMULTANEOUS_WORKBENCHES} simultaneous 2×2 workbenches)
          </p>
        </div>

        <div className="intel-grid-wrap">
          <div className="intel-grid grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-6">{gridCells}</div>
        </div>
      </div>
    </div>
  );
};

export default Intel;
