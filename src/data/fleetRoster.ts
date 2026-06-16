import type { FleetAircraftType, FleetUnit } from "../types/fleet";

/** Hired developer bay vs open recruiting bay vs sovereign command. */
export type FleetRosterStatus = "hired" | "available" | "command";

export type FleetRosterMeta = {
  rosterStatus: FleetRosterStatus;
  /** Official US aircraft designation on runway cards and directory. */
  aircraftOfficialName: string;
  /** Fighter jet vector tier for hired/command (open bays use light GA placeholder). */
  aircraftType: FleetAircraftType;
};

/** Non-hired bays remain openly available for recruiting. */
export const FLEET_AVAILABLE_SLOTS: readonly number[] = [
  4, 7, 8, 9, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29,
] as const;

/** Exact hired developer roster (10 names) plus assigned aircraft designations. */
export const FLEET_HIRED_BY_SLOT: Record<number, FleetRosterMeta> = {
  0: { rosterStatus: "hired", aircraftOfficialName: "SR-71 Blackbird", aircraftType: "darkstar" },
  1: { rosterStatus: "hired", aircraftOfficialName: "F-35 Lightning II", aircraftType: "f35" },
  2: { rosterStatus: "hired", aircraftOfficialName: "B-21 Raider", aircraftType: "b21" },
  3: { rosterStatus: "hired", aircraftOfficialName: "J-36 (US JET Concept)", aircraftType: "j36" },
  5: { rosterStatus: "hired", aircraftOfficialName: "YF-23 Black Widow II", aircraftType: "yf23" },
  6: { rosterStatus: "hired", aircraftOfficialName: "X-47B", aircraftType: "x47b" },
  10: { rosterStatus: "hired", aircraftOfficialName: "B-2 Spirit", aircraftType: "b2" },
  11: { rosterStatus: "hired", aircraftOfficialName: "B-1 Lancer", aircraftType: "b1" },
  13: { rosterStatus: "hired", aircraftOfficialName: "F-22 Raptor", aircraftType: "f22" },
  25: { rosterStatus: "hired", aircraftOfficialName: "F-14 Tomcat", aircraftType: "f14" },
};

export const FLEET_HIRED_SLOTS: readonly number[] = Object.keys(FLEET_HIRED_BY_SLOT).map(Number).sort(
  (a, b) => a - b,
);

const AVAILABLE_SET = new Set<number>(FLEET_AVAILABLE_SLOTS);

export function getFleetRosterMeta(slot: number): FleetRosterMeta {
  const hired = FLEET_HIRED_BY_SLOT[slot];
  if (hired) {
    return hired;
  }
  if (AVAILABLE_SET.has(slot)) {
    return {
      rosterStatus: "available",
      aircraftOfficialName: "Available Position",
      aircraftType: "f4",
    };
  }
  return {
    rosterStatus: "available",
    aircraftOfficialName: "Available Position",
    aircraftType: "f4",
  };
}

export function isFleetBayHired(slot: number): boolean {
  const status = FLEET_HIRED_BY_SLOT[slot]?.rosterStatus;
  return status === "hired";
}

export function isFleetBayAvailable(slot: number): boolean {
  return AVAILABLE_SET.has(slot);
}

export function getHiredDeveloperUnits(units: FleetUnit[]): FleetUnit[] {
  return FLEET_HIRED_SLOTS.map((slot) => units.find((u) => u.slot === slot)).filter(
    (u): u is FleetUnit => Boolean(u),
  );
}

export function getAvailablePositionUnits(units: FleetUnit[]): FleetUnit[] {
  return units.filter((unit) => isFleetBayAvailable(unit.slot));
}

export function getFleetDisplayAircraftType(slot: number, fallback: FleetAircraftType): FleetAircraftType {
  return getFleetRosterMeta(slot).aircraftType ?? fallback;
}

export function getFleetDisplayAircraftName(slot: number): string {
  return getFleetRosterMeta(slot).aircraftOfficialName;
}

export const FLEET_HIRED_COUNT = FLEET_HIRED_SLOTS.length;
export const FLEET_AVAILABLE_COUNT = FLEET_AVAILABLE_SLOTS.length;

export type HiredDeveloperRecord = {
  slot: number;
  bay: string;
  name: string;
  callsign: string;
  domain: string;
  aircraftOfficialName: string;
  aircraftType: FleetAircraftType;
  rosterStatus: "hired" | "command";
};

/** Exact hired developer list with US fighter vectors and official aircraft names. */
export function buildHiredDeveloperRoster(units: FleetUnit[]): HiredDeveloperRecord[] {
  return FLEET_HIRED_SLOTS.map((slot) => {
    const unit = units.find((u) => u.slot === slot);
    if (!unit) {
      throw new Error(`Missing fleet unit for hired slot ${slot}`);
    }
    const meta = FLEET_HIRED_BY_SLOT[slot]!;
    return {
      slot,
      bay: String(slot + 1).padStart(2, "0"),
      name: unit.name,
      callsign: unit.callsign,
      domain: unit.domain,
      aircraftOfficialName: meta.aircraftOfficialName,
      aircraftType: meta.aircraftType,
      rosterStatus: meta.rosterStatus === "command" ? "command" : "hired",
    };
  });
}
