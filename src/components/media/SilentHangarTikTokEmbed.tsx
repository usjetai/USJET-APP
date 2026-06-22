import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useSilentHangar } from "../../context/SilentHangarContext";
import { SITE_AUDIO_DISABLED } from "../../data/siteAudio";
import { applyTikTokEmbedMute } from "../../lib/tiktokEmbedAudio";
import { loadTikTokEmbedScript, renderTikTokEmbed } from "../../lib/tiktokEmbedScript";
import SilentHangarFrame from "./SilentHangarFrame";

type SilentHangarTikTokEmbedProps = {
  postId: string;
  postUrl: string;
  children: ReactNode;
  className?: string;
  wrapClassName?: string;
};

export default function SilentHangarTikTokEmbed({
  postId,
  postUrl,
  children,
  className = "",
  wrapClassName = "silent-hangar-tiktok__wrap",
}: SilentHangarTikTokEmbedProps) {
  const { audioArmed } = useSilentHangar();
  const rootRef = useRef<HTMLDivElement>(null);
  const blockquoteRef = useRef<HTMLQuoteElement>(null);
  const [embedReady, setEmbedReady] = useState(false);
  const [embedKey, setEmbedKey] = useState(0);
  const wasArmedRef = useRef(audioArmed);

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

  useEffect(() => {
    if (!SITE_AUDIO_DISABLED && audioArmed && !wasArmedRef.current) {
      setEmbedKey((k) => k + 1);
    }
    wasArmedRef.current = audioArmed;
  }, [audioArmed]);

  useEffect(() => {
    if (!embedReady) {
      return;
    }
    applyTikTokEmbedMute(rootRef.current, SITE_AUDIO_DISABLED || !audioArmed);
  }, [audioArmed, embedReady]);

  return (
    <SilentHangarFrame className={className} screenClassName="silent-hangar-tiktok__screen" loading={!embedReady}>
      <div ref={rootRef} className={wrapClassName} key={embedKey}>
        <blockquote
          ref={blockquoteRef}
          className="tiktok-embed"
          cite={postUrl}
          data-video-id={postId}
          style={{ maxWidth: "605px", minWidth: "325px", margin: "0 auto" }}
        >
          {children}
        </blockquote>
      </div>
    </SilentHangarFrame>
  );
}
