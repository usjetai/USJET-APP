/**
 * Mobile-only cue: looping filmstrip + pink glow (toolbar, left).
 * Decorative; prefers-reduced-motion disables animation in CSS.
 */
export default function MobileRotateCue() {
  return (
    <div
      className="mobile-rotate-cue"
      role="img"
      aria-label="Rotate your phone to landscape for the best view of this site."
    >
      <div className="mobile-rotate-cue__strip" aria-hidden />
    </div>
  );
}
