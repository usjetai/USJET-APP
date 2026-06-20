import { Link } from "react-router-dom";
import { FOUNDER_PRODUCTS } from "../../data/founderProducts";

type FounderProductsBeaconProps = {
  variant?: "hero" | "social";
};

/** Glowing product vault portal — founder luxury lineup. */
export default function FounderProductsBeacon({ variant = "hero" }: FounderProductsBeaconProps) {
  const isHero = variant === "hero";
  const pieceCount = FOUNDER_PRODUCTS.length;

  return (
    <Link
      to="/founder/products"
      className={[
        "founder-products-beacon",
        isHero ? "founder-products-beacon--hero" : "founder-products-beacon--social",
        "glass-effect-interactive",
      ].join(" ")}
      aria-label={`Founder product vault — ${pieceCount}-piece lineup`}
      title="Products · Founder vault"
    >
      <span className="founder-products-beacon__halo" aria-hidden />
      <span className="founder-products-beacon__orbit" aria-hidden />
      <span className="founder-products-beacon__shine" aria-hidden />
      <span className="founder-products-beacon__icon-wrap" aria-hidden>
        <img
          className="founder-products-beacon__icon"
          src="/founder/lvbag.png"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
      {isHero ? (
        <span className="founder-products-beacon__copy">
          <span className="founder-products-beacon__label">Products</span>
          <span className="founder-products-beacon__handle">{pieceCount} pieces</span>
        </span>
      ) : null}
    </Link>
  );
}
