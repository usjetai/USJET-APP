import { useCallback, useRef } from "react";
import { recordPartnershipEvent, type PartnershipBayId } from "../lib/partnershipAnalytics";

type UsePartnershipBayAnalyticsOptions = {
  bayId: PartnershipBayId;
  label: string;
  /** Track market bay events in addition to Titans crypto bay. */
  enabled?: boolean;
};

export function usePartnershipBayAnalytics({
  bayId,
  label,
  enabled = true,
}: UsePartnershipBayAnalyticsOptions) {
  const lastHoverAt = useRef(0);

  const track = useCallback(
    (action: "hover" | "click") => {
      if (!enabled) {
        return;
      }
      recordPartnershipEvent(bayId, label, action);
    },
    [bayId, enabled, label],
  );

  const onMouseEnter = useCallback(() => {
    const now = Date.now();
    if (now - lastHoverAt.current < 400) {
      return;
    }
    lastHoverAt.current = now;
    track("hover");
  }, [track]);

  const onClick = useCallback(() => {
    track("click");
  }, [track]);

  return { onMouseEnter, onClick, track };
}
