import { useEffect, useRef } from "react";

const NUM_STARS = 580;
const STAR_SPEED = 0.14;

class Star {
  x: number;
  y: number;
  z: number;
  prevZ: number;

  constructor() {
    this.x = (Math.random() - 0.5) * 2000;
    this.y = (Math.random() - 0.5) * 2000;
    this.z = Math.random() * 2000;
    this.prevZ = this.z;
  }

  update() {
    this.prevZ = this.z;
    this.z -= STAR_SPEED * 100;
    if (this.z <= 0) {
      this.z = 2000;
      this.prevZ = this.z;
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

    ctx.strokeStyle = `rgba(56, 232, 255, ${Math.min(1, depth * 0.92 + 0.12)})`;
    ctx.lineWidth = 2.6 * depth + 0.4;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

/** Canvas starfield warp — reliable site-wide atmosphere (YouTube/local video optional on top). */
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

    const paintStatic = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      gradient.addColorStop(0, "#0c1a32");
      gradient.addColorStop(0.55, "#050a14");
      gradient.addColorStop(1, "#020617");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.fillStyle = "rgba(2, 6, 23, 0.26)";
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
        paintStatic();
        return;
      }
      initStars();
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
