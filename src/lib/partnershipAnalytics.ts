export type PartnershipBayId = "slot-01-market" | "slot-02-titans";

export type PartnershipEventAction = "hover" | "click";

export type PartnershipEvent = {
  bayId: PartnershipBayId;
  label: string;
  action: PartnershipEventAction;
  path: string;
  timestamp: string;
  sessionId: string;
};

const ANALYTICS_URL = import.meta.env.VITE_PARTNERSHIP_ANALYTICS_URL ?? "/api/partnership-analytics";
const SESSION_KEY = "usjet_partnership_session";

function partnershipSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `ps_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `ps_${Date.now()}`;
  }
}

export function recordPartnershipEvent(
  bayId: PartnershipBayId,
  label: string,
  action: PartnershipEventAction,
): void {
  const event: PartnershipEvent = {
    bayId,
    label,
    action,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    sessionId: partnershipSessionId(),
  };

  const payload = JSON.stringify(event);

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(ANALYTICS_URL, blob);
    return;
  }

  void fetch(ANALYTICS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}
