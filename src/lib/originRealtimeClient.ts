/**
 * Origin Realtime S2S client — OpenAI Realtime WebRTC (HeadAudio openai.html pattern).
 * Mic → peer connection; remote audio → TalkingHead analyzer; tools via data channel.
 */

import {
  buildOriginRealtimeInstructions,
  ORIGIN_REALTIME_MODEL,
  ORIGIN_REALTIME_TOOLS,
  ORIGIN_REALTIME_VOICE,
  type OriginRealtimeSessionConfig,
} from "./originRealtimeTools";

export type OriginRealtimeStatus = {
  available: boolean;
  provider: "openai-realtime" | "custom-s2s" | "none";
  model: string;
  transport: "webrtc" | "websocket" | "none";
  customWsConfigured?: boolean;
  wsUrl?: string | null;
};

export type OriginRealtimeToolHandlers = {
  setMood: (mood: string) => void;
  makeHandGesture: (gesture: string) => void;
  makeFacialExpression: (emoji: string) => void;
  onSpeechStarted?: () => void;
  onSpeakingChange?: (speaking: boolean) => void;
  onRemoteAudioStream?: (stream: MediaStream) => void;
  onError?: (message: string) => void;
};

export async function fetchOriginRealtimeStatus(): Promise<OriginRealtimeStatus> {
  try {
    const response = await fetch("/api/origin-realtime-session", { method: "GET" });
    if (!response.ok) {
      return { available: false, provider: "none", model: ORIGIN_REALTIME_MODEL, transport: "none" };
    }
    return (await response.json()) as OriginRealtimeStatus;
  } catch {
    return { available: false, provider: "none", model: ORIGIN_REALTIME_MODEL, transport: "none" };
  }
}

export class OriginRealtimeClient {
  private connection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private micTrack: MediaStreamTrack | null = null;
  private mutedAudio: HTMLAudioElement | null = null;
  private closing = false;
  private handlers: OriginRealtimeToolHandlers;

  constructor(handlers: OriginRealtimeToolHandlers) {
    this.handlers = handlers;
  }

  get connected(): boolean {
    return this.connection?.connectionState === "connected";
  }

  setMicEnabled(enabled: boolean) {
    if (this.micTrack) this.micTrack.enabled = enabled;
  }

  async connect(options?: { instructionsExtra?: string }): Promise<void> {
    await this.disconnect(true);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });
    } catch {
      throw new Error("Microphone permission denied — allow mic for Origin Realtime.");
    }

    const [micTrack] = stream.getAudioTracks();
    if (!micTrack) {
      throw new Error("No microphone track available.");
    }
    this.micTrack = micTrack;

    const connection = new RTCPeerConnection();
    this.connection = connection;

    connection.ontrack = (event) => {
      if (event.track.kind !== "audio") return;
      const remoteStream = event.streams[0] ?? new MediaStream([event.track]);
      // Chrome quirk: touch the stream with a muted element before Web Audio.
      this.mutedAudio = new Audio();
      this.mutedAudio.muted = true;
      this.mutedAudio.srcObject = remoteStream;
      void this.mutedAudio.play().catch(() => {});
      this.handlers.onRemoteAudioStream?.(remoteStream);
    };

    connection.addTrack(micTrack, stream);

    const dataChannel = connection.createDataChannel("oai");
    this.dataChannel = dataChannel;
    dataChannel.addEventListener("open", () => {
      this.sendSystemPrompt("Introduce yourself briefly as Origin and ask how you can help.");
    });
    dataChannel.addEventListener("message", (event) => this.handleMessage(event));

    await connection.setLocalDescription();

    const session: OriginRealtimeSessionConfig = {
      type: "realtime",
      model: ORIGIN_REALTIME_MODEL,
      instructions: buildOriginRealtimeInstructions(options?.instructionsExtra),
      audio: { output: { voice: ORIGIN_REALTIME_VOICE } },
      tools: ORIGIN_REALTIME_TOOLS,
    };

    const response = await fetch("/api/origin-realtime-call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sdp: connection.localDescription?.sdp ?? "",
        session: JSON.stringify(session),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      await this.disconnect(true);
      throw new Error(detail.slice(0, 280) || "Failed to start Origin Realtime call.");
    }

    const answerSdp = await response.text();
    await connection.setRemoteDescription({ type: "answer", sdp: answerSdp });

    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        connection.removeEventListener("connectionstatechange", onState);
        reject(new Error(`Realtime connection timeout (${connection.connectionState}).`));
      }, 12_000);

      const onState = () => {
        if (connection.connectionState === "connected") {
          window.clearTimeout(timeout);
          connection.removeEventListener("connectionstatechange", onState);
          resolve();
        } else if (connection.connectionState === "failed") {
          window.clearTimeout(timeout);
          connection.removeEventListener("connectionstatechange", onState);
          reject(new Error("Realtime peer connection failed."));
        }
      };
      connection.addEventListener("connectionstatechange", onState);
      onState();
    });
  }

  private sendSystemPrompt(text: string) {
    if (!this.dataChannel || this.dataChannel.readyState !== "open") return;
    this.dataChannel.send(
      JSON.stringify({
        type: "response.create",
        response: {
          input: [
            {
              type: "message",
              role: "system",
              content: [{ type: "input_text", text }],
            },
          ],
          output_modalities: ["audio"],
        },
      }),
    );
  }

  private handleMessage(event: MessageEvent) {
    let message: { type?: string; name?: string; arguments?: string };
    try {
      message = JSON.parse(String(event.data)) as typeof message;
    } catch {
      return;
    }

    const type = message.type ?? "";
    switch (type) {
      case "input_audio_buffer.speech_started":
        this.handlers.onSpeechStarted?.();
        break;
      case "output_audio_buffer.started":
        this.handlers.onSpeakingChange?.(true);
        break;
      case "output_audio_buffer.stopped":
        this.handlers.onSpeakingChange?.(false);
        if (this.closing) {
          void this.disconnect(true);
        }
        break;
      case "response.function_call_arguments.done": {
        const name = message.name;
        let args: Record<string, string> = {};
        try {
          args = message.arguments ? (JSON.parse(message.arguments) as Record<string, string>) : {};
        } catch {
          args = {};
        }
        if (name === "set_mood" && args.mood) {
          this.handlers.setMood(args.mood);
        } else if (name === "make_hand_gesture" && args.gesture) {
          this.handlers.makeHandGesture(args.gesture);
        } else if (name === "make_facial_expression" && args.emoji) {
          this.handlers.makeFacialExpression(args.emoji);
        }
        break;
      }
      case "error":
        this.handlers.onError?.("Realtime session error — check OPENAI_API_KEY and model access.");
        break;
      default:
        break;
    }
  }

  async disconnect(silent = false): Promise<void> {
    if (!silent && this.dataChannel?.readyState === "open" && !this.closing) {
      this.closing = true;
      this.sendSystemPrompt("The user wants to end this session. Say a quick goodbye.");
      return;
    }

    this.closing = false;

    if (this.dataChannel) {
      try {
        this.dataChannel.close();
      } catch {
        /* ignore */
      }
      this.dataChannel = null;
    }

    if (this.connection) {
      try {
        this.connection.getSenders().forEach((sender) => {
          try {
            this.connection?.removeTrack(sender);
          } catch {
            /* ignore */
          }
        });
        this.connection.close();
      } catch {
        /* ignore */
      }
      this.connection = null;
    }

    if (this.micTrack) {
      try {
        this.micTrack.stop();
      } catch {
        /* ignore */
      }
      this.micTrack = null;
    }

    if (this.mutedAudio) {
      try {
        this.mutedAudio.srcObject = null;
      } catch {
        /* ignore */
      }
      this.mutedAudio = null;
    }

    this.handlers.onSpeakingChange?.(false);
  }
}
