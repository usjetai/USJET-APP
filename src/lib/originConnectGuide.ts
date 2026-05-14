/**
 * Origin browser connect guide — plain-language copy and popular browser links.
 * No deployment or vendor-backend jargon in member-facing strings.
 */

export const ORIGIN_CONNECT_PROMPT =
  "Would you like me to explain how we can connect this service right now, as easy and as fast as possible?";

export const ORIGIN_CONNECT_ACK =
  "Here is your browser connect guide. Step one: go to your browser settings. Step two: look for the microphone — click the mic icon. Step three: allow usjet.ai — click Allow permission for this site.";

export const ORIGIN_CONNECT_MODAL_TITLE = "Connect through your browser";

export const ORIGIN_CONNECT_MODAL_LEDE =
  "Every browser uses the same three steps — settings, mic icon, then allow usjet.ai. Click Allow permission when your browser asks.";

export const ORIGIN_CONNECT_STEP =
  "Go to browser settings, click the mic icon, then allow usjet.ai — click Allow permission.";

export const ORIGIN_CONNECT_THIS_BROWSER = "Stay on Origin — enable mic";

export const ORIGIN_CONNECT_ALLOW_EMPHASIS =
  "Click Allow permission — do not block or dismiss the prompt.";

export const ORIGIN_ABSOLUTE_URL = "https://www.usjet.ai/origin";

export type OriginBrowserDetailStep = {
  label: string;
  text: string;
};

/** Same three steps for every browser in the connect dropdown. */
export const ORIGIN_CONNECT_UNIFIED_STEPS: OriginBrowserDetailStep[] = [
  { label: "1", text: "Go to your browser settings." },
  { label: "2", text: "Look for Microphone — find the mic icon and click it." },
  {
    label: "3",
    text: "Allow usjet.ai — click Allow permission for this site when your browser asks.",
  },
];

export type OriginBrowserGuideEntry = {
  id: string;
  name: string;
  iconLetter: string;
  brandHue: string;
  downloadUrl: string;
  downloadLabel: string;
  summary: string;
};

const ORIGIN_CONNECT_BROWSER_SUMMARY =
  "Settings → mic icon → allow usjet.ai. Same three steps in every browser.";

export const ORIGIN_BROWSER_GUIDE: OriginBrowserGuideEntry[] = [
  {
    id: "chrome",
    name: "Chrome",
    iconLetter: "C",
    brandHue: "#4285F4",
    downloadUrl: "https://www.google.com/chrome/",
    downloadLabel: "Get Chrome",
    summary: ORIGIN_CONNECT_BROWSER_SUMMARY,
  },
  {
    id: "safari",
    name: "Safari",
    iconLetter: "S",
    brandHue: "#0A84FF",
    downloadUrl: "https://www.apple.com/safari/",
    downloadLabel: "About Safari",
    summary: ORIGIN_CONNECT_BROWSER_SUMMARY,
  },
  {
    id: "firefox",
    name: "Firefox",
    iconLetter: "F",
    brandHue: "#FF7139",
    downloadUrl: "https://www.mozilla.org/firefox/",
    downloadLabel: "Get Firefox",
    summary: ORIGIN_CONNECT_BROWSER_SUMMARY,
  },
  {
    id: "edge",
    name: "Microsoft Edge",
    iconLetter: "E",
    brandHue: "#0078D7",
    downloadUrl: "https://www.microsoft.com/edge",
    downloadLabel: "Get Edge",
    summary: ORIGIN_CONNECT_BROWSER_SUMMARY,
  },
  {
    id: "brave",
    name: "Brave",
    iconLetter: "B",
    brandHue: "#FB542B",
    downloadUrl: "https://brave.com/",
    downloadLabel: "Get Brave",
    summary: ORIGIN_CONNECT_BROWSER_SUMMARY,
  },
  {
    id: "opera",
    name: "Opera",
    iconLetter: "O",
    brandHue: "#FF1B2D",
    downloadUrl: "https://www.opera.com/",
    downloadLabel: "Get Opera",
    summary: ORIGIN_CONNECT_BROWSER_SUMMARY,
  },
  {
    id: "samsung",
    name: "Samsung Internet",
    iconLetter: "Si",
    brandHue: "#1428A0",
    downloadUrl: "https://www.samsung.com/us/support/owners/app/samsung-internet/",
    downloadLabel: "About Samsung Internet",
    summary: ORIGIN_CONNECT_BROWSER_SUMMARY,
  },
];

/** Voice + text intent: yes, explain, how, connect, help */
export function isConnectGuideIntent(text: string): boolean {
  const t = text.toLowerCase();
  return (
    /\b(yes|yeah|yep|sure|please|explain|how|connect|help|tell me)\b/.test(t) ||
    /\bhow (do|can|to|we)\b/.test(t)
  );
}
