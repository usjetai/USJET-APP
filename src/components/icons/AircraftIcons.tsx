import type { FleetAircraftType } from "../../types/fleet";

type AircraftIconProps = {
  aircraftType: FleetAircraftType;
  accentId: string;
  className?: string;
};

const VECTOR_ASSET_PATHS: Record<FleetAircraftType, string> = {
  // Stealth & Gen 6
  f22: "/assets/vectors/f22.svg",
  f35: "/assets/vectors/f35.svg",
  b21: "/assets/vectors/b21.svg",
  j36: "/assets/vectors/j36.svg",
  ngad: "/assets/vectors/ngad.svg",
  // Experimental/Advanced
  yf23: "/assets/vectors/yf23.svg",
  x47b: "/assets/vectors/x47b.svg",
  x37b: "/assets/vectors/x37b.svg",
  x51: "/assets/vectors/x51.svg",
  pca: "/assets/vectors/pca.svg",
  // Strategic/Strike
  b2: "/assets/vectors/b2.svg",
  b1: "/assets/vectors/b1.svg",
  a12: "/assets/vectors/a12.svg",
  darkstar: "/assets/vectors/darkstar.svg",
  fb22: "/assets/vectors/fb22.svg",
  // Tactical/Combat
  f15ex: "/assets/vectors/f15ex.svg",
  f16v: "/assets/vectors/f16v.svg",
  fa18: "/assets/vectors/fa18.svg",
  a10: "/assets/vectors/a10.svg",
  f117: "/assets/vectors/f117.svg",
  // Unmanned/Wingman
  mq25: "/assets/vectors/mq25.svg",
  mq28: "/assets/vectors/mq28.svg",
  xq58: "/assets/vectors/xq58.svg",
  rq180: "/assets/vectors/rq180.svg",
  globalHawk: "/assets/vectors/globalHawk.svg",
  // Legacy/Heritage
  f14: "/assets/vectors/f14.svg",
  f4: "/assets/vectors/f4.svg",
  f104: "/assets/vectors/f104.svg",
  f86: "/assets/vectors/f86.svg",
  x59: "/assets/vectors/x59.svg",
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
