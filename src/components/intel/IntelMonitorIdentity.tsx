import type { FleetUnit } from "../../types/fleet";

type IntelMonitorIdentityProps = {
  unit: Pick<FleetUnit, "aiName">;
};

export default function IntelMonitorIdentity({ unit }: IntelMonitorIdentityProps) {
  return (
    <div className="intel-monitor__identity">
      <p className="intel-monitor__ai-name">{unit.aiName ?? "AI"}</p>
    </div>
  );
}
