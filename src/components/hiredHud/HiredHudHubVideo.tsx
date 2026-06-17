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

/** Looping hub reel — autoplay muted inside the Hired HUD developer hub. */
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

    const onReady = () => {
      void startPlayback();
    };

    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);
    void startPlayback();

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, [src, startPlayback]);

  return (
    <div className="hired-hud__hub-video" aria-label={ariaLabel}>
      <video
        ref={videoRef}
        className="hired-hud__hub-video-player"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
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
