/**
 * Operational telemetry codes: uppercase, no periods between letters.
 * Values on the Mission Projects deck map to local member storage — never invent readings.
 */

export type TelemetryAcronym = {
  code: string;
  fullName: string;
  shortDescription: string;
  /** SI-style hint for instrument panels (ms, count, timestamp, text). */
  unit?: string;
  /** Future slot — no live metric wired yet. */
  reserved?: boolean;
};

export const TELEMETRY_ACRONYMS: TelemetryAcronym[] = [
  {
    code: "TSOB",
    fullName: "Time spent on browser",
    unit: "ms",
    shortDescription:
      "Cumulative Member Portal engagement when the tab is visible and the window has focus. Flushed on an interval with bounded slice length — proof-of-use, not Stripe billing or token metering.",
  },
  {
    code: "PFA",
    fullName: "Portal focus attributed",
    unit: "ms",
    shortDescription:
      "TSOB credited to this assignment while it is pinned for time tracking; zero until you pin and the portal stays visible and focused.",
  },
  {
    code: "FSC",
    fullName: "Focus segment count",
    unit: "count",
    shortDescription:
      "Number of recorded visible-focus slices (capped list) — each segment is one credited interval appended to usage history.",
  },
  {
    code: "LPA",
    fullName: "Last portal activity",
    unit: "timestamp",
    shortDescription:
      "ISO time of the last TSOB credit for this row (assignment when attributed, or project when logged at project scope).",
  },
  {
    code: "SFK",
    fullName: "Session fork count",
    unit: "count",
    shortDescription:
      "Count of fleet cockpit launches attributed to this assignment from the active Mission Project — parallel sessions burn continuity; this is the fork tally.",
  },
  {
    code: "MSI",
    fullName: "Mission subject intent",
    unit: "text",
    shortDescription:
      "Member-owned search / task line saved on the assignment (search intent) — the mission subject you declared.",
  },
  {
    code: "PCS",
    fullName: "Prompt call sign (Co-Pilot)",
    unit: "text",
    shortDescription:
      "Auto-derived Co-Pilot label paired with the fleet unit — the prompt-side handle for the assignment.",
  },
  {
    code: "MID",
    fullName: "Mission unit identifier",
    unit: "text",
    shortDescription:
      "Stable fleet unit id string for this assignment — ties the row to a single bay in the manifest.",
  },
  {
    code: "CSG",
    fullName: "Callsign",
    unit: "text",
    shortDescription:
      "Fleet callsign for the assigned unit — flight-deck shorthand from the manifest.",
  },
  {
    code: "SSV",
    fullName: "Save state",
    unit: "text",
    shortDescription:
      "Draft vs saved assignment: when saved, includes the committed timestamp in the mission log.",
  },
  {
    code: "RFS",
    fullName: "Recent focus segments",
    unit: "count",
    shortDescription:
      "Detail list of the newest attributed focus segments (duration + end time) shown under the assignment deck.",
  },
  {
    code: "VWS",
    fullName: "Views",
    unit: "count",
    shortDescription: "Reserved instrument code for a future page or panel view counter — not recorded yet.",
    reserved: true,
  },
  {
    code: "DLC",
    fullName: "Downloads",
    unit: "count",
    shortDescription: "Reserved instrument code for a future asset download tally — not recorded yet.",
    reserved: true,
  },
];

const map: Record<string, TelemetryAcronym> = {};
for (const row of TELEMETRY_ACRONYMS) {
  map[row.code] = row;
}

export const TELEMETRY_ACRONYM_BY_CODE: Readonly<Record<string, TelemetryAcronym>> = map;

export function telemetryAbbrTitle(row: TelemetryAcronym): string {
  const unit = row.unit ? ` (${row.unit})` : "";
  return `${row.fullName}${unit}. ${row.shortDescription}`;
}
