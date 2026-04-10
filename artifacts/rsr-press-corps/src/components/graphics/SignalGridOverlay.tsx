interface SignalGridOverlayProps {
  className?: string;
  opacity?: number;
}

export function SignalGridOverlay({ className = "", opacity = 1 }: SignalGridOverlayProps) {
  const cols = 12;
  const rows = 8;
  const hotspots = [
    { col: 2,  row: 1, dur: 4.2, del: 0.0 },
    { col: 7,  row: 3, dur: 5.1, del: 0.9 },
    { col: 4,  row: 6, dur: 4.8, del: 1.7 },
    { col: 10, row: 2, dur: 5.6, del: 0.4 },
    { col: 5,  row: 4, dur: 4.4, del: 2.3 },
    { col: 9,  row: 6, dur: 5.0, del: 1.1 },
    { col: 1,  row: 5, dur: 6.0, del: 3.1 },
    { col: 11, row: 4, dur: 4.7, del: 0.7 },
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
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(150 55% 35%)" strokeWidth="0.5" strokeOpacity="0.11" />
        </pattern>
      </defs>

      {/* Base grid */}
      <rect width="100%" height="100%" fill="url(#signalGrid)" />

      {/* Hotspot markers */}
      {hotspots.map((h, i) => (
        <g key={`hs-${i}`}>
          <rect
            x={h.col * 100 - 5}
            y={h.row * 100 - 5}
            width="10" height="10"
            stroke="hsl(150 60% 50%)"
            strokeWidth="0.7"
            strokeOpacity="0.2"
            fill="none"
          />
          <circle cx={h.col * 100} cy={h.row * 100} r="1.8"
            fill="hsl(150 60% 55%)" fillOpacity="0.28" />
          <circle cx={h.col * 100} cy={h.row * 100} r="1.8"
            fill="hsl(150 60% 55%)" fillOpacity="0.12">
            <animate attributeName="r"
              values={`1.8;${10 + i % 3}`}
              dur={`${h.dur}s`}
              repeatCount="indefinite"
              begin={`${h.del}s`}
            />
            <animate attributeName="fill-opacity"
              values="0.12;0"
              dur={`${h.dur}s`}
              repeatCount="indefinite"
              begin={`${h.del}s`}
            />
          </circle>
        </g>
      ))}

      {/* Static diagonal cross-section lines */}
      <line x1="150" y1="0"   x2="1150" y2="800" stroke="hsl(150 55% 40%)" strokeWidth="0.4" strokeOpacity="0.07" strokeDasharray="8 22" />
      <line x1="0"   y1="250" x2="1200" y2="480" stroke="hsl(150 55% 40%)" strokeWidth="0.4" strokeOpacity="0.05" strokeDasharray="12 32" />
      <line x1="400" y1="800" x2="1100" y2="0"   stroke="hsl(150 50% 36%)" strokeWidth="0.3" strokeOpacity="0.04" strokeDasharray="6 28" />

      {/* Slow horizontal scanline sweep */}
      <line x1="-10" y1="240" x2="10" y2="240"
        stroke="hsl(150 65% 55%)" strokeWidth="1" strokeOpacity="0.22">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="-10 0; 1220 0; -10 0"
          dur="28s"
          repeatCount="indefinite"
          begin="-8s"
        />
      </line>
      {/* Second scanline — different timing and row */}
      <line x1="-10" y1="560" x2="10" y2="560"
        stroke="hsl(150 60% 50%)" strokeWidth="0.6" strokeOpacity="0.12">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="-10 0; 1220 0; -10 0"
          dur="38s"
          repeatCount="indefinite"
          begin="-22s"
        />
      </line>

      {/* Transmission trace — vertical slow drift */}
      <line x1="750" y1="-10" x2="750" y2="10"
        stroke="hsl(150 60% 48%)" strokeWidth="0.5" strokeOpacity="0.14">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 -10; 0 820; 0 -10"
          dur="45s"
          repeatCount="indefinite"
          begin="-15s"
        />
      </line>

      {/* Blinking corner markers — tactical field indicators */}
      {[
        { x: 50,  y: 50  },
        { x: 1150, y: 50  },
        { x: 50,  y: 750 },
        { x: 1150, y: 750 },
      ].map((pos, i) => (
        <g key={`corner-${i}`}>
          <circle cx={pos.x} cy={pos.y} r="3"
            fill="hsl(150 65% 55%)" fillOpacity="0.22">
            <animate attributeName="fill-opacity"
              values="0.22;0.05;0.22"
              dur={`${3.5 + i * 0.8}s`}
              repeatCount="indefinite"
              begin={`${i * 0.6}s`}
            />
          </circle>
          <circle cx={pos.x} cy={pos.y} r="7"
            stroke="hsl(150 60% 50%)" strokeWidth="0.5" strokeOpacity="0.1"
            fill="none">
            <animate attributeName="stroke-opacity"
              values="0.1;0.02;0.1"
              dur={`${3.5 + i * 0.8}s`}
              repeatCount="indefinite"
              begin={`${i * 0.6}s`}
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}
