import { useEffect, useMemo, useState } from "react";
import type { FleetUnit } from "../types/fleet";

export type HiredHudRadarTrack = {
  x: number;
  y: number;
  headingDeg: number;
  speed: number;
  bankAngle: number;
  climbRate: number;
  flightPattern: "shackle" | "tacTurn" | "crossTurn" | "hookTurn";
  formationRole: "lead" | "wing";
  pairIndex: number;
  patternPhase: number;
  targetX: number;
  targetY: number;
  anchorX: number;
  anchorY: number;
  radiusX: number;
  radiusY: number;
  wobble: number;
  direction: 1 | -1;
  phaseOffset: number;
};

export type HiredHudRadarPoint = {
  x: number;
  y: number;
};

const TAU = Math.PI * 2;
const MAX_SCOPE_TRAIL_POINTS = 96;
const PAIR_PATTERNS: readonly HiredHudRadarTrack["flightPattern"][] = [
  "shackle",
  "tacTurn",
  "crossTurn",
  "hookTurn",
  "tacTurn",
];
const PAIR_ANCHORS: readonly HiredHudRadarPoint[] = [
  { x: 28, y: 32 },
  { x: 70, y: 30 },
  { x: 28, y: 72 },
  { x: 70, y: 70 },
  { x: 50, y: 52 },
];

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getHeadingDeg(from: HiredHudRadarPoint, to: HiredHudRadarPoint): number {
  return (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;
}

function normalizeUnitPhase(phase: number): number {
  const normalized = phase % 1;
  return normalized < 0 ? normalized + 1 : normalized;
}

function roleSign(role: HiredHudRadarTrack["formationRole"]): 1 | -1 {
  return role === "lead" ? 1 : -1;
}

function createPatternProfile(
  pairIndex: number,
  role: HiredHudRadarTrack["formationRole"],
  rng: () => number,
): Pick<HiredHudRadarTrack, "flightPattern" | "anchorX" | "anchorY" | "radiusX" | "radiusY" | "wobble" | "direction" | "phaseOffset"> {
  const pattern = PAIR_PATTERNS[pairIndex % PAIR_PATTERNS.length] ?? "shackle";
  const anchor = PAIR_ANCHORS[pairIndex % PAIR_ANCHORS.length] ?? { x: 50, y: 50 };
  const direction: 1 | -1 = rng() > 0.5 ? 1 : -1;

  switch (pattern) {
    case "shackle":
      return {
        flightPattern: pattern,
        anchorX: anchor.x,
        anchorY: anchor.y,
        radiusX: 14 + rng() * 5,
        radiusY: 9 + rng() * 4,
        wobble: 1.8 + rng() * 1.8,
        direction,
        phaseOffset: role === "lead" ? 0 : Math.PI,
      };
    case "tacTurn":
      return {
        flightPattern: pattern,
        anchorX: anchor.x,
        anchorY: anchor.y,
        radiusX: 16 + rng() * 4,
        radiusY: 12 + rng() * 3,
        wobble: 1 + rng() * 1.2,
        direction,
        phaseOffset: role === "lead" ? 0 : 0.17,
      };
    case "crossTurn":
      return {
        flightPattern: pattern,
        anchorX: anchor.x,
        anchorY: anchor.y,
        radiusX: 18 + rng() * 4,
        radiusY: 10 + rng() * 4,
        wobble: 0,
        direction,
        phaseOffset: role === "lead" ? 0 : 0.5,
      };
    case "hookTurn":
    default:
      return {
        flightPattern: pattern,
        anchorX: anchor.x,
        anchorY: anchor.y,
        radiusX: 16 + rng() * 4,
        radiusY: 10 + rng() * 4,
        wobble: 1.4 + rng() * 1.8,
        direction,
        phaseOffset: role === "lead" ? 0 : 0.08,
      };
  }
}

function getTacTurnPoint(track: HiredHudRadarTrack, unitPhase: number): HiredHudRadarPoint {
  const rx = track.radiusX;
  const ry = track.radiusY;
  const path: readonly HiredHudRadarPoint[] = [
    { x: track.anchorX - rx, y: track.anchorY - ry * 0.18 },
    { x: track.anchorX - rx * 0.28, y: track.anchorY - ry * 0.18 },
    { x: track.anchorX + rx * 0.28, y: track.anchorY + ry * 0.12 },
    { x: track.anchorX + rx * 0.7, y: track.anchorY + ry * 0.72 },
    { x: track.anchorX + rx * 0.08, y: track.anchorY + ry * 0.92 },
    { x: track.anchorX - rx * 0.78, y: track.anchorY + ry * 0.28 },
    { x: track.anchorX - rx, y: track.anchorY - ry * 0.18 },
  ];
  const segments = path.length - 1;
  const scaled = normalizeUnitPhase(unitPhase) * segments;
  const index = Math.floor(scaled);
  const nextIndex = (index + 1) % path.length;
  const localT = scaled - index;
  const from = path[index] ?? path[0];
  const to = path[nextIndex] ?? path[1];

  return {
    x: lerp(from.x, to.x, localT),
    y: lerp(from.y, to.y, localT),
  };
}

function getCrossTurnPoint(track: HiredHudRadarTrack, unitPhase: number): HiredHudRadarPoint {
  const sign = roleSign(track.formationRole);
  const phase = normalizeUnitPhase(unitPhase);
  const travel = phase < 0.5 ? phase * 2 : (phase - 0.5) * 2;
  const forward = phase < 0.5;
  const startX = forward ? -track.radiusX : track.radiusX;
  const endX = -startX;
  const arcDirection = forward ? 1 : -1;

  return {
    x: track.anchorX + lerp(startX, endX, travel),
    y: track.anchorY + sign * Math.sin(travel * Math.PI) * track.radiusY * arcDirection,
  };
}

function getHookTurnPoint(track: HiredHudRadarTrack, unitPhase: number): HiredHudRadarPoint {
  const sign = roleSign(track.formationRole);
  const t = normalizeUnitPhase(unitPhase) * TAU * track.direction;
  const sidewaysShift = Math.sin(t * 0.5) * track.radiusX * 0.95;

  return {
    x: track.anchorX + sidewaysShift + Math.cos(t + track.phaseOffset * Math.PI) * track.radiusX * 0.52,
    y:
      track.anchorY +
      sign * 4.5 +
      Math.sin(t + track.phaseOffset * Math.PI) * track.radiusY * 0.72 +
      Math.sin(t * 1.8) * track.wobble,
  };
}

function getShacklePoint(track: HiredHudRadarTrack, unitPhase: number): HiredHudRadarPoint {
  const t = normalizeUnitPhase(unitPhase) * TAU * track.direction + track.phaseOffset;

  return {
    x: track.anchorX + Math.sin(t) * track.radiusX,
    y: track.anchorY + Math.sin(t * 2) * track.radiusY * 0.58 + Math.cos(t) * track.wobble,
  };
}

function getPatternPoint(track: HiredHudRadarTrack, phase: number): HiredHudRadarPoint {
  const unitPhase = phase + track.phaseOffset;

  switch (track.flightPattern) {
    case "shackle":
      return getShacklePoint(track, unitPhase);
    case "tacTurn":
      return getTacTurnPoint(track, unitPhase);
    case "crossTurn":
      return getCrossTurnPoint(track, unitPhase);
    case "hookTurn":
    default:
      return getHookTurnPoint(track, unitPhase);
  }
}

export function createInitialHiredHudRadarTrack(
  slot: number,
  pairIndex: number,
  formationRole: HiredHudRadarTrack["formationRole"],
): HiredHudRadarTrack {
  const rng = createSeededRandom(slot * 7919 + 104729);
  const profile = createPatternProfile(pairIndex, formationRole, rng);
  const patternPhase = rng();
  const initialPoint = getPatternPoint(
    {
      x: 0,
      y: 0,
      headingDeg: 0,
      speed: 0,
      bankAngle: 0,
      climbRate: 0,
      pairIndex,
      formationRole,
      patternPhase,
      targetX: 0,
      targetY: 0,
      ...profile,
    },
    patternPhase,
  );
  const nextPoint = getPatternPoint(
    {
      x: 0,
      y: 0,
      headingDeg: 0,
      speed: 0,
      bankAngle: 0,
      climbRate: 0,
      pairIndex,
      formationRole,
      patternPhase,
      targetX: 0,
      targetY: 0,
      ...profile,
    },
    patternPhase + 0.01,
  );

  return {
    x: initialPoint.x,
    y: initialPoint.y,
    headingDeg: getHeadingDeg(initialPoint, nextPoint),
    speed: 0.82 + rng() * 1.08,
    bankAngle: (rng() - 0.5) * 18,
    climbRate: (rng() - 0.5) * 0.24,
    pairIndex,
    formationRole,
    patternPhase,
    targetX: nextPoint.x,
    targetY: nextPoint.y,
    ...profile,
  };
}

export function driftHiredHudRadarTrack(track: HiredHudRadarTrack, rng: () => number): HiredHudRadarTrack {
  const phaseRate =
    track.flightPattern === "crossTurn"
      ? 0.02
      : track.flightPattern === "tacTurn"
        ? 0.024
        : 0.028;
  const newPatternPhase = track.patternPhase + phaseRate * track.speed;
  const currentPoint = getPatternPoint(track, track.patternPhase);
  const nextPoint = getPatternPoint(track, newPatternPhase);

  let bankAngle = track.bankAngle;
  let climbRate = track.climbRate;

  switch (track.flightPattern) {
    case "shackle":
      bankAngle = 22 * Math.sin(track.patternPhase * TAU * 1.1 + track.phaseOffset);
      climbRate = Math.cos(track.patternPhase * TAU * 0.7) * 0.08;
      break;
    case "tacTurn":
      bankAngle = 18 + Math.sin(track.patternPhase * TAU * 1.4) * 12;
      climbRate = Math.sin(track.patternPhase * TAU * 0.5) * 0.06;
      break;
    case "crossTurn":
      bankAngle = roleSign(track.formationRole) * (24 + Math.sin(track.patternPhase * TAU) * 10);
      climbRate = roleSign(track.formationRole) * Math.sin(track.patternPhase * TAU * 2) * 0.05;
      break;
    case "hookTurn":
    default:
      bankAngle = 16 + Math.sin(track.patternPhase * TAU * 1.1 + 0.6) * 14;
      climbRate = Math.cos(track.patternPhase * TAU * 0.55) * 0.05;
      break;
  }

  return {
    ...track,
    x: currentPoint.x,
    y: currentPoint.y,
    headingDeg: getHeadingDeg(currentPoint, nextPoint),
    speed: Math.max(0.72, Math.min(2.1, track.speed + (rng() - 0.5) * 0.04)),
    bankAngle: Math.max(-45, Math.min(45, bankAngle)),
    climbRate: Math.max(-1, Math.min(1, climbRate)),
    patternPhase: newPatternPhase,
    targetX: nextPoint.x,
    targetY: nextPoint.y,
  };
}

export function trackToRadarPoint(track: HiredHudRadarTrack): HiredHudRadarPoint {
  return {
    x: track.x,
    y: track.y,
  };
}

function getPairIndexForUnit(units: FleetUnit[], slot: number): number {
  const sortedSlots = [...units].sort((a, b) => a.slot - b.slot).map((unit) => unit.slot);
  const unitIndex = sortedSlots.findIndex((value) => value === slot);
  return Math.max(0, Math.floor(unitIndex / 2));
}

function getFormationRoleForUnit(units: FleetUnit[], slot: number): HiredHudRadarTrack["formationRole"] {
  const sortedSlots = [...units].sort((a, b) => a.slot - b.slot).map((unit) => unit.slot);
  const unitIndex = sortedSlots.findIndex((value) => value === slot);
  return unitIndex % 2 === 0 ? "lead" : "wing";
}

export function useHiredHudRadarScope(units: FleetUnit[]): {
  tracks: Record<number, HiredHudRadarTrack>;
  trailPoints: Record<number, HiredHudRadarPoint[]>;
} {
  const pairMeta = useMemo(
    () =>
      Object.fromEntries(
        units.map((unit) => [
          unit.slot,
          {
            pairIndex: getPairIndexForUnit(units, unit.slot),
            formationRole: getFormationRoleForUnit(units, unit.slot),
          },
        ]),
      ),
    [units],
  );

  const [tracks, setTracks] = useState<Record<number, HiredHudRadarTrack>>(() => {
    const next: Record<number, HiredHudRadarTrack> = {};
    for (const unit of units) {
      const meta = pairMeta[unit.slot];
      next[unit.slot] = createInitialHiredHudRadarTrack(unit.slot, meta?.pairIndex ?? 0, meta?.formationRole ?? "lead");
    }
    return next;
  });

  const [trailPoints, setTrailPoints] = useState<Record<number, HiredHudRadarPoint[]>>(() => {
    const next: Record<number, HiredHudRadarPoint[]> = {};
    for (const unit of units) {
      const meta = pairMeta[unit.slot];
      const track = createInitialHiredHudRadarTrack(unit.slot, meta?.pairIndex ?? 0, meta?.formationRole ?? "lead");
      next[unit.slot] = [trackToRadarPoint(track)];
    }
    return next;
  });

  const rngs = useMemo(
    () => Object.fromEntries(units.map((unit) => [unit.slot, createSeededRandom(unit.slot * 3571 + 90210)])),
    [units],
  );

  useEffect(() => {
    setTracks((current) => {
      const next = { ...current };
      for (const unit of units) {
        const meta = pairMeta[unit.slot];
        next[unit.slot] ??= createInitialHiredHudRadarTrack(unit.slot, meta?.pairIndex ?? 0, meta?.formationRole ?? "lead");
      }
      for (const slot of Object.keys(next).map(Number)) {
        if (!units.some((unit) => unit.slot === slot)) {
          delete next[slot];
        }
      }
      return next;
    });

    setTrailPoints((current) => {
      const next = { ...current };
      for (const unit of units) {
        const meta = pairMeta[unit.slot];
        next[unit.slot] ??= [
          trackToRadarPoint(
            createInitialHiredHudRadarTrack(unit.slot, meta?.pairIndex ?? 0, meta?.formationRole ?? "lead"),
          ),
        ];
      }
      for (const slot of Object.keys(next).map(Number)) {
        if (!units.some((unit) => unit.slot === slot)) {
          delete next[slot];
        }
      }
      return next;
    });
  }, [pairMeta, units]);

  useEffect(() => {
    const intervalMs = 420;
    const id = window.setInterval(() => {
      if (document.hidden) return;

      setTracks((current) => {
        const next = { ...current };
        for (const unit of units) {
          const meta = pairMeta[unit.slot];
          const currentTrack =
            current[unit.slot] ??
            createInitialHiredHudRadarTrack(unit.slot, meta?.pairIndex ?? 0, meta?.formationRole ?? "lead");
          const rng = rngs[unit.slot];
          if (!rng) continue;
          next[unit.slot] = driftHiredHudRadarTrack(currentTrack, rng);
        }
        return next;
      });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [pairMeta, rngs, units]);

  useEffect(() => {
    setTrailPoints((current) => {
      const next = { ...current };
      for (const unit of units) {
        const track = tracks[unit.slot];
        if (!track) continue;
        const point = trackToRadarPoint(track);
        const history = next[unit.slot] ?? [];
        next[unit.slot] = [...history.slice(-(MAX_SCOPE_TRAIL_POINTS - 1)), point];
      }
      return next;
    });
  }, [tracks, units]);

  return { tracks, trailPoints };
}
