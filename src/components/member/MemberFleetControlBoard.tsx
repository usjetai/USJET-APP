import { useEffect, useMemo, useState } from "react";
import AircraftIcon from "../icons/AircraftIcons";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import { fleetManifest } from "../../data/fleetManifest";
import { integratedLaunchUrl } from "../../lib/fleetLaunchUrl";
import { resolveFleetUnitHref } from "../../lib/fleetManifestAudit";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";

const controlBoardUnits = [...fleetManifest].sort((a, b) => a.slot - b.slot);

export default function MemberFleetControlBoard() {
  return (
    <GlassEffectContainer className="member-control-board glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
      <div className="member-control-board__header">
        <p className="member-control-board__kicker">Personal control board</p>
        <h2 className="member-control-board__title">Fleet manifest · 30 units</h2>
        <p className="member-control-board__copy">Your sovereign hangar — smallest aircraft icons, full callsign roster.</p>
      </div>

      <ul className="member-control-board__grid">
        {controlBoardUnits.map((unit) => {
          const launchUrl = integratedLaunchUrl(unit.domain, resolveFleetUnitHref(unit), unit.slot, {
            returnTo: "/member",
            label: unit.name,
          });
          const accentId = `member-board-${unit.slot}`;

          return (
            <li key={unit.id}>
              <a
                href={launchUrl}
                className="member-control-board__cell glass-effect-interactive"
                aria-label={`Launch ${unit.name} — ${unit.callsign}`}
                onClick={() => logFleetUsageIfMember(unit.callsign, unit.name)}
              >
                <span className="member-control-board__icon-wrap">
                  <AircraftIcon
                    aircraftType={unit.aircraftType}
                    accentId={accentId}
                    className="member-control-board__icon"
                  />
                </span>
                <span className="member-control-board__callsign">{unit.callsign}</span>
                <span className="member-control-board__name">{unit.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </GlassEffectContainer>
  );
}
