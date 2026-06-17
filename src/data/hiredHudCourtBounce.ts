/**
 * NBA court scale + 5-on-5 pickup config for the hub sim.
 */
export const HIRED_HUD_COURT_LENGTH_M = 28.65;
export const HIRED_HUD_COURT_WIDTH_M = 15.24;

export const HIRED_HUD_COURT_TEAM_SIZE = 5;

export const HIRED_HUD_COURT_TEAM_HOME_LABEL = "Sovereign" as const;
export const HIRED_HUD_COURT_TEAM_AWAY_LABEL = "Hangar" as const;

export type CourtTeamId = "home" | "away";

export type CourtFormationRole = "pg" | "sg" | "sf" | "pf" | "c";

export type CourtFormationSpot = {
  role: CourtFormationRole;
  x: number;
  y: number;
};

/** Left basket team — standard 5-out spacing (normalized court 0–1). */
export const HIRED_HUD_COURT_FORMATION_HOME: readonly CourtFormationSpot[] = [
  { role: "pg", x: 0.2, y: 0.5 },
  { role: "sg", x: 0.3, y: 0.24 },
  { role: "sf", x: 0.3, y: 0.76 },
  { role: "pf", x: 0.4, y: 0.34 },
  { role: "c", x: 0.4, y: 0.66 },
] as const;

export const HIRED_HUD_COURT_FORMATION_AWAY: readonly CourtFormationSpot[] =
  HIRED_HUD_COURT_FORMATION_HOME.map((spot) => ({
    role: spot.role,
    x: 1 - spot.x,
    y: spot.y,
  }));

/** Typical active movement (m/s). */
export const HIRED_HUD_PLAYER_WALK_MS = 1.6;
export const HIRED_HUD_PLAYER_JOG_MS = 3.6;
export const HIRED_HUD_PLAYER_RUN_MS = 5.1;
export const HIRED_HUD_PLAYER_SPRINT_MS = 6.8;

export const HIRED_HUD_BALL_DRIBBLE_MS = 4.4;
export const HIRED_HUD_BALL_PASS_PEAK_MS = 9.5;
export const HIRED_HUD_BALL_MIN_SPEED_MS = 2.2;

export const HIRED_HUD_COURT_TITLE = "Hangar pickup · 5 on 5" as const;
export const HIRED_HUD_COURT_KICKER = "Hub · Full court" as const;
export const HIRED_HUD_COURT_COPY =
  "Five vs five on a 94×50 ft floor — even rosters, live possession, jets running set spots." as const;

export function splitHiredUnitsIntoTeams<T>(units: readonly T[]): { home: T[]; away: T[] } {
  const home = units.slice(0, HIRED_HUD_COURT_TEAM_SIZE);
  const away = units.slice(HIRED_HUD_COURT_TEAM_SIZE, HIRED_HUD_COURT_TEAM_SIZE * 2);
  return { home, away };
}
