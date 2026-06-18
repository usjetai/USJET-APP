/** Medical HUD backdrop for hired-developer tiles on `/hired-hud`. */
export const HIRED_HUD_TILE_BG = "/hired-hud/developer-tile-hud-bg.png";

/** NYC vector map inside hub jet-radar scopes. */
export const HIRED_HUD_RADAR_SCOPE_MAP_SRC = "/hired-hud/radar-scope-map-nyc.png" as const;

/** Per-tile glam fuel CTA — direct Cash App for nails & hair. */
export const HIRED_HUD_GLAM_FUEL_CTA_LABEL = "Fuel nails & hair" as const;

/** Looping hub reels on the Hired HUD developer hub panel. */
export const HIRED_HUD_HUB_VIDEO_SRC = "/hired-hud/hub-minute-loop.mp4" as const;
export const HIRED_HUD_HUB_EVERYONE_VIDEO_SRC = "/hired-hud/hub-everyone-loop.mp4" as const;
export const HIRED_HUD_HUB_SECOND_VIDEO_SRC = "/hired-hud/hub-second-loop.mp4" as const;
export const HIRED_HUD_HUB_FIREFLY_HOOPS_VIDEO_SRC = "/hired-hud/hub-firefly-hoops-loop.mp4" as const;
export const HIRED_HUD_HUB_FIREFLY_MOTORBIKE_VIDEO_SRC = "/hired-hud/hub-firefly-motorbike-loop.mp4" as const;

/** Hub YouTube windows — own tiles, play-with-sound on tap. */
export type HiredHudHubYouTubeFeed = {
  videoId: string;
  startSeconds: number;
  title: string;
  feedTag?: string;
};

export const HIRED_HUD_HUB_YOUTUBE_FEEDS: readonly HiredHudHubYouTubeFeed[] = [
  {
    videoId: "-ASqRWm8Yv8",
    startSeconds: 14,
    title: "Top 10 Hottest Female Characters In Anime",
    feedTag: "YouTube",
  },
  {
    videoId: "Fhcde_pbNqQ",
    startSeconds: 17,
    title: "Top 50 Cutest Female Anime Characters of All Time | Ranked",
    feedTag: "YouTube",
  },
  {
    videoId: "BhfpIesdN-Y",
    startSeconds: 41,
    title: "This Anime Girl Became Japan's Top Idol in 90 Mins. Here's How.",
    feedTag: "YouTube",
  },
];

/** Glam chips on hub developer tiles (not crew profile strip). */
const HIRED_HUD_TILE_HAIR_EMOJIS = ["💇‍♀️", "💇", "💆‍♀️", "🪮", "✂️", "👩‍🦱", "💁‍♀️", "🧴"] as const;
const HIRED_HUD_TILE_CLOTHES_EMOJIS = ["👗", "👚", "🧥", "👖", "🩱", "👘"] as const;
const HIRED_HUD_TILE_FASHION_EMOJIS = ["👠", "👜", "🛍️", "🕶️", "👒", "💄"] as const;
const HIRED_HUD_TILE_CAR_EMOJIS = ["🚗", "🚙", "🏎️", "🛻", "🚘", "🏁"] as const;

/** Blue Ivy + Rumi — extra sovereign glam chips on hub tiles only. */
export const HIRED_HUD_ELITE_GLAM_SLOTS: readonly number[] = [0, 10];

const HIRED_HUD_ELITE_GLAM_EXTRA_CHIPS: readonly HiredHudTileGlamChip[] = [
  { emoji: "🚁", title: "Helicopter" },
  { emoji: "🛩️", title: "Private jet" },
  { emoji: "🏰", title: "Mansion" },
  { emoji: "🧘‍♀️", title: "Meditation" },
  { emoji: "✝️", title: "Crucifix" },
  { emoji: "💲", title: "Dollar sign" },
  { emoji: "💵", title: "Money" },
];

/** Mary Stealth, Chop, Stick, Aaliyah, Christal — cross (+ meditation where noted) on hub tile glam extras. */
const HIRED_HUD_SLOT_GLAM_EXTRA_CHIPS: Readonly<Partial<Record<number, readonly HiredHudTileGlamChip[]>>> = {
  1: [
    { emoji: "✝️", title: "Cross" },
    { emoji: "🧘‍♀️", title: "Meditation" },
  ],
  2: [
    { emoji: "✝️", title: "Cross" },
    { emoji: "🧘‍♀️", title: "Meditation" },
  ],
  3: [
    { emoji: "✝️", title: "Cross" },
    { emoji: "🧘‍♀️", title: "Meditation" },
  ],
  5: [{ emoji: "✝️", title: "Cross" }],
  25: [{ emoji: "✝️", title: "Cross" }],
};

export type HiredHudTileGlamChip = {
  emoji: string;
  title: string;
};

export function getHiredHudTileGlamChips(slot: number): readonly HiredHudTileGlamChip[] {
  const base: HiredHudTileGlamChip[] = [
    { emoji: "💅", title: "Nails" },
    { emoji: HIRED_HUD_TILE_HAIR_EMOJIS[slot % HIRED_HUD_TILE_HAIR_EMOJIS.length] ?? "💇‍♀️", title: "Hair" },
    { emoji: "🩴", title: "Pedicure" },
    { emoji: "🦶", title: "Feet" },
    { emoji: HIRED_HUD_TILE_CLOTHES_EMOJIS[slot % HIRED_HUD_TILE_CLOTHES_EMOJIS.length] ?? "👗", title: "Clothes" },
    { emoji: HIRED_HUD_TILE_FASHION_EMOJIS[slot % HIRED_HUD_TILE_FASHION_EMOJIS.length] ?? "👠", title: "Fashion" },
    { emoji: HIRED_HUD_TILE_CAR_EMOJIS[slot % HIRED_HUD_TILE_CAR_EMOJIS.length] ?? "🚗", title: "Car" },
    { emoji: "💍", title: "Diamond ring" },
    { emoji: "💻", title: "Laptop" },
  ];

  if (HIRED_HUD_ELITE_GLAM_SLOTS.includes(slot)) {
    return [...base, ...HIRED_HUD_ELITE_GLAM_EXTRA_CHIPS, ...(HIRED_HUD_SLOT_GLAM_EXTRA_CHIPS[slot] ?? [])];
  }

  const slotExtra = HIRED_HUD_SLOT_GLAM_EXTRA_CHIPS[slot] ?? [];
  if (slotExtra.length > 0) {
    return [...base, ...slotExtra];
  }

  return base;
}
