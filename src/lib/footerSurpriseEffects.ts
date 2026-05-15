/** Footer chip “fourth process” — random delight layers on existing animations. */

export const FOOTER_SURPRISE_EFFECTS = [
  "shake",
  "pop",
  "wobble",
  "tilt",
  "orbit",
  "bounce",
  "glow-cyan",
  "glow-gold",
  "flash",
  "neon",
  "glitch",
  "ring",
] as const;

export type FooterSurpriseEffect = (typeof FOOTER_SURPRISE_EFFECTS)[number];

/** Lane A — fires every 3, 9, or 18 seconds (random pick each cycle). */
export const FOOTER_SURPRISE_LANE_A_SEC = [3, 9, 18] as const;

/** Lane B — 5, 10, or 15 seconds. */
export const FOOTER_SURPRISE_LANE_B_SEC = [5, 10, 15] as const;

/** Lane C — 7, 14, or 21 seconds. */
export const FOOTER_SURPRISE_LANE_C_SEC = [7, 14, 21] as const;

export const FOOTER_SURPRISE_PULSE_MS = 780;

export function pickFooterSurpriseEffect(): FooterSurpriseEffect {
  return FOOTER_SURPRISE_EFFECTS[Math.floor(Math.random() * FOOTER_SURPRISE_EFFECTS.length)]!;
}

export function pickLaneDelaySec(intervals: readonly number[]): number {
  return intervals[Math.floor(Math.random() * intervals.length)]!;
}

export function hashFooterChipSeed(chipId: string): number {
  let hash = 0;
  for (let i = 0; i < chipId.length; i += 1) {
    hash = (hash << 5) - hash + chipId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
