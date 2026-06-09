/** New York Knicks interlocking NY — orange + blue vector mark. */

export function NewYorkKnicksMarkGraphic() {
  return (
    <>
      <circle cx="50" cy="50" r="48" fill="#006BB6" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="#F58426" strokeWidth="2.5" opacity="0.85" />
      <path
        fill="#F58426"
        d="M22 15 L22 85 L30 85 L30 45 L55 85 L63 85 L63 15 L55 15 L55 55 L30 15 Z"
      />
      <path
        fill="#F58426"
        stroke="#ffffff"
        strokeWidth="2.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        paintOrder="stroke fill"
        d="M37 15 L50 42 L63 15 L71 15 L54 48 L54 85 L46 85 L46 48 L29 15 Z"
      />
    </>
  );
}

type NewYorkKnicksMarkProps = {
  className?: string;
  /** Render size in user units (viewBox is 100×100). */
  size?: number;
};

export default function NewYorkKnicksMark({ className = "", size = 100 }: NewYorkKnicksMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="New York Knicks"
      xmlns="http://www.w3.org/2000/svg"
    >
      <NewYorkKnicksMarkGraphic />
    </svg>
  );
}
