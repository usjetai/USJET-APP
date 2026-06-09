import { Link } from "react-router-dom";
import { DIRECT_FUEL_ROUTE } from "../../data/directFuelCash";
import { USJET_CASH_APP_CASHTAG } from "../../lib/usjetContact";

/** Header Cash App fuel chip — green glow + blink. */
export default function AppNavCashAppButton() {
  return (
    <Link
      to={DIRECT_FUEL_ROUTE}
      className="app-nav-cashapp btn-glass glass-effect-interactive shrink-0"
      title={`Direct Fuel — Cash App ${USJET_CASH_APP_CASHTAG}`}
      aria-label={`Direct Fuel ${USJET_CASH_APP_CASHTAG}`}
    >
      <span className="app-nav-cashapp__halo" aria-hidden />
      <span className="app-nav-cashapp__shine" aria-hidden />
      <span className="app-nav-cashapp__icon" aria-hidden>
        <span className="app-nav-cashapp__icon-inner">$</span>
      </span>
      <span className="app-nav-cashapp__label">{USJET_CASH_APP_CASHTAG}</span>
    </Link>
  );
}
