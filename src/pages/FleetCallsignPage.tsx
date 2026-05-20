import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import AircraftIcon from "../components/icons/AircraftIcons";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { getFleetBayAccent, fleetBayAccentStyle } from "../data/fleetBayAccents";
import { getFleetCapabilities, PLATFORM_LABELS } from "../data/fleetCapabilities";
import { getFleetDirectoryEntryBySlug } from "../data/fleetDirectorySeo";
import { getFleetUnitById } from "../data/fleetManifest";
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
      document.title = `${entry.callsign} - ${entry.name} | USJET Fleet Directory`;
      meta?.setAttribute("content", entry.seoDescription);
    } else {
      document.title = "Fleet call sign not found | USJET";
      meta?.setAttribute("content", "USJET fleet call-sign page not found.");
    }

    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
    };
  }, [entry]);

  if (!entry || !unit || !capabilities || !bayAccent) {
    return (
      <div className="fleet-callsign-page page-atmosphere page-nav-offset mx-auto max-w-4xl px-4 pb-32 pt-2 sm:px-6 lg:px-8">
        <GlassEffectContainer className="fleet-callsign-page__missing glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <p className="fleet-callsign-page__eyebrow">Fleet index</p>
          <h1 className="fleet-callsign-page__title">Call sign not found</h1>
          <p className="fleet-callsign-page__lede">
            That bay is not on the current USJET manifest. Return to the directory and pick a live aircraft.
          </p>
          <Link to="/fleet-directory" className="fleet-callsign-page__back btn-glass glass-effect-interactive">
            Back to fleet directory
          </Link>
        </GlassEffectContainer>
      </div>
    );
  }

  const bayLabel = String(entry.slot + 1).padStart(2, "0");
  const launchUrl = integratedLaunchUrl(entry.domain, entry.href, entry.slot, {
    label: entry.name,
    returnTo: entry.pagePath,
  });
  const platformNames = capabilities.platforms.map((platform: FleetPlatform) => PLATFORM_LABELS[platform]);

  return (
    <div
      className="fleet-callsign-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-2 sm:px-6 lg:px-8"
      style={fleetBayAccentStyle(entry.slot)}
    >
      <Link to="/fleet-directory" className="fleet-callsign-page__backlink glass-effect-interactive">
        &larr; Fleet directory
      </Link>

      <GlassEffectContainer className="fleet-callsign-hero glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <section className="fleet-callsign-hero__grid">
          <div className="fleet-callsign-hero__copy">
            <p className="fleet-callsign-page__eyebrow">Bay {bayLabel} / {bayAccent.personality} aircraft</p>
            <h1 className="fleet-callsign-page__title">{entry.callsign}</h1>
            <p className="fleet-callsign-page__name">{entry.name}</p>
            <p className="fleet-callsign-page__lede">{entry.seoDescription}</p>

            <div className="fleet-callsign-page__actions">
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
            </div>
          </div>

          <div className="fleet-callsign-hero__aircraft" aria-hidden>
            <AircraftIcon
              aircraftType={unit.aircraftType}
              accentId={`${unit.aircraftType}-${entry.slug}`}
              className="fleet-callsign-hero__icon"
            />
          </div>
        </section>
      </GlassEffectContainer>

      <section className="fleet-callsign-page__intel" aria-label={`${entry.callsign} fleet profile`}>
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

        <GlassEffectContainer className="fleet-callsign-panel glass-effect glass-effect--rounded-rect liquid-glass-background">
          <p className="fleet-callsign-panel__label">Cockpit destination</p>
          <h2>{entry.domain}</h2>
          <p>Launches through USJET integrated navigation with a return bar back to this call-sign page.</p>
        </GlassEffectContainer>
      </section>

      <GlassEffectContainer className="fleet-callsign-keywords glass-effect glass-effect--rounded-rect liquid-glass-background">
        <p className="fleet-callsign-panel__label">Search beacons</p>
        <p>{entry.keywords.join(" / ")}</p>
      </GlassEffectContainer>
    </div>
  );
}
