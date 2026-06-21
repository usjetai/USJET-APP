/** Medical HUD backdrop for hired-developer tiles on `/hired-hud`. */
import { GAMING_TWITCH_DISPLAY, GAMING_TWITCH_URL, GAMING_X_URL, GAMING_X_WEB } from "./gamingPortal";
import { wrapExternalInCockpit } from "../lib/fleetLaunchUrl";
import { mailtoUsjetOps, USJET_CASH_APP_CASHTAG, USJET_CASH_APP_URL } from "../lib/usjetContact";

export type HiredHudTileGlamChip = {
  emoji: string;
  title: string;
  href?: string;
  linkLabel?: string;
  /** Direct off-site handoff (e.g. Cash App) — opens in a new tab. */
  external?: boolean;
};

/** Cross glam chip — JW.org via cockpit handoff. */
export const HIRED_HUD_CROSS_GLAM_HREF = wrapExternalInCockpit("https://www.jw.org/", {
  returnTo: "/hired-hud",
  label: "JW.org",
  callName: "JW.org",
});

const HIRED_HUD_CROSS_GLAM_CHIP: HiredHudTileGlamChip = {
  emoji: "✝️",
  title: "Cross",
  href: HIRED_HUD_CROSS_GLAM_HREF,
  linkLabel: "JW.org",
};

const HIRED_HUD_CRUCIFIX_GLAM_CHIP: HiredHudTileGlamChip = {
  emoji: "✝️",
  title: "Crucifix",
  href: HIRED_HUD_CROSS_GLAM_HREF,
  linkLabel: "JW.org",
};

/** Money chip — Life + Times via cockpit handoff. */
export const HIRED_HUD_MONEY_GLAM_HREF = wrapExternalInCockpit("https://lifeandtimes.com/", {
  returnTo: "/hired-hud",
  label: "Life + Times",
  callName: "Life + Times",
});

/** Dollar sign — USJET Instagram via cockpit handoff. */
export const HIRED_HUD_USJET_INSTAGRAM_GLAM_HREF = wrapExternalInCockpit("https://www.instagram.com/usjet/", {
  returnTo: "/hired-hud",
  label: "USJET Instagram",
  callName: "@usjet",
});

const HIRED_HUD_DOLLAR_SIGN_GLAM_CHIP: HiredHudTileGlamChip = {
  emoji: "💲",
  title: "Dollar sign",
  href: HIRED_HUD_USJET_INSTAGRAM_GLAM_HREF,
  linkLabel: "@usjet on Instagram",
};

const HIRED_HUD_MONEY_GLAM_CHIP: HiredHudTileGlamChip = {
  emoji: "💵",
  title: "Money",
  href: HIRED_HUD_MONEY_GLAM_HREF,
  linkLabel: "Life + Times",
};

/** Helicopter, mansion — Beyoncé via cockpit handoff. */
export const HIRED_HUD_BEYONCE_GLAM_HREF = wrapExternalInCockpit("https://beyonce.com/", {
  returnTo: "/hired-hud",
  label: "Beyoncé",
  callName: "Beyoncé",
});

const HIRED_HUD_HELICOPTER_GLAM_CHIP: HiredHudTileGlamChip = {
  emoji: "🚁",
  title: "Helicopter",
  href: HIRED_HUD_BEYONCE_GLAM_HREF,
  linkLabel: "Beyoncé",
};

const HIRED_HUD_MANSION_GLAM_CHIP: HiredHudTileGlamChip = {
  emoji: "🏰",
  title: "Mansion",
  href: HIRED_HUD_BEYONCE_GLAM_HREF,
  linkLabel: "Beyoncé",
};

/** Meditation — Twitch @usjetny via cockpit handoff. */
const HIRED_HUD_MEDITATION_GLAM_HREF = wrapExternalInCockpit(GAMING_TWITCH_URL, {
  returnTo: "/hired-hud",
  label: GAMING_TWITCH_DISPLAY,
  callName: GAMING_TWITCH_DISPLAY,
  directHandoff: true,
});

const HIRED_HUD_MEDITATION_GLAM_CHIP: HiredHudTileGlamChip = {
  emoji: "🧘‍♀️",
  title: "Meditation",
  href: HIRED_HUD_MEDITATION_GLAM_HREF,
  linkLabel: `Twitch ${GAMING_TWITCH_DISPLAY}`,
};

/** Nails, hair, feet — direct Cash App fuel per glam chip. */
const HIRED_HUD_CASH_APP_GLAM_LINK = {
  href: USJET_CASH_APP_URL,
  linkLabel: `${USJET_CASH_APP_CASHTAG} · Cash App`,
  external: true,
} as const;

/** Clothes & fashion — founder product lineup vault. */
const HIRED_HUD_FOUNDER_PRODUCTS_GLAM_LINK = {
  href: "/founder/products",
  linkLabel: "Founder product lineup",
} as const;

/** Car — X @usajet via cockpit handoff. */
const HIRED_HUD_CAR_GLAM_HREF = wrapExternalInCockpit(GAMING_X_URL, {
  returnTo: "/hired-hud",
  label: GAMING_X_WEB,
  callName: "@usajet",
  directHandoff: true,
});

/** Diamond ring — TikTok @usjetny via cockpit handoff. */
const HIRED_HUD_RING_GLAM_HREF = wrapExternalInCockpit("https://www.tiktok.com/@usjetny", {
  returnTo: "/hired-hud",
  label: "TikTok @usjetny",
  callName: "@usjetny",
  directHandoff: true,
});

export const HIRED_HUD_TILE_BG = "/hired-hud/developer-tile-hud-bg.png";

/** Gold jet captain wings — transparent overlay on hub developer tiles only. */
export const HIRED_HUD_JET_CAPTAIN_WINGS_SRC = "/hired-hud/jet-captain-wings.png" as const;

/** Embroidered jet captain patch — transparent hub badge under glam emojis. */
export const HIRED_HUD_JET_CAPTAIN_PATCH_SRC = "/hired-hud/jet-captain-patch.png" as const;

/** Earhart patrol circular patch — hub badge under glam emojis. */
export const HIRED_HUD_EARHART_PATROL_PATCH_SRC = "/hired-hud/earhart-patrol-patch.png" as const;

/** SR-71 Blackbird embroidered patch — hub glam chip for SR-71 developer bay. */
export const HIRED_HUD_SR71_BLACKBIRD_PATCH_SRC = "/hired-hud/sr71-blackbird-patch.png" as const;

/** Hired HUD slot for SR-71 Blackbird developer (Blue Ivy). */
export const HIRED_HUD_SR71_BLACKBIRD_SLOT = 0;

/** NYC photo map inside hub jet-radar scopes. */
export const HIRED_HUD_RADAR_SCOPE_MAP_SRC = "/hired-hud/nyc.jpg" as const;

/** Per-tile glam fuel CTA — direct Cash App for nails, hair & feet. */
export const HIRED_HUD_GLAM_FUEL_CTA_LABEL = "Fuel nails, hair & feet" as const;

/** Looping hub reels on the Hired HUD developer hub panel. */
export const HIRED_HUD_HUB_VIDEO_SRC = "/hired-hud/hub-minute-loop.mp4" as const;
export const HIRED_HUD_HUB_EVERYONE_VIDEO_SRC = "/hired-hud/hub-everyone-loop.mp4" as const;
export const HIRED_HUD_HUB_SECOND_VIDEO_SRC = "/hired-hud/hub-second-loop.mp4" as const;
export const HIRED_HUD_HUB_FIREFLY_HOOPS_VIDEO_SRC = "/hired-hud/hub-firefly-hoops-loop.mp4" as const;
export const HIRED_HUD_HUB_FIREFLY_MOTORBIKE_VIDEO_SRC = "/hired-hud/hub-firefly-motorbike-loop.mp4" as const;
export const HIRED_HUD_HUB_FIREFLY_10_VIDEO_SRC = "/hired-hud/hub-firefly-10-loop.mp4" as const;
export const HIRED_HUD_HUB_BURG_VIDEO_SRC = "/hired-hud/hub-burg-loop.mp4" as const;
export const HIRED_HUD_HUB_BASKETBALL_GAME_VIDEO_SRC = "/hired-hud/basketball-game-loop.mp4" as const;

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
  {
    videoId: "025RgOGsxJ4",
    startSeconds: 0,
    title: "USJET requested hub clip",
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
  HIRED_HUD_HELICOPTER_GLAM_CHIP,
  { emoji: "🛩️", title: "Private jet" },
  HIRED_HUD_MANSION_GLAM_CHIP,
  HIRED_HUD_MEDITATION_GLAM_CHIP,
  HIRED_HUD_CRUCIFIX_GLAM_CHIP,
  HIRED_HUD_MONEY_GLAM_CHIP,
];

/** Mary Stealth, Chop, Stick, Aaliyah, Christal — cross (+ meditation where noted) on hub tile glam extras. */
const HIRED_HUD_SLOT_GLAM_EXTRA_CHIPS: Readonly<Partial<Record<number, readonly HiredHudTileGlamChip[]>>> = {
  1: [HIRED_HUD_CROSS_GLAM_CHIP, HIRED_HUD_MEDITATION_GLAM_CHIP],
  2: [HIRED_HUD_CROSS_GLAM_CHIP, HIRED_HUD_MEDITATION_GLAM_CHIP],
  3: [HIRED_HUD_CROSS_GLAM_CHIP, HIRED_HUD_MEDITATION_GLAM_CHIP],
  5: [HIRED_HUD_CROSS_GLAM_CHIP],
  25: [HIRED_HUD_CROSS_GLAM_CHIP],
};

function dedupeHiredHudTileGlamChipsByEmoji(
  chips: readonly HiredHudTileGlamChip[],
): HiredHudTileGlamChip[] {
  const seen = new Set<string>();
  const unique: HiredHudTileGlamChip[] = [];

  for (const chip of chips) {
    if (seen.has(chip.emoji)) continue;
    seen.add(chip.emoji);
    unique.push(chip);
  }

  return unique;
}

export function getHiredHudTileGlamChips(slot: number): readonly HiredHudTileGlamChip[] {
  const base: HiredHudTileGlamChip[] = [
    { emoji: "💅", title: "Nails", ...HIRED_HUD_CASH_APP_GLAM_LINK },
    {
      emoji: HIRED_HUD_TILE_HAIR_EMOJIS[slot % HIRED_HUD_TILE_HAIR_EMOJIS.length] ?? "💇‍♀️",
      title: "Hair",
      ...HIRED_HUD_CASH_APP_GLAM_LINK,
    },
    { emoji: "🩴", title: "Pedicure" },
    { emoji: "🦶", title: "Feet", ...HIRED_HUD_CASH_APP_GLAM_LINK },
    {
      emoji: HIRED_HUD_TILE_CLOTHES_EMOJIS[slot % HIRED_HUD_TILE_CLOTHES_EMOJIS.length] ?? "👗",
      title: "Clothes",
      ...HIRED_HUD_FOUNDER_PRODUCTS_GLAM_LINK,
    },
    {
      emoji: HIRED_HUD_TILE_FASHION_EMOJIS[slot % HIRED_HUD_TILE_FASHION_EMOJIS.length] ?? "👠",
      title: "Fashion",
      ...HIRED_HUD_FOUNDER_PRODUCTS_GLAM_LINK,
    },
    {
      emoji: HIRED_HUD_TILE_CAR_EMOJIS[slot % HIRED_HUD_TILE_CAR_EMOJIS.length] ?? "🚗",
      title: "Car",
      href: HIRED_HUD_CAR_GLAM_HREF,
      linkLabel: GAMING_X_WEB,
    },
    {
      emoji: "💍",
      title: "Diamond ring",
      href: HIRED_HUD_RING_GLAM_HREF,
      linkLabel: "TikTok @usjetny",
    },
    { emoji: "💻", title: "Laptop", href: mailtoUsjetOps() },
    HIRED_HUD_DOLLAR_SIGN_GLAM_CHIP,
  ];

  if (HIRED_HUD_ELITE_GLAM_SLOTS.includes(slot)) {
    return dedupeHiredHudTileGlamChipsByEmoji([
      ...base,
      ...HIRED_HUD_ELITE_GLAM_EXTRA_CHIPS,
      ...(HIRED_HUD_SLOT_GLAM_EXTRA_CHIPS[slot] ?? []),
    ]);
  }

  const slotExtra = HIRED_HUD_SLOT_GLAM_EXTRA_CHIPS[slot] ?? [];
  if (slotExtra.length > 0) {
    return dedupeHiredHudTileGlamChipsByEmoji([...base, ...slotExtra]);
  }

  return dedupeHiredHudTileGlamChipsByEmoji(base);
}
