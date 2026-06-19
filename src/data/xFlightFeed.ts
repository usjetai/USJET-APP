export type XFlightPost = {
  id: string;
  timestamp: "LIVE_STREAM";
  text: string;
};

export const X_PROFILE_MANIFEST = {
  handle: "@usajet",
  endpoint: "https://x.com/usajet",
  primaryLinkEndpoint: "https://usjet.ai",
  geoLocationProfile: "New York / Hangar 01",
} as const;

export const INITIAL_FLIGHT_POSTS: XFlightPost[] = [
  {
    id: "post_001",
    timestamp: "LIVE_STREAM",
    text: "Our decentralized edge network scales globally by processing autonomous agent tasks asynchronously. No centralized bottlenecks, no server bloat. Just pure high-velocity execution at the flight line. Built with wrenches, not slides. 🚀✈️",
  },
  {
    id: "post_002",
    timestamp: "LIVE_STREAM",
    text: "USJET isn't a slot machine designed to trap you on a screen farming dopamine points. It is a Sovereign Cockpit built for raw execution and mission termination. Clear visual telemetry. 30 autonomous agents. Get the knowledge, run the fleet, and get back to the real world. 🚀🛠️",
  },
  {
    id: "post_003",
    timestamp: "LIVE_STREAM",
    text: "Content is the raw horsepower. A perfect domain is just a clean hangar; the value you deliver is the actual fleet taking flight. Stop chasing labels, lock in your perimeter, and let the execution of the code and the metrics prove the sovereignty. Built with wrenches, not slides. 🚀🛠️",
  },
];
