/** Origin limited-time open access — free until USA 250, then Hangar Pro tier. */

import { ORIGIN_TIER_LOCK_DEADLINE_LABEL } from "./originTierPromo";
import { HANGAR_PRO_STRIPE } from "./stripeProducts";

export const ORIGIN_LIMITED_FREE_UNTIL = ORIGIN_TIER_LOCK_DEADLINE_LABEL;

export const ORIGIN_LIMITED_AFTER_TIER_LABEL = `${HANGAR_PRO_STRIPE.priceDisplay}/mo Hangar Pro`;

export const ORIGIN_LIMITED_OFFER_TITLE = "Full site preview" as const;

export const ORIGIN_LIMITED_OFFER_LEDE =
  "Hangar, Intel, Origin, and Member data are open for everyone until July 4, 2026." as const;

export const ORIGIN_LIMITED_OFFER_BODY =
  "Explore the full USJET deck now. After USA 250, each page locks to the tier that matches your clearance — Origin behind Hangar Pro (~$50/mo), Intel behind Hangar Pro, Hangar behind Flight Pass." as const;

export const ORIGIN_LIMITED_OFFER_KEEP =
  "If you did not clear cookies or site data, the site remembers you. Clearing storage is why login gates return—same as Protocol red vs green." as const;

export const ORIGIN_LIMITED_NAV_HOVER =
  "Origin — open during full site preview until July 4, 2026." as const;
