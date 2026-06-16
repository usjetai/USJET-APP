import { useMemo } from "react";
import { Camera, ExternalLink } from "lucide-react";
import SilentHangarFrame from "../media/SilentHangarFrame";
import {
  GAMING_INSTAGRAM_HANDLE_DISPLAY,
  GAMING_INSTAGRAM_PROFILE_URL,
  GAMING_INSTAGRAM_TAGLINE,
  resolveInstagramHangarEmbedSrc,
} from "../../data/gamingInstagram";
import { GAMING_X_URL, GAMING_X_WEB } from "../../data/gamingPortal";

/** Second Hangar lane — avoids two Twitchplayers; Lives open in IG, optional pinned replay embed via env. */
export default function GamingInstagramLiveBay() {
  const embedSrc = useMemo(() => resolveInstagramHangarEmbedSrc(), []);

  return (
    <div className="gaming-instagram-bay gaming-live-bay gaming-live-bay--obsidian">
      <div className="gaming-live-bay__chrome gaming-instagram-bay__chrome" aria-hidden>
        <span className="gaming-live-bay__dot gaming-live-bay__dot--a" />
        <span className="gaming-live-bay__dot gaming-live-bay__dot--b" />
        <span className="gaming-live-bay__dot gaming-live-bay__dot--c" />
        <span className="gaming-live-bay__label">
          <Camera size={10} aria-hidden />
          IG HANGAR · {GAMING_INSTAGRAM_HANDLE_DISPLAY}
        </span>
      </div>

      <div className="gaming-live-bay__toolbar">
        <a
          href={GAMING_INSTAGRAM_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="gaming-live-bay__creator"
        >
          {GAMING_INSTAGRAM_HANDLE_DISPLAY}
        </a>
      </div>

      <SilentHangarFrame
        showMuteVeil={false}
        showAudioToggle={false}
        className="gaming-instagram-bay__player-shell"
        screenClassName="gaming-instagram-bay__screen"
        loading={false}
      >
        {embedSrc ? (
          <iframe
            title="USJET on Instagram — embedded replay"
            src={embedSrc}
            className="gaming-instagram-bay__iframe"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="encrypted-media; picture-in-picture"
          />
        ) : (
          <div className="gaming-instagram-bay__placeholder">
            <p className="gaming-instagram-bay__placeholder-kicker">Live lives on Instagram</p>
            <p className="gaming-instagram-bay__placeholder-body">
              Instagram doesn&apos;t expose a Twitch-style live iframe here — when we go Live, tap through and catch it
              in the app. Afterward you can pin a reel or post for replay: set{" "}
              <code className="gaming-instagram-bay__code">VITE_GAMING_INSTAGRAM_EMBED_PERMALINK</code> in your env.
            </p>
            <div className="gaming-instagram-bay__placeholder-actions">
              <a
                href={GAMING_INSTAGRAM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gaming-instagram-bay__placeholder-cta btn-glass glass-effect-interactive"
              >
                Open {GAMING_INSTAGRAM_HANDLE_DISPLAY}
              </a>
              <a
                href={GAMING_X_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gaming-instagram-bay__placeholder-cta btn-glass glass-effect-interactive gaming-instagram-bay__placeholder-cta--x"
              >
                Open {GAMING_X_WEB}
              </a>
            </div>
          </div>
        )}
      </SilentHangarFrame>

      <footer className="gaming-live-bay__footer gaming-instagram-bay__footer">
        <span>{GAMING_INSTAGRAM_TAGLINE}</span>
        <div className="gaming-instagram-bay__footer-actions">
          <a
            href={GAMING_INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gaming-live-bay__open btn-glass glass-effect-interactive gaming-instagram-bay__footer-btn"
          >
            <ExternalLink size={12} aria-hidden />
            Open Instagram
          </a>
          <a
            href={GAMING_X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gaming-live-bay__open btn-glass glass-effect-interactive gaming-instagram-bay__footer-btn gaming-instagram-bay__footer-btn--x"
          >
            <ExternalLink size={12} aria-hidden />
            Open {GAMING_X_WEB}
          </a>
        </div>
      </footer>
    </div>
  );
}
