import { USJET_CASH_APP_CASHTAG, USJET_CASH_APP_URL } from "../../lib/usjetContact";
import { DIRECT_FUEL_CTA_LABEL } from "../../data/directFuelCash";

type DirectFuelCashButtonProps = {
  variant?: "hero" | "compact";
};

export default function DirectFuelCashButton({ variant = "hero" }: DirectFuelCashButtonProps) {
  const isHero = variant === "hero";

  return (
    <a
      href={USJET_CASH_APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "direct-fuel-cash-btn glass-effect-interactive",
        isHero ? "direct-fuel-cash-btn--hero" : "direct-fuel-cash-btn--compact",
      ].join(" ")}
      aria-label={`${DIRECT_FUEL_CTA_LABEL} — opens Cash App`}
    >
      <span className="direct-fuel-cash-btn__glow" aria-hidden />
      <span className="direct-fuel-cash-btn__shine" aria-hidden />
      <span className="direct-fuel-cash-btn__flash" aria-hidden />
      <span className="direct-fuel-cash-btn__icon" aria-hidden>
        <span className="direct-fuel-cash-btn__icon-inner">$</span>
      </span>
      <span className="direct-fuel-cash-btn__text">
        <span className="direct-fuel-cash-btn__label">{DIRECT_FUEL_CTA_LABEL}</span>
        {isHero ? <span className="direct-fuel-cash-btn__sub">{USJET_CASH_APP_CASHTAG} · cash.app</span> : null}
      </span>
    </a>
  );
}
