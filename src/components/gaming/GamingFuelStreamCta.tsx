import { Link } from "react-router-dom";
import { HANGAR_LIVE_FUEL_COPY, HANGAR_LIVE_FUEL_KICKER } from "../../data/liveHangar";
import { DIRECT_FUEL_ROUTE } from "../../data/directFuelCash";
import DirectFuelCashButton from "../fuel/DirectFuelCashButton";
import ZelleFuelChip from "../fuel/ZelleFuelChip";

export default function GamingFuelStreamCta() {
  return (
    <div className="gaming-fuel-stream" aria-labelledby="gaming-fuel-stream-title">
      <p className="gaming-fuel-stream__kicker">{HANGAR_LIVE_FUEL_KICKER}</p>
      <h3 id="gaming-fuel-stream-title" className="gaming-fuel-stream__copy">
        {HANGAR_LIVE_FUEL_COPY}
      </h3>
      <div className="gaming-fuel-stream__actions">
        <DirectFuelCashButton variant="hero" />
        <ZelleFuelChip variant="hero" />
      </div>
      <p className="gaming-fuel-stream__note">
        <Link to={DIRECT_FUEL_ROUTE} className="gaming-fuel-stream__link">
          Full Direct Fuel wall
        </Link>
      </p>
    </div>
  );
}
