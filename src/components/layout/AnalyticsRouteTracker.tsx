import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageview } from "../../lib/analytics";

/**
 * Fires a GA4 page_view on every SPA route change. Rendered once inside the
 * Router. No-ops entirely when analytics is not configured.
 */
export default function AnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search;
    // Defer a tick so document.title reflects the freshly rendered route.
    const id = window.setTimeout(() => trackPageview(path), 0);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);

  return null;
}
