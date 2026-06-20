/** Founder page video background — https://www.youtube.com/watch?v=bv8r8h29KSQ */
const YOUTUBE_ID = "bv8r8h29KSQ";

const YOUTUBE_EMBED = [
  `https://www.youtube.com/embed/${YOUTUBE_ID}`,
  "?autoplay=1",
  "&mute=1",
  "&controls=0",
  "&rel=0",
  "&loop=1",
  `&playlist=${YOUTUBE_ID}`,
  "&playsinline=1",
  "&modestbranding=1",
  "&iv_load_policy=3",
  "&disablekb=1",
  "&enablejsapi=0",
].join("");

export default function FounderVideoBackground() {
  return (
    <div className="founder-video-bg" aria-hidden>
      <iframe
        className="founder-video-bg__yt"
        src={YOUTUBE_EMBED}
        title="Founder page background"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />
    </div>
  );
}
