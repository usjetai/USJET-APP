import type { FleetAircraftType } from "../../types/fleet";
import { FLEET_AIRCRAFT_LOGO_PATHS } from "../../lib/fleetAircraftLogos";

type AircraftIconProps = {
  aircraftType: FleetAircraftType;
  accentId: string;
  className?: string;
};

export default function AircraftIcon({
  aircraftType,
  accentId,
  className = "",
}: AircraftIconProps) {
  return (
    <img
      src={FLEET_AIRCRAFT_LOGO_PATHS[aircraftType]}
      alt=""
      aria-hidden="true"
      className={`aircraft-icon ${className}`.trim()}
      data-accent-id={accentId}
      decoding="async"
      draggable={false}
    />
  );
}
