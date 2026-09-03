import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ShoppingCart, XCircle } from "lucide-react";
import HardwareCartButton from "./HardwareCartButton";
import HardwareCartDrawer from "./HardwareCartDrawer";
import { useHardwareCart } from "../../context/HardwareCartContext";
import { trackEvent } from "../../lib/analytics";
import {
  BUSINESS_DECK,
  FLEET_HARDWARE_ROUTE,
  HANGAR_HARDWARE_ROUTE,
  HARDWARE_BUSINESSES_ROUTE,
  HARDWARE_HOMES_ROUTE,
  HARDWARE_HERO_KICKER,
  HARDWARE_HERO_LEDE,
  HARDWARE_HERO_TITLE,
  HARDWARE_PRODUCTS,
  HARDWARE_RESERVATIONS_NOTICE,
  HARDWARE_RESERVATIONS_ONLY,
  HOME_DECK,
  OPERATOR_SETUP_PROMISE,
  OPERATOR_STACK,
  WHAT_WE_DO_TO_THE_COMPUTER,
  WHY_USJET_HARDWARE,
  formatUsdParts,
  hardwareProductsByMission,
  type HardwareMission,
  type HardwareProduct,
} from "../../data/aiHardware";

const OPS_MAIL = "mailto:ops@usjet.ai?subject=USJET%20Operator%27s%20Rig%20order";

function ProductCard({ product }: { product: HardwareProduct }) {
  const { addToCart } = useHardwareCart();
  const paymentLink = product.stripePaymentLink?.trim() ?? "";
  const price = formatUsdParts(product.priceUsd);
  const listingTitle = `${product.brand} ${product.name} ${product.configLabel} — Operator's Rig`;
  return (
    <article id={product.id} className="hw-card">
      <div className="hw-card__media">
        <img
          src={product.imageSrc}
          alt={listingTitle}
          width={640}
          height={480}
        />
      </div>
      <div className="hw-card__body">
        {HARDWARE_RESERVATIONS_ONLY ? (
          <Link className="hw-card__title" to="/waiting-list">
            {product.badge ? <em className="hw-card__condition">{product.badge}</em> : null} {listingTitle}
          </Link>
        ) : (
          <a
            className="hw-card__title"
            href={paymentLink || OPS_MAIL}
            data-usjet-external-leak={paymentLink ? "true" : undefined}
          >
            {product.badge ? <em className="hw-card__condition">{product.badge}</em> : null} {listingTitle}
          </a>
        )}
        <p className="hw-card__specs">
          {product.specs.slice(0, 4).map((spec) => (
            <span key={spec}>{spec}</span>
          ))}
        </p>
        {HARDWARE_RESERVATIONS_ONLY ? (
          <p className="hw-card__ship">Next generation · price on reservation</p>
        ) : (
          <>
            <div className="hw-card__price">
              <span className="hw-card__price-mark">$</span>
              <strong>{price.dollars}</strong>
              <sup>.{price.cents}</sup>
            </div>
            <p className="hw-card__ship">Ships talking · free</p>
          </>
        )}
        {/* NY GBL 218-a: the refund policy must be displayed or linked near the
            item itself, or before billing information is requested. This line
            sits above the buy control on every card for that reason. Do not
            move it into the footer. */}
        <p className="hw-card__ship hw-card__policy">
          <Link to="/returns">14-day returns</Link>
          {" · "}
          <Link to="/warranty">90-day warranty</Link>
        </p>
        {HARDWARE_RESERVATIONS_ONLY ? (
          <Link
            to="/waiting-list"
            className="hw-card__cart-btn"
            onClick={() => trackEvent("reserve_click", { placement: "card", rig: product.name })}
          >
            Reserve a rig
          </Link>
        ) : product.contactToOrder ? (
          <a href={OPS_MAIL} className="hw-card__cart-btn">
            Talk to USJET
          </a>
        ) : (
          <div className="hw-card__actions">
            <button type="button" className="hw-card__cart-btn" onClick={() => addToCart(product.id)}>
              <ShoppingCart size={16} aria-hidden />
              Get this rig
            </button>
            {paymentLink ? (
              <a href={paymentLink} className="hw-card__buy-link" data-usjet-external-leak="true">
                Buy now
              </a>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}

function CheckoutBanner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { clearCart } = useHardwareCart();
  const checkoutState = searchParams.get("checkout");

  useEffect(() => {
    if (checkoutState === "success") {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutState]);

  if (!checkoutState) {
    return null;
  }

  function dismiss() {
    const next = new URLSearchParams(searchParams);
    next.delete("checkout");
    next.delete("session_id");
    setSearchParams(next, { replace: true });
  }

  if (checkoutState === "success") {
    return (
      <div className="hw-banner hw-banner--success" role="status">
        <CheckCircle2 size={18} aria-hidden />
        <p>
          Order received. We buy your exact unit, load it as an Operator&apos;s Rig, and ship it to the address you
          gave Stripe. Confirmation follows by email.
        </p>
        <button type="button" onClick={dismiss} aria-label="Dismiss">
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="hw-banner hw-banner--cancelled" role="status">
      <XCircle size={18} aria-hidden />
      <p>Checkout was cancelled. Your cart is still saved.</p>
      <button type="button" onClick={dismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

type HardwareDeckProps = {
  mission: HardwareMission | "all";
  catalog?: "site" | "store";
  /** Homes film already carries the pitch — skip the duplicate kicker/title. */
  omitHero?: boolean;
};

export default function HardwareDeck({ mission, catalog = "site", omitHero = false }: HardwareDeckProps) {
  const deck =
    mission === "business" ? BUSINESS_DECK : mission === "home" ? HOME_DECK : {
      kicker: HARDWARE_HERO_KICKER,
      title: HARDWARE_HERO_TITLE,
      lede: HARDWARE_HERO_LEDE,
      primerTitle: "What we do to these computers",
      primer: [
        ...HOME_DECK.primer.slice(0, 1),
        "Homes = computers for the house. Business = computers and servers for the shop and the office.",
        ...BUSINESS_DECK.primer.slice(0, 1),
      ],
    };
  const products =
    mission === "all" ? [...HARDWARE_PRODUCTS] : hardwareProductsByMission(mission);
  const otherTo =
    catalog === "store"
      ? mission === "home"
        ? HARDWARE_BUSINESSES_ROUTE
        : HARDWARE_HOMES_ROUTE
      : mission === "home"
        ? FLEET_HARDWARE_ROUTE
        : HANGAR_HARDWARE_ROUTE;
  const otherLabel =
    mission === "all"
      ? null
      : mission === "home"
        ? "Shop Business →"
        : "Shop Homes →";

  // Title, meta description, canonical, OG tags, and JSON-LD for this route are all
  // owned centrally by <SeoHead> (src/components/layout/SeoHead.tsx) via ROUTE_SEO in
  // src/data/siteSeo.ts. This component used to also set document.title + meta
  // description locally, which raced with SeoHead and usually won, overwriting the
  // longer keyword-targeted title ("AI Computers for Homes — Mac Mini, MacBook, Mini
  // PC | USJET.AI") with a shorter one that dropped the product keywords from the
  // actual <title> tag search engines read. Removed to avoid the two fighting.

  return (
    <div className="usjet-store-page hw-page hw-page--deck page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-4 sm:px-6 lg:px-8">
      {/* Nothing on this deck is orderable right now. Say so at the top, before
          anyone reads a spec sheet and forms an intention we cannot fulfil. */}
      {HARDWARE_RESERVATIONS_ONLY ? (
        <aside className="mb-8 rounded-lg border border-amber-300/35 bg-amber-300/10 px-5 py-4">
          <p className="text-sm font-semibold text-amber-100">{HARDWARE_RESERVATIONS_NOTICE.title}</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/70">
            {HARDWARE_RESERVATIONS_NOTICE.body}
          </p>
          <Link
            to={HARDWARE_RESERVATIONS_NOTICE.href}
            className="mt-3 inline-block rounded-md bg-amber-300/90 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-200"
            onClick={() => trackEvent("reserve_click", { placement: "deck_notice" })}
          >
            {HARDWARE_RESERVATIONS_NOTICE.cta}
          </Link>
        </aside>
      ) : null}
      {omitHero ? (
        <div className="hw-hero hw-hero--after-film">
          <div className="hw-hero__cart">
            <HardwareCartButton />
            {otherLabel ? (
              <Link to={otherTo} className="hw-mission-switch glass-effect-interactive">
                {otherLabel}
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <header className="usjet-store__hero hw-hero">
          <p className="usjet-store__kicker">{deck.kicker}</p>
          <h1 className="usjet-store__title usjet-logo-stone">{deck.title}</h1>
          <p className="usjet-store__lede">{deck.lede}</p>
          <div className="hw-hero__cart">
            <HardwareCartButton />
            {otherLabel ? (
              <Link to={otherTo} className="hw-mission-switch glass-effect-interactive">
                {otherLabel}
              </Link>
            ) : (
              <>
                <Link to={HANGAR_HARDWARE_ROUTE} className="hw-mission-switch glass-effect-interactive">
                  Homes
                </Link>
                <Link to={FLEET_HARDWARE_ROUTE} className="hw-mission-switch glass-effect-interactive">
                  Business
                </Link>
              </>
            )}
          </div>
        </header>
      )}

      <CheckoutBanner />

      <section className="hw-about" aria-labelledby="hw-about-heading">
        <p className="hw-about__kicker">{WHY_USJET_HARDWARE.kicker}</p>
        <h2 id="hw-about-heading">{deck.primerTitle}</h2>
        <div className="hw-info-tiles">
          {WHAT_WE_DO_TO_THE_COMPUTER.map((row) => (
            <article className="hw-info-tile" key={row.label}>
              <h3>{row.label}</h3>
              <p>{row.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hw-about" aria-labelledby="hw-stack-heading">
        <h2 id="hw-stack-heading">What we put on it</h2>
        <p className="hw-about__lede">
          Other sellers ship a mute computer. We ship a personal Jarvis already living on the box.
        </p>
        <dl className="hw-about__table">
          {OPERATOR_STACK.map((layer) => (
            <div className="hw-about__row" key={layer.id}>
              <dt>
                <span className="hw-about__layer">{layer.layer}</span>
                {layer.name}
              </dt>
              <dd>{layer.plain}</dd>
            </div>
          ))}
        </dl>
        <p className="hw-page__fulfillment-note">
          <strong>{OPERATOR_SETUP_PROMISE.title}</strong> {OPERATOR_SETUP_PROMISE.body} Every order is purchased by
          USJET — exact SKU, Amazon-sourced, boxed, and sent to your address. No dropship substitutions.
        </p>
        <p className="hw-page__fulfillment-note">
          <strong>Before you buy.</strong> Rigs ship within 10 business days of cleared payment. Returns are accepted
          within 14 days in original condition, buyer pays return shipping, and opened units carry a 10% restocking
          fee — full terms at <Link to="/returns">/returns</Link>. The configuration carries a 90-day USJET{" "}
          <Link to="/warranty">Limited Warranty</Link>; the Apple hardware carries Apple's own one-year warranty,
          which began on USJET's purchase date rather than your delivery date.
        </p>
      </section>

      <section className="usjet-store__section" id="hw-catalog" aria-labelledby="hw-catalog-heading">
        <div className="usjet-store__section-head">
          <h2 id="hw-catalog-heading">
            {mission === "home" ? "Home lineup" : mission === "business" ? "Business lineup" : "Full lineup"}
          </h2>
        </div>
        <div className="hw-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <HardwareCartDrawer />
    </div>
  );
}
