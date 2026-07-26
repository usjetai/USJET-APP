/**
 * Fleet runway takeoff flight plans.
 * Aircraft art is nose-up at 0° — that is forward. CSS rotate is clockwise.
 * Paths only move forward along the nose; airplanes never reverse.
 * After the sortie leaves the page, one final full-viewport pass plays, then launch.
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

/** Offset when nose faces `headingDeg` (0 = up / forward). Always nose-first. */
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

/** Continuous rotate that turns the short way from `fromDeg` toward `toDeg`. */
export function shortestTurn(fromDeg: number, toDeg: number): number {
  return fromDeg + normalizeDelta(toDeg - fromDeg);
}

type FlightSample = {
  x: number;
  y: number;
  /** Continuous CSS rotate; nose always matches forward travel. */
  rotate: number;
};

/**
 * Sample a forward-only curved sortie.
 * Each beat advances along the current nose heading, then banks a little for the next —
 * never slides sideways or reverses.
 */
export function buildRandomFleetFlightPlan(rect: DOMRect): FleetFlightPlan {
  const size = Math.max(rect.width, rect.height, 96);
  const originLeft = rect.left + rect.width / 2;
  const originTop = rect.top + rect.height / 2;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  const departureHeading = Math.random() * 360;
  let heading = departureHeading;
  let visualRotate = shortestTurn(0, departureHeading);

  const samples: FlightSample[] = [
    { x: 0, y: 0, rotate: 0 },
    // On the pad: swing the nose to the departure heading before rolling.
    { x: 0, y: 0, rotate: visualRotate },
  ];

  const turnSign = Math.random() < 0.5 ? 1 : -1;
  const cruiseTurnRate = (7 + Math.random() * 8) * turnSign;
  const exitAim = (departureHeading + turnSign * (50 + Math.random() * 65) + 360) % 360;

  let x = 0;
  let y = 0;

  const advance = (distance: number) => {
    const delta = headingToDelta(heading, distance);
    x += delta.x;
    y += delta.y;
    samples.push({ x, y, rotate: visualRotate });
  };

  const bankToward = (targetHeading: number, maxStepTurn: number) => {
    const remaining = normalizeDelta(targetHeading - heading);
    const turnThisBeat = Math.max(-maxStepTurn, Math.min(maxStepTurn, remaining));
    heading = (heading + turnThisBeat + 360) % 360;
    visualRotate = shortestTurn(visualRotate, heading);
  };

  // Climb-out straight ahead — takeoff must read forward.
  for (let i = 0; i < 3; i += 1) {
    advance(46 + Math.random() * 16);
  }

  // Cruise: fly forward, then ease the nose a few degrees for the next beat.
  for (let i = 0; i < 10; i += 1) {
    const progress = i / 9;
    advance(52 + Math.random() * 24 + progress * 20);
    const turnThisBeat = cruiseTurnRate * (0.7 + 0.45 * Math.sin(progress * Math.PI));
    heading = (heading + turnThisBeat + 360) % 360;
    visualRotate = shortestTurn(visualRotate, heading);
  }

  // Exit: keep forward flight while easing onto exit heading, then leave the page.
  for (let i = 0; i < 6; i += 1) {
    const progress = (i + 1) / 6;
    advance(i < 5 ? 75 + progress * 95 : Math.hypot(vw, vh) * (0.6 + Math.random() * 0.25));
    bankToward(exitAim, 12);
  }

  const sortieCount = samples.length;
  const centerX = vw / 2 - originLeft;
  const centerY = vh / 2 - originTop;
  /** Fill the longest viewport axis so the craft blanks the whole page. */
  const coverScale = Math.max(vw, vh) / size * 1.35;
  const passSpan = Math.hypot(vw, vh) * 0.95;
  // Final pass heading — come back through the page after the sortie exits.
  const passHeading = (exitAim + 180 + (Math.random() * 36 - 18) + 360) % 360;
  const passRotate = shortestTurn(visualRotate, passHeading);
  const entryOffset = headingToDelta(passHeading + 180, passSpan);
  const exitOffset = headingToDelta(passHeading, passSpan);
  const entryX = centerX + entryOffset.x;
  const entryY = centerY + entryOffset.y;
  const exitX = centerX + exitOffset.x;
  const exitY = centerY + exitOffset.y;

  // Off-page hold (invisible), then teleport to entry while still invisible.
  samples.push(
    { x, y, rotate: visualRotate },
    { x: entryX, y: entryY, rotate: passRotate },
    // Appear huge off-screen, then one final full-page pass through center.
    { x: entryX, y: entryY, rotate: passRotate },
    { x: centerX, y: centerY, rotate: passRotate },
    { x: exitX, y: exitY, rotate: passRotate },
    { x: exitX + exitOffset.x * 0.2, y: exitY + exitOffset.y * 0.2, rotate: passRotate },
  );

  const n = samples.length;
  const sortieEnd = 0.68;
  const times = samples.map((_, i) => {
    if (i === 0) return 0;
    if (i === 1) return 0.1;
    if (i < sortieCount) {
      const forwardIndex = i - 2;
      const forwardCount = Math.max(1, sortieCount - 2);
      return 0.1 + (sortieEnd - 0.1) * ((forwardIndex + 1) / forwardCount);
    }
    // Final pass beats after the craft has left the page.
    const passIndex = i - sortieCount;
    const passTimes = [0.7, 0.74, 0.78, 0.9, 0.97, 1];
    return passTimes[passIndex] ?? 1;
  });

  return {
    size,
    originLeft,
    originTop,
    rotate: samples.map((s) => s.rotate),
    x: samples.map((s) => s.x),
    y: samples.map((s) => s.y),
    scale: samples.map((_, i) => {
      if (i === 0) return 1;
      if (i === 1) return 1.1;
      if (i < sortieCount) {
        // Keep growing through the sortie — larger = climbing toward the camera.
        const t = (i - 1) / Math.max(1, sortieCount - 2);
        const eased = t * t * (3 - 2 * t); // smoothstep
        return 1.1 + eased * 2.15; // ~1.1 → ~3.25 by exit
      }
      // Invisible grow / teleport, then stay page-covering for the final pass.
      return coverScale;
    }),
    opacity: samples.map((_, i) => {
      if (i < sortieCount - 2) return 1;
      if (i === sortieCount - 2) return 0.85;
      if (i === sortieCount - 1) return 0; // left the page
      if (i === sortieCount) return 0; // hold off-page
      if (i === sortieCount + 1) return 0; // teleport to entry (invisible)
      if (i === n - 1) return 0; // fade as it clears after the mega pass
      return 1; // full-page pass visible
    }),
    times,
    duration: 4.6 + Math.random() * 0.45,
  };
}
