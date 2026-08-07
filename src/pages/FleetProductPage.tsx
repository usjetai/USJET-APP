import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { getFleetBayAccent, fleetBayAccentStyle } from "../data/fleetBayAccents";
import { getFleetDirectoryEntryBySlug } from "../data/fleetDirectorySeo";
import { getFleetUnitById } from "../data/fleetManifest";
import DeveloperRedBlinkName from "../components/DeveloperRedBlinkName";
import HiredHudDeveloperAvatar from "../components/hiredHud/HiredHudDeveloperAvatar";
import { fleetLaunchUrl } from "../lib/fleetLaunchUrl";
import { getHiredDeveloperProductAvatarPath } from "../lib/hiredHudDeveloperAvatars";
import { FleetLaunchLink } from "../lib/fleetLaunchLink";
import { logFleetUsageIfMember } from "../lib/fleetUsageHistory";
import { resolveFleetProductLineup } from "../lib/fleetProductMedia";
import {
  resolveB21RaiderProductPaymentLink,
  resolveF35LightningIiProductPaymentLink,
  resolveJ36ProductPaymentLink,
  resolveSr71BlackbirdProductPaymentLink,
} from "../lib/stripePaymentLink";
import { USJET_STORE_BOOKS, STORE_ROUTE, amazonKindleUrl } from "../data/usjetStore";
import { wrapExternalInCockpit } from "../lib/fleetLaunchUrl";
import { BookOpen, ExternalLink } from "lucide-react";

/**
 * Optional product lede copy, keyed by aircraft slug.
 * Falls back to the directory seoDescription when absent.
 */
const PRODUCT_LEDE_BY_AIRCRAFT_SLUG: Record<string, string> = {
  "f-35-lightning-ii":
    "This realistic plastic model kit of the F-35 Lightning II has a 7\" wingspan, measures 8.5\" long, features fine detail including full-color markings and retractable landing gear. This model kit includes everything needed for assembly and can be easily assembled in about 10 minutes.",
  "sr-71-blackbird":
    "This realistic plastic model kit of the SR-71 Blackbird has a 5.5\" wingspan, measures 10.5\" in length, features full-color markings and retractable landing gear. Model kit includes everything needed for assembly and can be easily assembled in about 10 minutes.",
  "b-21-raider":
    "Bring next-generation aerospace engineering to your workspace with this B-21 Raider stealth bomber 3D print model. Inspired by the U.S. Air Force's most advanced long-range strike aircraft, this model captures the Raider's sleek, flying-wing design and low-observable geometry with precision and realism. Includes a display stand showcasing \"B-21 Raider\". Dimensions: roughly L 14\" × W 6\" × H 5\". A great piece for aerospace enthusiasts — this model is very accurate to the real aircraft.",
  "j-36":
    "This realistic J-36 sixth-generation concept fighter model features a tailless delta-wing stealth profile, splinter camouflage finish, full-color 36011 markings, and a clear canopy with pilot figure. Includes a display stand for desk or shelf presentation — a sharp piece for US next-gen fighter enthusiasts and sovereign fleet collectors.",
};

/**
 * Optional model kind label for the specs panel heading (e.g. "Diecast model").
 */
const PRODUCT_MODEL_KIND_BY_AIRCRAFT_SLUG: Record<string, string> = {
  "sr-71-blackbird": "Plastic model kit",
  "f-35-lightning-ii": "Plastic model kit",
  "b-21-raider": "3D print model",
  "j-36": "Concept fighter model",
};

/**
 * Optional merchandise / model specifications, keyed by aircraft slug.
 * Rendered as a spec panel on the product page when present.
 */
const PRODUCT_SPECS_BY_AIRCRAFT_SLUG: Record<string, { label: string; value: string }[]> = {
  "f-35-lightning-ii": [
    { label: "Detail", value: "Highly detailed plastic model (assembly required)" },
    { label: "Scale", value: "1:72" },
    { label: "Includes", value: "Display stand" },
  ],
  "sr-71-blackbird": [
    { label: "Detail", value: "Highly detailed plastic model (assembly required)" },
    { label: "Scale", value: "1:72" },
    { label: "Includes", value: "Display stand" },
  ],
  "b-21-raider": [
    { label: "Maker", value: "21coinDesign" },
    { label: "Materials", value: "3D print" },
    { label: "Includes", value: "Display stand (\"B-21 Raider\")" },
    { label: "Dimensions", value: "~L 14\" × W 6\" × H 5\"" },
    { label: "Detail", value: "Highly accurate to the real aircraft" },
  ],
  "j-36": [
    { label: "Detail", value: "Sixth-gen concept fighter with splinter camo and 36011 markings" },
    { label: "Includes", value: "Display stand and clear canopy with pilot figure" },
    { label: "Finish", value: "Full-color camouflage and roundel detail" },
  ],
};

/**
 * Optional product price display, keyed by aircraft slug.
 * Shown in the hero above the action buttons when present.
 */
const PRODUCT_PRICE_BY_AIRCRAFT_SLUG: Record<string, string> = {
  "b-21-raider": "$90",
  "f-35-lightning-ii": "$40",
  "j-36": "$65",
  "sr-71-blackbird": "$45",
};

/**
 * Optional Stripe Payment Link (Direct Landing Protocol) for an aircraft's product page.
 * When present, a "Buy" button appears in the hero alongside the launch action.
 */
const PRODUCT_STRIPE_LINK_BY_AIRCRAFT_SLUG: Record<string, () => string> = {
  "b-21-raider": resolveB21RaiderProductPaymentLink,
  "f-35-lightning-ii": resolveF35LightningIiProductPaymentLink,
  "j-36": resolveJ36ProductPaymentLink,
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
      document.title = `${entry.name} Product · USJET`;
      meta?.setAttribute("content", `Product page for ${entry.name}. ${entry.seoDescription}`);
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

  const available = entry.rosterStatus === "available";
  const launchUrl = available
    ? "#"
    : fleetLaunchUrl(entry.domain, entry.href, entry.slot);
  const productLede = PRODUCT_LEDE_BY_AIRCRAFT_SLUG[entry.aircraftSlug] ?? entry.seoDescription;
  const productSpecs = PRODUCT_SPECS_BY_AIRCRAFT_SLUG[entry.aircraftSlug];
  const productModelKind = PRODUCT_MODEL_KIND_BY_AIRCRAFT_SLUG[entry.aircraftSlug] ?? "Model";
  const productPrice = PRODUCT_PRICE_BY_AIRCRAFT_SLUG[entry.aircraftSlug];
  const productStripeLink = PRODUCT_STRIPE_LINK_BY_AIRCRAFT_SLUG[entry.aircraftSlug]?.();
  const productLineup = resolveFleetProductLineup(entry.aircraftSlug);
  const developerAvatarPath = getHiredDeveloperProductAvatarPath(entry.slot);

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
              USJET product page
              {available ? (
                <>
                  {" · "}
                  <span className="developer-available-green-blink">Available position</span>
                </>
              ) : (
                ` · ${entry.aircraftOfficialName}`
              )}
            </p>
            <h1 className="product-page__title">{entry.name} Product</h1>
            <p className="product-page__name">
              <DeveloperRedBlinkName name={entry.name} fleetSlot={entry.slot} />
            </p>
            {developerAvatarPath ? (
              <div className="product-page__developer-profile">
                <HiredHudDeveloperAvatar slot={entry.slot} name={entry.name} variant="product" />
                <p className="product-page__developer-caption">Hired developer profile</p>
              </div>
            ) : null}
            <p className="product-page__aircraft-type">{entry.aircraftOfficialName}</p>
            <p className="product-page__lede">{productLede}</p>

            {productPrice ? (
              <>
                <p className="product-page__price" aria-label={`Price ${productPrice}`}>
                  {productPrice}
                </p>
                <p className="product-page__shipping" aria-label="Free shipping">
                  Free shipping
                </p>
              </>
            ) : null}

            <div className="product-page__actions">
              {!available ? (
                <>
                  <FleetLaunchLink
                    launchUrl={launchUrl}
                    className="product-page__launch btn-glass-prominent glass-effect-interactive"
                    onClick={() => logFleetUsageIfMember(entry.callsign, entry.name)}
                  >
                    Launch {entry.name}
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

          <div className="product-page__media" aria-label={`${entry.aircraftOfficialName} product media`}>
            {developerAvatarPath ? (
              <div className="product-page__media-avatar" aria-hidden>
                <img
                  src={developerAvatarPath}
                  alt=""
                  className="product-page__media-avatar-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}
            <div className="product-page__logo-wrap">
              <img
                src={entry.productLogo.src}
                alt={entry.productLogo.alt}
                className="product-page__logo logo-rounded"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div
              className={`product-page__photo-wrap${entry.productPhoto.isDedicatedProductPhoto ? "" : " product-page__photo-wrap--fallback"}`}
            >
              <img
                src={entry.productPhoto.src}
                alt={entry.productPhoto.alt}
                className={`product-page__product-image${entry.productPhoto.isDedicatedProductPhoto ? "" : " product-page__product-image--fallback"}`}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>
      </GlassEffectContainer>

      <section className="product-page__details" aria-label={`${entry.name} product profile`}>
        <GlassEffectContainer className="product-page__panel glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
          <p className="product-page__label">Product name</p>
          <h2>{entry.name} · {entry.aircraftOfficialName}</h2>
          <p>
            <DeveloperRedBlinkName name={entry.name} fleetSlot={entry.slot} /> is available through the USJET product runway with integrated cockpit navigation.
          </p>
        </GlassEffectContainer>

        {productSpecs ? (
          <GlassEffectContainer className="product-page__panel product-page__panel--specs glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
            <p className="product-page__label">Model specifications</p>
            <h2>{entry.aircraftOfficialName} · {productModelKind}</h2>
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

      {productLineup.length > 0 ? (
        <section className="product-page__lineup" aria-label={`${entry.name} product lineup`}>
          <p className="product-page__label">Product lineup</p>
          <h2 className="product-page__lineup-title">More from {entry.aircraftOfficialName}</h2>
          <div className="product-page__lineup-grid">
            {productLineup.map((item) => {
              const lineupStripeLink = item.resolveStripePaymentLink?.();
              return (
              <GlassEffectContainer
                key={item.id}
                className="product-page__lineup-item glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
              >
                <div className="product-page__lineup-grid-inner">
                  <div className="product-page__lineup-copy">
                    <p className="product-page__label">{item.kind}</p>
                    <h3 className="product-page__lineup-item-title">{item.title}</h3>
                    <p className="product-page__lede">{item.description}</p>
                    {item.price ? (
                      <>
                        <p className="product-page__price" aria-label={`Price ${item.price}`}>
                          {item.price}
                        </p>
                        <p className="product-page__shipping" aria-label="Free shipping">
                          Free shipping
                        </p>
                      </>
                    ) : null}
                    <div className="product-page__actions">
                      {lineupStripeLink ? (
                        <a
                          href={lineupStripeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="product-page__buy btn-glass-prominent glass-effect-interactive"
                        >
                          Buy {item.title}
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          title="Buy link coming soon"
                          className="product-page__buy product-page__buy--coming-soon btn-glass opacity-60 cursor-not-allowed"
                        >
                          Buy {item.title} · Coming soon
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="product-page__media" aria-label={`${item.title} product media`}>
                    <div className="product-page__photo-wrap">
                      <img
                        src={item.photo.src}
                        alt={item.photo.alt}
                        className="product-page__product-image"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </GlassEffectContainer>
            );
            })}
          </div>
        </section>
      ) : null}

      <section className="product-page__books mt-20" aria-label="Founder Engineering Series">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="product-page__label">Master Log Guidance</p>
            <h2 className="product-page__lineup-title text-3xl">USJET.AI Engineering Series</h2>
          </div>
          <Link 
            to={STORE_ROUTE} 
            className="btn-glass text-xs uppercase tracking-widest glass-effect-interactive"
          >
            Visit USJET Store
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {USJET_STORE_BOOKS.map((book) => {
            const amazonUrl = wrapExternalInCockpit(amazonKindleUrl(book.asin), {
              returnTo: `/product/${callsign}`,
              label: book.title,
              callName: "Kindle",
              directHandoff: true,
            });

            return (
              <GlassEffectContainer
                key={book.id}
                className="product-page__book-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan p-6 flex flex-col"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-20 shrink-0 aspect-[2/3] bg-white/5 rounded overflow-hidden">
                    <img 
                      src={book.coverSrc} 
                      alt={book.coverAlt} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-wider text-cyan-400/80 mb-1">{book.seriesLabel}</p>
                    <h3 className="text-sm font-bold text-white leading-tight mb-2">{book.title}</h3>
                    <p className="text-[0.7rem] text-white/60 line-clamp-2">{book.subtitle}</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link
                    to={amazonUrl}
                    className="btn-glass text-[0.65rem] w-full justify-center glass-effect-interactive py-2"
                  >
                    View on Amazon
                    <BookOpen size={12} className="ml-2" />
                  </Link>
                </div>
              </GlassEffectContainer>
            );
          })}
        </div>
      </section>
    </div>
  );
}
