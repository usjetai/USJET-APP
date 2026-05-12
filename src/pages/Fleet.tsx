import { motion } from "framer-motion";
import { fleetManifest } from "../data/fleetManifest";
import FleetCard from "../components/fleet/FleetCard";
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
      className="mb-16 text-8xl font-black uppercase italic leading-none tracking-tighter text-white md:text-[11rem]"
    >
      USJET<span className="text-blue-500">.AI</span>
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
          href={unit.href}
          slot={unit.slot}
        />
      ))}
    </div>
  </motion.div>
);

export default Fleet;
