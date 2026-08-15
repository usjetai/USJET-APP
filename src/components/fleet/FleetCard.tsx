import { motion } from "framer-motion";
import { getFleetBayAccent, fleetBayAccentStyle } from "../../data/fleetBayAccents";
import { getFleetCapabilities } from "../../data/fleetCapabilities";
import FleetCapabilityBadges from "./FleetCapabilityBadges";
import AircraftIcon from "../icons/AircraftIcons";
import { getFleetCategory } from "../../data/fleetCategories";
import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { FleetLaunchLink } from "../../lib/fleetLaunchLink";
import { buildUnitSystemPrompt } from "../../data/usjetProtocol";
import { copyUsjetProtocol } from "../../lib/copyUsjetProtocol";
import { logFleetUsageIfMember } from "../../lib/fleetUsageHistory";
import { buildFleetTileTerminalFeed, clearLiveTerminalTile, publishLiveTerminalTile } from "../../lib/liveTerminalBridge";
import { useOriginLimitedOfferOptional } from "../../context/OriginLimitedOfferContext";
import { fleetLaunchUrl, integratedLaunchUrl } from "../../lib/fleetLaunchUrl";
import {
  buildRandomFleetFlightPlan,
  type FleetFlightPlan,
} from "../../lib/fleetRunwayFlight";
import type { FleetAircraftType } from "../../types/fleet";

type FleetCardProps = {
  domain: string;
  aircraftType: FleetAircraftType;
  aircraftOfficialName?: string;
  name: string;
  callsign: string;
  isAvailableBay?: boolean;
  /** Short, factual one-line description of what the AI actually does (hangar tiles). */
  description?: string;
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
  description,
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
  const partnerLaunchUrl = isRunway ? rawPartnerUrl : integratedLaunchUrl(domain, href, slot, { returnTo: "/fleet", label: name, callName: callsign });
  const launchUrl =
    isAvailableBay && !hasExternalPartner ? (jetFighterPagePath ?? "#") : partnerLaunchUrl;
  const isOriginLaunch = partnerLaunchUrl === "/origin" || partnerLaunchUrl.startsWith("/origin?");
  const launchBlocked = isAvailableBay && !hasExternalPartner && !jetFighterPagePath;
  const accentId = `${aircraftType}-${slot ?? domain}`.replace(/[^a-z0-9-]/gi, "-");
  const bayAccent = typeof slot === "number" ? getFleetBayAccent(slot) : null;
  const expandInteractive = Boolean(onExpandBay);
  const protocolText = systemPrompt ?? buildUnitSystemPrompt({ name, callsign, domain });
  const capabilities = typeof slot === "number" ? getFleetCapabilities(slot) : undefined;
  const category = typeof slot === "number" ? getFleetCategory(slot) : undefined;
  const showJetFighterFooter = surface === "fleet" && Boolean(jetFighterPagePath) && !isRunway;
  const launchSpinPendingRef = useRef(false);
  const aircraftAnchorRef = useRef<HTMLDivElement>(null);
  const [launchSpinning, setLaunchSpinning] = useState(false);
  const [launchSpinKey, setLaunchSpinKey] = useState(0);
  const [flightPlan, setFlightPlan] = useState<FleetFlightPlan | null>(null);
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
    if (expandInteractive) {
      onExpandBay?.();
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
    setFlightPlan(null);
    finishLaunchAfterSpin();
  };

  const beginOpenSpin = () => {
    if (launchBlocked || launchSpinPendingRef.current) {
      return;
    }
    logFleetUsageIfMember(callsign, name);
    syncProtocolToClipboard();
    launchSpinPendingRef.current = true;
    setLaunchSpinning(true);

    if (!isRunway || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      handleSpinComplete();
      return;
    }

    // Hangar + Fleet: random heading sortie that flies the logo off the page.
    const rect =
      aircraftAnchorRef.current?.getBoundingClientRect() ??
      new DOMRect(window.innerWidth / 2 - 64, window.innerHeight / 2 - 64, 128, 128);
    setFlightPlan(buildRandomFleetFlightPlan(rect));
    setLaunchSpinKey((key) => key + 1);
  };

  const handleCardMouseEnter = () => {
    publishLiveTerminalTile(terminalFeed);
  };

  const handleCardMouseLeave = () => {
    clearLiveTerminalTile();
  };

  const isHangarSurface = surface === "hangar";
  const aircraftWrapClassName = [
    "fleet-card__aircraft-wrap mb-4 flex items-center justify-center px-3 py-4",
    isHangarSurface ? "fleet-card__aircraft-wrap--corporate-mini" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const renderAircraftIcon = () => (
    <AircraftIcon
      aircraftType={aircraftType}
      slot={slot}
      accentId={accentId}
      className={isHangarSurface ? "fleet-card__aircraft h-9 w-9" : "fleet-card__aircraft h-32 w-32"}
    />
  );

  const renderRunwayFlightPortal = () => {
    if (!flightPlan || typeof document === "undefined") {
      return null;
    }

    return createPortal(
      <motion.div
        key={`fleet-aircraft-sortie-${launchSpinKey}`}
        className="fleet-card__aircraft-flight"
        style={{
          left: flightPlan.originLeft,
          top: flightPlan.originTop,
          width: flightPlan.size,
          height: flightPlan.size,
          marginLeft: -flightPlan.size / 2,
          marginTop: -flightPlan.size / 2,
        }}
        initial={{
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
        }}
        animate={{
          x: flightPlan.x,
          y: flightPlan.y,
          rotate: flightPlan.rotate,
          scale: flightPlan.scale,
          opacity: flightPlan.opacity,
        }}
        transition={{
          duration: flightPlan.duration,
          times: flightPlan.times,
          // Linear keeps each beat nose-aligned with forward travel (no reverse slide).
          ease: "linear",
        }}
        onAnimationComplete={handleSpinComplete}
      >
        {renderAircraftIcon()}
      </motion.div>,
      document.body,
    );
  };

  const renderAircraftWrap = () => {
    const isSortieTakingOff =
      launchSpinning && launchSpinKey > 0 && Boolean(flightPlan) && isRunway;

    // Hangar radar HUD stays on the tile; logo flies a random path off the page (same as Fleet).
    if (isSortieTakingOff) {
      return (
        <>
          <div className={`${aircraftWrapClassName} fleet-card__aircraft-wrap--runway-takeoff`}>
            <div
              ref={aircraftAnchorRef}
              className="fleet-card__aircraft-sortie-anchor"
              aria-hidden="true"
              style={{ visibility: "hidden" }}
            >
              {renderAircraftIcon()}
            </div>
          </div>
          {renderRunwayFlightPortal()}
        </>
      );
    }

    return (
      <div ref={aircraftAnchorRef} className={aircraftWrapClassName}>
        {renderAircraftIcon()}
      </div>
    );
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
    beginOpenSpin();
  };

  const handleExpandKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }
    e.preventDefault();
    beginOpenSpin();
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
    beginOpenSpin();
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

  const cardStyle = {
    ...style,
    ...(typeof slot === "number" ? fleetBayAccentStyle(slot) : null),
  } as CSSProperties | undefined;

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
        {isFleetLocked ? (
          <p className="fleet-card__locked-label mt-1 text-[8px] font-black uppercase tracking-[0.24em] text-amber-200/85">
            Flight Pass required · $19.90
          </p>
        ) : isAvailableBay && isRunway ? (
          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-amber-200/70">Open bay</p>
        ) : isCommandBay ? (
          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-amber-300/80">Command node</p>
        ) : expandInteractive ? (
          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300/50">USJET fleet · consensus bay</p>
        ) : isRunway ? (
          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300/55">Partner bay</p>
        ) : (
          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.28em] text-cyan-300/60">Active bay</p>
        )}
        {!isRunway && category ? (
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{category}</p>
        ) : null}
        {aircraftOfficialName ? (
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/85">
            {aircraftOfficialName}
          </p>
        ) : null}
        {!isRunway && description ? (
          <p className="fleet-card__description mt-2 text-[11px] font-medium normal-case leading-snug text-white/65">
            {description}
          </p>
        ) : null}
        {isFleetLocked ? (
          <p className="fleet-card__locked-copy mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/55">
            Click to unlock the remaining AI bays through Stripe.
          </p>
        ) : null}
        {capabilities ? <FleetCapabilityBadges capabilities={capabilities} /> : null}
        {!isRunway ? (
          <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/40">{domain}</p>
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
      {showJetFighterFooter && jetFighterPagePath ? (
        <div className="fleet-card__footer">
          <Link to={jetFighterPagePath} className="fleet-card__jet-fighter-link">
            {name} · Jet Fighter page →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
