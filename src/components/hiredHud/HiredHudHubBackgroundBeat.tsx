import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  HIRED_HUD_HUB_BEAT_LABEL,
  HIRED_HUD_HUB_BEAT_VIDEO_ID,
  HIRED_HUD_HUB_BEAT_VOLUME,
} from "../../data/hiredHudHubBeat";
import { USJET_PROTOCOL_CEREMONY_EVENT } from "../../lib/protocolCeremony";
import type { YoutubePlayer } from "../../lib/youtubeIFrameApi";
import { loadYoutubeIFrameApi } from "../../lib/youtubeIFrameApi";

const YT_ENDED = 0;
const HIRED_HUD_PATH = "/hired-hud";

export type HiredHudHubBackgroundBeatHandle = {
  /** Call during a user gesture — returns true once sound is live. */
  armWithSound: () => boolean;
};

function unlockPlayerSound(player: YoutubePlayer): void {
  player.setVolume(HIRED_HUD_HUB_BEAT_VOLUME);
  player.unMute();
  player.playVideo();
}

/** Hidden YouTube track — preloads muted; hub gesture unmutes and plays once. */
const HiredHudHubBackgroundBeat = forwardRef<HiredHudHubBackgroundBeatHandle>(
  function HiredHudHubBackgroundBeat(_props, ref) {
    const reactId = useId().replace(/:/g, "");
    const mountId = `hired-hub-beat-${reactId}`;
    const playerRef = useRef<YoutubePlayer | null>(null);
    const soundLiveRef = useRef(false);
    const readyRef = useRef(false);
    const [mounted, setMounted] = useState(false);
    const [ready, setReady] = useState(false);

    const tryUnlockSound = useCallback((): boolean => {
      if (!mounted) {
        setMounted(true);
        return false;
      }

      if (soundLiveRef.current) {
        return true;
      }

      const player = playerRef.current;
      if (!player || !readyRef.current) {
        return false;
      }

      unlockPlayerSound(player);
      soundLiveRef.current = true;
      return true;
    }, [mounted]);

    useImperativeHandle(ref, () => ({ armWithSound: tryUnlockSound }), [tryUnlockSound]);

    useEffect(() => {
      if (!mounted) {
        return undefined;
      }

      let cancelled = false;
      readyRef.current = false;
      setReady(false);
      soundLiveRef.current = false;
      playerRef.current?.destroy();
      playerRef.current = null;

      const boot = async () => {
        try {
          await loadYoutubeIFrameApi();
          if (cancelled || !window.YT?.Player) {
            return;
          }

          const player = new window.YT.Player(mountId, {
            videoId: HIRED_HUD_HUB_BEAT_VIDEO_ID,
            playerVars: {
              autoplay: 1,
              mute: 1,
              controls: 0,
              playsinline: 1,
              enablejsapi: 1,
              rel: 0,
              modestbranding: 1,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              loop: 0,
              origin: typeof window !== "undefined" ? window.location.origin : undefined,
            },
            events: {
              onReady: (event: { target: YoutubePlayer }) => {
                if (cancelled) {
                  return;
                }
                readyRef.current = true;
                setReady(true);
                event.target.mute();
                event.target.playVideo();
              },
              onStateChange: (event: { data: number; target: YoutubePlayer }) => {
                if (event.data === YT_ENDED) {
                  event.target.pauseVideo();
                }
              },
              onError: () => {
                if (!cancelled) {
                  readyRef.current = false;
                  setReady(false);
                }
              },
            },
          });

          playerRef.current = player;
        } catch {
          /* beat unavailable — hub stays visual-only */
        }
      };

      void boot();

      return () => {
        cancelled = true;
        readyRef.current = false;
        playerRef.current?.destroy();
        playerRef.current = null;
      };
    }, [mountId, mounted]);

    useEffect(() => {
      if (!mounted || !readyRef.current || soundLiveRef.current) {
        return;
      }

      tryUnlockSound();
    }, [mounted, ready, tryUnlockSound]);

    useEffect(() => {
      const onProtocolTap = () => {
        if (window.location.pathname !== HIRED_HUD_PATH) {
          return;
        }
        tryUnlockSound();
      };

      window.addEventListener(USJET_PROTOCOL_CEREMONY_EVENT, onProtocolTap);
      return () => window.removeEventListener(USJET_PROTOCOL_CEREMONY_EVENT, onProtocolTap);
    }, [tryUnlockSound]);

    return (
      <div className="hired-hud-hub-beat" aria-hidden data-ready={ready ? "true" : "false"}>
        {mounted ? (
          <div id={mountId} className="hired-hud-hub-beat__mount" title={HIRED_HUD_HUB_BEAT_LABEL} />
        ) : null}
      </div>
    );
  },
);

export default HiredHudHubBackgroundBeat;
