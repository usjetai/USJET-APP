import AircraftIcon from "../icons/AircraftIcons";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import type { FleetAircraftType } from "../../types/fleet";

type FleetCardProps = {
  domain: string;
  aircraftType: FleetAircraftType;
  name: string;
  callsign: string;
  href?: string;
  slot?: number;
  /** When set, plain click / Enter / Space expands the hangar bay instead of navigating. Cmd/Ctrl-click still opens the URL. */
  onExpandBay?: () => void;
  style?: CSSProperties;
};

function fleetLaunchUrl(domain: string, href?: string): string {
  if (href?.startsWith("/")) {
    return href;
  }

  if (href && /^https?:\/\//i.test(href)) {
    return href;
  }

  const host = domain.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return `https://${host}`;
}

export default function FleetCard({
  domain,
  aircraftType,
  name,
  callsign,
  href,
  slot,
  onExpandBay,
  style,
}: FleetCardProps) {
  const launchUrl = fleetLaunchUrl(domain, href);
  const accentId = `${aircraftType}-${slot ?? domain}`.replace(/[^a-z0-9-]/gi, "-");
  const external = !launchUrl.startsWith("/");
  const expandInteractive = Boolean(onExpandBay);
  /** Hangar: left-click expands in-grid only; omit _blank so there is no parallel “new tab” path for primary clicks. */
  const linkTarget = expandInteractive ? undefined : external ? "_blank" : undefined;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!onExpandBay) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onExpandBay();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (!onExpandBay) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onExpandBay();
    }
  };

  return (
    <a
      href={launchUrl}
      target={linkTarget}
      rel={external ? "noreferrer" : undefined}
      className={["fleet-card group block h-full min-h-[11.5rem]", expandInteractive ? "fleet-card--hangar-expand" : ""]
        .filter(Boolean)
        .join(" ")}
      style={style}
      data-usjet-cockpit={expandInteractive ? "true" : undefined}
      data-usjet-fleet-bay={expandInteractive && typeof slot === "number" ? String(slot + 1) : undefined}
      data-usjet-partner={expandInteractive ? domain : undefined}
      title={
        expandInteractive
          ? "Expand this jet into its 2×2 USJET cockpit—the hangar stays your home base."
          : undefined
      }
      aria-label={
        expandInteractive
          ? `Bring ${name} into its USJET cockpit — expand hangar bay ${typeof slot === "number" ? String(slot + 1).padStart(2, "0") : ""} (${callsign})`
          : `Launch ${name} at ${domain}`
      }
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="fleet-card__glass flex h-full flex-col p-5">
        <div className="fleet-card__aircraft-wrap mb-4 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4">
          <AircraftIcon
            aircraftType={aircraftType}
            accentId={accentId}
            className="fleet-card__aircraft h-16 w-16"
          />
        </div>

        <div className="mt-auto text-left">
          {expandInteractive ? (
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300/50">USJET fleet · consensus bay</p>
          ) : null}
          {typeof slot === "number" ? (
            <p className={`text-[9px] font-black uppercase tracking-[0.35em] text-white/35 ${expandInteractive ? "mt-1.5" : ""}`}>
              Bay {String(slot + 1).padStart(2, "0")}
            </p>
          ) : null}
          <h3 className="mt-2 text-base font-black uppercase italic leading-tight tracking-tight text-white transition-colors group-hover:text-blue-300 sm:text-lg">
            {name}
          </h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-blue-400/90">{callsign}</p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/40">{domain}</p>
        </div>
      </div>
    </a>
  );
}
