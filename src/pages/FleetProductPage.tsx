import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import AircraftIcon from "../components/icons/AircraftIcons";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { getFleetBayAccent, fleetBayAccentStyle } from "../data/fleetBayAccents";
import { getFleetDirectoryEntryBySlug } from "../data/fleetDirectorySeo";
import { getFleetUnitById } from "../data/fleetManifest";
import DeveloperRedBlinkName from "../components/DeveloperRedBlinkName";
import { integratedLaunchUrl } from "../lib/fleetLaunchUrl";
import { FleetLaunchLink } from "../lib/fleetLaunchLink";
import { logFleetUsageIfMember } from "../lib/fleetUsageHistory";
import { resolveSr71BlackbirdProductPaymentLink } from "../lib/stripePaymentLink";

/**
 * Optional product display imagery, keyed by the aircraft slug used in `/product/:slug`.
 * Add another entry here to surface a product photo in the hero for that fleet bay.
 */
const PRODUCT_IMAGE_BY_AIRCRAFT_SLUG: Record<string, { src: string; alt: string }> = {
  "sr-71-blackbird": {
    src: "/fleet/sr-71-blackbird-product.webp",
    alt: "SR-71 Blackbird alloy pull-back model — white and black variants on a blue sky backdrop.",
  },
};

/**
 * Optional merchandise / model specifications, keyed by aircraft slug.
 * Rendered as a spec panel on the product page when present.
 */
const PRODUCT_SPECS_BY_AIRCRAFT_SLUG: Record<string, { label: string; value: string }[]> = {
  "sr-71-blackbird": [
    { label: "Brand name", value: "MINI AUTO" },
    { label: "Choice", value: "Yes" },
    { label: "Features", value: "Diecast" },
    { label: "High-concerned chemical", value: "None" },
    { label: "Is electric", value: "Button battery" },
    { label: "Material", value: "Metal" },
    { label: "Origin", value: "Mainland China" },
    { label: "Recommended age", value: "14+ yrs" },
    { label: "Type", value: "Fighter" },
  ],
};

/**
 * Optional Stripe Payment Link (Direct Landing Protocol) for an aircraft's product page.
 * When present, a "Buy" button appears in the hero alongside the launch action.
 */
const PRODUCT_STRIPE_LINK_BY_AIRCRAFT_SLUG: Record<string, () => string> = {
  "sr-71-blackbird": resolveSr71BlackbirdProductPaymentLink,
};

export default function FleetProductPage() {
  const { callsign = "" } = useParams<{ callsign: string }>();
  const entry = getFleetDirectoryEntryBySlug(callsign);
  const unit = entry ? getFleetUnitById(entry.unitId) : undefined;
  const bayAccent = useMemo(() => (entry ? getFleetBayAccent(entry.slot) : null), [entry]);

  useEffect(() => {
    const prev = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";

    if (entry) {
      document.title = `${entry.callsign} Product · USJET`;
      meta?.setAttribute("content", `Product page for ${entry.callsign} — ${entry.name}. ${entry.seoDescription}`);
    } else {
      document.title = "Product page not found | USJET";
      meta?.setAttribute("content", "USJET product page not found.");
    }

    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
    };
  }, [entry]);

  if (!entry || !unit || !bayAccent) {
    return (
      <div className="product-page page-atmosphere page-nav-offset mx-auto max-w-4xl px-4 pb-32 pt-2 sm:px-6 lg:px-8">
        <GlassEffectContainer className="product-page__missing glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <p className="product-page__eyebrow">USJET product page</p>
          <h1 className="product-page__title">Product not found</h1>
          <p className="product-page__lede">
            This product page does not exist for the selected call sign. Return to the directory and choose another AI.
          </p>
          <Link to="/fleet-directory" className="product-page__back btn-glass glass-effect-interactive">
            Back to Jet Fighter directory
          </Link>
        </GlassEffectContainer>
      </div>
    );
  }

  const bayLabel = String(entry.slot + 1).padStart(2, "0");
  const available = entry.rosterStatus === "available";
  const launchUrl = available
    ? "#"
    : integratedLaunchUrl(entry.domain, entry.href, entry.slot, {
        label: entry.name,
        returnTo: `/product/${entry.aircraftSlug}`,
      });
  const displayAircraftType = unit.aircraftType;
  const productImage = PRODUCT_IMAGE_BY_AIRCRAFT_SLUG[entry.aircraftSlug];
  const productSpecs = PRODUCT_SPECS_BY_AIRCRAFT_SLUG[entry.aircraftSlug];
  const productStripeLink = PRODUCT_STRIPE_LINK_BY_AIRCRAFT_SLUG[entry.aircraftSlug]?.();

  return (
    <div
      className="product-page page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-2 sm:px-6 lg:px-8"
      style={fleetBayAccentStyle(entry.slot)}
    >
      <Link to="/fleet-directory" className="product-page__backlink glass-effect-interactive">
        &larr; Jet Fighter directory
      </Link>

      <GlassEffectContainer className="product-page__hero glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-gold">
        <section className="product-page__grid">
          <div className="product-page__copy">
            <p className="product-page__eyebrow">
              USJET product page · Bay {bayLabel}
              {available ? " · Available position" : ` · ${entry.aircraftOfficialName}`}
            </p>
            <h1 className="product-page__title">{entry.callsign} Product</h1>
            <p className="product-page__name">
              <DeveloperRedBlinkName name={entry.name} />
            </p>
            <p className="product-page__aircraft-type">{entry.aircraftOfficialName}</p>
            <p className="product-page__lede">{entry.seoDescription}</p>

            <div className="product-page__actions">
              {!available ? (
                <>
                  <FleetLaunchLink
                    launchUrl={launchUrl}
                    className="product-page__launch btn-glass-prominent glass-effect-interactive"
                    onClick={() => logFleetUsageIfMember(entry.callsign, entry.name)}
                  >
                    Launch {entry.callsign}
                  </FleetLaunchLink>
                  {productStripeLink ? (
                    <a
                      href={productStripeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="product-page__buy btn-glass-prominent glass-effect-interactive"
                    >
                      Buy {entry.aircraftOfficialName}
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      title="Buy link coming soon"
                      className="product-page__buy product-page__buy--coming-soon btn-glass opacity-60 cursor-not-allowed"
                    >
                      Buy {entry.aircraftOfficialName} · Coming soon
                    </button>
                  )}
                  <Link to="/fleet-directory" className="product-page__secondary btn-glass glass-effect-interactive">
                    All call names
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/founders-fuel" className="product-page__launch btn-glass-prominent glass-effect-interactive">
                    Fuel the fleet
                  </Link>
                  <Link to="/fleet-directory" className="product-page__secondary btn-glass glass-effect-interactive">
                    All call names
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="product-page__aircraft" aria-hidden={productImage ? undefined : true}>
            {productImage ? (
              <img
                src={productImage.src}
                alt={productImage.alt}
                className="product-page__product-image"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <AircraftIcon
                aircraftType={displayAircraftType}
                accentId={`${displayAircraftType}-${entry.slug}`}
                className="product-page__icon"
              />
            )}
          </div>
        </section>
      </GlassEffectContainer>

      <section className="product-page__details" aria-label={`${entry.callsign} product profile`}>
        <GlassEffectContainer className="product-page__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <p className="product-page__label">Product name</p>
          <h2>{entry.callsign} · {entry.aircraftOfficialName}</h2>
          <p>
            <DeveloperRedBlinkName name={entry.name} /> is available through the USJET product runway with integrated cockpit navigation.
          </p>
        </GlassEffectContainer>

        {productSpecs ? (
          <GlassEffectContainer className="product-page__panel product-page__panel--specs glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
            <p className="product-page__label">Model specifications</p>
            <h2>{entry.aircraftOfficialName} · Diecast model</h2>
            <dl className="product-page__spec-list">
              {productSpecs.map((spec) => (
                <div key={spec.label} className="product-page__spec">
                  <dt className="product-page__spec-label">{spec.label}</dt>
                  <dd className="product-page__spec-value">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </GlassEffectContainer>
        ) : null}
      </section>
    </div>
  );
}
