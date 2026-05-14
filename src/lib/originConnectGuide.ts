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

export const ORIGIN_CONNECT_THIS_BROWSER = "Stay on Origin — enable mic";

export const ORIGIN_ABSOLUTE_URL = "https://www.usjet.ai/origin";

export const SAFARI_MIC_SUPPORT_URL =
  "https://support.apple.com/guide/safari/websites-ibrwe2159f50/mac";

export const SAFARI_MAC_MIC_PRIVACY_URL =
  "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone";

export type OriginBrowserDetailStep = {
  label: string;
  text: string;
};

export type OriginBrowserGuideEntry = {
  id: string;
  name: string;
  iconLetter: string;
  brandHue: string;
  downloadUrl: string;
  downloadLabel: string;
  summary: string;
  steps: OriginBrowserDetailStep[];
  /** Rich platform split — Safari only */
  macSteps?: OriginBrowserDetailStep[];
  iosSteps?: OriginBrowserDetailStep[];
  supportUrl?: string;
  supportLabel?: string;
  macPrivacyUrl?: string;
  macPrivacyLabel?: string;
  macPrivacyFallback?: string;
};

export const ORIGIN_BROWSER_GUIDE: OriginBrowserGuideEntry[] = [
  {
    id: "chrome",
    name: "Chrome",
    iconLetter: "C",
    brandHue: "#4285F4",
    downloadUrl: "https://www.google.com/chrome/",
    downloadLabel: "Get Chrome",
    summary: "Chrome is the fastest path on desktop and Android.",
    steps: [
      { label: "1", text: "Open usjet.ai/origin in Chrome." },
      { label: "2", text: "Tap Mic on the shield — choose Allow when Chrome asks." },
      { label: "3", text: "Speak after the status line says Origin is listening." },
    ],
  },
  {
    id: "safari",
    name: "Safari",
    iconLetter: "S",
    brandHue: "#0A84FF",
    downloadUrl: "https://www.apple.com/safari/",
    downloadLabel: "About Safari",
    summary:
      "Safari needs an extra tap for the microphone. Expand below — do not reload Origin; enable the mic right here.",
    steps: [
      {
        label: "Key",
        text: "The real fix is tapping Enable microphone on this page below. Safari only unlocks the mic after your tap.",
      },
    ],
    macSteps: [
      { label: "1", text: "Stay on this Origin page — do not follow a loop back to /origin." },
      {
        label: "2",
        text: "Tap Enable microphone on this page below. Safari will show a permission prompt — choose Allow.",
      },
      {
        label: "3",
        text: "If no prompt appears: Safari menu → Settings for This Website → Microphone → Allow.",
      },
      {
        label: "4",
        text: "Still blocked? System Settings → Privacy & Security → Microphone → turn Safari on.",
      },
    ],
    iosSteps: [
      { label: "1", text: "Open usjet.ai/origin in Safari on your iPhone or iPad." },
      { label: "2", text: "Tap Enable Origin voice on the banner, then tap Mic on the shield." },
      { label: "3", text: "When iOS asks, tap Allow so Safari can use the microphone." },
      {
        label: "4",
        text: "If mic stays off: Settings → Safari → Microphone → Ask or Allow, then reload Origin once.",
      },
    ],
    supportUrl: SAFARI_MIC_SUPPORT_URL,
    supportLabel: "Apple Support — Safari microphone for websites",
    macPrivacyUrl: SAFARI_MAC_MIC_PRIVACY_URL,
    macPrivacyLabel: "Open Microphone privacy (macOS)",
    macPrivacyFallback:
      "If that button does nothing, open System Settings manually → Privacy & Security → Microphone → enable Safari. macOS may block automatic deep links.",
  },
  {
    id: "firefox",
    name: "Firefox",
    iconLetter: "F",
    brandHue: "#FF7139",
    downloadUrl: "https://www.mozilla.org/firefox/",
    downloadLabel: "Get Firefox",
    summary: "Firefox respects per-site permissions — allow Origin once.",
    steps: [
      { label: "1", text: "Open usjet.ai/origin in Firefox." },
      { label: "2", text: "Click the mic icon in the address bar if Firefox blocked audio earlier." },
      { label: "3", text: "Tap Mic on Origin and choose Allow — then speak." },
    ],
  },
  {
    id: "edge",
    name: "Microsoft Edge",
    iconLetter: "E",
    brandHue: "#0078D7",
    downloadUrl: "https://www.microsoft.com/edge",
    downloadLabel: "Get Edge",
    summary: "Edge on Windows works like Chrome for mic access.",
    steps: [
      { label: "1", text: "Open usjet.ai/origin in Edge." },
      { label: "2", text: "Tap Mic — choose Allow when Edge prompts." },
      { label: "3", text: "If blocked, Edge lock icon → Site permissions → Microphone → Allow." },
    ],
  },
  {
    id: "brave",
    name: "Brave",
    iconLetter: "B",
    brandHue: "#FB542B",
    downloadUrl: "https://brave.com/",
    downloadLabel: "Get Brave",
    summary: "Brave may shield the mic until you allow this site.",
    steps: [
      { label: "1", text: "Open usjet.ai/origin in Brave." },
      { label: "2", text: "Tap Mic on Origin — approve the Brave permission banner." },
      { label: "3", text: "Shields icon → Advanced → allow microphone for this site if needed." },
    ],
  },
  {
    id: "opera",
    name: "Opera",
    iconLetter: "O",
    brandHue: "#FF1B2D",
    downloadUrl: "https://www.opera.com/",
    downloadLabel: "Get Opera",
    summary: "Opera uses Chromium-style mic prompts on desktop.",
    steps: [
      { label: "1", text: "Open usjet.ai/origin in Opera." },
      { label: "2", text: "Tap Mic and choose Allow when Opera asks." },
      { label: "3", text: "Check the padlock → Site settings → Microphone if the prompt never appears." },
    ],
  },
  {
    id: "samsung",
    name: "Samsung Internet",
    iconLetter: "Si",
    brandHue: "#1428A0",
    downloadUrl: "https://www.samsung.com/us/support/owners/app/samsung-internet/",
    downloadLabel: "About Samsung Internet",
    summary: "Samsung Internet on Galaxy needs a tap before the mic opens.",
    steps: [
      { label: "1", text: "Open usjet.ai/origin in Samsung Internet." },
      { label: "2", text: "Tap Enable Origin voice, then Mic on the shield." },
      { label: "3", text: "Allow microphone when Android prompts — then speak to Origin." },
    ],
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
