import { useEffect, useRef } from "react";
import { Circle } from "lucide-react";
import type { FleetUnit } from "../../types/fleet";
import { getFleetDisplayAircraftType } from "../../data/fleetRoster";
import {
  HIRED_HUD_BALL_DRIBBLE_MS,
  HIRED_HUD_BALL_PASS_PEAK_MS,
  HIRED_HUD_COURT_COPY,
  HIRED_HUD_COURT_KICKER,
  HIRED_HUD_COURT_LENGTH_M,
  HIRED_HUD_COURT_TITLE,
  HIRED_HUD_COURT_WIDTH_M,
  HIRED_HUD_PLAYER_JOG_MS,
  HIRED_HUD_PLAYER_RUN_MS,
  HIRED_HUD_PLAYER_SPRINT_MS,
  HIRED_HUD_PLAYER_WALK_MS,
} from "../../data/hiredHudCourtBounce";
import { getFleetAircraftRadarLogoPathForSlot } from "../../lib/fleetAircraftLogos";

type HiredHudCourtBounceProps = {
  units: FleetUnit[];
};

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  mass: number;
};

type PlayerPace = "walk" | "jog" | "run" | "sprint";

type JetBody = Body & {
  slot: number;
  angle: number;
  spin: number;
  wanderTimer: number;
  pace: PlayerPace;
  targetSpeed: number;
  heading: number;
};

const BALL_RADIUS = 9;
const JET_RADIUS = 15;
const COURT_PAD = 18;
const PLAYER_ACCEL = 14.5;
const BALL_COURT_DRAG = 0.992;
const BALL_MIN_SPEED_MS = 2.2;

const PACE_SPEED: Record<PlayerPace, number> = {
  walk: HIRED_HUD_PLAYER_WALK_MS,
  jog: HIRED_HUD_PLAYER_JOG_MS,
  run: HIRED_HUD_PLAYER_RUN_MS,
  sprint: HIRED_HUD_PLAYER_SPRINT_MS,
};

const PACE_WEIGHTS: Array<{ pace: PlayerPace; weight: number }> = [
  { pace: "walk", weight: 0.18 },
  { pace: "jog", weight: 0.48 },
  { pace: "run", weight: 0.26 },
  { pace: "sprint", weight: 0.08 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampSpeedMs(body: Body, maxSpeed: number): void {
  const speed = Math.hypot(body.vx, body.vy);
  if (speed > maxSpeed) {
    body.vx = (body.vx / speed) * maxSpeed;
    body.vy = (body.vy / speed) * maxSpeed;
  }
}

function accelerateToward(body: Body, targetVx: number, targetVy: number, accel: number, dt: number): void {
  const dvx = targetVx - body.vx;
  const dvy = targetVy - body.vy;
  const delta = Math.hypot(dvx, dvy);
  if (delta < 0.01) return;
  const step = Math.min(delta, accel * dt);
  body.vx += (dvx / delta) * step;
  body.vy += (dvy / delta) * step;
}

function resolveWall(body: Body, width: number, height: number, restitution = 0.88): void {
  if (body.x - body.r < COURT_PAD) {
    body.x = COURT_PAD + body.r;
    body.vx = Math.abs(body.vx) * restitution;
  }
  if (body.x + body.r > width - COURT_PAD) {
    body.x = width - COURT_PAD - body.r;
    body.vx = -Math.abs(body.vx) * restitution;
  }
  if (body.y - body.r < COURT_PAD) {
    body.y = COURT_PAD + body.r;
    body.vy = Math.abs(body.vy) * restitution;
  }
  if (body.y + body.r > height - COURT_PAD) {
    body.y = height - COURT_PAD - body.r;
    body.vy = -Math.abs(body.vy) * restitution;
  }
}

function resolveCollision(a: Body, b: Body, restitution = 0.9): void {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 0.001;
  const minDist = a.r + b.r;
  if (dist >= minDist) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = minDist - dist;
  const totalMass = a.mass + b.mass;

  a.x -= (nx * overlap * b.mass) / totalMass;
  a.y -= (ny * overlap * b.mass) / totalMass;
  b.x += (nx * overlap * a.mass) / totalMass;
  b.y += (ny * overlap * a.mass) / totalMass;

  const relVx = a.vx - b.vx;
  const relVy = a.vy - b.vy;
  const relNormal = relVx * nx + relVy * ny;
  if (relNormal <= 0) return;

  const impulse = (-(1 + restitution) * relNormal) / totalMass;
  a.vx += impulse * b.mass * nx;
  a.vy += impulse * b.mass * ny;
  b.vx -= impulse * a.mass * nx;
  b.vy -= impulse * a.mass * ny;
}

function courtScale(width: number, height: number): number {
  const innerW = width - COURT_PAD * 2;
  const innerH = height - COURT_PAD * 2;
  return Math.min(innerW / HIRED_HUD_COURT_LENGTH_M, innerH / HIRED_HUD_COURT_WIDTH_M);
}

function drawCourt(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const pad = COURT_PAD;
  const courtW = width - pad * 2;
  const courtH = height - pad * 2;
  const cx = width / 2;
  const cy = height / 2;

  ctx.fillStyle = "#8b5e34";
  ctx.fillRect(pad, pad, courtW, courtH);

  ctx.fillStyle = "#b7793f";
  ctx.fillRect(pad + 8, pad + 8, courtW - 16, courtH - 16);

  ctx.strokeStyle = "rgb(255 255 255 / 0.82)";
  ctx.lineWidth = 2;
  ctx.strokeRect(pad + 8, pad + 8, courtW - 16, courtH - 16);

  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(courtW, courtH) * 0.11, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, pad + 8);
  ctx.lineTo(cx, pad + courtH - 8);
  ctx.stroke();

  const keyW = courtW * 0.17;
  const keyH = courtH * 0.34;
  ctx.strokeRect(pad + 8, cy - keyH / 2, keyW, keyH);
  ctx.strokeRect(pad + courtW - 8 - keyW, cy - keyH / 2, keyW, keyH);

  ctx.beginPath();
  ctx.arc(pad + 8 + keyW, cy, keyH * 0.42, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(pad + courtW - 8 - keyW, cy, keyH * 0.42, Math.PI / 2, (Math.PI * 3) / 2);
  ctx.stroke();

  const arcR = courtW * 0.34;
  ctx.beginPath();
  ctx.arc(pad + 8 + keyW, cy, arcR, -Math.PI / 3, Math.PI / 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(pad + courtW - 8 - keyW, cy, arcR, (Math.PI * 2) / 3, (Math.PI * 4) / 3);
  ctx.stroke();
}

function drawBasketball(ctx: CanvasRenderingContext2D, ball: Body, spin: number): void {
  ctx.save();
  ctx.translate(ball.x, ball.y);
  ctx.rotate(spin);

  const gradient = ctx.createRadialGradient(-2, -2, 1, 0, 0, ball.r);
  gradient.addColorStop(0, "#ffb07a");
  gradient.addColorStop(1, "#d35400");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, ball.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgb(20 12 8 / 0.75)";
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.arc(0, 0, ball.r - 1.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-ball.r + 1, 0);
  ctx.lineTo(ball.r - 1, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, 0, ball.r * 0.42, ball.r, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawJet(
  ctx: CanvasRenderingContext2D,
  jet: JetBody,
  image: HTMLImageElement | undefined,
): void {
  ctx.save();
  ctx.translate(jet.x, jet.y);
  ctx.rotate(jet.angle);

  ctx.fillStyle = "rgb(2 12 24 / 0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 2, jet.r + 2, jet.r * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();

  if (image?.complete) {
    const size = jet.r * 2.2;
    ctx.drawImage(image, -size / 2, -size / 2, size, size);
  } else {
    ctx.fillStyle = "rgb(56 189 248 / 0.85)";
    ctx.beginPath();
    ctx.moveTo(jet.r, 0);
    ctx.lineTo(-jet.r * 0.7, jet.r * 0.55);
    ctx.lineTo(-jet.r * 0.45, 0);
    ctx.lineTo(-jet.r * 0.7, -jet.r * 0.55);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = "rgb(34 211 238 / 0.55)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, jet.r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pickPace(rng: () => number): PlayerPace {
  const roll = rng();
  let cursor = 0;
  for (const entry of PACE_WEIGHTS) {
    cursor += entry.weight;
    if (roll <= cursor) {
      return entry.pace;
    }
  }
  return "jog";
}

function assignJetIntent(jet: JetBody, rng: () => number): void {
  jet.pace = pickPace(rng);
  jet.targetSpeed = PACE_SPEED[jet.pace] * (0.9 + rng() * 0.18);
  jet.heading += (rng() - 0.5) * 1.35;
  jet.wanderTimer = 0.35 + rng() * 0.95;
}

function initSimulation(
  units: FleetUnit[],
  width: number,
  height: number,
): { ball: Body; jets: JetBody[]; ballSpin: number } {
  const rng = createSeededRandom(90210);
  const innerW = width - COURT_PAD * 2;
  const innerH = height - COURT_PAD * 2;

  const jets: JetBody[] = units.map((unit, index) => {
    const heading = rng() * Math.PI * 2;
    const pace = pickPace(rng);
    const speed = PACE_SPEED[pace] * (0.92 + rng() * 0.12);
    return {
      slot: unit.slot,
      x: COURT_PAD + innerW * (0.12 + rng() * 0.76),
      y: COURT_PAD + innerH * (0.12 + rng() * 0.76),
      vx: Math.cos(heading) * speed,
      vy: Math.sin(heading) * speed,
      r: JET_RADIUS,
      mass: 4.2,
      angle: heading,
      spin: (rng() - 0.5) * 0.04,
      wanderTimer: 0.25 + index * 0.05,
      pace,
      targetSpeed: speed,
      heading,
    };
  });

  const ballHeading = rng() * Math.PI * 2;
  const ballSpeed = HIRED_HUD_BALL_DRIBBLE_MS * (0.85 + rng() * 0.35);
  const ball: Body = {
    x: width / 2,
    y: height / 2,
    vx: Math.cos(ballHeading) * ballSpeed,
    vy: Math.sin(ballHeading) * ballSpeed,
    r: BALL_RADIUS,
    mass: 1,
  };

  return { ball, jets, ballSpin: 0 };
}

export default function HiredHudCourtBounce({ units }: HiredHudCourtBounceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<ReturnType<typeof initSimulation> | null>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const rngRef = useRef(createSeededRandom(314159));

  useEffect(() => {
    const nextImages = new Map<number, HTMLImageElement>();
    for (const unit of units) {
      const aircraftType = getFleetDisplayAircraftType(unit.slot, unit.aircraftType);
      const src = getFleetAircraftRadarLogoPathForSlot(unit.slot, aircraftType);
      const image = new Image();
      image.src = src;
      nextImages.set(unit.slot, image);
    }
    imagesRef.current = nextImages;
  }, [units]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || units.length === 0) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frameId = 0;
    let width = 0;
    let height = 0;
    let pxPerMeter = 18;
    let lastFrame = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(320, Math.floor(rect.width));
      height = Math.max(220, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pxPerMeter = courtScale(width, height);
      stateRef.current = initSimulation(units, width, height);
      lastFrame = performance.now();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const step = (dt: number) => {
      const sim = stateRef.current;
      if (!sim) return;

      const motionScale = reducedMotion ? 0.45 : 1;
      const stepDt = dt * motionScale;
      const { ball, jets } = sim;
      const rng = rngRef.current;

      ball.vx *= BALL_COURT_DRAG;
      ball.vy *= BALL_COURT_DRAG;

      for (const jet of jets) {
        jet.wanderTimer -= stepDt;
        if (jet.wanderTimer <= 0) {
          assignJetIntent(jet, rng);
        }

        const targetVx = Math.cos(jet.heading) * jet.targetSpeed;
        const targetVy = Math.sin(jet.heading) * jet.targetSpeed;
        accelerateToward(jet, targetVx, targetVy, PLAYER_ACCEL, stepDt);
        clampSpeedMs(jet, PACE_SPEED.sprint * 1.08);

        jet.x += jet.vx * pxPerMeter * stepDt;
        jet.y += jet.vy * pxPerMeter * stepDt;
        jet.angle += jet.spin + jet.vx * 0.05;
        resolveWall(jet, width, height, 0.84);
      }

      for (let i = 0; i < jets.length; i += 1) {
        for (let j = i + 1; j < jets.length; j += 1) {
          resolveCollision(jets[i], jets[j], 0.78);
        }
      }

      for (const jet of jets) {
        resolveCollision(ball, jet, 0.93);
      }

      ball.x += ball.vx * pxPerMeter * stepDt;
      ball.y += ball.vy * pxPerMeter * stepDt;
      resolveWall(ball, width, height, 0.86);
      clampSpeedMs(ball, HIRED_HUD_BALL_PASS_PEAK_MS);

      const ballSpeed = Math.hypot(ball.vx, ball.vy);
      if (ballSpeed < BALL_MIN_SPEED_MS) {
        const kickHeading = rng() * Math.PI * 2;
        const kickSpeed = HIRED_HUD_BALL_DRIBBLE_MS * (0.9 + rng() * 0.45);
        ball.vx = Math.cos(kickHeading) * kickSpeed;
        ball.vy = Math.sin(kickHeading) * kickSpeed;
      }

      sim.ballSpin += ballSpeed * pxPerMeter * stepDt * 0.018;

      ctx.clearRect(0, 0, width, height);
      drawCourt(ctx, width, height);
      for (const jet of jets) {
        drawJet(ctx, jet, imagesRef.current.get(jet.slot));
      }
      drawBasketball(ctx, ball, sim.ballSpin);
    };

    const loop = (now: number) => {
      if (!document.hidden) {
        const dt = clamp((now - lastFrame) / 1000, 0.008, 0.028);
        lastFrame = now;
        step(dt);
      } else {
        lastFrame = now;
      }
      frameId = window.requestAnimationFrame(loop);
    };

    frameId = window.requestAnimationFrame(loop);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [units]);

  if (units.length === 0) {
    return null;
  }

  return (
    <section className="hired-hud__court-bounce" aria-label="Hangar pickup court simulation">
      <header className="hired-hud__court-bounce-head">
        <p className="hired-hud__court-bounce-kicker">{HIRED_HUD_COURT_KICKER}</p>
        <h2 className="hired-hud__court-bounce-title">
          <Circle size={14} aria-hidden />
          {HIRED_HUD_COURT_TITLE}
        </h2>
        <p className="hired-hud__court-bounce-copy">{HIRED_HUD_COURT_COPY}</p>
      </header>
      <div className="hired-hud__court-bounce-frame">
        <canvas ref={canvasRef} className="hired-hud__court-bounce-canvas" aria-hidden />
      </div>
    </section>
  );
}
