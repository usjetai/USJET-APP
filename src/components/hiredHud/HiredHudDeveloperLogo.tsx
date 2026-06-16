import { getFleetAircraftLogoPath } from "../../lib/fleetAircraftLogos";
import { getHiredHudLogoTint } from "../../lib/hiredHudLogoTint";
import type { FleetAircraftType } from "../../types/fleet";

type HiredHudDeveloperLogoProps = {
  slot: number;
  aircraftType: FleetAircraftType;
  /** HUD backdrop emblem vs compact badge beside the developer name. */
  variant?: "hud" | "badge";
};

export default function HiredHudDeveloperLogo({
  slot,
  aircraftType,
  variant = "hud",
}: HiredHudDeveloperLogoProps) {
  const tint = getHiredHudLogoTint(slot);
  const src = getFleetAircraftLogoPath(aircraftType);

  return (
    <div
      className={[
        "hired-hud__tile-logo",
        `hired-hud__tile-logo--${tint}`,
        variant === "badge" ? "hired-hud__tile-logo--badge" : "hired-hud__tile-logo--hud",
      ].join(" ")}
      aria-hidden
    >
      <img src={src} alt="" className="hired-hud__tile-logo-img logo-rounded" decoding="async" draggable={false} />
      <span className="hired-hud__tile-logo-overlay" />
      <span className="hired-hud__tile-logo-ring" />
    </div>
  );
}
