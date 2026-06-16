import { useEffect, useRef } from "react";

const NUM_STARS = 1100;
const STAR_SPEED = 0.22;

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
    this.x = (Math.random() - 0.5) * 2000;
    this.y = (Math.random() - 0.5) * 2000;
    this.z = Math.random() * 2000;
    this.prevZ = this.z;
    this.tone = pickTone();
  }

  update() {
    this.prevZ = this.z;
    this.z -= STAR_SPEED * 120;
    if (this.z <= 0) {
      this.x = (Math.random() - 0.5) * 2000;
      this.y = (Math.random() - 0.5) * 2000;
      this.z = 2000;
      this.prevZ = this.z;
      this.tone = pickTone();
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const cx = width / 2;
    const cy = height / 2;
    const x = cx + (this.x / this.z) * 1000;
    const y = cy + (this.y / this.z) * 1000;
    const px = cx + (this.x / this.prevZ) * 1000;
    const py = cy + (this.y / this.prevZ) * 1000;
    const depth = 1 - this.z / 2000;
    const [r, g, b] = TONE_RGB[this.tone];
    const alpha = Math.min(1, depth * 0.96 + 0.22);

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.lineWidth = 3.4 * depth + 0.35;
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

/** Canvas starfield warp — AA-VFX UQgBVsbbKRs hyperspace tunnel (radial streaks toward viewer). */
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
      stars = Array.from({ length: NUM_STARS }, () => new Star());
    };

    const paintVoid = (w: number, h: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.max(w, h) * 0.85;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.14)");
      gradient.addColorStop(0.04, "rgba(186, 230, 253, 0.08)");
      gradient.addColorStop(0.12, "#0a1424");
      gradient.addColorStop(0.42, "#040810");
      gradient.addColorStop(1, "#010308");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      const { width: w, height: h } = readViewportSize();
      ctx.fillStyle = "rgba(1, 4, 12, 0.16)";
      ctx.fillRect(0, 0, w, h);
      for (const star of stars) {
        star.update();
        star.draw(ctx, w, h);
      }
      animationFrameId = requestAnimationFrame(animate);
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
      window.removeEventListener("resize", scheduleLayoutChange);
      window.visualViewport?.removeEventListener("resize", scheduleLayoutChange);
      motionMq.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="warp-bg-canvas" aria-hidden />;
}
