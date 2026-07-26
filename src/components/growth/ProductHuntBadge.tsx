import { trackEvent } from "../../lib/analytics";

/** Product Hunt product ID for USJET.AI (used by the review badge). */
const PRODUCT_HUNT_PRODUCT_ID = "1277332";

/** Product Hunt product slug. */
const PRODUCT_HUNT_SLUG = "usjet-ai";

/**
 * Daily launch post ID. When set, the badge upgrades to the stronger
 * "Featured" badge (shows upvotes / #-of-the-day ranking) which is better
 * social proof and links straight to the live launch post. Grab it from your
 * Product Hunt launch URL: producthunt.com/posts/<slug> → the badge embed code.
 */
const PRODUCT_HUNT_POST_ID = "";

type ProductHuntBadgeProps = {
  className?: string;
  /** Product Hunt badge theme. Use "light" on dark backgrounds for contrast. */
  theme?: "light" | "dark" | "neutral";
  width?: number;
  height?: number;
};

/**
 * Product Hunt social-proof badge with reciprocal link + click tracking.
 * Opens in a new tab intentionally so the visitor keeps their USJET session.
 */
export default function ProductHuntBadge({
  className,
  theme = "light",
  width = 250,
  height = 54,
}: ProductHuntBadgeProps) {
  const featured = Boolean(PRODUCT_HUNT_POST_ID);

  const href = featured
    ? `https://www.producthunt.com/posts/${PRODUCT_HUNT_SLUG}?utm_source=badge-featured&utm_medium=badge&utm_campaign=producthunt-launch`
    : `https://www.producthunt.com/products/${PRODUCT_HUNT_SLUG}/reviews/new?utm_source=badge-product_review&utm_medium=badge`;

  const imgSrc = featured
    ? `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${PRODUCT_HUNT_POST_ID}&theme=${theme}`
    : `https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=${PRODUCT_HUNT_PRODUCT_ID}&theme=${theme}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="See USJET.AI on Product Hunt"
      onClick={() => trackEvent("producthunt_badge_click", { variant: featured ? "featured" : "review" })}
    >
      <img
        src={imgSrc}
        alt="USJET.AI on Product Hunt — One Hangar. 30 AI Tools. Zero Tab-Switching."
        style={{ width: `${width}px`, height: `${height}px` }}
        width={width}
        height={height}
        loading="lazy"
      />
    </a>
  );
}
