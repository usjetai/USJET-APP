/** Silent Hangar Protocol — muted autoplay until the Captain arms audio. */

export const SILENT_HANGAR_STORAGE_KEY = "usjet-silent-hangar-audio" as const;

export type SilentHangarAudioPref = "muted" | "armed";

export const SILENT_HANGAR_DEFAULT: SilentHangarAudioPref = "muted";

export const SILENT_HANGAR_LABEL_MUTED = "Sound off — Captain's order required" as const;
export const SILENT_HANGAR_LABEL_ARMED = "Live audio — Hangar unmuted" as const;
