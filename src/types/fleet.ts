export type FleetUnitStatus = "active" | "unlocking" | "locked" | "staging";

export type FleetAuraMode = "idle" | "listening" | "processing" | "talking";

export type FleetAircraftType =
  // Stealth & Gen 6
  | "f22"
  | "f35"
  | "b21"
  | "j36"
  | "ngad"
  // Experimental/Advanced
  | "yf23"
  | "x47b"
  | "x37b"
  | "x51"
  | "pca"
  // Strategic/Strike
  | "b2"
  | "b1"
  | "a12"
  | "darkstar"
  | "fb22"
  // Tactical/Combat
  | "f15ex"
  | "f16v"
  | "fa18"
  | "a10"
  | "f117"
  // Unmanned/Wingman
  | "mq25"
  | "mq28"
  | "xq58"
  | "rq180"
  | "globalHawk"
  // Legacy/Heritage
  | "f14"
  | "f4"
  | "f104"
  | "f86"
  | "x59";

export type FleetInputMode = "text" | "voice" | "both";

export type FleetPlatform = "web" | "mac" | "windows" | "ios" | "android";

export type FleetCapabilities = {
  inputModes: FleetInputMode;
  platforms: FleetPlatform[];
};

export type FleetUnit = {
  id: string;
  slot: number;
  name: string;
  callsign: string;
  domain: string;
  href: string;
  status: FleetUnitStatus;
  aura: FleetAuraMode;
  aircraftType: FleetAircraftType;
  /** One-Prompt Protocol system instructions for this bay (derived in fleetManifest). */
  systemPrompt: string;
  /** Optional unit-specific fleet role line appended to the Master Lock. */
  fleetRole?: string;
};

export const HANGAR_COLUMNS = 6;
export const HANGAR_ROWS = 5;
export const FLEET_UNIT_COUNT = HANGAR_COLUMNS * HANGAR_ROWS;
