/**
 * Developer / builder surfaces — logos, badges, and vectors only (JPEG export targets).
 * Routes align with guest-clearance developer tooling in memberAccessLevel.
 */
export type DeveloperPageCapture = {
  /** CSS selector on the live page */
  selector: string;
  /** Output filename stem (no extension) */
  file: string;
  /** logos | badges | vectors */
  kind: "logos" | "badges" | "vectors";
  /** When true, export one JPEG per matched node */
  all?: boolean;
  /** Scroll into view before capture (below-fold sections) */
  scroll?: boolean;
};

export type DeveloperPageExportConfig = {
  path: string;
  slug: string;
  label: string;
  captures: DeveloperPageCapture[];
};

export const DEVELOPER_PAGES_EXPORT: DeveloperPageExportConfig[] = [
  {
    path: "/code-kit",
    slug: "code-kit",
    label: "USJET Developer Code Kit",
    captures: [
      { kind: "badges", selector: ".code-kit-page__badge", file: "page-badge" },
      { kind: "logos", selector: ".code-kit-page__badge-icon", file: "badge-icon-brackets" },
      { kind: "badges", selector: ".code-kit-checkout__badge-row", file: "checkout-badge-row" },
      {
        kind: "vectors",
        selector: ".ai101-engine-room__package-icon",
        file: "engine-package-icon",
        all: true,
        scroll: true,
      },
      {
        kind: "vectors",
        selector: ".ai101-engine-room__guarantee-icon",
        file: "engine-guarantee-icon",
        scroll: true,
      },
    ],
  },
  {
    path: "/landscape",
    slug: "landscape",
    label: "Mobile landscape developer guide",
    captures: [
      {
        kind: "vectors",
        selector: ".mobile-landscape-page__icon-hero",
        file: "rotate-phones-vector",
      },
      { kind: "badges", selector: ".mobile-landscape-page__eyebrow", file: "eyebrow-badge" },
    ],
  },
  {
    path: "/sovereignty",
    slug: "sovereignty",
    label: "Sovereignty developer archive",
    captures: [
      {
        kind: "vectors",
        selector: ".strategic-assets-hero__airframe",
        file: "hero-airframe-vector",
      },
      { kind: "logos", selector: ".sovereignty-framework__mark", file: "framework-mark" },
      { kind: "logos", selector: ".sovereignty-evidence__mark", file: "evidence-mark" },
      { kind: "logos", selector: ".sovereignty-book__mark", file: "book-mark" },
    ],
  },
  {
    path: "/ai-101",
    slug: "ai-101",
    label: "AI 101 flight school",
    captures: [
      {
        kind: "badges",
        selector: ".ai101-page__hero .rounded-full",
        file: "guest-curriculum-badge",
      },
      { kind: "logos", selector: ".ai101-code-access-btn", file: "code-access-logo-btn" },
      {
        kind: "vectors",
        selector: ".ai101-partner__stars-svg",
        file: "partner-stars-vector",
        scroll: true,
      },
      {
        kind: "vectors",
        selector: ".ai101-engine-room__package-icon",
        file: "engine-package-icon",
        all: true,
        scroll: true,
      },
      {
        kind: "vectors",
        selector: ".ai101-calibration__trigger-icon",
        file: "calibration-step-icon",
        all: true,
        scroll: true,
      },
      {
        kind: "badges",
        selector: ".fleet-command--ceremony",
        file: "protocol-ceremony-badge",
        scroll: true,
      },
    ],
  },
  {
    path: "/protocol-proof",
    slug: "protocol-proof",
    label: "Protocol session proof",
    captures: [
      {
        kind: "badges",
        selector: ".protocol-proof-page__swatch",
        file: "session-swatch",
        all: true,
      },
      { kind: "badges", selector: ".protocol-proof-page__eyebrow", file: "eyebrow-badge" },
    ],
  },
  {
    path: "/b2k",
    slug: "b2k",
    label: "B2K enterprise deployment",
    captures: [
      { kind: "badges", selector: ".b2k-page__badge", file: "page-badge" },
      { kind: "logos", selector: ".b2k-help-actions__envelope-icon", file: "app-crew-envelope-icon" },
    ],
  },
];
