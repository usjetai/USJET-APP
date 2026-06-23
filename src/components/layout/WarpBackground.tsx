import { useEffect, useRef } from "react";

const NUM_STARS_DESKTOP = 1250;
const NUM_STARS_MOBILE = 520;
const FIELD_SIZE = 2400;
const FAR_Z = 2200;
const NEAR_Z = 12;
const BASE_DRIFT = 0.18;
const SCROLL_FORCE = 0.1;
const MAX_SCROLL_SPEED = 34;
const SCROLL_DECAY = 0.9;
const SPEED_EASE = 0.16;
const FOCAL_BASE = 760;

function prefersLightweightWarp(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
}

/** Width must change by this many px before we rebuild the starfield (rotation / breakpoint). */
const WIDTH_REBUILD_DELTA_PX = 48;

type StarTone = "white" | "cyan" | "gold";

const TONE_RGB: Record<StarTone, [number, number, number]> = {
  white: [255, 255, 255],
  cyan: [56, 232, 255],
  gold: [251, 191, 36],
};

function pickTone(): StarTone {
  const r = Math.random();
  if (r < 0.62) return "white";
  if (r < 0.88) return "cyan";
  return "gold";
}

class Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  tone: StarTone;

  constructor() {
    this.x = (Math.random() - 0.5) * FIELD_SIZE;
    this.y = (Math.random() - 0.5) * FIELD_SIZE;
    this.z = Math.random() * FAR_Z + NEAR_Z;
    this.prevZ = this.z;
    this.tone = pickTone();
  }

  resetFar() {
    this.x = (Math.random() - 0.5) * FIELD_SIZE;
    this.y = (Math.random() - 0.5) * FIELD_SIZE;
    this.z = FAR_Z;
    this.prevZ = this.z;
    this.tone = pickTone();
  }

  resetNear() {
    this.x = (Math.random() - 0.5) * FIELD_SIZE;
    this.y = (Math.random() - 0.5) * FIELD_SIZE;
    this.z = NEAR_Z + Math.random() * 80;
    this.prevZ = this.z;
    this.tone = pickTone();
  }

  update(speed: number) {
    this.prevZ = this.z;
    this.z += speed;

    if (this.z <= NEAR_Z) {
      this.resetFar();
    }

    if (this.z >= FAR_Z) {
      this.resetNear();
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, focalLength: number, thrust: number) {
    const cx = width / 2;
    const cy = height * 0.48;
    const x = cx + (this.x / this.z) * focalLength;
    const y = cy + (this.y / this.z) * focalLength;
    const px = cx + (this.x / this.prevZ) * focalLength;
    const py = cy + (this.y / this.prevZ) * focalLength;
    const depth = Math.max(0, Math.min(1, 1 - this.z / FAR_Z));
    const [r, g, b] = TONE_RGB[this.tone];
    const alpha = Math.min(1, depth * 0.9 + 0.16 + thrust * 0.16);

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.lineWidth = 2.2 * depth + 0.28 + thrust * 0.7;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function readViewportSize() {
  const vv = window.visualViewport;
  return {
    width: Math.round(window.innerWidth),
    height: Math.round(Math.max(window.innerHeight, vv?.height ?? 0)),
  };
}

/** Scroll-reactive galaxy warp — stars zoom out on downward scroll and surge forward on reverse scroll. */
export default function WarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutWidthRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    document.body.classList.add("usjet-scroll-warp-clean");

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      document.body.classList.remove("usjet-scroll-warp-clean");
      return;
    }

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrameId = 0;
    let stars: Star[] = [];
    let resizeTimer: number | null = null;
    let lastScrollY = window.scrollY;
    let targetSpeed = BASE_DRIFT;
    let speed = BASE_DRIFT;

    const resizeCanvas = () => {
      const { width, height } = readViewportSize();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width, height };
    };

    const initStars = () => {
      const count = prefersLightweightWarp() ? NUM_STARS_MOBILE : NUM_STARS_DESKTOP;
      stars = Array.from({ length: count }, () => new Star());
    };

    const paintVoid = (w: number, h: number) => {
      const cx = w / 2;
      const cy = h * 0.48;
      const radius = Math.max(w, h) * 0.85;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.08)");
      gradient.addColorStop(0.05, "rgba(56, 189, 248, 0.08)");
      gradient.addColorStop(0.18, "#081322");
      gradient.addColorStop(0.5, "#020814");
      gradient.addColorStop(1, "#00030a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const { width: w, height: h } = readViewportSize();
      speed += (targetSpeed - speed) * SPEED_EASE;
      targetSpeed = targetSpeed * SCROLL_DECAY + BASE_DRIFT * (1 - SCROLL_DECAY);

      const thrust = Math.min(1, Math.abs(speed) / MAX_SCROLL_SPEED);
      const focalLength = FOCAL_BASE + thrust * 260;

      ctx.fillStyle = `rgba(0, 3, 10, ${0.22 - thrust * 0.08})`;
      ctx.fillRect(0, 0, w, h);
      for (const star of stars) {
        star.update(speed);
        star.draw(ctx, w, h, focalLength, thrust);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;

      if (Math.abs(delta) < 0.1) return;

      // Down-scroll zooms out into deep space; reverse scroll brings stars forward.
      targetSpeed = Math.max(-MAX_SCROLL_SPEED, Math.min(MAX_SCROLL_SPEED, delta * SCROLL_FORCE));
    };

    const startWarp = () => {
      cancelAnimationFrame(animationFrameId);
      const { width, height } = resizeCanvas();
      layoutWidthRef.current = width;

      if (motionMq.matches) {
        paintVoid(width, height);
        return;
      }

      initStars();
      paintVoid(width, height);
      animate();
    };

    const handleLayoutChange = () => {
      const { width } = readViewportSize();
      const prevWidth = layoutWidthRef.current;
      const widthDelta = Math.abs(width - prevWidth);

      if (prevWidth === 0 || widthDelta >= WIDTH_REBUILD_DELTA_PX) {
        startWarp();
        return;
      }

      resizeCanvas();
    };

    const scheduleLayoutChange = () => {
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        handleLayoutChange();
      }, 180);
    };

    startWarp();

    window.addEventListener("resize", scheduleLayoutChange);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleLayoutChange);

    const onMotionChange = () => {
      startWarp();
    };
    motionMq.addEventListener("change", onMotionChange);

    return () => {
      document.body.classList.remove("usjet-scroll-warp-clean");
      cancelAnimationFrame(animationFrameId);
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      window.removeEventListener("resize", scheduleLayoutChange);
      window.removeEventListener("scroll", handleScroll);
      window.visualViewport?.removeEventListener("resize", scheduleLayoutChange);
      motionMq.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="warp-bg-canvas" aria-hidden />;
}
