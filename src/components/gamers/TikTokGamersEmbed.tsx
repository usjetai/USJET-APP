import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Volume2, VolumeX } from "lucide-react";
import {
  GAMERS_SOUND_OFF_LABEL,
  GAMERS_SOUND_ON_LABEL,
  GAMERS_TIKTOK_PROFILE_URL,
  GAMERS_TIKTOK_USERNAME,
  GAMERS_TIKTOK_VIDEO_ID,
  GAMERS_TIKTOK_VIDEO_URL,
  GAMERS_TRACK_LABEL,
} from "../../data/gamersPage";
import { loadTikTokEmbedScript, renderTikTokEmbed } from "../../lib/tiktokEmbedScript";

const TIKTOK_MUSIC_URL = "https://www.tiktok.com/music/Huddy-6927327993220057090?refer=embed";

type TikTokGamersEmbedProps = {
  className?: string;
};

/** Official TikTok blockquote embed (@usjetnyc) in the arcade box + speaker control. */
export default function TikTokGamersEmbed({ className = "" }: TikTokGamersEmbedProps) {
  const [soundOn, setSoundOn] = useState(false);
  const [embedReady, setEmbedReady] = useState(false);
  const [embedKey, setEmbedKey] = useState(0);
  const blockquoteRef = useRef<HTMLQuoteElement>(null);

  const mountEmbed = useCallback(async () => {
    setEmbedReady(false);
    try {
      await loadTikTokEmbedScript();
      renderTikTokEmbed(blockquoteRef.current);
      setEmbedReady(true);
    } catch {
      setEmbedReady(false);
    }
  }, []);

  useEffect(() => {
    void mountEmbed();
  }, [embedKey, mountEmbed]);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      if (next) {
        setEmbedKey((k) => k + 1);
      }
      return next;
    });
  }, []);

  const rootClass = ["gamers-arcade-box", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      <div className="gamers-arcade-box__chrome" aria-hidden>
        <span className="gamers-arcade-box__dot gamers-arcade-box__dot--a" />
        <span className="gamers-arcade-box__dot gamers-arcade-box__dot--b" />
        <span className="gamers-arcade-box__dot gamers-arcade-box__dot--c" />
        <span className="gamers-arcade-box__chrome-label">USJET · GAMERS</span>
      </div>

      <div className="gamers-arcade-box__toolbar">
        <a
          href={GAMERS_TIKTOK_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="gamers-arcade-box__creator"
        >
          {GAMERS_TIKTOK_USERNAME}
        </a>
        <button
          type="button"
          className={[
            "gamers-arcade-box__sound btn-glass glass-effect-interactive",
            soundOn ? "gamers-arcade-box__sound--on" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? "Mute — use TikTok player controls" : "Turn on sound for this clip"}
        >
          {soundOn ? <Volume2 size={18} strokeWidth={2.4} aria-hidden /> : <VolumeX size={18} strokeWidth={2.4} aria-hidden />}
          <span>{soundOn ? "Sound on" : "Speaker"}</span>
        </button>
      </div>

      <div className="gamers-arcade-box__screen" key={embedKey}>
        <div className="gamers-arcade-box__embed-wrap">
          <blockquote
            ref={blockquoteRef}
            className="tiktok-embed gamers-arcade-box__tiktok"
            cite={GAMERS_TIKTOK_VIDEO_URL}
            data-video-id={GAMERS_TIKTOK_VIDEO_ID}
            style={{ maxWidth: "605px", minWidth: "325px", margin: "0 auto" }}
          >
            <section>
              <a target="_blank" rel="noopener noreferrer" title={GAMERS_TIKTOK_USERNAME} href={GAMERS_TIKTOK_PROFILE_URL}>
                {GAMERS_TIKTOK_USERNAME}
              </a>
              <p />
              <a target="_blank" rel="noopener noreferrer" title={GAMERS_TRACK_LABEL} href={TIKTOK_MUSIC_URL}>
                {GAMERS_TRACK_LABEL}
              </a>
            </section>
          </blockquote>
        </div>

        {!soundOn ? (
          <div className="gamers-arcade-box__mute-veil" aria-hidden>
            <VolumeX size={32} strokeWidth={2} />
            <p>{GAMERS_SOUND_OFF_LABEL}</p>
          </div>
        ) : !embedReady ? (
          <div className="gamers-arcade-box__loading" aria-live="polite">
            Loading clip…
          </div>
        ) : (
          <p className="gamers-arcade-box__sound-hint" role="status">
            {GAMERS_SOUND_ON_LABEL}
          </p>
        )}
      </div>

      <footer className="gamers-arcade-box__footer">
        <p className="gamers-arcade-box__track">{GAMERS_TRACK_LABEL}</p>
        <a
          href={GAMERS_TIKTOK_VIDEO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="gamers-arcade-box__open"
        >
          <ExternalLink size={12} aria-hidden />
          Open on TikTok
        </a>
      </footer>
    </div>
  );
}
