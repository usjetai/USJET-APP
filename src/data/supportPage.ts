/**
 * USJET Support Plans — `/support`.
 *
 * Every item on this page is something USJET can actually deliver today, as
 * confirmed by Ameer on 4 Sep 2026: email with a one-business-day reply,
 * scheduled phone or video calls, remote sessions on the customer's Mac (with
 * permission each time), and on-site work in the New York area. Do not add a
 * channel here that isn't on that list.
 *
 * NO PRICES. Same rule as the rigs (sales playbook §4b): nothing is priced
 * until a machine is on the bench. The page says so and points at the
 * waiting list. The 90-day Limited Warranty (/warranty) is the free baseline;
 * paid plans extend it — they never replace or shorten it.
 */

import { SITE_ORIGIN } from "./siteSeo";

export const SUPPORT_ROUTE = "/support" as const;

export const SUPPORT_CANONICAL_URL = `${SITE_ORIGIN}${SUPPORT_ROUTE}` as const;

export const SUPPORT_PAGE_TITLE = "Support Plans — USJET Operator's Rig | USJET.AI" as const;

export const SUPPORT_META_DESCRIPTION =
  "What comes with every Operator's Rig, and the two support plans that extend it: Standing Support (email, scheduled calls, remote sessions on your Mac) and On-Site Support in the New York area. No plan is priced until the rig is." as const;

export const SUPPORT_EFFECTIVE_DATE = "September 4, 2026" as const;

export type SupportPlan = {
  id: string;
  /** Short label used on the card and in links. */
  name: string;
  /** Who it is for, one line. */
  audience: string;
  /** One paragraph, plain language. */
  summary: string;
  /** What you actually get. Each one must be deliverable. */
  includes: string[];
  /** "Included" or "Priced with your rig" — never a number. */
  priceLine: string;
  /** Paid plans get the reserve CTA; the baseline doesn't. */
  paid: boolean;
};

export const SUPPORT_PLANS: SupportPlan[] = [
  {
    id: "included",
    name: "Included with every rig",
    audience: "Every Operator's Rig, desk or office. No plan to buy.",
    summary:
      "The rig arrives configured and tested, and the first 90 days are on us. If the setup we did stops working, we put it right.",
    includes: [
      "The USJET Limited Warranty: 90 days on the configuration and software setup, from the day it's delivered.",
      "Email support at ops@usjet.ai. We reply within one business day.",
      "The six-volume manual set, in the box. How to run the rig, not a generic Apple PDF.",
      "Apple's own one-year hardware warranty on the Mac mini itself. It began on USJET's purchase date; the dated proof of purchase ships with the machine.",
    ],
    priceLine: "Included",
    paid: false,
  },
  {
    id: "standing",
    name: "Standing Support",
    audience: "One year, renewable. For the desk rig or the office rig.",
    summary:
      "Coverage keeps going after day 90, and you get a person to call. When a better model is worth installing, we install it. When something breaks, we fix it — on your machine, while you watch.",
    includes: [
      "The configuration stays covered for the full year, not just the first 90 days.",
      "Email at ops@usjet.ai, reply within one business day.",
      "Scheduled phone or video calls, booked ahead. Ask anything — \"can it read these?\", \"why did it say that?\", \"is this safe to feed it?\"",
      "Remote sessions on your Mac, with your permission each time and you at the keyboard: model updates when a new version is worth having, software updates, and a full re-configuration if the setup breaks.",
      "A plain answer about what the rig can and can't do for a job you have in mind. We'll tell you when the answer is no.",
    ],
    priceLine: "Priced with your rig",
    paid: true,
  },
  {
    id: "on-site",
    name: "On-Site Support",
    audience: "New York area. For the office rig.",
    summary:
      "Everything in Standing Support, plus we come to you. The rig gets set up at your desk, your staff get shown how to use it, and we come back on a schedule.",
    includes: [
      "Everything in Standing Support.",
      "Setup at your office: we bring the rig, plug it in, and point it at your files on day one.",
      "A walkthrough for your staff the same day — what to give it, what to ask it, what never to paste into anything else.",
      "A scheduled visit each quarter to update models, check the setup, and answer what's come up since.",
    ],
    priceLine: "Priced with your rig",
    paid: true,
  },
];

export type SupportSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const SUPPORT_SECTIONS: SupportSection[] = [
  {
    id: "pricing",
    title: "Why there's no price on this page",
    paragraphs: [
      "The same reason there's no price on the rig: the machine it runs on ships after 22 September 2026, and nothing gets a number until one is on the bench. When you reserve a rig, the exact terms and price for any plan you want come in writing, before you pay anything.",
      "A plan is never required. The warranty and email support above come with every rig whether you buy a plan or not.",
    ],
  },
  {
    id: "what-a-session-is",
    title: "What a remote session is, and isn't",
    paragraphs: [
      "A remote session means you open a screen-share from your Mac, you watch what we do, and you close it when we're done. We ask each time. We don't keep a way in.",
    ],
    bullets: [
      "We never log into your accounts. If a step needs a password, you type it.",
      "We never take a copy of your files. The rig's whole point is that they don't leave the room; a support session doesn't change that.",
      "Nothing on the rig is tied to a USJET account. Cancel a plan and the machine keeps working exactly as it did.",
    ],
  },
  {
    id: "not-covered",
    title: "What no plan covers",
    paragraphs: [
      "The Apple hardware. A dead port, a failed drive, a cracked case — that's Apple's warranty and Apple's repair. We'll help you get it to them and set the rig back up when it's back, but we don't open the box.",
      "The models' answers. A local model can be wrong, the same as a cloud one. The plan gets you a person who'll tell you what it's good at and where to double-check it; it doesn't make the model right.",
    ],
  },
  {
    id: "how-to-ask",
    title: "How to get help",
    paragraphs: [
      "Email ops@usjet.ai with the rig's serial number and what happened. One business day, every plan, including none. For a call or a session, we'll send a time.",
    ],
  },
];
