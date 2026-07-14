import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { MemberSession } from "../../types/member";
import MemberPrimeBadge from "../member/MemberPrimeBadge";
import UsjetWordmark from "../brand/UsjetWordmark";
import type { HangarColumnLayout } from "../../hooks/useHangarColumnLayout";
import {
  HANGAR_BAY_LIMIT_FREE,
  memberClearanceRank,
} from "../../lib/memberAccessLevel";
import { resolveFounderPaymentLink } from "../../lib/stripePaymentLink";
import { FLIGHT_PASS_STRIPE } from "../../data/stripeProducts";
import { FLEET_UNIT_COUNT } from "../../types/fleet";

/** SEO / document meta — Hangar is the site home. */
const HANGAR_META_DESCRIPTION =
  "USJET Hangar — the home cockpit for America's labor force. Open live AI workbench bays; first four tabs free. Flight Pass unlocks the rest.";

const HANGAR_HERO_HEADLINE = "Welcome to the Hangar";
const HANGAR_HERO_LEDE =
  "This is USJET. One ship, one cockpit — open a bay below and work with live AI tools. No new tabs. No leaks.";
const HANGAR_HERO_CTA = `Clear Flight Pass · ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period}`;

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

  return (
    <header className="hangar-home-hero mb-12 border-b border-amber-400/20 pb-10 md:mb-14 md:pb-12">
      <div className="hangar-home-hero__intro flex flex-col items-center text-center">
        <motion.div
          className="hangar-home-hero__brand"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <UsjetWordmark size="hero" />
        </motion.div>

        <motion.p
          className="hangar-home-hero__kicker mt-6 font-black uppercase tracking-[0.35em] text-amber-300/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          {session?.active ? "Clearance active · Home hangar" : "Home hangar · Open workbench"}
        </motion.p>

        <motion.div
          className="hangar-home-hero__copy mt-4 max-w-3xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45 }}
        >
          <h1 className="hangar-home-hero__title font-aviation text-4xl font-black uppercase italic leading-[0.95] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Welcome to the <span className="text-amber-400">Hangar</span>
          </h1>

          <p className="hangar-home-hero__lede mt-5 text-base font-medium leading-relaxed tracking-tight text-white/70 sm:text-lg">
            {HANGAR_HERO_LEDE}
          </p>

          <div className="hangar-home-hero__actions">
            {fullTabsCleared ? (
              <p className="hangar-home-hero__cleared" role="status">
                Full hangar tabs unlocked
              </p>
            ) : (
              <a
                href={flightPassUrl}
                className="hangar-home-hero__cta btn-glass-prominent glass-effect-interactive"
                data-usjet-external-leak="true"
                aria-label={`${HANGAR_HERO_HEADLINE} — unlock with Flight Pass at ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period}`}
              >
                {HANGAR_HERO_CTA}
              </a>
            )}
            <Link to="/member/login" className="hangar-home-hero__secondary glass-effect-interactive">
              Already cleared? Member login
            </Link>
            <Link to="/fleet" className="hangar-home-hero__secondary glass-effect-interactive">
              Browse Fleet runway
            </Link>
          </div>

          <p className="hangar-home-hero__proof mt-5 text-sm font-medium uppercase tracking-[0.22em] text-amber-200/45">
            First {HANGAR_BAY_LIMIT_FREE} tabs free · {FLEET_UNIT_COUNT} bays · {bayLimit} live · Stripe only
          </p>
        </motion.div>
      </div>

      <div className="hangar-home-hero__ops mt-8 flex flex-col items-center gap-4 sm:mt-10 md:flex-row md:items-end md:justify-between">
        <div className="hangar-home-hero__ops-left flex flex-col items-center gap-3 md:items-start">
          <span
            className="hangar-ops-badge rounded-md border border-amber-400/40 bg-amber-500/[0.1] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-amber-100/90 sm:text-[9px] sm:tracking-[0.28em]"
            title="Simultaneous cockpit tabs allowed on your clearance"
          >
            {bayBadge}
          </span>
          <HangarLayoutToggle columns={columns} onChange={onColumnLayoutChange} />
        </div>
        <MemberPrimeBadge session={session} founderReviewOpen />
      </div>
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
      className="hangar-layout-toggle flex flex-wrap items-center justify-center gap-2 md:justify-start"
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

export { HANGAR_META_DESCRIPTION, HANGAR_HERO_HEADLINE, HANGAR_HERO_LEDE };
