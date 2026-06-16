import type { CSSProperties } from "react";
import { FleetLaunchLink } from "../../lib/fleetLaunchLink";
import { fleetBayAccentStyle, getFleetBayAccent } from "../../data/fleetBayAccents";
import { fleetManifest } from "../../data/fleetManifest";
import { resolveFleetUnitHref } from "../../lib/fleetManifestAudit";
import { integratedLaunchUrl } from "../../lib/fleetLaunchUrl";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import type { FleetUnit } from "../../types/fleet";
import DeveloperRedBlinkName from "../DeveloperRedBlinkName";
import GlassEffectContainer from "../layout/GlassEffectContainer";

const SORTED_UNITS = [...fleetManifest].sort((a, b) => a.slot - b.slot);
const LEFT_COLUMN = SORTED_UNITS.slice(0, 15);
const RIGHT_COLUMN = SORTED_UNITS.slice(15, 30);

function FounderFleetCell({ unit }: { unit: FleetUnit }) {
  const launchUrl = integratedLaunchUrl(unit.domain, resolveFleetUnitHref(unit), unit.slot, {
    returnTo: "/founder",
    label: unit.name,
  });
  const isCommandBay = unit.slot === 29;
  const bayAccent = getFleetBayAccent(unit.slot);
  const bay = String(unit.slot + 1).padStart(2, "0");
  return (
    <li>
      <FleetLaunchLink
        launchUrl={launchUrl}
        className={[
          "founder-fleet-roster__cell",
          "glass-effect-interactive",
          isCommandBay ? "founder-fleet-roster__cell--command" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          {
            ...fleetBayAccentStyle(unit.slot),
            "--founder-fleet-accent": bayAccent.accent,
          } as CSSProperties
        }
        aria-label={`Bay ${bay} — ${unit.name}`}
        onClick={() => logFleetUsageIfMember(unit.callsign, unit.name)}
      >
        <span className="founder-fleet-roster__text">
          <span className="founder-fleet-roster__callsign">{unit.name}</span>
          <span className="founder-fleet-roster__name">
            <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
          </span>
        </span>
      </FleetLaunchLink>
    </li>
  );
}

function FounderFleetColumn({ units, label }: { units: FleetUnit[]; label: string }) {
  return (
    <div className="founder-fleet-roster__column">
      <p className="founder-fleet-roster__column-label">{label}</p>
      <ul className="founder-fleet-roster__list">
        {units.map((unit) => (
          <FounderFleetCell key={unit.id} unit={unit} />
        ))}
      </ul>
    </div>
  );
}

export default function FounderFleetRoster() {
  return (
    <section className="founder-fleet-roster" aria-label="USJET sovereign fleet — thirty partner bays">
      <GlassEffectContainer className="founder-fleet-roster__frame liquid-glass-background glass-effect glass-effect--rounded-rect glass-tint-cyan">
        <header className="founder-fleet-roster__header">
          <p className="founder-fleet-roster__kicker">Sovereign fleet</p>
          <h2 className="founder-fleet-roster__title">Thirty units · one hangar</h2>
        </header>
        <div className="founder-fleet-roster__columns">
          <FounderFleetColumn units={LEFT_COLUMN} label="Units 01-15" />
          <FounderFleetColumn units={RIGHT_COLUMN} label="Units 16-30" />
        </div>
      </GlassEffectContainer>
    </section>
  );
}
