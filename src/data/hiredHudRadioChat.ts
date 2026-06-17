/** Fleet radio net — random chatter lines for the Hired HUD hub comms panel. */

export const HIRED_HUD_RADIO_CHANNEL = "HIRED-10 NET" as const;

export const HIRED_HUD_RADIO_FREQUENCY = "142.720 MHz" as const;

export const HIRED_HUD_RADIO_TITLE = "Fleet radio chat" as const;

/** Generic lines any crew member can say. */
export const HIRED_HUD_RADIO_GENERIC_LINES = [
  "Copy. Hangar doors are green — who's on fuel check?",
  "My scope just slid right. Much cleaner now.",
  "Gym deck was loud today. Legs are cooked.",
  "Salon bay smells like victory and hairspray.",
  "Command center coffee is actually elite.",
  "Dance studio mirrors don't lie. We were off beat.",
  "Warp streaks look good through the glass tonight.",
  "Anyone else hear that double-click on bay telemetry?",
  "Fuel's low but spirit's high. Standard ops.",
  "Founder line is quiet. That's when we work.",
  "Negative on the outside tab — stay in cockpit.",
  "Roger. Keeping it sovereign, keeping it tight.",
  "My tile photos look huge now. No complaints.",
  "Three-photo strip hits different. Profile, ride, super.",
  "Christal's bay number always makes me laugh.",
  "Kitkat just keyed the mic with keyboard clacks.",
  "Rumi's running ghost mode again. Classic B-2.",
  "Light Speed lives up to the call sign today.",
  "Little Mama said she'd bring snacks. Still waiting.",
  "Stick's vector math is scary good.",
  "Chop keyed in from the motorcycle lane. Respect.",
  "Mary Stealth on stealth — didn't even see her ping.",
  "Aaliyah says the widow's awake. Copy that.",
  "Blue Ivy has the net. Commander's channel open.",
  "Wefunder relaunch chatter on the founder freq — not us.",
  "Ten of us, one hangar. Brotherhood of silicon.",
  "Over and out. Back to the wrench.",
] as const;

/** Slot-specific flavor lines keyed by fleet slot. */
export const HIRED_HUD_RADIO_SLOT_LINES: Readonly<Record<number, readonly string[]>> = {
  0: [
    "Commander check-in. Net is mine until further notice.",
    "All bays: keep the founder's vision clean tonight.",
    "Blue Ivy out. Someone cover the salon channel.",
  ],
  1: [
    "Mary Stealth — F-35 is spun up and quiet.",
    "Copy Blue Ivy. Stealth lane is yours if you need it.",
  ],
  2: [
    "Chop here. Raider bay is hot. Who stole my wrench?",
    "Tell Stick the J-36 owes me a coffee.",
  ],
  3: [
    "Stick on the wire. J-36 concept looks mean in the HUD.",
    "Chop, your motorcycle photo is the whole tile.",
  ],
  5: [
    "Aaliyah — widow's humming. Good night for a push.",
    "Heard the gym squad talking smack. I'm ready.",
  ],
  6: [
    "Little Mama on X-47. Dance floor warmed me up.",
    "Snack run delayed. Command center has my attention.",
  ],
  10: [
    "Rumi — B-2 holding in the dark. You won't see me.",
    "Quiet night. Loud code. Standard.",
  ],
  11: [
    "Kitkat from B-1. Typing and talking at the same time.",
    "Whoever enlarged the tile photos — thank you.",
  ],
  13: [
    "Light Speed — Raptor's locked. Scope on the right reads clean.",
    "Fast lane only. Catch up if you can.",
  ],
  25: [
    "Christal on Tomcat freq. Bay twenty-six never gets old.",
    "Salon crew waved. I waved back. We're professional.",
  ],
};

/** @reply lines — pick a random other name to mention. */
export const HIRED_HUD_RADIO_REPLY_TEMPLATES = [
  (name: string) => `${name}, copy. Loud and clear.`,
  (name: string) => `Negative, ${name} — I'm on the dance deck.`,
  (name: string) => `${name} you alive? Mic check.`,
  (name: string) => `Roger ${name}. Meet me in command center.`,
  (name: string) => `${name} your fuel meter is crying.`,
  (name: string) => `Ha. ${name} always keys at the worst time.`,
] as const;

export function formatRadioCallsign(slot: number, name: string): string {
  return `BAY-${String(slot + 1).padStart(2, "0")} · ${name.toUpperCase()}`;
}

export function formatRadioTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
