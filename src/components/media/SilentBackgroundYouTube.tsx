import { useEffect, useId, useRef, useState } from "react";
import { SITE_AUDIO_DISABLED } from "../../data/siteAudio";
import { loadYoutubeIFrameApi } from "../../lib/youtubeIFrameApi";
import type { YoutubePlayer } from "../../lib/youtubeIFrameApi";

type Props = {
  videoId: string;
  className?: string;
};

/**
 * Background YouTube audio player.
 * - loads muted autoplay so audio is primed
 * - stays visually hidden (aria-hidden)
 * - un-mutes when `audioArmed` global toggle is fired elsewhere
 */
export default function SilentBackgroundYouTube({ videoId, className = "" }: Props) {
  if (SITE_AUDIO_DISABLED) {
    return null;
  }

  const reactId = useId().replace(/:/g, "");
  const mountId = `bg-yt-${reactId}`;
  const playerRef = useRef<YoutubePlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError(false);
    playerRef.current?.destroy();
    playerRef.current = null;

    const boot = async () => {
      try {
        await loadYoutubeIFrameApi();
        if (cancelled || !window.YT?.Player) {
          return;
        }

        const player = new window.YT.Player(mountId, {
          videoId,
          playerVars: {
            autoplay: 1, // start playing muted so browsers will allow it
            mute: 1,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: () => {
              if (!cancelled) {
                try {
                  player.mute();
                } catch {}
                setReady(true);
              }
            },
            onError: () => {
              if (!cancelled) {
                setError(true);
              }
            },
          },
        });

        playerRef.current = player;
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    };

    void boot();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [mountId, videoId]);

  // Expose a simple global handler to arm/unarm audio via CustomEvent.
  useEffect(() => {
    const onArm = (e: Event) => {
      const detail = (e as CustomEvent).detail as { armed: boolean } | undefined;
      const player = playerRef.current;
      if (!player || !ready) return;
      if (detail?.armed) {
        try {
          player.unMute();
          player.setVolume(80);
          player.playVideo();
        } catch {}
      } else {
        try {
          player.mute();
        } catch {}
      }
    };

    window.addEventListener("silentHangarArm", onArm as EventListener);
    return () => window.removeEventListener("silentHangarArm", onArm as EventListener);
  }, [ready]);

  return (
    <div
      aria-hidden
      className={["silent-background-youtube", className].filter(Boolean).join(" ")}
      style={{ width: 0, height: 0, overflow: "hidden", position: "absolute", left: "-9999px" }}
    >
      <div id={mountId} />
      {error ? <span role="img" aria-label="unavailable" /> : null}
    </div>
  );
}
