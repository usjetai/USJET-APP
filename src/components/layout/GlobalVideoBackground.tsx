import { useEffect, useRef, useState } from "react";

/** AA-VFX warp tunnel — https://youtu.be/UQgBVsbbKRs */
const YOUTUBE_ID = "UQgBVsbbKRs";

/** Seamless loop segment length (seconds) when a local clip is hosted. */
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

type VideoMode = "checking" | "local" | "youtube";

export default function GlobalVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<VideoMode>("checking");

  useEffect(() => {
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
      video.pause();
      return;
    }

    const onLoaded = () => {
      video.currentTime = CLIP_START_SEC;
      void video.play().catch(() => undefined);
    };

    const onTimeUpdate = () => {
      if (video.currentTime >= CLIP_START_SEC + CLIP_DURATION_SEC) {
        video.currentTime = CLIP_START_SEC;
      }
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [mode]);

  if (mode === "checking") {
    return <div className="global-video-bg global-video-bg--arming" aria-hidden />;
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
      <div className="global-video-bg__veil" />
    </div>
  );
}
