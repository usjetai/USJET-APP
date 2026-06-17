/** Warp / video / pulse layers — hidden until Protocol ceremony arms the site. */

export const USJET_ATMOSPHERE_LIVE_EVENT = "usjet-atmosphere-live" as const;

const PRE_CLASS = "usjet-pre-atmosphere";
const LIVE_CLASS = "usjet-atmosphere-live";
const REVEAL_CLASS = "usjet-atmosphere-reveal";

export function isAtmosphereLive(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return document.documentElement.classList.contains(LIVE_CLASS);
}

export function applyPreAtmosphere(): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.add(PRE_CLASS);
  root.classList.remove(LIVE_CLASS, REVEAL_CLASS);
}

/** Returning visitors — warp on without boot reveal animation. */
export function restoreAtmosphereLive(): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.remove(PRE_CLASS, REVEAL_CLASS);
  root.classList.add(LIVE_CLASS);
}

/** Fade warp tunnel in during terminal boot. */
export function revealAtmosphere(): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.remove(PRE_CLASS);
  root.classList.add(LIVE_CLASS, REVEAL_CLASS);
  window.dispatchEvent(new CustomEvent(USJET_ATMOSPHERE_LIVE_EVENT));
  window.setTimeout(() => {
    root.classList.remove(REVEAL_CLASS);
  }, 1600);
}

export function clearAtmosphereLive(): void {
  if (typeof document === "undefined") {
    return;
  }
  applyPreAtmosphere();
}
