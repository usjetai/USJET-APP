/**
 * NBA regulation court geometry — 94 ft × 50 ft.
 * Scaled to Jet Hoops canvas (10 px per foot).
 * Sources: NBA Rule No. 1, official court diagrams.
 */

import { JET_HOOPS_COURT_HEIGHT, JET_HOOPS_COURT_WIDTH } from "./jetHoops";

export const NBA_COURT_LENGTH_FT = 94;
export const NBA_COURT_WIDTH_FT = 50;

/** Pixels per foot on the Jet Hoops canvas. */
export const NBA_PX_PER_FT = JET_HOOPS_COURT_WIDTH / NBA_COURT_LENGTH_FT;

export function nbaFt(feet: number): number {
  return feet * NBA_PX_PER_FT;
}

export const NBA_LINE_WIDTH = 2;

/** Rim center — 5.25 ft from baseline (backboard + overhang). */
export const NBA_RIM_OFFSET_FT = 5.25;

export const NBA_GEOMETRY = {
  paintWidthFt: 16,
  paintLengthFt: 19,
  freeThrowCircleRadiusFt: 6,
  centerCircleRadiusFt: 6,
  restrictedAreaRadiusFt: 4,
  threePointArcFt: 23 + 9 / 12,
  threePointCornerFt: 22,
  threePointSidelineInsetFt: 3,
  backboardWidthFt: 6,
} as const;

export function nbaLeftRimX(): number {
  return nbaFt(NBA_RIM_OFFSET_FT);
}

export function nbaRightRimX(): number {
  return JET_HOOPS_COURT_WIDTH - nbaFt(NBA_RIM_OFFSET_FT);
}

export function nbaCourtMidY(): number {
  return JET_HOOPS_COURT_HEIGHT / 2;
}

export function nbaSidelineTop(): number {
  return 0;
}

export function nbaSidelineBottom(): number {
  return JET_HOOPS_COURT_HEIGHT;
}

/** Half-court line X. */
export function nbaHalfCourtX(): number {
  return JET_HOOPS_COURT_WIDTH / 2;
}
