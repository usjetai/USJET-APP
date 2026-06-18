import { useCallback, useEffect, useRef, useState } from "react";
import { Crown, Radio, Waves } from "lucide-react";
import type { FleetUnit } from "../../types/fleet";
import {
  formatRadioCallsign,
  formatRadioTimestamp,
  HIRED_HUD_RADIO_CHANNEL,
  HIRED_HUD_RADIO_CREW_LINE_POOL,
  HIRED_HUD_RADIO_FOUNDER,
  HIRED_HUD_RADIO_FOUNDER_LINE_POOL,
  HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID,
  HIRED_HUD_RADIO_FREQUENCY,
  HIRED_HUD_RADIO_REPLY_TEMPLATES,
  HIRED_HUD_RADIO_SLOT_LINES,
  HIRED_HUD_RADIO_TITLE,
  pickRadioLine,
  trackRadioRecentLine,
} from "../../data/hiredHudRadioChat";
import { getHiredDeveloperHubAvatarPath } from "../../lib/hiredHudDeveloperAvatars";
import FounderGodRadioIcon from "./FounderGodRadioIcon";
import HiredCrewRadioIcon from "./HiredCrewRadioIcon";

type RadioSpeakerId = number | typeof HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID;

type RadioMessage = {
  id: string;
  speakerId: RadioSpeakerId;
  slot: number | null;
  name: string;
  callsign: string;
  text: string;
  time: string;
  avatarPath?: string;
  isFounderGod?: boolean;
};

type HiredHudRadioChatProps = {
  units: FleetUnit[];
};

const MAX_VISIBLE_MESSAGES = 16;
/** Slower net — each transmission waits a random beat before the next. */
const MESSAGE_DELAY_MIN_MS = 3800;
const MESSAGE_DELAY_MAX_MS = 9200;
const FOUNDER_SPEAKER_WEIGHT = 0.24;

function randomUnit(): number {
  return Math.random();
}

function randomResponseDelayMs(): number {
  const spread = MESSAGE_DELAY_MAX_MS - MESSAGE_DELAY_MIN_MS;
  return MESSAGE_DELAY_MIN_MS + Math.floor(Math.random() * (spread + 1));
}

function pickCrewLine(units: FleetUnit[], speakerSlot: number, recent: ReadonlySet<string>): string {
  const roll = randomUnit();
  const others = units.filter((unit) => unit.slot !== speakerSlot);

  if (roll < 0.2 && others.length > 0) {
    const target = others[Math.floor(randomUnit() * others.length)];
    const template = HIRED_HUD_RADIO_REPLY_TEMPLATES[Math.floor(randomUnit() * HIRED_HUD_RADIO_REPLY_TEMPLATES.length)];
    return template(target.name);
  }

  const slotLines = HIRED_HUD_RADIO_SLOT_LINES[speakerSlot];
  if (slotLines && roll < 0.48) {
    return pickRadioLine(slotLines, recent, randomUnit);
  }

  return pickRadioLine(HIRED_HUD_RADIO_CREW_LINE_POOL, recent, randomUnit);
}

function pickFounderLine(recent: ReadonlySet<string>): string {
  return pickRadioLine(HIRED_HUD_RADIO_FOUNDER_LINE_POOL, recent, randomUnit);
}

function pickSpeaker(units: FleetUnit[]): RadioSpeakerId {
  if (units.length === 0) {
    return HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID;
  }

  if (randomUnit() < FOUNDER_SPEAKER_WEIGHT) {
    return HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID;
  }
  return units[Math.floor(randomUnit() * units.length)].slot;
}

function buildCrewMessage(
  units: FleetUnit[],
  speakerSlot: number,
  recent: ReadonlySet<string>,
  stamp: Date,
): RadioMessage {
  const unit = units.find((entry) => entry.slot === speakerSlot) ?? units[0];
  const text = pickCrewLine(units, unit.slot, recent);
  return {
    id: `${speakerSlot}-${stamp.getTime()}-${Math.floor(randomUnit() * 99999)}`,
    speakerId: unit.slot,
    slot: unit.slot,
    name: unit.name,
    callsign: formatRadioCallsign(unit.slot, unit.name),
    text,
    time: formatRadioTimestamp(stamp),
    avatarPath: getHiredDeveloperHubAvatarPath(unit.slot),
  };
}

function buildFounderMessage(recent: ReadonlySet<string>, stamp: Date): RadioMessage {
  const text = pickFounderLine(recent);
  return {
    id: `founder-${stamp.getTime()}-${Math.floor(randomUnit() * 99999)}`,
    speakerId: HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID,
    slot: null,
    name: HIRED_HUD_RADIO_FOUNDER.name,
    callsign: HIRED_HUD_RADIO_FOUNDER.callsign,
    text,
    time: formatRadioTimestamp(stamp),
    avatarPath: HIRED_HUD_RADIO_FOUNDER.avatarPath,
    isFounderGod: true,
  };
}

function buildMessage(
  units: FleetUnit[],
  speakerId: RadioSpeakerId,
  recent: ReadonlySet<string>,
  stamp: Date,
): RadioMessage {
  if (speakerId === HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID) {
    return buildFounderMessage(recent, stamp);
  }
  return buildCrewMessage(units, speakerId, recent, stamp);
}

function seedMessages(units: FleetUnit[], recent: Set<string>): RadioMessage[] {
  if (units.length === 0) {
    return [];
  }

  const maxSpeakers = Math.min(8, units.length + 1);
  const speakers: RadioSpeakerId[] = [];
  let guard = 0;

  while (speakers.length < maxSpeakers && guard < 400) {
    guard += 1;
    const next = pickSpeaker(units);
    if (!speakers.includes(next)) {
      speakers.push(next);
    }
  }

  if (!speakers.includes(HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID) && speakers.length > 0) {
    speakers[speakers.length - 1] = HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID;
  }

  const now = Date.now();
  const offsets = [0];
  for (let i = 1; i < speakers.length; i += 1) {
    offsets.push(offsets[i - 1] + randomResponseDelayMs());
  }
  const totalBackMs = offsets[offsets.length - 1];

  return speakers.map((speakerId, index) => {
    const stamp = new Date(now - (totalBackMs - offsets[index]));
    const message = buildMessage(units, speakerId, recent, stamp);
    trackRadioRecentLine(recent, message.text);
    return message;
  });
}

export default function HiredHudRadioChat({ units }: HiredHudRadioChatProps) {
  const recentLinesRef = useRef<Set<string>>(new Set());
  const [messages, setMessages] = useState<RadioMessage[]>(() => seedMessages(units, recentLinesRef.current));
  const [activeSpeakerId, setActiveSpeakerId] = useState<RadioSpeakerId | null>(
    () => messages[messages.length - 1]?.speakerId ?? null,
  );
  const [squelch, setSquelch] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const pushMessage = useCallback(() => {
    const speakerId = pickSpeaker(units);
    const next = buildMessage(units, speakerId, recentLinesRef.current, new Date());
    trackRadioRecentLine(recentLinesRef.current, next.text);

    setActiveSpeakerId(speakerId);
    setSquelch(true);
    window.setTimeout(() => setSquelch(false), 220);

    setMessages((current) => [...current, next].slice(-MAX_VISIBLE_MESSAGES));
  }, [units]);

  useEffect(() => {
    let timeoutId = 0;

    const scheduleNext = () => {
      timeoutId = window.setTimeout(() => {
        if (!document.hidden) {
          pushMessage();
        }
        scheduleNext();
      }, randomResponseDelayMs());
    };

    scheduleNext();
    return () => window.clearTimeout(timeoutId);
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
        <span className="hired-hud__radio-comms-god">
          <Crown size={12} aria-hidden />
          GOD on net
        </span>
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
            const isActive = message.speakerId === activeSpeakerId && isLatest;
            return (
              <article
                key={message.id}
                className={[
                  "hired-hud__radio-line",
                  isLatest ? "hired-hud__radio-line--latest" : "",
                  isActive ? "hired-hud__radio-line--active" : "",
                  message.isFounderGod ? "hired-hud__radio-line--founder-god" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <time className="hired-hud__radio-time" dateTime={message.time}>
                  {message.time}
                </time>
                <div
                  className={[
                    "hired-hud__radio-avatar-wrap",
                    message.isFounderGod ? "hired-hud__radio-avatar-wrap--founder-god" : "hired-hud__radio-avatar-wrap--crew",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {message.isFounderGod ? (
                    <FounderGodRadioIcon
                      variant="log"
                      size={40}
                      imgClassName="hired-hud__radio-avatar"
                    />
                  ) : message.avatarPath ? (
                    <HiredCrewRadioIcon
                      src={message.avatarPath}
                      slot={message.slot ?? 0}
                      variant="log"
                      size={40}
                      imgClassName="hired-hud__radio-avatar"
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
        <li
          className={[
            "hired-hud__radio-roster-item",
            "hired-hud__radio-roster-item--founder-god",
            activeSpeakerId === HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID ? "hired-hud__radio-roster-item--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <FounderGodRadioIcon
            variant="roster"
            size={34}
            imgClassName="hired-hud__radio-roster-avatar hired-hud__radio-roster-avatar--founder-god"
          />
          <span className="hired-hud__radio-roster-name">{HIRED_HUD_RADIO_FOUNDER.rosterLabel}</span>
        </li>
        {units.map((unit) => {
          const avatarPath = getHiredDeveloperHubAvatarPath(unit.slot);
          const isActive = unit.slot === activeSpeakerId;
          return (
            <li
              key={`radio-roster-${unit.slot}`}
              className={["hired-hud__radio-roster-item", "hired-hud__radio-roster-item--crew", isActive ? "hired-hud__radio-roster-item--active" : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {avatarPath ? (
                <HiredCrewRadioIcon
                  src={avatarPath}
                  slot={unit.slot}
                  variant="roster"
                  size={34}
                  imgClassName="hired-hud__radio-roster-avatar"
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
