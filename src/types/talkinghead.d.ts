declare module "@met4citizen/talkinghead" {
  export class TalkingHead {
    constructor(
      node: HTMLElement,
      opt?: Record<string, unknown>,
    );
    opt: Record<string, unknown>;
    audioCtx: AudioContext;
    armature: unknown;
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
