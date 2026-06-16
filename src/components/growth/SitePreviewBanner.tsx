import { Link, useLocation } from "react-router-dom";
import { getDaysUntilUsa250 } from "../../lib/usa250Countdown";
import { isSitePreviewPromoActive } from "../../lib/sitePreviewPromo";
import {
  SITE_PREVIEW_BANNER_COPY,
  SITE_PREVIEW_BANNER_CTA,
  SITE_PREVIEW_BANNER_FLAG,
  SITE_PREVIEW_DEADLINE_LABEL,
} from "../../data/sitePreviewPromo";

/** USA 250 full-site preview — guests can browse gated routes until July 4, 2026. */
export default function SitePreviewBanner() {
  const location = useLocation();
  const days = getDaysUntilUsa250();

  if (!isSitePreviewPromoActive() || location.pathname === "/cockpit") {
    return null;
  }

  return (
    <aside className="site-preview-banner" aria-label="Full site preview until July 4, 2026">
      <div className="site-preview-banner__inner">
        <span className="site-preview-banner__flag">{SITE_PREVIEW_BANNER_FLAG}</span>
        <p className="site-preview-banner__copy">
          <strong>Open through {SITE_PREVIEW_DEADLINE_LABEL}.</strong> {SITE_PREVIEW_BANNER_COPY}
        </p>
        <Link to="/member/login" className="site-preview-banner__cta">
          {SITE_PREVIEW_BANNER_CTA}
        </Link>
        <span className="site-preview-banner__countdown">Locks T−{days}d</span>
      </div>
    </aside>
  );
}
