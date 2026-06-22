/** YouTube audio-only background for the hub */
import { SITE_AUDIO_DISABLED } from "../../data/siteAudio";

const YOUTUBE_ID = "BT_83vSP1es";

const YOUTUBE_AUDIO_EMBED = [
  `https://www.youtube.com/embed/${YOUTUBE_ID}`,
  "?autoplay=1",
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

export default function YouTubeAudioBackground() {
  if (SITE_AUDIO_DISABLED) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none -z-10 opacity-0" 
      aria-hidden="true"
      style={{ visibility: 'hidden' }}
    >
      <iframe
        className="w-full h-full"
        src={YOUTUBE_AUDIO_EMBED}
        title="Hub background audio"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />
    </div>
  );
}
