import { ShieldCheck } from "lucide-react";
import { useEffect, useMemo, type ReactNode } from "react";
import FleetCard from "../components/fleet/FleetCard";
import HangarToolWorkbench from "../components/hangar/HangarToolWorkbench";
import MemberPrimeBadge from "../components/member/MemberPrimeBadge";
import { useMemberAuth } from "../context/MemberAuthContext";
import { fleetManifest } from "../data/fleetManifest";
import { useFleetGridExpansions } from "../hooks/useFleetGridExpansions";
import { MAX_SIMULTANEOUS_WORKBENCHES } from "../lib/intelGridExpansion";
import { KING_KARIM_HANGAR_META } from "../lib/memberMasterKey";
import { type FleetUnit, FLEET_UNIT_COUNT, HANGAR_COLUMNS, HANGAR_ROWS } from "../types/fleet";

const hangarUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);

const unitBySlot = new Map<number, FleetUnit>(hangarUnits.map((u) => [u.slot, u]));

const HANGAR_META_DESCRIPTION =
  "USJET is not a passive directory—it networks Gemini, ChatGPT, Claude, and 27 other elite AIs into one US hangar. Each system claims a cockpit bay aboard the same high-velocity fleet: a consensus of intelligence on the path to a digital nervous system.";

const HANGAR_VISION_RIBBON =
  "Expand a bay and that AI steps straight into its glass cockpit—smooth, frictionless, with the Hangar as home base.";

const Hangar = () => {
  const { session } = useMemberAuth();
  const { tryExpand, closeExpansion, cellPlan, workbenchFullToast } = useFleetGridExpansions(unitBySlot);

  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content") ?? null;

    document.title = "Hangar · USJet.ai";
    meta?.setAttribute("content", HANGAR_META_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription !== null) {
        meta.setAttribute("content", prevDescription);
      }
    };
  }, []);

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
          <HangarGridVoid key={`void-${slot}`} gridRow={gridRow} gridColumn={gridColumn} />,
        );
        continue;
      }

      if (cell.mode === "expanded") {
        out.push(
          <HangarToolWorkbench
            key={`hangar-wb-${cell.unit.id}-anchor-${slot}`}
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

      const u = cell.unit;
      out.push(
        <FleetCard
          key={`bay-${slot}`}
          domain={u.domain}
          aircraftType={u.aircraftType}
          name={u.name}
          callsign={u.callsign}
          href={u.href}
          slot={u.slot}
          systemPrompt={u.systemPrompt}
          isCommandBay={u.href === "/origin" || u.slot === 29}
          surface="hangar"
          style={{ gridRow, gridColumn }}
          onExpandBay={() => tryExpand(u)}
        />,
      );
    }

    return out;
  }, [cellPlan, closeExpansion, tryExpand]);

  // Founder review — gate temporarily open; re-lock before Titans launch
  return (
    <div
      className="relative hangar-page hangar-page--workbench"
      data-usjet-legacy-access={KING_KARIM_HANGAR_META.key}
      data-usjet-legacy-note={KING_KARIM_HANGAR_META.note}
    >
      {workbenchFullToast ? (
        <div className="intel-hangar-toast" role="status" aria-live="polite" aria-atomic="true">
          <p className="intel-hangar-toast__title">Hangar full</p>
          <p className="intel-hangar-toast__body">
            Three workstations are live. Close one to open another 2×2 bay.
          </p>
        </div>
      ) : null}

      <div className="page-atmosphere page-nav-offset mx-auto max-w-[88rem] px-4 pb-24 sm:px-6 lg:px-8">
        <div className="hangar-workbench-hero mb-12 flex flex-col items-start justify-between gap-8 border-b border-amber-400/20 pb-10 md:flex-row md:items-end">
          <div className="text-left">
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-black uppercase tracking-[0.35em] text-amber-300/90">
              <ShieldCheck size={20} className="shrink-0 text-amber-400" />
              <span>{session?.active ? "Founder's Access Granted" : "Founder's Hangar"}</span>
              <span
                className="hangar-ops-badge rounded-md border border-amber-400/40 bg-amber-500/[0.1] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-amber-100/90 sm:text-[9px] sm:tracking-[0.28em]"
                title="Each bay is a USJET cockpit—expand to bring the partner AI aboard without leaving the hangar"
              >
                Bay floor · workbench ops
              </span>
            </div>
            <h1 className="font-aviation text-6xl font-black uppercase italic leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-8xl">
              The <span className="text-amber-400">Hangar</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed tracking-tight text-white/70">
              {HANGAR_META_DESCRIPTION}
            </p>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed tracking-tight text-amber-100/55">
              {HANGAR_VISION_RIBBON}
            </p>
            <p className="mt-4 max-w-2xl text-sm font-medium uppercase tracking-[0.28em] text-amber-200/40">
              {HANGAR_COLUMNS} bays wide · {HANGAR_ROWS} rows deep · {FLEET_UNIT_COUNT} units · click a bay to expand
              (max {MAX_SIMULTANEOUS_WORKBENCHES} simultaneous 2×2 cockpits)
            </p>
          </div>

          <MemberPrimeBadge session={session} founderReviewOpen />
        </div>

        <HangarBayGrid gridCells={gridCells} />
      </div>
    </div>
  );
};

function HangarGridVoid({ gridRow, gridColumn }: { gridRow: number; gridColumn: number }) {
  return (
    <div
      className="intel-grid__void"
      style={{ gridRow, gridColumn }}
      aria-hidden
    />
  );
}

function HangarBayGrid({ gridCells }: { gridCells: ReactNode[] }) {
  return (
        <div className="hangar-bay-grid-wrap">
          <div
            className="hangar-bay-grid intel-grid grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-4 lg:grid-cols-6 lg:gap-3"
            role="region"
            aria-label="USJET hangar: networked AI cockpits in formation"
          >
            {gridCells}
          </div>
        </div>
  );
}

export default Hangar;
