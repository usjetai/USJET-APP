import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { BookOpen, Code2, Terminal } from "lucide-react";

const STOCK_CODE = "AI-CODE:INTEL-STOCK";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useRouteSignal() {
  const location = useLocation();
  const path = location.pathname;
  return useMemo(() => {
    let seed = 0;
    for (let i = 0; i < path.length; i++) seed = (seed + path.charCodeAt(i) * (i + 1)) % 9973;
    return seed;
  }, [path]);
}

/**
 * Intel “stock AI code” overlay.
 * - Deterministic UI-only label + quick actions.
 * - Does not call any AI endpoint.
 */
export default function IntelStockAICode() {
  const seed = useRouteSignal();
  const codeVariant = useMemo(() => {
    const num = (seed % 97) + 1;
    return `AI-CODE:INTEL-STOCK-${String(num).padStart(2, "0")}`;
  }, [seed]);

  return (
    <section className="intel-stock-ai-code" aria-label="Intel stock AI code">
      <div className="intel-stock-ai-code__glass glass-effect glass-effect--rounded-rect liquid-glass-background glass-tint-cyan">
        <div className="intel-stock-ai-code__row">
          <span className="intel-stock-ai-code__pill">
            <Terminal size={14} aria-hidden />
            <span>Stock AI code</span>
          </span>

          <span className="intel-stock-ai-code__meta" aria-hidden>
            {codeVariant}
          </span>
        </div>

        <div className="intel-stock-ai-code__actions">
          <a
            className="intel-stock-ai-code__btn btn-glass glass-effect-interactive"
            href={`/ai-101#${encodeURIComponent(STOCK_CODE)}`}
            title="Jump to AI 101 glossary"
          >
            <BookOpen size={14} aria-hidden />
            AI 101
          </a>

          <button
            type="button"
            className="intel-stock-ai-code__btn btn-glass glass-effect-interactive"
            onClick={() => {
              void navigator.clipboard?.writeText(codeVariant);
            }}
            title="Copy stock AI code"
          >
            <Code2 size={14} aria-hidden />
            Copy
          </button>
        </div>

        <p className="intel-stock-ai-code__note">
          Deterministic badge for this Intel view — UI-only. For live AI tools use the AI 101 entry deck.
        </p>
      </div>

      {/* small hidden number to keep layout stable across SSR/CSR differences */}
      <span className="sr-only">{clamp(seed, 0, 9973)}</span>
    </section>
  );
}

