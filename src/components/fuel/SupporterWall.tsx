import { DIRECT_FUEL_WALL_PLACEHOLDERS, DIRECT_FUEL_WALL_SUB, DIRECT_FUEL_WALL_TITLE } from "../../data/directFuelCash";

export default function SupporterWall() {
  const tickerItems = [...DIRECT_FUEL_WALL_PLACEHOLDERS, ...DIRECT_FUEL_WALL_PLACEHOLDERS];

  return (
    <section className="supporter-wall" aria-labelledby="supporter-wall-heading">
      <header className="supporter-wall__header">
        <h2 id="supporter-wall-heading" className="supporter-wall__title">
          {DIRECT_FUEL_WALL_TITLE}
        </h2>
        <p className="supporter-wall__sub">{DIRECT_FUEL_WALL_SUB}</p>
      </header>

      <div className="supporter-wall__ticker" aria-hidden>
        <div className="supporter-wall__ticker-track">
          {tickerItems.map((entry, index) => (
            <span key={`${entry.handle}-${index}`} className="supporter-wall__ticker-chip">
              <strong>{entry.handle}</strong> {entry.message}
            </span>
          ))}
        </div>
      </div>

      <ul className="supporter-wall__grid">
        {DIRECT_FUEL_WALL_PLACEHOLDERS.map((entry) => (
          <li key={entry.handle} className="supporter-wall__card">
            <p className="supporter-wall__handle">{entry.handle}</p>
            <p className="supporter-wall__message">{entry.message}</p>
            <p className="supporter-wall__badge">First responder</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
