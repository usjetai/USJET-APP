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
  speed: number;
  bankAngle: number;
  climbRate: number;
  flightPattern: "orbit" | "figure8" | "holding" | "sweep" | "intercept";
  patternPhase: number;
  targetAngle: number;
  targetRadius: number;
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
  const patterns: Array<"orbit" | "figure8" | "holding" | "sweep" | "intercept"> = ["orbit", "figure8", "holding", "sweep", "intercept"];
  const flightPattern = patterns[Math.floor(rng() * patterns.length)];
  
  return {
    angleDeg: rng() * 360,
    radiusPct: 5 + rng() * 45,
    headingDeg: rng() * 360,
    speed: 0.8 + rng() * 2.0,
    bankAngle: (rng() - 0.5) * 30,
    climbRate: (rng() - 0.5) * 0.5,
    flightPattern,
    patternPhase: rng() * Math.PI * 2,
    targetAngle: rng() * 360,
    targetRadius: 10 + rng() * 40,
  };
}

function driftTrack(track: JetTrack, rng: () => number): JetTrack {
  const { flightPattern, patternPhase, speed, bankAngle, climbRate } = track;
  let newAngleDeg = track.angleDeg;
  let newRadiusPct = track.radiusPct;
  let newHeadingDeg = track.headingDeg;
  let newBankAngle = bankAngle;
  let newClimbRate = climbRate;
  let newPatternPhase = patternPhase + 0.05 * speed;

  switch (flightPattern) {
    case "orbit": {
      const orbitRadius = 25 + Math.sin(patternPhase * 0.5) * 8;
      const orbitSpeed = 0.8 * speed;
      newAngleDeg = (track.angleDeg + orbitSpeed + 360) % 360;
      newRadiusPct = orbitRadius;
      newHeadingDeg = (newAngleDeg + 90 + 360) % 360;
      newBankAngle = 25 + Math.sin(patternPhase) * 10;
      newClimbRate = Math.sin(patternPhase * 0.3) * 0.2;
      break;
    }
    case "figure8": {
      const figure8Radius = 28 + Math.cos(patternPhase) * 12;
      const figure8Speed = 0.6 * speed;
      newAngleDeg = (track.angleDeg + figure8Speed * Math.cos(patternPhase) + 360) % 360;
      newRadiusPct = Math.max(12, Math.min(40, figure8Radius));
      newHeadingDeg = (newAngleDeg + Math.sin(patternPhase) * 45 + 360) % 360;
      newBankAngle = Math.sin(patternPhase * 2) * 35;
      newClimbRate = Math.cos(patternPhase) * 0.3;
      break;
    }
    case "holding": {
      const holdRadius = 22;
      const holdSpeed = 0.4 * speed;
      newAngleDeg = (track.angleDeg + holdSpeed + 360) % 360;
      newRadiusPct = holdRadius + Math.sin(patternPhase * 2) * 3;
      newHeadingDeg = (newAngleDeg + 85 + 360) % 360;
      newBankAngle = 15 + Math.sin(patternPhase * 4) * 8;
      newClimbRate = Math.sin(patternPhase * 3) * 0.15;
      break;
    }
    case "sweep": {
      const sweepRadius = 18 + Math.sin(patternPhase * 0.7) * 15;
      const sweepSpeed = 1.2 * speed;
      newAngleDeg = (track.angleDeg + sweepSpeed + 360) % 360;
      newRadiusPct = Math.max(10, Math.min(42, sweepRadius));
      newHeadingDeg = (newAngleDeg + 60 + Math.sin(patternPhase) * 30 + 360) % 360;
      newBankAngle = -20 + Math.cos(patternPhase) * 25;
      newClimbRate = Math.sin(patternPhase * 0.5) * 0.4;
      break;
    }
    case "intercept": {
      const interceptSpeed = 1.5 * speed;
      const angleToTarget = (track.targetAngle - track.angleDeg + 540) % 360 - 180;
      const radiusToTarget = track.targetRadius - track.radiusPct;
      
      newAngleDeg = (track.angleDeg + Math.sign(angleToTarget) * Math.min(Math.abs(angleToTarget), interceptSpeed * 2) + 360) % 360;
      newRadiusPct = Math.max(12, Math.min(40, track.radiusPct + Math.sign(radiusToTarget) * Math.min(Math.abs(radiusToTarget), interceptSpeed)));
      newHeadingDeg = (newAngleDeg + angleToTarget * 0.3 + 360) % 360;
      newBankAngle = angleToTarget * 0.4;
      newClimbRate = radiusToTarget * 0.02;
      
      if (Math.abs(angleToTarget) < 5 && Math.abs(radiusToTarget) < 2) {
        newPatternPhase = patternPhase + 0.1;
      }
      break;
    }
  }

  return {
    angleDeg: newAngleDeg,
    radiusPct: newRadiusPct,
    headingDeg: newHeadingDeg,
    speed: track.speed + (rng() - 0.5) * 0.1,
    bankAngle: Math.max(-45, Math.min(45, newBankAngle)),
    climbRate: Math.max(-1, Math.min(1, newClimbRate)),
    flightPattern: track.flightPattern,
    patternPhase: newPatternPhase,
    targetAngle: track.targetAngle,
    targetRadius: track.targetRadius,
  };
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
    const intervalMs = 420;
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
              transform: `translate(-50%, -50%) rotate(${track.bankAngle}deg)`,
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
