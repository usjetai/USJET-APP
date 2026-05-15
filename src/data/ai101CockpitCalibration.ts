/** AI 101 — Cockpit Calibration (browser troubleshooting for operators). */

export const AI101_CALIBRATION_EYEBROW = "Cockpit calibration" as const;

export const AI101_CALIBRATION_TITLE = "Operator Intelligence: Optimizing Your AI Cockpit" as const;

export const AI101_CALIBRATION_LEDE =
  "Running a fleet requires precision. Use these calibrations to ensure zero-latency communication with your AI agents. If the browser isn't set up right, it's like flying a jet with a dirty windshield." as const;

export const AI101_CALIBRATION_STEPS = [
  {
    id: "exhaust",
    icon: "refresh" as const,
    title: "Clear the technical exhaust",
    subtitle: "Cache & cookies",
    issue:
      "AI interfaces store massive amounts of data to keep conversations fast. Over time, this exhaust clogs the browser — network errors and frozen screens.",
    fixes: [
      "Hard refresh: Cmd + Shift + R (Mac) or Ctrl + F5 (Windows).",
      "Clear site-specific cookies: lock icon in the URL bar → Cookies and site data → Manage → Delete. Resets the AI short-term memory without logging you out of everything else.",
    ],
  },
  {
    id: "ghost",
    icon: "shield" as const,
    title: 'Disable "ghost" extensions',
    subtitle: "Ad-blockers & VPNs",
    issue:
      "Ad-blockers and privacy extensions often mistake AI streaming text for malicious scripts and kill the connection.",
    fixes: [
      "Whitelist the USJET.AI domain in your ad-blocker.",
      "If using a VPN, use a high-bandwidth server — AI needs a stable handshake with the server.",
    ],
  },
  {
    id: "gpu",
    icon: "zap" as const,
    title: "Manage compute resources",
    subtitle: "Hardware acceleration",
    issue:
      "Modern AI UIs — including USJET Liquid Glass — use your GPU. Wrong browser settings shift load to the CPU: fan spin, lag, stutter.",
    fixes: [
      'Browser Settings → System → toggle "Use graphics acceleration when available" to ON.',
    ],
  },
  {
    id: "session",
    icon: "gear" as const,
    title: "Session timeout protocol",
    subtitle: "Keep the channel hot",
    issue:
      "Leave an AI tab open for hours and the session token expires. You type — nothing happens.",
    fixes: ["Before a long prompt, quick page refresh to ensure the session is hot."],
  },
] as const;

export const AI101_DIAGNOSTICS_BUTTON = "One-Click Diagnostics" as const;

export const AI101_DIAGNOSTICS_RUNNING = "Running cockpit diagnostics…" as const;
