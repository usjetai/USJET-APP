/** Full-site preview window — ENDED. All pages now require membership tier. */

export const SITE_PREVIEW_END_MS = Date.parse("2026-06-13T00:00:00.000Z");

export function isSitePreviewPromoActive(nowMs = Date.now()): boolean {
  return nowMs < SITE_PREVIEW_END_MS;
}

/** @deprecated Use isSitePreviewPromoActive — same window as Origin preview. */
export const isOriginLimitedTimePromoActive = isSitePreviewPromoActive;
