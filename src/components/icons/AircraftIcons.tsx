import { forwardRef } from "react";
import type { FleetAircraftType } from "../../types/fleet";
import { getFleetAircraftLogoPathForSlot } from "../../lib/fleetAircraftLogos";

type AircraftIconProps = {
  aircraftType: FleetAircraftType;
  accentId: string;
  slot?: number;
  className?: string;
};

const AircraftIcon = forwardRef<HTMLImageElement, AircraftIconProps>(function AircraftIcon(
  { aircraftType, accentId, slot, className = "" },
  ref,
) {
  return (
    <img
      ref={ref}
      src={getFleetAircraftLogoPathForSlot(slot, aircraftType)}
      alt=""
      aria-hidden="true"
      className={`aircraft-icon logo-rounded ${className}`.trim()}
      data-accent-id={accentId}
      decoding="async"
      draggable={false}
    />
  );
});

export default AircraftIcon;
