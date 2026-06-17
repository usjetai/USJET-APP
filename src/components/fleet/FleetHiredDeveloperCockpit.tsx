import { getHiredDeveloperFleetCockpitPath } from "../../lib/hiredHudDeveloperAvatars";

type FleetHiredDeveloperCockpitProps = {
  slot: number;
  name: string;
};

export default function FleetHiredDeveloperCockpit({ slot, name }: FleetHiredDeveloperCockpitProps) {
  const src = getHiredDeveloperFleetCockpitPath(slot);
  if (!src) {
    return null;
  }

  return (
    <div className="fleet-card__cockpit" aria-hidden>
      <img
        src={src}
        alt=""
        className="fleet-card__cockpit-img"
        width={480}
        height={680}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <span className="fleet-card__cockpit-ring" />
      <span className="fleet-card__cockpit-label">{name} · cockpit</span>
    </div>
  );
}
