import type { ReactNode } from "react";
import { SILENT_HANGAR_LABEL_MUTED } from "../../data/silentHangar";
import { useSilentHangarOptional } from "../../context/SilentHangarContext";
import SilentHangarAudioToggle from "./SilentHangarAudioToggle";

type SilentHangarFrameProps = {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  /** Show glass veil + label while muted (content embeds). */
  showMuteVeil?: boolean;
  /** Hide on third-party embeds (e.g. Instagram) where hangar audio cannot arm. */
  showAudioToggle?: boolean;
  loading?: boolean;
};

/** Video container — muted by default, custom toggle bottom-right. */
export default function SilentHangarFrame({
  children,
  className = "",
  screenClassName = "",
  showMuteVeil = true,
  showAudioToggle = true,
  loading = false,
}: SilentHangarFrameProps) {
  const { audioArmed } = useSilentHangarOptional();
  const muted = !audioArmed;

  return (
    <div className={["silent-hangar-frame", className].filter(Boolean).join(" ")}>
      <div className={["silent-hangar-frame__screen", screenClassName].filter(Boolean).join(" ")}>
        {children}
        {loading ? (
          <p className="silent-hangar-frame__loading" aria-live="polite">
            Loading signal…
          </p>
        ) : null}
        {showMuteVeil && muted ? (
          <div className="silent-hangar-frame__veil" aria-hidden>
            <p>{SILENT_HANGAR_LABEL_MUTED}</p>
          </div>
        ) : null}
        {showAudioToggle ? <SilentHangarAudioToggle /> : null}
      </div>
    </div>
  );
}
