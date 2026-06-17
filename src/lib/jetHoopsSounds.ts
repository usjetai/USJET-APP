/** Jet Hoops audio — placeholder triggers (drop MP3s in public/hoops/sounds/). */

export type JetHoopsSoundEvent = "pass" | "score" | "whistle" | "buzzer" | "dribble";

const JET_HOOPS_SOUND_SRC: Record<JetHoopsSoundEvent, string> = {
  pass: "/hoops/sounds/pass.mp3",
  score: "/hoops/sounds/swish.mp3",
  whistle: "/hoops/sounds/whistle.mp3",
  buzzer: "/hoops/sounds/buzzer.mp3",
  dribble: "/hoops/sounds/dribble.mp3",
};

const audioCache = new Map<JetHoopsSoundEvent, HTMLAudioElement>();

function getClip(event: JetHoopsSoundEvent): HTMLAudioElement {
  let clip = audioCache.get(event);
  if (!clip) {
    clip = new Audio(JET_HOOPS_SOUND_SRC[event]);
    clip.preload = "auto";
    audioCache.set(event, clip);
  }
  return clip;
}

/** Play a sound if the asset exists; silent noop otherwise. */
export function triggerJetHoopsSound(event: JetHoopsSoundEvent, volume = 0.48): void {
  try {
    const clip = getClip(event);
    const node = clip.cloneNode(true) as HTMLAudioElement;
    node.volume = volume;
    void node.play().catch(() => {
      if (import.meta.env.DEV) {
        console.debug(`[Jet Hoops] sound placeholder · ${event}`);
      }
    });
  } catch {
    if (import.meta.env.DEV) {
      console.debug(`[Jet Hoops] sound placeholder · ${event}`);
    }
  }
}

export const jetHoopsSounds = {
  onPass: () => triggerJetHoopsSound("pass"),
  onScore: () => triggerJetHoopsSound("score", 0.62),
  onWhistle: () => triggerJetHoopsSound("whistle", 0.42),
  onBuzzer: () => triggerJetHoopsSound("buzzer", 0.55),
  onDribble: () => triggerJetHoopsSound("dribble", 0.28),
} as const;
