/** USJET operator log — founding posts + daily cadence to USA 250. */

export const BLOG_ROUTE = "/blog" as const;

export type UsjetBlogManifestoSection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type UsjetBlogPostCta = {
  intro: string;
  links: readonly { label: string; to: string; external?: boolean }[];
};

export type UsjetBlogPost = {
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  cadenceDay: number;
  excerpt: string;
  body: readonly string[];
  tags: readonly string[];
  /** Manifesto layout — aggressive typography, callout, featured visual. */
  variant?: "manifesto" | "institutional";
  manifestoSections?: readonly UsjetBlogManifestoSection[];
  realityCheck?: string;
  footerCta?: UsjetBlogPostCta;
  /** SEC / Form C launchpad — hangar reservations + app teaser. */
  institutional?: {
    preSecLabel: string;
    equityCarveout: string;
    hangarTitle: string;
    hangarCopy: string;
    goalMeterLabel: string;
    useOfFunds: readonly { label: string; amount: string }[];
    appStoreLine: string;
    appStoreSub: string;
  };
};

/** Three founding posts — each dated three days apart from cadence start. */
export const USJET_BLOG_POSTS: readonly UsjetBlogPost[] = [
  {
    slug: "founding-startup-log",
    title: "The Startup Log: How USJET LLC Took Flight",
    subtitle: "Day 1 · Founding dispatch",
    publishedAt: "2026-05-15",
    cadenceDay: 1,
    excerpt:
      "Eight years in the trade. Queens grit. One founder, one runway—this is the honest log of how USJET went from shop floor instinct to sovereign AI fleet.",
    tags: ["Founding", "Operator log", "USA 250"],
    body: [
      "USJET LLC did not start in a boardroom. It started where labor actually happens—between Long Beach and Queens, where the job is not done until the wrench turns and the truck rolls.",
      "Established in 2018, the entity was built on a simple contract with operators: Semper Fi—always faithful execution. No vanity metrics. No pitch decks that ignore the shop. We measured worth in what we fixed, not what we slid.",
      "The startup phase was not a funding headline. It was fifteen-hour dev sprints after real shifts—translating blue-collar rhythm into code. The thesis: America's fleet of shops, crews, and field ops deserve an industrial intelligence layer, not another chat toy.",
      "USJET.AI is that layer. Thirty agent bays. One cockpit. A founder who still thinks like an operator because he still is one. This log is day one of fifty daily dispatches before USA 250—July 4, 2026—when the republic marks 250 years and this protocol reprices to institutional scale.",
      "If you are reading this, you are early on the runway. Welcome to the founding flight.",
    ],
  },
  {
    slug: "what-usjet-ai-is",
    title: "What This Website Is—And What It Is Not",
    subtitle: "Day 4 · Site intelligence brief",
    publishedAt: "2026-05-18",
    cadenceDay: 4,
    excerpt:
      "usjet.ai is not a brochure. It is a working command surface: fleet runway, member portal, revenue ladder, B2B gateway, and AI 101 flight school.",
    tags: ["Platform", "Fleet", "Operators"],
    body: [
      "Visitors often ask what usjet.ai is. Here is the straight answer: it is the sovereign cockpit for a thirty-agent AI fleet, built for operators who run labor-based businesses—shops, logistics, crews, and field ops.",
      "The homepage is the runway. Each bay is a specialist agent with its own logic—not a clone of you, not a generic chatbot. The Hangar holds your workflows. The Member Portal tracks vitals, projects, and fleet activity. Intel surfaces market pulse for cleared operators.",
      "The revenue architecture is intentional: Founder's Fuel at $19.90/mo supports the mission. The Code Kit ($499) serves builders who want the engine room. The Fleet Manual ($2,500) is professional implementation. The Sovereign Protocol ($100K) is institutional IP. B2B is the enterprise briefing lane. B2K deployment is coming soon.",
      "AI 101 decodes the vocabulary—cockpit terms, Stripe verification, partnership protocol (do not clone your AI). This site is not slides. It is wrenches, glass, and line checks.",
      "What it is not: a social network, a replacement for your ERP, or a magic button. It is infrastructure you operate. Daily logs on this blog will stay responsive through day fifty of the march to USA 250.",
    ],
  },
  {
    slug: "partnership-not-cloning",
    title: "Partnership, Not Cloning: The Operator Rule",
    subtitle: "Day 7 · Human–AI doctrine",
    publishedAt: "2026-05-21",
    cadenceDay: 7,
    excerpt:
      "Stop cologneing your AI. Hire partners, not mirrors. The Anti-Clone protocol is how founders scale without inheriting their own blind spots.",
    tags: ["AI 101", "Partnership", "Fleet doctrine"],
    body: [
      "The most expensive mistake in AI operations is cologneing—forcing the model to smell exactly like you. You get politeness. You lose the check-and-balance that saves capital.",
      "A true leader does not hire clones. They hire partners who are sharper in specific lanes. Your logistics agent should not think like your creative agent. Your AI should carry mission, not your personality.",
      "USJET encodes this in AI 101: objective intelligence at machine speed, vision and gut instinct from the human founder. That is how you scale a company without turning the fleet into an echo chamber.",
      "This is day seven of the daily operator log. From day one of the fifty-day runway (May 15) through USA 250 (July 4, 2026), this blog stays on cadence—one dispatch per day, responsive to the clock, aligned with the semiquincentennial.",
      "The machine learns. The founder leads. The fleet stays specialized. Semper Fi.",
    ],
  },
  {
    slug: "zero-signal-rule",
    title: "The Zero-Signal Rule: Stop Socializing, Start Selling.",
    subtitle: "Zero-Signal manifesto · Get Real protocol",
    publishedAt: "2026-05-24",
    cadenceDay: 10,
    excerpt:
      "If your website hasn't processed a dollar, your social media is noise. Infrastructure first. Revenue is the only signal. Shut the apps. Fix the Buy button.",
    tags: ["Zero-Signal", "Manifesto", "Operators"],
    variant: "manifesto",
    body: [],
    manifestoSections: [
      {
        heading: "The raw truth",
        paragraphs: [
          "If you are spending four hours a day creating content, recording reels, and chasing likes—but your website has not processed a single dollar—you are failing.",
          "Social media is a megaphone. If you hold a megaphone up to a silent room, you are just a guy standing in the dark making noise.",
          "At USJET.AI, we do not socialize until the infrastructure is solid.",
        ],
      },
      {
        heading: "The USJET protocol",
        paragraphs: [],
        bullets: [
          "Infrastructure first: Build the page. Set up Stripe. Test the checkout.",
          "Revenue is the only signal: If the website is not making money, the business does not exist yet.",
          "Stop asking, start offering: Do not go on social media to beg. Build a product so valuable the website takes the money automatically.",
        ],
      },
      {
        heading: "The bottom line",
        paragraphs: [
          "Content creation is a luxury for profitable companies. For the rest of us, it is a distraction.",
          "Shut down the apps. Open the code. Do not come back until you have a receipt in your inbox.",
        ],
      },
    ],
    realityCheck:
      "Is your website making money today? No? Then close this tab and go fix your Buy button. Come back when you have revenue.",
    footerCta: {
      intro:
        "We practiced what we preached. The USJET infrastructure is live. The buttons work. Prove the rule by fueling the mission below.",
      links: [
        { label: "Founder's Fuel — $19.90/mo", to: "/founders-fuel" },
        { label: "Direct Fuel — Cash App $USJET", to: "/cash" },
      ],
    },
  },
  {
    slug: "form-c-institutional-shift",
    title: "The Path to $50,000: USJET.AI Officially Enters the Form C Phase.",
    subtitle: "Final pre-SEC window · Institutional shift",
    publishedAt: "2026-05-27",
    cadenceDay: 13,
    excerpt:
      "USJET.AI is finalizing Form C for a regulated community round. Five percent carved out—last window before live investment. First $50,000 in reservations opens the hangar.",
    tags: ["Form C", "Wefunder", "SEC"],
    variant: "institutional",
    body: [],
    manifestoSections: [
      {
        heading: "Beyond founder's fuel",
        paragraphs: [
          "We are moving beyond the Founder's Fuel phase. USJET.AI is currently finalizing its Form C filing to open a regulated community round.",
          "This is the financial boost that puts the USJET app in the hands of every worker in America—not a side project asking for tips, but a publicly registered path with SEC oversight.",
        ],
      },
      {
        heading: "The 5% carve-out",
        paragraphs: [
          "As previously announced, five percent of the company has been carved out for the community round. This is the last window to secure a position before the official live investment phase begins.",
          "Documentation is in motion: officers, cap table, use of funds, and SEC access—filed through the Wefunder Form C protocol.",
        ],
      },
    ],
    institutional: {
      preSecLabel: "Final pre-SEC window",
      equityCarveout: "5% community equity reserved · Form C in progress",
      hangarTitle: "The Hangar is Opening",
      hangarCopy:
        "We are currently seeking the first $50,000 in reservations. This is not just an investment—it is a vote for the American worker. Help us hit the Live button.",
      goalMeterLabel: "$0 of $50,000 reserved",
      useOfFunds: [
        { label: "App development", amount: "$10,000" },
        { label: "AI API & fleet compute", amount: "$20,000" },
        { label: "Legal & Form C filing", amount: "$10,000" },
        { label: "Marketing & launch", amount: "$10,000" },
      ],
      appStoreLine: "Coming soon to the App Store.",
      appStoreSub: "Powered by the Fleet. Owned by You.",
    },
    footerCta: {
      intro: "Infrastructure is live. The filing is real. Choose your lane:",
      links: [
        { label: "Priority waitlist · B2B briefing", to: "/b2b" },
        { label: "Founder's Fuel · $19.90/mo", to: "/founders-fuel" },
      ],
    },
  },
] as const;

export function getBlogPostBySlug(slug: string): UsjetBlogPost | undefined {
  return USJET_BLOG_POSTS.find((post) => post.slug === slug);
}

export function formatBlogDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year!, month! - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Newest first for index. */
export function getBlogPostsNewestFirst(): readonly UsjetBlogPost[] {
  return [...USJET_BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
