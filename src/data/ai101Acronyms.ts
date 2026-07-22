import type { Ai101GlossaryCore } from "./ai101GlossaryTypes";

/** General AI + sovereign cockpit vocabulary for the public AI 101 deck. */
export const AI101_GLOSSARY_ENTRIES: readonly Ai101GlossaryCore[] = [
  { code: "AI", phrase: "Artificial intelligence", meaning: "Software that completes tasks from instructions; here hosted as named fleet units, not anonymous tabs." },
  { code: "FLEET", phrase: "Fleet runway", meaning: "The `/` grid of thirty partner bays launching through sovereign handoff instead of raw external links." },
  { code: "GATE", phrase: "Tier route gate", meaning: "Wrapper that blocks Hangar, Member, Intel, or Origin until Stripe clearance matches the route." },
  { code: "GUEST", phrase: "Guest clearance", meaning: "Rank 0 visitor who can open Fleet, SOS, cockpit handoff, and member login — not Hangar bays." },
  { code: "HANGAR", phrase: "Hangar workbench", meaning: "Paid `/hangar` surface where bays expand into cockpits with bay-count caps by tier." },
  { code: "HOST", phrase: "Partner host", meaning: "Domain string printed on each fleet card describing where the bay launches once wrapped." },
  { code: "INTEL", phrase: "Intel board", meaning: "Tier-2 `/intel` museum grid of monitors and reserved partnership bays — storytelling, not live brokerage APIs." },
  { code: "LLM", phrase: "Large language model", meaning: "Text model family behind conversational units; USJET keeps identity in the manifest, not scattered endpoints." },
  { code: "LVL", phrase: "Access level string", meaning: "Member record label (for example LVL_01) aligned with Hangar Pro / Enterprise naming in copy." },
  { code: "MEMBER", phrase: "Member Portal", meaning: "Tier-1 `/member` hub for Stripe verification, Founder Special checkout, and Mission Projects tracker." },
  { code: "NAV", phrase: "Primary navigation", meaning: "Liquid-glass capsule strip listing Fleet, Hangar, Intel, Origin, Member based on clearance." },
  { code: "ORIGIN", phrase: "Origin command", meaning: "Tier-3 `/origin` hardware narrative and fleet knowledge panels — separate from guest teaser routes." },
  { code: "PROMPT", phrase: "Operator prompt", meaning: "Instruction bundle copied from a bay; the One-Prompt Protocol text is the contract for that unit." },
  { code: "PROTO", phrase: "USJET protocol text", meaning: "Clipboard payload generated per unit so operators launch with consistent sovereign instructions." },
  { code: "SOS", phrase: "Site operating support", meaning: "Guest `/sos` calm-line checks for browser cache, Origin audio, and Stripe member ID recovery." },
  { code: "STRIPE", phrase: "Stripe verification", meaning: "Only payments processor: checkout links and Member ID issuance — no OAuth login path." },
  { code: "TIER", phrase: "Subscription tier", meaning: "Flight Pass, Hangar Pro, or Enterprise Commander pricing band that widens bay limits and Intel access." },
  { code: "USJET", phrase: "USJET.AI platform", meaning: "Sovereign cockpit product: fleet runway, hangar workbench, intel museum, and member telemetry in one shell." },
  { code: "WRAP", phrase: "Cockpit wrap", meaning: "Same-window iframe shell so partner destinations never spawn a surprise external tab leak." },
] as const;
