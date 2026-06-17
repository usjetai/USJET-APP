import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useSilentHangarOptional } from "../../context/SilentHangarContext";
import {
  getActiveGlobalBackgroundBeatVideoId,
  getGlobalBackgroundBeatVideoId,
  GLOBAL_BACKGROUND_BEAT_LABEL,
  GLOBAL_BACKGROUND_BEAT_START_INDEX,
} from "../../data/globalBackgroundBeat";
import type { YoutubePlayer } from "../../lib/youtubeIFrameApi";
import { loadYoutubeIFrameApi } from "../../lib/youtubeIFrameApi";
import { USJET_PRIME_AUDIO_EVENT } from "./SiteAudioPrime";

const BEAT_VOLUME = 58;
const YT_ENDED = 0;

/** Hidden YouTube beat — loops the active playlist slot (beat II only). */
export default function GlobalBackgroundBeat() {
  const reactId = useId().replace(/:/g, "");
  const mountId = `global-beat-${reactId}`;
  const playerRef = useRef<YoutubePlayer | null>(null);
  const beatIndexRef = useRef(0);
  const audioArmedRef = useRef(false);
  const { audioArmed } = useSilentHangarOptional();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    audioArmedRef.current = audioArmed;
  }, [audioArmed]);

  const syncPlayerAudio = useCallback((player: YoutubePlayer, armed: boolean) => {
    player.setVolume(BEAT_VOLUME);
    if (armed) {
      player.unMute();
      player.playVideo();
    } else {
      player.mute();
    }
  }, []);

  const playArmedBeat = useCallback(() => {
    const player = playerRef.current;
    if (!player || !ready) {
      return;
    }
    syncPlayerAudio(player, true);
  }, [ready, syncPlayerAudio]);

  const advanceBeat = useCallback(
    (player: YoutubePlayer) => {
      const loopIndex = GLOBAL_BACKGROUND_BEAT_START_INDEX;
      beatIndexRef.current = loopIndex;
      player.loadVideoById(getGlobalBackgroundBeatVideoId(loopIndex));
      syncPlayerAudio(player, audioArmedRef.current);
    },
    [syncPlayerAudio],
  );

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    beatIndexRef.current = GLOBAL_BACKGROUND_BEAT_START_INDEX;
    playerRef.current?.destroy();
    playerRef.current = null;

    const boot = async () => {
      try {
        await loadYoutubeIFrameApi();
        if (cancelled || !window.YT?.Player) {
          return;
        }

        const videoId = getActiveGlobalBackgroundBeatVideoId();
        const player = new window.YT.Player(mountId, {
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            playlist: videoId,
          },
          events: {
            onReady: (event: { target: YoutubePlayer }) => {
              if (cancelled) {
                return;
              }
              syncPlayerAudio(event.target, false);
              event.target.playVideo();
              setReady(true);
            },
            onStateChange: (event: { data: number; target: YoutubePlayer }) => {
              if (event.data === YT_ENDED) {
                advanceBeat(event.target);
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
  }, [advanceBeat, mountId, syncPlayerAudio]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !ready) {
      return;
    }

    syncPlayerAudio(player, audioArmed);
  }, [audioArmed, ready, syncPlayerAudio]);

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
