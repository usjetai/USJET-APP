/** Document root flag — hides global nav/footer while Hangar bays render in the isolation portal. */
export const HANGAR_BAY_ISOLATION_CLASS = "hangar-bay-isolated";

export function setHangarBayIsolation(active: boolean): void {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.classList.toggle(HANGAR_BAY_ISOLATION_CLASS, active);
}
