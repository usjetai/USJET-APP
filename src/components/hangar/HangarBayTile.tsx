import FleetCard from "../fleet/FleetCard";
import { resolveHangarUnitHref } from "../../lib/hangarLaunchUrl";
import {
  getFleetDisplayAircraftName,
  getFleetDisplayAircraftType,
  isFleetBayAvailable,
} from "../../data/fleetRoster";
import type { FleetUnit } from "../../types/fleet";

type HangarBayTileProps = {
  unit: FleetUnit;
  onOpenBay: () => void;
};

/** Interactive hangar bay tile — same launch resolution as Fleet runway cards. */
export default function HangarBayTile({ unit, onOpenBay }: HangarBayTileProps) {
  const available = isFleetBayAvailable(unit.slot);
  const displayAircraftType = getFleetDisplayAircraftType(unit.slot, unit.aircraftType);

  return (
    <FleetCard
      domain={unit.domain}
      aircraftType={displayAircraftType}
      aircraftOfficialName={getFleetDisplayAircraftName(unit.slot, unit.aircraftType)}
      name={unit.name}
      callsign={unit.callsign}
      href={resolveHangarUnitHref(unit)}
      slot={unit.slot}
      systemPrompt={unit.systemPrompt}
      returnTo="/"
      surface="hangar"
      isCommandBay={unit.href === "/origin" || unit.href.startsWith("/origin?")}
      isAvailableBay={available}
      onExpandBay={onOpenBay}
    />
  );
}
