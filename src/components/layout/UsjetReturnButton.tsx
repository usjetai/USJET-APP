import { Link } from "react-router-dom";

type UsjetReturnButtonProps = {
  /** Internal USJET route — Fleet `/`, Hangar `/hangar`, etc. */
  to?: string;
  /** Collapse in-tile bay without route change (Hangar workbench). */
  onClick?: () => void;
  ariaLabel?: string;
  /** `tile` pins inside a hangar bay frame; `fixed` floats on full cockpit view. */
  placement?: "tile" | "fixed";
};

export default function UsjetReturnButton({
  to,
  onClick,
  ariaLabel = "Return to USJET",
  placement = "fixed",
}: UsjetReturnButtonProps) {
  const className = ["cockpit-ghost-btn", placement === "tile" ? "usjet-return-btn--in-tile" : ""]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={className} aria-label={ariaLabel}>
        USJET
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      USJET
    </button>
  );
}
