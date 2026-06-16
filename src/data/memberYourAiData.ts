/** Member portal — Your AI Data section copy. */

export const MEMBER_YOUR_AI_DATA_TITLE = "Your AI Data" as const;

export const MEMBER_YOUR_AI_DATA_KICKER = "Fleet telemetry" as const;

export const MEMBER_YOUR_AI_DATA_LEDE =
  "Browser launches and mission time logged on this device for your signed-in session — ranked by activity, capped by your clearance Flight Pass window." as const;

export const MEMBER_YOUR_AI_DATA_EMPTY =
  "No fleet usage logged yet. Open a bay from Hangar or Intel while signed in — your data will rank here automatically." as const;

export const MEMBER_YOUR_AI_DATA_IDLE_NOTE = (idle: number) =>
  `${idle} unit${idle === 1 ? "" : "s"} on roster with no activity this window.` as const;
