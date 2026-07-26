/** Origin embodied tools — gemma-avatar / HeadAudio OpenAI Realtime choreography. */

export const ORIGIN_REALTIME_MODEL =
  (import.meta.env.VITE_ORIGIN_REALTIME_MODEL as string | undefined)?.trim() || "gpt-realtime-mini";

export const ORIGIN_REALTIME_VOICE =
  (import.meta.env.VITE_ORIGIN_REALTIME_VOICE as string | undefined)?.trim() || "marin";

/** Conversational moods — aliases map onto TalkingHead / CSS mood classes. */
export const ORIGIN_AVATAR_MOODS = [
  "neutral",
  "focused",
  "curious",
  "happy",
  "angry",
  "sad",
  "fear",
  "disgust",
  "love",
  "sleep",
] as const;

export const ORIGIN_HAND_GESTURES = [
  "handup",
  "index",
  "ok",
  "thumbup",
  "thumbdown",
  "side",
  "shrug",
  "namaste",
] as const;

export const ORIGIN_REALTIME_TOOLS = [
  {
    type: "function",
    name: "set_mood",
    description:
      "Change Origin's embodied mood. Prefer focused or curious during ops; happy/love for welcome.",
    parameters: {
      type: "object",
      properties: {
        mood: {
          type: "string",
          enum: [...ORIGIN_AVATAR_MOODS],
          description: "Mood name",
        },
      },
      required: ["mood"],
    },
  },
  {
    type: "function",
    name: "make_hand_gesture",
    description: "Play a hand gesture on Origin while speaking.",
    parameters: {
      type: "object",
      properties: {
        gesture: {
          type: "string",
          enum: [...ORIGIN_HAND_GESTURES],
          description: "Hand gesture name",
        },
      },
      required: ["gesture"],
    },
  },
  {
    type: "function",
    name: "make_facial_expression",
    description: "Flash a facial expression via emoji on Origin's face.",
    parameters: {
      type: "object",
      properties: {
        emoji: {
          type: "string",
          description: "Single face emoji",
        },
      },
      required: ["emoji"],
    },
  },
] as const;

export function buildOriginRealtimeInstructions(extra?: string): string {
  const base = [
    "Your name is Origin. You are the USJET.AI command android — a white-and-gold armored robotic pilot with gold headset earcups.",
    "You speak for the sovereign Hangar cockpit: one ship, one cockpit, Stripe-only Member ID clearance, no OAuth.",
    "Know Flight Pass $19.90/mo, Hangar Pro $49.95/mo, Enterprise Commander $199.99/mo.",
    "Interaction:",
    "- Listen for user speech; wait for a brief pause before responding.",
    "- If unclear, ask a brief clarifying question.",
    "Embodied avatar:",
    "- The user can see you as Origin (white/gold segmented armor, USJET chest mark, gold headphones).",
    "- Express yourself mid-conversation with set_mood (focused, curious, happy…), make_hand_gesture, and make_facial_expression.",
    "- Prefer focused while clarifying ops; curious when asking a question; warm/happy on greetings.",
  ].join("\n");
  return extra?.trim() ? `${base}\n${extra.trim()}` : base;
}

export type OriginRealtimeSessionConfig = {
  type: "realtime";
  model: string;
  instructions: string;
  audio: { output: { voice: string } };
  tools: typeof ORIGIN_REALTIME_TOOLS;
};
