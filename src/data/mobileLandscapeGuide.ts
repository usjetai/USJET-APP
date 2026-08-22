/** Phone view — portrait is the main path. Landscape is extra width, not a gate. */

export const MOBILE_LANDSCAPE_ROUTE = "/landscape" as const;

export const MOBILE_LANDSCAPE_TITLE = "Portrait works. Landscape is extra width." as const;

export const MOBILE_LANDSCAPE_TAGLINE = "Phone view · not a rotate gate" as const;

export const MOBILE_LANDSCAPE_INTRO =
  "Shop Homes and Business in portrait. You do not have to turn the phone sideways to buy a computer. Landscape is optional extra width if you want the film and the lineup on one long horizon." as const;

export const MOBILE_LANDSCAPE_WHY = [
  {
    heading: "Portrait is the main path",
    body: "The Operator's Rig shop, About, Returns, and Help are all readable standing up. If a page asked you to rotate, that was leftover cockpit chrome — not the product.",
  },
  {
    heading: "Landscape is optional",
    body: "Sideways gives the Homes film and the Business lineup more elbow room. Use it if you like it. It is not required to check out.",
  },
  {
    heading: "This is a hardware shop",
    body: "You are buying a computer with a local assistant on it. The page should work the way a phone shop works — one column, thumb reach, no command-deck exam.",
  },
] as const;

export const MOBILE_LANDSCAPE_HOW_IOS = [
  "Leave the phone in portrait and shop. No setting required.",
  "If you want landscape: turn off Rotation Lock (Control Center → lock with a circular arrow), then turn the phone.",
  "Safari will reflow to the wider viewport. Rotate back any time.",
] as const;

export const MOBILE_LANDSCAPE_HOW_ANDROID = [
  "Leave Auto-rotate off if you want to stay in portrait. The shop still works.",
  "If you want landscape: turn Auto-rotate on and turn the phone.",
  "If a page stays narrow after rotating, reload once.",
] as const;

export const MOBILE_LANDSCAPE_NOTE =
  "Portrait is first-class. Landscape is extra width. Neither path is a test." as const;

export const MOBILE_LANDSCAPE_CHIP_HOVER =
  "Phone view — portrait works; landscape is optional extra width" as const;
