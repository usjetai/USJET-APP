import { ExternalLink } from "lucide-react";
import SilentHangarTikTokEmbed from "../media/SilentHangarTikTokEmbed";
import {
  GAMING_TIKTOK_HASHTAG,
  GAMING_TIKTOK_HASHTAG_URL,
  GAMING_TIKTOK_MUSIC_LABEL,
  GAMING_TIKTOK_MUSIC_URL,
  GAMING_TIKTOK_POST_ID,
  GAMING_TIKTOK_POST_URL,
  GAMING_TIKTOK_PROFILE_EMBED_URL,
  GAMING_TIKTOK_USERNAME,
} from "../../data/gamingPortal";

export default function GamingTikTokBay() {
  return (
    <div className="gaming-tiktok-bay gaming-live-bay">
      <div className="gaming-tiktok-bay__chrome gaming-live-bay__chrome" aria-hidden>
        <span className="gaming-live-bay__dot gaming-live-bay__dot--a" />
        <span className="gaming-live-bay__dot gaming-live-bay__dot--b" />
        <span className="gaming-live-bay__dot gaming-live-bay__dot--c" />
        <span className="gaming-live-bay__label">PROOF OF LIFE · {GAMING_TIKTOK_USERNAME}</span>
      </div>

      <div className="gaming-tiktok-bay__toolbar gaming-live-bay__toolbar">
        <a href={GAMING_TIKTOK_PROFILE_EMBED_URL} target="_blank" rel="noopener noreferrer" className="gaming-live-bay__creator">
          {GAMING_TIKTOK_USERNAME}
        </a>
      </div>

      <SilentHangarTikTokEmbed
        postId={GAMING_TIKTOK_POST_ID}
        postUrl={GAMING_TIKTOK_POST_URL}
        className="gaming-tiktok-bay__embed-shell"
        wrapClassName="gaming-tiktok-bay__embed-wrap"
      >
        <section>
          <a target="_blank" rel="noopener noreferrer" title={GAMING_TIKTOK_USERNAME} href={GAMING_TIKTOK_PROFILE_EMBED_URL}>
            {GAMING_TIKTOK_USERNAME}
          </a>{" "}
          <a title="usa" target="_blank" rel="noopener noreferrer" href={GAMING_TIKTOK_HASHTAG_URL}>
            {GAMING_TIKTOK_HASHTAG}
          </a>{" "}
          <a target="_blank" rel="noopener noreferrer" title={GAMING_TIKTOK_MUSIC_LABEL} href={GAMING_TIKTOK_MUSIC_URL}>
            {GAMING_TIKTOK_MUSIC_LABEL}
          </a>
        </section>
      </SilentHangarTikTokEmbed>

      <footer className="gaming-tiktok-bay__footer gaming-live-bay__footer">
        <span>
          {GAMING_TIKTOK_HASHTAG} · {GAMING_TIKTOK_MUSIC_LABEL}
        </span>
        <a href={GAMING_TIKTOK_POST_URL} target="_blank" rel="noopener noreferrer" className="gaming-live-bay__open">
          <ExternalLink size={12} aria-hidden />
          Open on TikTok
        </a>
      </footer>
    </div>
  );
}
