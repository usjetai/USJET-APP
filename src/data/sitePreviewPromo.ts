/** Site-wide preview promo until USA 250 — Member Portal stays Flight Pass+. */

import { FLIGHT_PASS_STRIPE } from "./stripeProducts";

export const SITE_PREVIEW_DEADLINE_LABEL = "July 4, 2026" as const;

export const SITE_PREVIEW_BANNER_FLAG = "Full site preview" as const;

export const SITE_PREVIEW_BANNER_COPY = `Hangar, Intel, Origin, and every other gated deck are open to explore free until USA 250. The Member Portal requires Flight Pass (${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period}) through Stripe. After July 4, each page locks to the tier that matches your clearance.` as const;

export const SITE_PREVIEW_BANNER_CTA = "Flight Pass" as const;

export const SITE_PREVIEW_MEMBER_NOTE =
  `Member Portal requires ${FLIGHT_PASS_STRIPE.priceDisplay}${FLIGHT_PASS_STRIPE.period} Flight Pass clearance (or a higher tier). Browse the rest of the ship free until ${SITE_PREVIEW_DEADLINE_LABEL}.` as const;
