import type { FleetUnit } from "../../types/fleet";

type IntelMonitorIdentityProps = {
  unit: Pick<FleetUnit, "callsign" | "name" | "slot" | "aiName">;
};

export default function IntelMonitorIdentity({ unit }: IntelMonitorIdentityProps) {
  return (
    <div className="intel-monitor__identity">
      {unit.aiName ? <p className="intel-monitor__ai-name">{unit.aiName}</p> : null}
    </div>
  );
}
