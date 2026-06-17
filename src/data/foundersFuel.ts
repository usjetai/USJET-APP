/** Founder's Fuel — $19.90/mo community sprint tier (maps to Flight Pass Stripe port). */

export const FOUNDERS_FUEL_GOAL = 50;
export const FOUNDERS_FUEL_PRICE_DISPLAY = "$19.90";
export const FOUNDERS_FUEL_STORAGE_KEY = "usjet-founders-fuel-supporters";
export const FOUNDERS_FUEL_BASE_SUPPORTERS = 12;

export const FOUNDERS_FUEL_VALUE_STACK = [
  "30-AI sovereign hangar — one cockpit, zero tab chaos",
  "Early Intel dashboard access — fleet telemetry & launch metrics",
  "Member ID issued on Stripe confirmation — unlock Hangar + Portal",
  "Fuel the next 15-hour dev sprint — code never stops when the fridge is full",
  "Cancel anytime — you're buying momentum, not a trap",
] as const;

export const FOUNDERS_FUEL_SOCIAL_PROOF = [
  { quote: "One click. I'm in the hangar.", attribution: "Operator · Queens" },
  { quote: "Finally — thirty AIs that answer to one roof.", attribution: "Fleet maintainer · Austin" },
  { quote: "Wrenches, not slides. Worth every $19.90.", attribution: "Shop foreman · Newark" },
] as const;

export const FOUNDERS_FUEL_ACTIVITY_CITIES = [
  "NYC",
  "Queens",
  "Brooklyn",
  "Austin",
  "Chicago",
  "Miami",
  "Atlanta",
  "Houston",
  "LA",
  "Phoenix",
  "Detroit",
  "Boston",
] as const;

export const FOUNDERS_FUEL_ACTIVITY_LABELS = [
  "just fueled the mission",
  "joined Founder's Fuel",
  "unlocked Flight Pass clearance",
  "fueled the dev sprint",
] as const;
