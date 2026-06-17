import { ShieldCheck } from "lucide-react";
import type { MemberSession } from "../../types/member";
import MemberPrimeBadge from "../member/MemberPrimeBadge";
import type { HangarColumnLayout } from "../../hooks/useHangarColumnLayout";
import { FLEET_UNIT_COUNT } from "../../types/fleet";

const HANGAR_META_DESCRIPTION =
  "USJET is not a passive directory—it networks Gemini, ChatGPT, Claude, and 27 other elite AIs into one US hangar. Each system claims a cockpit bay aboard the same high-velocity fleet: a consensus of intelligence on the path to a digital nervous system.";

const HANGAR_VISION_RIBBON =
  "Expand a bay and that AI steps straight into its glass cockpit—smooth, frictionless, with the Hangar as home base.";

type HangarPageHeaderProps = {
  session: MemberSession | null;
  bayBadge: string;
  bayLimit: number;
  columns: HangarColumnLayout;
  onColumnLayoutChange: (next: HangarColumnLayout) => void;
};

export default function HangarPageHeader({
  session,
  bayBadge,
  bayLimit,
  columns,
  onColumnLayoutChange,
}: HangarPageHeaderProps) {
  return (
    <header className="hangar-workbench-hero mb-12 flex flex-col items-start justify-between gap-8 border-b border-amber-400/20 pb-10 md:flex-row md:items-end">
      <div className="text-left">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-black uppercase tracking-[0.35em] text-amber-300/90">
          <ShieldCheck size={20} className="shrink-0 text-amber-400" aria-hidden />
          <span>{session?.active ? "Founder's Access Granted" : "Founder's Hangar"}</span>
          <span
            className="hangar-ops-badge rounded-md border border-amber-400/40 bg-amber-500/[0.1] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-amber-100/90 sm:text-[9px] sm:tracking-[0.28em]"
            title="Simultaneous cockpit bays allowed on your clearance tier"
          >
            {bayBadge}
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
          {FLEET_UNIT_COUNT} units · {columns}-column bay floor · click a bay to expand (max {bayLimit}{" "}
          simultaneous cockpits)
        </p>
        <HangarLayoutToggle columns={columns} onChange={onColumnLayoutChange} />
      </div>

      <MemberPrimeBadge session={session} founderReviewOpen />
    </header>
  );
}

function HangarLayoutToggle({
  columns,
  onChange,
}: {
  columns: HangarColumnLayout;
  onChange: (next: HangarColumnLayout) => void;
}) {
  return (
    <div
      className="hangar-layout-toggle mt-6 flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Hangar bay grid layout"
    >
      <span className="mr-1 text-[10px] font-black uppercase tracking-[0.28em] text-amber-200/50">Layout</span>
      {([1, 2, 3] as const).map((count) => (
        <button
          key={count}
          type="button"
          className={[
            "hangar-layout-toggle__btn btn-glass glass-effect-interactive glass-tint-amber",
            columns === count ? "hangar-layout-toggle__btn--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-pressed={columns === count}
          onClick={() => onChange(count)}
        >
          {count} Column{count > 1 ? "s" : ""}
        </button>
      ))}
    </div>
  );
}

export { HANGAR_META_DESCRIPTION };
