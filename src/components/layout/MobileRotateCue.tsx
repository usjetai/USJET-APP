import { Link } from "react-router-dom";
import { MOBILE_LANDSCAPE_CHIP_HOVER, MOBILE_LANDSCAPE_ROUTE } from "../../data/mobileLandscapeGuide";
import MobileRotateIcon from "./MobileRotateIcon";

/** Toolbar rotate glyph → landscape guide. Pink icon, static (no animation). */
export default function MobileRotateCue() {
  return (
    <Link
      to={MOBILE_LANDSCAPE_ROUTE}
      className="mobile-rotate-cue btn-glass glass-effect-interactive"
      title={MOBILE_LANDSCAPE_CHIP_HOVER}
      aria-label={MOBILE_LANDSCAPE_CHIP_HOVER}
    >
      <MobileRotateIcon />
    </Link>
  );
}
