/**
 * NBA regulation court geometry — Rule No. 1 (94' × 50').
 * Internal units: 10 px per foot → 940 × 500 playable surface.
 */

export const NBA_COURT_LENGTH_FT = 94;
export const NBA_COURT_WIDTH_FT = 50;
export const NBA_PX_PER_FT = 10;

export const NBA_COURT_W = NBA_COURT_LENGTH_FT * NBA_PX_PER_FT;
export const NBA_COURT_H = NBA_COURT_WIDTH_FT * NBA_PX_PER_FT;

/** Rim center ≈ 5.25' from baseline (4' backboard + 15" to rim). */
export const NBA_RIM_BASELINE_FT = 5.25;
export const NBA_RIM_CENTER_X_LEFT = NBA_RIM_BASELINE_FT * NBA_PX_PER_FT;
export const NBA_RIM_CENTER_X_RIGHT = NBA_COURT_W - NBA_RIM_CENTER_X_LEFT;
export const NBA_RIM_CENTER_Y = NBA_COURT_H / 2;

export const NBA_PAINT_WIDTH_FT = 16;
export const NBA_PAINT_LENGTH_FT = 19;
export const NBA_FT_CIRCLE_RADIUS_FT = 6;
export const NBA_CENTER_CIRCLE_RADIUS_FT = 6;
export const NBA_RESTRICTED_ARC_RADIUS_FT = 4;
export const NBA_THREE_ARC_FT = 23 + 9 / 12;
export const NBA_THREE_CORNER_FT = 22;
export const NBA_THREE_SIDELINE_FT = 3;
export const NBA_LINE_WIDTH_IN = 2;

export const NBA_PAINT_W = NBA_PAINT_WIDTH_FT * NBA_PX_PER_FT;
export const NBA_PAINT_L = NBA_PAINT_LENGTH_FT * NBA_PX_PER_FT;
export const NBA_FT_CIRCLE_R = NBA_FT_CIRCLE_RADIUS_FT * NBA_PX_PER_FT;
export const NBA_CENTER_CIRCLE_R = NBA_CENTER_CIRCLE_RADIUS_FT * NBA_PX_PER_FT;
export const NBA_RESTRICTED_R = NBA_RESTRICTED_ARC_RADIUS_FT * NBA_PX_PER_FT;
export const NBA_THREE_R = NBA_THREE_ARC_FT * NBA_PX_PER_FT;
export const NBA_THREE_CORNER_R = NBA_THREE_CORNER_FT * NBA_PX_PER_FT;
export const NBA_THREE_SIDELINE = NBA_THREE_SIDELINE_FT * NBA_PX_PER_FT;
export const NBA_LINE_W = Math.max(1.5, (NBA_LINE_WIDTH_IN / 12) * NBA_PX_PER_FT);

export type NbaBasketSide = "left" | "right";

export function nbaRimCenter(side: NbaBasketSide): { x: number; y: number } {
  return {
    x: side === "left" ? NBA_RIM_CENTER_X_LEFT : NBA_RIM_CENTER_X_RIGHT,
    y: NBA_RIM_CENTER_Y,
  };
}

/** Where the 3pt arc meets the corner straight (parallel to sideline). */
export function nbaThreePointCornerX(side: NbaBasketSide, fromTop: boolean): number {
  const rim = nbaRimCenter(side);
  const y = fromTop ? NBA_THREE_SIDELINE : NBA_COURT_H - NBA_THREE_SIDELINE;
  const dy = Math.abs(y - rim.y);
  const dx = Math.sqrt(Math.max(0, NBA_THREE_R ** 2 - dy ** 2));
  return side === "left" ? rim.x + dx : rim.x - dx;
}

/** Half-court sideline inset for player bounds. */
export const NBA_PLAYABLE_MARGIN = 22;
