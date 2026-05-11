import { useState } from "react";

export const LOGO_DOMAINS: Record<string, string> = {
  "chatgpt":          "openai.com",
  "claude":           "anthropic.com",
  "gemini":           "google.com",
  "copilot":          "microsoft.com",
  "perplexity":       "perplexity.ai",
  "grok":             "x.ai",
  "midjourney":       "midjourney.com",
  "dalle3":           "openai.com",
  "runway":           "runwayml.com",
  "elevenlabs":       "elevenlabs.io",
  "sora":             "openai.com",
  "stable-diffusion": "stability.ai",
  "github-copilot":   "github.com",
  "cursor":           "cursor.com",
  "replit":           "replit.com",
  "whisper":          "openai.com",
  "otter":            "otter.ai",
  "notion-ai":        "notion.so",
  "pika":             "pika.art",
  "heygen":           "heygen.com",
  "synthesia":        "synthesia.io",
  "deepgram":         "deepgram.com",
  "assemblyai":       "assemblyai.com",
  "cohere":           "cohere.com",
  "mistral":          "mistral.ai",
  "hugging-face":     "huggingface.co",
  "descript":         "descript.com",
  "luma":             "lumalabs.ai",
  "adobe-firefly":    "adobe.com",
  "palantir":         "palantir.com",
};

interface ToolLogoProps {
  slug: string;
  name: string;
  size?: number;
  className?: string;
}

export function ToolLogo({ slug, name, size = 32, className = "" }: ToolLogoProps) {
  const [failed, setFailed] = useState(false);
  const domain = LOGO_DOMAINS[slug];
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const px = Math.max(64, size * 2);

  if (!domain || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-white/8 border border-white/10 text-white font-bold select-none ${className}`}
        style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}?size=${px}`}
      alt={`${name} logo`}
      width={size}
      height={size}
      className={`rounded-lg object-contain ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
