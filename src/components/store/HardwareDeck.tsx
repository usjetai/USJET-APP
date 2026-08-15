import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import GlassEffectContainer from "../layout/GlassEffectContainer";
import HardwareCartButton from "./HardwareCartButton";
import HardwareCartDrawer from "./HardwareCartDrawer";
import { useHardwareCart } from "../../context/HardwareCartContext";
import {
  BUSINESS_DECK,
  FLEET_HARDWARE_ROUTE,
  HANGAR_HARDWARE_ROUTE,
  HARDWARE_HERO_KICKER,
  HARDWARE_HERO_LEDE,
  HARDWARE_HERO_TITLE,
  HARDWARE_PRODUCTS,
  HOME_DECK,
  OPERATOR_SETUP_PROMISE,
  OPERATOR_STACK,
  WHY_USJET_HARDWARE,
  formatUsd,
  hardwareProductsByMission,
  type HardwareMission,
  type HardwareProduct,
} from "../../data/aiHardware";

const OPS_MAIL = "mailto:ops@usjet.ai?subject=USJET%20Operator%27s%20Rig%20order";

function ProductCard({ product }: { product: HardwareProduct }) {
  const { addToCart } = useHardwareCart();
  const paymentLink = product.stripePaymentLink?.trim() ?? "";
  return (
    <GlassEffectContainer
      id={product.id}
      className="hw-card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
    >
      {product.badge && <span className="hw-card__badge">{product.badge}</span>}
      <div className="hw-card__media">
        <img
          src={product.imageSrc}
          alt={`${product.brand} ${product.name} ${product.configLabel}`}
          width={1200}
          height={750}
        />
      </div>
      <div className="hw-card__body">
        <p className="hw-card__brand">{product.brand}</p>
        <h3 className="hw-card__name">{product.name}</h3>
        <p className="hw-card__config">{product.configLabel}</p>

        <ul className="hw-card__specs">
          {product.specs.map((spec) => (
            <li key={spec}>{spec}</li>
          ))}
        </ul>

        <p className="hw-card__good-for">
          <strong>Good for:</strong> {product.goodFor}
        </p>
        <p className="hw-card__blurb">{product.blurb}</p>

        <div className="hw-card__footer">
          <span className="hw-card__price">{formatUsd(product.priceUsd)}</span>
          {product.contactToOrder ? (
            <a href={OPS_MAIL} className="hw-card__add btn-glass glass-effect-interactive">
              Talk to USJET
            </a>
          ) : (
            <div className="hw-card__actions">
              {paymentLink ? (
                <a
                  href={paymentLink}
                  className="hw-card__add btn-glass-prominent glass-effect-interactive"
                  data-usjet-external-leak="true"
                >
                  Buy now
                </a>
              ) : null}
              <button
                type="button"
                className="hw-card__add btn-glass glass-effect-interactive"
                onClick={() => addToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </GlassEffectContainer>
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
};

export default function HardwareDeck({ mission }: HardwareDeckProps) {
  const deck =
    mission === "business" ? BUSINESS_DECK : mission === "home" ? HOME_DECK : {
      kicker: HARDWARE_HERO_KICKER,
      title: HARDWARE_HERO_TITLE,
      lede: HARDWARE_HERO_LEDE,
      primerTitle: "Hangar is home. Fleet is business.",
      primer: [
        ...HOME_DECK.primer.slice(0, 1),
        "Hangar = computers for the house. Fleet = computers and servers for the shop and the office.",
        ...BUSINESS_DECK.primer.slice(0, 1),
      ],
    };
  const products =
    mission === "all" ? [...HARDWARE_PRODUCTS] : hardwareProductsByMission(mission);
  const otherTo = mission === "home" ? FLEET_HARDWARE_ROUTE : HANGAR_HARDWARE_ROUTE;
  const otherLabel =
    mission === "all"
      ? null
      : mission === "home"
        ? "Shop business computers →"
        : "Shop home computers →";

  useEffect(() => {
    const previous = document.title;
    document.title =
      mission === "home"
        ? "Hangar · Home AI Computers · USJet.ai"
        : mission === "business"
          ? "Fleet · Business AI Computers · USJet.ai"
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
                Hangar · Home
              </Link>
              <Link to={FLEET_HARDWARE_ROUTE} className="hw-mission-switch glass-effect-interactive">
                Fleet · Business
              </Link>
            </>
          )}
        </div>
      </header>

      <CheckoutBanner />

      <section className="hw-primer" aria-labelledby="hw-primer-heading">
        <h2 id="hw-primer-heading">{deck.primerTitle}</h2>
        <ol>
          {deck.primer.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <section className="hw-why" aria-labelledby="hw-why-heading">
        <p className="usjet-store__kicker">{WHY_USJET_HARDWARE.kicker}</p>
        <h2 id="hw-why-heading">{WHY_USJET_HARDWARE.title}</h2>
        <div className="hw-why__grid">
          {WHY_USJET_HARDWARE.points.map((point) => (
            <GlassEffectContainer
              key={point.title}
              className="hw-why__card glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan"
            >
              <h3>{point.title}</h3>
              <p>{point.body}</p>
            </GlassEffectContainer>
          ))}
        </div>
      </section>

      <section className="hw-stack" aria-labelledby="hw-stack-heading">
        <h2 id="hw-stack-heading">What is already on the machine</h2>
        <p className="hw-stack__lede">
          Other sellers ship a computer and a shrug. We ship a stack. You paid for the hours someone else would have
          spent in the terminal.
        </p>
        <div className="hw-stack__grid">
          {OPERATOR_STACK.map((layer) => (
            <GlassEffectContainer
              key={layer.id}
              className="hw-stack__card glass-effect glass-effect--rounded-rect liquid-glass-background"
            >
              <p className="hw-stack__layer">{layer.layer}</p>
              <h3>{layer.name}</h3>
              <p>{layer.plain}</p>
            </GlassEffectContainer>
          ))}
        </div>
        <p className="hw-page__fulfillment-note">
          <strong>{OPERATOR_SETUP_PROMISE.title}.</strong> {OPERATOR_SETUP_PROMISE.body} Every order is purchased by
          USJET — exact SKU, Amazon-sourced, boxed, and sent to your address. No dropship substitutions.
        </p>
      </section>

      <section className="usjet-store__section" aria-labelledby="hw-catalog-heading">
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
