import { useEffect } from "react";
import { Link } from "react-router-dom";
import AircraftIcon from "../components/icons/AircraftIcons";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import FleetCapabilityBadges from "../components/fleet/FleetCapabilityBadges";
import {
  FLEET_DIRECTORY_AVAILABLE_ENTRIES,
  FLEET_DIRECTORY_ENTRIES,
  FLEET_DIRECTORY_HIRED_ENTRIES,
  getFleetProductPagePath,
  FLEET_JETFIGHTER_PAGE_COUNT,
} from "../data/fleetDirectorySeo";
import { FLEET_AVAILABLE_COUNT, FLEET_HIRED_COUNT } from "../data/fleetRoster";
import DeveloperRedBlinkName from "../components/DeveloperRedBlinkName";
import { fleetLaunchUrl } from "../lib/fleetLaunchUrl";
import { getFleetCapabilities } from "../data/fleetCapabilities";

export default function FleetDirectory() {
  useEffect(() => {
    const prev = document.title;
    document.title = "USJET Jet Fighter Directory — 30 Call Names | USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      `Thirty AI jet fighter call names — each with its own USJET profile page. ${FLEET_HIRED_COUNT} hired developers on US fighter vectors, ${FLEET_AVAILABLE_COUNT} open positions recruiting.`,
    );
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="fleet-directory-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-2 sm:px-6 lg:px-8">
      <header className="fleet-directory-page__hero mb-10">
        <p className="fleet-directory-page__eyebrow">Jet Fighter index · {FLEET_JETFIGHTER_PAGE_COUNT} call names</p>
        <h1 className="fleet-directory-page__title">USJET Jet Fighter Directory</h1>
        <p className="fleet-directory-page__lede max-w-3xl">
          Every AI jet has a call name and its own page — {FLEET_JETFIGHTER_PAGE_COUNT} Jet Fighter profiles indexed for
          search. {FLEET_HIRED_COUNT} hired on US fighter vectors, {FLEET_AVAILABLE_COUNT} open positions recruiting.
        </p>
        <Link to="/founders-fuel" className="fleet-directory-page__fuel-cta btn-glass-prominent glass-effect-interactive">
          Fuel the fleet — $19.90/mo
        </Link>
      </header>

      <nav className="fleet-directory-page__callsign-index mb-12" aria-label="All Jet Fighter call names">
        {FLEET_DIRECTORY_ENTRIES.map((entry) => (
          <Link
            key={entry.slug}
            to={entry.pagePath}
            className="fleet-directory-page__callsign-chip glass-effect-interactive"
          >
            <span className="fleet-directory-page__callsign-chip-icon" aria-hidden>
              <AircraftIcon aircraftType={entry.aircraftType} accentId={`directory-chip-${entry.slug}`} className="fleet-directory-page__callsign-icon" />
            </span>
            {entry.name}
          </Link>
        ))}
      </nav>

      <section className="fleet-directory-page__section" aria-labelledby="fleet-directory-hired">
        <h2 id="fleet-directory-hired" className="fleet-directory-page__section-title">
          Hired developers ({FLEET_HIRED_COUNT})
        </h2>
        <ul className="fleet-directory-page__list">
          {FLEET_DIRECTORY_HIRED_ENTRIES.map((entry) => (
            <li key={entry.unitId}>
              <GlassEffectContainer className="fleet-directory-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
                <article className="fleet-directory-card__inner">
                  <div className="fleet-directory-card__media">
                    <span className="fleet-directory-card__icon-wrap" aria-hidden>
                      <AircraftIcon aircraftType={entry.aircraftType} accentId={`directory-hired-${entry.slug}`} className="fleet-directory-card__icon" />
                    </span>
                    <p className="fleet-directory-card__bay">{entry.name} · {entry.aircraftOfficialName}</p>
                  </div>
                  <h3 className="fleet-directory-card__name">
                    <Link to={entry.pagePath}>{entry.name}</Link>
                  </h3>
                  <p className="fleet-directory-card__developer">
                    <DeveloperRedBlinkName name={entry.name} fleetSlot={entry.slot} />
                  </p>
                  <p className="fleet-directory-card__category">{entry.category}</p>
                  <p className="fleet-directory-card__desc">{entry.seoDescription}</p>
                  <Link to={entry.pagePath} className="fleet-directory-card__profile glass-effect-interactive">
                    {entry.name} Jet Fighter page →
                  </Link>
                  <Link to={getFleetProductPagePath(entry.callsign)} className="fleet-directory-card__profile fleet-directory-card__product glass-effect-interactive">
                    {entry.name} Product page →
                  </Link>
                  <a
                    href={fleetLaunchUrl(entry.domain, entry.href, entry.slot)}
                    className="fleet-directory-card__launch glass-effect-interactive"
                  >
                    Launch {entry.name} via USJET →
                  </a>
                </article>
              </GlassEffectContainer>
            </li>
          ))}
        </ul>
      </section>

      <section className="fleet-directory-page__section mt-14" aria-labelledby="fleet-directory-available">
        <h2 id="fleet-directory-available" className="fleet-directory-page__section-title">
          Available positions ({FLEET_AVAILABLE_COUNT})
        </h2>
        <ul className="fleet-directory-page__list">
          {FLEET_DIRECTORY_AVAILABLE_ENTRIES.map((entry) => (
            <li key={entry.unitId}>
              <GlassEffectContainer className="fleet-directory-card fleet-directory-card--available glass-effect glass-effect--rounded-rect liquid-glass-background">
                <article className="fleet-directory-card__inner">
                  <div className="fleet-directory-card__media">
                    <span className="fleet-directory-card__icon-wrap" aria-hidden>
                      <AircraftIcon aircraftType={entry.aircraftType} accentId={`directory-available-${entry.slug}`} className="fleet-directory-card__icon" />
                    </span>
                    <p className="fleet-directory-card__bay">{entry.name}</p>
                  </div>
                  <h3 className="fleet-directory-card__name">
                    <Link to={entry.pagePath}>{entry.name}</Link>
                  </h3>
                  <p className="fleet-directory-card__developer">
                    <DeveloperRedBlinkName name={entry.name} fleetSlot={entry.slot} />
                  </p>
                  <p className="fleet-directory-card__category">{entry.category}</p>
                  <FleetCapabilityBadges capabilities={getFleetCapabilities(entry.slot)} />
                  <p className="fleet-directory-card__desc">{entry.seoDescription}</p>
                  <Link to={entry.pagePath} className="fleet-directory-card__profile glass-effect-interactive">
                    {entry.name} Jet Fighter page →
                  </Link>
                </article>
              </GlassEffectContainer>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
