import {
  JET_HOOPS_COURT_HEIGHT,
  JET_HOOPS_COURT_WIDTH,
} from "../../data/jetHoops";
import {
  NBA_GEOMETRY,
  NBA_LINE_WIDTH,
  NBA_PX_PER_FT,
  nbaCourtMidY,
  nbaFt,
  nbaHalfCourtX,
  nbaLeftRimX,
  nbaRightRimX,
  nbaSidelineBottom,
  nbaSidelineTop,
} from "../../data/jetHoopsCourtGeometry";

const LINE = `rgb(255 255 255 / 0.9)`;
const PAINT_FILL = `rgb(196 120 72 / 0.24)`;
const RIM = `rgb(255 210 90 / 0.95)`;

/** Regulation NBA hardwood — 94 ft × 50 ft, scaled to canvas. */
export default function JetHoopsCourtSvg() {
  const w = JET_HOOPS_COURT_WIDTH;
  const h = JET_HOOPS_COURT_HEIGHT;
  const midY = nbaCourtMidY();
  const midX = nbaHalfCourtX();
  const paintW = nbaFt(NBA_GEOMETRY.paintWidthFt);
  const paintL = nbaFt(NBA_GEOMETRY.paintLengthFt);
  const ftCircleR = nbaFt(NBA_GEOMETRY.freeThrowCircleRadiusFt);
  const centerR = nbaFt(NBA_GEOMETRY.centerCircleRadiusFt);
  const restrictedR = nbaFt(NBA_GEOMETRY.restrictedAreaRadiusFt);
  const threeArcR = nbaFt(NBA_GEOMETRY.threePointArcFt);
  const threeCorner = nbaFt(NBA_GEOMETRY.threePointCornerFt);
  const threeInset = nbaFt(NBA_GEOMETRY.threePointSidelineInsetFt);
  const backboardW = nbaFt(NBA_GEOMETRY.backboardWidthFt);

  const rims = [nbaLeftRimX(), nbaRightRimX()];

  return (
    <svg
      className="jet-hoops__court-svg"
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      aria-hidden
    >
      <defs>
        <linearGradient id="jet-hoops-hardwood" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a4a28" />
          <stop offset="48%" stopColor="#8f5a32" />
          <stop offset="100%" stopColor="#6d3f22" />
        </linearGradient>
        <pattern id="jet-hoops-plank" width={NBA_PX_PER_FT * 2} height={NBA_PX_PER_FT * 2} patternUnits="userSpaceOnUse">
          <rect width={NBA_PX_PER_FT * 2} height={NBA_PX_PER_FT * 2} fill="transparent" />
          <line
            x1={0}
            y1={NBA_PX_PER_FT * 2}
            x2={NBA_PX_PER_FT * 2}
            y2={NBA_PX_PER_FT * 2}
            stroke="rgb(0 0 0 / 0.07)"
            strokeWidth={1}
          />
        </pattern>
      </defs>

      <rect x={0} y={0} width={w} height={h} rx={12} fill="url(#jet-hoops-hardwood)" />
      <rect x={0} y={0} width={w} height={h} rx={12} fill="url(#jet-hoops-plank)" opacity={0.32} />

      {/* Boundary */}
      <rect
        x={0}
        y={nbaSidelineTop()}
        width={w}
        height={h}
        fill="none"
        stroke={LINE}
        strokeWidth={NBA_LINE_WIDTH}
      />

      {/* Half court */}
      <line x1={midX} y1={nbaSidelineTop()} x2={midX} y2={nbaSidelineBottom()} stroke={LINE} strokeWidth={NBA_LINE_WIDTH} />
      <circle cx={midX} cy={midY} r={centerR} fill="none" stroke={LINE} strokeWidth={NBA_LINE_WIDTH} />
      <circle cx={midX} cy={midY} r={3} fill={LINE} />

      {rims.map((rimX) => {
        const leftSide = rimX < midX;
        const paintX = leftSide ? rimX - paintW / 2 : rimX - paintW / 2;
        const paintY = midY - paintW / 2;
        const baselineX = leftSide ? 0 : w;
        const ftLineX = leftSide ? nbaFt(NBA_GEOMETRY.paintLengthFt) : w - nbaFt(NBA_GEOMETRY.paintLengthFt);
        const threeStraightX = leftSide ? rimX + threeCorner : rimX - threeCorner;
        const arcStartY = threeInset;
        const arcEndY = h - threeInset;

        return (
          <g key={rimX}>
            {/* Paint */}
            <rect
              x={paintX}
              y={paintY}
              width={paintW}
              height={paintL}
              fill={PAINT_FILL}
              stroke={LINE}
              strokeWidth={NBA_LINE_WIDTH}
            />

            {/* Free throw line */}
            <line
              x1={ftLineX}
              y1={paintY}
              x2={ftLineX}
              y2={paintY + paintW}
              stroke={LINE}
              strokeWidth={NBA_LINE_WIDTH}
            />

            {/* Free throw circle — outer half toward court */}
            <path
              d={
                leftSide
                  ? `M ${ftLineX} ${midY - ftCircleR} A ${ftCircleR} ${ftCircleR} 0 0 1 ${ftLineX} ${midY + ftCircleR}`
                  : `M ${ftLineX} ${midY - ftCircleR} A ${ftCircleR} ${ftCircleR} 0 0 0 ${ftLineX} ${midY + ftCircleR}`
              }
              fill="none"
              stroke={LINE}
              strokeWidth={NBA_LINE_WIDTH}
            />

            {/* Restricted area */}
            <path
              d={
                leftSide
                  ? `M ${baselineX} ${midY - restrictedR} A ${restrictedR} ${restrictedR} 0 0 0 ${baselineX} ${midY + restrictedR}`
                  : `M ${baselineX} ${midY - restrictedR} A ${restrictedR} ${restrictedR} 0 0 1 ${baselineX} ${midY + restrictedR}`
              }
              fill="none"
              stroke={LINE}
              strokeWidth={NBA_LINE_WIDTH}
            />

            {/* Three-point: sideline chords + arc */}
            <line
              x1={leftSide ? 0 : threeStraightX}
              y1={arcStartY}
              x2={leftSide ? threeStraightX : w}
              y2={arcStartY}
              stroke={LINE}
              strokeWidth={NBA_LINE_WIDTH}
            />
            <line
              x1={leftSide ? 0 : threeStraightX}
              y1={arcEndY}
              x2={leftSide ? threeStraightX : w}
              y2={arcEndY}
              stroke={LINE}
              strokeWidth={NBA_LINE_WIDTH}
            />
            <path
              d={
                leftSide
                  ? `M ${threeStraightX} ${arcStartY} A ${threeArcR} ${threeArcR} 0 0 1 ${threeStraightX} ${arcEndY}`
                  : `M ${threeStraightX} ${arcStartY} A ${threeArcR} ${threeArcR} 0 0 0 ${threeStraightX} ${arcEndY}`
              }
              fill="none"
              stroke={LINE}
              strokeWidth={NBA_LINE_WIDTH}
            />

            {/* Backboard */}
            <line
              x1={baselineX}
              y1={midY - backboardW / 2}
              x2={baselineX}
              y2={midY + backboardW / 2}
              stroke={RIM}
              strokeWidth={3}
            />

            {/* Rim */}
            <circle cx={rimX} cy={midY} r={9} fill="none" stroke={RIM} strokeWidth={2.5} />
          </g>
        );
      })}
    </svg>
  );
}
