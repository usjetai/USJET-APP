import FleetCard from "../fleet/FleetCard";
import HangarPartnerBadge from "./HangarPartnerBadge";
import { resolveHangarUnitHref } from "../../lib/hangarLaunchUrl";
import { getHangarPartnerCompatibility } from "../../lib/hangarEmbedPolicy";
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
  const href = resolveHangarUnitHref(unit);
  const compatibility = getHangarPartnerCompatibility(href);

  return (
    <div className="hangar-bay-tile">
      <HangarPartnerBadge mode={compatibility} className="hangar-bay-tile__compat" />
      <FleetCard
        domain={unit.domain}
        aircraftType={displayAircraftType}
        aircraftOfficialName={getFleetDisplayAircraftName(unit.slot, unit.aircraftType)}
        name={unit.name}
        callsign={unit.callsign}
        href={href}
        slot={unit.slot}
        systemPrompt={unit.systemPrompt}
        returnTo="/hangar"
        surface="hangar"
        isCommandBay={unit.href === "/origin" || unit.slot === 29}
        isAvailableBay={available}
        onExpandBay={onOpenBay}
      />
    </div>
  );
}
