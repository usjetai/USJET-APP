import { motion } from "framer-motion";
import { fleetManifest } from "../data/fleetManifest";
import { resolveFleetUnitHref } from "../lib/fleetManifestAudit";
import FleetCard from "../components/fleet/FleetCard";
import UsjetWordmark from "../components/brand/UsjetWordmark";
import { HANGAR_ROWS } from "../types/fleet";

const Fleet = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mx-auto max-w-[88rem] px-6 pb-20 pt-40 text-center"
  >
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-16 flex justify-center"
    >
      <UsjetWordmark size="hero" />
    </motion.h1>

    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      style={{ gridTemplateRows: `repeat(${HANGAR_ROWS}, minmax(0, 1fr))` }}
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
          isCommandBay={unit.href === "/origin" || unit.slot === 29}
        />
      ))}
    </div>
  </motion.div>
);

export default Fleet;
