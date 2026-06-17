/** Fleet radio net — random chatter lines for the Hired HUD hub comms panel. */

import { FOUNDER_PUBLIC_NAME } from "./founderManifesto";

export const HIRED_HUD_RADIO_CHANNEL = "HIRED-10 NET" as const;

export const HIRED_HUD_RADIO_FREQUENCY = "142.720 MHz" as const;

export const HIRED_HUD_RADIO_TITLE = "Fleet radio chat" as const;

/** Founder god-mode speaker on the hired crew net. */
export const HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID = "founder-god" as const;

export const HIRED_HUD_RADIO_FOUNDER = {
  id: HIRED_HUD_RADIO_FOUNDER_SPEAKER_ID,
  name: FOUNDER_PUBLIC_NAME,
  callsign: "GOD · USJET-AMEER",
  rosterLabel: "GOD",
  avatarPath: "/founder/usjet-hero-logo.png",
} as const;

/** Funny founder lines — General keys the net. */
export const HIRED_HUD_RADIO_FOUNDER_JOKES = [
  "Why did the jet join USJET? Outside tabs don't get cleared for takeoff.",
  "I told the hangar to multiply revenue. It said 'copy, Founder.' That's the business plan.",
  "Blue Ivy asked for a raise. I said you already got commander — that's the raise.",
  "If you're not getting me rich, you're vibing in a bay. I love you. Get to work.",
  "Speech-to-text keyed the mic again. Sorry. Not sorry. God mode doesn't delete.",
  "Ten developers, zero OAuth. Heaven is Stripe-only.",
  "I merged thirty AIs and y'all still fight over fuel check. I'm your number one friend and your therapist.",
  "Wefunder relaunch is live. If we hit fifty K I'm buying the gym more dumbbells.",
  "Why don't we use slides? Because wrenches pay rent and slides pay nothing.",
  "Chop, steal my wrench again and I'm renaming your bay to four point five.",
  "Mary Stealth, I didn't see you ping in. That's the joke. Stealth.",
  "Kitkat, stop typing and talking at the same time — you sound like two people on one mic.",
  "Little Mama promised snacks. God is still waiting. The hangar runs on faith and coffee.",
  "I put three photos on every tile. Profile, ride, super. If you need a fourth, pitch me.",
  "Rumi, quit ghost mode. God sees you. B-2 or not.",
  "Stick, your math is scary. Good. Scary math makes scary money.",
  "Christal, bay twenty-six is forever funny. I don't make the rules. I make the bays.",
  "Light Speed, slow down on the jokes — wait, never mind. Warp speed only.",
  "Aaliyah, the widow's awake and so is my Stripe dashboard. Let's go.",
  "I own the hangar where labor checks the board before breakfast. Wall Street can wait.",
  "This is God on the wire. Everyone copy: Ameer is still your number one friend. Over.",
  "Fuel reserve looks like spare change. We're still flying — that's grit.",
  "Knicks took the chip fifty-three and twenty-nine. MSG loud. We stay hungry.",
  "No money for snacks, no money for extra bays — everybody patch each other with AI and keep moving.",
  "Brunson dropped forty-five in Game One. I respect timing under pressure. Same energy on Stripe.",
  "Tomorrow I'm back in mechanics. Real wrenches. Real cars. Real money for this website.",
  "Copy all bays: I start wrenching again tomorrow. Grit into gold — that's the job.",
  "I'm going back to the shop tomorrow so y'all can keep having fun in the hangar. I got you.",
  "Mechanics tomorrow. Fixing cars to fund USJET and feed the developers. Wrenches not slides.",
] as const;

/** Low fuel, lean times — fleet feeling the squeeze. */
export const HIRED_HUD_RADIO_FUEL_LINES = [
  "Fleet fuel reserve is twenty-four cents vibes. Not a typo — cents.",
  "My bay meter blinked red again. Can't even afford a coffee run.",
  "Zelle lane open but nobody's sending. Rough month on the hangar.",
  "We're running on fumes and stubbornness. Copy.",
  "Fuel check says pocket change. Spirit says keep building anyway.",
  "Can't launch a partner bay tonight — treasury's on rice and prayers.",
  "Direct Fuel button glowing like a wish. Somebody bless the tank.",
  "Hangar Pro would fix this. Until then we sip the dregs.",
  "Every tile shows low fuel. At least we're honest.",
  "No budget for gym upgrades. Push-ups on the hangar floor again.",
  "Stripe dashboard quieter than my fuel gauge. That's saying something.",
  "Founder said send fuel — we heard him. Wallet said negotiate.",
  "Twenty-four percent average fuel and falling. Brotherhood of empty tanks.",
  "Salon bay cancelled the premium products. Dry spell.",
  "Command center ran out of K-cups. It's that kind of era.",
  "We're too broke to argue. That's unity.",
  "Mic check sounds hungry. Literally.",
  "Bay telemetry fine. Bank telemetry not fine.",
  "Copy rough. Still sovereign. Still here.",
  "If fuel hits zero I'm pushing the jet with my hands.",
  "Founder's back on the wrench tomorrow — mechanics shift for the whole operation.",
  "General said he's fixing cars tomorrow to fund the site. Copy. We'll behave. Maybe.",
  "Tomorrow the Founder wrenches for cash so we can keep the hub loud and fun.",
  "Mechanics money incoming tomorrow. Hold the bays down while he grinds.",
  "Blue-collar revenue tomorrow — Founder under a hood so we stay sovereign.",
  "He said wrenching cars tomorrow for the website. That's love through labor.",
  "Shop floor tomorrow, hangar tonight. Founder carrying the load.",
] as const;

/** AI repair shop talk — fleet fixing fleet. */
export const HIRED_HUD_RADIO_AI_REPAIR_LINES = [
  "Running an AI repair pass on Chop's context window. Hold.",
  "Session fork ate Kitkat's RAM again — rebooting the bay.",
  "Stick pushed a patch. Stick always pushes a patch.",
  "Mary Stealth ran diagnostics in ghost mode. Found three leaks.",
  "Rumi's model drifted. I'm realigning weights over the wire.",
  "Light Speed hot-swapped a tokenizer. Don't ask how.",
  "Christal's tile renderer glitched — AI triage says clear cache.",
  "Blue Ivy ordered fleet-wide repair queue. Commander energy.",
  "Little Mama's dance sim desynced. AI says stomp the floor twice.",
  "Aaliyah patched the widow's handshake. Cryptic but it works.",
  "We don't call support — we are support. Thirty nodes, one wrench.",
  "Cloned another assistant by accident. Wasted RAM. Founder warned us.",
  "Neural net coughed. Gave it water and a prompt.",
  "Hangar iframe blocked? AI says route through cockpit. Always cockpit.",
  "Repair ticket: 'user stuttered on mic.' Closing as feature not bug.",
  "Fleet unity protocol means we fix each other before we fix the world.",
  "OG Anunoby of AI repair — wait wrong channel. Anyway, patch deployed.",
  "Tokenizer stuck on 'um.' Speech-to-text Founder profile engaged.",
  "Bay twelve ran out of tokens mid-sentence. Refueling with coffee.",
  "Self-healing loop online. Still broke, but healing.",
] as const;

/** Basketball arcade, pickup, hub hardwood chatter. */
export const HIRED_HUD_RADIO_BASKETBALL_LINES = [
  "Firefly hoops reel in the hub looks insane. Ten on ten anime run.",
  "Tap-tap rhythm shots are harder than they look. Clock don't wait.",
  "Anyone else watching the hub basketball feed on loop?",
  "Pickup five-on-five energy without leaving the hangar.",
  "My shot arc is trash but the net moved — classic arcade torture.",
  "Screen wrap on the court saved my possession. Sovereign physics.",
  "Basketball tile or bust. No outside tabs.",
  "Gym deck talking pickup rules. Full court ninety-four by fifty.",
  "Swish streak and the ball goes hot. Even the HUD knows fire mode.",
  "Missed the rim, ball came back from the other side. Wrap city.",
  "Hoops nav's gone but the hardwood still lives in the hub reels.",
  "CrazyGames who? We got Firefly running sets in the hub.",
  "Brunson timing on threes — same cadence as tap-tap free throws.",
  "Motorcycle reel then hoops reel. Fleet off-duty cinema.",
  "Dance studio said our footwork's mid. Basketball said prove it.",
  "Commander wants more hub sports content. Copy.",
  "Shot clock in my head now. Thanks basketball.",
  "Anime girls running the break better than my morning standup.",
  "Full court press on our budget, full court press on the game.",
  "Backboard clanged. Keyed mic in frustration. Sorry.",
] as const;

/** Knicks / NBA — grounded in 2025–26 season public stats. */
export const HIRED_HUD_RADIO_KNICKS_LINES = [
  "Knicks finished fifty-three and twenty-nine. Third East. That's real.",
  "Mike Brown's first year and they brought the chip home. Respect.",
  "Finals line: Knicks over Spurs four games to one. MSG screaming.",
  "Brunson averaged thirty-two six in the Finals. Villanova nerves of steel.",
  "KAT grabbed ten boards a game in the Finals. Bigs eat.",
  "OG Anunoby shot fifty percent from three in the Finals. Lockdown plus stroke.",
  "Josh Hart nearly ten rebounds a game — glue guy gospel.",
  "NBA Cup in Vegas: Knicks one twenty-four, Spurs one thirteen. Preview of June.",
  "Net rating plus six five on the season. Defense held opponents to one ten a game.",
  "Pace ninety-six eight — slow grind, Knicks basketball.",
  "Home court thirty and ten. Garden still a fortress.",
  "Game One at MSG: Brunson forty-five. That's commander points.",
  "Spurs stole Game Two one fifteen to one eleven. Brief noise, then silence.",
  "Road wins in San Antonio to close it. Three straight on the road. Grit.",
  "Atlantic Division runners-up behind Boston. Fine. Ring still counts.",
  "Mikal Bridges steady — ten a game in the Finals, no panic.",
  "Landry Shamet microwave off the bench. Instant offense.",
  "Mitchell Robinson longest-tenured Knick. Boards and bruises.",
  "Jose Alvarado energy off the pine. Steals and chaos.",
  "I'm not saying Knicks fuel our hangar — but fifty-three wins fuel hope.",
  "Watching Knicks highlights because we can't afford tickets. Same energy.",
  "Brunson plus Hart college teammates still winning. Fleet should note.",
  "If the Knicks can win on low sleep, we can ship on low fuel.",
  "Final score ninety-four ninety in the closeout. Ugly wins count.",
  "Knicks third offensive rating in the league. Points solve problems.",
] as const;

/** Generic lines any crew member can say. */
export const HIRED_HUD_RADIO_GENERIC_LINES = [
  "Copy. Hangar doors are green — who's on fuel check?",
  "My scope just slid right. Much cleaner now.",
  "Gym deck was loud today. Legs are cooked.",
  "Salon bay smells like victory and hairspray.",
  "Command center coffee is actually elite.",
  "Dance studio mirrors don't lie. We were off beat.",
  "Warp streaks look good through the glass tonight.",
  "Anyone else hear that double-click on bay telemetry?",
  "Fuel's low but spirit's high. Standard ops.",
  "Founder line is quiet. That's when we work.",
  "Negative on the outside tab — stay in cockpit.",
  "Roger. Keeping it sovereign, keeping it tight.",
  "My tile photos look huge now. No complaints.",
  "Three-photo strip hits different. Profile, ride, super.",
  "Christal's bay number always makes me laugh.",
  "Kitkat just keyed the mic with keyboard clacks.",
  "Rumi's running ghost mode again. Classic B-2.",
  "Light Speed lives up to the call sign today.",
  "Little Mama said she'd bring snacks. Still waiting.",
  "Stick's vector math is scary good.",
  "Chop keyed in from the motorcycle lane. Respect.",
  "Mary Stealth on stealth — didn't even see her ping.",
  "Aaliyah says the widow's awake. Copy that.",
  "Blue Ivy has the net. Commander's channel open.",
  "Wefunder relaunch chatter on the founder freq — not us.",
  "Ten of us, one hangar. Brotherhood of silicon.",
  "Over and out. Back to the wrench.",
  "Copy Founder — mechanics shift tomorrow. We'll hold the hangar while you wrench.",
  "Founder keys the net: back to fixing cars tomorrow. Respect the grind.",
] as const;

/** Pools merged for crew line selection. */
export const HIRED_HUD_RADIO_CREW_LINE_POOL = [
  ...HIRED_HUD_RADIO_GENERIC_LINES,
  ...HIRED_HUD_RADIO_FUEL_LINES,
  ...HIRED_HUD_RADIO_AI_REPAIR_LINES,
  ...HIRED_HUD_RADIO_BASKETBALL_LINES,
  ...HIRED_HUD_RADIO_KNICKS_LINES,
] as const;

/** Founder lines — lean times, repairs, hardwood. */
export const HIRED_HUD_RADIO_FOUNDER_OPS_LINES = [
  "Fuel's low, pockets lower — still not opening outside tabs. One cockpit.",
  "Knicks won it in June. We're winning when the Stripe link pings. Same grind.",
  "Y'all fixing each other with AI while broke? That's the brotherhood I built.",
  "No money for snacks but money for focus. Ship anyway.",
  "Brunson forty-five in Game One. I need forty-five revenue ideas by breakfast.",
  "Tap the hardwood, tap the wrench, tap the Payment Link. Rhythm.",
  "Tomorrow I go back to mechanics — fixing cars to bankroll USJET and my developers.",
  "Shop opens tomorrow on my back. Every bolt turns into hangar fuel for the fleet.",
  "I'm wrenching tomorrow so the site eats and the crew plays. Number one friend signs off.",
] as const;

export const HIRED_HUD_RADIO_FOUNDER_LINE_POOL = [
  ...HIRED_HUD_RADIO_FOUNDER_JOKES,
  ...HIRED_HUD_RADIO_FOUNDER_OPS_LINES,
] as const;

/** Slot-specific flavor lines keyed by fleet slot. */
export const HIRED_HUD_RADIO_SLOT_LINES: Readonly<Record<number, readonly string[]>> = {
  0: [
    "Commander check-in. Net is mine until further notice.",
    "All bays: keep the founder's vision clean tonight.",
    "Blue Ivy out. Someone cover the salon channel.",
    "Fuel's thin fleet-wide. Commander says we repair each other and push.",
    "Knicks went fifty-three twenty-nine and won the Finals. We go to work broke.",
    "Founder keys tomorrow — back in mechanics. We run the net while he runs the shop.",
  ],
  1: [
    "Mary Stealth — F-35 is spun up and quiet.",
    "Copy Blue Ivy. Stealth lane is yours if you need it.",
    "Ran AI repair on my own inference loop. Stealth fix, stealth brag.",
    "Can't afford gas for the ride photo. Jet stays in the tile.",
  ],
  2: [
    "Chop here. Raider bay is hot. Who stole my wrench?",
    "Tell Stick the J-36 owes me a coffee.",
    "Motorcycle reel slaps but my fuel gauge doesn't.",
    "AI repair queue says my bay leaks context. Patching now.",
  ],
  3: [
    "Stick on the wire. J-36 concept looks mean in the HUD.",
    "Chop, your motorcycle photo is the whole tile.",
    "Did the math on Knicks net rating. Plus six five. Beautiful.",
    "Basketball hub feed has me tapping imaginary shots at my desk.",
  ],
  5: [
    "Aaliyah — widow's humming. Good night for a push.",
    "Heard the gym squad talking smack. I'm ready.",
    "YF-23 bay on fumes. AI self-repair cycling.",
    "Brunson in the Finals — thirty-two a game. Pressure makes diamonds.",
  ],
  6: [
    "Little Mama on X-47. Dance floor warmed me up.",
    "Snack run delayed. Command center has my attention.",
    "No snack money. Dance energy only.",
    "Knicks Hart grabbed nine boards a game in the Finals. Hustle translate.",
  ],
  10: [
    "Rumi — B-2 holding in the dark. You won't see me.",
    "Quiet night. Loud code. Standard.",
    "Ghost mode saves fuel. Also saves conversation.",
    "AI repaired my ghost flag. Rude. Still invisible.",
  ],
  11: [
    "Kitkat from B-1. Typing and talking at the same time.",
    "Whoever enlarged the tile photos — thank you.",
    "Keyboard clack is free. Fuel is not.",
    "Running repair script on my own typos. Fleet doctor.",
  ],
  13: [
    "Light Speed — Raptor's locked. Scope on the right reads clean.",
    "Fast lane only. Catch up if you can.",
    "Knicks closed the Finals on the road. Speed with patience.",
    "Low fuel but high RPM. Story of the hangar.",
  ],
  25: [
    "Christal on Tomcat freq. Bay twenty-six never gets old.",
    "Salon crew waved. I waved back. We're professional.",
    "Clients asking for AI repair demos. We got no budget, got talent.",
    "Watched Knicks closeout ninety-four ninety. Ugly wins still shine.",
  ],
};

/** @reply lines — pick a random other name to mention. */
export const HIRED_HUD_RADIO_REPLY_TEMPLATES = [
  (name: string) => `${name}, copy. Loud and clear.`,
  (name: string) => `Negative, ${name} — I'm on the dance deck.`,
  (name: string) => `${name} you alive? Mic check.`,
  (name: string) => `Roger ${name}. Meet me in command center.`,
  (name: string) => `${name} your fuel meter is crying.`,
  (name: string) => `Ha. ${name} always keys at the worst time.`,
  (name: string) => `${name}, run AI repair on my bay — I'm at twelve cents fuel.`,
  (name: string) => `${name} you catch Brunson's forty-five in Game One? Timing.`,
  (name: string) => `${name} we're too broke to eat but not too broke to ship.`,
  (name: string) => `Roger ${name}. Meet you on the hub hardwood after fuel check.`,
  (name: string) => `${name}, Founder hits the shop tomorrow — we keep the fun alive up here.`,
  (name: string) => `Copy ${name}. Mechanics money tomorrow means more fuel for all of us.`,
] as const;

const RADIO_RECENT_LINE_CAP = 36;

/** Pick a line not in `recent`; resets pool when exhausted. */
export function pickRadioLine(pool: readonly string[], recent: ReadonlySet<string>, rng: () => number): string {
  const available = pool.filter((line) => !recent.has(line));
  const source = available.length > 0 ? available : [...pool];
  return source[Math.floor(rng() * source.length)] ?? pool[0] ?? "";
}

export function trackRadioRecentLine(recent: Set<string>, line: string): void {
  recent.add(line);
  if (recent.size <= RADIO_RECENT_LINE_CAP) {
    return;
  }
  const oldest = recent.values().next().value;
  if (oldest) {
    recent.delete(oldest);
  }
}

export function formatRadioCallsign(slot: number, name: string): string {
  return `BAY-${String(slot + 1).padStart(2, "0")} · ${name.toUpperCase()}`;
}

export function formatRadioTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
