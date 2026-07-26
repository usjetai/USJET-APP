/**
 * OpenAI Realtime / HF Speech-to-Speech WebSocket client.
 * Streams mic PCM16 @ 16kHz via input_audio_buffer.append;
 * plays response.output_audio.delta (and legacy response.audio.delta).
 */

import {
  buildOriginRealtimeInstructions,
  ORIGIN_REALTIME_MODEL,
  ORIGIN_REALTIME_TOOLS,
  ORIGIN_REALTIME_VOICE,
} from "./originRealtimeTools";
import type { OriginRealtimeToolHandlers } from "./originRealtimeClient";

const TARGET_SAMPLE_RATE = 16_000;

function floatToPcm16Base64(input: Float32Array): string {
  const pcm = new Int16Array(input.length);
  for (let i = 0; i < input.length; i += 1) {
    const s = Math.max(-1, Math.min(1, input[i] ?? 0));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(pcm.buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function downsampleTo16k(input: Float32Array, inputRate: number): Float32Array {
  if (inputRate === TARGET_SAMPLE_RATE) return input;
  const ratio = inputRate / TARGET_SAMPLE_RATE;
  const length = Math.max(1, Math.floor(input.length / ratio));
  const out = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    out[i] = input[Math.floor(i * ratio)] ?? 0;
  }
  return out;
}

function pcm16Base64ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const pcm = new Int16Array(bytes.buffer);
  const out = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i += 1) {
    out[i] = (pcm[i] ?? 0) / 0x8000;
  }
  return out;
}

export class OriginS2SSocketClient {
  private socket: WebSocket | null = null;
  private audioCtx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private playTime = 0;
  private closing = false;
  private handlers: OriginRealtimeToolHandlers;
  private remoteDest: MediaStreamAudioDestinationNode | null = null;

  constructor(handlers: OriginRealtimeToolHandlers) {
    this.handlers = handlers;
  }

  get connected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  setMicEnabled(enabled: boolean) {
    this.micStream?.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }

  async connect(options?: { wsUrl: string; instructionsExtra?: string; protocols?: string[] }): Promise<void> {
    await this.disconnect(true);
    if (!options?.wsUrl) throw new Error("S2S WebSocket URL missing.");

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        channelCount: 1,
      },
    });
    this.micStream = stream;

    const audioCtx = new AudioContext();
    this.audioCtx = audioCtx;
    this.remoteDest = audioCtx.createMediaStreamDestination();
    this.handlers.onRemoteAudioStream?.(this.remoteDest.stream);

    const socket = new WebSocket(options.wsUrl, options.protocols);
    this.socket = socket;

    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("S2S WebSocket connect timeout")), 12_000);
      socket.onopen = () => {
        window.clearTimeout(timeout);
        resolve();
      };
      socket.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("S2S WebSocket failed to open."));
      };
    });

    socket.send(
      JSON.stringify({
        type: "session.update",
        session: {
          modalities: ["audio", "text"],
          instructions: buildOriginRealtimeInstructions(options.instructionsExtra),
          voice: ORIGIN_REALTIME_VOICE,
          model: ORIGIN_REALTIME_MODEL,
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          turn_detection: { type: "server_vad" },
          tools: ORIGIN_REALTIME_TOOLS,
        },
      }),
    );

    socket.onmessage = (event) => this.handleMessage(String(event.data));
    socket.onclose = () => {
      this.handlers.onSpeakingChange?.(false);
    };

    this.startMicCapture(audioCtx, stream);
  }

  private startMicCapture(audioCtx: AudioContext, stream: MediaStream) {
    const source = audioCtx.createMediaStreamSource(stream);
    this.micSource = source;
    // ScriptProcessor is deprecated but widely available for PCM tap without a custom worklet.
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    this.processor = processor;
    processor.onaudioprocess = (event) => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
      const input = event.inputBuffer.getChannelData(0);
      const down = downsampleTo16k(input, audioCtx.sampleRate);
      const audio = floatToPcm16Base64(down);
      this.socket.send(
        JSON.stringify({
          type: "input_audio_buffer.append",
          audio,
        }),
      );
    };
    source.connect(processor);
    processor.connect(audioCtx.destination);
    // Mute local mic monitor — gain 0 via silent sink
    const mute = audioCtx.createGain();
    mute.gain.value = 0;
    processor.disconnect();
    source.connect(processor);
    processor.connect(mute);
    mute.connect(audioCtx.destination);
  }

  private handleMessage(raw: string) {
    let message: {
      type?: string;
      name?: string;
      arguments?: string;
      delta?: string;
      audio?: string;
    };
    try {
      message = JSON.parse(raw) as typeof message;
    } catch {
      return;
    }

    const type = message.type ?? "";
    switch (type) {
      case "input_audio_buffer.speech_started":
        this.handlers.onSpeechStarted?.();
        break;
      case "response.output_audio.delta":
      case "response.audio.delta": {
        const delta = message.delta ?? message.audio;
        if (delta) this.enqueueAudioDelta(delta);
        this.handlers.onSpeakingChange?.(true);
        break;
      }
      case "response.output_audio.done":
      case "response.audio.done":
      case "output_audio_buffer.stopped":
        this.handlers.onSpeakingChange?.(false);
        if (this.closing) void this.disconnect(true);
        break;
      case "response.function_call_arguments.done": {
        const name = message.name;
        let args: Record<string, string> = {};
        try {
          args = message.arguments ? (JSON.parse(message.arguments) as Record<string, string>) : {};
        } catch {
          args = {};
        }
        if (name === "set_mood" && args.mood) this.handlers.setMood(args.mood);
        else if (name === "make_hand_gesture" && args.gesture) this.handlers.makeHandGesture(args.gesture);
        else if (name === "make_facial_expression" && args.emoji) {
          this.handlers.makeFacialExpression(args.emoji);
        }
        break;
      }
      case "error":
        this.handlers.onError?.("S2S session error — check ORIGIN_S2S_WS_URL / model access.");
        break;
      default:
        break;
    }
  }

  private enqueueAudioDelta(base64: string) {
    const ctx = this.audioCtx;
    const dest = this.remoteDest;
    if (!ctx || !dest) return;
    const samples = pcm16Base64ToFloat32(base64);
    const buffer = ctx.createBuffer(1, samples.length, TARGET_SAMPLE_RATE);
    buffer.copyToChannel(Float32Array.from(samples), 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(dest);
    source.connect(ctx.destination);
    const now = ctx.currentTime;
    if (this.playTime < now) this.playTime = now + 0.05;
    source.start(this.playTime);
    this.playTime += buffer.duration;
  }

  async disconnect(silent = false): Promise<void> {
    if (!silent && this.socket?.readyState === WebSocket.OPEN && !this.closing) {
      this.closing = true;
      this.socket.send(
        JSON.stringify({
          type: "response.create",
          response: {
            modalities: ["audio"],
            instructions: "The user wants to end this session. Say a quick goodbye.",
          },
        }),
      );
      return;
    }

    this.closing = false;
    try {
      this.processor?.disconnect();
    } catch {
      /* ignore */
    }
    this.processor = null;
    try {
      this.micSource?.disconnect();
    } catch {
      /* ignore */
    }
    this.micSource = null;
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        /* ignore */
      }
      this.socket = null;
    }
    if (this.audioCtx) {
      void this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.remoteDest = null;
    this.handlers.onSpeakingChange?.(false);
  }
}
