import { AI101_GLOSSARY_ENTRIES } from "./ai101Acronyms";
import { TELEMETRY_ACRONYM_ENTRIES } from "./telemetryAcronyms";
import type { Ai101GlossaryCore } from "./ai101GlossaryTypes";

export type LiveTerminalSegment =
  | { kind: "text"; value: string }
  | { kind: "acronym"; code: string; meaning: string };

const EXTRA_ACRONYMS: readonly Ai101GlossaryCore[] = [
  {
    code: "OPS",
    phrase: "Operations inbox",
    meaning: "ops@usjet.ai — sovereign routing for institutional and partnership correspondence.",
  },
  {
    code: "UPLINK",
    phrase: "Fleet uplink",
    meaning: "Live handshake channel after Protocol lock — fleet units stay synchronized to the Master Lock.",
  },
];

const MERGED = new Map<string, Ai101GlossaryCore>();

for (const entry of [...AI101_GLOSSARY_ENTRIES, ...TELEMETRY_ACRONYM_ENTRIES, ...EXTRA_ACRONYMS]) {
  MERGED.set(entry.code, entry);
}

/** Scrolling live comms strip — order tuned for cockpit readability. */
const TICKER_CODES = [
  "UPLINK",
  "USJET",
  "PROTO",
  "FLEET",
  "HANGAR",
  "INTEL",
  "COCKPIT",
  "BAY",
  "CLEAR",
  "TIER",
  "STRIPE",
  "MEMBER",
  "ORIGIN",
  "OPS",
  "SOS",
  "WRAP",
  "AURA",
  "MISSION",
  "SLOT",
] as const;

export function buildLiveTerminalSegments(): LiveTerminalSegment[] {
  const segments: LiveTerminalSegment[] = [
    { kind: "text", value: " SECURE CHANNEL LIVE · " },
  ];

  for (const code of TICKER_CODES) {
    const entry = MERGED.get(code);
    if (!entry) {
      continue;
    }
    segments.push({ kind: "acronym", code: entry.code, meaning: entry.meaning });
    segments.push({ kind: "text", value: " · " });
  }

  segments.push({ kind: "text", value: "HANDOFF STABLE · STANDING BY FOR COMMANDER ORDERS · " });
  return segments;
}

export const LIVE_TERMINAL_SEGMENTS = buildLiveTerminalSegments();
