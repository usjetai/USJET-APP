/** USJET Gamer-AI Development Portal — VR + fleet operators. */

export const GAMING_ROUTE = "/gaming" as const;
export const VR_ROUTE = "/vr" as const;
export const GAMERS_ROUTE = "/gamers" as const;

/** Shared VR headset asset — header, footer, and game page hero */
export const GAMING_VR_ICON_SRC = "/gaming/vr-headset-icon.svg" as const;

export const GAMING_PAGE_TITLE = "Gamer-AI" as const;

export const GAMING_HEADLINE = "Gamers: The New Industrial Architects." as const;

export const GAMING_LEDE =
  "Playing games is for leisure. Building them is for Legacy. USJET.AI is integrating high-fidelity AI logic with VR development to build the next generation of industrial training and entertainment." as const;

export const GAMING_CONCEPT_TITLE = "The Development Hangar" as const;

export const GAMING_CONCEPT_COPY =
  "USJET is the Development Hangar where gamers stop playing for points and start playing for equity. VR + AI are the same engine now — spatial intelligence meets the 30-agent fleet." as const;

export const GAMING_VR_AI_TITLE = "Why AI is the Backbone of VR" as const;

export const GAMING_VR_AI_PILLARS = [
  {
    id: "worlds",
    title: "Dynamic world building",
    body: "AI generates infinite VR environments without manual coding — landscapes, interiors, and mission geometry on demand.",
  },
  {
    id: "physics",
    title: "Predictive physics",
    body: "AI agents manage spatial interactions and collision logic to cut latency and keep motion believable in-headset.",
  },
  {
    id: "npcs",
    title: "Intelligent NPCs",
    body: "30-agent fleet logic applied to VR characters that do not follow a script — they react to the player in real time.",
  },
] as const;

export const GAMER_FOUNDER_KIT_PRICE = "$99" as const;

export const GAMER_FOUNDER_KIT_TITLE = "Gamer-Founder Kit" as const;

export const GAMER_FOUNDER_KIT_HOOK =
  "Entry clearance for the gaming community — blueprints, operator manual, and the Gamer-to-Operator transition path." as const;

export const GAMER_FOUNDER_KIT_FEATURES = [
  "USJET VR-AI development blueprints (Volume I)",
  "Gamer-to-Operator transition manual",
  "Hangar orientation — pilot the 30-agent fleet",
  "Signal access when the VR portal expands",
] as const;

/** In-page anchors — VR icon and toolbar jump links */
export const GAMING_ANCHOR_MANIFESTO = "gaming-legacy-manifesto" as const;
export const GAMING_ANCHOR_PIPELINE = "gaming-wealth-pipeline" as const;
export const GAMING_ANCHOR_DIRECTIVE = "gaming-anti-crime-directive" as const;
export const GAMING_ANCHOR_HANGAR = "gaming-hangar-live" as const;
export const GAMING_ANCHOR_PILLARS = "gaming-vr-ai" as const;
export const GAMING_ANCHOR_KIT = "gaming-founder-kit" as const;
export const GAMING_ANCHOR_PROOF = "gaming-proof-bay" as const;

export const GAMING_PORTAL_JUMPS = [
  { id: GAMING_ANCHOR_MANIFESTO, label: "Manifesto" },
  { id: GAMING_ANCHOR_PIPELINE, label: "Pipeline" },
  { id: GAMING_ANCHOR_HANGAR, label: "Live Hangar" },
  { id: GAMING_ANCHOR_PROOF, label: "TikTok Proof" },
  { id: GAMING_ANCHOR_KIT, label: "Founder Key $99" },
] as const;

/** TikTok proof bay — @usjetnyc (pinned clip: video 7558822587023854862) */
export const GAMING_TIKTOK_POST_ID = "7558822587023854862" as const;
export const GAMING_TIKTOK_POST_KIND = "video" as const;
export const GAMING_TIKTOK_USERNAME = "@usjetnyc" as const;
export const GAMING_TIKTOK_PROFILE_URL = "https://www.tiktok.com/@usjetnyc" as const;
export const GAMING_TIKTOK_PROFILE_EMBED_URL = "https://www.tiktok.com/@usjetnyc?refer=embed" as const;
export const GAMING_TIKTOK_POST_URL =
  `https://www.tiktok.com/@usjetnyc/video/${GAMING_TIKTOK_POST_ID}` as const;
export const GAMING_TIKTOK_HASHTAG = "#usa" as const;
export const GAMING_TIKTOK_HASHTAG_URL = "https://www.tiktok.com/tag/usa?refer=embed" as const;
/** Footer link — music/title come from TikTok’s player; this points at the same clip. */
export const GAMING_TIKTOK_MUSIC_LABEL = "♬ Full caption + audio on TikTok" as const;
export const GAMING_TIKTOK_MUSIC_URL = GAMING_TIKTOK_POST_URL;
/** @deprecated Use GAMING_TIKTOK_POST_ID */
export const GAMING_TIKTOK_VIDEO_ID = GAMING_TIKTOK_POST_ID;
/** @deprecated Use GAMING_TIKTOK_POST_URL */
export const GAMING_TIKTOK_VIDEO_URL = GAMING_TIKTOK_POST_URL;
export const GAMING_TIKTOK_CAPTION = `${GAMING_TIKTOK_HASHTAG} · ${GAMING_TIKTOK_MUSIC_LABEL}` as const;
/** @deprecated Use GAMING_TIKTOK_MUSIC_LABEL */
export const GAMING_TIKTOK_TRACK = GAMING_TIKTOK_MUSIC_LABEL;

/** @deprecated Silent Hangar Protocol handles audio — see silentHangar.ts */
export const GAMING_AUDIO_ENABLED = true;

export const GAMING_SOUND_OFF = "Sound off — tap the glass control" as const;
export const GAMING_SOUND_ON = "Sound armed — Captain's order received" as const;

/** Twitch live bay — https://www.twitch.tv/usjetny */
export const GAMING_TWITCH_CHANNEL = "usjetny" as const;
export const GAMING_TWITCH_URL = "https://www.twitch.tv/usjetny" as const;
export const GAMING_TWITCH_DISPLAY = "@usjetny" as const;
export const GAMING_TWITCH_TAGLINE = "Twitch live · USJET NYC deck" as const;

/** X fleet signal — canonical profile */
export const GAMING_X_URL = "https://x.com/usajet" as const;
/** Visible short URL on gaming CTAs (no scheme — matches browser bar) */
export const GAMING_X_WEB = "x.com/usajet" as const;
/** Legacy alias — prefer GAMING_X_WEB in new copy */
export const GAMING_X_DISPLAY = GAMING_X_WEB;

/** Twitch highlight clip — Hangar Cam replay */
export const GAMING_TWITCH_CLIP_SLUG = "FrailDeadCormorantRitzMitz-MX5OQJSNZ3T8LPg1" as const;
export const GAMING_TWITCH_CLIP_URL =
  `https://www.twitch.tv/${GAMING_TWITCH_CHANNEL}/clip/${GAMING_TWITCH_CLIP_SLUG}` as const;
export const GAMING_TWITCH_CLIP_LABEL = "Hangar highlight · technical proof" as const;

/** Hash link to live deck on the game page */
export function gamingHangarHashLink(): string {
  return `${GAMING_ROUTE}#${GAMING_ANCHOR_HANGAR}`;
}
