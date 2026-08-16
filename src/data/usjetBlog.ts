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
      "usjet.ai is not a brochure. It is a working command surface: fleet runway, member portal, revenue ladder, and AI 101 flight school.",
    tags: ["Platform", "Fleet", "Operators"],
    body: [
      "Visitors often ask what usjet.ai is. Here is the straight answer: it is the sovereign cockpit for a thirty-agent AI fleet, built for operators who run labor-based businesses—shops, logistics, crews, and field ops.",
      "The homepage is the runway. Each bay is a specialist agent with its own logic—not a clone of you, not a generic chatbot. The Hangar holds your workflows. The Member Portal tracks vitals, projects, and fleet activity. Intel surfaces market pulse for cleared operators.",
      "The revenue architecture is intentional: Flight Pass $19.90/mo, Hangar Pro $49.95/mo, and Enterprise Commander $199.99/mo — three clearances into one cockpit.",
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
      preSecLabel: "Community round · Relaunch live",
      equityCarveout: "5% community equity · Live on Wefunder",
      hangarTitle: "The Hangar Relaunch Is Live",
      hangarCopy:
        "The community round is back on Wefunder. Help us hit the $50,000 goal—a vote for the American worker and the 5% Covenant.",
      goalMeterLabel: "Relaunch in progress · $50,000 goal",
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
        { label: "Founder's Fuel · $19.90/mo", to: "/founders-fuel" },
      ],
    },
  },
  {
    slug: "best-computer-for-local-ai-2026",
    title: "Best Computer for Local AI in 2026: A Real Buyer's Guide",
    subtitle: "Home or business — what actually matters when you buy",
    publishedAt: "2026-08-15",
    cadenceDay: 93,
    excerpt:
      "Memory is the wall you hit first, not the chip. Here's how to actually pick a computer for running AI models locally in 2026 — Apple Silicon vs Ryzen AI Max, budget tiers, and home vs business picks.",
    tags: ["AI Computers", "Buyer's Guide", "Local AI", "Ollama"],
    body: [
      "Analysts at IDC and Canalys both expect roughly half of all PCs shipped in 2026 to ship as \u201cAI PCs\u201d \u2014 machines built with a dedicated neural processing unit for on-device inference. That is not a marketing category. It is a real, fast shift away from renting AI by the month toward owning the box it runs on. Local AI means your prompts never leave your machine, there is no subscription clock, and no rate limit throttling you mid-task. The tradeoff is that you have to pick the right hardware, and most buying guides get the priority order backwards.",
      "Here is the order that actually matters: memory first, chip second, brand a distant third. Every local AI model has to fit in memory before it will run at all. A faster chip on an 8GB machine still cannot load a model that needs 24GB \u2014 it just fails, or swaps to disk and crawls. Memory is the wall you hit first, and it is the first spec to check on anything you are considering.",
      "On a Mac, this is simpler than it sounds because Apple Silicon uses unified memory \u2014 system RAM and the chip's graphics memory are the same pool, so a 24GB Mac Mini has a genuine 24GB available for a model, not a small dedicated slice. That is why Apple Silicon has become the default recommendation for local AI despite not being built as an \u201cAI chip\u201d in the marketing sense: the architecture happens to fit the workload. A 16GB Mac Mini or MacBook Air runs 7B\u20138B parameter models (Llama 3.1 8B, Mistral 7B) comfortably through Ollama. Step up to 24GB and 13B\u201314B models fit with room for the OS. A Mac Studio with 36GB or more moves into 30B\u201340B territory and stays there as a daily driver, not an experiment.",
      "On the PC side, the equivalent architecture is AMD's Ryzen AI Max line \u2014 sold as \u201cStrix Halo\u201d in some marketing \u2014 which also uses a unified memory pool shared between CPU and GPU. This is what put mini PCs with 64GB, 96GB, and 128GB of unified memory on the map in 2026, running local models Ollama-style at a fraction of what a discrete-GPU workstation costs. A 32GB Ryzen mini PC (Beelink SER9 Pro, Minisforum UM890 Pro) is a fine 7B\u20138B home starter box, often for less than half the price of the equivalent Mac. A 64GB\u201396GB Ryzen AI Max+ machine (GMKtec EVO-X2, Minisforum MS-A2) comfortably runs 30B\u201340B models. The 128GB tier (Beelink GTR9 Pro and similar) is where 70B-class models become realistic locally, at roughly a third of the cost of the Apple equivalent \u2014 the real reason this chip generation is getting so much attention right now.",
      "If your tooling specifically expects NVIDIA \u2014 vLLM, TensorRT-LLM, or anything built around CUDA rather than Ollama's AMD/Apple-friendly runtime \u2014 that is the one case where a discrete-GPU workstation (RTX 4090/5090 class) is worth the premium over a unified-memory box. For most people running Ollama or LM Studio day to day, it is not necessary.",
      "The other question worth asking honestly is whether you are buying for a person or for a team. A single laptop or Mac Mini is a personal tool — one user, one context, portable if it is a laptop. The moment more than one person needs to talk to the same model, or the machine is expected to stay on and serve a shop or an office over the network, the calculus changes: you want more memory headroom, wired networking, and a machine built to run 24/7 rather than get closed and carried home in a bag.",
      "That is the actual dividing line we use for the two catalogs on this site. The Homes lineup is single-user gear — Mac Mini, MacBook Air and Pro, and budget Ryzen mini PCs — sized for one person running local AI privately at home, no subscription. The Business lineup is higher-memory, multi-user gear — Mac Studio, the 96GB and 128GB Ryzen AI Max+ machines, and workstation-class options — sized for a shop or office where the computer is shared infrastructure, not a personal device.",
      "Either way, the buying process is the same headache: figuring out the right memory tier, sourcing the exact configuration, and not overpaying for headroom you will never use. We do that sourcing and shipping directly — pick the tier that matches how many people are actually going to use it, and we handle the rest.",
    ],
    footerCta: {
      intro: "Pick the catalog that matches the job. Same Operator's Rig. Different machines.",
      links: [
        { label: "Shop Homes", to: "/" },
        { label: "Shop Business", to: "/fleet" },
        { label: "Full lineup", to: "/store/ai-computers" },
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
