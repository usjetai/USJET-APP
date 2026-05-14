import type { FleetUnit } from "../../types/fleet";

type IntelMonitorIdentityProps = {
  unit: Pick<FleetUnit, "callsign" | "name">;
};

export default function IntelMonitorIdentity({ unit }: IntelMonitorIdentityProps) {
  return (
    <div className="intel-monitor__identity">
      <p className="intel-monitor__callsign">{unit.callsign}</p>
      <p className="intel-monitor__unit">{unit.name}</p>
    </div>
  );
}
