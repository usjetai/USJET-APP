import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FounderJetWing from "../components/founder/FounderJetWing";
import FounderProductLightbox from "../components/founder/FounderProductLightbox";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import {
  FOUNDER_PRODUCT_CALL_FOR_PRICE,
  FOUNDER_PRODUCT_ORDER_PHONE,
  FOUNDER_PRODUCT_ORDER_POLICY,
  FOUNDER_PRODUCTS,
  type FounderProduct,
} from "../data/founderProducts";
import { FOUNDER_PUBLIC_NAME } from "../data/founderManifesto";
import { DIRECT_FUEL_ROUTE } from "../data/directFuelCash";

export default function FounderProducts() {
  const [expandedProduct, setExpandedProduct] = useState<FounderProduct | null>(null);
  const closeExpandedProduct = useCallback(() => setExpandedProduct(null), []);

  useEffect(() => {
    const prev = document.title;
    document.title = `Founder Products · ${FOUNDER_PUBLIC_NAME} · USJET`;

    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="founder-page founder-page--warp founder-page--wing page-atmosphere page-nav-offset px-6 pb-28 sm:px-8">
      <div className="founder-page__wing-grid">
        <FounderJetWing side="left" />

        <div className="founder-page__center">
          <article className="founder-products founder-page__main">
            <header className="founder-products__hero">
              <img
                className="founder-products__hero-bag"
                src="/founder/lvbag.png"
                alt="Founder LV bag"
                loading="eager"
                decoding="async"
              />
              <p className="founder-products__kicker">Founder vault</p>
              <h1 className="founder-products__title">Product lineup</h1>
              <p className="founder-products__lede">
                {FOUNDER_PRODUCTS.length} pieces from the founder&apos;s collection — grit turned
                into gold, hung on the wall and worn on the wrist.
              </p>

              <GlassEffectContainer
                className={[
                  "founder-products__order-panel",
                  "glass-effect",
                  "glass-effect--rounded-rect",
                  "liquid-glass-background",
                  "glass-tint-cyan",
                ].join(" ")}
              >
                <p className="founder-products__order-eyebrow">Order policy</p>
                <ul className="founder-products__order-list">
                  <li>{FOUNDER_PRODUCT_ORDER_POLICY.pricing}</li>
                  <li>{FOUNDER_PRODUCT_ORDER_POLICY.delivery}</li>
                  <li>{FOUNDER_PRODUCT_ORDER_POLICY.payment}</li>
                </ul>
                <div className="founder-products__order-actions">
                  <a
                    href={`tel:${FOUNDER_PRODUCT_ORDER_PHONE}`}
                    className="founder-products__order-phone btn-glass-prominent glass-effect-interactive"
                  >
                    {FOUNDER_PRODUCT_ORDER_POLICY.phoneLabel}
                  </a>
                  <Link
                    to={DIRECT_FUEL_ROUTE}
                    className="founder-products__order-cash btn-glass glass-effect-interactive glass-tint-cyan"
                  >
                    Pay via Cash App
                  </Link>
                </div>
              </GlassEffectContainer>

              <Link
                to="/founder"
                className="founder-products__back btn-glass glass-effect-interactive glass-tint-cyan"
              >
                ← Back to founder story
              </Link>
            </header>

            <ul className="founder-products__grid">
              {FOUNDER_PRODUCTS.map((product) => (
                <li key={product.id} className="founder-products__card-wrap">
                  <GlassEffectContainer
                    className={[
                      "founder-products__card",
                      "glass-effect",
                      "glass-effect--rounded-rect",
                      "liquid-glass-background",
                      "glass-tint-cyan",
                    ].join(" ")}
                  >
                    <figure className="founder-products__figure">
                      <button
                        type="button"
                        className="founder-products__image-button glass-effect-interactive"
                        onClick={() => setExpandedProduct(product)}
                        aria-label={`View enlarged ${product.title}`}
                      >
                        <span className="founder-products__image-frame">
                          <img
                            className="founder-products__image"
                            src={product.imageSrc}
                            alt={product.imageAlt}
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      </button>
                      <figcaption className="founder-products__caption">
                        <span className="founder-products__item-kicker">{product.kicker}</span>
                        <span className="founder-products__item-title">{product.title}</span>
                        <span className="founder-products__item-price">
                          {FOUNDER_PRODUCT_CALL_FOR_PRICE}
                        </span>
                      </figcaption>
                    </figure>
                  </GlassEffectContainer>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <FounderJetWing side="right" />
      </div>

      <FounderProductLightbox
        product={expandedProduct}
        onClose={closeExpandedProduct}
      />
    </div>
  );
}
