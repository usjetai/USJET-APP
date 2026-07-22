import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

/** SEO / document meta — Hangar is the site home. */
const HANGAR_META_DESCRIPTION =
  "USJET Hangar — the home cockpit for America's labor force. Open live AI workbench bays; first three tabs free. Flight Pass unlocks the rest.";

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
    <header className="hangar-home-hero hangar-home-hero--rail mb-4 border-b border-amber-400/20 pb-4 md:mb-5 md:pb-4">
      <div className="hangar-home-hero__top">
        <motion.div
          className="hangar-home-hero__copy"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="hangar-home-hero__kicker">
            {session?.active ? "Clearance active · Home hangar" : "Home hangar · Open workbench"}
          </p>

          <h1 className="hangar-home-hero__title font-aviation">
            Welcome to the <span className="text-amber-400">Hangar</span>
          </h1>
        </motion.div>
        <MemberPrimeBadge session={session} founderReviewOpen compact />
      </div>

      <motion.div
        className="hangar-home-hero__body"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
      >
        <p className="hangar-home-hero__lede">{HANGAR_HERO_LEDE}</p>

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
      </motion.div>

      <div className="hangar-home-hero__ops">
        <span
          className="hangar-ops-badge"
          title="Simultaneous cockpit tabs allowed on your clearance"
        >
          {bayBadge}
        </span>
        <HangarLayoutToggle columns={columns} onChange={onColumnLayoutChange} />
        <p className="hangar-home-hero__proof">
          First {HANGAR_BAY_LIMIT_FREE} tabs free · {FLEET_UNIT_COUNT} bays · {bayLimit} live · Stripe only
        </p>
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
    <div className="hangar-layout-toggle" role="group" aria-label="Hangar bay grid layout">
      <span className="hangar-layout-toggle__label">Layout</span>
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
