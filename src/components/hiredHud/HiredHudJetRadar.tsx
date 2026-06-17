import { useEffect, useMemo, useState } from "react";
import { Radar } from "lucide-react";
import { getFleetAircraftLogoPathForSlot } from "../../lib/fleetAircraftLogos";
import type { FleetAircraftType } from "../../types/fleet";

type HiredHudJetRadarProps = {
  slot: number;
  aircraftType: FleetAircraftType;
  /** Hub monitor tile — larger scope than crew strip. */
  variant?: "hub-tile";
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
    radiusPct: 12 + rng() * 24,
    headingDeg: rng() * 360,
  };
}

function driftTrack(track: JetTrack, rng: () => number): JetTrack {
  const angleDeg = (track.angleDeg + (rng() - 0.5) * 48 + 360) % 360;
  const radiusPct = Math.max(8, Math.min(38, track.radiusPct + (rng() - 0.5) * 10));
  const headingDeg = (track.headingDeg + (rng() - 0.5) * 70 + 360) % 360;

  return { angleDeg, radiusPct, headingDeg };
}

function trackToPosition(track: JetTrack): { x: number; y: number } {
  const radians = (track.angleDeg * Math.PI) / 180;
  return {
    x: 50 + Math.cos(radians) * track.radiusPct,
    y: 50 + Math.sin(radians) * track.radiusPct,
  };
}

export default function HiredHudJetRadar({ slot, aircraftType, variant }: HiredHudJetRadarProps) {
  const [track, setTrack] = useState<JetTrack>(() => initialTrack(slot));
  const rng = useMemo(() => createSeededRandom(slot * 3571 + 90210), [slot]);
  const logoSrc = getFleetAircraftLogoPathForSlot(slot, aircraftType);
  const position = trackToPosition(track);

  useEffect(() => {
    const intervalMs = 720 + (slot % 7) * 95;
    const id = window.setInterval(() => {
      setTrack((current) => driftTrack(current, rng));
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [rng, slot]);

  return (
    <div
      className={["hired-hud__jet-radar", variant === "hub-tile" ? "hired-hud__jet-radar--hub-tile" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    >
      <span className="hired-hud__jet-radar-ring hired-hud__jet-radar-ring--outer" />
      <span className="hired-hud__jet-radar-ring hired-hud__jet-radar-ring--mid" />
      <span className="hired-hud__jet-radar-ring hired-hud__jet-radar-ring--inner" />
      <span className="hired-hud__jet-radar-cross hired-hud__jet-radar-cross--h" />
      <span className="hired-hud__jet-radar-cross hired-hud__jet-radar-cross--v" />
      <span className="hired-hud__jet-radar-sweep" />
      <span
        className="hired-hud__jet-radar-blip"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) rotate(${track.headingDeg}deg)`,
        }}
      >
        <img src={logoSrc} alt="" className="hired-hud__jet-radar-jet logo-rounded" decoding="async" draggable={false} />
      </span>
      <span className="hired-hud__jet-radar-label">
        <Radar size={8} aria-hidden />
        Track
      </span>
    </div>
  );
}
