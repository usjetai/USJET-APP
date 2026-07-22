import type { FleetAircraftType } from "../types/fleet";

/** Canonical aircraft emblem paths — shared by fleet tiles, Jet Fighter pages, and product pages. */
export const FLEET_AIRCRAFT_LOGO_PATHS: Record<FleetAircraftType, string> = {
  f22: "/assets/fleet-logos/f22_raptor.png",
  f35: "/assets/fleet-logos/f35_lightning_ii.png",
  b21: "/assets/fleet-logos/b21_raider.png",
  j36: "/assets/fleet-logos/j36_fighter.png",
  ngad: "/assets/fleet-logos/ngad_platform.png",
  yf23: "/assets/fleet-logos/yf23_black_widow_ii.png",
  x47b: "/assets/fleet-logos/x47b.png",
  x37b: "/assets/fleet-logos/x37b.png",
  x51: "/assets/fleet-logos/x51_waverider.png",
  pca: "/assets/fleet-logos/pca_aircraft.png",
  b2: "/assets/fleet-logos/b2_spirit.png",
  b1: "/assets/fleet-logos/b1_lancer.png",
  a12: "/assets/fleet-logos/a12_avenger_ii.png",
  darkstar: "/assets/fleet-logos/sr72_darkstar.png",
  fb22: "/assets/fleet-logos/fb22.png",
  f15ex: "/assets/fleet-logos/f15ex_eagle_ii.png",
  f16v: "/assets/fleet-logos/f16v_viper.png",
  fa18: "/assets/fleet-logos/fa18_super_hornet.png",
  a10: "/assets/fleet-logos/a10_warthog.png",
  f117: "/assets/fleet-logos/f117_nighthawk.png",
  mq25: "/assets/fleet-logos/mq25_stingray.png",
  mq28: "/assets/fleet-logos/mq28_ghost_bat.png",
  xq58: "/assets/fleet-logos/xq58_valkyrie.png",
  rq180: "/assets/fleet-logos/rq180.png",
  globalHawk: "/assets/fleet-logos/rq4_global_hawk.png",
  f14: "/assets/fleet-logos/f14_tomcat.png",
  f4: "/assets/fleet-logos/f4_phantom_ii.png",
  f104: "/assets/fleet-logos/f104_starfighter.png",
  f86: "/assets/fleet-logos/fa_xx.png",
  x59: "/assets/fleet-logos/x59_quesst.png",
};

/** Slot-specific emblem overrides (e.g. SR-71 bay uses dedicated Blackbird art). */
const FLEET_SLOT_LOGO_OVERRIDES: Partial<Record<number, string>> = {
  0: "/fleet/sr71-blackbird-logo.png",
  /** Hangar / runway tile 24 (0-based slot 23) — F-111 Aardvark. */
  23: "/fleet/f111-aardvark-logo.png",
};

/** Cache-bust after solidifying logo alpha (HUD light must not pass through). */
const FLEET_LOGO_CACHE_TAG = "solid2";

function withLogoCacheTag(path: string): string {
  const join = path.includes("?") ? "&" : "?";
  return `${path}${join}v=${FLEET_LOGO_CACHE_TAG}`;
}

export function getFleetAircraftLogoPath(aircraftType: FleetAircraftType): string {
  return withLogoCacheTag(FLEET_AIRCRAFT_LOGO_PATHS[aircraftType]);
}

export function getFleetAircraftLogoPathForSlot(
  slot: number | undefined,
  aircraftType: FleetAircraftType,
): string {
  if (typeof slot === "number" && FLEET_SLOT_LOGO_OVERRIDES[slot]) {
    return withLogoCacheTag(FLEET_SLOT_LOGO_OVERRIDES[slot]!);
  }
  return getFleetAircraftLogoPath(aircraftType);
}

/** Transparent-background emblem for the Hired HUD radar scope blip. */
export function getFleetAircraftRadarLogoPathForSlot(
  slot: number | undefined,
  aircraftType: FleetAircraftType,
): string {
  const base = getFleetAircraftLogoPathForSlot(slot, aircraftType);
  const filename = base.split("/").pop()?.split("?")[0];
  return filename ? withLogoCacheTag(`/assets/fleet-logos/radar-transparent/${filename}`) : base;
}
