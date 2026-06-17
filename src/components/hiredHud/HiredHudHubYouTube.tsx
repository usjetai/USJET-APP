import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Play, Volume2 } from "lucide-react";
import type { YoutubePlayer } from "../../lib/youtubeIFrameApi";
import { loadYoutubeIFrameApi } from "../../lib/youtubeIFrameApi";

type HiredHudHubYouTubeProps = {
  videoId: string;
  startSeconds?: number;
  title: string;
  ariaLabel: string;
  playLabel?: string;
  feedTag?: string;
};

/** Hub YouTube window — user gesture starts playback with sound at `startSeconds`. */
export default function HiredHudHubYouTube({
  videoId,
  startSeconds = 0,
  title,
  ariaLabel,
  playLabel = "Play with sound",
  feedTag = "YouTube",
}: HiredHudHubYouTubeProps) {
  const reactId = useId().replace(/:/g, "");
  const mountId = `hired-hub-yt-${reactId}`;
  const playerRef = useRef<YoutubePlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError(false);
    setPlaying(false);
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
            autoplay: 0,
            mute: 0,
            start: startSeconds,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            enablejsapi: 1,
            fs: 1,
          },
          events: {
            onReady: () => {
              if (!cancelled) {
                player.setVolume(100);
                setReady(true);
              }
            },
            onError: () => {
              if (!cancelled) {
                setError(true);
              }
            },
            onStateChange: (event: { data: number }) => {
              if (cancelled) {
                return;
              }
              // YT.PlayerState.PLAYING === 1
              if (event.data === 1) {
                setPlaying(true);
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
  }, [mountId, startSeconds, videoId]);

  const startWithSound = useCallback(() => {
    const player = playerRef.current;
    if (!player || !ready) {
      return;
    }
    player.unMute();
    player.setVolume(100);
    player.playVideo();
    setPlaying(true);
  }, [ready]);

  return (
    <div
      className="hired-hud__hub-video hired-hud__hub-video--youtube"
      aria-label={ariaLabel}
      data-playing={playing ? "true" : "false"}
    >
      <div id={mountId} className="hired-hud__hub-video-yt-mount" title={title} />
      <span className="hired-hud__hub-video-tag hired-hud__hub-video-tag--youtube" aria-hidden>
        {feedTag}
      </span>
      {playing ? (
        <span className="hired-hud__hub-video-sound" aria-hidden>
          <Volume2 size={14} />
          Sound on
        </span>
      ) : null}
      {!playing && ready && !error ? (
        <button
          type="button"
          className="hired-hud__hub-video-play hired-hud__hub-video-play--youtube btn-glass glass-effect-interactive"
          onClick={startWithSound}
          aria-label={playLabel}
        >
          <Play size={18} aria-hidden />
          <span>{playLabel}</span>
        </button>
      ) : null}
      {error ? (
        <div className="hired-hud__hub-video-error" role="alert">
          Clip unavailable
        </div>
      ) : null}
    </div>
  );
}
