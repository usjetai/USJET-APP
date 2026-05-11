import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, X, Volume2 } from "lucide-react";
import { OPENROUTER_API_KEY, buildMessages, completeChat } from "@/lib/openrouter";

type State = "idle" | "listening" | "thinking" | "talking";

interface Ripple { id: number; }

const GREET = "USJet Aura online. Cleared for conversation — what's your flight plan?";

export function AuraWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [displayText, setDisplayText] = useState(GREET);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [turns, setTurns] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const rippleCountRef = useRef(0);
  const talkingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Spawn ripple rings while talking
  useEffect(() => {
    if (state === "talking") {
      talkingTimerRef.current = setInterval(() => {
        const id = ++rippleCountRef.current;
        setRipples((r) => [...r, { id }]);
        setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 2400);
      }, 700);
    } else {
      if (talkingTimerRef.current) clearInterval(talkingTimerRef.current);
      setRipples([]);
    }
    return () => { if (talkingTimerRef.current) clearInterval(talkingTimerRef.current); };
  }, [state]);

  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    setState("talking");
    setDisplayText(text);

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 0.88;
    utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) =>
      v.name.toLowerCase().includes("daniel") ||
      v.name.toLowerCase().includes("alex") ||
      v.name.toLowerCase().includes("en-us")
    );
    if (preferred) utter.voice = preferred;

    utter.onend = () => setState("idle");
    utter.onerror = () => setState("idle");
    synthRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, []);

  const handleUserSpeech = useCallback(async (transcript: string) => {
    setState("thinking");
    setDisplayText(`"${transcript}"`);

    const newTurns: { role: "user" | "assistant"; content: string }[] = [
      ...turns,
      { role: "user", content: transcript },
    ];

    try {
      const reply = await completeChat(OPENROUTER_API_KEY, buildMessages(newTurns));
      const updatedTurns = [...newTurns, { role: "assistant" as const, content: reply }];
      setTurns(updatedTurns);
      speak(reply);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Connection lost. Please try again.";
      setState("idle");
      setDisplayText(msg.includes("API key") || msg.includes("401")
        ? "API key required. Set VITE_OPENROUTER_API_KEY to activate."
        : `Error: ${msg}`);
    }
  }, [turns, speak]);

  const startListening = useCallback(() => {
    if (state === "talking") {
      window.speechSynthesis.cancel();
      setState("idle");
      return;
    }

    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setDisplayText("Speech recognition not available in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    setState("listening");
    setDisplayText("Listening...");

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      if (transcript.trim()) handleUserSpeech(transcript.trim());
    };

    recognition.onerror = () => { setState("idle"); setDisplayText(GREET); };
    recognition.onend = () => { if (state === "listening") setState("idle"); };

    recognition.start();
  }, [state, handleUserSpeech]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState("idle");
    setDisplayText(GREET);
  }, []);

  const blobClass = [
    "aura-blob",
    state === "listening" ? "aura-blob--listening" : "",
    state === "talking" ? "aura-blob--talking" : "",
  ].filter(Boolean).join(" ");

  if (!open) {
    return (
      <button
        data-testid="button-aura-open"
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full aura-trigger flex items-center justify-center group"
        title="Talk to Aura"
      >
        <Mic size={22} className="text-white group-hover:scale-110 transition-transform" />
        <span className="absolute inset-0 rounded-full aura-trigger-pulse" />
      </button>
    );
  }

  return (
    <div
      data-testid="widget-aura"
      className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-4"
    >
      {/* Blob */}
      <div className="aura-float-wrap" style={{ width: 220, height: 220 }}>
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {ripples.map((r) => (
            <div
              key={r.id}
              className="aura-ripple"
              style={{
                "--ripple-opacity": "0.45",
                "--ripple-duration": "2200ms",
                "--ripple-scale": "2.6",
              } as React.CSSProperties}
            />
          ))}

          <div className={blobClass}>
            <div className="aura-blob__wave" />
            <div className="aura-blob__rim" />
            <div className="aura-blob__highlight" />

            <div className="aura-blob__text">
              {state === "thinking" ? (
                <span className="aura-thinking">Processing flight plan<span className="aura-dots" /></span>
              ) : (
                displayText
              )}
            </div>

            {/* State indicator */}
            <div className="aura-status">
              {state === "listening" && <Volume2 size={14} className="text-teal-300 animate-pulse" />}
              {state === "talking" && <Volume2 size={14} className="text-sky-300 animate-pulse" />}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          data-testid="button-aura-mic"
          onClick={state === "listening" ? stopListening : startListening}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
            state === "listening"
              ? "bg-teal-400/20 border-teal-400/60 text-teal-300 shadow-[0_0_20px_rgba(45,212,191,0.4)]"
              : state === "talking"
              ? "bg-sky-400/20 border-sky-400/60 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
          }`}
        >
          {state === "listening" ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <button
          data-testid="button-aura-close"
          onClick={() => {
            window.speechSynthesis.cancel();
            recognitionRef.current?.stop();
            setOpen(false);
            setState("idle");
            setTurns([]);
            setDisplayText(GREET);
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <p className="text-xs text-muted-foreground tracking-wider">
        {state === "idle" && "Tap mic to speak"}
        {state === "listening" && "Listening — tap to stop"}
        {state === "thinking" && "Computing flight plan..."}
        {state === "talking" && "Tap mic to interrupt"}
      </p>
    </div>
  );
}
