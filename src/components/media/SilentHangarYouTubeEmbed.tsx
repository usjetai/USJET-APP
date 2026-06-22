import { useEffect, useId, useRef, useState } from "react";
import { useSilentHangar } from "../../context/SilentHangarContext";
import { SITE_AUDIO_DISABLED } from "../../data/siteAudio";
import type { YoutubePlayer } from "../../lib/youtubeIFrameApi";
import { loadYoutubeIFrameApi } from "../../lib/youtubeIFrameApi";
import SilentHangarFrame from "./SilentHangarFrame";

type SilentHangarYouTubeEmbedProps = {
  videoId: string;
  title?: string;
  className?: string;
};

/** YouTube embed — muted on load; un-mutes via global Silent Hangar toggle (arms audio). */
export default function SilentHangarYouTubeEmbed({
  videoId,
  title = "Evidence clip",
  className = "",
}: SilentHangarYouTubeEmbedProps) {
  const reactId = useId().replace(/:/g, "");
  const mountId = `yt-${reactId}`;
  const playerRef = useRef<YoutubePlayer | null>(null);
  const { audioArmed } = useSilentHangar();
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
            autoplay: 0,
            mute: 1,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: () => {
              if (!cancelled) {
                player.mute();
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

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !ready) {
      return;
    }
    if (!SITE_AUDIO_DISABLED && audioArmed) {
      player.unMute();
      player.setVolume(80);
      player.playVideo();
    } else {
      player.mute();
    }
  }, [audioArmed, ready]);

  return (
    <SilentHangarFrame
      className={["silent-hangar-youtube", className].filter(Boolean).join(" ")}
      screenClassName="silent-hangar-youtube__screen"
      loading={!ready && !error}
    >
      <div id={mountId} className="silent-hangar-youtube__mount" title={title} />
      {error ? (
        <p className="silent-hangar-frame__loading" role="alert">
          Clip unavailable — open on YouTube
        </p>
      ) : null}
    </SilentHangarFrame>
  );
}
