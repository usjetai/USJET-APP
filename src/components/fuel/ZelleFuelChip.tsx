import { useState } from "react";
import { Link } from "react-router-dom";
import ZelleLogoMark from "../brand/ZelleLogoMark";
import ZelleFuelModal from "./ZelleFuelModal";
import { ZELLE_CHIP_HOVER, ZELLE_FUEL_ROUTE } from "../../data/directFuelZelle";

type ZelleFuelChipProps = {
  /** Footer strip uses compact logo-only chip; page uses larger. */
  variant?: "footer" | "hero";
};

export default function ZelleFuelChip({ variant = "footer" }: ZelleFuelChipProps) {
  const [open, setOpen] = useState(false);
  const isFooter = variant === "footer";

  if (isFooter) {
    return (
      <>
        <button
          type="button"
          className="usjet-global-contact-bar__zelle btn-glass glass-effect-interactive"
          title={ZELLE_CHIP_HOVER}
          aria-label={ZELLE_CHIP_HOVER}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <span className="usjet-global-contact-bar__zelle-glow" aria-hidden />
          <span className="usjet-global-contact-bar__zelle-shine" aria-hidden />
          <ZelleLogoMark className="usjet-global-contact-bar__zelle-logo" />
        </button>
        <ZelleFuelModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className="zelle-fuel-hero-btn glass-effect-interactive"
        title={ZELLE_CHIP_HOVER}
        aria-label={ZELLE_CHIP_HOVER}
        onClick={() => setOpen(true)}
      >
        <span className="zelle-fuel-hero-btn__glow" aria-hidden />
        <ZelleLogoMark className="zelle-fuel-hero-btn__logo" />
        <span className="zelle-fuel-hero-btn__label">Zelle · Direct Fuel</span>
      </button>
      <p className="zelle-fuel-hero-btn__note">
        Or open the{" "}
        <Link to={ZELLE_FUEL_ROUTE} className="zelle-fuel-hero-btn__link">
          full scan page
        </Link>
      </p>
      <ZelleFuelModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
