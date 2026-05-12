import { Activity, TrendingUp } from "lucide-react";
import IntelMonitor from "../components/intel/IntelMonitor";
import { fleetManifest } from "../data/fleetManifest";
import { FLEET_UNIT_COUNT, HANGAR_COLUMNS, HANGAR_ROWS } from "../types/fleet";

const intelUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);

const Intel = () => (
  <div className="page-atmosphere mx-auto max-w-[88rem] px-4 pb-24 pt-36 sm:px-6 lg:px-8">
    <div className="mb-10 overflow-hidden whitespace-nowrap border-y border-emerald-500/25 bg-emerald-500/[0.03] p-4 backdrop-blur-[1px]">
      <div className="flex animate-pulse gap-12">
        <span className="font-black italic text-white">
          BTC: $62,450 <TrendingUp size={14} className="inline text-green-500" />
        </span>
        <span className="font-black italic text-white">
          NVDA: $895.40 <TrendingUp size={14} className="inline text-green-500" />
        </span>
        <span className="font-black italic text-white">
          TSLA: $182.50 <TrendingUp size={14} className="inline text-green-500" />
        </span>
        <span className="font-black italic text-white">
          USJET: ACTIVE <TrendingUp size={14} className="inline text-blue-500" />
        </span>
      </div>
    </div>

    <div className="mb-12 flex items-center gap-5 border-b border-emerald-500/20 pb-8 text-left text-white">
      <Activity className="text-emerald-400" size={48} />
      <div>
        <h1 className="text-6xl font-black uppercase italic tracking-tighter sm:text-7xl">
          Intel Stream
        </h1>
        <p className="mt-3 text-sm font-medium uppercase tracking-[0.28em] text-white/45">
          {HANGAR_COLUMNS} monitors wide · {HANGAR_ROWS} rows deep · {FLEET_UNIT_COUNT} feeds
        </p>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/70">
          Wings 1-10 BTC/USD · 11-20 NVDA · 21-30 TSLA
        </p>
      </div>
    </div>

    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      style={{ gridTemplateRows: `repeat(${HANGAR_ROWS}, minmax(0, 1fr))` }}
    >
      {intelUnits.map((unit, index) => (
        <IntelMonitor key={unit.id} unit={unit} index={index} />
      ))}
    </div>
  </div>
);

export default Intel;
