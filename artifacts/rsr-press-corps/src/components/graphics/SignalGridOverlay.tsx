interface SignalGridOverlayProps {
  className?: string;
  opacity?: number;
}

export function SignalGridOverlay({ className = "", opacity = 1 }: SignalGridOverlayProps) {
  const cols = 12;
  const rows = 8;
  const hotspots = [
    { col: 2, row: 1 }, { col: 7, row: 3 }, { col: 4, row: 6 },
    { col: 10, row: 2 }, { col: 5, row: 4 }, { col: 9, row: 6 },
  ];

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${cols * 100} ${rows * 100}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none absolute inset-0 ${className}`}
      style={{ opacity }}
    >
      <defs>
        <pattern id="signalGrid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(150 55% 35%)" strokeWidth="0.5" strokeOpacity="0.12" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#signalGrid)" />

      {/* Hotspot markers */}
      {hotspots.map((h, i) => (
        <g key={`hs-${i}`}>
          <rect
            x={h.col * 100 - 6}
            y={h.row * 100 - 6}
            width="12"
            height="12"
            stroke="hsl(150 60% 50%)"
            strokeWidth="0.8"
            strokeOpacity="0.25"
            fill="none"
          />
          <circle
            cx={h.col * 100}
            cy={h.row * 100}
            r="2"
            fill="hsl(150 60% 55%)"
            fillOpacity="0.3"
          />
          <circle
            cx={h.col * 100}
            cy={h.row * 100}
            r="2"
            fill="hsl(150 60% 55%)"
            fillOpacity="0.15"
          >
            <animate
              attributeName="r"
              values="2;12;2"
              dur={`${4 + i * 0.7}s`}
              repeatCount="indefinite"
              begin={`${i * 0.9}s`}
            />
            <animate
              attributeName="fill-opacity"
              values="0.15;0;0.15"
              dur={`${4 + i * 0.7}s`}
              repeatCount="indefinite"
              begin={`${i * 0.9}s`}
            />
          </circle>
        </g>
      ))}

      {/* Cross-section lines */}
      <line x1="200" y1="0" x2="1100" y2="800" stroke="hsl(150 55% 40%)" strokeWidth="0.4" strokeOpacity="0.08" strokeDasharray="8 20" />
      <line x1="0" y1="300" x2="1200" y2="500" stroke="hsl(150 55% 40%)" strokeWidth="0.4" strokeOpacity="0.06" strokeDasharray="12 30" />
    </svg>
  );
}
