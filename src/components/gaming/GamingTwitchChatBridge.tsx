import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import {
  HANGAR_LIVE_CHAT_LEDE,
  HANGAR_LIVE_CHAT_RESOURCES,
  HANGAR_LIVE_CHAT_TITLE,
} from "../../data/liveHangar";
import {
  GAMING_TWITCH_CHANNEL,
  GAMING_TWITCH_URL,
  GAMING_X_URL,
  GAMING_X_WEB,
} from "../../data/gamingPortal";
import { buildTwitchChatEmbedUrl } from "../../lib/twitchEmbed";

export default function GamingTwitchChatBridge() {
  const [chatSrc, setChatSrc] = useState("");

  useEffect(() => {
    setChatSrc(buildTwitchChatEmbedUrl(GAMING_TWITCH_CHANNEL));
  }, []);

  return (
    <aside className="gaming-twitch-chat" aria-labelledby="gaming-twitch-chat-title">
      <header className="gaming-twitch-chat__head">
        <MessageCircle size={16} aria-hidden />
        <div>
          <h3 id="gaming-twitch-chat-title" className="gaming-twitch-chat__title">
            {HANGAR_LIVE_CHAT_TITLE}
          </h3>
          <p className="gaming-twitch-chat__lede">{HANGAR_LIVE_CHAT_LEDE}</p>
        </div>
      </header>

      <ul className="gaming-twitch-chat__resources">
        {HANGAR_LIVE_CHAT_RESOURCES.map((item) =>
          "to" in item ? (
            <li key={item.to}>
              <Link to={item.to} className="gaming-twitch-chat__resource">
                <span className="gaming-twitch-chat__resource-label">{item.label}</span>
                <span className="gaming-twitch-chat__resource-hint">{item.hint}</span>
              </Link>
            </li>
          ) : (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="gaming-twitch-chat__resource">
                <span className="gaming-twitch-chat__resource-label">{item.label}</span>
                <span className="gaming-twitch-chat__resource-hint">{item.hint}</span>
              </a>
            </li>
          ),
        )}
      </ul>

      <div className="gaming-twitch-chat__frame-wrap">
        {chatSrc ? (
          <iframe
            className="gaming-twitch-chat__frame"
            src={chatSrc}
            title="Twitch live chat — USJET Hangar"
          />
        ) : (
          <p className="gaming-twitch-chat__loading" aria-live="polite">
            Loading chat…
          </p>
        )}
      </div>

      <div className="gaming-twitch-chat__popouts">
        <a
          href={GAMING_TWITCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="gaming-twitch-chat__popout btn-glass glass-effect-interactive glass-tint-cyan"
        >
          Open chat on Twitch
        </a>
        <a
          href={GAMING_X_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="gaming-twitch-chat__popout btn-glass glass-effect-interactive gaming-twitch-chat__popout--x"
        >
          Open {GAMING_X_WEB}
        </a>
      </div>
    </aside>
  );
}
