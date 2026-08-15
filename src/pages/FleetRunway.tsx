import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemberAuth } from "../context/MemberAuthContext";
import {
  hasFullFleetAccess,
  isFleetSlotLocked,
  PUBLIC_FLEET_UNLOCKED_COUNT,
} from "../data/fleetAccessPolicy";
import { fleetManifest } from "../data/fleetManifest";
import { getFleetJetFighterPagePath } from "../data/fleetDirectorySeo";
import {
  getFleetDisplayAircraftName,
  getFleetDisplayAircraftType,
  isFleetBayAvailable,
} from "../data/fleetRoster";
import { FLIGHT_PASS_STRIPE } from "../data/stripeProducts";
import { resolveFleetUnitHref } from "../lib/fleetManifestAudit";
import FleetCard from "../components/fleet/FleetCard";
import FleetAuthChrome from "../components/fleet/FleetAuthChrome";
import { resolveFounderPaymentLink } from "../lib/stripePaymentLink";
import { FLEET_UNIT_COUNT, HANGAR_ROWS } from "../types/fleet";

const FLEET_LOCKED_COUNT = FLEET_UNIT_COUNT - PUBLIC_FLEET_UNLOCKED_COUNT;
const FLEET_HERO_HEADLINE = "Unlock the full Fleet";
const FLEET_HERO_LEDE = `Fly the first ${PUBLIC_FLEET_UNLOCKED_COUNT} AI bays free. Clear the other ${FLEET_LOCKED_COUNT} — plus Member Portal — with Flight Pass.`;
const FLEET_HERO_CTA = `Unlock full Fleet · ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period}`;
const FLEET_HERO_PROOF = `${PUBLIC_FLEET_UNLOCKED_COUNT} free · ${FLEET_LOCKED_COUNT} locked · Stripe only`;

const FleetRunway = () => {
  const { session } = useMemberAuth();
  const flightPassUrl = resolveFounderPaymentLink();
  const fullFleetCleared = hasFullFleetAccess(session);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fleet-page fleet-page--runway relative"
    >
      <div className="page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-[92rem] px-4 pb-24 sm:px-6 lg:px-8">
        <header className="fleet-runway-hero fleet-runway-hero--rail mb-4 border-b border-cyan-400/15 pb-4 md:mb-5 md:pb-4">
          <motion.div
            className="fleet-runway-hero__copy"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="fleet-runway-hero__kicker">Fleet runway · Partner bays</p>
            <h1 className="fleet-runway-hero__title font-aviation">
              Unlock the full <span className="text-cyan-400">Fleet</span>
            </h1>
            <p className="fleet-runway-hero__lede">{FLEET_HERO_LEDE}</p>

            <div className="fleet-runway-hero__actions">
              {fullFleetCleared ? (
                <p className="fleet-runway-hero__cleared" role="status">
                  Full fleet clearance active
                </p>
              ) : (
                <>
                  <a
                    href={flightPassUrl}
                    className="fleet-runway-hero__cta btn-glass-prominent glass-effect-interactive"
                    aria-label={`${FLEET_HERO_HEADLINE} with Flight Pass at ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period}`}
                    data-usjet-external-leak="true"
                  >
                    {FLEET_HERO_CTA}
                  </a>
                  <Link to="/member/login" className="fleet-runway-hero__secondary glass-effect-interactive">
                    Already cleared? Member login
                  </Link>
                </>
              )}
            </div>

            <p className="fleet-runway-hero__proof">{FLEET_HERO_PROOF}</p>
          </motion.div>
        </header>

        <FleetAuthChrome />

        <div
          className="fleet-runway-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6"
          style={{ gridTemplateRows: `repeat(${HANGAR_ROWS}, minmax(0, auto))` }}
          role="region"
          aria-label="USJET fleet runway: partner bays with sovereign handoff"
        >
          {fleetManifest.map((unit) => {
            const available = isFleetBayAvailable(unit.slot);
            const locked = isFleetSlotLocked(unit.slot, session);
            const displayAircraftType = getFleetDisplayAircraftType(unit.slot, unit.aircraftType);
            return (
              <FleetCard
                key={unit.id}
                domain={unit.domain}
                aircraftType={displayAircraftType}
                aircraftOfficialName={getFleetDisplayAircraftName(unit.slot, unit.aircraftType)}
                name={unit.name}
                callsign={unit.callsign}
                href={locked ? flightPassUrl : resolveFleetUnitHref(unit)}
                slot={unit.slot}
                systemPrompt={unit.systemPrompt}
                returnTo="/fleet"
                surface="fleet"
                isCommandBay={unit.href === "/origin" || unit.slot === 29}
                isAvailableBay={available}
                isFleetLocked={locked}
                jetFighterPagePath={getFleetJetFighterPagePath(unit.callsign)}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default FleetRunway;
