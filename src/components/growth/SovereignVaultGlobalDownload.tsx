import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download } from "lucide-react";
import { SOVEREIGN_PRICE_DEADLINE_SHORT, SOVEREIGN_VAULT_ROUTE } from "../../data/sovereignBlueprint100k";

/** Site-wide vault discovery — routes to /100k (same destination as footer 100K). */
export default function SovereignVaultGlobalDownload() {
  const location = useLocation();
  const [shaking, setShaking] = useState(false);

  const handleClick = useCallback(() => {
    setShaking(true);
    window.setTimeout(() => setShaking(false), 420);
  }, []);

  if (location.pathname === "/cockpit") {
    return null;
  }

  return (
    <Link
      to={SOVEREIGN_VAULT_ROUTE}
      className={`vault-100k-stripe-dl btn-glass glass-effect-interactive glass-tint-gold${shaking ? " vault-100k-stripe-dl--shake" : ""}`}
      onClick={handleClick}
      aria-label={`Sovereign Fleet Protocol vault — ${SOVEREIGN_PRICE_DEADLINE_SHORT}`}
      title={`Volume I vault · ${SOVEREIGN_PRICE_DEADLINE_SHORT}`}
    >
      <Download className="vault-100k-stripe-dl__icon" size={18} strokeWidth={2.25} aria-hidden />
    </Link>
  );
}
