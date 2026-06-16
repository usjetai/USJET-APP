/** Shared shape for acronym rows merged into the AI 101 curriculum. */
export type Ai101GlossaryCore = {
  /** Anchor-safe token (uppercase, no spaces), e.g. BAY, COCKPIT */
  code: string;
  phrase: string;
  meaning: string;
};

export type Ai101CurriculumRow = Ai101GlossaryCore & {
  /** Where this idea shows up on USJET surfaces — no invented metrics. */
  websiteContext: string;
  /** Static host-unit narration for the lesson card body. */
  lesson: string;
};
