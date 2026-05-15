import { GAMING_ANCHOR_HANGAR, GAMING_VR_ICON_SRC } from "../../data/gamingPortal";

/** VR headset hero — tap to jump to Live Hangar on this page. */
export default function GamingVrVisor() {
  return (
    <a
      href={`#${GAMING_ANCHOR_HANGAR}`}
      className="gaming-vr-visor gaming-vr-visor--link"
      aria-label="Jump to USJET Live Hangar on this page"
    >
      <img
        src={GAMING_VR_ICON_SRC}
        alt=""
        className="gaming-vr-visor__img"
        width={120}
        height={72}
        decoding="async"
      />
    </a>
  );
}
