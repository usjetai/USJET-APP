import { Radar } from "lucide-react";
import { HIRED_HUD_RADAR_SCOPE_MAP_SRC } from "../../data/hiredHudAssets";
import { getFleetAircraftRadarLogoPathForSlot } from "../../lib/fleetAircraftLogos";
import type { HiredHudRadarPoint, HiredHudRadarTrack } from "../../lib/hiredHudRadar";
import type { FleetAircraftType } from "../../types/fleet";

type HiredHudJetRadarProps = {
  slot: number;
  aircraftType: FleetAircraftType;
  track: HiredHudRadarTrack;
  trailPoints: HiredHudRadarPoint[];
  /** Hub monitor tile — larger scope than crew strip. */
  variant?: "hub-tile";
};

const TILE_TRAIL_POINTS = 24;

export default function HiredHudJetRadar({ slot, aircraftType, track, trailPoints, variant }: HiredHudJetRadarProps) {
  const logoSrc = getFleetAircraftRadarLogoPathForSlot(slot, aircraftType);
  const visibleTrail = trailPoints.slice(-TILE_TRAIL_POINTS);

  return (
    <div
      className={["hired-hud__jet-radar", variant === "hub-tile" ? "hired-hud__jet-radar--hub-tile" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    >
      {variant === "hub-tile" ? (
        <span
          className="hired-hud__jet-radar-map"
          style={{ backgroundImage: `url("${HIRED_HUD_RADAR_SCOPE_MAP_SRC}")` }}
        />
      ) : null}
      <svg className="hired-hud__jet-radar-paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <line className="hired-hud__jet-radar-runway" x1="50" y1="-22" x2="50" y2="122" />
        <line className="hired-hud__jet-radar-runway" x1="-4" y1="4" x2="104" y2="96" />
        <line className="hired-hud__jet-radar-runway" x1="104" y1="4" x2="-4" y2="96" />
        {visibleTrail.slice(1).map((point, index) => {
          const previous = visibleTrail[index];
          const fadeProgress = (index + 1) / (visibleTrail.length - 1);
          return (
            <line
              key={`jet-radar-path-${slot}-${index}`}
              className="hired-hud__jet-radar-path"
              x1={previous?.x ?? point.x}
              y1={previous?.y ?? point.y}
              x2={point.x}
              y2={point.y}
              style={{ opacity: fadeProgress * 0.55 }}
            />
          );
        })}
      </svg>
      <span className="hired-hud__jet-radar-ring hired-hud__jet-radar-ring--outer" />
      <span className="hired-hud__jet-radar-ring hired-hud__jet-radar-ring--mid" />
      <span className="hired-hud__jet-radar-ring hired-hud__jet-radar-ring--inner" />
      <span className="hired-hud__jet-radar-cross hired-hud__jet-radar-cross--h" />
      <span className="hired-hud__jet-radar-cross hired-hud__jet-radar-cross--v" />
      <span className="hired-hud__jet-radar-sweep" />
      <span
        className="hired-hud__jet-radar-blip"
        style={{
          left: `${track.x}%`,
          top: `${track.y}%`,
          transform: `translate(-50%, -50%) rotate(${track.headingDeg + 90}deg)`,
        }}
      >
        <img src={logoSrc} alt="" className="hired-hud__jet-radar-jet" decoding="async" draggable={false} />
      </span>
      <span className="hired-hud__jet-radar-label">
        <Radar size={8} aria-hidden />
        Track
      </span>
    </div>
  );
}
