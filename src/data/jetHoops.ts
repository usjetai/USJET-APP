/** Jet Hoops — 5-on-5 court constants & roster split. */

import { getFleetRosterMeta } from "./fleetRoster";
import { getFleetAircraftRadarLogoPathForSlot } from "../lib/fleetAircraftLogos";

export const JET_HOOPS_ROUTE = "/hoops" as const;

export const JET_HOOPS_COURT_WIDTH = 940;
export const JET_HOOPS_COURT_HEIGHT = 500;

export const JET_HOOPS_TITLE = "Jet Hoops" as const;
export const JET_HOOPS_KICKER = "Hangar pickup · 5-on-5" as const;
export const JET_HOOPS_COPY =
  "Click a jet to select it (green glow). With one selected, click a teammate to pass — the ball flies on an arc. Five blue vs five red on regulation NBA hardwood." as const;

export type JetHoopsTeamId = "blue" | "red";

export type JetHoopsRole = "pg" | "sg" | "sf" | "pf" | "c";

export type JetHoopsRosterEntry = {
  slot: number;
  label: string;
  team: JetHoopsTeamId;
  role: JetHoopsRole;
};

/** Even 5v5 split across the ten sovereign hired bays. */
export const JET_HOOPS_ROSTER: readonly JetHoopsRosterEntry[] = [
  { slot: 0, label: "Blue Ivy", team: "blue", role: "pg" },
  { slot: 1, label: "Mary Stealth", team: "red", role: "pg" },
  { slot: 2, label: "Chop", team: "blue", role: "sg" },
  { slot: 3, label: "Stick", team: "red", role: "sg" },
  { slot: 5, label: "Aaliyah", team: "blue", role: "sf" },
  { slot: 6, label: "Little Mama", team: "red", role: "sf" },
  { slot: 10, label: "Rumi", team: "blue", role: "pf" },
  { slot: 11, label: "Kitkat", team: "red", role: "pf" },
  { slot: 13, label: "Light Speed", team: "blue", role: "c" },
  { slot: 25, label: "Christal", team: "red", role: "c" },
] as const;

/** Spawn offsets from team basket (blue=left, red=right). */
export const JET_HOOPS_ROLE_OFFSETS: Record<JetHoopsRole, { x: number; y: number }> = {
  pg: { x: 118, y: 0 },
  sg: { x: 88, y: -78 },
  sf: { x: 88, y: 78 },
  pf: { x: 48, y: -48 },
  c: { x: 48, y: 48 },
};

export const JET_HOOPS_TEAM_STYLES: Record<
  JetHoopsTeamId,
  { label: string; ring: string; glow: string; badge: string }
> = {
  blue: {
    label: "Blue Fleet",
    ring: "rgb(56 189 248 / 0.95)",
    glow: "rgb(14 165 233 / 0.45)",
    badge: "rgb(8 47 73 / 0.92)",
  },
  red: {
    label: "Red Fleet",
    ring: "rgb(248 113 113 / 0.95)",
    glow: "rgb(239 68 68 / 0.45)",
    badge: "rgb(69 10 10 / 0.92)",
  },
};

/** NBA-paced movement (court units per second). */
export const JET_HOOPS_WALK = 95;
export const JET_HOOPS_JOG = 210;
export const JET_HOOPS_RUN = 300;
export const JET_HOOPS_SPRINT = 390;
export const JET_HOOPS_PLAYER_ACCEL = 680;
export const JET_HOOPS_BALL_DRIBBLE = 250;
export const JET_HOOPS_BALL_PASS = 520;
export const JET_HOOPS_BALL_RADIUS = 10;
export const JET_HOOPS_PLAYER_RADIUS = 22;

/** Radar jet sprite for a hired bay on the hardwood. */
export function getJetHoopsSpritePath(slot: number): string {
  const meta = getFleetRosterMeta(slot);
  return getFleetAircraftRadarLogoPathForSlot(slot, meta.aircraftType);
}
