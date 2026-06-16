import { getFleetBayAccent, fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { getFleetCapabilities } from "../../data/fleetCapabilities";
import FleetCapabilityBadges from "./FleetCapabilityBadges";
import AircraftIcon from "../icons/AircraftIcons";
import { HeartPulse } from "lucide-react";
import { useMemo, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { getFleetProductPagePath, slugifyAircraftOfficialName } from "../../data/fleetDirectorySeo";
import { hasFleetMerchandise } from "../../lib/fleetProductMedia";
import { FleetLaunchLink } from "../../lib/fleetLaunchLink";
import { buildUnitSystemPrompt } from "../../data/usjetProtocol";
import { copyUsjetProtocol } from "../../lib/copyUsjetProtocol";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import { buildFleetTileTerminalFeed, clearLiveTerminalTile, publishLiveTerminalTile } from "../../lib/liveTerminalBridge";
import { useOriginLimitedOfferOptional } from "../../context/OriginLimitedOfferContext";
import { integratedLaunchUrl } from "../../lib/fleetLaunchUrl";
import { developerRedBlinkHeartClass } from "../../lib/developerRedBlink";
import DeveloperRedBlinkName from "../DeveloperRedBlinkName";
import type { FleetAircraftType } from "../../types/fleet";

type FleetCardProps = {
  domain: string;
  aircraftType: FleetAircraftType;
  /** Official US aircraft name (hired roster). */
  aircraftOfficialName?: string;
  name: string;
  callsign: string;
  /** Open recruiting bay — no partner launch. */
  isAvailableBay?: boolean;
  /** Jet Fighter call-sign profile page (`/fleet-directory/:slug`). */
  jetFighterPagePath?: string;
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
  aircraftOfficialName,
  name,
  callsign,
  href,
  slot,
  systemPrompt,
  returnTo = "/hangar",
  isCommandBay = false,
  isAvailableBay = false,
  jetFighterPagePath,
  onExpandBay,
  surface = "fleet",
  style,
}: FleetCardProps) {
  const originOffer = useOriginLimitedOfferOptional();
  const launchUrl = isAvailableBay
    ? jetFighterPagePath ?? "#"
    : integratedLaunchUrl(domain, href, slot, { label: name, returnTo });
  const isOriginLaunch = launchUrl === "/origin" || launchUrl.startsWith("/origin?");
  const accentId = `${aircraftType}-${slot ?? domain}`.replace(/[^a-z0-9-]/gi, "-");
  const bayAccent = typeof slot === "number" ? getFleetBayAccent(slot) : null;
  const expandInteractive = Boolean(onExpandBay);
  const protocolText = systemPrompt ?? buildUnitSystemPrompt({ name, callsign, domain });
  const capabilities = typeof slot === "number" && surface === "fleet" ? getFleetCapabilities(slot) : undefined;
  const productPagePath = getFleetProductPagePath(callsign);
  const aircraftSlug = aircraftOfficialName ? slugifyAircraftOfficialName(aircraftOfficialName) : "";
  const showProductFooter = surface === "fleet" || !isAvailableBay;
  const isRunway = surface === "fleet";
  const showMerchFreeShipping = surface === "fleet" && hasFleetMerchandise(aircraftSlug);
  const terminalFeed = useMemo(
    () =>
      buildFleetTileTerminalFeed({
        name,
        callsign,
        domain,
        slot,
        personality: bayAccent?.personality,
        capabilities,
        isCommandBay,
        expandInteractive,
      }),
    [name, callsign, domain, slot, bayAccent?.personality, capabilities, isCommandBay, expandInteractive],
  );
  const syncProtocolToClipboard = () => {
    void copyUsjetProtocol(protocolText);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isAvailableBay && !jetFighterPagePath) {
      e.preventDefault();
      return;
    }
    logFleetUsageIfMember(callsign, name);

    if (isOriginLaunch && originOffer) {
      originOffer.requestOriginNavigation(e);
      return;
    }

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

  const cardClassName = [
    "fleet-card group flex flex-col",
    surface === "hangar" ? "fleet-card--surface-hangar h-full min-h-[16rem]" : "fleet-card--surface-runway min-h-[10rem]",
    bayAccent ? "fleet-card--bay-accent" : "",
    expandInteractive ? "fleet-card--hangar-expand" : "",
    isCommandBay ? "fleet-card--command" : "",
    isAvailableBay ? "fleet-card--available" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cardStyle = bayAccent
    ? ({
        ...style,
        ...fleetBayAccentStyle(slot as number),
      } as CSSProperties)
    : style;

  return (
    <div
      className={cardClassName}
      style={cardStyle}
      data-usjet-cockpit={expandInteractive ? "true" : undefined}
      data-usjet-fleet-bay={expandInteractive && typeof slot === "number" ? String(slot + 1) : undefined}
      data-usjet-partner={expandInteractive ? domain : undefined}
      onMouseEnter={() => publishLiveTerminalTile(terminalFeed)}
      onMouseLeave={() => clearLiveTerminalTile()}
      onFocus={() => publishLiveTerminalTile(terminalFeed)}
      onBlur={() => clearLiveTerminalTile()}
    >
      <FleetLaunchLink
        launchUrl={launchUrl}
        className="fleet-card__launch block min-h-0 flex-1"
        title={
          expandInteractive
            ? "Expand this jet into its 2×2 USJET cockpit—the hangar stays your home base."
            : isAvailableBay && jetFighterPagePath
              ? `Open Jet Fighter page for ${name}`
              : undefined
        }
        aria-label={
          isAvailableBay && jetFighterPagePath
            ? `Open Jet Fighter page for ${name}`
            : expandInteractive
              ? `Bring ${name} into its USJET cockpit — expand hangar bay ${typeof slot === "number" ? String(slot + 1).padStart(2, "0") : ""}`
              : `Launch ${name} at ${domain}`
        }
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
      <div className="fleet-card__glass flex h-full flex-col p-5">
        <div className="fleet-card__aircraft-wrap mb-4 flex items-center justify-center px-3 py-4">
          <AircraftIcon
            aircraftType={aircraftType}
            accentId={accentId}
            className="fleet-card__aircraft h-32 w-32"
          />
        </div>

        <div className="fleet-card__meta mt-auto text-left">
          <h3 className="text-base font-black uppercase italic leading-tight tracking-tight text-white transition-colors group-hover:text-blue-300 sm:text-lg">
            {name}
          </h3>
          {isAvailableBay ? (
            <p className="developer-available-green-blink mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-amber-200/70">
              Available position
            </p>
          ) : isCommandBay ? (
            <p className="mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-amber-300/80">Command node</p>
          ) : expandInteractive ? (
            <p className="mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300/50">USJET fleet · consensus bay</p>
          ) : (
            <p className="mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-emerald-300/75">Hired developer</p>
          )}
          {typeof slot === "number" && bayAccent && !isRunway ? (
            <p
              className={`fleet-card__bay-label mt-1 text-[9px] font-black uppercase tracking-[0.35em] text-white/35 ${expandInteractive ? "mt-1.5" : ""}`}
            >
              <span className="fleet-card__personality">{bayAccent.personality}</span>
            </p>
          ) : null}
          {!isAvailableBay && !isRunway ? (
            <p className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
              <HeartPulse size={12} aria-hidden className={developerRedBlinkHeartClass(name) || undefined} />
              <DeveloperRedBlinkName name={name} fleetSlot={slot} />
            </p>
          ) : null}
          {isAvailableBay && !isRunway ? (
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-200/65">Open position</p>
          ) : null}
          {aircraftOfficialName ? (
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/85">
              {aircraftOfficialName}
            </p>
          ) : null}
          {capabilities && isAvailableBay ? <FleetCapabilityBadges capabilities={capabilities} /> : null}
          {!isRunway ? (
            !isAvailableBay ? (
              <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/40">{domain}</p>
            ) : (
              <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/35">Recruiting clearance</p>
            )
          ) : null}
        </div>
      </div>
      </FleetLaunchLink>
      {showProductFooter ? (
        <div className="fleet-card__footer">
          {showMerchFreeShipping ? (
            <p className="fleet-card__free-shipping" aria-label="Free shipping">
              Free shipping
            </p>
          ) : null}
          <Link
            to={productPagePath}
            className="fleet-card__product-cta btn-glass-prominent glass-effect-interactive"
            aria-label={`View product page for ${name}`}
            onClick={() => logFleetUsageIfMember(callsign, name)}
          >
            Product page →
          </Link>
          {jetFighterPagePath && !isRunway ? (
            <Link
              to={jetFighterPagePath}
              className="fleet-card__jet-fighter-link"
            >
              {name} · Jet Fighter page →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
