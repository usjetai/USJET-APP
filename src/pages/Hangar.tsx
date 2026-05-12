import { ShieldCheck } from "lucide-react";
import FleetCard from "../components/fleet/FleetCard";
import { fleetManifest } from "../data/fleetManifest";
import { FLEET_UNIT_COUNT, HANGAR_COLUMNS, HANGAR_ROWS } from "../types/fleet";

const Hangar = () => (
  <div className="page-atmosphere mx-auto max-w-[88rem] px-4 pb-24 pt-36 sm:px-6 lg:px-8">
    <div className="mb-12 flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-10 md:flex-row md:items-end">
      <div className="text-left">
        <div className="mb-4 flex items-center gap-3 font-black uppercase tracking-[0.35em] text-blue-400">
          <ShieldCheck size={20} />
          <span>Founder&apos;s Access Granted</span>
        </div>
        <h1 className="text-6xl font-black uppercase italic leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-8xl">
          The <span className="text-blue-500">Hangar</span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm font-medium uppercase tracking-[0.28em] text-white/45">
          {HANGAR_COLUMNS} bays wide · {HANGAR_ROWS} rows deep · {FLEET_UNIT_COUNT} units
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-white/45">
          Member ID Status
        </p>
        <p className="font-mono text-xl text-emerald-400">USJET-PRIME-ACTIVE</p>
      </div>
    </div>

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
  </div>
);

export default Hangar;
