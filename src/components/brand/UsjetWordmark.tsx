type UsjetWordmarkProps = {
  className?: string;
  /** Nav-sized vs hero-sized */
  size?: "nav" | "hero";
  glow?: boolean;
};

const USJET_LOGO_SRC = "/brand/usjet-logo.png?v=2";

/**
 * Official USJET logo mark — poly jet + Ai + US JET wordmark.
 */
export default function UsjetWordmark({ className = "", size = "nav", glow = true }: UsjetWordmarkProps) {
  return (
    <img
      src={USJET_LOGO_SRC}
      alt="USJET"
      className={[
        "usjet-logo-mark",
        size === "hero" ? "usjet-logo-mark--hero" : "usjet-logo-mark--nav",
        glow ? "usjet-logo-mark--glow" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      decoding="async"
      draggable={false}
    />
  );
}
