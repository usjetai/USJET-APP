import { HANGAR_COLUMNS, HANGAR_ROWS } from "../types/fleet";

/** Max simultaneous 2×2 workbenches on Intel or Hangar fleet grids (triple bay). */
export const MAX_SIMULTANEOUS_WORKBENCHES = 3;

/** @deprecated Prefer MAX_SIMULTANEOUS_WORKBENCHES */
export const MAX_INTEL_EXPANDED_WORKSTATIONS = MAX_SIMULTANEOUS_WORKBENCHES;

const COLS = HANGAR_COLUMNS;
const ROWS = HANGAR_ROWS;

/** Top-left index (0–29) of the 2×2 quad that contains this slot. */
export function anchorIndexForSlot(slot: number): number {
  const r = Math.floor(slot / COLS);
  const c = slot % COLS;
  const ar = Math.min(r, ROWS - 2);
  const ac = Math.min(c, COLS - 2);
  return ar * COLS + ac;
}

/** Four slot indices covered by a 2×2 anchored at `anchor` (top-left). */
export function quadSlotIndices(anchor: number): number[] {
  return [anchor, anchor + 1, anchor + COLS, anchor + COLS + 1];
}

export function quadsOverlap(anchorA: number, anchorB: number): boolean {
  const setA = new Set(quadSlotIndices(anchorA));
  return quadSlotIndices(anchorB).some((i) => setA.has(i));
}

/**
 * Resolves a fleet `href` (or bare host) to an absolute URL for iframe `src` / tactical launch.
 * Hangar workstations use each unit's real tool origin (e.g. https://chatgpt.com).
 */
export function iframeSrcFromUnitHref(href: string): string {
  const h = href.trim();
  if (h.startsWith("http://") || h.startsWith("https://")) {
    return h;
  }
  if (h.startsWith("/")) {
    return h;
  }
  return `https://${h}`;
}

/** Hangar bay iframe source — internal USJET routes only. */
export function hangarWorkbenchIframeSrc(rawSrc: string, _cockpitLaunchHref?: string): string {
  return rawSrc;
}
