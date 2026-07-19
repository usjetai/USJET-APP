import { useEffect, useRef } from "react";

const VIDEO_SRC = "/assets/hangar/tile-radar-bg-loop.mp4";
const POSTER_SRC = "/assets/hangar/tile-radar-bg.png";

type HangarTileRadarVideoProps = {
  /** Bay slot — used to pick a unique start time so tiles show different HUD readings. */
  slot?: number;
};

function readingOffsetSeconds(slot: number | undefined, duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  if (typeof slot === "number") {
    // Deterministic but uneven spread across the loop (golden-ratio hash).
    const phase = (slot * 0.618033988749895 + 0.17) % 1;
    return phase * duration;
  }
  return Math.random() * duration;
}

function playbackRateForSlot(slot: number | undefined): number {
  if (typeof slot !== "number") return 1;
  // Slight rate variety so gauges/sweeps drift apart over time.
  const rates = [0.85, 0.95, 1, 1.05, 1.15, 1.25];
  return rates[Math.abs(slot) % rates.length] ?? 1;
}

/** Muted looping radar HUD — each bay seeks to a different reading in the clip. */
export default function HangarTileRadarVideo({ slot }: HangarTileRadarVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      video.pause();
      return;
    }

    const seedReading = () => {
      if (seededRef.current) return;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      seededRef.current = true;
      try {
        video.currentTime = readingOffsetSeconds(slot, duration);
      } catch {
        /* ignore seek abort while loading */
      }
      video.playbackRate = playbackRateForSlot(slot);
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

    ensurePlaying();
    video.addEventListener("loadedmetadata", ensurePlaying);
    video.addEventListener("loadeddata", ensurePlaying);
    video.addEventListener("canplay", ensurePlaying);

    // Occasionally jump to another reading so tiles keep looking different.
    const reshuffleMs = 7000 + (typeof slot === "number" ? (slot % 5) * 1100 : 0);
    const reshuffle = window.setInterval(() => {
      if (video.paused || !Number.isFinite(video.duration) || video.duration <= 0) return;
      try {
        video.currentTime = Math.random() * video.duration;
      } catch {
        /* ignore */
      }
    }, reshuffleMs);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          ensurePlaying();
        } else {
          video.pause();
        }
      },
      { rootMargin: "80px", threshold: 0.05 },
    );
    io.observe(video);

    return () => {
      video.removeEventListener("loadedmetadata", ensurePlaying);
      video.removeEventListener("loadeddata", ensurePlaying);
      video.removeEventListener("canplay", ensurePlaying);
      window.clearInterval(reshuffle);
      io.disconnect();
    };
  }, [slot]);

  return (
    <span className="fleet-card__radar-hud" aria-hidden="true">
      <video
        ref={videoRef}
        className="fleet-card__radar-hud-video"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      />
    </span>
  );
}
