/** Daily operator log — 50 calendar days before USA 250 (July 4, 2026). */

export const BLOG_CADENCE_START_LABEL = "May 15, 2026" as const;

export const BLOG_CADENCE_TOTAL_DAYS = 50 as const;

/** Local midnight May 15, 2026 — first daily log (50 days before USA 250). */
const CADENCE_START = new Date(2026, 4, 15);

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** 1-based day index on the 50-day march (clamped 1–50). */
export function getBlogCadenceDay(now: Date = new Date()): number {
  const today = startOfLocalDay(now);
  const start = startOfLocalDay(CADENCE_START);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1;
  if (diffDays < 1) {
    return 1;
  }
  if (diffDays > BLOG_CADENCE_TOTAL_DAYS) {
    return BLOG_CADENCE_TOTAL_DAYS;
  }
  return diffDays;
}

export function isBlogCadenceActive(now: Date = new Date()): boolean {
  const today = startOfLocalDay(now);
  const start = startOfLocalDay(CADENCE_START);
  const usa250 = new Date(2026, 6, 4);
  return today >= start && today <= usa250;
}

/** Hours until next local-midnight dispatch (for “next post” strip). */
export function getHoursUntilNextBlogDrop(now: Date = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(0, Math.ceil((next.getTime() - now.getTime()) / 3_600_000));
}
