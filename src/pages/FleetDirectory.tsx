import { useEffect } from "react";
import { Link } from "react-router-dom";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { FLEET_DIRECTORY_ENTRIES } from "../data/fleetDirectorySeo";
import { integratedLaunchUrl } from "../lib/fleetLaunchUrl";

export default function FleetDirectory() {
  useEffect(() => {
    const prev = document.title;
    document.title = "USJET Fleet Directory — 30 AI Tools for Operators | USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Directory of thirty sovereign AI workstations — logistics, fleet maintenance, coding, video, voice, and operations. Launch from one USJET hangar.",
    );
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="fleet-directory-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-2 sm:px-6 lg:px-8">
      <header className="fleet-directory-page__hero mb-10">
        <p className="fleet-directory-page__eyebrow">SEO · organic acquisition</p>
        <h1 className="fleet-directory-page__title">USJET Fleet Directory</h1>
        <p className="fleet-directory-page__lede max-w-3xl">
          Thirty elite AI agents — indexed for operators searching logistics, maintenance, coding, creative, and
          field intelligence. Every unit launches through the sovereign USJET cockpit.
        </p>
        <Link to="/founders-fuel" className="fleet-directory-page__fuel-cta btn-glass-prominent glass-effect-interactive">
          Fuel the fleet — $19.90/mo
        </Link>
      </header>

      <ul className="fleet-directory-page__list">
        {FLEET_DIRECTORY_ENTRIES.map((entry) => (
          <li key={entry.unitId}>
            <GlassEffectContainer className="fleet-directory-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
              <article className="fleet-directory-card__inner">
                <p className="fleet-directory-card__bay">
                  Bay {String(entry.slot + 1).padStart(2, "0")} · {entry.callsign}
                </p>
                <h2 className="fleet-directory-card__name">
                  <Link to={entry.pagePath}>{entry.seoTitle.replace(" | USJET Fleet Directory", "")}</Link>
                </h2>
                <p className="fleet-directory-card__category">{entry.category}</p>
                <p className="fleet-directory-card__desc">{entry.seoDescription}</p>
                <p className="fleet-directory-card__keywords">
                  {entry.keywords.join(" · ")}
                </p>
                <Link to={entry.pagePath} className="fleet-directory-card__profile glass-effect-interactive">
                  View {entry.callsign} page
                </Link>
                <a
                  href={integratedLaunchUrl(entry.domain, entry.href, entry.slot, { label: entry.name, returnTo: "/" })}
                  className="fleet-directory-card__launch glass-effect-interactive"
                >
                  Launch {entry.name} via USJET →
                </a>
              </article>
            </GlassEffectContainer>
          </li>
        ))}
      </ul>
    </div>
  );
}
