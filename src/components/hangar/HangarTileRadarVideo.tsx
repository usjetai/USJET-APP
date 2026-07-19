import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Cache-bust so square re-encode replaces older wide loops in the browser. */
const VIDEO_SRC_WEBM = "/assets/hangar/tile-radar-bg-loop.webm?v=nojet6";
const VIDEO_SRC_MP4 = "/assets/hangar/tile-radar-bg-loop.mp4?v=nojet6";
const POSTER_SRC = "/assets/hangar/tile-radar-bg.png?v=nojet6";

type HangarTileRadarVideoProps = {
  /** Bay slot — seeds unique start time, hue, and telemetry. */
  slot?: number;
};

type Telemetry = {
  az: string;
  el: string;
  rng: string;
  snr: string;
};

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function readingOffsetSeconds(slot: number | undefined, duration: number, rand: () => number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  if (typeof slot === "number") {
    const phase = (slot * 0.618033988749895 + 0.17) % 1;
    return phase * duration;
  }
  return rand() * duration;
}

function playbackRateForSlot(slot: number | undefined): number {
  if (typeof slot !== "number") return 1;
  const rates = [0.82, 0.92, 1, 1.08, 1.18, 1.28];
  return rates[Math.abs(slot) % rates.length] ?? 1;
}

/** Distinct hue per bay so every HUD background reads a different color. */
function hudHueDegrees(slot: number | undefined): number {
  if (typeof slot !== "number") return 0;
  return Math.round((slot * 137.508) % 360);
}

function buildTelemetry(slot: number | undefined, tick: number): Telemetry {
  const seed = ((typeof slot === "number" ? slot + 1 : 7) * 9973 + tick * 131) >>> 0;
  const rand = mulberry32(seed);
  const az = (rand() * 360).toFixed(1);
  const el = ((rand() - 0.35) * 28).toFixed(1);
  const rng = (8 + rand() * 92).toFixed(1);
  const snr = (12 + rand() * 36).toFixed(0);
  return { az, el, rng, snr };
}

function prefersLeanMedia(): boolean {
  if (typeof window === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (connection?.saveData) return true;
  if (connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") return true;
  return window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
}

/** Muted looping radar HUD — loads media only when the bay is near the viewport. */
export default function HangarTileRadarVideo({ slot }: HangarTileRadarVideoProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seededRef = useRef(false);
  const [active, setActive] = useState(false);
  const [tick, setTick] = useState(0);
  const telemetry = buildTelemetry(slot, tick);
  const hue = hudHueDegrees(slot);
  const hudStyle = {
    "--hangar-hud-hue": `${hue}deg`,
  } as CSSProperties;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const lean = prefersLeanMedia();
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setActive(entry.isIntersecting);
      },
      {
        // Phone: load only near-viewport tiles. Desktop: a bit more lookahead.
        rootMargin: lean ? "120px 0px" : "240px 0px",
        threshold: 0.01,
      },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const telemetryMs = 480 + (typeof slot === "number" ? (slot % 5) * 70 : 0);
    const telemetryTimer = window.setInterval(() => {
      setTick((n) => (n + 1) % 10_000);
    }, telemetryMs);
    return () => window.clearInterval(telemetryTimer);
  }, [active, slot]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      video.pause();
      // Drop decoded frames / network so 30 hangar bays do not thrash mobile.
      video.removeAttribute("src");
      while (video.firstChild) {
        video.removeChild(video.firstChild);
      }
      video.load();
      seededRef.current = false;
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(((typeof slot === "number" ? slot : 3) + 1) * 2654435761);
    seededRef.current = false;

    const webm = document.createElement("source");
    webm.src = VIDEO_SRC_WEBM;
    webm.type = "video/webm";
    const mp4 = document.createElement("source");
    mp4.src = VIDEO_SRC_MP4;
    mp4.type = "video/mp4";
    video.appendChild(webm);
    video.appendChild(mp4);
    video.load();

    const seedReading = () => {
      if (seededRef.current) return;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      seededRef.current = true;
      try {
        video.currentTime = readingOffsetSeconds(slot, duration, rand);
      } catch {
        /* ignore seek abort while loading */
      }
      video.playbackRate = reduceMotion ? 0.75 : playbackRateForSlot(slot);
    };

    const ensurePlaying = () => {
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "true");
      seedReading();
      void video.play().catch(() => undefined);
    };

    video.addEventListener("loadedmetadata", ensurePlaying);
    video.addEventListener("loadeddata", ensurePlaying);
    video.addEventListener("canplay", ensurePlaying);
    ensurePlaying();

    const reshuffleMs = reduceMotion
      ? 12000 + (typeof slot === "number" ? (slot % 5) * 900 : 0)
      : 5200 + (typeof slot === "number" ? (slot % 7) * 700 : 0);
    const reshuffle = window.setInterval(() => {
      if (video.paused || !Number.isFinite(video.duration) || video.duration <= 0) return;
      try {
        video.currentTime = rand() * video.duration;
      } catch {
        /* ignore */
      }
    }, reshuffleMs);

    return () => {
      video.removeEventListener("loadedmetadata", ensurePlaying);
      video.removeEventListener("loadeddata", ensurePlaying);
      video.removeEventListener("canplay", ensurePlaying);
      window.clearInterval(reshuffle);
      video.pause();
    };
  }, [active, slot]);

  return (
    <span ref={wrapRef} className="fleet-card__radar-hud" style={hudStyle} aria-hidden="true">
      <video
        ref={videoRef}
        className="fleet-card__radar-hud-video"
        poster={POSTER_SRC}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
      />
      <span className="fleet-card__radar-hud-tint" />
      <span className="fleet-card__radar-hud-scrim" />
      <span className="fleet-card__radar-readings">
        <span className="fleet-card__radar-readings__row">
          <span>AZ {telemetry.az}</span>
          <span>EL {telemetry.el}</span>
        </span>
        <span className="fleet-card__radar-readings__row">
          <span>RNG {telemetry.rng}</span>
          <span>SNR {telemetry.snr}</span>
        </span>
      </span>
    </span>
  );
}
