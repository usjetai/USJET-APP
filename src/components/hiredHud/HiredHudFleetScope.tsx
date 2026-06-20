import { useEffect, useMemo, useState } from "react";
import { Radar } from "lucide-react";
import { HIRED_HUD_RADAR_SCOPE_MAP_SRC } from "../../data/hiredHudAssets";
import { getFleetAircraftRadarLogoPathForSlot } from "../../lib/fleetAircraftLogos";
import type { FleetUnit } from "../../types/fleet";

type HiredHudFleetScopeProps = {
  units: FleetUnit[];
};

type JetTrack = {
  angleDeg: number;
  radiusPct: number;
  headingDeg: number;
};

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function initialTrack(slot: number): JetTrack {
  const rng = createSeededRandom(slot * 7919 + 104729);
  return {
    angleDeg: rng() * 360,
    radiusPct: 15 + rng() * 30,
    headingDeg: rng() * 360,
  };
}

function driftTrack(track: JetTrack, rng: () => number): JetTrack {
  const angleDeg = (track.angleDeg + (rng() - 0.5) * 36 + 360) % 360;
  const radiusPct = Math.max(10, Math.min(42, track.radiusPct + (rng() - 0.5) * 8));
  const headingDeg = (track.headingDeg + (rng() - 0.5) * 54 + 360) % 360;

  return { angleDeg, radiusPct, headingDeg };
}

function trackToPosition(track: JetTrack): { x: number; y: number } {
  const radians = (track.angleDeg * Math.PI) / 180;
  return {
    x: 50 + Math.cos(radians) * track.radiusPct,
    y: 50 + Math.sin(radians) * track.radiusPct,
  };
}

export default function HiredHudFleetScope({ units }: HiredHudFleetScopeProps) {
  const [tracks, setTracks] = useState<Record<number, JetTrack>>(() =>
    Object.fromEntries(units.map((unit) => [unit.slot, initialTrack(unit.slot)])),
  );

  const rngs = useMemo(
    () => Object.fromEntries(units.map((unit) => [unit.slot, createSeededRandom(unit.slot * 3571 + 90210)])),
    [units],
  );

  useEffect(() => {
    const intervalMs = 840;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setTracks((current) => {
        const next = { ...current };
        for (const unit of units) {
          const rng = rngs[unit.slot];
          if (rng) {
            next[unit.slot] = driftTrack(current[unit.slot], rng);
          }
        }
        return next;
      });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [units, rngs]);

  return (
    <div className="hired-hud__fleet-scope glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan relative" aria-label="Fleet radar scope - all developers">
      <span
        className="hired-hud__fleet-scope-map"
        style={{ backgroundImage: `url("${HIRED_HUD_RADAR_SCOPE_MAP_SRC}")` }}
      />
      <span className="hired-hud__fleet-scope-ring hired-hud__fleet-scope-ring--outer" />
      <span className="hired-hud__fleet-scope-ring hired-hud__fleet-scope-ring--mid" />
      <span className="hired-hud__fleet-scope-ring hired-hud__fleet-scope-ring--inner" />
      <span className="hired-hud__fleet-scope-cross hired-hud__fleet-scope-cross--h" />
      <span className="hired-hud__fleet-scope-cross hired-hud__fleet-scope-cross--v" />
      <span className="hired-hud__fleet-scope-sweep" />
      
      {units.map((unit) => {
        const track = tracks[unit.slot];
        if (!track) return null;
        
        const position = trackToPosition(track);
        const logoSrc = getFleetAircraftRadarLogoPathForSlot(unit.slot, unit.aircraftType);
        
        return (
          <span
            key={`fleet-scope-blip-${unit.slot}`}
            className="hired-hud__fleet-scope-blip"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: `translate(-50%, -50%) rotate(${track.headingDeg}deg)`,
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
