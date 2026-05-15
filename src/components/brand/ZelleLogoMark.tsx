type ZelleLogoMarkProps = {
  className?: string;
};

/** Compact Zelle wordmark for footer / fuel chips (purple brand tone). */
export default function ZelleLogoMark({ className = "" }: ZelleLogoMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 18"
      role="img"
      aria-label="Zelle"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="14"
        fill="currentColor"
        fontFamily="'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="14"
        fontWeight="700"
      >
        Zelle
      </text>
    </svg>
  );
}
