import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { canonicalHref } from "../../data/siteSeo";

/** Updates `<link rel="canonical">` on every route change — single high-authority host in Search Console. */
export default function CanonicalHead() {
  const location = useLocation();

  useEffect(() => {
    const href = canonicalHref(location.pathname);
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [location.pathname]);

  return null;
}
