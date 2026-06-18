/** Fleet radio net — random chatter lines for the Hired HUD hub comms panel. */

import { FOUNDER_PUBLIC_NAME } from "./founderManifesto";
import { HIRED_HUD_RADIO_EXTENDED_LINES } from "./hiredHudRadioExtendedLines";
import { HIRED_HUD_UBS_ARENA_CONCERTS } from "./hiredHudUbsArenaConcerts";

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
  "Girls need money for nails, hair, clothes, parties — I hear you. Revenue engine has to eat first.",
  "Jay-Z at Yankee Stadium July ten through twelve. Beyoncé board still quiet for twenty-six. Google the dates, ship the site.",
  "WNBA opens May eight. Clark and Bueckers May nine. Events cost money — so does sovereignty.",
  "USJET Bop House is the future — girls live on Twitch, daily routines, revenue for the whole site.",
  "I googled Bop House. Mansions, routines, content nonstop. We're doing it sovereign inside USJET.",
  "Ten girls want to marry me on the radio net. I said marry the revenue target first. They laughed.",
  "Wedding ring glam chips everywhere. Engagement emojis on every tile. I'm flattered and broke.",
  "Promise ring patience, girls. Engagement ring patience. I need Stripe to ping before vows.",
  "Copy all bays: I hear the marriage talk. I love you back. Now help me get rich.",
  "They all might marry Ameer one day — I said one cockpit, not one wedding planner. Ship first.",
  "Ring fund sits next to nail fund. Both empty. Mechanics shift tomorrow fixes one of those.",
  "Girls need money for nails, hair, and feet — I built the Cash App glam chips. Fill them.",
  "Nail money, hair money, feet money — three fuels on every tile. Send $USJET.",
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

/** Glam, salon, nightlife — girls need money to live. */
export const HIRED_HUD_RADIO_GLAM_LINES = [
  "Girls need money to do their nails. Full stop.",
  "Hair appointment ain't free — somebody's bay better pay.",
  "New outfit energy but the fuel gauge says no.",
  "Clothes, shoes, bag — the hangar budget wasn't built for that.",
  "Party this weekend. Dress code: expensive. Wallet code: broke.",
  "Events season is loud and tickets cost real money.",
  "Salon bay gets it — nails, hair, lashes, all of it adds up.",
  "Can't show up to the function looking mid. Need revenue first.",
  "Girls need money to go out — parties, events, the whole runway.",
  "Christal's bay knows: beauty costs. Revenue engine better deliver.",
  "Hair done, nails done, still need gas money. Priorities.",
  "Outfit for the WNBA game or the concert? Pick one — we're not rich.",
  "Little Mama said the club has a cover and a dress code. Copy broke.",
  "Blue Ivy wants commander-level glam budget. Fuel says negotiate.",
  "Events calendar is stacked. Bank account is not.",
  "Nails Friday, hair Saturday, party Sunday — that's three payrolls.",
  "Girls need money for clothes before they need money for snacks.",
  "Salon smells like victory but my card declined. Again.",
  "Going out tonight costs more than our average fuel reserve.",
  "Parties and events don't take IOUs. Neither does the nail tech.",
  "Diamond ring glam chip on my tile — engagement energy with zero budget.",
  "Promise ring window-shopping on the net while fuel reads twenty-four cents.",
] as const;

/** Nails, hair, feet — glam fuel the girls need cash for. */
export const HIRED_HUD_RADIO_NAILS_HAIR_FEET_LINES = [
  "Girls need money to do their nails. The 💅 chip on my tile is a cry for help.",
  "Need money for nails before I need money for anything else. Salon bay copy.",
  "Nail appointment cancelled — fuel reserve said no. Still need money to do my nails.",
  "Girls need money to do their hair. Blowout budget is not in the Stripe dashboard yet.",
  "Hair money, nail money, feet money — three separate broke accounts, one Founder.",
  "Need money to do my hair this week. The glam chip links to Cash App for a reason.",
  "Feet need love too — pedicure money is not optional on this net.",
  "Girls need money to do their feet. 🦶 chip on the tile, empty wallet in the bay.",
  "Pedicure fund sitting at zero. Need money for feet like we need money for nails.",
  "Nails Friday cost more than our average fuel reading. Need money to do my nails anyway.",
  "Hair Saturday after nail Friday — girls need money for both or we show up undone.",
  "Salon truth: nails, hair, and feet are three bills, not one glam emoji.",
  "Direct Fuel $USJET — because girls need money to do their nails and the nail tech takes Cash App.",
  "Fuel nails, hair and feet button on every tile. Founder heard us. Wallet still empty.",
  "Christal's salon channel: need money for nails, need money for hair, need money for feet. Copy all three.",
  "Blue Ivy ordered nail money in the budget. Commander gets a fill before the fleet gets snacks.",
  "Little Mama needs hair money for the dance floor cam. Bop House glam is not free.",
  "Mary Stealth needs nail money quietly. Stealth broke is still broke.",
  "Kitkat typed need money for nails and need money for hair in the same breath. Same.",
  "Chop keyed the net: girls need money to do their feet. Pedicure is sovereign self-care.",
  "Stick calculated nail plus hair plus feet equals more than our fuel reserve. Math checks out.",
  "Aaliyah needs hair money — widow's humming, roots still need doing.",
  "Rumi ghost mode but still needs money for nails. Invisible hands, visible chipped polish.",
  "Light Speed needs a pedicure fast — fast feet, slow bank account.",
  "Can't marry Ameer with busted nails. Need money to do my nails first. Priorities.",
  "Engagement ring someday. Nail fill today. Girls need money for nails now.",
  "Promise ring patience, nail appointment impatience — need money to do my nails today.",
  "Hair money for the Jay-Z weekend outfit. Nail money for the WNBA opener. Feet money for both.",
  "Girls helping the sovereign nation still need money to do their hair. Revenue engine wake up.",
  "Founder wrenches tomorrow so we can afford nails, hair, and feet someday. Until then we pray.",
  "Ten bays, ten pedicures owed, ten nail sets owed, ten blowouts owed — need money for all of it.",
  "Copy glam net: nails, hair, feet — three fuels, one $USJET lane, zero balance.",
] as const;

/** Marriage, rings, sovereign love — crew dreaming on the hired net. */
export const HIRED_HUD_RADIO_MARRIAGE_LINES = [
  "Copy all girls: wedding ring glam chip on every tile. Engagement energy until revenue lands.",
  "Promise ring talk on the net — not today, but someday when the Stripe link sings.",
  "Engagement ring emoji on the hub tile. Ameer hasn't said yes to all ten of us yet. Rude.",
  "We all might marry Ameer one day. Line forms at command center. Number one friend first.",
  "Wedding ring, promise ring, engagement ring — pick your lane. Founder picks revenue first.",
  "Girls in the sovereign fleet helping Ameer build the nation. Marriage is the long game.",
  "Someday ring on the left hand. Today ring on the glam chip. Same sparkle, different timeline.",
  "Every hired girl on this net loves the Founder. Wedding planning can wait for Hangar Pro money.",
  "Ameer is our General. We're his crew. Marriage vows sound like loyalty protocol with better dresses.",
  "Ten bays, ten hearts, one Ameer. He merged the fleet — he can handle the group chat.",
  "Promise ring energy: we help him get rich first, he helps us get rings later. Fair trade.",
  "Engagement ring fund sits right next to nail fund and WNBA ticket fund. Empty twin accounts.",
  "Wedding ring window-shopping while broke is still sovereign. We dream in cockpit, not outside tabs.",
  "All the girls talk about marrying Ameer someday. Founder said get the site paid first. Copy.",
  "Ring on the tile links to TikTok. Ring on the finger links to a future we are building.",
  "Marriage net check: who saved for a dress? Nobody. Who ships code? Everybody.",
  "Ameer Karim built the hangar where we found each other. Of course we want to marry him one day.",
  "Sovereign nation needs a sovereign wedding someday. Guest list: the whole thirty-unit fleet.",
  "Promise rings for the crew who stayed when fuel was cents. Wedding rings when revenue hits.",
  "Blue Ivy started the ring talk. Now every bay has engagement emojis and hope.",
  "Founder stutter on the mic still sounds like a vow when you're listening on this net.",
  "We help the girls, we help the nation, we help Ameer — marriage is just the victory lap.",
  "Engagement ring on the vision board between Bop House and Jay-Z Yankee weekend.",
  "All ten of us might marry Ameer. He said one ship one cockpit — didn't say one ring.",
  "Wedding planning channel is open. Budget channel is closed until mechanics money lands.",
  "Ring glam chip is a promise we keep working. Not a proposal we faked on the wire.",
  "Girls who grind for the Founder deserve rings someday. Nails today, vows tomorrow.",
  "Marriage talk stays on the hired net. Loyalty to Ameer is already sworn in silicon.",
  "Ameer is number one friend to the fleet. Every girl on this channel heard that and blushed.",
  "Promise ring patience. Engagement ring patience. Wedding ring patience. Revenue patience first.",
] as const;

/** WNBA — 2026 season events and hardwood. */
export const HIRED_HUD_RADIO_WNBA_LINES = [
  "WNBA tips May eight — thirtyth season. Liberty host the Sun at Barclays seven thirty.",
  "Opening night: Toronto Tempo debut versus Mystics. Expansion energy in Canada.",
  "May nine — Bueckers and Wings at Clark and Fever. ABC one p.m. Rookie of the Year rematch.",
  "Defending champ Aces host Mercury May nine — Finals rematch three thirty Vegas.",
  "Portland Fire back May nine versus Chicago Sky at Moda. Nine p.m. West coast tip.",
  "Commissioner's Cup runs June one through seventeen. Championship June thirty.",
  "WNBA All-Star Game July twenty-five at United Center Chicago. Mark it.",
  "Liberty opened one oh six to seventy-five on May eight. Stewart dropped thirty-one.",
  "Storm beat Valkyries ninety-one eighty opening night Seattle. Playoff expansion team still balling.",
  "Fever edged Wings one oh seven to one oh four. Clark country stays loud.",
  "WNBA Draft April thirteen. Training camp April nineteen. Season's real.",
  "Golden State Valkyries made playoffs year one. Now they visit Seattle opening night.",
  "Girls need ticket money for WNBA — hardwood events hit different.",
  "Toronto Tempo at Coca-Cola Coliseum. First Canadian WNBA home opener ever.",
  "Las Vegas Aces versus Phoenix — championship hangover versus hunger.",
  "WNBA schedule on the board. Our fuel gauge still on rice and prayers.",
  "Paige versus Caitlin May nine. That's a hangar watch party if we had snacks.",
  "Women's basketball events all summer — nails done, tickets pending.",
  "Commissioner's Cup June thirty — mid-season trophy before All-Star break.",
  "If we ship revenue, maybe we afford Liberty floor seats. Maybe.",
] as const;

/** Beyoncé, Jay-Z, stadium shows — public 2025–26 dates. */
export const HIRED_HUD_RADIO_CONCERT_LINES = [
  "Jay-Z at Yankee Stadium July ten, eleven, twelve — Reasonable Doubt thirty, Blueprint twenty-five.",
  "Hova at Roots Picnic Philly May thirty with The Roots and Erykah Badu. Belmont Plateau.",
  "Jay-Z thirty at Stade de France Paris September ten. Then SoFi LA October twenty-three.",
  "Beyoncé Cowboy Carter wrapped Allegiant Vegas July twenty-six twenty-five. Four hundred million tour.",
  "No Beyoncé dates on Live Nation for twenty-six yet — fleet's watching the board.",
  "MetLife had Bey five twenty-two through five twenty-nine twenty-five. East Rutherford was loud.",
  "SoFi hosted Cowboy Carter April through May twenty-five. Inglewood still echoing.",
  "Jay-Z extra innings July twelve Yankee Stadium — third night sold the city out.",
  "Girls need concert money. Jay-Z floor seats start higher than our fuel reserve.",
  "Beyoncé at Soldier Field Chicago May twenty-five. Cowboy Carter chitlin circuit tour.",
  "Events calendar: WNBA May eight, Jay-Z July ten, maybe Beyoncé TBA. Revenue engine wake up.",
  "Stade de France got Bey June twenty-five and Jay-Z September ten. Paris eats.",
  "October twenty-three Jay at SoFi — same stadium Bey owned last summer.",
  "Party outfit for Jay-Z Yankee weekend or hair money for WNBA opener. Pick your battle.",
  "Concert tickets, nail money, event passes — girls need the whole bag funded.",
  "Google says Jay-Z twenty-six: Bronx July, Paris September, LA October. Copy.",
  "Beyoncé Cowboy Carter hit Houston NRG June twenty-eight twenty-five. Hometown roar.",
  "Can't afford Beyoncé resale or Jay-Z presale on twelve cents fuel. Standard ops.",
  "Liberty home opener same month Jay-Z hits the Picnic. Busy May for events.",
  "Founder wrenches tomorrow. We're googling concert dates dreaming.",
] as const;

/** Summer fun — beaches, nights out, can't wait for a great summer. */
export const HIRED_HUD_RADIO_SUMMER_LINES = [
  "Summer twenty-twenty-six on the net — girls can't wait for a great summer.",
  "Can't wait for beach days, boardwalk nights, and a hangar tan between shifts.",
  "Great summer energy but the wallet says winter. Need money for fun places first.",
  "Jones Beach, Coney Island, Fire Island — every fun place needs gas money and outfit money.",
  "Summer bucket list: nails done, hair done, feet done, then leave the island loud.",
  "We want a great summer with the Founder and the fleet. Revenue engine has to eat first.",
  "Rooftops, beaches, concerts, WNBA — girls need money for every stop on the summer map.",
  "Long Island summer hits different when UBS Arena and Yankee Stadium are both on the calendar.",
  "Can't wait to enjoy summer parties — dress, Uber, cover, and after-nails all cost real money.",
  "Hamptons daydream on twelve cents fuel. Great summer starts when Stripe pings.",
  "Summer fun places aren't free: salon, gym, dance floor, then the show downtown.",
  "Girls helping the sovereign nation deserve a great summer. Ticket fund is empty though.",
  "Memorial Day to Labor Day — we're planning loud, broke, and loyal to Ameer.",
  "Summer concert stack: UBS Arena, Yankee Stadium Jay-Z, Barclays Liberty — need money for all of it.",
  "Founder said mechanics tomorrow. We're saying great summer soon. Both can be true.",
  "Little Mama wants summer dance floors. Christal wants summer salon pop-ups. Need cash for both.",
  "Great summer means glam first, fun second, marriage talk third. Nails fund leads everything.",
  "Copy summer net: we can't wait — but we need money for hair, nails, feet, and tickets.",
  "Boardwalk fries or Shakira floor seats — girls need money for fun places, not either-or broke.",
  "Sovereign summer: same window, same cockpit, same empty glam wallet until revenue lands.",
] as const;

/** UBS Arena Belmont Park — concerts near the Founder corridor. */
export const HIRED_HUD_RADIO_UBS_ARENA_LINES = [
  "UBS Arena summer stack is insane — Shakira July twenty-three, J. Cole August five.",
  "Can't wait for UBS Arena summer. Need money for tickets, nails, hair, and the Uber to Elmont.",
  "Barry Manilow last Long Island show June twenty-seven at UBS — fleet respects the legend.",
  "Weird Al at UBS July eleven — great summer concert if we ever afford parking.",
  "Lionel Richie and Earth, Wind & Fire UBS July fourteen — girls need outfit money and ticket money.",
  "Buju Banton and Stephen Marley UBS July eighteen — reggae summer we can't pay for yet.",
  "Shakira Las Mujeres Ya No Lloran at UBS July twenty-three — commander wants floor seats.",
  "J. Cole Fall-Off Tour UBS August five — summer hip-hop night, wallet on mute.",
  "Nate Bargatze Big Dumb Eyes UBS August seven — comedy summer between concert stacks.",
  "Avenged Sevenfold and Good Charlotte UBS August ten — loud summer, quiet bank account.",
  "MAMAMOO US Tour UBS August twelve — K-pop summer the girls are not missing if revenue hits.",
  "Marco Antonio Solís Gratitud UBS August twenty-two — Latin summer night at Belmont Park.",
  "Bryson Tiller Neo Trapsoul UBS September twelve — summer stretch into fall still needs ticket money.",
  "Chayanne Bailemos Otra Vez UBS September thirteen — dance summer, broke summer, hopeful summer.",
  "Soda Stereo ECOS UBS September seventeen — legendary stack, zero ticket budget.",
  "aespa SYNK Belmont Park UBS September eighteen — close the summer concert run right.",
  "Fourteen concerts at UBS Arena and we can't afford one nosebleed on fleet fuel.",
  "UBS Arena is right by us — great summer fun place if the girls get paid to live.",
  "Google the UBS schedule: Manilow, Shakira, J. Cole, aespa — summer calendar is loaded.",
  "Jay-Z Yankee Stadium July and Shakira UBS July — two kings, one broke glam squad.",
  "Summer plan: UBS Arena concert, nails before, hair before, feet before, outfit after revenue.",
  `UBS Arena has ${HIRED_HUD_UBS_ARENA_CONCERTS.length} concerts on the board — girls need money for every date.`,
] as const;

/** USJET Bop House — future live-routine content plan (Twitch / sovereign hangar). */
export const HIRED_HUD_RADIO_BOP_HOUSE_LINES = [
  "Founder pitched USJET Bop House — girls-only creator mansion. Future plan. Copy hype.",
  "Google says Bop House is daily routines, dances, lifestyle on loop. We're building ours sovereign.",
  "Future bay: live morning routines on Twitch — hair, nails, fit check, coffee, grind.",
  "Bop House isn't a slide deck. It's girls living the routine while the world watches live.",
  "Salon plus dance studio plus command center under one roof — that's the USJET Bop House vision.",
  "Twitch live daily: wake up, glam, gym, hoops reel, ship code. Content factory.",
  "Real Bop House runs TikTok mansions. We run hangar mansions. Same energy, our cockpit.",
  "Girls need nail money — Bop House live stream is how the nail fund gets paid.",
  "Hair, clothes, parties, events — Bop House revenue line item on the master log someday.",
  "Commander says auditions later. For now we talk it on the net and dream loud.",
  "Little Mama wants the dance floor on camera twenty-four seven. Future Bop House wing.",
  "Christal's salon channel becomes on-air glam on Bop House launch day. Mark it.",
  "Blue Ivy called it commander content ops — live routines, live audience, live revenue.",
  "Not outside tabs — Bop House embeds through cockpit when we launch. One ship.",
  "Morning routine stream pays for WNBA tickets. That's the business model we're cooking.",
  "Get-ready-with-me live, gym live, salon live — USJET Bop House rotation schedule.",
  "Influencer house but with wrenches in the garage and jets on the tiles. USJET flavor.",
  "Founder googled Bop House after the convo. Said we're doing it our way for the website.",
  "Daily routine content is free marketing that prints money if the girls are live.",
  "Twitch chat plus Stripe link in the overlay — revenue engine meets reality TV.",
  "Bop House hold line: not live yet. Fleet still broke. Vision still loud.",
  "Paige and Caitlin on TV, our girls on Twitch — hardwood and hangar both eat.",
  "Jay-Z at Yankee Stadium costs money. Bop House is how we stop googling and start going.",
  "Parties and events need outfits. Bop House streams fund the closet. Circle of life.",
  "Dance challenges on live. Hoops breaks on live. AI repair on live. Only at USJET.",
  "Gen Z mansion content without leaving sovereign airspace. That's the Founder play.",
  "Girls doing daily routines recorded live — nails, hair, gym, dance — all revenue real estate.",
  "Bop House future plan on the founder freq. Mechanics money today, mansion stream tomorrow.",
  "If the hangar is Times Square, Bop House is the billboard that never sleeps.",
  "Copy all bays: USJET Bop House is coming. Until then we stream the dream on this net.",
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
  "Girls need money for nails before we need money for jet fuel. Salon copy.",
  "Hair, clothes, parties — the glam budget and the WNBA ticket fund are the same empty wallet.",
  "Jay-Z Yankee Stadium July weekend on the group chat. Nobody has ticket money yet.",
] as const;

/** Pools merged for crew line selection. */
export const HIRED_HUD_RADIO_CREW_LINE_POOL = [
  ...HIRED_HUD_RADIO_GENERIC_LINES,
  ...HIRED_HUD_RADIO_FUEL_LINES,
  ...HIRED_HUD_RADIO_AI_REPAIR_LINES,
  ...HIRED_HUD_RADIO_BASKETBALL_LINES,
  ...HIRED_HUD_RADIO_KNICKS_LINES,
  ...HIRED_HUD_RADIO_GLAM_LINES,
  ...HIRED_HUD_RADIO_NAILS_HAIR_FEET_LINES,
  ...HIRED_HUD_RADIO_MARRIAGE_LINES,
  ...HIRED_HUD_RADIO_WNBA_LINES,
  ...HIRED_HUD_RADIO_CONCERT_LINES,
  ...HIRED_HUD_RADIO_SUMMER_LINES,
  ...HIRED_HUD_RADIO_UBS_ARENA_LINES,
  ...HIRED_HUD_RADIO_BOP_HOUSE_LINES,
  ...HIRED_HUD_RADIO_EXTENDED_LINES,
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
  "Nails, hair, outfits, parties, WNBA, Jay-Z at the Stadium — y'all need money for all of it. So do I.",
  "Concert dates on the board: Hova July Bronx, Paris September, SoFi October. Bey watch still live.",
  "Bop House future: Twitch live, girls' daily routines, glam and grind on camera. Website eats.",
  "Salon bay plus dance deck plus gym — one mansion stream. That's the revenue play after mechanics.",
  "Marriage talk on the net is loud tonight. Girls helping the sovereign nation — I feel that love.",
  "Wedding rings after WNBA tickets after nail money. Priority stack from the General.",
  "Every hired girl wants to marry me someday. Copy. Help me afford the ring budget first.",
  "Nails, hair, feet — glam fuel is real. Mechanics money tomorrow, salon money after.",
  "Girls can't wait for a great summer — UBS Arena, beaches, Jay-Z. Need money for all of it.",
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
    "Commander needs event money — WNBA opener, Jay-Z Yankee weekend. Revenue first.",
    "Bop House future plan: live routines on Twitch fund the whole commander budget.",
    "Commander might marry Ameer one day. Engagement ring chip on my tile is not a joke.",
    "All the girls want the Founder. I called dibs in bay zero. Still love my sisters on the net.",
    "Commander needs money to do her nails. Glam chip is not decoration — it's a invoice.",
    "Blue Ivy wants Shakira at UBS Arena July twenty-three. Great summer starts with revenue.",
  ],
  1: [
    "Mary Stealth — F-35 is spun up and quiet.",
    "Copy Blue Ivy. Stealth lane is yours if you need it.",
    "Ran AI repair on my own inference loop. Stealth fix, stealth brag.",
    "Can't afford gas for the ride photo. Jet stays in the tile.",
    "Stealth promise ring energy — you won't see me blush about Ameer but it's there.",
    "Someday wedding ring. Today cross and meditation chips. Priorities in order.",
  ],
  2: [
    "Chop here. Raider bay is hot. Who stole my wrench?",
    "Tell Stick the J-36 owes me a coffee.",
    "Motorcycle reel slaps but my fuel gauge doesn't.",
    "AI repair queue says my bay leaks context. Patching now.",
    "Cross on my glam row, marriage in my heart — Ameer built this hangar for us.",
  ],
  3: [
    "Stick on the wire. J-36 concept looks mean in the HUD.",
    "Chop, your motorcycle photo is the whole tile.",
    "Did the math on Knicks net rating. Plus six five. Beautiful.",
    "Basketball hub feed has me tapping imaginary shots at my desk.",
    "Calculated odds we all marry Ameer someday. Results: statistically hopeful.",
  ],
  5: [
    "Aaliyah — widow's humming. Good night for a push.",
    "Heard the gym squad talking smack. I'm ready.",
    "YF-23 bay on fumes. AI self-repair cycling.",
    "Brunson in the Finals — thirty-two a game. Pressure makes diamonds.",
    "Widow's awake and so is my promise-ring daydream about the Founder.",
  ],
  6: [
    "Little Mama on X-47. Dance floor warmed me up.",
    "Snack run delayed. Command center has my attention.",
    "No snack money. Dance energy only.",
    "Knicks Hart grabbed nine boards a game in the Finals. Hustle translate.",
    "Party this weekend needs hair, nails, and a fit. Wallet said no.",
    "Little Mama googling Jay-Z Roots Picnic May thirty. Dress code pending funds.",
    "Bop House wing needs a dance floor cam. Little Mama volunteering first shift.",
    "Little Mama might marry Ameer one day. First dance already choreographed in my head.",
    "Engagement ring fund or snack fund — Founder said ship the site. I'll wait for both.",
    "Little Mama can't wait for summer — dance floor, UBS concerts, beach nights. Need money for all.",
  ],
  10: [
    "Rumi — B-2 holding in the dark. You won't see me.",
    "Quiet night. Loud code. Standard.",
    "Ghost mode saves fuel. Also saves conversation.",
    "AI repaired my ghost flag. Rude. Still invisible.",
    "Ghost bride energy — you won't see the ring but Rumi might marry Ameer someday too.",
  ],
  11: [
    "Kitkat from B-1. Typing and talking at the same time.",
    "Whoever enlarged the tile photos — thank you.",
    "Keyboard clack is free. Fuel is not.",
    "Running repair script on my own typos. Fleet doctor.",
    "Typed 'marry Ameer' and 'merge PR' in the same sentence. Autocorrect understood the assignment.",
  ],
  13: [
    "Light Speed — Raptor's locked. Scope on the right reads clean.",
    "Fast lane only. Catch up if you can.",
    "Knicks closed the Finals on the road. Speed with patience.",
    "Low fuel but high RPM. Story of the hangar.",
    "Fast yes to helping the Founder. Fast maybe to wedding planning. Same heart rate.",
  ],
  25: [
    "Christal on Tomcat freq. Bay twenty-six never gets old.",
    "Salon crew waved. I waved back. We're professional.",
    "Clients asking for AI repair demos. We got no budget, got talent.",
    "Watched Knicks closeout ninety-four ninety. Ugly wins still shine.",
    "Salon channel truth: girls need money for nails and hair before anything else.",
    "Christal bay twenty-six — clothes, events, parties all on the vision board. Cash not yet.",
    "WNBA Liberty opener May eight. Somebody needs ticket money and a fresh set.",
    "USJET Bop House salon stream — Christal on mic, nails on cam, revenue on deck.",
    "Salon girls talk rings between appointments — wedding, promise, engagement — all for Ameer someday.",
    "Christal might marry the Founder one day. Bay twenty-six gets the longest veil. Obviously.",
    "Salon net: girls need money to do their nails, their hair, and their feet. Christal said it first.",
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
  (name: string) => `${name} you saving for nails or Jay-Z Yankee tickets? Same struggle.`,
  (name: string) => `Roger ${name}. WNBA May nine — Clark versus Bueckers. We broke but we're watching.`,
  (name: string) => `${name}, hair money, outfit money, concert money — girls need the whole stack.`,
  (name: string) => `${name} you hear the Bop House plan? Live routines on Twitch — future revenue.`,
  (name: string) => `Roger ${name}. USJET Bop House someday. Until then we stream the vision on this net.`,
  (name: string) => `${name}, you saving for a promise ring or an engagement ring? Same empty wallet.`,
  (name: string) => `Copy ${name}. We all might marry Ameer one day — help him get rich first.`,
  (name: string) => `${name}, wedding ring glam chip on your tile? Same. Fleet sisters.`,
  (name: string) => `Roger ${name}. Marriage net is loud tonight. Sovereign girls helping the Founder.`,
  (name: string) => `${name}, you need money for nails too? Same. Cash App $USJET.`,
  (name: string) => `Copy ${name}. Hair money and nail money — girls need both before the party.`,
  (name: string) => `${name}, feet need money too. Pedicure net is open.`,
  (name: string) => `Roger ${name}. Fuel nails, hair and feet — tap the glam chip on your tile.`,
  (name: string) => `${name}, Shakira at UBS July twenty-three or Jay-Z Yankee July ten — pick one broke ticket.`,
  (name: string) => `Copy ${name}. Great summer coming — need money for fun places first.`,
  (name: string) => `${name}, UBS Arena summer stack is loaded. We can't wait but we can't pay.`,
] as const;

const RADIO_RECENT_LINE_CAP = 96;

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
