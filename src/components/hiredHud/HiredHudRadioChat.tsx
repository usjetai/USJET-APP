import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Radio, Waves } from "lucide-react";
import type { FleetUnit } from "../../types/fleet";
import {
  formatRadioCallsign,
  formatRadioTimestamp,
  HIRED_HUD_RADIO_CHANNEL,
  HIRED_HUD_RADIO_FREQUENCY,
  HIRED_HUD_RADIO_GENERIC_LINES,
  HIRED_HUD_RADIO_REPLY_TEMPLATES,
  HIRED_HUD_RADIO_SLOT_LINES,
  HIRED_HUD_RADIO_TITLE,
} from "../../data/hiredHudRadioChat";
import { getHiredDeveloperHubAvatarPath } from "../../lib/hiredHudDeveloperAvatars";

type RadioMessage = {
  id: string;
  slot: number;
  name: string;
  callsign: string;
  text: string;
  time: string;
  avatarPath?: string;
};

type HiredHudRadioChatProps = {
  units: FleetUnit[];
};

const MAX_VISIBLE_MESSAGES = 14;
const MESSAGE_INTERVAL_MS = 1800;

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pickLine(units: FleetUnit[], speakerSlot: number, rng: () => number): string {
  const roll = rng();
  const speaker = units.find((unit) => unit.slot === speakerSlot);
  const others = units.filter((unit) => unit.slot !== speakerSlot);

  if (roll < 0.22 && others.length > 0) {
    const target = others[Math.floor(rng() * others.length)];
    const template = HIRED_HUD_RADIO_REPLY_TEMPLATES[Math.floor(rng() * HIRED_HUD_RADIO_REPLY_TEMPLATES.length)];
    return template(target.name);
  }

  const slotLines = HIRED_HUD_RADIO_SLOT_LINES[speakerSlot];
  if (slotLines && roll < 0.52) {
    return slotLines[Math.floor(rng() * slotLines.length)];
  }

  return HIRED_HUD_RADIO_GENERIC_LINES[Math.floor(rng() * HIRED_HUD_RADIO_GENERIC_LINES.length)];
}

function buildMessage(units: FleetUnit[], speakerSlot: number, rng: () => number, stamp: Date): RadioMessage {
  const unit = units.find((entry) => entry.slot === speakerSlot) ?? units[0];
  return {
    id: `${speakerSlot}-${stamp.getTime()}-${Math.floor(rng() * 9999)}`,
    slot: unit.slot,
    name: unit.name,
    callsign: formatRadioCallsign(unit.slot, unit.name),
    text: pickLine(units, unit.slot, rng),
    time: formatRadioTimestamp(stamp),
    avatarPath: getHiredDeveloperHubAvatarPath(unit.slot),
  };
}

function seedMessages(units: FleetUnit[], rng: () => number): RadioMessage[] {
  const shuffled = [...units].sort(() => rng() - 0.5);
  const count = Math.min(7, shuffled.length);
  const now = Date.now();

  return shuffled.slice(0, count).map((unit, index) => {
    const stamp = new Date(now - (count - index) * 1600);
    return buildMessage(units, unit.slot, rng, stamp);
  });
}

export default function HiredHudRadioChat({ units }: HiredHudRadioChatProps) {
  const rng = useMemo(() => createSeededRandom(104729), []);
  const [messages, setMessages] = useState<RadioMessage[]>(() => seedMessages(units, rng));
  const [activeSlot, setActiveSlot] = useState<number | null>(() => messages.at(-1)?.slot ?? null);
  const [squelch, setSquelch] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const pushMessage = useCallback(() => {
    const speaker = units[Math.floor(rng() * units.length)];
    const next = buildMessage(units, speaker.slot, rng, new Date());

    setActiveSlot(speaker.slot);
    setSquelch(true);
    window.setTimeout(() => setSquelch(false), 220);

    setMessages((current) => [...current, next].slice(-MAX_VISIBLE_MESSAGES));
  }, [rng, units]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      pushMessage();
    }, MESSAGE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [pushMessage]);

  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  if (units.length === 0) {
    return null;
  }

  return (
    <div className="hired-hud__radio-comms" aria-label="Fleet radio chat">
      <div className="hired-hud__radio-comms-head">
        <span className="hired-hud__radio-comms-title">
          <Radio size={16} aria-hidden />
          {HIRED_HUD_RADIO_TITLE}
        </span>
        <span className="hired-hud__radio-comms-meta">
          <Waves size={14} aria-hidden />
          {HIRED_HUD_RADIO_CHANNEL}
        </span>
        <span className="hired-hud__radio-comms-freq">{HIRED_HUD_RADIO_FREQUENCY}</span>
        <span className="hired-hud__radio-comms-live">
          <span className="hired-hud__radio-comms-live-ping" aria-hidden />
          Live
        </span>
      </div>

      <div className={`hired-hud__radio-log-wrap${squelch ? " hired-hud__radio-log-wrap--squelch" : ""}`}>
        <div className="hired-hud__radio-static" aria-hidden />
        <div ref={logRef} className="hired-hud__radio-log" role="log" aria-live="polite" aria-relevant="additions">
          {messages.map((message, index) => {
            const isLatest = index === messages.length - 1;
            return (
              <article
                key={message.id}
                className={[
                  "hired-hud__radio-line",
                  isLatest ? "hired-hud__radio-line--latest" : "",
                  message.slot === activeSlot && isLatest ? "hired-hud__radio-line--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <time className="hired-hud__radio-time" dateTime={message.time}>
                  {message.time}
                </time>
                <div className="hired-hud__radio-avatar-wrap">
                  {message.avatarPath ? (
                    <img
                      src={message.avatarPath}
                      alt=""
                      className="hired-hud__radio-avatar"
                      width={40}
                      height={40}
                      decoding="async"
                      draggable={false}
                    />
                  ) : (
                    <span className="hired-hud__radio-avatar-fallback" aria-hidden />
                  )}
                </div>
                <div className="hired-hud__radio-copy">
                  <span className="hired-hud__radio-callsign">{message.callsign}</span>
                  <p className="hired-hud__radio-text">{message.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ul className="hired-hud__radio-roster" aria-label="Crew on channel">
        {units.map((unit) => {
          const avatarPath = getHiredDeveloperHubAvatarPath(unit.slot);
          const isActive = unit.slot === activeSlot;
          return (
            <li
              key={`radio-roster-${unit.slot}`}
              className={["hired-hud__radio-roster-item", isActive ? "hired-hud__radio-roster-item--active" : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {avatarPath ? (
                <img
                  src={avatarPath}
                  alt=""
                  className="hired-hud__radio-roster-avatar"
                  width={34}
                  height={34}
                  decoding="async"
                  draggable={false}
                />
              ) : (
                <span className="hired-hud__radio-roster-fallback" aria-hidden />
              )}
              <span className="hired-hud__radio-roster-name">{unit.name.split(" ")[0]}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
