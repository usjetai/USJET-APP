import type { CSSProperties } from "react";
import { FleetLaunchLink } from "../../lib/fleetLaunchLink";
import { fleetBayAccentStyle, getFleetBayAccent } from "../../data/fleetBayAccents";
import { fleetManifest } from "../../data/fleetManifest";
import { resolveFleetUnitHref } from "../../lib/fleetManifestAudit";
import { integratedLaunchUrl } from "../../lib/fleetLaunchUrl";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import type { FleetUnit } from "../../types/fleet";
import AircraftIcon from "../icons/AircraftIcons";

const SORTED_UNITS = [...fleetManifest].sort((a, b) => a.slot - b.slot);
const LEFT_WING = SORTED_UNITS.slice(0, 15);
const RIGHT_WING = SORTED_UNITS.slice(15, 30);

function fleetBayLabel(slot: number): string {
  return String(slot + 1).padStart(2, "0");
}

function FounderJetCell({ unit, side }: { unit: FleetUnit; side: "left" | "right" }) {
  const launchUrl = integratedLaunchUrl(unit.domain, resolveFleetUnitHref(unit), unit.slot, {
    returnTo: "/founder",
    label: unit.name,
  });
  const isCommandBay = unit.slot === 29;
  const bayAccent = getFleetBayAccent(unit.slot);
  const bay = fleetBayLabel(unit.slot);
  return (
    <li className="founder-jet-wing__slot">
      <FleetLaunchLink
        launchUrl={launchUrl}
        className={[
          "founder-jet-wing__jet",
          "glass-effect-interactive",
          side === "left" ? "founder-jet-wing__jet--left" : "founder-jet-wing__jet--right",
          isCommandBay ? "founder-jet-wing__jet--command" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          {
            ...fleetBayAccentStyle(unit.slot),
            "--founder-jet-accent": bayAccent.accent,
          } as CSSProperties
        }
        aria-label={`Bay ${bay} — ${unit.callsign}, ${unit.name}`}
        onClick={() => logFleetUsageIfMember(unit.callsign, unit.name)}
      >
        <AircraftIcon
          aircraftType={unit.aircraftType}
          accentId={`founder-wing-${unit.id}`}
          className="founder-jet-wing__icon"
        />
        <span className="founder-jet-wing__callsign" aria-hidden>
          {unit.callsign}
        </span>
      </FleetLaunchLink>
    </li>
  );
}

type FounderJetWingProps = {
  side: "left" | "right";
};

export default function FounderJetWing({ side }: FounderJetWingProps) {
  const units = side === "left" ? LEFT_WING : RIGHT_WING;
  const label =
    side === "left" ? "Sovereign fleet — bays 01–15" : "Sovereign fleet — bays 16–30";

  return (
    <aside
      className={`founder-jet-wing founder-jet-wing--${side}`}
      aria-label={label}
    >
      <ul className="founder-jet-wing__list">
        {units.map((unit) => (
          <FounderJetCell key={unit.id} unit={unit} side={side} />
        ))}
      </ul>
    </aside>
  );
}
