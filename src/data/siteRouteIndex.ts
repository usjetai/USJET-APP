/** Full-site flight deck index — side latch menu source of truth. */

import { MOBILE_LANDSCAPE_ROUTE } from "./mobileLandscapeGuide";
import { PROTOCOL_SESSION_PROOF_ROUTE } from "./protocolSessionProof";

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
    id: "shop",
    title: "Shop",
    routes: [
      { path: "/", label: "Homes", hint: "Home AI computers" },
      { path: "/fleet", label: "Business", hint: "Business computers · servers" },
      { path: "/store/ai-computers", label: "Full lineup", hint: "Homes + Businesses hub" },
      { path: "/store/ai-computers/homes", label: "AI Computers — Homes", hint: "Mac Mini, MacBook, mini PCs" },
      { path: "/store/ai-computers/businesses", label: "AI Computers — Businesses", hint: "Mac Studio, workstations" },
      { path: "/compare", label: "Compare", hint: "Why this machine" },
    ],
  },
  {
    id: "company",
    title: "Company",
    routes: [
      { path: "/blog", label: "Operator Log", hint: "Blog" },
      { path: "/ai-101", label: "AI 101", hint: "How local AI works" },
      { path: "/sos", label: "Help", hint: "SOS help center" },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    routes: [
      { path: "/privacy", label: "Privacy" },
      { path: "/terms", label: "Terms" },
      { path: PROTOCOL_SESSION_PROOF_ROUTE, label: "Protocol Proof" },
      { path: MOBILE_LANDSCAPE_ROUTE, label: "Landscape Guide" },
    ],
  },
] as const;

export const SITE_ROUTE_COUNT = SITE_ROUTE_GROUPS.reduce((sum, group) => sum + group.routes.length, 0);
