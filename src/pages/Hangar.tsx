import { ShieldCheck } from "lucide-react";
import { useEffect, useMemo, type ReactNode } from "react";
import FleetCard from "../components/fleet/FleetCard";
import FoundersAccessGate from "../components/member/FoundersAccessGate";
import MemberPrimeBadge from "../components/member/MemberPrimeBadge";
import { useMemberAuth } from "../context/MemberAuthContext";
import { fleetManifest } from "../data/fleetManifest";
import { resolveFleetUnitHref } from "../lib/fleetManifestAudit";
import { KING_KARIM_HANGAR_META } from "../lib/memberMasterKey";
import { FLEET_UNIT_COUNT, HANGAR_COLUMNS, HANGAR_ROWS } from "../types/fleet";

const hangarUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);

const HANGAR_META_DESCRIPTION =
  "USJET is not a passive directory—it networks Gemini, ChatGPT, Claude, and 27 other elite AIs into one US hangar. Each system claims a cockpit bay aboard the same high-velocity fleet: a consensus of intelligence on the path to a digital nervous system.";

const HANGAR_VISION_RIBBON =
  "Direct flight links active—Integrated Navigation.";

const Hangar = () => {
  const { session } = useMemberAuth();
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

    for (const u of hangarUnits) {
      if (u.slot >= FLEET_UNIT_COUNT) continue;

      const r0 = Math.floor(u.slot / HANGAR_COLUMNS);
      const c0 = u.slot % HANGAR_COLUMNS;

      out.push(
        <FleetCard
          key={`bay-${u.slot}`}
          domain={u.domain}
          aircraftType={u.aircraftType}
          name={u.name}
          callsign={u.callsign}
          href={resolveFleetUnitHref(u)}
          slot={u.slot}
          systemPrompt={u.systemPrompt}
          isCommandBay={u.href === "/origin" || u.slot === 29}
          style={{ gridRow: r0 + 1, gridColumn: c0 + 1 }}
        />,
      );
    }

    return out;
  }, []);

  return (
    <FoundersAccessGate pageLabel="The Hangar">
      <div
        className="relative hangar-page"
        data-usjet-legacy-access={KING_KARIM_HANGAR_META.key}
        data-usjet-legacy-note={KING_KARIM_HANGAR_META.note}
      >
      <div className="page-atmosphere mx-auto max-w-[88rem] px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end">
          <div className="text-left">
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-black uppercase tracking-[0.35em] text-blue-400">
              <ShieldCheck size={20} className="shrink-0" />
              <span>{session?.active ? "Founder's Access Granted" : "Founder's Hangar"}</span>
              <span
                className="hangar-ops-badge rounded-full border border-cyan-400/35 bg-cyan-500/[0.08] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-cyan-200/90 sm:text-[9px] sm:tracking-[0.28em]"
                title="Each bay navigates to its partner module inside the USJET experience"
              >
                Direct flight links active
              </span>
            </div>
            <h1 className="font-aviation text-6xl font-black uppercase italic leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-8xl">
              The <span className="text-blue-500">Hangar</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed tracking-tight text-white/70">
              {HANGAR_META_DESCRIPTION}
            </p>
            <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed tracking-tight text-cyan-100/55">
              {HANGAR_VISION_RIBBON}
            </p>
            <p className="mt-4 max-w-2xl text-sm font-medium uppercase tracking-[0.28em] text-white/45">
              {HANGAR_COLUMNS} bays wide · {HANGAR_ROWS} rows deep · {FLEET_UNIT_COUNT} units · click a bay to open
              partner site
            </p>
          </div>

          <MemberPrimeBadge session={session} />
        </div>

        <div className="intel-grid-wrap -mx-2 overflow-x-auto px-2 sm:mx-0 sm:overflow-visible sm:px-0">
          <div
            className="intel-grid"
            role="region"
            aria-label="USJET hangar: networked AI cockpits in formation"
          >
            {gridCells}
          </div>
        </div>
      </div>
    </div>
    </FoundersAccessGate>
  );
};

export default Hangar;
