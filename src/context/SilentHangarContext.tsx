import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SilentHangarAudioPref } from "../data/silentHangar";
import { SITE_AUDIO_DISABLED } from "../data/siteAudio";
import { readSilentHangarPref, writeSilentHangarPref } from "../lib/silentHangarStorage";

type SilentHangarContextValue = {
  audioArmed: boolean;
  setAudioArmed: (armed: boolean) => void;
  toggleAudioArmed: () => void;
};

const SilentHangarContext = createContext<SilentHangarContextValue | null>(null);

export function SilentHangarProvider({ children }: { children: ReactNode }) {
  const [pref, setPref] = useState<SilentHangarAudioPref>(() =>
    SITE_AUDIO_DISABLED ? "muted" : readSilentHangarPref(),
  );

  const setAudioArmed = useCallback((armed: boolean) => {
    const next: SilentHangarAudioPref = !SITE_AUDIO_DISABLED && armed ? "armed" : "muted";
    setPref(next);
    writeSilentHangarPref(next);
    try {
      window.dispatchEvent(new CustomEvent("silentHangarArm", { detail: { armed: next === "armed" } }));
    } catch {
      // ignore on non-browser environments
    }
  }, []);

  const toggleAudioArmed = useCallback(() => {
    setAudioArmed(pref !== "armed");
  }, [pref, setAudioArmed]);

  const value = useMemo(
    () => ({
      audioArmed: !SITE_AUDIO_DISABLED && pref === "armed",
      setAudioArmed,
      toggleAudioArmed,
    }),
    [pref, setAudioArmed, toggleAudioArmed],
  );

  return <SilentHangarContext.Provider value={value}>{children}</SilentHangarContext.Provider>;
}

export function useSilentHangar(): SilentHangarContextValue {
  const ctx = useContext(SilentHangarContext);
  if (!ctx) {
    throw new Error("useSilentHangar must be used within SilentHangarProvider");
  }
  return ctx;
}

/** Safe outside provider — defaults to muted. */
export function useSilentHangarOptional(): SilentHangarContextValue {
  const ctx = useContext(SilentHangarContext);
  const fallback = useMemo(
    () => ({
      audioArmed: false,
      setAudioArmed: () => undefined,
      toggleAudioArmed: () => undefined,
    }),
    [],
  );
  return ctx ?? fallback;
}
