/** Site-wide warp tunnel streak overlay — no video/veil layers. */
export default function GlobalVideoBackground() {
  return (
    <div className="global-video-bg global-video-bg--warp-only" aria-hidden>
      <div className="global-video-bg__warp-streaks" />
    </div>
  );
}
