import { getFleetBayAccent, fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { getFleetCapabilities } from "../../data/fleetCapabilities";
import FleetCapabilityBadges from "./FleetCapabilityBadges";
import AircraftIcon from "../icons/AircraftIcons";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { buildUnitSystemPrompt } from "../../data/usjetProtocol";
import { copyUsjetProtocol } from "../../lib/copyUsjetProtocol";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import { integratedLaunchUrl } from "../../lib/fleetLaunchUrl";
import type { FleetAircraftType } from "../../types/fleet";

type FleetCardProps = {
  domain: string;
  aircraftType: FleetAircraftType;
  name: string;
  callsign: string;
  href?: string;
  slot?: number;
  systemPrompt?: string;
  /** Cockpit return route — Fleet `/`, Hangar `/hangar`, etc. */
  returnTo?: string;
  /** Bay 30 / USJet Origin — command styling */
  isCommandBay?: boolean;
  /** When set, plain click / Enter / Space expands the hangar bay instead of navigating. Cmd/Ctrl-click still opens the URL. */
  onExpandBay?: () => void;
  /** Visual surface — runway (Fleet `/`) vs workbench bays (Hangar). */
  surface?: "fleet" | "hangar";
  style?: CSSProperties;
};

export default function FleetCard({
  domain,
  aircraftType,
  name,
  callsign,
  href,
  slot,
  systemPrompt,
  returnTo = "/hangar",
  isCommandBay = false,
  onExpandBay,
  surface = "fleet",
  style,
}: FleetCardProps) {
  const launchUrl = integratedLaunchUrl(domain, href, slot, { label: name, returnTo });
  const CardTag = launchUrl.startsWith("/") ? Link : "a";
  const cardProps = launchUrl.startsWith("/") ? { to: launchUrl } : { href: launchUrl };
  const accentId = `${aircraftType}-${slot ?? domain}`.replace(/[^a-z0-9-]/gi, "-");
  const bayAccent = typeof slot === "number" ? getFleetBayAccent(slot) : null;
  const expandInteractive = Boolean(onExpandBay);
  const protocolText = systemPrompt ?? buildUnitSystemPrompt({ name, callsign, domain });

  const syncProtocolToClipboard = () => {
    void copyUsjetProtocol(protocolText);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    logFleetUsageIfMember(callsign, name);

    if (onExpandBay) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        syncProtocolToClipboard();
        return;
      }
      e.preventDefault();
      onExpandBay();
      return;
    }
    syncProtocolToClipboard();
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
    <CardTag
      {...cardProps}
      className={[
        "fleet-card group block h-full",
        surface === "hangar" ? "fleet-card--surface-hangar min-h-[13.5rem]" : "fleet-card--surface-runway min-h-[8rem]",
        bayAccent ? "fleet-card--bay-accent" : "",
        expandInteractive ? "fleet-card--hangar-expand" : "",
        isCommandBay ? "fleet-card--command" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        bayAccent
          ? ({
              ...style,
              ...fleetBayAccentStyle(slot as number),
            } as CSSProperties)
          : style
      }
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

        <div className="fleet-card__meta mt-auto text-left">
          {isCommandBay ? (
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-amber-300/80">Command node</p>
          ) : expandInteractive ? (
            <p className="text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300/50">USJET fleet · consensus bay</p>
          ) : null}
          {typeof slot === "number" ? (
            <p
              className={`fleet-card__bay-label text-[9px] font-black uppercase tracking-[0.35em] text-white/35 ${expandInteractive ? "mt-1.5" : ""}`}
            >
              Bay {String(slot + 1).padStart(2, "0")}
              {bayAccent ? (
                <span className="fleet-card__personality"> · {bayAccent.personality}</span>
              ) : null}
            </p>
          ) : null}
          <h3 className="mt-2 text-base font-black uppercase italic leading-tight tracking-tight text-white transition-colors group-hover:text-blue-300 sm:text-lg">
            {name}
          </h3>
          {surface === "fleet" && typeof slot === "number" ? (
            <FleetCapabilityBadges capabilities={getFleetCapabilities(slot)} />
          ) : null}
          <p
            className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${bayAccent ? "fleet-card__callsign" : "text-blue-400/90"}`}
          >
            {callsign}
          </p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/40">{domain}</p>
        </div>
      </div>
    </CardTag>
  );
}
