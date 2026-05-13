import { HANGAR_COLUMNS, HANGAR_ROWS } from "../types/fleet";

/** Maximum simultaneous 2×2 Intel workbenches (triple workstation). */
export const MAX_INTEL_EXPANDED_WORKSTATIONS = 3;

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

export function iframeSrcFromUnitHref(href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  if (href.startsWith("/")) {
    return href;
  }
  return `https://${href}`;
}
