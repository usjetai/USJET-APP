import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download } from "lucide-react";
import { SOVEREIGN_PRICE_DEADLINE_SHORT, SOVEREIGN_VAULT_ROUTE } from "../../data/sovereignBlueprint100k";

type SovereignVaultGlobalDownloadProps = {
  /** Inside AppNav right rail — not fixed to viewport */
  embedded?: boolean;
};

/** Site-wide vault discovery — routes to /100k (same destination as footer 100K). */
export default function SovereignVaultGlobalDownload({ embedded = false }: SovereignVaultGlobalDownloadProps) {
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
      className={[
        "vault-100k-stripe-dl",
        "btn-glass",
        "glass-effect-interactive",
        "glass-tint-gold",
        embedded ? "vault-100k-stripe-dl--embedded" : "",
        shaking ? "vault-100k-stripe-dl--shake" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      aria-label={`Sovereign Fleet Protocol vault — ${SOVEREIGN_PRICE_DEADLINE_SHORT}`}
      title={`Volume I vault · ${SOVEREIGN_PRICE_DEADLINE_SHORT}`}
    >
      <Download className="vault-100k-stripe-dl__icon" size={18} strokeWidth={2.25} aria-hidden />
    </Link>
  );
}
