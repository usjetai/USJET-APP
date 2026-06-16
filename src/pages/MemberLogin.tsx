import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import MemberLoginPanel from "../components/member/MemberLoginPanel";
import { useMemberAuth } from "../context/MemberAuthContext";
import { canMemberAccessRoute } from "../lib/memberAccessLevel";
import { isSitePreviewPromoActive } from "../lib/sitePreviewPromo";
import { SITE_PREVIEW_MEMBER_NOTE } from "../data/sitePreviewPromo";

export default function MemberLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useMemberAuth();
  const blockedRoute =
    typeof location.state === "object" &&
    location.state !== null &&
    "blockedRoute" in location.state &&
    typeof (location.state as { blockedRoute?: string }).blockedRoute === "string"
      ? (location.state as { blockedRoute: string }).blockedRoute
      : null;

  if (!loading && canMemberAccessRoute("/member", session)) {
    return <Navigate to="/member" replace />;
  }

  return (
    <div className="member-login-page page-atmosphere page-nav-offset mx-auto max-w-4xl px-6 pb-28 sm:px-8">
      {blockedRoute ? (
        <p className="member-login-page__blocked-banner" role="status">
          <strong>{blockedRoute}</strong> requires paid Stripe clearance. Pay below or log in after checkout.
          {isSitePreviewPromoActive() ? ` ${SITE_PREVIEW_MEMBER_NOTE}` : " Guests may browse Fleet and Founder only."}
        </p>
      ) : null}

      <header className="member-login-page__header">
        <div className="member-login-page__kicker-row">
          <ShieldCheck size={14} aria-hidden />
          <p className="member-login-page__kicker">Member clearance</p>
        </div>
        <h1 className="member-login-page__title">
          Member <span className="member-login-page__title-accent">Login</span>
        </h1>
        <p className="member-login-page__subtitle">
          Stripe payment first. Then verify with billing email and your founder-issued access sentence.
        </p>
      </header>

      <MemberLoginPanel onSuccess={() => navigate("/member", { replace: true })} />
    </div>
  );
}
