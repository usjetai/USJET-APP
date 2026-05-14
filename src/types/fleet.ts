export type FleetUnitStatus = "active" | "unlocking" | "locked" | "staging";

export type FleetAuraMode = "idle" | "listening" | "talking";

export type FleetAircraftType =
  | "sr71"
  | "f22"
  | "f35"
  | "b2"
  | "b52"
  | "c130"
  | "globalHawk"
  | "v22"
  | "cessna"
  | "bizjet";

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
