import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useSilentHangarOptional } from "../../context/SilentHangarContext";
import { GLOBAL_BACKGROUND_BEAT_LABEL, GLOBAL_BACKGROUND_BEAT_VIDEO_ID } from "../../data/globalBackgroundBeat";
import type { YoutubePlayer } from "../../lib/youtubeIFrameApi";
import { loadYoutubeIFrameApi } from "../../lib/youtubeIFrameApi";
import { USJET_PRIME_AUDIO_EVENT } from "./SiteAudioPrime";

const BEAT_VOLUME = 58;

/** Hidden looping YouTube beat — arms through Silent Hangar site-wide audio toggle. */
export default function GlobalBackgroundBeat() {
  const reactId = useId().replace(/:/g, "");
  const mountId = `global-beat-${reactId}`;
  const playerRef = useRef<YoutubePlayer | null>(null);
  const { audioArmed } = useSilentHangarOptional();
  const [ready, setReady] = useState(false);

  const playArmedBeat = useCallback(() => {
    const player = playerRef.current;
    if (!player || !ready) {
      return;
    }
    player.unMute();
    player.setVolume(BEAT_VOLUME);
    player.playVideo();
  }, [ready]);

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
          videoId: GLOBAL_BACKGROUND_BEAT_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            playlist: GLOBAL_BACKGROUND_BEAT_VIDEO_ID,
            controls: 0,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event: { target: YoutubePlayer }) => {
              if (cancelled) {
                return;
              }
              event.target.mute();
              event.target.setVolume(BEAT_VOLUME);
              event.target.playVideo();
              setReady(true);
            },
            onStateChange: (event: { data: number; target: YoutubePlayer }) => {
              if (event.data === 0) {
                event.target.playVideo();
              }
            },
          },
        });

        playerRef.current = player;
      } catch {
        /* beat unavailable — warp-only atmosphere */
      }
    };

    void boot();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [mountId]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !ready) {
      return;
    }

    if (audioArmed) {
      playArmedBeat();
    } else {
      player.mute();
    }
  }, [audioArmed, ready, playArmedBeat]);

  useEffect(() => {
    if (!ready || !audioArmed) {
      return;
    }

    const unlock = () => playArmedBeat();
    window.addEventListener(USJET_PRIME_AUDIO_EVENT, unlock);
    return () => window.removeEventListener(USJET_PRIME_AUDIO_EVENT, unlock);
  }, [audioArmed, ready, playArmedBeat]);

  return (
    <div className="global-background-beat" aria-hidden>
      <div id={mountId} className="global-background-beat__mount" title={GLOBAL_BACKGROUND_BEAT_LABEL} />
    </div>
  );
}
