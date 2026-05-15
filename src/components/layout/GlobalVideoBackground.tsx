import { useEffect, useRef, useState } from "react";
import { useSilentHangarOptional } from "../../context/SilentHangarContext";

/** AA-VFX warp tunnel — https://youtu.be/UQgBVsbbKRs */
const YOUTUBE_ID = "UQgBVsbbKRs";

const CLIP_START_SEC = 6;
const CLIP_DURATION_SEC = 22;

const LOCAL_VIDEO = "/video/usjet-warp-tunnel.mp4";

const YOUTUBE_EMBED = [
  `https://www.youtube.com/embed/${YOUTUBE_ID}`,
  "?autoplay=1",
  "&mute=1",
  "&controls=0",
  "&rel=0",
  "&loop=1",
  `&playlist=${YOUTUBE_ID}`,
  "&playsinline=1",
  "&modestbranding=1",
  "&iv_load_policy=3",
  "&disablekb=1",
  "&start=6",
  "&enablejsapi=0",
].join("");

type VideoMode = "checking" | "local" | "youtube" | "canvas";

function prefersLightweightAtmosphere(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
}

function WarpStreakLayers() {
  return (
    <>
      <div className="global-video-bg__center-burst" />
      <div className="global-video-bg__warp-streaks global-video-bg__warp-streaks--deep" />
      <div className="global-video-bg__warp-streaks global-video-bg__warp-streaks--fast" />
    </>
  );
}

export default function GlobalVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<VideoMode>("checking");
  const { audioArmed } = useSilentHangarOptional();

  useEffect(() => {
    if (prefersLightweightAtmosphere()) {
      setMode("canvas");
      return;
    }

    let cancelled = false;

    fetch(LOCAL_VIDEO, { method: "HEAD" })
      .then((response) => {
        if (!cancelled) {
          setMode(response.ok ? "local" : "youtube");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMode("youtube");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== "local") return;

    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setMode("canvas");
      return;
    }

    const onLoaded = () => {
      video.currentTime = CLIP_START_SEC;
      void video.play().catch(() => setMode("canvas"));
    };

    const onError = () => setMode("canvas");

    const onTimeUpdate = () => {
      if (video.currentTime >= CLIP_START_SEC + CLIP_DURATION_SEC) {
        video.currentTime = CLIP_START_SEC;
      }
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("error", onError);
    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("error", onError);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [mode]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== "local") {
      return;
    }
    video.muted = !audioArmed;
    if (audioArmed) {
      video.volume = 0.35;
    }
  }, [audioArmed, mode]);

  if (mode === "checking") {
    return (
      <div className="global-video-bg global-video-bg--arming" aria-hidden>
        <WarpStreakLayers />
      </div>
    );
  }

  if (mode === "canvas") {
    return (
      <div className="global-video-bg global-video-bg--warp-only" aria-hidden>
        <WarpStreakLayers />
      </div>
    );
  }

  return (
    <div className="global-video-bg" aria-hidden>
      {mode === "local" ? (
        <video
          ref={videoRef}
          className="global-video-bg__media"
          src={LOCAL_VIDEO}
          autoPlay
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
        />
      ) : (
        <iframe
          className="global-video-bg__yt"
          src={YOUTUBE_EMBED}
          title="USJET warp-speed atmosphere"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
        />
      )}
      <WarpStreakLayers />
    </div>
  );
}
