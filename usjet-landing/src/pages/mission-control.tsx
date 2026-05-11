import { useState, useRef, useCallback, useEffect } from "react";
import {
  Lock, Zap, Plus, X, ExternalLink, ChevronDown,
  LayoutGrid, Globe, Star, Shield, RefreshCw
} from "lucide-react";
import { Link } from "wouter";
import { ToolLogo } from "@/components/ToolLogo";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WinState {
  id: string;
  title: string;
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minimized: boolean;
  z: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AI_PRESETS = [
  { name: "ChatGPT",     url: "https://chat.openai.com",       slug: "chatgpt" },
  { name: "Claude",      url: "https://claude.ai",             slug: "claude" },
  { name: "Gemini",      url: "https://gemini.google.com",     slug: "gemini" },
  { name: "Perplexity",  url: "https://perplexity.ai",         slug: "perplexity" },
  { name: "HuggingChat", url: "https://huggingface.co/chat",   slug: "hugging-face" },
  { name: "Grok",        url: "https://grok.x.ai",            slug: "grok" },
  { name: "Mistral",     url: "https://chat.mistral.ai",       slug: "mistral" },
  { name: "Copilot",     url: "https://copilot.microsoft.com", slug: "copilot" },
  { name: "ElevenLabs",  url: "https://elevenlabs.io",         slug: "elevenlabs" },
  { name: "Replit",      url: "https://replit.com",            slug: "replit" },
  { name: "Custom URL",  url: "",                              slug: null },
];

const FEATURES = [
  "Multi-window AI workspace",
  "Drag & resize any AI tool",
  "Run 6 AI chats simultaneously",
  "Side-by-side response comparison",
  "Save custom window layouts",
  "30+ pre-configured AI integrations",
  "Priority access to new features",
];

// ─── Hook: Window Manager ─────────────────────────────────────────────────────

function useWindowManager() {
  const [wins, setWins] = useState<WinState[]>([]);
  const topZ = useRef(10);

  const addWindow = useCallback((url: string, title: string) => {
    const id = `w-${Date.now()}`;
    topZ.current += 1;
    const offset = wins.length * 28;
    setWins((prev) => [
      ...prev,
      { id, title, url, x: 60 + offset, y: 20 + offset, w: 520, h: 400, minimized: false, z: topZ.current },
    ]);
    return id;
  }, [wins.length]);

  const closeWindow = useCallback((id: string) => {
    setWins((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWins((prev) => prev.map((w) => w.id === id ? { ...w, minimized: !w.minimized } : w));
  }, []);

  const focusWindow = useCallback((id: string) => {
    topZ.current += 1;
    const z = topZ.current;
    setWins((prev) => prev.map((w) => w.id === id ? { ...w, z } : w));
  }, []);

  const updateWindow = useCallback((id: string, updates: Partial<WinState>) => {
    setWins((prev) => prev.map((w) => w.id === id ? { ...w, ...updates } : w));
  }, []);

  return { wins, addWindow, closeWindow, minimizeWindow, focusWindow, updateWindow };
}

// ─── Paywall Overlay ──────────────────────────────────────────────────────────

function PaywallOverlay({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6" style={{ top: 68 }}>
      {/* Blurred fake workspace behind */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: "5%",  top: "8%",  w: 420, h: 300 },
          { left: "38%", top: "15%", w: 460, h: 340 },
          { left: "68%", top: "5%",  w: 380, h: 280 },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute rounded-xl border border-white/10 bg-white/3 backdrop-blur-sm"
            style={{ left: pos.left, top: pos.top, width: pos.w, height: pos.h, filter: "blur(3px)", opacity: 0.5 }}
          >
            <div className="h-9 flex items-center px-3 gap-2 border-b border-white/8">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              <div className="h-4 flex-1 rounded-full bg-white/8 mx-2" />
            </div>
            <div className="p-4 space-y-2">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-2.5 rounded-full bg-white/6" style={{ width: `${50 + (j * 17 % 40)}%` }} />
              ))}
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70" />
      </div>

      {/* Paywall card */}
      <div className="relative z-10 max-w-md w-full mc-paywall-card">
        {/* Lock icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,212,255,0.2)]">
            <Lock size={28} className="text-primary" />
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Star size={10} fill="currentColor" /> Premium Tier
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Mission Control</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your multi-window AI command center. Run every AI simultaneously, compare responses, and dominate your workflow.
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
              <div className="w-4 h-4 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Zap size={9} className="text-primary" fill="currentColor" />
              </div>
              {f}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="text-center mb-5">
          <span className="text-4xl font-heading font-bold text-white">$19</span>
          <span className="text-muted-foreground text-sm"> / month</span>
          <p className="text-xs text-muted-foreground mt-1">Cancel anytime · Instant access</p>
        </div>

        {/* CTA buttons */}
        {/* NOTE: Replace the demo onClick below with a real Stripe Checkout redirect:
            window.location.href = await fetch('/api/create-checkout-session', { method: 'POST' }).then(r => r.json()).then(d => d.url)
            Then on the success page, set localStorage.setItem('usjet_mc_unlocked', 'true') after verifying via /api/verify-payment */}
        <button
          onClick={onUnlock}
          data-testid="paywall-unlock-btn"
          className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_28px_rgba(0,212,255,0.5)] transition-all duration-300 mb-3"
        >
          Unlock Mission Control
        </button>
        <button
          onClick={onUnlock}
          data-testid="paywall-demo-btn"
          className="w-full py-2.5 rounded-full bg-white/5 border border-white/12 text-muted-foreground text-sm hover:text-white hover:bg-white/8 transition-all duration-300"
        >
          Try Demo Mode (free)
        </button>

        <p className="text-center text-[11px] text-white/25 mt-4">
          Demo mode stores unlock locally. Real payments via Stripe.
        </p>
      </div>
    </div>
  );
}

// ─── Add Window Modal ─────────────────────────────────────────────────────────

function AddWindowModal({ onAdd, onClose }: { onAdd: (url: string, title: string) => void; onClose: () => void }) {
  const [selected, setSelected] = useState(AI_PRESETS[0]);
  const [customUrl, setCustomUrl] = useState("");

  const handleAdd = () => {
    const url = selected.name === "Custom URL" ? customUrl.trim() : selected.url;
    if (!url) return;
    const finalUrl = url.startsWith("http") ? url : `https://${url}`;
    onAdd(finalUrl, selected.name === "Custom URL" ? finalUrl : selected.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-sm mc-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-heading font-bold text-white">Add AI Window</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">Choose a preset or enter any URL</p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {AI_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setSelected(preset)}
              data-testid={`preset-${preset.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200 ${
                selected.name === preset.name
                  ? "bg-primary/12 border-primary/35 shadow-[0_0_12px_rgba(0,212,255,0.15)]"
                  : "bg-white/3 border-white/8 hover:border-white/18 hover:bg-white/6"
              }`}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/5">
                {preset.slug
                  ? <ToolLogo slug={preset.slug} name={preset.name} size={26} />
                  : <span className="text-base">🔗</span>
                }
              </div>
              <span className="text-[10px] font-medium text-white/80 leading-tight">{preset.name}</span>
            </button>
          ))}
        </div>

        {selected.name === "Custom URL" && (
          <input
            type="url"
            placeholder="https://example.com"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="w-full bg-white/5 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground mb-4 outline-none focus:border-primary/40 focus:bg-primary/5 transition-all"
            autoFocus
          />
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
          <Shield size={11} className="text-amber-400 flex-shrink-0" />
          <span>Some AI sites block embedding. Use "Open in New Tab" if the window appears blank.</span>
        </div>

        <button
          onClick={handleAdd}
          data-testid="add-window-confirm"
          className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:shadow-[0_0_18px_rgba(0,212,255,0.3)] transition-all duration-300"
        >
          Add Window
        </button>
      </div>
    </div>
  );
}

// ─── Workspace Window ─────────────────────────────────────────────────────────

function WorkspaceWindow({
  win,
  onClose,
  onMinimize,
  onFocus,
  onDragStart,
  onResizeStart,
}: {
  win: WinState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onDragStart: (id: string, e: React.PointerEvent) => void;
  onResizeStart: (id: string, e: React.PointerEvent) => void;
}) {
  const [url, setUrl] = useState(win.url);
  const [liveUrl, setLiveUrl] = useState(win.url);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const reload = () => setLiveUrl(`${liveUrl}?_t=${Date.now()}`);
  const navigate = () => {
    const finalUrl = url.startsWith("http") ? url : `https://${url}`;
    setLiveUrl(finalUrl);
  };

  const hostname = (() => {
    try { return new URL(liveUrl).hostname; } catch { return liveUrl; }
  })();

  return (
    <div
      data-testid={`window-${win.id}`}
      className="mc-window absolute select-none"
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.minimized ? 44 : win.h,
        zIndex: win.z,
      }}
      onPointerDown={() => onFocus(win.id)}
    >
      {/* Title bar / drag handle */}
      <div
        className="mc-window-header flex items-center gap-2 px-3 h-11 cursor-grab active:cursor-grabbing select-none"
        onPointerDown={(e) => {
          e.preventDefault();
          onFocus(win.id);
          onDragStart(win.id, e);
        }}
      >
        {/* Traffic lights */}
        <button
          data-testid={`close-${win.id}`}
          onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
          className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors flex-shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
        />
        <button
          data-testid={`minimize-${win.id}`}
          onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }}
          className="w-3 h-3 rounded-full bg-yellow-400/70 hover:bg-yellow-400 transition-colors flex-shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
        />
        <div className="w-3 h-3 rounded-full bg-green-500/40 flex-shrink-0" />

        {/* URL bar */}
        {!win.minimized && (
          <div
            className="flex-1 mx-2 flex items-center gap-1.5 bg-black/30 border border-white/8 rounded-lg px-2.5 h-7"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Globe size={10} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && navigate()}
              className="flex-1 bg-transparent text-[11px] text-white/70 placeholder:text-muted-foreground outline-none min-w-0 font-mono"
              placeholder="https://..."
            />
          </div>
        )}

        {win.minimized && (
          <span className="flex-1 text-xs text-white/60 truncate ml-1">{hostname}</span>
        )}

        {/* Controls */}
        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={reload} className="text-muted-foreground hover:text-white transition-colors p-0.5" title="Reload">
            <RefreshCw size={11} />
          </button>
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-0.5" title="Open in new tab">
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Content */}
      {!win.minimized && (
        <div className="relative mc-window-body" style={{ height: win.h - 44 }}>
          <iframe
            ref={iframeRef}
            src={liveUrl}
            className="absolute inset-0 w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            title={win.title}
          />
          {/* Fallback hint — always visible until dismissed */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-1.5 bg-black/70 border-t border-white/6 text-[10px] text-white/40 pointer-events-none">
            <Shield size={9} />
            <span>If blank, the site blocks iframes —</span>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/70 underline pointer-events-auto hover:text-primary"
            >
              open in new tab
            </a>
          </div>
        </div>
      )}

      {/* Resize handle */}
      {!win.minimized && (
        <div
          className="mc-resize-handle absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFocus(win.id);
            onResizeStart(win.id, e);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" className="absolute bottom-1.5 right-1.5 opacity-30">
            <path d="M10 2L2 10M10 6L6 10M10 10L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Workspace ────────────────────────────────────────────────────────────────

function Workspace({ onLock }: { onLock: () => void }) {
  const { wins, addWindow, closeWindow, minimizeWindow, focusWindow, updateWindow } = useWindowManager();
  const [showAdd, setShowAdd] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const interactState = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  const handleDragStart = useCallback((id: string, e: React.PointerEvent) => {
    const win = wins.find((w) => w.id === id);
    if (!win) return;
    isDragging.current = true;
    interactState.current = { id, startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y, origW: win.w, origH: win.h };
    if (workspaceRef.current) workspaceRef.current.classList.add("mc-dragging");
  }, [wins]);

  const handleResizeStart = useCallback((id: string, e: React.PointerEvent) => {
    const win = wins.find((w) => w.id === id);
    if (!win) return;
    isResizing.current = true;
    interactState.current = { id, startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y, origW: win.w, origH: win.h };
    if (workspaceRef.current) workspaceRef.current.classList.add("mc-dragging");
  }, [wins]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!interactState.current) return;
    const { id, startX, startY, origX, origY, origW, origH } = interactState.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (isDragging.current) {
      updateWindow(id, {
        x: Math.max(0, origX + dx),
        y: Math.max(0, origY + dy),
      });
    } else if (isResizing.current) {
      updateWindow(id, {
        w: Math.max(320, origW + dx),
        h: Math.max(200, origH + dy),
      });
    }
  }, [updateWindow]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    isResizing.current = false;
    interactState.current = null;
    if (workspaceRef.current) workspaceRef.current.classList.remove("mc-dragging");
  }, []);

  // Open add modal immediately if no windows yet
  useEffect(() => {
    if (wins.length === 0) setShowAdd(true);
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ height: "calc(100vh - 68px)" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 bg-black/20 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <LayoutGrid size={14} className="text-primary" />
          <span className="text-sm font-heading font-semibold text-white">Mission Control</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-semibold uppercase tracking-widest">Premium</span>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-2 flex-1">
          {/* Preset quick-add */}
          <div className="relative">
            <button
              onClick={() => setShowPresets((s) => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/12 text-muted-foreground hover:text-white hover:border-white/20 transition-all duration-200"
            >
              Quick Add
              <ChevronDown size={11} />
            </button>
            {showPresets && (
              <div className="absolute top-full mt-2 left-0 z-50 mc-modal-card p-2 w-40" onClick={() => setShowPresets(false)}>
                {AI_PRESETS.filter((p) => p.name !== "Custom URL").map((p) => (
                  <button
                    key={p.name}
                    onClick={() => addWindow(p.url, p.name)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/6 transition-colors"
                  >
                    <span>{p.emoji}</span>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAdd(true)}
            data-testid="add-window-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 border border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-[0_0_14px_rgba(0,212,255,0.3)] transition-all duration-200"
          >
            <Plus size={13} />
            Add Window
          </button>

          {wins.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {wins.filter(w => !w.minimized).length} active · {wins.length} total
            </span>
          )}
        </div>

        {/* Lock */}
        <button
          onClick={onLock}
          data-testid="lock-workspace-btn"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
        >
          <Lock size={12} />
          Lock
        </button>
      </div>

      {/* Workspace canvas */}
      <div
        ref={workspaceRef}
        className="relative flex-1 overflow-hidden mc-workspace-canvas"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, rgba(0,212,255,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {wins.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center">
              <LayoutGrid size={24} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium mb-1">Workspace is empty</p>
              <p className="text-white/25 text-xs">Click "Add Window" to launch an AI tool</p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              <Plus size={14} />
              Add First Window
            </button>
          </div>
        )}

        {wins.map((win) => (
          <WorkspaceWindow
            key={win.id}
            win={win}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            onDragStart={handleDragStart}
            onResizeStart={handleResizeStart}
          />
        ))}
      </div>

      {showAdd && <AddWindowModal onAdd={addWindow} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

export default function MissionControl() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return localStorage.getItem("usjet_mc_unlocked") === "true"; } catch { return false; }
  });

  const unlock = () => {
    try { localStorage.setItem("usjet_mc_unlocked", "true"); } catch {}
    setUnlocked(true);
  };

  const lock = () => {
    try { localStorage.removeItem("usjet_mc_unlocked"); } catch {}
    setUnlocked(false);
  };

  return (
    <>
      {!unlocked && <PaywallOverlay onUnlock={unlock} />}
      {unlocked && <Workspace onLock={lock} />}
    </>
  );
}
