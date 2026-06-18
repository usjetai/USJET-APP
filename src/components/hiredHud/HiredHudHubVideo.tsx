import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

async function tryPlay(video: HTMLVideoElement): Promise<boolean> {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  try {
    await video.play();
    return !video.paused;
  } catch {
    return false;
  }
}

type HiredHudHubVideoProps = {
  src: string;
  ariaLabel: string;
  playLabel?: string;
  feedTag?: string;
};

/** Looping hub reel — plays muted only while visible to avoid decoder overload. */
export default function HiredHudHubVideo({
  src,
  ariaLabel,
  playLabel = "Play hub feed",
  feedTag = "Live",
}: HiredHudHubVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  const startPlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    const playing = await tryPlay(video);
    setNeedsTap(!playing);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let visible = false;

    const maybePlay = () => {
      if (visible) {
        void startPlayback();
      }
    };

    video.addEventListener("loadeddata", maybePlay);
    video.addEventListener("canplay", maybePlay);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) {
          void startPlayback();
          return;
        }
        video.pause();
        setNeedsTap(false);
      },
      { threshold: 0.2, rootMargin: "48px 0px" },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", maybePlay);
      video.removeEventListener("canplay", maybePlay);
      video.pause();
    };
  }, [src, startPlayback]);

  return (
    <div className="hired-hud__hub-video" aria-label={ariaLabel}>
      <video
        ref={videoRef}
        className="hired-hud__hub-video-player"
        src={src}
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={ariaLabel}
      />
      <span className="hired-hud__hub-video-tag" aria-hidden>
        {feedTag}
      </span>
      {needsTap ? (
        <button
          type="button"
          className="hired-hud__hub-video-play btn-glass glass-effect-interactive"
          onClick={() => {
            void startPlayback();
          }}
          aria-label={playLabel}
        >
          <Play size={18} aria-hidden />
          <span>{playLabel}</span>
        </button>
      ) : null}
    </div>
  );
}
