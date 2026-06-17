import type { FleetAircraftType } from "../../types/fleet";
import { getFleetAircraftLogoPathForSlot } from "../../lib/fleetAircraftLogos";

type AircraftIconProps = {
  aircraftType: FleetAircraftType;
  accentId: string;
  slot?: number;
  className?: string;
};

export default function AircraftIcon({
  aircraftType,
  accentId,
  slot,
  className = "",
}: AircraftIconProps) {
  return (
    <img
      src={getFleetAircraftLogoPathForSlot(slot, aircraftType)}
      alt=""
      aria-hidden="true"
      className={`aircraft-icon logo-rounded ${className}`.trim()}
      data-accent-id={accentId}
      decoding="async"
      draggable={false}
    />
  );
}
