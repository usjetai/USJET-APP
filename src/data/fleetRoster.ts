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

/** Thirteen open bays — available positions only. */
export const FLEET_AVAILABLE_SLOTS: readonly number[] = [3, 6, 9, 13, 14, 15, 16, 17, 18, 21, 25, 26, 28] as const;

/** Seventeen hired developers (16 partner bays + command node), each with a US fighter vector. */
export const FLEET_HIRED_BY_SLOT: Record<number, FleetRosterMeta> = {
  0: { rosterStatus: "hired", aircraftOfficialName: "SR-71 Blackbird", aircraftType: "sr71" },
  1: { rosterStatus: "hired", aircraftOfficialName: "F-22 Raptor", aircraftType: "f22" },
  2: { rosterStatus: "hired", aircraftOfficialName: "F-35 Lightning II", aircraftType: "f35" },
  4: { rosterStatus: "hired", aircraftOfficialName: "F-15 Eagle", aircraftType: "f22" },
  5: { rosterStatus: "hired", aircraftOfficialName: "F/A-18 Super Hornet", aircraftType: "f35" },
  7: { rosterStatus: "hired", aircraftOfficialName: "X-15 Experimental", aircraftType: "sr71" },
  8: { rosterStatus: "hired", aircraftOfficialName: "SR-71B Trainer", aircraftType: "sr71" },
  10: { rosterStatus: "hired", aircraftOfficialName: "F-35A Lightning II", aircraftType: "f35" },
  11: { rosterStatus: "hired", aircraftOfficialName: "F-16 Fighting Falcon", aircraftType: "f35" },
  12: { rosterStatus: "hired", aircraftOfficialName: "F/A-18E Super Hornet", aircraftType: "f35" },
  19: { rosterStatus: "hired", aircraftOfficialName: "F-35C Carrier", aircraftType: "f35" },
  20: { rosterStatus: "hired", aircraftOfficialName: "A-10 Thunderbolt II", aircraftType: "f22" },
  22: { rosterStatus: "hired", aircraftOfficialName: "F-22 Raptor", aircraftType: "f22" },
  23: { rosterStatus: "hired", aircraftOfficialName: "YF-12 Interceptor", aircraftType: "sr71" },
  24: { rosterStatus: "hired", aircraftOfficialName: "F-35B STOVL", aircraftType: "f35" },
  27: { rosterStatus: "hired", aircraftOfficialName: "F-4 Phantom II", aircraftType: "f22" },
  29: { rosterStatus: "command", aircraftOfficialName: "F-22 Raptor · Command", aircraftType: "f22" },
};

export const FLEET_HIRED_SLOTS: readonly number[] = Object.keys(FLEET_HIRED_BY_SLOT).map(Number).sort(
  (a, b) => a - b,
);

export const FLEET_COMMAND_SLOT = 29 as const;

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
      aircraftType: "cessna",
    };
  }
  return {
    rosterStatus: "available",
    aircraftOfficialName: "Available Position",
    aircraftType: "cessna",
  };
}

export function isFleetBayHired(slot: number): boolean {
  const status = FLEET_HIRED_BY_SLOT[slot]?.rosterStatus;
  return status === "hired" || status === "command";
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

/** All seventeen hired developers with US fighter vectors and official aircraft names. */
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
