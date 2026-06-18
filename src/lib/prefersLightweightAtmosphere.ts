/** Mobile / coarse pointer — limit simultaneous video decoders to avoid tab crashes. */
export function prefersLightweightAtmosphere(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
}
