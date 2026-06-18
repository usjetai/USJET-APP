/** Medical HUD backdrop for hired-developer tiles on `/hired-hud`. */
export const HIRED_HUD_TILE_BG = "/hired-hud/developer-tile-hud-bg.png";

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
];
