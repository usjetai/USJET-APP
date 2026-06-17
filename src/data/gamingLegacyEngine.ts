/** Legacy Engine — Industrial Metaverse gamer portal (Tier-1 visuals). */

/** Upload to `public/gaming/legacy-engine-loop.mp4` — industrial VR Agent loop (~60fps). */
export const LEGACY_ENGINE_VIDEO_SRC = "/gaming/legacy-engine-loop.mp4" as const;

export const LEGACY_ENGINE_HUD_BADGE = "Legacy Engine · Industrial Metaverse" as const;

export const LEGACY_ENGINE_HEADLINE = "Legacy > Leisure. Building the Industrial Metaverse." as const;

export const LEGACY_ENGINE_MANIFESTO_LEDE =
  "GTA built the most realistic world ever made, but they used it for crime. USJET.AI uses that same spatial intelligence to build the future of American industry. We don't play for points — we play for equity. This is where gamers become the architects of the real world." as const;

export const LEGACY_ENGINE_MANIFESTO_BODY =
  "Why spend 1,000 hours in a simulation of a crime city when you can spend 100 hours mastering the AI fleet that builds the real world? We use the same high-fidelity spatial engines as the world's biggest games — for training, for wealth generation, and for the American workforce." as const;

export const LEGACY_ENGINE_ANTI_CRIME =
  "Zero Chaos. Pure Creation. We are building tools that empower, not distract. This is the only 'Game' where the rewards are real-world equity and industrial dominance." as const;

export const GAMER_FOUNDER_ENTRY_KICKER = "Founder's entry key" as const;

export const GAMER_FOUNDER_CTA = "Start founding" as const;

export const GAMER_FOUNDER_KIT_FEATURES_LEGACY = [
  "Early access to the USJET VR Training Hangar",
  "Direct pipeline to 30-agent fleet orchestration",
  "USJET VR-AI development blueprints (Volume I)",
  "Gamer-to-Operator flight manual & transition path",
] as const;

export const GAMING_WEALTH_PIPELINE_TITLE = "Generational wealth pipeline" as const;

export const GAMING_WEALTH_PIPELINE_STAGES = [
  {
    id: "gamer",
    tier: "Stage 1 — The Gamer",
    price: "$99",
    body: "Enter the ecosystem. Learn the flight manual and claim your founder's entry key.",
    href: "#gaming-founder-kit" as const,
    cta: "Start founding",
  },
  {
    id: "operator",
    tier: "Stage 2 — The Operator",
    price: "$2,500",
    body: "Manage real AI fleets for local businesses — professional edition, fleet manual clearance.",
    href: "/fleet-manual" as const,
    cta: "Fleet manual",
  },
  {
    id: "partner",
    tier: "Stage 3 — The Partner",
    price: "$100K",
    body: "Own a piece of the industrial infrastructure — sovereign fleet protocol vault.",
    href: "/100k" as const,
    cta: "100K vault",
  },
] as const;
