import { ShoppingCart } from "lucide-react";
import { useHardwareCart } from "../../context/HardwareCartContext";

export default function HardwareCartButton() {
  const { totalItems, openCart } = useHardwareCart();
  return (
    <button type="button" className="hw-cart-trigger btn-glass glass-effect-interactive" onClick={openCart}>
      <ShoppingCart size={16} aria-hidden />
      Cart
      {totalItems > 0 && <span className="hw-cart-trigger__badge">{totalItems}</span>}
    </button>
  );
}
