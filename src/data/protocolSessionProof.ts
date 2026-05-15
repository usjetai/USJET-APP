/** Protocol button colors — session proof (/protocol-proof). */

export const PROTOCOL_SESSION_PROOF_ROUTE = "/protocol-proof" as const;

export const PROTOCOL_SESSION_PROOF_TITLE = "Protocol red vs green — your proof of session" as const;

export const PROTOCOL_SESSION_PROOF_TAGLINE = "Browser memory · not a gimmick" as const;

export const PROTOCOL_SESSION_PROOF_INTRO =
  "The USJET Protocol button is a traffic light for this device. It tells you—in one glance—whether the site still remembers you, or whether you wiped the slate and need to arm the fleet again." as const;

export const PROTOCOL_SESSION_GREEN = {
  heading: "Green means you are still logged in on this device",
  body: "You already ran Protocol. Your browser kept the secure session (local storage and related site data). The warp, Fleet online, and Member access stay armed—you do not have to keep logging in every visit. That is a good thing. Do not clear cookies, cache, or site data unless you mean to sign out for real.",
} as const;

export const PROTOCOL_SESSION_RED = {
  heading: "Red means you cleared proof — or this is a fresh device",
  body: "The button only goes back to red if you cleared cookies, cache, site data, used a private window that forgets everything, or you are on a browser that never ran Protocol before. Red is clear proof the site does not recognize this device anymore. Tap Protocol to run the boot sequence and sign in again.",
} as const;

export const PROTOCOL_SESSION_WHY = [
  {
    heading: "Why we built it this way",
    body: "USJET is an operator console, not a disposable landing page. Remembering your session protects your Member ID, Stripe clearance, and Fleet online state so you are not fighting the login wall on every return.",
  },
  {
    heading: "What to clear — and what not to",
    body: "If you want a full reset: clear site data for usjet.ai in your browser settings, then reload. Expect red and a new Protocol run. If you want to stay signed in: leave site data alone. Green means the site still has you.",
  },
] as const;

export const PROTOCOL_SESSION_NOTE =
  "Sign-out inside the Member portal also resets Protocol for security. That is intentional—only a full browser wipe or a fresh device should surprise you with red." as const;

export const PROTOCOL_STANDBY_HOVER =
  "Red — storage was cleared or first visit. Tap to arm Protocol. Hover the ? chip or open Protocol proof for the full explanation." as const;

export const PROTOCOL_ARMED_HOVER =
  "Green — this device still remembers your session. Do not clear cookies if you want to stay logged in." as const;

export const PROTOCOL_PROOF_LINK_LABEL = "Why red or green?" as const;
