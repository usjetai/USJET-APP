/**
 * Start Mission quick-launch options on the Hangar floor.
 * Each option maps to a Hangar tile slot — click opens that bay in place.
 * Add more browser / tool options here as embed-friendly partners clear X-Frame.
 */

export type HangarStartMissionCategory = "browser";

export type HangarStartMissionOption = {
  id: string;
  label: string;
  category: HangarStartMissionCategory;
  /** Hangar floor slot to open (0-indexed). */
  hangarSlot: number;
  blurb: string;
};

/** Swisscows — Tile 14 (slot 13). Privacy search; headers allow Hangar iframe. */
export const SWISSCOWS_HANGAR_SLOT = 13;

export const HANGAR_START_MISSION_OPTIONS: HangarStartMissionOption[] = [
  {
    id: "swisscows-browser",
    label: "Swisscows",
    category: "browser",
    hangarSlot: SWISSCOWS_HANGAR_SLOT,
    blurb: "Privacy search browser — loads in-tile.",
  },
];

export const HANGAR_START_MISSION_CATEGORIES: {
  id: HangarStartMissionCategory;
  label: string;
}[] = [{ id: "browser", label: "Browser" }];
