/**
 * Jet Browser Quick Missions — Product Hunt AI apps that auto-embed in iframes.
 * Sourced from Product Hunt AI Chatbots / Coding Agents / Generative Media categories
 * (Jul 2026), filtered to hosts in HANGAR_IFRAME_AUTO_EMBED_HOSTS only.
 * Blocked X-Frame titans (ChatGPT, Claude, Cursor, Midjourney, etc.) are excluded.
 */

import { isJetBrowserIframeAutoEmbed } from "../lib/hangarEmbedPolicy";

export type JetBrowserQuickMissionApp = {
  id: string;
  name: string;
  /** Live product URL — must pass isJetBrowserIframeAutoEmbed. */
  href: string;
  /** Product Hunt product / category trail for operators. */
  productHunt: string;
};

export type JetBrowserQuickMission = {
  id: string;
  label: string;
  blurb: string;
  apps: readonly JetBrowserQuickMissionApp[];
};

const RAW_MISSIONS: readonly JetBrowserQuickMission[] = [
  {
    id: "chat",
    label: "Chat",
    blurb: "PH AI chat stacks that load in-frame — no X-Frame blockers.",
    apps: [
      {
        id: "kimi",
        name: "Kimi",
        href: "https://www.kimi.com",
        productHunt: "producthunt.com · AI chatbots",
      },
      {
        id: "surfsense",
        name: "SurfSense",
        href: "https://www.surfsense.com/free/gpt-5.4-mini-no-login",
        productHunt: "producthunt.com · AI chat",
      },
      {
        id: "notrack",
        name: "NoTrack",
        href: "https://notrack.ai/",
        productHunt: "producthunt.com · private AI",
      },
      {
        id: "nano-gpt",
        name: "NanoGPT",
        href: "https://nano-gpt.com",
        productHunt: "producthunt.com · AI chatbots",
      },
      {
        id: "easemate",
        name: "EaseMate",
        href: "https://www.easemate.ai/webapp/chat",
        productHunt: "producthunt.com · AI assistants",
      },
      {
        id: "freeassist",
        name: "FreeAssist",
        href: "https://freeassist.ai/",
        productHunt: "producthunt.com · AI assistants",
      },
    ],
  },
  {
    id: "build",
    label: "Build",
    blurb: "PH coding / vibe-build agents verified for iframe auto-embed.",
    apps: [
      {
        id: "lovable",
        name: "Lovable",
        href: "https://lovable.dev",
        productHunt: "producthunt.com/categories/ai-coding-agents",
      },
      {
        id: "replit",
        name: "Replit",
        href: "https://replit.com",
        productHunt: "producthunt.com/categories/ai-coding-agents",
      },
      {
        id: "dify",
        name: "Dify",
        href: "https://dify.ai",
        productHunt: "producthunt.com · AI agent builders",
      },
      {
        id: "anima",
        name: "Anima",
        href: "https://www.animaapp.com",
        productHunt: "producthunt.com · design-to-code",
      },
      {
        id: "stackai",
        name: "Stack AI",
        href: "https://www.stack.ai",
        productHunt: "producthunt.com · AI workflows",
      },
    ],
  },
  {
    id: "create",
    label: "Create",
    blurb: "PH generative media that still allows hangar framing.",
    apps: [
      {
        id: "runway",
        name: "Runway",
        href: "https://runway.com",
        productHunt: "producthunt.com/categories/ai-generative-media",
      },
      {
        id: "heygen",
        name: "HeyGen",
        href: "https://heygen.com",
        productHunt: "producthunt.com · AI video",
      },
      {
        id: "gamma",
        name: "Gamma",
        href: "https://gamma.app",
        productHunt: "producthunt.com · AI presentations",
      },
      {
        id: "vidguru",
        name: "VidGuru",
        href: "https://www.vidguru.ai/ai-talking-photo",
        productHunt: "producthunt.com · AI video",
      },
      {
        id: "flux-hf",
        name: "Flux Schnell",
        href: "https://black-forest-labs-flux-1-schnell.hf.space",
        productHunt: "producthunt.com · generative media · HF Space",
      },
      {
        id: "sd-hf",
        name: "SD 3.5",
        href: "https://stabilityai-stable-diffusion-3-5-large-turbo.hf.space",
        productHunt: "producthunt.com · Stable Diffusion · HF Space",
      },
    ],
  },
  {
    id: "ops",
    label: "Ops",
    blurb: "PH productivity / agent ops tools that embed clean.",
    apps: [
      {
        id: "otter",
        name: "Otter",
        href: "https://otter.ai",
        productHunt: "producthunt.com · AI meeting notes",
      },
      {
        id: "quillbot",
        name: "QuillBot",
        href: "https://quillbot.com",
        productHunt: "producthunt.com · writing AI",
      },
      {
        id: "notegpt",
        name: "NoteGPT",
        href: "https://notegpt.io",
        productHunt: "producthunt.com · AI notes",
      },
      {
        id: "voiceflow",
        name: "Voiceflow",
        href: "https://www.voiceflow.com",
        productHunt: "producthunt.com · AI agents",
      },
      {
        id: "mindstudio",
        name: "MindStudio",
        href: "https://www.mindstudio.ai",
        productHunt: "producthunt.com · AI builders",
      },
      {
        id: "lindy",
        name: "Lindy",
        href: "https://www.lindy.ai",
        productHunt: "producthunt.com · AI agents",
      },
    ],
  },
] as const;

function assertIframeSafe(apps: readonly JetBrowserQuickMissionApp[]): JetBrowserQuickMissionApp[] {
  return apps.filter((app) => isJetBrowserIframeAutoEmbed(app.href));
}

/** Missions with only iframe-auto-embed apps (X-Frame safe). */
export const JET_BROWSER_QUICK_MISSIONS: readonly JetBrowserQuickMission[] = RAW_MISSIONS.map(
  (mission) => ({
    ...mission,
    apps: assertIframeSafe(mission.apps),
  }),
).filter((mission) => mission.apps.length > 0);

export function getQuickMissionById(id: string): JetBrowserQuickMission | undefined {
  return JET_BROWSER_QUICK_MISSIONS.find((mission) => mission.id === id);
}
