import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Crown, Radio, Waves } from "lucide-react";
import type { FleetUnit } from "../../types/fleet";
import {
  formatRadioCallsign,
  formatRadioTimestamp,
  HIRED_HUD_RADIO_CHANNEL,
  HIRED_HUD_RADIO_FOUNDER,
  HIRED_HUD_RADIO_FOUNDER_JOKES,
  HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID,
  HIRED_HUD_RADIO_FREQUENCY,
  HIRED_HUD_RADIO_GENERIC_LINES,
  HIRED_HUD_RADIO_REPLY_TEMPLATES,
  HIRED_HUD_RADIO_SLOT_LINES,
  HIRED_HUD_RADIO_TITLE,
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

const MAX_VISIBLE_MESSAGES = 14;
/** Slower net — each transmission waits a random beat before the next. */
const MESSAGE_DELAY_MIN_MS = 4200;
const MESSAGE_DELAY_MAX_MS = 9800;
const FOUNDER_SPEAKER_WEIGHT = 0.22;

function randomResponseDelayMs(rng: () => number): number {
  const spread = MESSAGE_DELAY_MAX_MS - MESSAGE_DELAY_MIN_MS;
  return MESSAGE_DELAY_MIN_MS + Math.floor(rng() * (spread + 1));
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function pickCrewLine(units: FleetUnit[], speakerSlot: number, rng: () => number): string {
  const roll = rng();
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

function pickFounderLine(rng: () => number): string {
  return HIRED_HUD_RADIO_FOUNDER_JOKES[Math.floor(rng() * HIRED_HUD_RADIO_FOUNDER_JOKES.length)];
}

function pickSpeaker(units: FleetUnit[], rng: () => number): RadioSpeakerId {
  if (rng() < FOUNDER_SPEAKER_WEIGHT) {
    return HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID;
  }
  return units[Math.floor(rng() * units.length)].slot;
}

function buildCrewMessage(units: FleetUnit[], speakerSlot: number, rng: () => number, stamp: Date): RadioMessage {
  const unit = units.find((entry) => entry.slot === speakerSlot) ?? units[0];
  return {
    id: `${speakerSlot}-${stamp.getTime()}-${Math.floor(rng() * 9999)}`,
    speakerId: unit.slot,
    slot: unit.slot,
    name: unit.name,
    callsign: formatRadioCallsign(unit.slot, unit.name),
    text: pickCrewLine(units, unit.slot, rng),
    time: formatRadioTimestamp(stamp),
    avatarPath: getHiredDeveloperHubAvatarPath(unit.slot),
  };
}

function buildFounderMessage(rng: () => number, stamp: Date): RadioMessage {
  return {
    id: `founder-${stamp.getTime()}-${Math.floor(rng() * 9999)}`,
    speakerId: HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID,
    slot: null,
    name: HIRED_HUD_RADIO_FOUNDER.name,
    callsign: HIRED_HUD_RADIO_FOUNDER.callsign,
    text: pickFounderLine(rng),
    time: formatRadioTimestamp(stamp),
    avatarPath: HIRED_HUD_RADIO_FOUNDER.avatarPath,
    isFounderGod: true,
  };
}

function buildMessage(units: FleetUnit[], speakerId: RadioSpeakerId, rng: () => number, stamp: Date): RadioMessage {
  if (speakerId === HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID) {
    return buildFounderMessage(rng, stamp);
  }
  return buildCrewMessage(units, speakerId, rng, stamp);
}

function seedMessages(units: FleetUnit[], rng: () => number): RadioMessage[] {
  const speakers: RadioSpeakerId[] = [];
  while (speakers.length < 7) {
    const next = pickSpeaker(units, rng);
    if (!speakers.includes(next)) {
      speakers.push(next);
    }
  }

  if (!speakers.includes(HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID)) {
    speakers[speakers.length - 1] = HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID;
  }

  const now = Date.now();
  const offsets = [0];
  for (let i = 1; i < speakers.length; i += 1) {
    offsets.push(offsets[i - 1] + randomResponseDelayMs(rng));
  }
  const totalBackMs = offsets[offsets.length - 1];

  return speakers.map((speakerId, index) => {
    const stamp = new Date(now - (totalBackMs - offsets[index]));
    return buildMessage(units, speakerId, rng, stamp);
  });
}

export default function HiredHudRadioChat({ units }: HiredHudRadioChatProps) {
  const rng = useMemo(() => createSeededRandom(104729), []);
  const [messages, setMessages] = useState<RadioMessage[]>(() => seedMessages(units, rng));
  const [activeSpeakerId, setActiveSpeakerId] = useState<RadioSpeakerId | null>(
    () => messages.at(-1)?.speakerId ?? null,
  );
  const [squelch, setSquelch] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const pushMessage = useCallback(() => {
    const speakerId = pickSpeaker(units, rng);
    const next = buildMessage(units, speakerId, rng, new Date());

    setActiveSpeakerId(speakerId);
    setSquelch(true);
    window.setTimeout(() => setSquelch(false), 220);

    setMessages((current) => [...current, next].slice(-MAX_VISIBLE_MESSAGES));
  }, [rng, units]);

  useEffect(() => {
    let timeoutId = 0;

    const scheduleNext = () => {
      timeoutId = window.setTimeout(() => {
        if (!document.hidden) {
          pushMessage();
        }
        scheduleNext();
      }, randomResponseDelayMs(rng));
    };

    scheduleNext();
    return () => window.clearTimeout(timeoutId);
  }, [pushMessage, rng]);

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
