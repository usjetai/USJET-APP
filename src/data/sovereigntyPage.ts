/**
 * Sovereign brand acquisition — `/sovereignty` (USJET settlement protocol)
 * Educational framing only; not legal advice.
 */

export const SOVEREIGNTY_ROUTE = "/sovereignty" as const;

export const SOVEREIGNTY_PAGE_TITLE =
  "Sovereign brand acquisition · The settlement protocol" as const;

export const SOVEREIGNTY_META_DESCRIPTION =
  "The USJET settlement protocol: sovereign brand acquisition and strategic territory — identify identity assets, socialize the bridge, settle fast, consolidate under one star.";

export const SOVEREIGNTY_HERO_KICKER =
  "USJET settlement protocol · sovereign brand territory" as const;

/** Official strategist header — H1 surface */
export const SOVEREIGNTY_OFFICIAL_TOPIC =
  "Sovereign brand acquisition: The settlement protocol." as const;

/** Supporting kinetic line beneath the topic */
export const SOVEREIGNTY_HERO_TAGLINE =
  "The art of the settlement: branding at warp speed." as const;

export const SETTLEMENT_SECTION_BODY =
  "Industry shorthand says 'digital real estate' — useful on a deed, passive for an operator consolidating a legacy mark. Sovereign acquisition is different: steward the identity, socialize the bridge, and trade ambiguity for decisive settlement velocity. Don't spend years in positional friction when a serious resolution can land in days. Educational perspective only—not legal advice." as const;

export const DOMAIN_HANDLE_FRAMEWORK_TITLE = "Brand land-grab playbook" as const;

export const DOMAIN_HANDLE_STEPS = [
  {
    id: "identify",
    title: "Identify the strategic asset",
    body: "Short handles and exact-match domains are scarce flight paths. Name the specific property and why it matters to the mission.",
  },
  {
    id: "socialize",
    title: "Socialize the mission",
    body: "Build a bridge with the current steward: context, respect, and a narrative they can repeat to their own stakeholders.",
  },
  {
    id: "settle",
    title: "Propose the settlement",
    body: "Lead with a clean buyout or license that ends uncertainty fast. Fair numbers and fast closes often beat endless positioning.",
  },
  {
    id: "consolidate",
    title: "Secure the empire",
    body: "Consolidate brand, routing, and story under one USJET constellation — redirects, disclosures, and a single cockpit experience.",
  },
] as const;

export const SOVEREIGNTY_DOTCOM_BTN_SUB =
  "Primary legacy surface — outbound .com sovereignty stack." as const;

export const EVIDENCE_SECTION_TITLE = "Evidence of sovereignty: real-world branding." as const;

export const EVIDENCE_SECTION_BODY =
  "YouTube clips and TikTok embeds load muted per Silent Hangar protocol. Arm audio with the cockpit toggle when you are ready.";

/** Add `{ videoId, title }` entries — 11-char YouTube IDs. */
export const SOVEREIGNTY_EVIDENCE_VIDEOS: ReadonlyArray<{ videoId: string; title: string }> = [];

export type SovereigntyTikTokEvidence = {
  postId: string;
  postUrl: string;
  profileHandle: string;
  profileUrl: string;
  musicUrl: string;
  musicLabel: string;
  musicTitle: string;
  figureCaption: string;
};

/** TikTok reels — Silent Hangar (embed.js via `loadTikTokEmbedScript`). */
export const SOVEREIGNTY_EVIDENCE_TIKTOK: ReadonlyArray<SovereigntyTikTokEvidence> = [
  {
    postId: "7272836816175107371",
    postUrl: "https://www.tiktok.com/@usjetnyc/video/7272836816175107371",
    profileHandle: "@usjetnyc",
    profileUrl: "https://www.tiktok.com/@usjetnyc?refer=embed",
    musicUrl: "https://www.tiktok.com/music/MOVE-feat-Grace-Jones-Tems-7125609017358944258?refer=embed",
    musicLabel: "♬ MOVE (feat. Grace Jones & Tems) - Beyoncé",
    musicTitle: "♬ MOVE (feat. Grace Jones & Tems) - Beyoncé",
    figureCaption: "@usjetnyc · sovereign branding reel",
  },
  {
    postId: "7272846372389408043",
    postUrl: "https://www.tiktok.com/@usjetnyc/video/7272846372389408043",
    profileHandle: "@usjetnyc",
    profileUrl: "https://www.tiktok.com/@usjetnyc?refer=embed",
    musicUrl: "https://www.tiktok.com/music/Partition-6439560165174807298?refer=embed",
    musicLabel: "♬ Partition -  Beyoncé",
    musicTitle: "♬ Partition -  Beyoncé",
    figureCaption: "@usjetnyc · partition reel",
  },
  {
    postId: "7272857344898288938",
    postUrl: "https://www.tiktok.com/@usjetnyc/video/7272857344898288938",
    profileHandle: "@usjetnyc",
    profileUrl: "https://www.tiktok.com/@usjetnyc?refer=embed",
    musicUrl: "https://www.tiktok.com/music/I'M-THAT-GIRL-7125598551588997122?refer=embed",
    musicLabel: "♬ I'M THAT GIRL - Beyoncé",
    musicTitle: "♬ I'M THAT GIRL - Beyoncé",
    figureCaption: "@usjetnyc · I'm that girl reel",
  },
  {
    postId: "7272858320363457835",
    postUrl: "https://www.tiktok.com/@usjetnyc/video/7272858320363457835",
    profileHandle: "@usjetnyc",
    profileUrl: "https://www.tiktok.com/@usjetnyc?refer=embed",
    musicUrl: "https://www.tiktok.com/music/ENERGY-feat-Beam-7125598551177955330?refer=embed",
    musicLabel: "♬ ENERGY (feat. Beam) - Beyoncé",
    musicTitle: "♬ ENERGY (feat. Beam) - Beyoncé",
    figureCaption: "@usjetnyc · energy reel",
  },
  {
    postId: "7272859333602430251",
    postUrl: "https://www.tiktok.com/@usjetnyc/video/7272859333602430251",
    profileHandle: "@usjetnyc",
    profileUrl: "https://www.tiktok.com/@usjetnyc?refer=embed",
    musicUrl: "https://www.tiktok.com/music/MY-POWER-6715311938907162626?refer=embed",
    musicLabel:
      "♬ MY POWER - Nija & Beyoncé & Busiswa & Yemi Alade & Tierra Whack & Moonchild Sanelly & DJ Lag",
    musicTitle:
      "♬ MY POWER - Nija & Beyoncé & Busiswa & Yemi Alade & Tierra Whack & Moonchild Sanelly & DJ Lag",
    figureCaption: "@usjetnyc · my power reel",
  },
];

export const EMPIRE_BUILDER_BOOK_TITLE =
  'Digital Sovereignty: The Art of the Land Grab' as const;

export const EMPIRE_BUILDER_BOOK_PRICE_DISPLAY = "$49" as const;

export const EMPIRE_BUILDER_SECTION_LEDE =
  `Learn the full settlement strategy in the digital book: ${EMPIRE_BUILDER_BOOK_TITLE} (${EMPIRE_BUILDER_BOOK_PRICE_DISPLAY}).` as const;

export const EMPIRE_BUILDER_CTA_NOTE =
  "Checkout launches when the Stripe Payment Link is configured — or request a manual invoice via Direct Fuel.";
