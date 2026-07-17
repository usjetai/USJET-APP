/** AI 101 graduation quiz — pass to earn Member Portal badge. */

export type Ai101QuizQuestion = {
  id: string;
  prompt: string;
  choices: readonly [string, string, string, string];
  /** Index into choices (0–3). */
  correctIndex: number;
};

export const AI101_QUIZ_PASS_SCORE = 8;
export const AI101_QUIZ_TOTAL = 10;

export const AI101_QUIZ_QUESTIONS: readonly Ai101QuizQuestion[] = [
  {
    id: "q1",
    prompt: "What is the Hangar primarily for?",
    choices: [
      "Reading the Founder story only",
      "A home workbench of AI tiles you open and work in",
      "Paying invoices outside Stripe",
      "Opening every partner in a new browser tab",
    ],
    correctIndex: 1,
  },
  {
    id: "q2",
    prompt: "How many Hangar tabs can guests open for free?",
    choices: ["Two", "Four", "Six", "All thirty"],
    correctIndex: 2,
  },
  {
    id: "q3",
    prompt: "What is the difference between Fleet and Hangar?",
    choices: [
      "There is no difference",
      "Fleet is choose-and-launch; Hangar is multi-bay workbench",
      "Fleet is only for Enterprise",
      "Hangar cannot open partner tools",
    ],
    correctIndex: 1,
  },
  {
    id: "q4",
    prompt: "How many Fleet bays can guests launch for free?",
    choices: ["Six", "Eight", "Ten", "Thirty"],
    correctIndex: 2,
  },
  {
    id: "q5",
    prompt: "What does Jet Browser let you do?",
    choices: [
      "Edit Stripe invoices",
      "Enter any domain into Hangar-style tiles",
      "Replace Member Login with Google OAuth",
      "Buy NYSE data feeds for the ship",
    ],
    correctIndex: 1,
  },
  {
    id: "q6",
    prompt: "Which tier unlocks the Intel board?",
    choices: ["Guest only", "Flight Pass", "Hangar Pro (or higher)", "Cash App tip"],
    correctIndex: 2,
  },
  {
    id: "q7",
    prompt: "How do you log in to the Member Portal?",
    choices: [
      "Google or Apple OAuth",
      "Stripe billing email plus access sentence or cus_ Member ID",
      "Username and Stripe password only",
      "Voice print at Origin",
    ],
    correctIndex: 1,
  },
  {
    id: "q8",
    prompt: "What is Flight Pass priced at?",
    choices: ["$9.90/mo", "$19.90/mo", "$49.95/mo", "$199.99/mo"],
    correctIndex: 1,
  },
  {
    id: "q9",
    prompt: "How should partner tools open from U.S. Jet?",
    choices: [
      "Always target=_blank new tabs",
      "Same window / cockpit — one ship, one cockpit",
      "Only via email attachment",
      "Only on a second device",
    ],
    correctIndex: 1,
  },
  {
    id: "q10",
    prompt: "Where does the full ship curriculum live vs short troubleshooting?",
    choices: [
      "Help is the full curriculum; AI 101 is only prices",
      "AI 101 is the lesson; Help (/sos) is short troubleshooting",
      "Both are identical",
      "Only Origin has any help content",
    ],
    correctIndex: 1,
  },
];
