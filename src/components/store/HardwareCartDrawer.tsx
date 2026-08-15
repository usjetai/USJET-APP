import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useHardwareCart } from "../../context/HardwareCartContext";
import { formatUsd } from "../../data/aiHardware";

export default function HardwareCartDrawer() {
  const { lines, totalItems, totalUsd, isOpen, closeCart, setQuantity, removeFromCart } = useHardwareCart();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout() {
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/create-hardware-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setCheckoutError(data.error || "Checkout is not available right now.");
        setIsCheckingOut(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError("Could not reach checkout. Try again in a moment.");
      setIsCheckingOut(false);
    }
  }

  return (
    <>
      <div className={`hw-cart__scrim ${isOpen ? "hw-cart__scrim--open" : ""}`} onClick={closeCart} aria-hidden={!isOpen} />
      <aside
        className={`hw-cart__panel glass-effect liquid-glass-background ${isOpen ? "hw-cart__panel--open" : ""}`}
        aria-hidden={!isOpen}
        aria-label="Shopping cart"
      >
        <div className="hw-cart__header">
          <h2>
            <ShoppingCart size={16} aria-hidden />
            Cart
          </h2>
          <button type="button" className="hw-cart__close" onClick={closeCart} aria-label="Close cart">
            <X size={18} aria-hidden />
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="hw-cart__empty">Your cart is empty. Add a machine to get started.</p>
        ) : (
          <>
            <ul className="hw-cart__lines">
              {lines.map((line) => (
                <li key={line.productId} className="hw-cart__line">
                  <img
                    className="hw-cart__line-photo"
                    src={line.product.imageSrc}
                    alt=""
                    width={72}
                    height={72}
                  />
                  <div className="hw-cart__line-info">
                    <p className="hw-cart__line-name">{line.product.name}</p>
                    <p className="hw-cart__line-config">{line.product.configLabel}</p>
                    <p className="hw-cart__line-price">{formatUsd(line.product.priceUsd)}</p>
                  </div>
                  <div className="hw-cart__line-controls">
                    <div className="hw-cart__qty">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.productId, line.quantity - 1)}
                        aria-label={`Decrease quantity of ${line.product.name}`}
                      >
                        <Minus size={12} aria-hidden />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.productId, line.quantity + 1)}
                        aria-label={`Increase quantity of ${line.product.name}`}
                      >
                        <Plus size={12} aria-hidden />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="hw-cart__remove"
                      onClick={() => removeFromCart(line.productId)}
                      aria-label={`Remove ${line.product.name} from cart`}
                    >
                      <Trash2 size={14} aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="hw-cart__footer">
              <div className="hw-cart__total">
                <span>
                  {totalItems} item{totalItems === 1 ? "" : "s"}
                </span>
                <span className="hw-cart__total-amount">{formatUsd(totalUsd)}</span>
              </div>
              {checkoutError && <p className="hw-cart__error">{checkoutError}</p>}
              <button
                type="button"
                className="hw-cart__checkout btn-glass-prominent glass-effect-interactive"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Redirecting…" : "Checkout"}
              </button>
              <p className="hw-cart__fineprint">
                Secure checkout via Stripe. We buy your exact unit from Amazon and ship it directly to your address.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
