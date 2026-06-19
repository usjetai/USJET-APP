/** Full-site flight deck index — side latch menu source of truth. */

import { ORIGIN_CS_ROUTE } from "../lib/memberAccessLevel";
import { CODE_KIT_ROUTE } from "./codeKit499";
import { FLEET_MANUAL_ROUTE } from "./fleetManual2500";
import { MOBILE_LANDSCAPE_ROUTE } from "./mobileLandscapeGuide";
import { PROTOCOL_SESSION_PROOF_ROUTE } from "./protocolSessionProof";
import { SOVEREIGN_VAULT_ROUTE } from "./sovereignBlueprint100k";

export type SiteRouteEntry = {
  path: string;
  label: string;
  hint?: string;
};

export type SiteRouteGroup = {
  id: string;
  title: string;
  routes: readonly SiteRouteEntry[];
};

export const SITE_ROUTE_GROUPS: readonly SiteRouteGroup[] = [
  {
    id: "command",
    title: "Command deck",
    routes: [
      { path: "/", label: "Fleet", hint: "Runway" },
      { path: "/hired-hud", label: "USJET House", hint: "Live roster monitor" },
      { path: "/hangar", label: "Hangar", hint: "Workbench" },
      { path: "/intel", label: "Intel", hint: "Pulse board" },
      { path: "/origin", label: "Origin", hint: "Aura command" },
    ],
  },
  {
    id: "founder-member",
    title: "Founder & member",
    routes: [
      { path: "/founder", label: "Founder", hint: "Story" },
      { path: "/founder-special-1995", label: "1995 Grit Vault" },
      { path: "/special", label: "Founder Special", hint: "Tier checkout" },
      { path: "/member/login", label: "Member Login" },
      { path: "/member", label: "Member Portal" },
    ],
  },
  {
    id: "jetfighter",
    title: "Jet fighter",
    routes: [{ path: "/fleet-directory", label: "Jet Fighter Directory", hint: "30 call signs" }],
  },
  {
    id: "revenue",
    title: "Revenue ladder",
    routes: [
      { path: "/founders-fuel", label: "Founder's Fuel", hint: "$19.90/mo" },
      { path: CODE_KIT_ROUTE, label: "Code Kit" },
      { path: FLEET_MANUAL_ROUTE, label: "Fleet Manual", hint: "2.5K" },
      { path: SOVEREIGN_VAULT_ROUTE, label: "Sovereign Protocol", hint: "100K" },
    ],
  },
  {
    id: "partners",
    title: "Partners & growth",
    routes: [
      { path: "/b2b", label: "B2B Enterprise" },
      { path: "/b2k", label: "B2K" },
      { path: "/pdre", label: "PDRE Gateway" },
      { path: "/licensing", label: "Brand Licensing" },
      { path: "/support-fleet", label: "Support the Fleet" },
      { path: "/intelligence", label: "Intelligence Assets" },
      { path: "/strategic-assets", label: "Strategic Assets" },
      { path: "/sovereignty", label: "Sovereignty" },
    ],
  },
  {
    id: "ops",
    title: "Ops & flight school",
    routes: [
      { path: "/ai-101", label: "AI 101" },
      { path: "/sos", label: "SOS" },
      { path: "/privacy", label: "Privacy" },
      { path: PROTOCOL_SESSION_PROOF_ROUTE, label: "Protocol Proof" },
      { path: MOBILE_LANDSCAPE_ROUTE, label: "Landscape Guide" },
    ],
  },
  {
    id: "gaming",
    title: "Gaming",
    routes: [
      { path: "/gaming", label: "VR Gaming" },
      { path: "/hoops", label: "Jet Hoops", hint: "Basketball arcade" },
      { path: "/gamers", label: "Gamers Hub" },
    ],
  },
  {
    id: "fuel",
    title: "Direct fuel",
    routes: [
      { path: "/cash", label: "Cash App Fuel" },
      { path: "/zelle", label: "Zelle Fuel" },
    ],
  },
  {
    id: "blog-support",
    title: "Blog & support",
    routes: [
      { path: "/blog", label: "Operator Log", hint: "Blog" },
      { path: ORIGIN_CS_ROUTE, label: "Customer Service", hint: "Origin CS" },
    ],
  },
] as const;

export const SITE_ROUTE_COUNT = SITE_ROUTE_GROUPS.reduce((sum, group) => sum + group.routes.length, 0);
