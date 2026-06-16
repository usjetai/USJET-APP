import DeveloperRedBlinkName from "../DeveloperRedBlinkName";
import type { FleetUnit } from "../../types/fleet";

type IntelMonitorIdentityProps = {
  unit: Pick<FleetUnit, "callsign" | "name" | "slot">;
};

export default function IntelMonitorIdentity({ unit }: IntelMonitorIdentityProps) {
  return (
    <div className="intel-monitor__identity">
      <p className="intel-monitor__callsign">{unit.name}</p>
      <p className="intel-monitor__unit">
        <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
      </p>
    </div>
  );
}
