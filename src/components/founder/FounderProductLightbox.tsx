import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { FounderProduct } from "../../data/founderProducts";
import { FOUNDER_PRODUCT_CALL_FOR_PRICE } from "../../data/founderProducts";

type FounderProductLightboxProps = {
  product: FounderProduct | null;
  onClose: () => void;
};

export default function FounderProductLightbox({ product, onClose }: FounderProductLightboxProps) {
  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!product) return undefined;
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [product, handleKey]);

  if (!product || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="founder-product-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${product.title} enlarged view`}
    >
      <button
        type="button"
        className="founder-product-lightbox__backdrop"
        aria-label="Close enlarged view"
        onClick={onClose}
      />
      <div className="founder-product-lightbox__dialog">
        <button
          type="button"
          className="founder-product-lightbox__close btn-glass glass-effect-interactive"
          onClick={onClose}
        >
          <X size={18} aria-hidden />
          <span className="founder-product-lightbox__close-label">Close</span>
        </button>
        <figure className="founder-product-lightbox__figure">
          <div className="founder-product-lightbox__image-wrap">
            <img
              className="founder-product-lightbox__image"
              src={product.imageSrc}
              alt={product.imageAlt}
              decoding="async"
            />
          </div>
          <figcaption className="founder-product-lightbox__caption">
            <span className="founder-product-lightbox__kicker">{product.kicker}</span>
            <span className="founder-product-lightbox__title">{product.title}</span>
            <span className="founder-product-lightbox__price">{FOUNDER_PRODUCT_CALL_FOR_PRICE}</span>
          </figcaption>
        </figure>
      </div>
    </div>,
    document.body,
  );
}
