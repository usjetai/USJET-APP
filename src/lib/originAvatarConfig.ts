/**
 * Official Origin character — white/gold robotic pilot + USJET headset.
 * Primary presence is the Founder character video (exact armor / headphones).
 * Optional TalkingHead GLB only when VITE_ORIGIN_AVATAR_URL is set (viseme mesh).
 */

/** Official Origin android presence (white-and-gold armor + gold earcups). */
export const ORIGIN_CHARACTER_VIDEO = "/origin/origin-character.mp4";
export const ORIGIN_CHARACTER_POSTER = "/origin/origin-character-poster.png";
export const ORIGIN_CHARACTER_URL = "/origin/origin-character.png";
/** Side-profile reference (gold mesh earcups + segmented collar). */
export const ORIGIN_CHARACTER_PROFILE = "/origin/origin-character-profile.png";
export const ORIGIN_AVATAR_POSTER = ORIGIN_CHARACTER_POSTER;

/**
 * TalkingHead GLB (Origin 3D character with Mixamo rig + Oculus visemes).
 * Primary 3D avatar for real-time lip-sync via HeadAudio.
 */
export const ORIGIN_AVATAR_URL =
  (import.meta.env.VITE_ORIGIN_AVATAR_URL as string | undefined)?.trim() || "/origin/origin-avatar.glb";

export const ORIGIN_USE_TALKINGHEAD = Boolean(ORIGIN_AVATAR_URL);

export const ORIGIN_AVATAR_BODY = "F" as const;

/** Vendored HeadAudio worklet + English viseme model (met4citizen/HeadAudio). */
export const ORIGIN_HEADAUDIO_PROCESSOR = "/origin/headaudio/headworklet.mjs";
export const ORIGIN_HEADAUDIO_MODEL = "/origin/headaudio/model-en-mixed.bin";

/** Map conversational moods onto TalkingHead mood names. */
export const ORIGIN_MOOD_ALIASES: Record<string, string> = {
  focused: "neutral",
  curious: "happy",
  calm: "neutral",
  alert: "fear",
  warm: "love",
};
