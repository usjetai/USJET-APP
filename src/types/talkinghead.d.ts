declare module "*headaudio/headaudio.mjs" {
  export class HeadAudio extends AudioWorkletNode {
    constructor(audioCtx: AudioContext, options?: Record<string, unknown>);
    onvalue: ((key: string, value: number) => void) | null;
    onstarted: ((data: unknown) => void) | null;
    onended: ((data: unknown) => void) | null;
    loadModel(url: string): Promise<void>;
    update(dt: number): void;
    start(): void;
    stop(): void;
  }
}

declare module "@met4citizen/talkinghead" {
  export class TalkingHead {
    constructor(node: HTMLElement, opt?: Record<string, unknown>);
    opt: Record<string, unknown> & {
      update?: ((dt: number) => void) | null;
    };
    audioCtx: AudioContext;
    audioSpeechGainNode: GainNode;
    audioAnalyzerNode: AnalyserNode;
    audioReverbNode: AudioNode;
    armature: unknown;
    mtAvatar: Record<string, { newvalue?: number; needsUpdate?: boolean }>;
    isSpeaking: boolean;
    showAvatar(
      avatar: { url: string; body?: string; avatarMood?: string; lipsyncLang?: string },
      onprogress?: ((ev: ProgressEvent) => void) | null,
    ): Promise<void>;
    start(): void;
    stop(): void;
    setMood(mood: string): void;
    lookAtCamera(t?: number): void;
    speakWithHands(delay?: number, prob?: number): void;
    playGesture(name: string, dur?: number): void;
    speakEmoji(emoji: string): void;
    speakText(
      s: string,
      opt?: Record<string, unknown> | null,
      onsubtitles?: ((s: string) => void) | null,
    ): void;
    speakAudio(
      r: {
        audio?: AudioBuffer | ArrayBuffer[];
        words?: string[];
        wtimes?: number[];
        wdurations?: number[];
        visemes?: string[];
        vtimes?: number[];
        vdurations?: number[];
      },
      opt?: Record<string, unknown> | null,
      onsubtitles?: ((s: string) => void) | null,
    ): void;
    stopSpeaking(): void;
    dispose(): void;
  }
}

