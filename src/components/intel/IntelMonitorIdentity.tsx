import type { FleetUnit } from "../../types/fleet";

type IntelMonitorIdentityProps = {
  unit: Pick<FleetUnit, "callsign" | "name" | "slot" | "aiName">;
};

export default function IntelMonitorIdentity({ unit }: IntelMonitorIdentityProps) {
  return (
    <div className="intel-monitor__identity">
      <p className="intel-monitor__callsign">{unit.name}</p>
      <p className="intel-monitor__unit">{unit.name}</p>
      {unit.aiName ? <p className="intel-monitor__ai-name">{unit.aiName}</p> : null}
    </div>
  );
}
