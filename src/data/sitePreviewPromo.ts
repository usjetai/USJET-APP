import { ORIGIN_TIER_LOCK_DEADLINE_LABEL } from "./originTierPromo";
import { MEMBER_DECK_PRICE_DISPLAY } from "./memberDeckStripe";

export const SITE_PREVIEW_DEADLINE_LABEL = ORIGIN_TIER_LOCK_DEADLINE_LABEL;

export const SITE_PREVIEW_BANNER_FLAG = "Full site preview" as const;

export const SITE_PREVIEW_BANNER_COPY = `Hangar, Intel, Origin, and every other gated deck are open to explore free until USA 250. The Member Portal is the only paid room — Member Deck clearance is ${MEMBER_DECK_PRICE_DISPLAY}/mo through Stripe. After July 4, each page locks to the tier that matches your clearance.` as const;

export const SITE_PREVIEW_BANNER_CTA = "Member $5" as const;

export const SITE_PREVIEW_MEMBER_NOTE =
  `Member Portal requires ${MEMBER_DECK_PRICE_DISPLAY}/mo Member Deck clearance (or a higher tier). Browse the rest of the ship free until ${SITE_PREVIEW_DEADLINE_LABEL}.` as const;
