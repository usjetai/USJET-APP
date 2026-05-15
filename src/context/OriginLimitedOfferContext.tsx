import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import OriginLimitedOfferBubble from "../components/origin/OriginLimitedOfferBubble";
import { isSitePreviewPromoActive } from "../lib/sitePreviewPromo";

type OriginLimitedOfferContextValue = {
  requestOriginNavigation: (event?: { preventDefault?: () => void }) => void;
  isPromoActive: boolean;
};

const OriginLimitedOfferContext = createContext<OriginLimitedOfferContextValue | null>(null);

export function OriginLimitedOfferProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isPromoActive = isSitePreviewPromoActive();

  const requestOriginNavigation = useCallback(
    (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.();
      navigate("/origin");
    },
    [navigate],
  );

  const handleContinue = useCallback(() => {
    setOpen(false);
    navigate("/origin");
  }, [navigate]);

  const value = useMemo(
    () => ({
      requestOriginNavigation,
      isPromoActive,
    }),
    [isPromoActive, requestOriginNavigation],
  );

  return (
    <OriginLimitedOfferContext.Provider value={value}>
      {children}
      <OriginLimitedOfferBubble open={open} onClose={() => setOpen(false)} onContinue={handleContinue} />
    </OriginLimitedOfferContext.Provider>
  );
}

export function useOriginLimitedOffer(): OriginLimitedOfferContextValue {
  const ctx = useContext(OriginLimitedOfferContext);
  if (!ctx) {
    throw new Error("useOriginLimitedOffer must be used within OriginLimitedOfferProvider");
  }
  return ctx;
}

/** Safe outside provider — direct navigate when provider absent. */
export function useOriginLimitedOfferOptional(): OriginLimitedOfferContextValue | null {
  return useContext(OriginLimitedOfferContext);
}
