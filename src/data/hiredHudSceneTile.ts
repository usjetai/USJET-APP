/** Group scene mosaic — one hub tile, four sovereign crew environments. */

export type HiredHudScenePanel = {
  slug: string;
  label: string;
  caption: string;
  path: string;
};

export const HIRED_HUD_SCENE_TILE_TITLE = "Sovereign crew environments" as const;

export const HIRED_HUD_SCENE_TILE_KICKER = "Hub · Group tile" as const;

export const HIRED_HUD_SCENE_TILE_COPY =
  "Salon, gym, dance floor, and command center — the hired fleet off-duty and on-mission together." as const;

export const HIRED_HUD_SCENE_PANELS: readonly HiredHudScenePanel[] = [
  {
    slug: "salon",
    label: "Style Bay",
    caption: "Salon hangar · crew grooming",
    path: "/hired-hud/scenes/salon.webp",
  },
  {
    slug: "gym",
    label: "Fleet Gym",
    caption: "Strength deck · daily grind",
    path: "/hired-hud/scenes/gym.webp",
  },
  {
    slug: "dance-studio",
    label: "Movement Lab",
    caption: "Dance studio · rhythm drill",
    path: "/hired-hud/scenes/dance-studio.webp",
  },
  {
    slug: "command-center",
    label: "Command Center",
    caption: "US JET ops · hangar live",
    path: "/hired-hud/scenes/command-center.webp",
  },
] as const;
