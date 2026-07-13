import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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
import { wrapExternalInCockpit } from "../lib/fleetLaunchUrl";
import FleetCard from "../components/fleet/FleetCard";
import FleetAuthChrome from "../components/fleet/FleetAuthChrome";
import SovereignVaultGlobalDownload from "../components/growth/SovereignVaultGlobalDownload";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import { resolveFounderPaymentLink } from "../lib/stripePaymentLink";
import { FLEET_UNIT_COUNT, HANGAR_ROWS } from "../types/fleet";

const FLEET_LOCKED_COUNT = FLEET_UNIT_COUNT - PUBLIC_FLEET_UNLOCKED_COUNT;
const FLEET_HERO_HEADLINE = "Unlock the full Fleet";
const FLEET_HERO_LEDE = `Fly the first ${PUBLIC_FLEET_UNLOCKED_COUNT} AI bays free. Clear the other ${FLEET_LOCKED_COUNT} — plus Member Portal — with Flight Pass.`;
const FLEET_HERO_CTA = `Unlock full Fleet · ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period}`;
const FLEET_HERO_PROOF = `${PUBLIC_FLEET_UNLOCKED_COUNT} free · ${FLEET_LOCKED_COUNT} locked · Stripe only`;

const FLEET_RUNWAY_LOGO_SPINS = 3;
const FLEET_RUNWAY_LOGO_SPIN_DURATION = 2.4;

function fleetRunwayPrefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const Fleet = () => {
  const { session } = useMemberAuth();
  const flightPassUrl = resolveFounderPaymentLink();
  const flightPassCheckoutUrl = wrapExternalInCockpit(flightPassUrl, {
    returnTo: "/",
    label: "Flight Pass",
  });
  const fullFleetCleared = hasFullFleetAccess(session);
  const [runwayReady, setRunwayReady] = useState(fleetRunwayPrefersReducedMotion);

  return (
    <>
      <AnimatePresence>
        {!runwayReady ? (
          <motion.div
            key="fleet-runway-intro"
            className="fleet-runway-intro"
            role="status"
            aria-live="polite"
            aria-label="Fleet runway loading"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="fleet-runway-intro__logo"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 * FLEET_RUNWAY_LOGO_SPINS }}
              transition={{ duration: FLEET_RUNWAY_LOGO_SPIN_DURATION, ease: [0.45, 0.05, 0.55, 0.95] }}
              onAnimationComplete={() => setRunwayReady(true)}
            >
              <UsjetWordmark size="hero" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: runwayReady ? 1 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="fleet-page fleet-page--runway relative"
        aria-busy={!runwayReady}
        style={{ pointerEvents: runwayReady ? undefined : "none" }}
      >
        <SovereignVaultGlobalDownload fleetFloat />
        <div className="page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-[92rem] px-4 pb-24 sm:px-6 lg:px-8">
          <header className="fleet-runway-hero mb-14 flex flex-col items-center gap-8 border-b border-cyan-400/15 pb-12 text-center md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <UsjetWordmark size="hero" />
            </motion.div>

            <div className="fleet-runway-hero__copy max-w-3xl">
              <h1 className="fleet-runway-hero__title font-aviation text-4xl font-black uppercase italic leading-[0.95] tracking-tighter text-white sm:text-5xl lg:text-6xl">
                Unlock the full <span className="text-cyan-400">Fleet</span>
              </h1>
              <p className="fleet-runway-hero__lede mt-5 text-base font-medium leading-relaxed tracking-tight text-white/70 sm:text-lg">
                {FLEET_HERO_LEDE}
              </p>

              <div className="fleet-runway-hero__actions">
                {fullFleetCleared ? (
                  <p className="fleet-runway-hero__cleared" role="status">
                    Full fleet clearance active
                  </p>
                ) : (
                  <>
                    <Link
                      to={flightPassCheckoutUrl}
                      className="fleet-runway-hero__cta btn-glass-prominent glass-effect-interactive"
                      aria-label={`${FLEET_HERO_HEADLINE} with Flight Pass at ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period}`}
                    >
                      {FLEET_HERO_CTA}
                    </Link>
                    <Link to="/member" className="fleet-runway-hero__secondary glass-effect-interactive">
                      Already cleared? Member login
                    </Link>
                  </>
                )}
              </div>

              <p className="fleet-runway-hero__proof">{FLEET_HERO_PROOF}</p>
            </div>
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
                  returnTo="/"
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
    </>
  );
};

export default Fleet;
