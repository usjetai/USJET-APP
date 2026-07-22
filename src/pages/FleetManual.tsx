import { useEffect } from "react";
import FleetManualArtifact from "../components/growth/FleetManualArtifact";
import FleetManualCheckout from "../components/growth/FleetManualCheckout";
import RevenueValueLadder from "../components/growth/RevenueValueLadder";
import {
  FLEET_MANUAL_FEATURES,
  FLEET_MANUAL_LEDE,
  FLEET_MANUAL_PAGE_SHORT,
  FLEET_MANUAL_POSITIONING,
  FLEET_MANUAL_PRICE_DISPLAY,
  FLEET_MANUAL_TAGLINE,
  FLEET_MANUAL_TITLE,
} from "../data/fleetManual2500";

export default function FleetManual() {
  useEffect(() => {
    const prev = document.title;
    document.title = "2.5K · Fleet Manual · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET Fleet Manual Professional Edition — $2,500 implementation blueprint for 30-agent labor operations. Limited to 500 licenses.",
    );
    document.documentElement.classList.add("fleet-manual-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("fleet-manual-page-root");
    };
  }, []);

  return (
    <div className="fleet-manual-page page-atmosphere page-nav-offset mx-auto max-w-5xl px-4 pb-36 pt-4 sm:px-6 lg:px-8">
      <div className="fleet-manual-page__grid" aria-hidden />

      <header className="fleet-manual-page__hero">
        <p className="fleet-manual-page__badge" aria-label="2.5K page">
          <span className="fleet-manual-page__badge-cash" aria-hidden>
            💵
          </span>
          {FLEET_MANUAL_PAGE_SHORT}
        </p>
        <p className="fleet-manual-page__eyebrow">{FLEET_MANUAL_TAGLINE}</p>
        <h1 className="fleet-manual-page__title">{FLEET_MANUAL_TITLE}</h1>
        <p className="fleet-manual-page__price">{FLEET_MANUAL_PRICE_DISPLAY}</p>
        <p className="fleet-manual-page__lede">{FLEET_MANUAL_LEDE}</p>
      </header>

      <RevenueValueLadder active="manual" />

      <section className="fleet-manual-page__showcase">
        <FleetManualArtifact />
        <div className="fleet-manual-page__copy">
          {FLEET_MANUAL_POSITIONING.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="fleet-manual-page__copy-p">
              {paragraph}
            </p>
          ))}
          <ul className="fleet-manual-page__features">
            {FLEET_MANUAL_FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <p className="fleet-manual-page__contrast">
            The Fleet Manual is practical implementation — your cockpit operating system.
          </p>
        </div>
      </section>

      <section className="fleet-manual-page__acquire" aria-labelledby="fleet-manual-acquire-heading">
        <h2 id="fleet-manual-acquire-heading" className="fleet-manual-page__section-title">
          Acquire Professional License
        </h2>
        <FleetManualCheckout />
      </section>
    </div>
  );
}
