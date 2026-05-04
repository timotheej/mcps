type MiniRingProps = {
  done: number;
  total: number;
  size?: number;
  capped?: boolean;
  overflow?: number;
};

export function MiniRing({
  done,
  total,
  size = 104,
  capped,
  overflow = 0,
}: MiniRingProps) {
  const stroke = 3;
  const r = (size - stroke - 8) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const displayed = capped ? Math.min(done, total) : done;
  const pct = total > 0 ? Math.min(displayed / total, 1) : 0;
  const arcLen = c * pct;
  const angle = -Math.PI / 2 + 2 * Math.PI * pct;
  const checkX = cx + r * Math.cos(angle);
  const checkY = cy + r * Math.sin(angle);

  const badgeAngle = -Math.PI / 4;
  const badgeX = cx + r * Math.cos(badgeAngle);
  const badgeY = cy + r * Math.sin(badgeAngle);

  const isCompact = size <= 80;

  return (
    <div
      className={`maq-mini-ring${isCompact ? " maq-mini-ring--sm" : ""}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} aria-hidden="true">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--text-mention-grey)"
          strokeWidth={stroke}
          strokeDasharray="2 5"
          opacity={0.55}
        />
        {pct > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--success-425-625)"
            strokeWidth={stroke + 1}
            strokeDasharray={`${arcLen} ${c}`}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="round"
          />
        )}
        {pct > 0 && pct < 1 && (
          <g transform={`translate(${checkX} ${checkY})`}>
            <circle r={isCompact ? 7 : 9} fill="var(--success-425-625)" />
            <path
              d={isCompact ? "M-2.8 0 L-0.8 1.8 L2.8 -1.8" : "M-3.6 0 L-1 2.4 L3.6 -2.4"}
              stroke="white"
              strokeWidth={1.6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
      <div className="maq-mini-ring__center">
        <span className="maq-mini-ring__num">
          {displayed}/{total}
        </span>
        <span className="maq-mini-ring__label">actions</span>
      </div>
      {overflow > 0 && (
        <span
          className="maq-mini-ring__badge"
          style={{
            left: `${badgeX}px`,
            top: `${badgeY}px`,
          }}
          aria-label={`${overflow} action${overflow > 1 ? "s" : ""} au-delà du minimum`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
