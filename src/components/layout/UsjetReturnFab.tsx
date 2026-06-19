import { createPortal } from "react-dom";
import { useUsjetExternalNavigationOptional } from "../../context/UsjetExternalNavigationContext";
import { navigateToUsjetHome } from "../../lib/usjetReturnHome";

/**
 * Fixed sovereign return FAB — portal to document.body so it stays above cockpit iframes
 * and partner embeds (z-index above global footer and nav).
 */
export default function UsjetReturnFab() {
  const navigation = useUsjetExternalNavigationOptional();

  if (!navigation?.showReturnFab || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <button
      type="button"
      className="usjet-return-fab btn-glass glass-effect-interactive glass-tint-cyan"
      aria-label="Return to US JET home at usjet.ai"
      title="Return to US JET"
      onClick={() => {
        navigation.clearExternalHandoff();
        navigateToUsjetHome();
      }}
    >
      <span className="usjet-return-fab__pulse" aria-hidden />
      <span className="usjet-return-fab__label">US JET</span>
    </button>,
    document.body,
  );
}
