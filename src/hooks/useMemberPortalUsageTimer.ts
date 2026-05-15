import { useEffect, useRef } from "react";
import { appendMemberPortalUsage } from "../lib/memberProjectTracker";

const MEMBER_PORTAL_PATH = "/member";
const TICK_MS = 30_000;
const MIN_SEGMENT_MS = 1_000;

function isCountablePath(pathname: string): boolean {
  return pathname === MEMBER_PORTAL_PATH;
}

function shouldSample(visible: boolean, focused: boolean, pathname: string): boolean {
  return isCountablePath(pathname) && visible && focused;
}

type TargetKey = `a:${string}` | "project";

function targetKey(assignmentUnitId: string | null): TargetKey {
  return assignmentUnitId ? `a:${assignmentUnitId}` : "project";
}

function keyToAssignmentUnitId(key: TargetKey): string | null {
  return key.startsWith("a:") ? key.slice(2) : null;
}

export function useMemberPortalUsageTimer(params: {
  customerId: string;
  projectId: string | null;
  pathname: string;
  lastTimeTrackedUnitId: string | null;
  /** Stable join of unit ids on the active project (e.g. `u1,u2`). */
  assignmentUnitIdsKey: string;
}): void {
  const { customerId, projectId, pathname, lastTimeTrackedUnitId, assignmentUnitIdsKey } = params;

  const visibleRef = useRef(typeof document !== "undefined" ? document.visibilityState === "visible" : true);
  const focusedRef = useRef(typeof document !== "undefined" ? document.hasFocus() : true);

  const countingRef = useRef(false);
  const currentKeyRef = useRef<TargetKey | null>(null);
  const segmentStartIsoRef = useRef<string | null>(null);
  const lastBoundaryMsRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const assignmentUnitIds =
      assignmentUnitIdsKey.length > 0 ? assignmentUnitIdsKey.split(",").filter(Boolean) : [];

    const resolveAssignmentUnitId = (): string | null => {
      if (!projectId) {
        return null;
      }
      if (lastTimeTrackedUnitId && assignmentUnitIds.includes(lastTimeTrackedUnitId)) {
        return lastTimeTrackedUnitId;
      }
      return null;
    };

    const desiredKey = (): TargetKey | null => {
      if (!projectId || !shouldSample(visibleRef.current, focusedRef.current, pathname)) {
        return null;
      }
      return targetKey(resolveAssignmentUnitId());
    };

    const flushOpenSegment = (nowMs: number): void => {
      const pid = projectId;
      const key = currentKeyRef.current;
      const startIso = segmentStartIsoRef.current;
      const lastMs = lastBoundaryMsRef.current;
      if (!pid || !countingRef.current || !key || !startIso || lastMs === null) {
        return;
      }

      const deltaMs = nowMs - lastMs;
      if (deltaMs < MIN_SEGMENT_MS) {
        return;
      }

      appendMemberPortalUsage(customerId, pid, {
        assignmentUnitId: keyToAssignmentUnitId(key),
        deltaMs,
        segmentStartedAt: startIso,
        segmentEndedAt: new Date(nowMs).toISOString(),
      });
    };

    const stopCounting = (nowMs: number): void => {
      flushOpenSegment(nowMs);
      countingRef.current = false;
      currentKeyRef.current = null;
      segmentStartIsoRef.current = null;
      lastBoundaryMsRef.current = null;
    };

    const startOrRollSegment = (key: TargetKey, nowMs: number): void => {
      countingRef.current = true;
      currentKeyRef.current = key;
      segmentStartIsoRef.current = new Date(nowMs).toISOString();
      lastBoundaryMsRef.current = nowMs;
    };

    const reconcile = (nowMs: number): void => {
      const next = desiredKey();
      const prevKey = currentKeyRef.current;

      if (!next) {
        if (countingRef.current) {
          stopCounting(nowMs);
        }
        return;
      }

      if (!countingRef.current || !prevKey) {
        startOrRollSegment(next, nowMs);
        return;
      }

      if (prevKey !== next) {
        flushOpenSegment(nowMs);
        startOrRollSegment(next, nowMs);
      }
    };

    const onTick = (): void => {
      const nowMs = Date.now();
      reconcile(nowMs);
      if (!countingRef.current || !currentKeyRef.current) {
        return;
      }
      flushOpenSegment(nowMs);
      startOrRollSegment(currentKeyRef.current, nowMs);
    };

    const onVisibility = (): void => {
      visibleRef.current = document.visibilityState === "visible";
      reconcile(Date.now());
    };

    const onFocus = (): void => {
      focusedRef.current = true;
      reconcile(Date.now());
    };

    const onBlur = (): void => {
      focusedRef.current = false;
      reconcile(Date.now());
    };

    const onPageHide = (): void => {
      stopCounting(Date.now());
    };

    visibleRef.current = document.visibilityState === "visible";
    focusedRef.current = document.hasFocus();
    reconcile(Date.now());

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    window.addEventListener("pagehide", onPageHide);
    const intervalId = window.setInterval(onTick, TICK_MS);

    return () => {
      stopCounting(Date.now());
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pagehide", onPageHide);
      window.clearInterval(intervalId);
    };
  }, [customerId, projectId, pathname, lastTimeTrackedUnitId, assignmentUnitIdsKey]);
}
