import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import AircraftIcon from "../components/icons/AircraftIcons";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { getFleetBayAccent, fleetBayAccentStyle } from "../data/fleetBayAccents";
import { getFleetCapabilities, PLATFORM_LABELS } from "../data/fleetCapabilities";
import { getFleetDirectoryEntryBySlug } from "../data/fleetDirectorySeo";
import { getFleetUnitById } from "../data/fleetManifest";
import {
  getFleetDisplayAircraftType,
  isFleetBayAvailable,
  isFleetBayHired,
} from "../data/fleetRoster";
import { integratedLaunchUrl } from "../lib/fleetLaunchUrl";
import { FleetLaunchLink } from "../lib/fleetLaunchLink";
import { logFleetUsageIfMember } from "../lib/fleetUsageHistory";
import type { FleetPlatform } from "../types/fleet";

function inputModeLabel(inputMode: ReturnType<typeof getFleetCapabilities>["inputModes"]): string {
  if (inputMode === "both") return "Text + voice";
  if (inputMode === "voice") return "Voice";
  return "Text";
}

export default function FleetCallsignPage() {
  const { callsign = "" } = useParams<{ callsign: string }>();
  const entry = getFleetDirectoryEntryBySlug(callsign);
  const unit = entry ? getFleetUnitById(entry.unitId) : undefined;
  const capabilities = useMemo(() => (entry ? getFleetCapabilities(entry.slot) : null), [entry]);
  const bayAccent = useMemo(() => (entry ? getFleetBayAccent(entry.slot) : null), [entry]);

  useEffect(() => {
    const prev = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";

    if (entry) {
      document.title = entry.seoTitle.replace(" | USJET Jet Fighter", " | USJET");
      meta?.setAttribute("content", entry.seoDescription);
    } else {
      document.title = "Jet Fighter call sign not found | USJET";
      meta?.setAttribute("content", "USJET jet fighter call-sign page not found.");
    }

    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
    };
  }, [entry]);

  if (!entry || !unit || !capabilities || !bayAccent) {
    return (
      <div className="jet-fighter-page fleet-callsign-page page-atmosphere page-nav-offset mx-auto max-w-4xl px-4 pb-32 pt-2 sm:px-6 lg:px-8">
        <GlassEffectContainer className="fleet-callsign-page__missing glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <p className="fleet-callsign-page__eyebrow">Jet Fighter index</p>
          <h1 className="fleet-callsign-page__title">Call sign not found</h1>
          <p className="fleet-callsign-page__lede">
            That Jet Fighter call sign is not on the current USJET manifest. Return to the directory and pick a live
            aircraft.
          </p>
          <Link to="/fleet-directory" className="fleet-callsign-page__back btn-glass glass-effect-interactive">
            Back to Jet Fighter directory
          </Link>
        </GlassEffectContainer>
      </div>
    );
  }

  const bayLabel = String(entry.slot + 1).padStart(2, "0");
  const available = isFleetBayAvailable(entry.slot);
  const hired = isFleetBayHired(entry.slot);
  const launchUrl = available
    ? "#"
    : integratedLaunchUrl(entry.domain, entry.href, entry.slot, {
        label: entry.name,
        returnTo: entry.pagePath,
      });
  const displayAircraftType = getFleetDisplayAircraftType(entry.slot, unit.aircraftType);
  const platformNames = capabilities.platforms.map((platform: FleetPlatform) => PLATFORM_LABELS[platform]);

  return (
    <div
      className="jet-fighter-page fleet-callsign-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-2 sm:px-6 lg:px-8"
      style={fleetBayAccentStyle(entry.slot)}
    >
      <Link to="/fleet-directory" className="fleet-callsign-page__backlink glass-effect-interactive">
        &larr; Jet Fighter directory
      </Link>

      <GlassEffectContainer className="fleet-callsign-hero glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <section className="fleet-callsign-hero__grid">
          <div className="fleet-callsign-hero__copy">
            <p className="fleet-callsign-page__eyebrow">
              USJET Jet Fighter · Bay {bayLabel}
              {available ? " · Available position" : hired ? ` · ${entry.aircraftOfficialName}` : ""}
            </p>
            <h1 className="fleet-callsign-page__title">{entry.callsign}</h1>
            <p className="fleet-callsign-page__name">{entry.name}</p>
            {!available ? (
              <p className="fleet-callsign-page__aircraft-type">{entry.aircraftOfficialName}</p>
            ) : (
              <p className="fleet-callsign-page__aircraft-type fleet-callsign-page__aircraft-type--open">
                Recruiting clearance · {bayAccent.personality}
              </p>
            )}
            <p className="fleet-callsign-page__lede">{entry.seoDescription}</p>

            <div className="fleet-callsign-page__actions">
              {available ? (
                <>
                  <Link
                    to="/founders-fuel"
                    className="fleet-callsign-page__launch btn-glass-prominent glass-effect-interactive"
                  >
                    Fuel the fleet
                  </Link>
                  <Link to="/fleet-directory" className="fleet-callsign-page__secondary btn-glass glass-effect-interactive">
                    All call names
                  </Link>
                </>
              ) : (
                <>
                  <FleetLaunchLink
                    launchUrl={launchUrl}
                    className="fleet-callsign-page__launch btn-glass-prominent glass-effect-interactive"
                    onClick={() => logFleetUsageIfMember(entry.callsign, entry.name)}
                  >
                    Launch {entry.callsign}
                  </FleetLaunchLink>
                  <Link to="/" className="fleet-callsign-page__secondary btn-glass glass-effect-interactive">
                    View runway
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="fleet-callsign-hero__aircraft" aria-hidden>
            <AircraftIcon
              aircraftType={displayAircraftType}
              accentId={`${displayAircraftType}-${entry.slug}`}
              className="fleet-callsign-hero__icon"
            />
          </div>
        </section>
      </GlassEffectContainer>

      <section className="fleet-callsign-page__intel" aria-label={`${entry.callsign} Jet Fighter profile`}>
        <GlassEffectContainer className="fleet-callsign-panel glass-effect glass-effect--rounded-rect liquid-glass-background">
          <p className="fleet-callsign-panel__label">Jet Fighter profile</p>
          <h2>{entry.callsign}</h2>
          <p>
            Canonical Jet Fighter page for {entry.callsign}. Developer: {entry.name}. Operators search and share this call name—not a generic bay
            number.
          </p>
        </GlassEffectContainer>

        <GlassEffectContainer className="fleet-callsign-panel glass-effect glass-effect--rounded-rect liquid-glass-background">
          <p className="fleet-callsign-panel__label">Mission class</p>
          <h2>{entry.category}</h2>
          <p>
            This unit is indexed as a sovereign workbench for operators who need the right AI jet without leaving the
            USJET cockpit.
          </p>
        </GlassEffectContainer>

        <GlassEffectContainer className="fleet-callsign-panel glass-effect glass-effect--rounded-rect liquid-glass-background">
          <p className="fleet-callsign-panel__label">Input clearance</p>
          <h2>{inputModeLabel(capabilities.inputModes)}</h2>
          <p>Supported surfaces: {platformNames.join(" / ")}.</p>
        </GlassEffectContainer>

        {!available ? (
          <GlassEffectContainer className="fleet-callsign-panel glass-effect glass-effect--rounded-rect liquid-glass-background">
            <p className="fleet-callsign-panel__label">Cockpit destination</p>
            <h2>{entry.domain}</h2>
            <p>Launches through USJET integrated navigation with a return bar back to this Jet Fighter page.</p>
          </GlassEffectContainer>
        ) : null}
      </section>

      <GlassEffectContainer className="fleet-callsign-keywords glass-effect glass-effect--rounded-rect liquid-glass-background">
        <p className="fleet-callsign-panel__label">Search beacons</p>
        <p>{entry.keywords.join(" / ")}</p>
      </GlassEffectContainer>
    </div>
  );
}
