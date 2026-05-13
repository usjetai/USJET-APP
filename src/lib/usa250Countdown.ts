/** Local start of July 4, 2026 — USA semiquincentennial. */
const USA_250 = new Date(2026, 6, 4);

/**
 * Whole calendar days from local start-of-today until July 4, 2026 (inclusive target as “event day”).
 * After the date, returns 0.
 */
export function getDaysUntilUsa250(now: Date = new Date()): number {
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = USA_250.getTime() - startToday.getTime();
  return Math.max(0, Math.ceil(diffMs / 86_400_000));
}
