import { useEffect, useId, useRef, useState } from "react";
import { useSilentHangar } from "../../context/SilentHangarContext";
import { createTwitchChannelPlayer, createTwitchClipPlayer, type TwitchPlayerInstance } from "../../lib/twitchPlayerScript";
import SilentHangarFrame from "./SilentHangarFrame";

type SilentHangarTwitchPlayerProps = {
  channel?: string;
  clip?: string;
  className?: string;
  mountClassName?: string;
};

export default function SilentHangarTwitchPlayer({
  channel,
  clip,
  className = "",
  mountClassName = "silent-hangar-twitch__mount",
}: SilentHangarTwitchPlayerProps) {
  const reactId = useId();
  const elementId = `twitch-player-${reactId.replace(/:/g, "")}`;
  const { audioArmed } = useSilentHangar();
  const playerRef = useRef<TwitchPlayerInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setError(false);

    const boot = async () => {
      try {
        const player = clip
          ? await createTwitchClipPlayer(elementId, { clip, muted: true })
          : await createTwitchChannelPlayer(elementId, { channel: channel ?? "", muted: true });

        if (cancelled) {
          player.destroy();
          return;
        }

        playerRef.current = player;
        player.setMuted(true);
        player.addEventListener("ready", () => {
          if (!cancelled) {
            setReady(true);
          }
        });
        setReady(true);
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
  }, [channel, clip, elementId]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !ready) {
      return;
    }
    player.setMuted(!audioArmed);
    if (audioArmed) {
      player.setVolume(0.55);
      player.play();
    }
  }, [audioArmed, ready]);

  return (
    <SilentHangarFrame className={className} screenClassName="silent-hangar-twitch__screen" loading={!ready && !error}>
      <div id={elementId} className={mountClassName} />
      {error ? (
        <p className="silent-hangar-frame__loading" role="alert">
          Twitch signal unavailable — open on Twitch
        </p>
      ) : null}
    </SilentHangarFrame>
  );
}
