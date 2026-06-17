import {
  JET_HOOPS_COURT_HEIGHT,
  JET_HOOPS_COURT_IMAGE_SRC,
  JET_HOOPS_COURT_WIDTH,
} from "../../data/jetHoops";

/** Top-down hardwood court art — shared with Hired HUD hang pickup. */
export default function JetHoopsCourtSvg() {
  return (
    <img
      className="jet-hoops__court-svg"
      src={JET_HOOPS_COURT_IMAGE_SRC}
      width={JET_HOOPS_COURT_WIDTH}
      height={JET_HOOPS_COURT_HEIGHT}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
    />
  );
}
