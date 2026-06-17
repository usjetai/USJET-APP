/** Member Portal entry — $5 deck (separate from Flight Pass / Hangar / Enterprise tiers). */

export const MEMBER_DECK_PRICE_DISPLAY = "$5.00" as const;

export const MEMBER_DECK_PERIOD = "/mo" as const;

export const MEMBER_DECK_STRIPE_METADATA = {
  tier: "MEMBER",
  access_level: "LVL_00_MEMBER",
} as const;

export const MEMBER_DECK_FEATURES = [
  "Member Portal — your AI data board",
  "Fleet usage telemetry & project tracker",
  "Member vitals + clearance ladder inside the portal",
] as const;

export const MEMBER_DECK_HOOK =
  "Unlock the Member Portal and member tools. Upgrade inside to Flight Pass, Hangar Pro, or Enterprise when you need more bays." as const;
