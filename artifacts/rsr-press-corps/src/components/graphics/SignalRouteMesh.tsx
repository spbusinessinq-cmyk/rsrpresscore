interface SignalRouteMeshProps {
  width?: number;
  height?: number;
  className?: string;
  opacity?: number;
}

export function SignalRouteMesh({
  width = 600,
  height = 200,
  className = "",
  opacity = 1,
}: SignalRouteMeshProps) {
  const nodes = [
    { x: 60,   y: height * 0.5 },
    { x: 175,  y: height * 0.3 },
    { x: 245,  y: height * 0.65 },
    { x: 355,  y: height * 0.35 },
    { x: 440,  y: height * 0.6 },
    { x: width - 60, y: height * 0.45 },
  ];

  const routes = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [0, 2], [1, 3], [3, 5],
  ];

  return (
    <svg
      width={width} height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      <defs>
        {/* Fade mask for left/right edges */}
        <linearGradient id="meshFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="black" stopOpacity="0" />
          <stop offset="12%"  stopColor="black" stopOpacity="1" />
          <stop offset="88%"  stopColor="black" stopOpacity="1" />
          <stop offset="100%" stopColor="black" stopOpacity="0" />
        </linearGradient>
        <mask id="meshMask">
          <rect x="0" y="0" width={width} height={height} fill="url(#meshFade)" />
        </mask>

        {/* Path definitions for animateMotion */}
        {routes.map(([a, b], i) => {
          const na = nodes[a];
          const nb = nodes[b];
          const mx = (na.x + nb.x) / 2;
          const my = (na.y + nb.y) / 2 - 20;
          return (
            <path key={`rp-${i}`}
              id={`route-path-${i}`}
              d={`M ${na.x} ${na.y} Q ${mx} ${my} ${nb.x} ${nb.y}`}
            />
          );
        })}
      </defs>

      <g mask="url(#meshMask)">
        {/* Route lines */}
        {routes.map(([a, b], i) => {
          const na = nodes[a];
          const nb = nodes[b];
          const mx = (na.x + nb.x) / 2;
          const my = (na.y + nb.y) / 2 - 20;
          const bright = i < 5;
          return (
            <path key={`r-${i}`}
              d={`M ${na.x} ${na.y} Q ${mx} ${my} ${nb.x} ${nb.y}`}
              stroke={bright ? "hsl(150 60% 46%)" : "hsl(150 50% 38%)"}
              strokeWidth={bright ? "0.8" : "0.5"}
              strokeOpacity={bright ? "0.22" : "0.12"}
              strokeDasharray="4 8"
              fill="none"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={`n-${i}`}>
            <circle cx={n.x} cy={n.y} r="4"
              fill="hsl(150 60% 40%)" fillOpacity="0.08"
              stroke="hsl(150 60% 48%)" strokeWidth="0.7" strokeOpacity="0.3" />
            <circle cx={n.x} cy={n.y} r="1.5"
              fill="hsl(150 65% 58%)" fillOpacity="0.55" />
          </g>
        ))}

        {/* Traveling pulses — 3 routes */}
        {[0, 2, 4].map((routeIdx, i) => (
          <circle key={`tp-${i}`} r="1.8" fill="hsl(150 70% 62%)" fillOpacity="0">
            <animateMotion dur={`${8 + i * 2.5}s`} repeatCount="indefinite" begin={`${i * 3}s`}>
              <mpath href={`#route-path-${routeIdx}`} />
            </animateMotion>
            <animate attributeName="fill-opacity"
              values="0;0.8;0.8;0"
              keyTimes="0;0.08;0.92;1"
              dur={`${8 + i * 2.5}s`} repeatCount="indefinite" begin={`${i * 3}s`}
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}
