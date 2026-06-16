import { useMatch } from "react-router-dom";
import { ORIGIN_LIMITED_NAV_HOVER } from "../../data/originLimitedOffer";
import { useOriginLimitedOffer } from "../../context/OriginLimitedOfferContext";

type OriginGateLinkProps = {
  className: string;
};

/** Nav Origin chip — promo bubble on click, then route to /origin. */
export default function OriginGateLink({ className }: OriginGateLinkProps) {
  const { requestOriginNavigation, isPromoActive } = useOriginLimitedOffer();
  const isActive = Boolean(useMatch({ path: "/origin", end: false }));

  const activeClass = isActive ? "text-white ring-1 ring-cyan-400/35" : "";

  return (
    <button
      type="button"
      className={[className, activeClass].filter(Boolean).join(" ")}
      title={isPromoActive ? ORIGIN_LIMITED_NAV_HOVER : "Origin command — Aura voice AI"}
      aria-label={ORIGIN_LIMITED_NAV_HOVER}
      aria-current={isActive ? "page" : undefined}
      onClick={() => requestOriginNavigation()}
    >
      Origin
      {isPromoActive ? <span className="origin-gate-link__badge">Open</span> : null}
    </button>
  );
}
