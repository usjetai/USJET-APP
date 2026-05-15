import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { fleetManifest } from "../data/fleetManifest";
import { resolveFleetUnitHref } from "../lib/fleetManifestAudit";
import FleetCard from "../components/fleet/FleetCard";
import FleetAuthChrome from "../components/fleet/FleetAuthChrome";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import { FLEET_UNIT_COUNT, HANGAR_ROWS } from "../types/fleet";

const FLEET_RUNWAY_DESCRIPTION =
  "Runway clearance: thirty partner jets in formation. Each bay launches through sovereign handoff—same window, cockpit return bar, zero external leaks.";

const Fleet = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fleet-page fleet-page--runway relative"
  >
    <div className="page-atmosphere page-nav-offset relative z-[1] mx-auto max-w-[92rem] px-4 pb-24 sm:px-6 lg:px-8">
      <header className="fleet-runway-hero mb-14 flex flex-col items-center gap-8 border-b border-cyan-400/15 pb-12 text-center md:mb-16">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <UsjetWordmark size="hero" />
        </motion.div>

        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-black uppercase tracking-[0.35em] text-cyan-300/90">
            <Plane size={18} className="shrink-0" aria-hidden />
            <span>Command Deck</span>
            <span className="fleet-runway-badge rounded-full border border-cyan-400/35 bg-cyan-500/[0.08] px-3 py-1 text-[8px] font-black tracking-[0.2em] text-cyan-100/90 sm:text-[9px] sm:tracking-[0.28em]">
              Runway clearance active
            </span>
          </div>
          <h1 className="font-aviation text-5xl font-black uppercase italic leading-[0.92] tracking-tighter text-white sm:text-6xl lg:text-7xl">
            The <span className="text-cyan-400">Fleet</span>
          </h1>
          <p className="mt-5 text-base font-medium leading-relaxed tracking-tight text-white/70">
            {FLEET_RUNWAY_DESCRIPTION}
          </p>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.28em] text-cyan-200/45">
            {FLEET_UNIT_COUNT} units · landscape runway bays · sovereign handoff launch
          </p>
        </div>
      </header>

      <FleetAuthChrome />

      <div
        className="fleet-runway-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        style={{ gridTemplateRows: `repeat(${HANGAR_ROWS}, minmax(0, auto))` }}
        role="region"
        aria-label="USJET fleet runway: partner bays with sovereign handoff"
      >
        {fleetManifest.map((unit) => (
          <FleetCard
            key={unit.id}
            domain={unit.domain}
            aircraftType={unit.aircraftType}
            name={unit.name}
            callsign={unit.callsign}
            href={resolveFleetUnitHref(unit)}
            slot={unit.slot}
            systemPrompt={unit.systemPrompt}
            returnTo="/"
            surface="fleet"
            isCommandBay={unit.href === "/origin" || unit.slot === 29}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

export default Fleet;
