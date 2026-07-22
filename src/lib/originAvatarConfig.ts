/**
 * Origin stage character — Founder android (video presence + still fallback).
 */
export const ORIGIN_CHARACTER_VIDEO = "/origin/origin-character.mp4";
export const ORIGIN_CHARACTER_POSTER = "/origin/origin-character-poster.png";
export const ORIGIN_CHARACTER_URL = "/origin/origin-character.png";

export const ORIGIN_AVATAR_URL =
  (import.meta.env.VITE_ORIGIN_AVATAR_URL as string | undefined)?.trim() ||
  "/origin/origin-avatar.glb";

export const ORIGIN_AVATAR_BODY = "F" as const;

/** Hangar / reduced-motion still — prefers the video poster. */
export const ORIGIN_AVATAR_POSTER = ORIGIN_CHARACTER_POSTER;
