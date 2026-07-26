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

function viewportSize(): { vw: number; vh: number } {
  if (typeof window === "undefined") {
    return { vw: 1280, vh: 800 };
  }
  const vv = window.visualViewport;
  return {
    vw: vv?.width || window.innerWidth || 1280,
    vh: vv?.height || window.innerHeight || 800,
  };
}

function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse), (max-width: 1023px)").matches;
}

type FlightSample = {
  x: number;
  y: number;
  /** Continuous CSS rotate; nose always matches forward travel. */
  rotate: number;
};

function appendMegaPass(
  samples: FlightSample[],
  opts: {
    size: number;
    originLeft: number;
    originTop: number;
    vw: number;
    vh: number;
    exitAim: number;
    visualRotate: number;
  },
): number {
  const { size, originLeft, originTop, vw, vh, exitAim, visualRotate } = opts;
  const centerX = vw / 2 - originLeft;
  const centerY = vh / 2 - originTop;
  const coverScale = Math.max(5.5, (Math.max(vw, vh) / Math.max(size, 1)) * 1.55);
  const passSpan = Math.hypot(vw, vh) * 1.05;
  const passHeading = (exitAim + 180 + (Math.random() * 36 - 18) + 360) % 360;
  const passRotate = shortestTurn(visualRotate, passHeading);
  const entryOffset = headingToDelta(passHeading + 180, passSpan);
  const exitOffset = headingToDelta(passHeading, passSpan);
  const entryX = centerX + entryOffset.x;
  const entryY = centerY + entryOffset.y;
  const exitX = centerX + exitOffset.x;
  const exitY = centerY + exitOffset.y;
  const last = samples[samples.length - 1] ?? { x: 0, y: 0, rotate: visualRotate };

  samples.push(
    { x: last.x, y: last.y, rotate: last.rotate },
    { x: entryX, y: entryY, rotate: passRotate },
    { x: entryX, y: entryY, rotate: passRotate },
    { x: centerX, y: centerY, rotate: passRotate },
    { x: exitX, y: exitY, rotate: passRotate },
    { x: exitX + exitOffset.x * 0.25, y: exitY + exitOffset.y * 0.25, rotate: passRotate },
  );

  return coverScale;
}

/**
 * Short phone / reduced-motion plan — still shows the big logo pass, skips the long cruise.
 */
export function buildFleetMegaPassOnlyPlan(rect: DOMRect): FleetFlightPlan {
  const size = Math.max(rect.width, rect.height, 72);
  const originLeft = rect.left + rect.width / 2;
  const originTop = rect.top + rect.height / 2;
  const { vw, vh } = viewportSize();
  const passHeading = Math.random() * 360;
  const passRotate = shortestTurn(0, passHeading);
  const centerX = vw / 2 - originLeft;
  const centerY = vh / 2 - originTop;
  const coverScale = Math.max(5.5, (Math.max(vw, vh) / Math.max(size, 1)) * 1.6);
  const passSpan = Math.hypot(vw, vh) * 1.05;
  const entryOffset = headingToDelta(passHeading + 180, passSpan);
  const exitOffset = headingToDelta(passHeading, passSpan);

  const samples: FlightSample[] = [
    { x: 0, y: 0, rotate: 0 },
    { x: 0, y: 0, rotate: passRotate },
    { x: centerX + entryOffset.x, y: centerY + entryOffset.y, rotate: passRotate },
    { x: centerX, y: centerY, rotate: passRotate },
    { x: centerX + exitOffset.x, y: centerY + exitOffset.y, rotate: passRotate },
    {
      x: centerX + exitOffset.x * 1.15,
      y: centerY + exitOffset.y * 1.15,
      rotate: passRotate,
    },
  ];

  return {
    size,
    originLeft,
    originTop,
    rotate: samples.map((s) => s.rotate),
    x: samples.map((s) => s.x),
    y: samples.map((s) => s.y),
    scale: [1, 1.15, coverScale, coverScale, coverScale, coverScale * 0.92],
    opacity: [1, 1, 1, 1, 1, 0],
    times: [0, 0.12, 0.28, 0.55, 0.85, 1],
    duration: 1.55,
  };
}

/**
 * Sample a forward-only curved sortie, then a full-viewport mega-pass.
 * On coarse pointers (phones), cruise is shorter so the big pass reads clearly.
 */
export function buildRandomFleetFlightPlan(rect: DOMRect): FleetFlightPlan {
  const size = Math.max(rect.width, rect.height, 72);
  const originLeft = rect.left + rect.width / 2;
  const originTop = rect.top + rect.height / 2;
  const { vw, vh } = viewportSize();
  const phone = isCoarsePointer();

  const departureHeading = Math.random() * 360;
  let heading = departureHeading;
  let visualRotate = shortestTurn(0, departureHeading);

  const samples: FlightSample[] = [
    { x: 0, y: 0, rotate: 0 },
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

  const climbBeats = phone ? 2 : 3;
  const cruiseBeats = phone ? 5 : 10;
  const exitBeats = phone ? 4 : 6;

  for (let i = 0; i < climbBeats; i += 1) {
    advance((phone ? 36 : 46) + Math.random() * 16);
  }

  for (let i = 0; i < cruiseBeats; i += 1) {
    const progress = i / Math.max(1, cruiseBeats - 1);
    advance((phone ? 44 : 52) + Math.random() * 24 + progress * 20);
    const turnThisBeat = cruiseTurnRate * (0.7 + 0.45 * Math.sin(progress * Math.PI));
    heading = (heading + turnThisBeat + 360) % 360;
    visualRotate = shortestTurn(visualRotate, heading);
  }

  for (let i = 0; i < exitBeats; i += 1) {
    const progress = (i + 1) / exitBeats;
    advance(i < exitBeats - 1 ? 75 + progress * 95 : Math.hypot(vw, vh) * (0.55 + Math.random() * 0.2));
    bankToward(exitAim, 12);
  }

  const sortieCount = samples.length;
  const coverScale = appendMegaPass(samples, {
    size,
    originLeft,
    originTop,
    vw,
    vh,
    exitAim,
    visualRotate,
  });

  const n = samples.length;
  // Phone: give the mega-pass most of the timeline so it cannot be missed.
  const sortieEnd = phone ? 0.42 : 0.52;
  const times = samples.map((_, i) => {
    if (i === 0) return 0;
    if (i === 1) return phone ? 0.06 : 0.08;
    if (i < sortieCount) {
      const forwardIndex = i - 2;
      const forwardCount = Math.max(1, sortieCount - 2);
      return 0.08 + (sortieEnd - 0.08) * ((forwardIndex + 1) / forwardCount);
    }
    const passIndex = i - sortieCount;
    const passTimes = phone
      ? [0.45, 0.5, 0.56, 0.72, 0.9, 1]
      : [0.55, 0.6, 0.66, 0.82, 0.94, 1];
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
      if (i === 1) return 1.15;
      if (i < sortieCount) {
        const t = (i - 1) / Math.max(1, sortieCount - 2);
        const eased = t * t * (3 - 2 * t);
        return 1.15 + eased * (phone ? 2.8 : 2.15);
      }
      return coverScale;
    }),
    opacity: samples.map((_, i) => {
      if (i < sortieCount - 2) return 1;
      if (i === sortieCount - 2) return 0.85;
      if (i === sortieCount - 1) return 0;
      if (i === sortieCount) return 0;
      if (i === sortieCount + 1) return 0;
      if (i === n - 1) return 0;
      return 1;
    }),
    times,
    duration: phone ? 3.4 + Math.random() * 0.25 : 4.4 + Math.random() * 0.4,
  };
}

/** Pick the right plan for the device / motion preference. Never a no-op. */
export function buildFleetLaunchFlightPlan(rect: DOMRect): FleetFlightPlan {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return buildFleetMegaPassOnlyPlan(rect);
  }
  return buildRandomFleetFlightPlan(rect);
}
