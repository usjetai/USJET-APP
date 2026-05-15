import { TELEMETRY_ACRONYMS, type TelemetryAcronym } from "./telemetryAcronyms";

/**
 * Single glossary shape for AI 101 and cross-links. Codes are uppercase letters only (no T.S.O.B. style).
 */
export type Ai101GlossaryEntry = TelemetryAcronym;

const PLATFORM_GLOSSARY: Ai101GlossaryEntry[] = [
  {
    code: "MP",
    fullName: "Mission Project",
    unit: "text",
    shortDescription:
      "Named container in Member Portal for runway work — assignments, notes, and fleet launches roll up under one project title so context does not scatter.",
  },
  {
    code: "FP",
    fullName: "Flight Pass",
    unit: "text",
    shortDescription:
      "Stripe clearance tier on USJET ($19.90/mo). Maps to bay limits and member-only routes — always tie the acronym back to the subscription you verified.",
  },
  {
    code: "HP",
    fullName: "Hangar Pro",
    unit: "text",
    shortDescription:
      "Stripe clearance tier ($49.95/mo). Unlocks Intel routes on top of Flight Pass — cite the tier, not a vague “pro” label.",
  },
  {
    code: "EC",
    fullName: "Enterprise Commander",
    unit: "text",
    shortDescription:
      "Stripe clearance tier ($199.99/mo). Top runway — includes Origin command when cleared — still Stripe-verified Member ID only.",
  },
  {
    code: "CS",
    fullName: "Customer Service (Origin entry)",
    unit: "text",
    shortDescription:
      "Origin can open in a limited customer-service path for support conversations. The query flag is the handle your bookmark carries — not a separate product.",
  },
  {
    code: "LVL",
    fullName: "Numeric clearance rank",
    unit: "text",
    shortDescription:
      "Access sentences may include LVL_01, LVL_02, LVL_03 style ranks. Treat them like crew badges: the number is the runway length you are cleared for.",
  },
];

/** Telemetry first (instrument strip), then platform shorthand. */
export const AI101_GLOSSARY_ENTRIES: Ai101GlossaryEntry[] = [
  ...TELEMETRY_ACRONYMS,
  ...PLATFORM_GLOSSARY,
];

/** @deprecated Use AI101_GLOSSARY_ENTRIES — kept for any external string grep */
export type Ai101AcronymRow = {
  acronym: string;
  expandsTo: string;
  context: string;
};

/** @deprecated Use AI101_GLOSSARY_ENTRIES */
export const AI101_ACRONYM_ROWS: Ai101AcronymRow[] = AI101_GLOSSARY_ENTRIES.map((row) => ({
  acronym: row.code,
  expandsTo: row.fullName,
  context: row.shortDescription,
}));
