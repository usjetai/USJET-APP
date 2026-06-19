/**
 * Roster metadata for fleet tee interior designs — mirrors hiredHudDeveloperAvatars + fleetManifest domains.
 */
export const HIRED_DEVELOPER_BY_AIRCRAFT_SLUG = {
  "sr-71-blackbird": {
    developerName: "Blue Ivy",
    portrait: "/fleet/developer-avatars/sr-71-blackbird.webp",
  },
  "f-35-lightning-ii": {
    developerName: "Mary Stealth",
    portrait: "/fleet/developer-avatars/f-35-lightning-ii.webp",
  },
  "b-21-raider": {
    developerName: "Chop",
    portrait: "/fleet/developer-avatars/b-21-raider.webp",
  },
  "j-36": {
    developerName: "Stick",
    portrait: "/fleet/developer-avatars/j-36.webp",
  },
  "yf-23-black-widow-ii": {
    developerName: "Aaliyah",
    portrait: "/fleet/developer-avatars/yf-23-black-widow-ii.webp",
  },
  "x-47b": {
    developerName: "Little Mama",
    portrait: "/fleet/developer-avatars/x-47b.webp",
  },
  "f-22-raptor": {
    developerName: "Light Speed",
    portrait: "/fleet/developer-avatars/f-22-raptor.webp",
  },
  "b-1-lancer": {
    developerName: "Kitkat",
    portrait: "/fleet/developer-avatars/b-1-lancer.webp",
  },
  "b-2-spirit": {
    developerName: "Rumi",
    portrait: "/fleet/developer-avatars/b-2-spirit.webp",
  },
  "f-14-tomcat": {
    developerName: "Christal",
    portrait: "/fleet/developer-avatars/f-14-tomcat.webp",
  },
};

/** AI workstation domain per aircraft product slug — from `fleetManifest.ts` `domain` field. */
export const AI_DOMAIN_BY_AIRCRAFT_SLUG = {
  "sr-71-blackbird": "gemini.google.com",
  "f-35-lightning-ii": "chatgpt.com",
  "b-21-raider": "claude.ai",
  "j-36": "perplexity.ai",
  "ngad-platform": "grok.com",
  "yf-23-black-widow-ii": "cursor.com",
  "x-47b": "midjourney.com",
  "x-37b": "lumalabs.ai",
  "x-51-waverider": "chatgpt.com",
  pca: "higgsfield.ai",
  "b-2-spirit": "runway.com",
  "b-1-lancer": "leonardo.ai",
  "a-12-avenger-ii": "firefly.adobe.com",
  "f-22-raptor": "gemini.google.com",
  "fb-22": "bfl.ai",
  "f-15ex-eagle-ii": "suno.com",
  "f-16v-viper": "elevenlabs.io",
  "f-a-18-block-iii": "play.ht",
  "a-10-warthog": "synthesia.io",
  "f-117-nighthawk": "heygen.com",
  "mq-25-stingray": "v0.dev",
  "mq-28-ghost-bat": "replit.com/refer/USJET",
  "xq-58-valkyrie": "github.com",
  "rq-180": "consensus.app",
  "rq-4-global-hawk": "gamma.app",
  "f-14-tomcat": "notion.so",
  "f-4-phantom-ii": "jasper.ai",
  "f-104-starfighter": "otter.ai",
  "f-86-sabre": "chat.deepseek.com",
  "x-59-quesst": "usjet.ai/origin",
};

export function resolveTeeCrew(aircraftSlug) {
  const hired = HIRED_DEVELOPER_BY_AIRCRAFT_SLUG[aircraftSlug];
  const aiDomain = AI_DOMAIN_BY_AIRCRAFT_SLUG[aircraftSlug] ?? "usjet.ai";

  if (hired) {
    return {
      developerName: hired.developerName,
      aiDomain,
      portrait: hired.portrait,
      hasPortrait: true,
    };
  }

  return {
    developerName: null,
    aiDomain,
    portrait: null,
    hasPortrait: false,
  };
}
