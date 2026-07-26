/**
 * Fleet runway takeoff flight plans.
 * Aircraft art is nose-up at 0° — that is forward. CSS rotate is clockwise.
 */

export type FleetFlightPlan = {
  size: number;
  originLeft: number;
  originTop: number;
  rotate: number[];
  x: number[];
  y: number[];
  scale: number[];
  opacity: number[];
  times: number[];
  duration: number;
};

/** Offset from origin when nose faces `headingDeg` (0 = up / forward). */
export function headingToDelta(headingDeg: number, distance: number): { x: number; y: number } {
  const rad = (headingDeg * Math.PI) / 180;
  return {
    x: Math.sin(rad) * distance,
    y: -Math.cos(rad) * distance,
  };
}

function normalizeDelta(delta: number): number {
  const wrapped = ((delta % 360) + 360) % 360;
  return wrapped > 180 ? wrapped - 360 : wrapped;
}

/** Continuous rotate value that turns the short way from `fromDeg` toward `toDeg`. */
export function shortestTurn(fromDeg: number, toDeg: number): number {
  return fromDeg + normalizeDelta(toDeg - fromDeg);
}

/**
 * Build a random sortie: turn nose → roll out → cruise the viewport → exit off-page.
 * Position keyframes are offsets from the tile origin (for `position: fixed` flight).
 */
export function buildRandomFleetFlightPlan(rect: DOMRect): FleetFlightPlan {
  const size = Math.max(rect.width, rect.height, 96);
  const originLeft = rect.left + rect.width / 2;
  const originTop = rect.top + rect.height / 2;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  let travelHeading = Math.random() * 360;
  let visualRotate = shortestTurn(0, travelHeading);
  const rotateNose = visualRotate;

  const d1 = 130 + Math.random() * 170;
  const p1 = headingToDelta(travelHeading, d1);

  const turn1 = (75 + Math.random() * 130) * (Math.random() < 0.5 ? 1 : -1);
  travelHeading = (travelHeading + turn1 + 360) % 360;
  visualRotate = shortestTurn(visualRotate, travelHeading);
  const rotateCruise = visualRotate;
  const d2 = 200 + Math.random() * 260;
  const step2 = headingToDelta(travelHeading, d2);
  const p2 = { x: p1.x + step2.x, y: p1.y + step2.y };

  const turn2 = (55 + Math.random() * 125) * (Math.random() < 0.5 ? 1 : -1);
  travelHeading = (travelHeading + turn2 + 360) % 360;
  visualRotate = shortestTurn(visualRotate, travelHeading);
  const rotateSweep = visualRotate;
  const d3 = 170 + Math.random() * 220;
  const step3 = headingToDelta(travelHeading, d3);
  const p3 = { x: p2.x + step3.x, y: p2.y + step3.y };

  const turn3 = (25 + Math.random() * 80) * (Math.random() < 0.5 ? 1 : -1);
  travelHeading = (travelHeading + turn3 + 360) % 360;
  visualRotate = shortestTurn(visualRotate, travelHeading);
  const exitDist = Math.hypot(vw, vh) * (0.85 + Math.random() * 0.4);
  const stepExit = headingToDelta(travelHeading, exitDist);
  const pExit = { x: p3.x + stepExit.x, y: p3.y + stepExit.y };

  return {
    size,
    originLeft,
    originTop,
    // rest → nose aims → climb-out → cruise turn → sweep → leave the page
    rotate: [0, rotateNose, rotateNose, rotateCruise, rotateSweep, visualRotate],
    x: [0, 0, p1.x, p2.x, p3.x, pExit.x],
    y: [0, 0, p1.y, p2.y, p3.y, pExit.y],
    scale: [1, 1.06, 1.14, 1.2, 1.24, 0.78],
    opacity: [1, 1, 1, 1, 0.92, 0],
    times: [0, 0.1, 0.28, 0.52, 0.74, 1],
    duration: 2.9 + Math.random() * 0.7,
  };
}
