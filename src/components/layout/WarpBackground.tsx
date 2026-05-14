import { useEffect, useRef } from "react";

const NUM_STARS = 1100;
const STAR_SPEED = 0.22;

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

/** Canvas starfield warp — AA-VFX UQgBVsbbKRs hyperspace tunnel (radial streaks toward viewer). */
export default function WarpBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrameId = 0;
    let stars: Star[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.fillStyle = "rgba(1, 4, 12, 0.16)";
      ctx.fillRect(0, 0, w, h);
      for (const star of stars) {
        star.update();
        star.draw(ctx, w, h);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      cancelAnimationFrame(animationFrameId);
      resize();
      if (motionMq.matches) {
        paintVoid(window.innerWidth, window.innerHeight);
        return;
      }
      initStars();
      paintVoid(window.innerWidth, window.innerHeight);
      animate();
    };

    start();
    window.addEventListener("resize", start);
    motionMq.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", start);
      motionMq.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={canvasRef} className="warp-bg-canvas" aria-hidden />;
}
