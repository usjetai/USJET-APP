import { AI101_QUIZ_TOTAL } from "../data/ai101Quiz";

export const AI101_BADGE_STORAGE_KEY = "usjet-ai101-badge-v1";

export type Ai101BadgeRecord = {
  passed: true;
  score: number;
  total: number;
  passedAt: string;
  customerId?: string | null;
};

function readRaw(): Ai101BadgeRecord | null {
  try {
    const raw = localStorage.getItem(AI101_BADGE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Ai101BadgeRecord;
    if (!parsed?.passed || typeof parsed.score !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readAi101Badge(customerId?: string | null): Ai101BadgeRecord | null {
  const record = readRaw();
  if (!record) return null;
  if (customerId && record.customerId && record.customerId !== customerId) {
    return null;
  }
  return record;
}

export function hasPassedAi101(customerId?: string | null): boolean {
  return Boolean(readAi101Badge(customerId));
}

export function saveAi101BadgePass(score: number, customerId?: string | null): Ai101BadgeRecord {
  const record: Ai101BadgeRecord = {
    passed: true,
    score,
    total: AI101_QUIZ_TOTAL,
    passedAt: new Date().toISOString(),
    customerId: customerId ?? null,
  };
  try {
    localStorage.setItem(AI101_BADGE_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* ignore quota */
  }
  return record;
}

export function bindAi101BadgeToCustomer(customerId: string): Ai101BadgeRecord | null {
  const record = readRaw();
  if (!record) return null;
  if (record.customerId && record.customerId !== customerId) return record;
  const next = { ...record, customerId };
  try {
    localStorage.setItem(AI101_BADGE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
