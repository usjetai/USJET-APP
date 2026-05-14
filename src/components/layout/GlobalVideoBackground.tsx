/** Site-wide warp streaks + cockpit glass veil (no full video layer). */
export default function GlobalVideoBackground() {
  return (
    <div className="global-video-bg global-video-bg--warp-only" aria-hidden>
      <div className="global-video-bg__warp-streaks" />
      <div className="global-video-bg__veil global-video-bg__veil--cockpit" />
    </div>
  );
}
