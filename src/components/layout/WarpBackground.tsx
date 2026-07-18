import { useEffect, useRef } from "react";

const NUM_STARS_DESKTOP = 1400;
const NUM_STARS_MOBILE = 560;
const NUM_STARS_REDUCED = 280;
const BASE_STAR_SPEED = 0.38;
const REDUCED_STAR_SPEED = 0.18;
const SCROLL_BOOST_DECAY = 0.88;
const SCROLL_BOOST_GAIN = 0.06;
const SCROLL_BOOST_MIN = -6;
const SCROLL_BOOST_MAX = 18;

function prefersLightweightWarp(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
}

/** Width must change by this many px before we rebuild the starfield (rotation / breakpoint). */
const WIDTH_REBUILD_DELTA_PX = 48;

type StarTone = "white" | "cyan" | "gold" | "red" | "pink" | "purple" | "violet" | "magenta";

const TONE_RGB: Record<StarTone, [number, number, number]> = {
  white: [255, 255, 255],
  cyan: [56, 232, 255],
  gold: [251, 191, 36],
  red: [255, 72, 96],
  pink: [255, 140, 196],
  purple: [168, 85, 247],
  violet: [196, 160, 255],
  magenta: [236, 72, 153],
};

/** Weighted mix — white still anchors the tunnel; color stars read clearly in motion. */
function pickTone(): StarTone {
  const r = Math.random();
  if (r < 0.34) return "white";
  if (r < 0.48) return "cyan";
  if (r < 0.58) return "gold";
  if (r < 0.68) return "purple";
  if (r < 0.78) return "pink";
  if (r < 0.86) return "magenta";
  if (r < 0.93) return "violet";
  return "red";
}

class Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  tone: StarTone;

  constructor() {
    this.x = (Math.random() - 0.5) * 2000;
    this.y = (Math.random() - 0.5) * 2000;
    this.z = Math.random() * 2000;
    this.prevZ = this.z;
    this.tone = pickTone();
  }

  update(speed: number) {
    this.prevZ = this.z;
    this.z -= speed * 120;
    if (this.z <= 0) {
      this.x = (Math.random() - 0.5) * 2000;
      this.y = (Math.random() - 0.5) * 2000;
      this.z = 2000;
      this.prevZ = this.z;
      this.tone = pickTone();
    } else if (this.z > 2000) {
      this.x = (Math.random() - 0.5) * 2000;
      this.y = (Math.random() - 0.5) * 2000;
      this.z = 0.1;
      this.prevZ = this.z;
      this.tone = pickTone();
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.max(width, height) * 0.55;
    const x = cx + (this.x / this.z) * scale;
    const y = cy + (this.y / this.z) * scale;
    const px = cx + (this.x / this.prevZ) * scale;
    const py = cy + (this.y / this.prevZ) * scale;
    const depth = 1 - this.z / 2000;
    const [r, g, b] = TONE_RGB[this.tone];
    // Color stars get a touch more alpha so pink/purple/red read against the void.
    const colorBoost = this.tone === "white" || this.tone === "cyan" ? 0 : 0.1;
    const alpha = Math.min(1, depth * 1.05 + 0.28 + colorBoost);

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.lineWidth = 4.2 * depth + 0.55;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Near-field spark — tiny star head so color pops at the tip of the streak.
    if (depth > 0.55) {
      const spark = Math.min(1, (depth - 0.55) * 2.2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${spark * 0.95})`;
      ctx.beginPath();
      ctx.arc(x, y, 0.9 + depth * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function readViewportSize() {
  const vv = window.visualViewport;
  return {
    width: Math.round(window.innerWidth),
    height: Math.round(Math.max(window.innerHeight, vv?.height ?? 0)),
  };
}

/**
 * Canvas starfield warp — hyperspace tunnel (AA-VFX style).
 * Idle motion always on; scroll down punches warp forward, scroll up reverses.
 */
export default function WarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutWidthRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrameId = 0;
    let stars: Star[] = [];
    let resizeTimer: number | null = null;
    let scrollBoost = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTs = performance.now();

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
      const count = motionMq.matches
        ? NUM_STARS_REDUCED
        : prefersLightweightWarp()
          ? NUM_STARS_MOBILE
          : NUM_STARS_DESKTOP;
      stars = Array.from({ length: count }, () => new Star());
    };

    const paintVoid = (w: number, h: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.max(w, h) * 0.85;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.14)");
      gradient.addColorStop(0.04, "rgba(186, 230, 253, 0.08)");
      gradient.addColorStop(0.1, "rgba(196, 160, 255, 0.06)");
      gradient.addColorStop(0.18, "#0c1028");
      gradient.addColorStop(0.42, "#080414");
      gradient.addColorStop(0.72, "#040610");
      gradient.addColorStop(1, "#010208");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    };

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(8, Math.min(48, now - lastScrollTs));
      lastScrollTs = now;
      const y = window.scrollY;
      const dy = y - lastScrollY;
      lastScrollY = y;
      // Normalize by frame time so trackpads and mice feel similar.
      scrollBoost = Math.max(
        SCROLL_BOOST_MIN,
        Math.min(SCROLL_BOOST_MAX, scrollBoost + (dy / dt) * SCROLL_BOOST_GAIN * 16),
      );
    };

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      scrollBoost *= SCROLL_BOOST_DECAY;
      if (Math.abs(scrollBoost) < 0.02) {
        scrollBoost = 0;
      }

      // Baseline cruise + scroll punch (down = faster toward camera, up = reverse).
      const cruise = motionMq.matches ? REDUCED_STAR_SPEED : BASE_STAR_SPEED;
      const speed = cruise * (1.2 + scrollBoost * 0.28);

      const { width: w, height: h } = readViewportSize();
      // Slightly stronger trail fade keeps streaks crisp while the void stays deep.
      ctx.fillStyle = "rgba(1, 4, 12, 0.22)";
      ctx.fillRect(0, 0, w, h);
      for (const star of stars) {
        star.update(speed);
        star.draw(ctx, w, h);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const startWarp = () => {
      cancelAnimationFrame(animationFrameId);
      const { width, height } = resizeCanvas();
      layoutWidthRef.current = width;
      // Always animate — reduced-motion still gets a gentler cruise so the tunnel reads.
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleLayoutChange);
    window.visualViewport?.addEventListener("resize", scheduleLayoutChange);

    const onMotionChange = () => {
      startWarp();
    };
    motionMq.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleLayoutChange);
      window.visualViewport?.removeEventListener("resize", scheduleLayoutChange);
      motionMq.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="warp-bg-canvas" aria-hidden />;
}
