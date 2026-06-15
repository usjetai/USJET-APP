import type { FleetAircraftType } from "../../types/fleet";

type AircraftIconProps = {
  aircraftType: FleetAircraftType;
  accentId: string;
  className?: string;
};

const LOGO_ASSET_PATHS: Record<FleetAircraftType, string> = {
  // Stealth & Gen 6
  f22: "/assets/fleet-logos/f22_raptor.png",
  f35: "/assets/fleet-logos/f35_lightning_ii.png",
  b21: "/assets/fleet-logos/b21_raider.png",
  j36: "/assets/fleet-logos/j36_fighter.png",
  ngad: "/assets/fleet-logos/ngad_platform.png",
  // Experimental/Advanced
  yf23: "/assets/fleet-logos/yf23_black_widow_ii.png",
  x47b: "/assets/fleet-logos/x47b.png",
  x37b: "/assets/fleet-logos/x37b.png",
  x51: "/assets/fleet-logos/x51_waverider.png",
  pca: "/assets/fleet-logos/pca_aircraft.png",
  // Strategic/Strike
  b2: "/assets/fleet-logos/b2_spirit.png",
  b1: "/assets/fleet-logos/b1_lancer.png",
  a12: "/assets/fleet-logos/a12_avenger_ii.png",
  darkstar: "/assets/fleet-logos/sr72_darkstar.png",
  fb22: "/assets/fleet-logos/fb22.png",
  // Tactical/Combat
  f15ex: "/assets/fleet-logos/f15ex_eagle_ii.png",
  f16v: "/assets/fleet-logos/f16v_viper.png",
  fa18: "/assets/fleet-logos/fa18_super_hornet.png",
  a10: "/assets/fleet-logos/a10_warthog.png",
  f117: "/assets/fleet-logos/f117_nighthawk.png",
  // Unmanned/Wingman
  mq25: "/assets/fleet-logos/mq25_stingray.png",
  mq28: "/assets/fleet-logos/mq28_ghost_bat.png",
  xq58: "/assets/fleet-logos/xq58_valkyrie.png",
  rq180: "/assets/fleet-logos/rq180.png",
  globalHawk: "/assets/fleet-logos/rq4_global_hawk.png",
  // Legacy/Heritage
  f14: "/assets/fleet-logos/f14_tomcat.png",
  f4: "/assets/fleet-logos/f4_phantom_ii.png",
  f104: "/assets/fleet-logos/f104_starfighter.png",
  f86: "/assets/fleet-logos/f86_sabre.png",
  x59: "/assets/fleet-logos/x59_quesst.png",
};

export default function AircraftIcon({
  aircraftType,
  accentId,
  className = "",
}: AircraftIconProps) {
  return (
    <img
      src={LOGO_ASSET_PATHS[aircraftType]}
      alt=""
      aria-hidden="true"
      className={`aircraft-icon ${className}`.trim()}
      data-accent-id={accentId}
      decoding="async"
      draggable={false}
    />
  );
}
