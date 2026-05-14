/** Site-wide AA-VFX hyperspace tunnel — radial streak layers only (no veil/wash). */
export default function GlobalVideoBackground() {
  return (
    <div className="global-video-bg global-video-bg--warp-only" aria-hidden>
      <div className="global-video-bg__center-burst" />
      <div className="global-video-bg__warp-streaks global-video-bg__warp-streaks--deep" />
      <div className="global-video-bg__warp-streaks global-video-bg__warp-streaks--fast" />
    </div>
  );
}
