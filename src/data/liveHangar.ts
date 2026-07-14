/** USJET Live Hangar — Twitch glass hangar cam strategy. */

import { GAMING_TWITCH_URL, GAMING_X_URL } from "./gamingPortal";

export { GAMING_TWITCH_URL };

export type HangarLiveChatResource =
  | { label: string; hint: string; to: string }
  | { label: string; hint: string; href: string };
export const HANGAR_LIVE_NAV_LABEL = "LIVE: Hangar Operations" as const;

export const HANGAR_LIVE_NAV_SHORT = "LIVE" as const;

export const HANGAR_LIVE_SECTION_TITLE = "USJET Live Hangar" as const;

export const HANGAR_LIVE_TWITCH_HOOK =
  "Watch the Fleet on Twitch Hangar Cam — raw AI orchestration. Instagram bay for Lives/replays. X for fast signal drops." as const;

export const HANGAR_LIVE_CHAT_TITLE = "Live chat bridge" as const;

export const HANGAR_LIVE_CHAT_LEDE =
  "Ask technical questions in Twitch chat — AI 101 flight school, the Developer Code Kit, or what you see live in Cursor." as const;

export const HANGAR_LIVE_CHAT_RESOURCES: readonly HangarLiveChatResource[] = [
  { label: "AI 101 Flight School", to: "/ai-101", hint: "Cockpit calibration & fleet literacy" },
  { label: "Developer Code Kit", to: "/code-kit", hint: "Production engine · $499 passport" },
  { label: "Enter Hangar", to: "/", hint: "30-agent fleet bays" },
  { label: "X · live signals", href: GAMING_X_URL, hint: "x.com/usajet · launches, drops, live notes" },
];

export const HANGAR_LIVE_FUEL_KICKER = "Fuel the stream" as const;

export const HANGAR_LIVE_FUEL_COPY =
  "Enjoying the live build? Direct fuel keeps the lights on in the Hangar. Send support to $USJET." as const;
