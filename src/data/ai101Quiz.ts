/** AI 101 graduation quiz — hardware-first, cockpit secondary. */

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
    prompt: "What is USJET's primary product?",
    choices: [
      "A $19.90/mo ChatGPT wrapper",
      "A computer with a local assistant already installed (the Operator's Rig)",
      "A bookmark directory of 30 AI tabs",
      "A landscape-only mobile app",
    ],
    correctIndex: 1,
  },
  {
    id: "q2",
    prompt: "What is Homes?",
    choices: [
      "The monthly Flight Pass checkout",
      "AI computers for the house — the home page, also called Hangar",
      "Only the blog",
      "A rotate-to-landscape gate",
    ],
    correctIndex: 1,
  },
  {
    id: "q3",
    prompt: "The header says Business. What page is that?",
    choices: [
      "/special",
      "/fleet — shop-and-office computers and always-on boxes",
      "A different company",
      "Member Login",
    ],
    correctIndex: 1,
  },
  {
    id: "q4",
    prompt: "What does Deck mean on this site?",
    choices: [
      "You must rotate your phone",
      "The left-edge tab that opens the site menu",
      "A Stripe product",
      "The Intel board",
    ],
    correctIndex: 1,
  },
  {
    id: "q5",
    prompt: "Where do files go on an Operator's Rig?",
    choices: [
      "They must be pasted into ChatGPT",
      "They stay on YOUR machine (the vault reads local documents)",
      "USJET trains a public model on them",
      "They upload to Google Drive by default",
    ],
    correctIndex: 1,
  },
  {
    id: "q6",
    prompt: "What is Flight Pass $19.90/mo?",
    choices: [
      "The price of a Mac Mini",
      "An optional monthly cockpit — not the hardware hero",
      "Required to see Homes",
      "A warranty",
    ],
    correctIndex: 1,
  },
  {
    id: "q7",
    prompt: "How do you pay?",
    choices: [
      "Google or Apple sign-in",
      "Stripe only",
      "Cash in the comments",
      "PayPal required",
    ],
    correctIndex: 1,
  },
  {
    id: "q8",
    prompt: "Who is the founder, and what is the company?",
    choices: [
      "Anonymous / a holding co we will not name",
      "Ameer Karim · USJET LLC",
      "OpenAI",
      "A review site",
    ],
    correctIndex: 1,
  },
  {
    id: "q9",
    prompt: "Must you rotate a phone to landscape to shop?",
    choices: [
      "Yes — portrait is blocked",
      "No — portrait is the main path; landscape is extra width",
      "Only on Business",
      "Only after Flight Pass",
    ],
    correctIndex: 1,
  },
  {
    id: "q10",
    prompt: "If a computer arrives damaged, what does this site actually promise?",
    choices: [
      "A fake 5-star review and a guaranteed 30-day no-questions return advertised as policy",
      "Manufacturer warranties apply; write ops@usjet.ai — a numbered USJET return window is still a Terms placeholder",
      "Nothing; all sales final with no email",
      "Apple Store Genius Bar is the only contact",
    ],
    correctIndex: 1,
  },
];
