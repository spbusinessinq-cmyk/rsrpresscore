import { useEffect, useRef } from "react";

interface WireGlobeGraphicProps {
  size?: number;
  className?: string;
  opacity?: number;
}

export function WireGlobeGraphic({ size = 520, className = "", opacity = 0.55 }: WireGlobeGraphicProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;

  const latLines = [-60, -40, -20, 0, 20, 40, 60];
  const lonLines = [0, 30, 60, 90, 120, 150];

  const nodes: { x: number; y: number; pulse?: boolean }[] = [];

  const latToY = (deg: number) => cy + r * Math.sin((deg * Math.PI) / 180);
  const latToRx = (deg: number) => r * Math.cos((deg * Math.PI) / 180);

  for (const lat of latLines) {
    const y = latToY(lat);
    const rx = latToRx(lat);
    if (rx < 8) continue;
    for (let lonFrac = 0; lonFrac < 1; lonFrac += 0.25) {
      const angle = lonFrac * 2 * Math.PI;
      const nx = cx + rx * Math.cos(angle);
      const x = nx;
      nodes.push({ x, y, pulse: Math.random() > 0.85 });
    }
  }

  const arcs = [
    { x1: cx - r * 0.4, y1: cy - r * 0.3, x2: cx + r * 0.5, y2: cy + r * 0.15 },
    { x1: cx - r * 0.6, y1: cy + r * 0.1, x2: cx + r * 0.2, y2: cy - r * 0.5 },
    { x1: cx + r * 0.3, y1: cy - r * 0.45, x2: cx + r * 0.6, y2: cy + r * 0.35 },
    { x1: cx - r * 0.7, y1: cy - r * 0.15, x2: cx, y2: cy + r * 0.55 },
    { x1: cx - r * 0.2, y1: cy + r * 0.5, x2: cx + r * 0.55, y2: cy - r * 0.2 },
  ];

  const controlOffset = r * 0.25;

  return (
    <div className={`relative select-none pointer-events-none ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        <defs>
          <radialGradient id="globeVignette" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(150 55% 33%)" stopOpacity="0.08" />
            <stop offset="70%" stopColor="hsl(150 55% 33%)" stopOpacity="0.03" />
            <stop offset="100%" stopColor="hsl(150 55% 33%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(150 55% 33%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <clipPath id="globeClip">
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Globe ambient fill */}
        <circle cx={cx} cy={cy} r={r} fill="url(#globeVignette)" />

        {/* Latitude lines (horizontal ellipses) */}
        {latLines.map((lat) => {
          const y = latToY(lat);
          const rx = latToRx(lat);
          if (rx < 5) return null;
          return (
            <ellipse
              key={`lat-${lat}`}
              cx={cx}
              cy={y}
              rx={rx}
              ry={rx * 0.08}
              stroke="hsl(150 55% 40%)"
              strokeWidth={lat === 0 ? "0.8" : "0.5"}
              strokeOpacity={lat === 0 ? "0.35" : "0.18"}
              fill="none"
            />
          );
        })}

        {/* Longitude lines (rotated ellipses = meridians) */}
        {lonLines.map((lon) => (
          <g key={`lon-${lon}`} style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${lon}deg)` }}>
            <ellipse
              cx={cx}
              cy={cy}
              rx={r * 0.1}
              ry={r}
              stroke="hsl(150 55% 40%)"
              strokeWidth="0.5"
              strokeOpacity="0.18"
              fill="none"
            />
          </g>
        ))}

        {/* Outer circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="hsl(150 55% 40%)"
          strokeWidth="1"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Outer ring glow */}
        <circle
          cx={cx}
          cy={cy}
          r={r + 1}
          stroke="hsl(150 55% 50%)"
          strokeWidth="0.5"
          strokeOpacity="0.12"
          fill="none"
        />

        {/* Arc connections */}
        {arcs.map((arc, i) => {
          const cX = (arc.x1 + arc.x2) / 2 + (i % 2 === 0 ? controlOffset : -controlOffset);
          const cY = (arc.y1 + arc.y2) / 2 - controlOffset;
          return (
            <path
              key={`arc-${i}`}
              d={`M ${arc.x1} ${arc.y1} Q ${cX} ${cY} ${arc.x2} ${arc.y2}`}
              stroke="hsl(150 60% 45%)"
              strokeWidth="0.7"
              strokeOpacity="0.3"
              fill="none"
              strokeDasharray="4 6"
            />
          );
        })}

        {/* Node dots */}
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.x} cy={n.y} r={n.pulse ? 3 : 1.5} fill="hsl(150 60% 55%)" fillOpacity={n.pulse ? "0.7" : "0.4"} />
            {n.pulse && (
              <circle cx={n.x} cy={n.y} r={3} fill="hsl(150 60% 55%)" fillOpacity="0.3">
                <animate attributeName="r" values="3;8;3" dur={`${2.5 + (i % 3) * 0.8}s`} repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.3;0;0.3" dur={`${2.5 + (i % 3) * 0.8}s`} repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}

        {/* Rotating longitude ring overlay */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "globeRotate 40s linear infinite" }}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={r * 0.12}
            ry={r}
            stroke="hsl(150 60% 50%)"
            strokeWidth="0.8"
            strokeOpacity="0.25"
            fill="none"
            strokeDasharray="3 8"
          />
        </g>

        {/* Second rotating ring, opposite direction */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "globeRotateReverse 55s linear infinite" }}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={r * 0.18}
            ry={r}
            stroke="hsl(150 50% 45%)"
            strokeWidth="0.6"
            strokeOpacity="0.18"
            fill="none"
            strokeDasharray="2 12"
          />
        </g>

        {/* Signal sweep element */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "globeSweep 8s ease-in-out infinite" }}>
          <path
            d={`M ${cx} ${cy} L ${cx + r} ${cy}`}
            stroke="hsl(150 60% 60%)"
            strokeWidth="1"
            strokeOpacity="0.15"
          />
        </g>

        {/* Center cross-hair */}
        <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="hsl(150 60% 50%)" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke="hsl(150 60% 50%)" strokeWidth="0.5" strokeOpacity="0.4" />
        <circle cx={cx} cy={cy} r={2} fill="hsl(150 60% 55%)" fillOpacity="0.5" />
      </svg>

      <style>{`
        @keyframes globeRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes globeRotateReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes globeSweep {
          0%, 100% { transform: rotate(-30deg); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          90% { transform: rotate(30deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
