import { motion } from "framer-motion";
import { getFleetBayAccent, fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { getFleetCapabilities, getFleetPartnerLabel } from "../../data/fleetCapabilities";
import FleetCapabilityBadges from "./FleetCapabilityBadges";
import AircraftIcon from "../icons/AircraftIcons";
import { HeartPulse } from "lucide-react";
import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFleetProductPagePath } from "../../data/fleetDirectorySeo";
import { FleetLaunchLink } from "../../lib/fleetLaunchLink";
import { buildUnitSystemPrompt } from "../../data/usjetProtocol";
import { copyUsjetProtocol } from "../../lib/copyUsjetProtocol";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import { buildFleetTileTerminalFeed, clearLiveTerminalTile, publishLiveTerminalTile } from "../../lib/liveTerminalBridge";
import { useOriginLimitedOfferOptional } from "../../context/OriginLimitedOfferContext";
import { fleetLaunchUrl, integratedLaunchUrl } from "../../lib/fleetLaunchUrl";
import { developerRedBlinkHeartClass } from "../../lib/developerRedBlink";
import DeveloperRedBlinkName from "../DeveloperRedBlinkName";
import type { FleetAircraftType } from "../../types/fleet";

const FLEET_TILE_LAUNCH_SPINS = 3;

type FleetCardProps = {
  domain: string;
  aircraftType: FleetAircraftType;
  aircraftOfficialName?: string;
  name: string;
  callsign: string;
  isAvailableBay?: boolean;
  jetFighterPagePath?: string;
  href?: string;
  slot?: number;
  systemPrompt?: string;
  returnTo?: string;
  isCommandBay?: boolean;
  isFleetLocked?: boolean;
  /** Plain click expands the hangar bay; Cmd/Ctrl-click opens the live partner URL. */
  onExpandBay?: () => void;
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
  isCommandBay = false,
  isFleetLocked = false,
  isAvailableBay = false,
  jetFighterPagePath,
  onExpandBay,
  surface = "fleet",
  style,
}: FleetCardProps) {
  const navigate = useNavigate();
  const originOffer = useOriginLimitedOfferOptional();
  const resolvedHref = href?.trim() ?? "";
  const hasExternalPartner = /^https?:\/\//i.test(resolvedHref);
  const isRunway = surface === "fleet";
  const rawPartnerUrl = fleetLaunchUrl(domain, href, slot);
  const partnerLaunchUrl = isRunway ? rawPartnerUrl : integratedLaunchUrl(domain, href, slot, { returnTo: "/", label: name, callName: callsign });
  const launchUrl =
    isAvailableBay && !hasExternalPartner ? (jetFighterPagePath ?? "#") : partnerLaunchUrl;
  const isOriginLaunch = partnerLaunchUrl === "/origin" || partnerLaunchUrl.startsWith("/origin?");
  const launchBlocked = isAvailableBay && !hasExternalPartner && !jetFighterPagePath;
  const accentId = `${aircraftType}-${slot ?? domain}`.replace(/[^a-z0-9-]/gi, "-");
  const bayAccent = typeof slot === "number" ? getFleetBayAccent(slot) : null;
  const expandInteractive = Boolean(onExpandBay);
  const protocolText = systemPrompt ?? buildUnitSystemPrompt({ name, callsign, domain });
  const capabilities = typeof slot === "number" && surface === "fleet" ? getFleetCapabilities(slot) : undefined;
  const productPagePath = getFleetProductPagePath(callsign);
  const showProductFooter = surface === "fleet";
  const launchSpinPendingRef = useRef(false);
  const [launchSpinning, setLaunchSpinning] = useState(false);
  const [launchSpinKey, setLaunchSpinKey] = useState(0);
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

  const finishLaunchAfterSpin = () => {
    if (launchBlocked) {
      launchSpinPendingRef.current = false;
      setLaunchSpinning(false);
      return;
    }
    if (isOriginLaunch && originOffer) {
      originOffer.requestOriginNavigation();
      return;
    }
    if (launchUrl.startsWith("/")) {
      navigate(launchUrl);
      return;
    }
    window.location.assign(launchUrl);
  };

  const handleSpinComplete = () => {
    if (!launchSpinPendingRef.current) {
      return;
    }
    launchSpinPendingRef.current = false;
    setLaunchSpinning(false);
    finishLaunchAfterSpin();
  };

  const handleCardMouseEnter = () => {
    publishLiveTerminalTile(terminalFeed);
  };

  const handleCardMouseLeave = () => {
    clearLiveTerminalTile();
  };

  const aircraftWrapClassName =
    "fleet-card__aircraft-wrap mb-4 flex items-center justify-center px-3 py-4";

  const renderAircraftIcon = () => (
    <AircraftIcon
      aircraftType={aircraftType}
      slot={slot}
      accentId={accentId}
      className="fleet-card__aircraft h-32 w-32"
    />
  );

  const renderAircraftWrap = () => {
    if (isRunway && launchSpinning && launchSpinKey > 0) {
      return (
        <motion.div
          key={`fleet-aircraft-spin-${launchSpinKey}`}
          className={aircraftWrapClassName}
          style={{ transformOrigin: "center center" }}
          initial={{ rotate: 0, scale: 1, x: 0, y: 0 }}
          animate={{ rotate: 360 * FLEET_TILE_LAUNCH_SPINS, scale: 1.05, x: 3, y: -5 }}
          transition={{ duration: 0.75, ease: [0.34, 1.12, 0.64, 1] }}
          onAnimationComplete={handleSpinComplete}
        >
          {renderAircraftIcon()}
        </motion.div>
      );
    }

    return <div className={aircraftWrapClassName}>{renderAircraftIcon()}</div>;
  };

  const syncProtocolToClipboard = () => {
    void copyUsjetProtocol(protocolText);
  };

  const openPartner = () => {
    if (launchBlocked) {
      return;
    }
    logFleetUsageIfMember(callsign, name);
    syncProtocolToClipboard();
    if (isOriginLaunch && originOffer) {
      navigate(partnerLaunchUrl);
      return;
    }
    if (partnerLaunchUrl.startsWith("/")) {
      navigate(partnerLaunchUrl);
      return;
    }
    window.location.assign(partnerLaunchUrl);
  };

  const handleExpandClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (launchBlocked) {
      return;
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      openPartner();
      return;
    }
    logFleetUsageIfMember(callsign, name);
    syncProtocolToClipboard();
    onExpandBay?.();
  };

  const handleExpandKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }
    e.preventDefault();
    if (launchBlocked) {
      return;
    }
    logFleetUsageIfMember(callsign, name);
    syncProtocolToClipboard();
    onExpandBay?.();
  };

  const handleLaunchClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (launchBlocked) {
      return;
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      openPartner();
      return;
    }
    if (launchSpinPendingRef.current) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    logFleetUsageIfMember(callsign, name);
    syncProtocolToClipboard();
    launchSpinPendingRef.current = true;
    setLaunchSpinning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      handleSpinComplete();
      return;
    }

    setLaunchSpinKey((key) => key + 1);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (launchBlocked) {
      e.preventDefault();
      return;
    }
    logFleetUsageIfMember(callsign, name);
    if (isOriginLaunch && originOffer) {
      originOffer.requestOriginNavigation(e);
      return;
    }
    syncProtocolToClipboard();
  };

  const launchTitle = expandInteractive
    ? "Expand this jet into its USJET cockpit—the hangar stays your home base. Cmd/Ctrl-click opens the live partner."
    : isFleetLocked
      ? "Flight Pass required — unlock the rest of the Fleet through Stripe."
    : isAvailableBay && jetFighterPagePath
      ? `Open Jet Fighter page for ${name}`
      : undefined;

  const launchAriaLabel =
    isFleetLocked
      ? `Unlock ${name} with Flight Pass on Stripe`
      : isAvailableBay && !hasExternalPartner && jetFighterPagePath
      ? `Open Jet Fighter page for ${name}`
      : expandInteractive
        ? `Bring ${name} into its USJET cockpit — expand hangar bay ${typeof slot === "number" ? String(slot + 1).padStart(2, "0") : ""}`
        : `Launch ${name} at ${domain}`;

  const cardClassName = [
    "fleet-card group flex flex-col",
    surface === "hangar" ? "fleet-card--surface-hangar h-full min-h-[16rem]" : "fleet-card--surface-runway min-h-[10rem]",
    bayAccent ? "fleet-card--bay-accent" : "",
    expandInteractive ? "fleet-card--hangar-expand" : "",
    isCommandBay ? "fleet-card--command" : "",
    isAvailableBay ? "fleet-card--available" : "",
    isFleetLocked ? "fleet-card--locked" : "",
    launchSpinning ? "fleet-card--launch-spinning" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cardStyle = bayAccent
    ? ({
        ...style,
        ...fleetBayAccentStyle(slot as number),
      } as CSSProperties)
    : style;

  const glassContent = (
    <div className="fleet-card__glass flex h-full flex-col p-5">
      {typeof slot === "number" && (
        <div className="fleet-card__slot-number absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/40 text-[10px] font-black text-white/80 backdrop-blur-sm">
          {slot + 1}
        </div>
      )}
      {isRunway && !isAvailableBay && typeof slot === "number" ? (
        <div className="fleet-card__runway-visual">
          {renderAircraftWrap()}
        </div>
      ) : (
        renderAircraftWrap()
      )}

      <div className="fleet-card__meta mt-auto text-left">
        <h3 className="text-base font-black uppercase italic leading-tight tracking-tight text-white transition-colors group-hover:text-blue-300 sm:text-lg">
          {name}
        </h3>
        {isRunway && typeof slot === "number" ? (
          <p className="fleet-card__partner-label mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-200/90">
            {getFleetPartnerLabel(slot)}
          </p>
        ) : null}
        {isFleetLocked ? (
          <p className="fleet-card__locked-label mt-1 text-[8px] font-black uppercase tracking-[0.24em] text-amber-200/85">
            Flight Pass required · $19.90
          </p>
        ) : isAvailableBay ? (
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
        {isFleetLocked ? (
          <p className="fleet-card__locked-copy mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/55">
            Click to unlock the remaining AI bays through Stripe.
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
  );

  return (
    <div
      className={cardClassName}
      style={cardStyle}
      aria-busy={launchSpinning || undefined}
      data-usjet-cockpit={expandInteractive ? "true" : undefined}
      data-usjet-fleet-bay={expandInteractive && typeof slot === "number" ? String(slot + 1) : undefined}
      data-usjet-partner={expandInteractive ? domain : undefined}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      onFocus={() => publishLiveTerminalTile(terminalFeed)}
      onBlur={() => clearLiveTerminalTile()}
    >
      {expandInteractive ? (
        <button
          type="button"
          className="fleet-card__launch fleet-card__launch--button block min-h-0 w-full flex-1"
          title={launchTitle}
          aria-label={launchAriaLabel}
          onClick={handleExpandClick}
          onKeyDown={handleExpandKeyDown}
        >
          {glassContent}
        </button>
      ) : isRunway ? (
        <button
          type="button"
          className="fleet-card__launch fleet-card__launch--button block min-h-0 w-full flex-1"
          title={launchTitle}
          aria-label={launchAriaLabel}
          onClick={handleLaunchClick}
        >
          {glassContent}
        </button>
      ) : (
        <FleetLaunchLink
          launchUrl={launchUrl}
          className="fleet-card__launch block min-h-0 flex-1"
          title={launchTitle}
          aria-label={launchAriaLabel}
          onClick={handleClick}
        >
          {glassContent}
        </FleetLaunchLink>
      )}
      {showProductFooter ? (
        <div className="fleet-card__footer">
          <Link
            to={isFleetLocked ? "#" : productPagePath}
            className="fleet-card__product-cta btn-glass-prominent glass-effect-interactive"
            aria-label={isFleetLocked ? `Unlock ${name} with Flight Pass before viewing products` : `View product page for ${name}`}
            aria-disabled={isFleetLocked || undefined}
            onClick={(event) => {
              if (isFleetLocked) {
                event.preventDefault();
                return;
              }
              logFleetUsageIfMember(callsign, name);
            }}
          >
            {isFleetLocked ? "Locked by Flight Pass" : "Product page →"}
          </Link>
          {jetFighterPagePath && !isRunway ? (
            <Link to={jetFighterPagePath} className="fleet-card__jet-fighter-link">
              {name} · Jet Fighter page →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
