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

/** All 30 bays are now assigned specific aircraft — no available positions in this roster update. */
export const FLEET_AVAILABLE_SLOTS: readonly number[] = [] as const;

/** All thirty fleet bays — 30 distinct US military aircraft. */
export const FLEET_HIRED_BY_SLOT: Record<number, FleetRosterMeta> = {
  // Stealth & Gen 6
  0: { rosterStatus: "hired", aircraftOfficialName: "SR-71 Blackbird", aircraftType: "darkstar" },
  1: { rosterStatus: "hired", aircraftOfficialName: "F-35 Lightning II", aircraftType: "f35" },
  2: { rosterStatus: "hired", aircraftOfficialName: "B-21 Raider", aircraftType: "b21" },
  3: { rosterStatus: "hired", aircraftOfficialName: "J-36 (US JET Concept)", aircraftType: "j36" },
  4: { rosterStatus: "hired", aircraftOfficialName: "NGAD Platform", aircraftType: "ngad" },
  // Experimental/Advanced
  5: { rosterStatus: "hired", aircraftOfficialName: "YF-23 Black Widow II", aircraftType: "yf23" },
  6: { rosterStatus: "hired", aircraftOfficialName: "X-47B", aircraftType: "x47b" },
  7: { rosterStatus: "hired", aircraftOfficialName: "X-37B", aircraftType: "x37b" },
  8: { rosterStatus: "hired", aircraftOfficialName: "X-51 Waverider", aircraftType: "x51" },
  9: { rosterStatus: "hired", aircraftOfficialName: "PCA (Penetrating Counter Air)", aircraftType: "pca" },
  // Strategic/Strike
  10: { rosterStatus: "hired", aircraftOfficialName: "B-2 Spirit", aircraftType: "b2" },
  11: { rosterStatus: "hired", aircraftOfficialName: "B-1 Lancer", aircraftType: "b1" },
  12: { rosterStatus: "hired", aircraftOfficialName: "A-12 Avenger II", aircraftType: "a12" },
  13: { rosterStatus: "hired", aircraftOfficialName: "F-22 Raptor", aircraftType: "f22" },
  14: { rosterStatus: "hired", aircraftOfficialName: "FB-22", aircraftType: "fb22" },
  // Tactical/Combat
  15: { rosterStatus: "hired", aircraftOfficialName: "F-15EX Eagle II", aircraftType: "f15ex" },
  16: { rosterStatus: "hired", aircraftOfficialName: "F-16V Viper", aircraftType: "f16v" },
  17: { rosterStatus: "hired", aircraftOfficialName: "F/A-18 Block III", aircraftType: "fa18" },
  18: { rosterStatus: "hired", aircraftOfficialName: "A-10 Warthog", aircraftType: "a10" },
  19: { rosterStatus: "hired", aircraftOfficialName: "F-117 Nighthawk", aircraftType: "f117" },
  // Unmanned/Wingman
  20: { rosterStatus: "hired", aircraftOfficialName: "MQ-25 Stingray", aircraftType: "mq25" },
  21: { rosterStatus: "hired", aircraftOfficialName: "MQ-28 Ghost Bat", aircraftType: "mq28" },
  22: { rosterStatus: "hired", aircraftOfficialName: "XQ-58 Valkyrie", aircraftType: "xq58" },
  23: { rosterStatus: "hired", aircraftOfficialName: "RQ-180", aircraftType: "rq180" },
  24: { rosterStatus: "hired", aircraftOfficialName: "RQ-4 Global Hawk", aircraftType: "globalHawk" },
  // Legacy/Heritage
  25: { rosterStatus: "hired", aircraftOfficialName: "F-14 Tomcat", aircraftType: "f14" },
  26: { rosterStatus: "hired", aircraftOfficialName: "F-4 Phantom II", aircraftType: "f4" },
  27: { rosterStatus: "hired", aircraftOfficialName: "F-104 Starfighter", aircraftType: "f104" },
  28: { rosterStatus: "hired", aircraftOfficialName: "F-86 Sabre", aircraftType: "f86" },
  29: { rosterStatus: "command", aircraftOfficialName: "X-59 QueSST · Command", aircraftType: "x59" },
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
