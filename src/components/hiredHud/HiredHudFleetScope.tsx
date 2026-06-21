import { Radar } from "lucide-react";
import { HIRED_HUD_RADAR_SCOPE_MAP_SRC } from "../../data/hiredHudAssets";
import { getFleetAircraftRadarLogoPathForSlot } from "../../lib/fleetAircraftLogos";
import type { HiredHudRadarPoint, HiredHudRadarTrack } from "../../lib/hiredHudRadar";
import type { FleetUnit } from "../../types/fleet";

type HiredHudFleetScopeProps = {
  units: FleetUnit[];
  tracks: Record<number, HiredHudRadarTrack>;
  trailPoints: Record<number, HiredHudRadarPoint[]>;
};

export default function HiredHudFleetScope({ units, tracks, trailPoints }: HiredHudFleetScopeProps) {
  return (
    <div className="hired-hud__fleet-scope glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan relative" aria-label="Fleet radar scope - all developers">
      <span
        className="hired-hud__fleet-scope-map"
        style={{ backgroundImage: `url("${HIRED_HUD_RADAR_SCOPE_MAP_SRC}")` }}
      />
      <svg className="hired-hud__fleet-scope-paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <line className="hired-hud__fleet-scope-runway" x1="50" y1="-24" x2="50" y2="124" />
        <line className="hired-hud__fleet-scope-runway" x1="-2" y1="2" x2="102" y2="98" />
        <line className="hired-hud__fleet-scope-runway" x1="102" y1="2" x2="-2" y2="98" />
        {units.map((unit) => {
          const points = trailPoints[unit.slot];
          if (!points || points.length < 2) return null;

          return points.slice(1).map((point, index) => {
            const previous = points[index];
            const fadeProgress = (index + 1) / (points.length - 1);
            return (
              <line
                key={`fleet-scope-path-${unit.slot}-${index}`}
                className="hired-hud__fleet-scope-path"
                x1={previous?.x ?? point.x}
                y1={previous?.y ?? point.y}
                x2={point.x}
                y2={point.y}
                style={{
                  opacity: fadeProgress * (0.35 + ((unit.slot % 4) * 0.08)),
                }}
              />
            );
          });
        })}
      </svg>
      <span className="hired-hud__fleet-scope-ring hired-hud__fleet-scope-ring--outer" />
      <span className="hired-hud__fleet-scope-ring hired-hud__fleet-scope-ring--mid" />
      <span className="hired-hud__fleet-scope-ring hired-hud__fleet-scope-ring--inner" />
      <span className="hired-hud__fleet-scope-cross hired-hud__fleet-scope-cross--h" />
      <span className="hired-hud__fleet-scope-cross hired-hud__fleet-scope-cross--v" />
      <span className="hired-hud__fleet-scope-sweep" />

      {units.map((unit) => {
        const track = tracks[unit.slot];
        if (!track) return null;

        const logoSrc = getFleetAircraftRadarLogoPathForSlot(unit.slot, unit.aircraftType);

        return (
          <span
            key={`fleet-scope-blip-${unit.slot}`}
            className="hired-hud__fleet-scope-blip"
            style={{
              left: `${track.x}%`,
              top: `${track.y}%`,
              transform: `translate(-50%, -50%) rotate(${track.headingDeg + 90}deg)`,
            }}
          >
            <img src={logoSrc} alt="" className="hired-hud__fleet-scope-jet" decoding="async" draggable={false} />
          </span>
        );
      })}

      <div className="hired-hud__fleet-scope-header">
        <span className="hired-hud__fleet-scope-title">
          <Radar size={14} aria-hidden />
          Fleet Radar Scope
        </span>
        <span className="hired-hud__fleet-scope-count">{units.length} Developers Tracked</span>
      </div>
    </div>
  );
}
