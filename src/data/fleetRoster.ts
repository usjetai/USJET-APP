import type { FleetAircraftType, FleetUnit } from "../types/fleet";

/** Hired developer bay vs open recruiting bay vs sovereign command. */
export type FleetRosterStatus = "hired" | "available" | "command";

export type FleetRosterMeta = {
  rosterStatus: FleetRosterStatus;
  /** Official US aircraft designation on runway cards and directory. */
  aircraftOfficialName: string;
  /** Fighter jet vector tier for hired/command (open bays use manifest aircraft). */
  aircraftType: FleetAircraftType;
};

/** Slot-specific official names (when emblem art differs from the bay’s aircraftType). */
const FLEET_SLOT_AIRCRAFT_NAME_OVERRIDES: Partial<Record<number, string>> = {
  /** Tile 24 — F-111 Aardvark emblem. */
  23: "F-111 Aardvark",
};

/** Official designations keyed by fleet aircraft vector — shared with runway + directory. */
export const AIRCRAFT_OFFICIAL_NAME_BY_TYPE: Record<FleetAircraftType, string> = {
  darkstar: "SR-71 Blackbird",
  f22: "F-22 Raptor",
  f35: "F-35 Lightning II",
  b21: "B-21 Raider",
  j36: "J-36 (US JET Concept)",
  ngad: "NGAD Platform",
  yf23: "YF-23 Black Widow II",
  x47b: "X-47B",
  x37b: "X-37B",
  x51: "X-51 Waverider",
  pca: "PCA",
  b2: "B-2 Spirit",
  b1: "B-1 Lancer",
  a12: "A-12 Avenger II",
  fb22: "FB-22C",
  f15ex: "F-15EX Eagle II",
  f16v: "F-16V Viper",
  fa18: "F/A-18 Super Hornet",
  a10: "A-10 Warthog",
  f117: "F-117 Nighthawk",
  mq25: "MQ-25 Stingray",
  mq28: "MQ-28 Ghost Bat",
  xq58: "XQ-58 Valkyrie",
  rq180: "RQ-180",
  globalHawk: "RQ-4 Global Hawk",
  f14: "F-14 Tomcat",
  f4: "F-4 Phantom II",
  f104: "F-104 Starfighter",
  f86: "F/A-XX",
  x59: "X-59 QueSST",
};

/** Ten sovereign hired developers + Origin command bay. */
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
  29: { rosterStatus: "command", aircraftOfficialName: "X-59 QueSST · Command", aircraftType: "x59" },
};

/** Open recruiting bays — every slot not hired or command. */
export const FLEET_AVAILABLE_SLOTS: readonly number[] = [
  4, 7, 8, 9, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28,
] as const;

export const FLEET_HIRED_SLOTS: readonly number[] = Object.keys(FLEET_HIRED_BY_SLOT)
  .map(Number)
  .filter((slot) => FLEET_HIRED_BY_SLOT[slot]?.rosterStatus === "hired")
  .sort((a, b) => a - b);

/** Runway stat — cleared hired bays plus Origin command. */
export const FLEET_RUNWAY_CLEARED_COUNT = Object.keys(FLEET_HIRED_BY_SLOT).length;

const AVAILABLE_SET = new Set<number>(FLEET_AVAILABLE_SLOTS);

export function getFleetRosterMeta(slot: number): FleetRosterMeta {
  const hired = FLEET_HIRED_BY_SLOT[slot];
  if (hired) {
    return hired;
  }
  return {
    rosterStatus: "available",
    aircraftOfficialName: "Available Position",
    aircraftType: "f4",
  };
}

export function isFleetBayHired(slot: number): boolean {
  return FLEET_HIRED_BY_SLOT[slot]?.rosterStatus === "hired";
}

/** Hired or Origin command — show real developer name on portal / runway. */
export function isFleetBayCleared(slot: number): boolean {
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
  const meta = getFleetRosterMeta(slot);
  if (meta.rosterStatus === "available") {
    return fallback;
  }
  return meta.aircraftType;
}

export function getFleetDisplayAircraftName(slot: number, fallbackType: FleetAircraftType): string {
  const slotName = FLEET_SLOT_AIRCRAFT_NAME_OVERRIDES[slot];
  if (slotName) {
    return slotName;
  }
  const meta = getFleetRosterMeta(slot);
  if (meta.rosterStatus !== "available") {
    return meta.aircraftOfficialName;
  }
  return AIRCRAFT_OFFICIAL_NAME_BY_TYPE[fallbackType] ?? meta.aircraftOfficialName;
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
