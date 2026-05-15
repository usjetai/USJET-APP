/** Direct Fuel — Cash App reciprocity wall (/cash). */

import { USJET_CASH_APP_CASHTAG, USJET_CASH_APP_URL } from "../lib/usjetContact";

export const DIRECT_FUEL_ROUTE = "/cash" as const;

export const DIRECT_FUEL_TITLE = "Direct Fuel: Power the Fleet. Get Recognized." as const;

export const DIRECT_FUEL_TAGLINE = "Patron of the fleet · Day Zero reciprocity" as const;

export const DIRECT_FUEL_HOOK =
  "Don't just watch the revolution—fuel it. When you send fuel directly via Cash App, you aren't a customer; you're a Patron of the Fleet. In return, we put your name and your Cash App handle on our permanent First Responders Wall so the world knows you were here on Day Zero." as const;

export const DIRECT_FUEL_IMPACT =
  "Every dollar sent to $USJET goes directly into the Engine Room—paying for the servers, the GPUs, and the 15-hour dev sessions required to build the future of labor." as const;

export const DIRECT_FUEL_RECOGNITION =
  "When you send a Cash App, include your handle in the note. We will post your Cash App on our Supporter Wall. As USJET.AI scales to millions, the latecomers will look to the early supporters for inspiration—and they might just fuel you back for being a pioneer." as const;

export const DIRECT_FUEL_TRANSPARENCY =
  "No corporate middleman. Just a Founder, a Fleet, and the people who believe in the mission." as const;

export const DIRECT_FUEL_INCENTIVE =
  "Why would latecomers Cash App you? Because the USJET community rewards loyalty. By being a First Responder, you secure your spot in the ecosystem's history. When the big money moves in, they'll be looking for the people who had the vision first." as const;

export const DIRECT_FUEL_CTA_LABEL = "Send Fuel to $USJET" as const;

export { USJET_CASH_APP_CASHTAG, USJET_CASH_APP_URL };

export const DIRECT_FUEL_WALL_TITLE = "The First Responders" as const;

export const DIRECT_FUEL_WALL_SUB =
  "Early patrons posted here. Include your Cash App handle in your fuel note to claim your tile." as const;

/** Placeholder wall entries until live submissions are wired. */
export const DIRECT_FUEL_WALL_PLACEHOLDERS = [
  { handle: "@EarlyAdopter", message: "fueled the fleet on Day Zero" },
  { handle: "@ShopOwner123", message: "sent 10 gallons of code" },
  { handle: "@QueensOperator", message: "kept the GPUs hot" },
  { handle: "@Bay07Patron", message: "Semper Fi — fuel received" },
  { handle: "@LateShiftDev", message: "funded a 15-hour sprint" },
  { handle: "@FleetBeliever", message: "first responder locked" },
] as const;
