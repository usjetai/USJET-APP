import { USJET_CASH_APP_CASHTAG, USJET_CASH_APP_URL } from "../../lib/usjetContact";
import { HIRED_HUD_GLAM_FUEL_CTA_LABEL } from "../../data/hiredHudAssets";

type HiredHudTileGlamFuelButtonProps = {
  name: string;
  slot: number;
};

/** Direct Cash App fuel for glam — nails & hair per developer tile. */
export default function HiredHudTileGlamFuelButton({ name, slot }: HiredHudTileGlamFuelButtonProps) {
  const bay = String(slot + 1).padStart(2, "0");

  return (
    <a
      href={USJET_CASH_APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="hired-hud__tile-glam-fuel btn-glass glass-effect-interactive"
      aria-label={`${HIRED_HUD_GLAM_FUEL_CTA_LABEL} for ${name} — opens Cash App ${USJET_CASH_APP_CASHTAG}`}
      title={`${HIRED_HUD_GLAM_FUEL_CTA_LABEL} · Bay ${bay} · ${USJET_CASH_APP_CASHTAG}`}
    >
      <span className="hired-hud__tile-glam-fuel-glow" aria-hidden />
      <span className="hired-hud__tile-glam-fuel-icon" aria-hidden>
        <span className="hired-hud__tile-glam-fuel-icon-inner">$</span>
      </span>
      <span className="hired-hud__tile-glam-fuel-copy">
        <span className="hired-hud__tile-glam-fuel-label">{HIRED_HUD_GLAM_FUEL_CTA_LABEL}</span>
        <span className="hired-hud__tile-glam-fuel-tag">{USJET_CASH_APP_CASHTAG} · Cash App</span>
      </span>
    </a>
  );
}
