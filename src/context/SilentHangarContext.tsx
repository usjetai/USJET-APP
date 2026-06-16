import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SilentHangarAudioPref } from "../data/silentHangar";
import { readSilentHangarPref, writeSilentHangarPref } from "../lib/silentHangarStorage";

type SilentHangarContextValue = {
  audioArmed: boolean;
  setAudioArmed: (armed: boolean) => void;
  toggleAudioArmed: () => void;
};

const SilentHangarContext = createContext<SilentHangarContextValue | null>(null);

export function SilentHangarProvider({ children }: { children: ReactNode }) {
  const [pref, setPref] = useState<SilentHangarAudioPref>(() => readSilentHangarPref());

  const setAudioArmed = useCallback((armed: boolean) => {
    const next: SilentHangarAudioPref = armed ? "armed" : "muted";
    setPref(next);
    writeSilentHangarPref(next);
  }, []);

  const toggleAudioArmed = useCallback(() => {
    setAudioArmed(pref !== "armed");
  }, [pref, setAudioArmed]);

  const value = useMemo(
    () => ({
      audioArmed: pref === "armed",
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
