import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import CompleteLibraryShelf from "../components/store/CompleteLibraryShelf";
import { allPressVolumes } from "../data/libraryShelf";

export default function PressLibrary() {
  const volumes = useMemo(() => allPressVolumes(), []);

  useEffect(() => {
    const previous = document.title;
    document.title = "Press · USJet.ai";
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "USJET Press — aviation books and operator manuals on one hardcover stack. Click a volume, buy on Amazon, same window.",
    );
    return () => {
      document.title = previous;
      meta?.setAttribute("content", previousDescription);
    };
  }, []);

  return (
    <div className="press-page page-atmosphere page-nav-offset">
      <CompleteLibraryShelf volumes={volumes} kicker="USJET Press" heading="The complete shelf" />
      <p className="press-home__hint">
        <Link to="/aviation-books" className="press-home__catalog-link">
          Aviation catalog
        </Link>
        <span aria-hidden> · </span>
        <Link to="/store" className="press-home__catalog-link">
          Manuals catalog
        </Link>
      </p>
    </div>
  );
}
