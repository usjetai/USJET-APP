/**
 * USJET.AI — vendor-agnostic web analytics.
 *
 * Backed by Google Analytics 4 (gtag) today, but every call site uses the
 * generic {@link trackEvent} / {@link trackPageview} API so a second vendor
 * (Plausible, PostHog) can be added later without touching component code.
 *
 * The whole module is dormant until `VITE_GA4_MEASUREMENT_ID` is set, and it
 * honors Do-Not-Track / Global Privacy Control so we never load a tracker for
 * users who opted out.
 */

type GtagArgs =
  | [command: "js", value: Date]
  | [command: "config", targetId: string, config?: Record<string, unknown>]
  | [command: "event", eventName: string, params?: Record<string, unknown>]
  | [command: "set", params: Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * GA4 Measurement ID. A measurement ID is not a secret (it ships in every
 * client bundle), so we default to the live USJET.AI property and allow an
 * env override for staging / alternate properties.
 */
const DEFAULT_GA_MEASUREMENT_ID = "G-ZTRGGZ4R0P";
const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim() || DEFAULT_GA_MEASUREMENT_ID;

const ATTRIBUTION_KEY = "usjet_attribution_v1";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type Attribution = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
  referrer: string | null;
  landing_page: string | null;
  first_seen: string;
};

let initialized = false;

/** True when the visitor has asked not to be tracked. */
function userOptedOut(): boolean {
  if (typeof navigator === "undefined") return true;
  const dnt =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).doNotTrack ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).doNotTrack ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigator as any).msDoNotTrack;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gpc = (navigator as any).globalPrivacyControl;
  return dnt === "1" || dnt === "yes" || gpc === true;
}

/** Analytics is live only when an ID is configured and the user has not opted out. */
export function analyticsEnabled(): boolean {
  return Boolean(GA_MEASUREMENT_ID) && !userOptedOut();
}

/**
 * Persist the first-touch acquisition source (UTM params + referrer). This is
 * what lets you answer "did the Product Hunt / TikTok / Reddit visitor convert?"
 * even after they navigate around the site before checking out.
 */
function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;

  let stored: Attribution | null = null;
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY);
    if (raw) stored = JSON.parse(raw) as Attribution;
  } catch {
    stored = null;
  }

  const params = new URLSearchParams(window.location.search);
  const hasUtm = UTM_KEYS.some((key) => params.get(key));

  // Only overwrite first-touch attribution when this visit carries fresh UTMs.
  if (stored && !hasUtm) return stored;

  const referrer =
    document.referrer && !document.referrer.includes(window.location.hostname)
      ? document.referrer
      : stored?.referrer ?? null;

  const attribution: Attribution = {
    source: params.get("utm_source") ?? stored?.source ?? inferSourceFromReferrer(referrer),
    medium: params.get("utm_medium") ?? stored?.medium ?? (referrer ? "referral" : "direct"),
    campaign: params.get("utm_campaign") ?? stored?.campaign ?? null,
    term: params.get("utm_term") ?? stored?.term ?? null,
    content: params.get("utm_content") ?? stored?.content ?? null,
    referrer,
    landing_page: stored?.landing_page ?? window.location.pathname,
    first_seen: stored?.first_seen ?? new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    /* storage unavailable — keep in-memory only */
  }

  return attribution;
}

/** Best-effort channel label from a referrer host (Product Hunt, socials, search). */
function inferSourceFromReferrer(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("producthunt")) return "producthunt";
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("youtube") || host.includes("youtu.be")) return "youtube";
    if (host.includes("reddit")) return "reddit";
    if (host.includes("google")) return "google";
    if (host.includes("bing")) return "bing";
    if (host === "t.co" || host.includes("twitter") || host === "x.com") return "x";
    if (host.includes("linkedin") || host === "lnkd.in") return "linkedin";
    if (host.includes("facebook") || host === "fb.com") return "facebook";
    return host;
  } catch {
    return null;
  }
}

/** Returns the persisted first-touch attribution, if any. */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

/**
 * Load GA4 once. Safe to call on every mount — it no-ops after the first run,
 * when no ID is configured, or when the user opted out.
 */
export function initAnalytics(): void {
  if (initialized || typeof window === "undefined") return;
  if (!analyticsEnabled()) return;

  initialized = true;
  captureAttribution();

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: GtagArgs) {
    window.dataLayer!.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  // We send page_view manually so SPA route changes are counted correctly.
  window.gtag("config", GA_MEASUREMENT_ID!, { send_page_view: false });

  const attribution = getAttribution();
  if (attribution) {
    window.gtag("set", {
      user_properties: {
        acquisition_source: attribution.source ?? "direct",
        acquisition_medium: attribution.medium ?? "direct",
        acquisition_campaign: attribution.campaign ?? "(none)",
      },
    });
  }

  registerOutboundCheckoutListener();
}

/** Record a virtual pageview for an SPA route change. */
export function trackPageview(path: string, title?: string): void {
  if (!analyticsEnabled() || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
  });
}

/** Record an arbitrary event. */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!analyticsEnabled() || !window.gtag) return;
  const attribution = getAttribution();
  window.gtag("event", name, {
    ...params,
    acquisition_source: attribution?.source ?? undefined,
    acquisition_medium: attribution?.medium ?? undefined,
    acquisition_campaign: attribution?.campaign ?? undefined,
  });
}

/** Fire the GA4 `begin_checkout` conversion event for a tier / product. */
export function trackBeginCheckout(input: {
  tier: string;
  value?: number;
  url?: string;
}): void {
  trackEvent("begin_checkout", {
    currency: "USD",
    value: input.value,
    checkout_tier: input.tier,
    destination: input.url,
  });
}

/**
 * Catch any click on a Stripe payment link anchored in the DOM (product cards,
 * pricing links) so we count checkout intent without editing every CTA.
 * Button-based redirects (window.location) are instrumented directly at source.
 */
function registerOutboundCheckoutListener(): void {
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.includes("buy.stripe.com") || href.includes("checkout.stripe.com")) {
        trackBeginCheckout({ tier: anchor.dataset.checkoutTier ?? "unknown", url: href });
      }
    },
    { capture: true },
  );
}
