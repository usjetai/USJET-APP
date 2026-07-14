import { Link } from "react-router-dom";
import DeveloperRedBlinkName from "../DeveloperRedBlinkName";
import AircraftIcon from "../icons/AircraftIcons";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { fleetBayAccentStyle, getFleetBayAccent } from "../../data/fleetBayAccents";
import { getFleetCapabilities, getFleetPartnerLabel } from "../../data/fleetCapabilities";
import { getFleetProductPagePath } from "../../data/fleetDirectorySeo";
import { fleetManifest } from "../../data/fleetManifest";
import { getFleetDisplayAircraftType } from "../../data/fleetRoster";
import { integratedLaunchUrl } from "../../lib/fleetLaunchUrl";
import { resolveFleetUnitHref } from "../../lib/fleetManifestAudit";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import { buildFleetTileTerminalFeed, clearLiveTerminalTile, publishLiveTerminalTile } from "../../lib/liveTerminalBridge";

const controlBoardUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);

export default function MemberFleetControlBoard() {
  return (
    <GlassEffectContainer className="member-control-board glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="member-control-board__header">
        <p className="member-control-board__kicker">Personal control board</p>
        <h2 className="member-control-board__title">Fleet manifest · 30 units</h2>
        <p className="member-control-board__copy">
          Launch each AI from here, or open its product page for merchandise and model kits.
        </p>
      </div>

      <ul className="member-control-board__grid">
        {controlBoardUnits.map((unit) => {
          const displayAircraftType = getFleetDisplayAircraftType(unit.slot, unit.aircraftType);
          const launchUrl = integratedLaunchUrl(unit.domain, resolveFleetUnitHref(unit), unit.slot, {
            returnTo: "/member",
            label: unit.name,
          });
          const productPagePath = getFleetProductPagePath(unit.callsign);
          const accentId = `member-board-${unit.slot}`;
          const bayAccent = getFleetBayAccent(unit.slot);
          const terminalFeed = buildFleetTileTerminalFeed({
            name: unit.name,
            callsign: unit.callsign,
            domain: unit.domain,
            slot: unit.slot,
            personality: bayAccent.personality,
            capabilities: getFleetCapabilities(unit.slot),
          });

          return (
            <li key={unit.id} className="member-control-board__bay">
              <a
                href={launchUrl}
                className="member-control-board__cell fleet-card member-control-board__cell--bay-accent glass-effect-interactive"
                style={fleetBayAccentStyle(unit.slot)}
                aria-label={`Launch ${unit.name}`}
                onClick={() => logFleetUsageIfMember(unit.callsign, unit.name)}
                onMouseEnter={() => publishLiveTerminalTile(terminalFeed)}
                onMouseLeave={() => clearLiveTerminalTile()}
                onFocus={() => publishLiveTerminalTile(terminalFeed)}
                onBlur={() => clearLiveTerminalTile()}
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
                <span className="member-control-board__partner">{getFleetPartnerLabel(unit.slot)}</span>
              </a>
              <Link
                to={productPagePath}
                className="member-control-board__product btn-glass-prominent glass-effect-interactive"
                aria-label={`View product page for ${unit.name}`}
                onClick={() => logFleetUsageIfMember(unit.callsign, unit.name)}
              >
                Product →
              </Link>
            </li>
          );
        })}
      </ul>
    </GlassEffectContainer>
  );
}
