import type { MemberSession } from "../types/member";
import { buildOpenRouterMessages, completeOriginChat } from "./openrouter";
import {
  buildOriginMemberContext,
  readMemberProjects,
} from "./memberProjectTracker";
import {
  adoptCsSubjectFromText,
  augmentMemberContextForCs,
  buildCsGuestVerificationSpokenReply,
  buildCsOverwhelmSpokenReply,
  buildCsOverwhelmSystemNudge,
  buildCsSubjectSystemNudge,
  buildCsTopicShiftSpokenReply,
  buildCsVerificationSystemNudge,
  bumpCsUserTurn,
  detectCsOverwhelm,
  detectCsTopicShift,
  detectCsVerificationIntent,
  readOriginCsSubjectState,
  seedCsSubjectFromMember,
} from "./originCsSubject";

export type OriginChatTurn = { role: "user" | "assistant"; content: string };

export const ORIGIN_WELCOME_ASSISTANT: OriginChatTurn = {
  role: "assistant",
  content:
    "Welcome to U. S. Jet. I'm Origin — onboard command. Ask about the fleet, which bay to open, Hangar, Jet Browser, tiers, or Stripe login.",
};

export const ORIGIN_CHAT_ERROR =
  "Origin hit turbulence on that question. Try again, or ask about Hangar, Fleet, tiers, or a partner bay by name.";

export type OriginTurnResult = {
  turns: OriginChatTurn[];
  reply: string;
  error: string | null;
};

/**
 * Shared Origin turn path for text composer and voice session.
 */
export async function sendOriginTurn(args: {
  text: string;
  turns: OriginChatTurn[];
  session: MemberSession | null;
  isCustomerServiceEntry: boolean;
}): Promise<OriginTurnResult> {
  const text = args.text.trim();
  if (!text) {
    return { turns: args.turns, reply: "", error: null };
  }

  const nextTurns: OriginChatTurn[] = [...args.turns, { role: "user", content: text }];
  const memberContext = buildOriginMemberContext(args.session?.active ? args.session : null);

  let csPreface: string | null = null;
  const csNudges: string[] = [];
  let csState = readOriginCsSubjectState();

  if (args.isCustomerServiceEntry) {
    csState = seedCsSubjectFromMember(args.session?.active ? args.session : null);
    const projects = args.session?.active ? readMemberProjects(args.session.customerId) : [];

    if (detectCsOverwhelm(text)) {
      csPreface = buildCsOverwhelmSpokenReply();
      csNudges.push(buildCsOverwhelmSystemNudge());
    } else if (detectCsVerificationIntent(text)) {
      if (args.session?.active) {
        csNudges.push(buildCsVerificationSystemNudge(true));
      } else {
        csPreface = buildCsGuestVerificationSpokenReply();
        csNudges.push(buildCsVerificationSystemNudge(false));
      }
    } else {
      const shift = detectCsTopicShift(text, csState, projects);
      if (shift.shifted) {
        csPreface = buildCsTopicShiftSpokenReply(csState);
        csNudges.push(buildCsSubjectSystemNudge(csState));
      } else {
        csState = adoptCsSubjectFromText(text, csState, args.session?.active ? args.session : null);
        // Subject ask lives in the system prompt — do not overwrite the model's answer.
        if (!csState.activeCsSubject && csState.userTurnCount === 0) {
          csNudges.push(buildCsSubjectSystemNudge(csState));
        }
      }
    }

    csState = bumpCsUserTurn(csState);
  }

  const augmentedMemberContext = args.isCustomerServiceEntry
    ? augmentMemberContextForCs(memberContext, csState, csNudges)
    : memberContext;

  try {
    const reply = await completeOriginChat(
      buildOpenRouterMessages(nextTurns, {
        entry: args.isCustomerServiceEntry ? "customer-service" : undefined,
        memberContext: augmentedMemberContext,
      }),
    );
    const assistantText = csPreface ? `${csPreface}\n\n${reply}` : reply;
    return {
      turns: [...nextTurns, { role: "assistant", content: assistantText }],
      reply: assistantText,
      error: null,
    };
  } catch {
    return {
      turns: [...nextTurns, { role: "assistant", content: ORIGIN_CHAT_ERROR }],
      reply: ORIGIN_CHAT_ERROR,
      error: ORIGIN_CHAT_ERROR,
    };
  }
}
