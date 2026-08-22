/** Protocol button colors — session proof (/protocol-proof). */

export const PROTOCOL_SESSION_PROOF_ROUTE = "/protocol-proof" as const;

export const PROTOCOL_SESSION_PROOF_TITLE = "Protocol red vs green — your proof of session" as const;

export const PROTOCOL_SESSION_PROOF_TAGLINE = "Browser memory · not a gimmick" as const;

export const PROTOCOL_SESSION_PROOF_INTRO =
  "This is a leftover session-light page from an earlier version of the site. Green means this browser still has local site data. Red means it does not. It is not a product you buy." as const;

export const PROTOCOL_SESSION_GREEN = {
  heading: "Green means this browser still has site data",
  body: "Your browser kept local storage for usjet.ai. You do not need this page to buy a computer. Do not clear cookies unless you mean to wipe local site data.",
} as const;

export const PROTOCOL_SESSION_RED = {
  heading: "Red means this is a fresh device, or data was cleared",
  body: "Cookies, cache, a private window, or a first visit can show red. That is only a local-storage light. Shop Homes and Business without it.",
} as const;

export const PROTOCOL_SESSION_WHY = [
  {
    heading: "Why this page still exists",
    body: "It is leftover chrome. The shop is computers and books. This URL is kept so old bookmarks do not break.",
  },
  {
    heading: "What to clear — and what not to",
    body: "If you want a full reset: clear site data for usjet.ai in your browser settings, then reload. If you are shopping: leave this page and go to Homes.",
  },
] as const;

export const PROTOCOL_SESSION_NOTE =
  "You do not need a monthly subscription or a member portal to buy an Operator's Rig." as const;

export const PROTOCOL_STANDBY_HOVER =
  "Red — storage was cleared or first visit. Tap to arm Protocol. Hover the ? chip or open Protocol proof for the full explanation." as const;

export const PROTOCOL_ARMED_HOVER =
  "Green — this device still remembers your session. Do not clear cookies if you want to stay logged in." as const;

export const PROTOCOL_PROOF_LINK_LABEL = "Why red or green?" as const;
