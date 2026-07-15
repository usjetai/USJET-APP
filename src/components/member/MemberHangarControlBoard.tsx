import { Link } from "react-router-dom";
import DeveloperRedBlinkName from "../DeveloperRedBlinkName";
import AircraftIcon from "../icons/AircraftIcons";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { getHangarUnits } from "../../data/hangarManifest";
import { getFleetDisplayAircraftType } from "../../data/fleetRoster";
import { useMemberAuth } from "../../context/MemberAuthContext";
import {
  getHangarBayLimit,
  HANGAR_BAY_LIMIT_FREE,
} from "../../lib/memberAccessLevel";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import { FLEET_UNIT_COUNT } from "../../types/fleet";

const hangarUnits = getHangarUnits();

export default function MemberHangarControlBoard() {
  const { session } = useMemberAuth();
  const bayLimit = getHangarBayLimit(session);

  return (
    <GlassEffectContainer className="member-control-board member-hangar-board glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-amber">
      <div className="member-control-board__header">
        <p className="member-control-board__kicker member-hangar-board__kicker">Hangar workbench</p>
        <h2 className="member-control-board__title">Hangar floor · {FLEET_UNIT_COUNT} bays</h2>
        <p className="member-control-board__copy">
          Open live Hangar tabs from here. Guests get {HANGAR_BAY_LIMIT_FREE} free tabs; your clearance allows{" "}
          {bayLimit} simultaneous workstations.
        </p>
        <Link to="/" className="member-hangar-board__enter btn-glass-prominent glass-effect-interactive">
          Enter Hangar →
        </Link>
      </div>

      <ul className="member-control-board__grid member-hangar-board__grid">
        {hangarUnits.map((unit) => {
          const displayAircraftType = getFleetDisplayAircraftType(unit.slot, unit.aircraftType);
          const accentId = `member-hangar-${unit.slot}`;
          const isOrigin = unit.href === "/origin" || unit.href.startsWith("/origin?");
          const bayTarget = isOrigin
            ? { to: "/origin" as const }
            : { to: "/" as const, state: { expandSlot: unit.slot } };

          return (
            <li key={`hangar-${unit.id}`} className="member-control-board__bay">
              <Link
                to={bayTarget.to}
                state={"state" in bayTarget ? bayTarget.state : undefined}
                className="member-control-board__cell fleet-card member-control-board__cell--bay-accent glass-effect-interactive"
                style={fleetBayAccentStyle(unit.slot)}
                aria-label={`Open ${unit.name} in Hangar`}
                onClick={() => logFleetUsageIfMember(unit.callsign, unit.name)}
              >
                <span className="member-control-board__icon-wrap">
                  <AircraftIcon
                    aircraftType={displayAircraftType}
                    slot={unit.slot}
                    accentId={accentId}
                    className="member-control-board__icon"
                  />
                </span>
                <span className="member-control-board__callsign">{unit.callsign}</span>
                <span className="member-control-board__name">
                  <DeveloperRedBlinkName name={unit.name} fleetSlot={unit.slot} />
                </span>
                <span className="member-control-board__partner">{unit.domain}</span>
              </Link>
              <Link
                to={bayTarget.to}
                state={"state" in bayTarget ? bayTarget.state : undefined}
                className="member-control-board__product btn-glass glass-effect-interactive"
                aria-label={`Open Hangar bay for ${unit.name}`}
                onClick={() => logFleetUsageIfMember(unit.callsign, unit.name)}
              >
                Open bay →
              </Link>
            </li>
          );
        })}
      </ul>
    </GlassEffectContainer>
  );
}
