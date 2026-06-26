import { useEffect, useId, useRef, useState } from "react";
import { GLOBAL_VIDEO_BACKGROUND_YOUTUBE_ID } from "../../data/globalVideoBackground";

const YOUTUBE_ID = GLOBAL_VIDEO_BACKGROUND_YOUTUBE_ID;
const CLIP_START_SEC = 0;
import type { YoutubePlayer } from "../../lib/youtubeIFrameApi";
import { loadYoutubeIFrameApi } from "../../lib/youtubeIFrameApi";

export default function GlobalVideoBackground() {
  const reactId = useId().replace(/:/g, "");
  const mountId = `global-warp-${reactId}`;
  const playerRef = useRef<YoutubePlayer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    playerRef.current?.destroy();
    playerRef.current = null;

    const boot = async () => {
      try {
        await loadYoutubeIFrameApi();
        if (cancelled || !window.YT?.Player) {
          return;
        }

        const player = new window.YT.Player(mountId, {
          videoId: YOUTUBE_ID,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            loop: 1,
            playlist: YOUTUBE_ID,
            playsinline: 1,
            modestbranding: 1,
            iv_load_policy: 3,
            disablekb: 1,
            start: CLIP_START_SEC,
            enablejsapi: 1,
          },
          events: {
            onReady: () => {
              if (!cancelled) {
                player.mute();
                player.playVideo();
                setReady(true);
              }
            },
          },
        });

        playerRef.current = player;
      } catch {
        // silent fail — warp remains hidden until Protocol arms atmosphere
      }
    };

    void boot();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [mountId]);

  return (
    <div className="global-video-bg global-video-bg--youtube-official" aria-hidden>
      <div id={mountId} className="global-video-bg__yt" title="USJET warp-speed atmosphere" />
    </div>
  );
}
