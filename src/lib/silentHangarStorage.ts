import { SILENT_HANGAR_DEFAULT, SILENT_HANGAR_STORAGE_KEY, type SilentHangarAudioPref } from "../data/silentHangar";

export function readSilentHangarPref(): SilentHangarAudioPref {
  if (typeof window === "undefined") {
    return SILENT_HANGAR_DEFAULT;
  }
  try {
    const raw = window.localStorage.getItem(SILENT_HANGAR_STORAGE_KEY);
    if (raw === "armed" || raw === "muted") {
      return raw;
    }
    return SILENT_HANGAR_DEFAULT;
  } catch {
    return SILENT_HANGAR_DEFAULT;
  }
}

export function writeSilentHangarPref(pref: SilentHangarAudioPref): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(SILENT_HANGAR_STORAGE_KEY, pref);
  } catch {
    /* quota / private mode */
  }
}

export function isSilentHangarArmed(): boolean {
  return readSilentHangarPref() === "armed";
}
