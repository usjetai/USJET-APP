import { ExternalLink, Radio } from "lucide-react";
import SilentHangarTwitchPlayer from "../media/SilentHangarTwitchPlayer";
import {
  GAMING_TWITCH_CHANNEL,
  GAMING_TWITCH_DISPLAY,
  GAMING_TWITCH_TAGLINE,
  GAMING_TWITCH_URL,
} from "../../data/gamingPortal";

type GamingTwitchBayProps = {
  variant?: "default" | "hangar";
};

export default function GamingTwitchBay({ variant = "default" }: GamingTwitchBayProps) {
  const isHangar = variant === "hangar";

  return (
    <div
      className={[
        "gaming-twitch-bay gaming-live-bay",
        isHangar ? "gaming-twitch-bay--hangar gaming-live-bay--obsidian" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="gaming-live-bay__chrome" aria-hidden>
        <span className="gaming-live-bay__dot gaming-live-bay__dot--a" />
        <span className="gaming-live-bay__dot gaming-live-bay__dot--b" />
        <span className="gaming-live-bay__dot gaming-live-bay__dot--c" />
        <span className="gaming-live-bay__label">
          <Radio size={10} aria-hidden />
          HANGAR CAM · {GAMING_TWITCH_DISPLAY}
        </span>
      </div>

      <div className="gaming-live-bay__toolbar">
        <a href={GAMING_TWITCH_URL} target="_blank" rel="noopener noreferrer" className="gaming-live-bay__creator">
          {GAMING_TWITCH_DISPLAY}
        </a>
      </div>

      <SilentHangarTwitchPlayer
        channel={GAMING_TWITCH_CHANNEL}
        className="gaming-twitch-bay__player-shell"
        mountClassName="gaming-twitch-bay__player silent-hangar-twitch__mount"
      />

      {!isHangar ? (
        <footer className="gaming-live-bay__footer">
          <span>{GAMING_TWITCH_TAGLINE}</span>
          <a href={GAMING_TWITCH_URL} target="_blank" rel="noopener noreferrer" className="gaming-live-bay__open">
            <ExternalLink size={12} aria-hidden />
            Open on Twitch
          </a>
        </footer>
      ) : null}
    </div>
  );
}
