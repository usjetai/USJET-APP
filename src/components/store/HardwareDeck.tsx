import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ShoppingCart, XCircle } from "lucide-react";
import HardwareCartButton from "./HardwareCartButton";
import HardwareCartDrawer from "./HardwareCartDrawer";
import { useHardwareCart } from "../../context/HardwareCartContext";
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
        <a
          className="hw-card__title"
          href={paymentLink || OPS_MAIL}
          data-usjet-external-leak={paymentLink ? "true" : undefined}
        >
          {product.badge ? <em className="hw-card__condition">{product.badge}</em> : null} {listingTitle}
        </a>
        <p className="hw-card__specs">
          {product.specs.slice(0, 4).map((spec) => (
            <span key={spec}>{spec}</span>
          ))}
        </p>
        <div className="hw-card__price">
          <span className="hw-card__price-mark">$</span>
          <strong>{price.dollars}</strong>
          <sup>.{price.cents}</sup>
        </div>
        <p className="hw-card__ship">Free Shipping</p>
        {product.contactToOrder ? (
          <a href={OPS_MAIL} className="hw-card__cart-btn">
            Talk to USJET
          </a>
        ) : (
          <div className="hw-card__actions">
            <button type="button" className="hw-card__cart-btn" onClick={() => addToCart(product.id)}>
              <ShoppingCart size={16} aria-hidden />
              Add to Cart
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
        "Hangar = computers for the house. Fleet = computers and servers for the shop and the office.",
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

  useEffect(() => {
    const previous = document.title;
    document.title =
      mission === "home"
        ? "Homes · AI Computers · USJet.ai"
        : mission === "business"
          ? "Business · AI Computers · USJet.ai"
          : "Operator's Rig · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", deck.lede);
    return () => {
      document.title = previous;
      meta?.setAttribute("content", previousDescription);
    };
  }, [deck.lede, mission]);

  return (
    <div className="usjet-store-page hw-page hw-page--deck page-atmosphere page-nav-offset mx-auto max-w-6xl px-4 pb-32 pt-4 sm:px-6 lg:px-8">
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
        <dl className="hw-about__table">
          {WHAT_WE_DO_TO_THE_COMPUTER.map((row) => (
            <div className="hw-about__row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.body}</dd>
            </div>
          ))}
        </dl>
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
