import UsjetStarEmblem from "../brand/UsjetStarEmblem";

/** CSS 3D hardcover artifact — embossed sovereign star. */
export default function SovereignProtocolBookArtifact() {
  return (
    <div className="sovereign-book-artifact" aria-hidden>
      <div className="sovereign-book-artifact__stage">
        <div className="sovereign-book-artifact__book">
          <div className="sovereign-book-artifact__spine" />
          <div className="sovereign-book-artifact__cover sovereign-book-artifact__cover--front">
            <div className="sovereign-book-artifact__cover-glass" />
            <UsjetStarEmblem className="sovereign-book-artifact__star" decorative />
            <p className="sovereign-book-artifact__vol">Volume I</p>
            <p className="sovereign-book-artifact__mark">USJET</p>
          </div>
          <div className="sovereign-book-artifact__pages" />
          <div className="sovereign-book-artifact__cover sovereign-book-artifact__cover--edge" />
        </div>
        <div className="sovereign-book-artifact__pedestal" />
        <div className="sovereign-book-artifact__glow" />
      </div>
    </div>
  );
}
