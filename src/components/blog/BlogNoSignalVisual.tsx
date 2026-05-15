/** Featured "NO SIGNAL" static — Zero-Signal Rule manifesto. */
export default function BlogNoSignalVisual() {
  return (
    <div className="blog-no-signal-visual" role="img" aria-label="No signal — system error static">
      <div className="blog-no-signal-visual__static" aria-hidden />
      <div className="blog-no-signal-visual__content">
        <p className="blog-no-signal-visual__label">SYSTEM</p>
        <p className="blog-no-signal-visual__main">NO SIGNAL</p>
        <p className="blog-no-signal-visual__sub">REVENUE REQUIRED</p>
      </div>
      <div className="blog-no-signal-visual__bars" aria-hidden>
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} className="blog-no-signal-visual__bar" style={{ animationDelay: `${index * 0.08}s` }} />
        ))}
      </div>
    </div>
  );
}
