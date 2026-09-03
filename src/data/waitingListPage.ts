/**
 * Reserve-a-rig waiting list.
 *
 * Deliberately states NO price. The M4 lineup on the store deck is last-generation
 * and out of stock at retail; the next machines are the M6 generation, and no
 * price is public until one is actually in hand. A wrong number in public is
 * worse than no number.
 *
 * Deliberately takes NO payment. A deposit is money held against an undelivered
 * good — that needs cleared payment rails and a written deposit-refund term, and
 * we have neither yet. This page reserves a place in line and nothing else.
 */

export const WAITING_LIST_PAGE_TITLE = "Reserve an Operator's Rig — USJET";

export const WAITING_LIST_META_DESCRIPTION =
  "Join the list for the next Operator's Rig: a Mac that arrives with a local AI stack already installed and configured. No payment now.";

export const WAITING_LIST_CANONICAL_URL = "https://usjet.ai/waiting-list";

export const WAITING_LIST_INTRO = [
  "An Operator's Rig is a Mac that arrives with the AI already on it — runtime installed, model pulled, permissions sorted. The model runs on the machine, so the documents you feed it are never sent to a model provider.",
  "The next batch is built on the new generation of Mac mini, which Apple ships on 22 September 2026. Until one is on the bench, no price is published and no payment is taken. This list is a place in line.",
] as const;

export const WAITING_LIST_WHAT_HAPPENS = [
  {
    id: "reply",
    title: "You get a real reply",
    body: "From ops@usjet.ai, written by the person who builds the machines. Usually within a day or two — he is in a shop until six most days.",
  },
  {
    id: "spec",
    title: "We size it to your work",
    body: "How much memory you need depends on what you are actually running. That is a conversation, not a dropdown.",
  },
  {
    id: "price",
    title: "You see the price before anyone asks you for money",
    body: "When the machines are available you get the exact configuration and the exact number, in writing, first.",
  },
  {
    id: "no-obligation",
    title: "Nothing is owed",
    body: "This list is not an order and not a contract. Ask to come off it any time and you are off it.",
  },
] as const;

export const WAITING_LIST_ROLES = [
  "Medical / dental practice",
  "Law firm or solo attorney",
  "Accounting / bookkeeping",
  "Therapy / counselling",
  "Another business with confidential files",
  "Developer or technical user",
  "Personal use",
  "Something else",
] as const;

export const WAITING_LIST_PRIVACY_NOTE =
  "What you send here goes to ops@usjet.ai and is used to answer you about a rig. It is not sold, not shared, and not added to any marketing list.";

export const WAITING_LIST_FALLBACK_SUBJECT = "Operator's Rig — waiting list";
