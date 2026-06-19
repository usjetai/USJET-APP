import { isUsableStripePaymentLink } from "./stripePaymentLink";
import { wrapExternalInCockpit } from "./fleetLaunchUrl";

const INTERCEPT_BYPASS_ATTR = "data-usjet-external-leak";
const EXTERNAL_HREF_BUTTON_ATTR = "data-usjet-external-href";
const COCKPIT_ROUTE_PREFIX = "/cockpit";

const SOVEREIGN_REVENUE_BYPASS_HOSTS = new Set([
  "cash.app",
  "venmo.com",
  "paypal.com",
  "paypal.me",
]);

export type ExternalLaunchTarget = {
  element: HTMLAnchorElement | HTMLButtonElement;
  href: string;
  label: string | null;
};

export function isExternalHttpUrl(href: string): boolean {
  const trimmed = href.trim();
  return /^https?:\/\//i.test(trimmed);
}

export function isCockpitPath(pathname: string): boolean {
  return pathname === COCKPIT_ROUTE_PREFIX || pathname.startsWith(`${COCKPIT_ROUTE_PREFIX}?`);
}

function isSameOriginUrl(url: URL): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return url.origin === window.location.origin;
}

/** Links that must leave the sovereign shell (Stripe checkout, revenue rails, explicit opt-out). */
export function shouldBypassCockpitIntercept(
  element: HTMLAnchorElement | HTMLButtonElement,
  url: URL,
): boolean {
  if (element.getAttribute(INTERCEPT_BYPASS_ATTR) === "true") {
    return true;
  }

  if (element instanceof HTMLAnchorElement && element.hasAttribute("download")) {
    return true;
  }

  const href = element instanceof HTMLAnchorElement
    ? (element.getAttribute("href") ?? "")
    : (element.getAttribute(EXTERNAL_HREF_BUTTON_ATTR) ?? "");

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return true;
  }

  if (isUsableStripePaymentLink(url.toString())) {
    return true;
  }

  const host = url.hostname.replace(/^www\./i, "").toLowerCase();
  if (SOVEREIGN_REVENUE_BYPASS_HOSTS.has(host)) {
    return true;
  }

  if (isSameOriginUrl(url)) {
    return true;
  }

  if (url.pathname.startsWith(COCKPIT_ROUTE_PREFIX)) {
    return true;
  }

  return false;
}

export function resolveCockpitHandoffUrl(
  rawHref: string,
  returnTo: string,
  label?: string | null,
): string | null {
  const trimmed = rawHref.trim();
  if (!isExternalHttpUrl(trimmed)) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    if (isSameOriginUrl(url)) {
      return null;
    }
  } catch {
    return null;
  }

  return wrapExternalInCockpit(trimmed, {
    returnTo,
    label: label ?? undefined,
  });
}

export function findExternalLaunchTargetFromEvent(target: EventTarget | null): ExternalLaunchTarget | null {
  if (!(target instanceof Element)) {
    return null;
  }

  const button = target.closest(`button[${EXTERNAL_HREF_BUTTON_ATTR}]`);
  if (button instanceof HTMLButtonElement) {
    const href = button.getAttribute(EXTERNAL_HREF_BUTTON_ATTR);
    if (href && isExternalHttpUrl(href)) {
      return {
        element: button,
        href,
        label: button.getAttribute("title") ?? button.textContent?.trim() ?? null,
      };
    }
  }

  const anchor = target.closest("a");
  if (!anchor) {
    return null;
  }

  const href = anchor.getAttribute("href");
  if (!href || !isExternalHttpUrl(href)) {
    return null;
  }

  return {
    element: anchor,
    href,
    label: anchor.getAttribute("title") ?? anchor.textContent?.trim() ?? null,
  };
}

/** @deprecated Use findExternalLaunchTargetFromEvent */
export function findExternalAnchorFromEventTarget(target: EventTarget | null): HTMLAnchorElement | null {
  const launch = findExternalLaunchTargetFromEvent(target);
  return launch?.element instanceof HTMLAnchorElement ? launch.element : null;
}
