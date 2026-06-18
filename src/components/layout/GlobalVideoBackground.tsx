/** Official warp atmosphere — https://www.youtube.com/watch?v=UQgBVsbbKRs&t=1s */
const YOUTUBE_ID = "UQgBVsbbKRs";
const CLIP_START_SEC = 1;

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
  `&start=${CLIP_START_SEC}`,
  "&enablejsapi=0",
].join("");

export default function GlobalVideoBackground() {
  return (
    <div className="global-video-bg global-video-bg--youtube-official" aria-hidden>
      <iframe
        className="global-video-bg__yt"
        src={YOUTUBE_EMBED}
        title="USJET warp-speed atmosphere"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />
    </div>
  );
}
