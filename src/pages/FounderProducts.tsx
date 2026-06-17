import { useEffect } from "react";
import { Link } from "react-router-dom";
import FounderJetWing from "../components/founder/FounderJetWing";
import GlassEffectContainer from "../components/layout/GlassEffectContainer";
import { FOUNDER_PRODUCTS } from "../data/founderProducts";
import { FOUNDER_PUBLIC_NAME } from "../data/founderManifesto";

export default function FounderProducts() {
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
              <p className="founder-products__kicker">Founder vault</p>
              <h1 className="founder-products__title">Product lineup</h1>
              <p className="founder-products__lede">
                {FOUNDER_PRODUCTS.length} pieces from the founder&apos;s collection — grit turned
                into gold, hung on the wall and worn on the wrist.
              </p>
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
                      <div className="founder-products__image-frame">
                        <img
                          className="founder-products__image"
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <figcaption className="founder-products__caption">
                        <span className="founder-products__item-kicker">{product.kicker}</span>
                        <span className="founder-products__item-title">{product.title}</span>
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
    </div>
  );
}
