import { SILENT_HANGAR_LABEL_ARMED, SILENT_HANGAR_LABEL_MUTED } from "../../data/silentHangar";
import { SITE_AUDIO_DISABLED } from "../../data/siteAudio";
import { useSilentHangarOptional } from "../../context/SilentHangarContext";

type SilentHangarAudioToggleProps = {
  className?: string;
};

function IconMuted() {
  return (
    <svg className="silent-hangar-audio-toggle__glyph" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9v6h4l5 4V5L8 9H4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M16 9l4 6M20 9l-4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconArmed() {
  return (
    <svg className="silent-hangar-audio-toggle__glyph silent-hangar-audio-toggle__glyph--wave" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10v4h4l5 4V6L8 10H4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path className="silent-hangar-audio-toggle__bar silent-hangar-audio-toggle__bar--1" d="M17 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="silent-hangar-audio-toggle__bar silent-hangar-audio-toggle__bar--2" d="M20 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="silent-hangar-audio-toggle__bar silent-hangar-audio-toggle__bar--3" d="M14 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Liquid-glass Captain's audio control — bottom-right of video frames. */
export default function SilentHangarAudioToggle({ className = "" }: SilentHangarAudioToggleProps) {
  if (SITE_AUDIO_DISABLED) {
    return null;
  }

  const { audioArmed, toggleAudioArmed } = useSilentHangarOptional();

  return (
    <button
      type="button"
      className={[
        "silent-hangar-audio-toggle btn-glass glass-effect-interactive",
        audioArmed ? "silent-hangar-audio-toggle--armed" : "silent-hangar-audio-toggle--muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={toggleAudioArmed}
      aria-pressed={audioArmed}
      aria-label={audioArmed ? SILENT_HANGAR_LABEL_ARMED : SILENT_HANGAR_LABEL_MUTED}
      title={audioArmed ? SILENT_HANGAR_LABEL_ARMED : SILENT_HANGAR_LABEL_MUTED}
    >
      <span className="silent-hangar-audio-toggle__glow" aria-hidden />
      {audioArmed ? <IconArmed /> : <IconMuted />}
    </button>
  );
}
