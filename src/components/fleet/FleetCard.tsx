import AircraftIcon from "../icons/AircraftIcons";
import type { FleetAircraftType } from "../../types/fleet";

type FleetCardProps = {
  domain: string;
  aircraftType: FleetAircraftType;
  name: string;
  callsign: string;
  href?: string;
  slot?: number;
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
}: FleetCardProps) {
  const launchUrl = fleetLaunchUrl(domain, href);
  const accentId = `${aircraftType}-${slot ?? domain}`.replace(/[^a-z0-9-]/gi, "-");
  const external = !launchUrl.startsWith("/");

  return (
    <a
      href={launchUrl}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="fleet-card group block h-full min-h-[11.5rem]"
      aria-label={`Launch ${name} at ${domain}`}
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
          {typeof slot === "number" ? (
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/35">
              Bay {String(slot + 1).padStart(2, "0")}
            </p>
          ) : null}
          <h3 className="mt-2 text-base font-black uppercase italic leading-tight tracking-tight text-white transition-colors group-hover:text-blue-300 sm:text-lg">
            {name}
          </h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-blue-400/90">
            {callsign}
          </p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
            {domain}
          </p>
        </div>
      </div>
    </a>
  );
}
