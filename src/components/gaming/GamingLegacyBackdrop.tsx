import { useCallback, useEffect, useRef, useState } from "react";
import { useSilentHangarOptional } from "../../context/SilentHangarContext";
import { LEGACY_ENGINE_VIDEO_SRC } from "../../data/gamingLegacyEngine";
import SilentHangarAudioToggle from "../media/SilentHangarAudioToggle";

/** Obsidian + liquid glass atmosphere — HD loop optional; Silent Hangar mutes until armed. */
export default function GamingLegacyBackdrop() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { audioArmed } = useSilentHangarOptional();
  const [videoActive, setVideoActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch(LEGACY_ENGINE_VIDEO_SRC, { method: "HEAD" }).then((r) => {
      if (!cancelled && r.ok) {
        setVideoActive(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const syncMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) {
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      v.pause();
      v.muted = true;
      return;
    }
    v.muted = !audioArmed;
    if (audioArmed) {
      v.volume = 0.4;
      void v.play().catch(() => undefined);
      return;
    }
    void v.play().catch(() => undefined);
  }, [audioArmed]);

  useEffect(() => {
    syncMute();
  }, [syncMute, videoActive]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoActive) {
      return;
    }
    const onVis = () => {
      syncMute();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [videoActive, syncMute]);

  return (
    <div className="gaming-legacy-backdrop" aria-hidden>
      <div className="gaming-legacy-backdrop__mesh" />
      <div className="gaming-legacy-backdrop__grid" />
      <div className="gaming-legacy-backdrop__grain" />
      <div className="gaming-legacy-backdrop__vignette" />

      {videoActive ? (
        <video
          ref={videoRef}
          className="gaming-legacy-backdrop__video"
          src={LEGACY_ENGINE_VIDEO_SRC}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          onError={() => setVideoActive(false)}
        />
      ) : null}

      <div className="gaming-legacy-backdrop__hud-corner gaming-legacy-backdrop__hud-corner--tl" />
      <div className="gaming-legacy-backdrop__hud-corner gaming-legacy-backdrop__hud-corner--tr" />
      <div className="gaming-legacy-backdrop__hud-corner gaming-legacy-backdrop__hud-corner--bl" />
      <div className="gaming-legacy-backdrop__hud-corner gaming-legacy-backdrop__hud-corner--br" />

      <SilentHangarAudioToggle className="gaming-legacy-backdrop__audio" />
    </div>
  );
}
