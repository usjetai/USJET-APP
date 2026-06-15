import type { FleetAircraftType } from "../../types/fleet";

type AircraftIconProps = {
  aircraftType: FleetAircraftType;
  accentId: string;
  className?: string;
};

const VECTOR_ASSET_PATHS: Record<FleetAircraftType, string> = {
  // Stealth & Gen 6
  f22: "/assets/vectors/f22_raptor.svg",
  f35: "/assets/vectors/f35_lightning_ii.svg",
  b21: "/assets/vectors/b21_raider.svg",
  j36: "/assets/vectors/j36_fighter.svg",
  ngad: "/assets/vectors/ngad_platform.svg",
  // Experimental/Advanced
  yf23: "/assets/vectors/yf23_black_widow_ii.svg",
  x47b: "/assets/vectors/x47b.svg",
  x37b: "/assets/vectors/x37b.svg",
  x51: "/assets/vectors/x51_waverider.svg",
  pca: "/assets/vectors/pca_aircraft.svg",
  // Strategic/Strike
  b2: "/assets/vectors/b2_spirit.svg",
  b1: "/assets/vectors/b1_lancer.svg",
  a12: "/assets/vectors/a12_avenger_ii.svg",
  darkstar: "/assets/vectors/sr72_darkstar.svg",
  fb22: "/assets/vectors/fb22.svg",
  // Tactical/Combat
  f15ex: "/assets/vectors/f15ex_eagle_ii.svg",
  f16v: "/assets/vectors/f16v_viper.svg",
  fa18: "/assets/vectors/fa18_super_hornet.svg",
  a10: "/assets/vectors/a10_warthog.svg",
  f117: "/assets/vectors/f117_nighthawk.svg",
  // Unmanned/Wingman
  mq25: "/assets/vectors/mq25_stingray.svg",
  mq28: "/assets/vectors/mq28_ghost_bat.svg",
  xq58: "/assets/vectors/xq58_valkyrie.svg",
  rq180: "/assets/vectors/rq180.svg",
  globalHawk: "/assets/vectors/rq4_global_hawk.svg",
  // Legacy/Heritage
  f14: "/assets/vectors/f14_tomcat.svg",
  f4: "/assets/vectors/f4_phantom_ii.svg",
  f104: "/assets/vectors/f104_starfighter.svg",
  f86: "/assets/vectors/f86_sabre.svg",
  x59: "/assets/vectors/x59_quesst.svg",
};

export default function AircraftIcon({
  aircraftType,
  accentId,
  className = "",
}: AircraftIconProps) {
  return (
    <img
      src={VECTOR_ASSET_PATHS[aircraftType]}
      alt=""
      aria-hidden="true"
      className={`aircraft-icon ${className}`.trim()}
      data-accent-id={accentId}
      decoding="async"
      draggable={false}
    />
  );
}
