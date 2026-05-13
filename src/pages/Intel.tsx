import { Activity, TrendingUp } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import AircraftIcon from "../components/icons/AircraftIcons";
import IntelExpandedWorkbench from "../components/intel/IntelExpandedWorkbench";
import IntelMonitor from "../components/intel/IntelMonitor";
import { fleetManifest } from "../data/fleetManifest";
import { useFleetGridExpansions } from "../hooks/useFleetGridExpansions";
import { MAX_SIMULTANEOUS_WORKBENCHES } from "../lib/intelGridExpansion";
import { type FleetUnit, FLEET_UNIT_COUNT, HANGAR_COLUMNS, HANGAR_ROWS } from "../types/fleet";

const intelUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);

const unitBySlot = new Map<number, FleetUnit>(intelUnits.map((u) => [u.slot, u]));

const BORDER_FORMATION = [
  { accentId: "intel-border-l-1", aircraftType: "f22" as const, slotClass: "intel-page__escort-slot--wing" },
  { accentId: "intel-border-l-2", aircraftType: "sr71" as const, slotClass: "intel-page__escort-slot--lead" },
  { accentId: "intel-border-l-3", aircraftType: "f35" as const, slotClass: "intel-page__escort-slot--wing" },
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
            Three workstations are live. Close one to open another 2×2 bay.
          </p>
        </div>
      ) : null}

      <div className="intel-page__escort intel-page__escort--left" aria-hidden>
        {BORDER_FORMATION.map((jet) => (
          <span key={jet.accentId} className={`intel-page__escort-slot ${jet.slotClass}`}>
            <AircraftIcon aircraftType={jet.aircraftType} accentId={jet.accentId} className="intel-page__border-jet" />
          </span>
        ))}
      </div>
      <div className="intel-page__escort intel-page__escort--right" aria-hidden>
        {BORDER_FORMATION.map((jet) => (
          <span key={`${jet.accentId}-r`} className={`intel-page__escort-slot ${jet.slotClass}`}>
            <AircraftIcon aircraftType={jet.aircraftType} accentId={`${jet.accentId}-r`} className="intel-page__border-jet" />
          </span>
        ))}
      </div>

      <div className="intel-page__shell page-atmosphere mx-auto max-w-[88rem] px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <div className="mb-10 overflow-hidden whitespace-nowrap border-y border-emerald-500/25 bg-emerald-500/[0.03] p-4 backdrop-blur-[1px]">
          <div className="flex animate-pulse gap-12">
            <span className="font-black italic text-white">
              BTC: $62,450 <TrendingUp size={14} className="inline text-green-500" />
            </span>
            <span className="font-black italic text-white">
              NVDA: $895.40 <TrendingUp size={14} className="inline text-green-500" />
            </span>
            <span className="font-black italic text-white">
              TSLA: $182.50 <TrendingUp size={14} className="inline text-green-500" />
            </span>
            <span className="font-black italic text-white">
              USJET: ACTIVE <TrendingUp size={14} className="inline text-blue-500" />
            </span>
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5 border-b border-emerald-500/20 pb-8 text-left text-white">
          <Activity className="text-emerald-400" size={48} />
          <div>
            <h1 className="font-aviation text-6xl font-black uppercase italic tracking-tighter sm:text-7xl">
              Intel Stream
            </h1>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.28em] text-white/45">
              {HANGAR_COLUMNS} monitors wide · {HANGAR_ROWS} rows deep · {FLEET_UNIT_COUNT} feeds
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/70">
              Wings 1-10 BTC/USD · 11-20 NVDA · 21-30 TSLA · click a monitor to expand (max{" "}
              {MAX_SIMULTANEOUS_WORKBENCHES} simultaneous 2×2 workbenches)
            </p>
          </div>
        </div>

        <div className="intel-grid-wrap -mx-2 overflow-x-auto px-2 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="intel-grid">{gridCells}</div>
        </div>
      </div>
    </div>
  );
};

export default Intel;
