import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Landmark } from "lucide-react";
import ZelleFuelPanel from "../components/fuel/ZelleFuelPanel";
import { DIRECT_FUEL_ROUTE } from "../data/directFuelCash";
import { ZELLE_FUEL_HOOK, ZELLE_FUEL_TAGLINE, ZELLE_FUEL_TITLE } from "../data/directFuelZelle";

export default function DirectFuelZelle() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Direct Fuel · Zelle · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Fuel USJET via Zelle — scan the QR in your banking app. Direct payment to the founder's personal checking.",
    );
    document.documentElement.classList.add("zelle-fuel-page-root");
    return () => {
      document.title = prev;
      meta?.setAttribute("content", prevDesc);
      document.documentElement.classList.remove("zelle-fuel-page-root");
    };
  }, []);

  return (
    <div className="zelle-fuel-page page-atmosphere page-nav-offset mx-auto max-w-lg px-4 pb-36 pt-4 sm:px-6">
      <header className="zelle-fuel-page__hero text-center">
        <p className="zelle-fuel-page__eyebrow">
          <Landmark size={14} aria-hidden />
          {ZELLE_FUEL_TAGLINE}
        </p>
        <h1 className="zelle-fuel-page__title">{ZELLE_FUEL_TITLE}</h1>
        <p className="zelle-fuel-page__hook">{ZELLE_FUEL_HOOK}</p>
      </header>

      <div className="zelle-fuel-page__panel-wrap">
        <ZelleFuelPanel />
      </div>

      <p className="zelle-fuel-page__footer-links">
        Prefer Cash App?{" "}
        <Link to={DIRECT_FUEL_ROUTE} className="zelle-fuel-page__link">
          Direct Fuel · $USJET
        </Link>{" "}
        ·{" "}
        <Link to="/founders-fuel" className="zelle-fuel-page__link">
          Founder&apos;s Fuel
        </Link>
      </p>
    </div>
  );
}
