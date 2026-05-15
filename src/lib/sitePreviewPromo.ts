/** Full-site preview window — open through USA 250 (July 4, 2026), then tier gates return. */

export const SITE_PREVIEW_END_MS = Date.parse("2026-07-05T03:59:59.999Z");

export function isSitePreviewPromoActive(nowMs = Date.now()): boolean {
  return nowMs < SITE_PREVIEW_END_MS;
}

/** @deprecated Use isSitePreviewPromoActive — same window as Origin preview. */
export const isOriginLimitedTimePromoActive = isSitePreviewPromoActive;
