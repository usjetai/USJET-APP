import { ShieldCheck } from "lucide-react";
import type { MemberSession } from "../../types/member";
import MemberPrimeBadge from "../member/MemberPrimeBadge";
import type { HangarColumnLayout } from "../../hooks/useHangarColumnLayout";
import {
  HANGAR_BAY_LIMIT_FREE,
  memberClearanceRank,
} from "../../lib/memberAccessLevel";
import { resolveFounderPaymentLink } from "../../lib/stripePaymentLink";
import { FLIGHT_PASS_STRIPE } from "../../data/stripeProducts";
import { FLEET_UNIT_COUNT } from "../../types/fleet";

/** SEO / document meta — keep benefit-led and accurate to free-tab policy. */
const HANGAR_META_DESCRIPTION =
  "USJET Hangar workbench: open the same Fleet AI websites in-page. First four tabs free; Flight Pass unlocks the rest of the simultaneous workbench.";

const HANGAR_HERO_LEDE = `Click a bay to expand the same Fleet AI into a live cockpit tab on this page. First ${HANGAR_BAY_LIMIT_FREE} tabs are free — Flight Pass clears the rest.`;

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
  const flightPassUrl = resolveFounderPaymentLink();
  const fullTabsCleared = memberClearanceRank(session) >= 1;
  const ctaLabel = `Unlock full Hangar · ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period}`;

  return (
    <header className="hangar-workbench-hero mb-12 flex flex-col items-start justify-between gap-8 border-b border-amber-400/20 pb-10 md:flex-row md:items-end">
      <div className="hangar-workbench-hero__copy text-left">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-black uppercase tracking-[0.35em] text-amber-300/90">
          <ShieldCheck size={20} className="shrink-0 text-amber-400" aria-hidden />
          <span>{session?.active ? "Clearance active" : "Open workbench"}</span>
          <span
            className="hangar-ops-badge rounded-md border border-amber-400/40 bg-amber-500/[0.1] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-amber-100/90 sm:text-[9px] sm:tracking-[0.28em]"
            title="Simultaneous cockpit tabs allowed on your clearance"
          >
            {bayBadge}
          </span>
        </div>

        <h1 className="hangar-workbench-hero__title font-aviation text-5xl font-black uppercase italic leading-[0.92] tracking-tighter text-white sm:text-6xl lg:text-7xl">
          Open the <span className="text-amber-400">Hangar</span>
        </h1>

        <p className="hangar-workbench-hero__lede mt-5 max-w-2xl text-base font-medium leading-relaxed tracking-tight text-white/70 sm:text-lg">
          {HANGAR_HERO_LEDE}
        </p>

        <div className="hangar-workbench-hero__actions">
          {fullTabsCleared ? (
            <p className="hangar-workbench-hero__cleared" role="status">
              Full hangar tabs unlocked
            </p>
          ) : (
            <a
              href={flightPassUrl}
              className="hangar-workbench-hero__cta btn-glass-prominent glass-effect-interactive"
              data-usjet-external-leak="true"
              aria-label={ctaLabel}
            >
              {ctaLabel}
            </a>
          )}
        </div>

        <p className="hangar-workbench-hero__proof mt-4 max-w-2xl text-sm font-medium uppercase tracking-[0.22em] text-amber-200/45">
          {FLEET_UNIT_COUNT} bays · {bayLimit} live tabs · {columns}-column floor
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
