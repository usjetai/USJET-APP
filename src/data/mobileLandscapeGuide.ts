/** Mobile landscape guide — developer / fleet tool layout (/landscape). */

export const MOBILE_LANDSCAPE_ROUTE = "/landscape" as const;

export const MOBILE_LANDSCAPE_TITLE = "Rotate for the full command deck" as const;

export const MOBILE_LANDSCAPE_TAGLINE = "Landscape · developer tool view" as const;

export const MOBILE_LANDSCAPE_INTRO =
  "USJET.AI is built as a wide command deck—not a narrow feed. The fleet tiles, hangar bays, live terminal strip, and bottom ops toolbar are designed to spread out in landscape so you see every control at once." as const;

export const MOBILE_LANDSCAPE_WHY = [
  {
    heading: "Tiles show in full",
    body: "Fleet and hangar cards are landscape bays. In portrait they stack and clip; sideways you get the full runway grid the founder designed—names, handoff, and status visible without scrolling every row.",
  },
  {
    heading: "Toolbars stay on one line",
    body: "The top nav (Protocol, Fleet online, Blog, B2B) and the bottom contact strip pack dozens of chips. Landscape gives them room so nothing hides behind overflow or feels crushed.",
  },
  {
    heading: "This is a developer / operator console",
    body: "You are not browsing a blog—you are running a 30-unit AI fleet. The layout assumes phone-wide or desktop width, like a cockpit HUD rather than a single-column app.",
  },
] as const;

export const MOBILE_LANDSCAPE_HOW_IOS = [
  "Turn off Rotation Lock: swipe down → tap the lock icon with a circle arrow (or Settings → Control Center).",
  "Hold the phone with the long edge on the bottom.",
  "Rotate 90° until the site reflows; Safari/Chrome will use the wider viewport.",
] as const;

export const MOBILE_LANDSCAPE_HOW_ANDROID = [
  "Turn off screen rotation lock in Quick Settings (icon may say Auto-rotate).",
  "Rotate the device to landscape (long edge horizontal).",
  "If the page stays narrow, tap the browser menu → Desktop site or reload once.",
] as const;

export const MOBILE_LANDSCAPE_NOTE =
  "Portrait still works for quick checks—but for fueling the fleet, reading intel, and using Protocol + terminal together, landscape is the intended experience." as const;

export const MOBILE_LANDSCAPE_CHIP_HOVER =
  "Open the landscape guide — USJET works best sideways on mobile" as const;
