/**
 * Origin browser connect guide — plain-language copy and popular browser links.
 * No deployment or vendor-backend jargon in member-facing strings.
 */

export const ORIGIN_CONNECT_PROMPT =
  "Would you like me to explain how we can connect this service right now, as easy and as fast as possible?";

export const ORIGIN_CONNECT_ACK =
  "Here is your browser connect guide. Pick your browser below — allow the microphone when Origin asks, then speak.";

export const ORIGIN_CONNECT_MODAL_TITLE = "Connect through your browser";

export const ORIGIN_CONNECT_MODAL_LEDE =
  "Origin works in any modern browser. Get the browser you prefer, open USJET Origin, allow the mic when asked, then talk.";

export const ORIGIN_CONNECT_STEP = "Allow microphone when Origin asks — then speak.";

export const ORIGIN_CONNECT_THIS_BROWSER = "Open Origin in this browser";

export const ORIGIN_ABSOLUTE_URL = "https://www.usjet.ai/origin";

export type OriginBrowserGuideEntry = {
  id: string;
  name: string;
  iconLetter: string;
  brandHue: string;
  downloadUrl: string;
  downloadLabel: string;
  originLabel: string;
};

export const ORIGIN_BROWSER_GUIDE: OriginBrowserGuideEntry[] = [
  {
    id: "chrome",
    name: "Chrome",
    iconLetter: "C",
    brandHue: "#4285F4",
    downloadUrl: "https://www.google.com/chrome/",
    downloadLabel: "Get Chrome",
    originLabel: "Open USJET in Chrome",
  },
  {
    id: "safari",
    name: "Safari",
    iconLetter: "S",
    brandHue: "#0A84FF",
    downloadUrl: "https://www.apple.com/safari/",
    downloadLabel: "About Safari",
    originLabel: "Open USJET in Safari",
  },
  {
    id: "firefox",
    name: "Firefox",
    iconLetter: "F",
    brandHue: "#FF7139",
    downloadUrl: "https://www.mozilla.org/firefox/",
    downloadLabel: "Get Firefox",
    originLabel: "Open USJET in Firefox",
  },
  {
    id: "edge",
    name: "Microsoft Edge",
    iconLetter: "E",
    brandHue: "#0078D7",
    downloadUrl: "https://www.microsoft.com/edge",
    downloadLabel: "Get Edge",
    originLabel: "Open USJET in Edge",
  },
  {
    id: "brave",
    name: "Brave",
    iconLetter: "B",
    brandHue: "#FB542B",
    downloadUrl: "https://brave.com/",
    downloadLabel: "Get Brave",
    originLabel: "Open USJET in Brave",
  },
  {
    id: "opera",
    name: "Opera",
    iconLetter: "O",
    brandHue: "#FF1B2D",
    downloadUrl: "https://www.opera.com/",
    downloadLabel: "Get Opera",
    originLabel: "Open USJET in Opera",
  },
  {
    id: "samsung",
    name: "Samsung Internet",
    iconLetter: "Si",
    brandHue: "#1428A0",
    downloadUrl: "https://www.samsung.com/us/support/owners/app/samsung-internet/",
    downloadLabel: "About Samsung Internet",
    originLabel: "Open USJET in Samsung Internet",
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
