import type { MemberProject } from "./memberProjectTracker";
import { getMemberProjectStats, readMemberProjects } from "./memberProjectTracker";
import type { MemberSession } from "../types/member";
import { USJET_OPS_EMAIL } from "./usjetContact";

export const ORIGIN_CS_SUBJECT_STORAGE_KEY = "usjet-origin-cs-subject";

export type OriginCsSubjectState = {
  activeCsSubject: string | null;
  activeProjectId: string | null;
  userTurnCount: number;
};

const PIVOT_PATTERNS: RegExp[] = [
  /\b(actually|wait|hold on|never mind|forget (that|about|this))\b/i,
  /\b(new subject|new topic|different (subject|topic|project|question))\b/i,
  /\b(switch to|change (the )?subject|side question|another thing|unrelated)\b/i,
  /\b(can we talk about|what about|how about)\b.+\b(instead|rather)\b/i,
  /\b(let'?s move on|start over|fresh topic)\b/i,
];

const OVERWHELM_PATTERNS: RegExp[] = [
  /\b(too many|overwhelm|overwhelmed|all over the place)\b/i,
  /\b(lot of (things|topics|questions|issues)|jumping around|can'?t keep up)\b/i,
  /\b(everything at once|so many (things|topics|questions))\b/i,
];

const VERIFICATION_PATTERNS: RegExp[] = [
  /\b(verify|verification|log\s*in|sign\s*in|my account|member\s*id|access sentence)\b/i,
  /\b(am i (a )?member|check my (tier|clearance|subscription))\b/i,
];

function emptyState(): OriginCsSubjectState {
  return { activeCsSubject: null, activeProjectId: null, userTurnCount: 0 };
}

export function readOriginCsSubjectState(): OriginCsSubjectState {
  try {
    const raw = sessionStorage.getItem(ORIGIN_CS_SUBJECT_STORAGE_KEY);
    if (!raw) {
      return emptyState();
    }
    const parsed = JSON.parse(raw) as Partial<OriginCsSubjectState>;
    return {
      activeCsSubject:
        typeof parsed.activeCsSubject === "string" ? parsed.activeCsSubject : null,
      activeProjectId:
        typeof parsed.activeProjectId === "string" ? parsed.activeProjectId : null,
      userTurnCount:
        typeof parsed.userTurnCount === "number" ? parsed.userTurnCount : 0,
    };
  } catch {
    return emptyState();
  }
}

export function writeOriginCsSubjectState(state: OriginCsSubjectState): void {
  sessionStorage.setItem(ORIGIN_CS_SUBJECT_STORAGE_KEY, JSON.stringify(state));
}

export function clearOriginCsSubjectState(): void {
  sessionStorage.removeItem(ORIGIN_CS_SUBJECT_STORAGE_KEY);
}

export function seedCsSubjectFromMember(session: MemberSession | null): OriginCsSubjectState {
  const existing = readOriginCsSubjectState();
  if (existing.activeCsSubject) {
    return existing;
  }
  if (!session?.active) {
    return existing;
  }

  const stats = getMemberProjectStats(session.customerId);
  if (!stats.activeProjectName) {
    return existing;
  }

  const next: OriginCsSubjectState = {
    activeCsSubject: stats.activeProjectName,
    activeProjectId: stats.activeProjectId,
    userTurnCount: existing.userTurnCount,
  };
  writeOriginCsSubjectState(next);
  return next;
}

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function mentionsOtherProject(
  userText: string,
  activeProjectId: string | null,
  projects: MemberProject[],
): string | null {
  const lower = userText.toLowerCase();
  for (const project of projects) {
    if (project.id === activeProjectId) {
      continue;
    }
    const name = project.name.trim().toLowerCase();
    if (name.length >= 3 && lower.includes(name)) {
      return project.name;
    }
  }
  return null;
}

export type CsTopicShiftResult = {
  shifted: boolean;
  hintedSubject?: string;
  reason?: "pivot-phrase" | "other-project";
};

export function detectCsTopicShift(
  userText: string,
  state: OriginCsSubjectState,
  projects: MemberProject[],
): CsTopicShiftResult {
  if (!state.activeCsSubject || state.userTurnCount < 1) {
    return { shifted: false };
  }

  const trimmed = userText.trim();
  if (!trimmed) {
    return { shifted: false };
  }

  if (PIVOT_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return { shifted: true, reason: "pivot-phrase" };
  }

  const otherProject = mentionsOtherProject(trimmed, state.activeProjectId, projects);
  if (otherProject) {
    return { shifted: true, reason: "other-project", hintedSubject: otherProject };
  }

  const subjectWords = normalizeWords(state.activeCsSubject);
  const userWords = new Set(normalizeWords(trimmed));
  const overlap = subjectWords.filter((word) => userWords.has(word)).length;
  if (
    subjectWords.length >= 2 &&
    overlap === 0 &&
    trimmed.split(/\s+/).length >= 6 &&
    !VERIFICATION_PATTERNS.some((pattern) => pattern.test(trimmed))
  ) {
    return { shifted: true, reason: "pivot-phrase" };
  }

  return { shifted: false };
}

export function detectCsOverwhelm(userText: string): boolean {
  const trimmed = userText.trim();
  if (!trimmed) {
    return false;
  }
  return OVERWHELM_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function detectCsVerificationIntent(userText: string): boolean {
  return VERIFICATION_PATTERNS.some((pattern) => pattern.test(userText));
}

export function buildCsTopicShiftSpokenReply(state: OriginCsSubjectState): string {
  const subject = state.activeCsSubject?.trim();
  if (subject) {
    return `We're still on the same subject — ${subject}. Every time you start a new subject, you call me. What's your next step on this project?`;
  }
  return "We're still on the same subject — what's your project? Every time you start a new subject, you call me.";
}

export function buildCsOverwhelmSpokenReply(): string {
  return `That's a lot to carry at once. For customer service, email OPS at ${USJET_OPS_EMAIL}.`;
}

export function buildCsEstablishSubjectSpokenReply(): string {
  return "We're on Customer Service — one subject per thread. What's your project today?";
}

export function buildCsGuestVerificationSpokenReply(): string {
  return "To verify your membership, go to Member Login at usjet.ai slash member slash login. Use your Stripe billing email and your founder-issued access sentence — text only, no voice verify needed. Once you're in, come back here and I'll read your clearance.";
}

export function buildCsSubjectSystemNudge(state: OriginCsSubjectState): string {
  const subject = state.activeCsSubject?.trim() || "unset";
  return [
    "SUBJECT_DISCIPLINE_NUDGE:",
    `currentSubject: "${subject}"`,
    `activeProjectId: ${state.activeProjectId ?? "none"}`,
    "The visitor pivoted off-thread. Redirect verbally — no UI walls. Stay on ONE subject per thread.",
    "Say we're still on the same subject; every new subject means they call Customer Service again.",
    "Tie answers to assigned fleet units and search intents from MEMBER_CONTEXT when present.",
  ].join("\n");
}

export function buildCsOverwhelmSystemNudge(): string {
  return [
    "OVERWHELM_ESCALATION_NUDGE:",
    "Visitor is overwhelmed or jumping topics. Keep the spoken reply short.",
    `Offer Ops — say "For customer service, email OPS at ${USJET_OPS_EMAIL}."`,
    "Do not open new subjects; summarize what you heard and route to Ops async.",
  ].join("\n");
}

export function buildCsVerificationSystemNudge(sessionActive: boolean): string {
  if (sessionActive) {
    return [
      "VERIFICATION_NUDGE:",
      "Visitor is already logged in — treat as verified. Cite MEMBER_CONTEXT tier and clearance warmly.",
    ].join("\n");
  }
  return [
    "VERIFICATION_NUDGE:",
    "Guest verification is text-only at /member/login — Stripe billing email plus founder-issued access sentence (or cus_ Member ID).",
    "No OAuth. No voice verification step. After login, they return here with MEMBER_CONTEXT.",
  ].join("\n");
}

export function augmentMemberContextForCs(
  memberContext: string | undefined,
  state: OriginCsSubjectState,
  extraNudges: string[] = [],
): string | undefined {
  const blocks: string[] = [];
  if (memberContext?.trim()) {
    blocks.push(memberContext.trim());
  }

  if (state.activeCsSubject?.trim()) {
    blocks.push(
      [
        "CS_CONVERSATION_SUBJECT (one thread — stick to this project):",
        `currentSubject: "${state.activeCsSubject.trim()}"`,
        `activeProjectId: ${state.activeProjectId ?? "none"}`,
        "Route fleet recommendations to assignments and search intents under this project only.",
      ].join("\n"),
    );
  }

  for (const nudge of extraNudges) {
    if (nudge.trim()) {
      blocks.push(nudge.trim());
    }
  }

  return blocks.length > 0 ? blocks.join("\n\n") : undefined;
}

export function bumpCsUserTurn(state: OriginCsSubjectState): OriginCsSubjectState {
  const next = { ...state, userTurnCount: state.userTurnCount + 1 };
  writeOriginCsSubjectState(next);
  return next;
}

export function adoptCsSubjectFromText(
  userText: string,
  state: OriginCsSubjectState,
  session: MemberSession | null,
): OriginCsSubjectState {
  if (state.activeCsSubject?.trim()) {
    return state;
  }

  const trimmed = userText.trim();
  if (!trimmed || trimmed.length < 3) {
    return state;
  }

  if (session?.active) {
    const projects = readMemberProjects(session.customerId);
    const lower = trimmed.toLowerCase();
    const matched = projects.find((project) => {
      const name = project.name.trim().toLowerCase();
      return name.length >= 3 && lower.includes(name);
    });
    if (matched) {
      const next: OriginCsSubjectState = {
        activeCsSubject: matched.name,
        activeProjectId: matched.id,
        userTurnCount: state.userTurnCount,
      };
      writeOriginCsSubjectState(next);
      return next;
    }

    const stats = getMemberProjectStats(session.customerId);
    if (stats.activeProjectName) {
      const next: OriginCsSubjectState = {
        activeCsSubject: stats.activeProjectName,
        activeProjectId: stats.activeProjectId,
        userTurnCount: state.userTurnCount,
      };
      writeOriginCsSubjectState(next);
      return next;
    }
  }

  const shortLabel =
    trimmed.length > 64 ? `${trimmed.slice(0, 61).trim()}…` : trimmed;
  const next: OriginCsSubjectState = {
    activeCsSubject: shortLabel,
    activeProjectId: null,
    userTurnCount: state.userTurnCount,
  };
  writeOriginCsSubjectState(next);
  return next;
}
