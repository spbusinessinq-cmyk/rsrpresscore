interface WireGlobeGraphicProps {
  size?: number;
  className?: string;
  opacity?: number;
}

export function WireGlobeGraphic({ size = 520, className = "", opacity = 0.6 }: WireGlobeGraphicProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;
  const uid = `g${size}`;

  // Latitude rings — weighted by proximity to equator
  const latitudes = [
    { deg: 0,   w: "1",   o: "0.38" },
    { deg: 18,  w: "0.6", o: "0.22" },
    { deg: -18, w: "0.6", o: "0.22" },
    { deg: 36,  w: "0.5", o: "0.15" },
    { deg: -36, w: "0.5", o: "0.15" },
    { deg: 56,  w: "0.4", o: "0.09" },
    { deg: -56, w: "0.4", o: "0.09" },
  ];

  // Meridians — weighted by position
  const meridians = [
    { deg: 0,   o: "0.22", dash: "none" },
    { deg: 36,  o: "0.13", dash: "none" },
    { deg: 72,  o: "0.10", dash: "none" },
    { deg: 108, o: "0.10", dash: "none" },
    { deg: 144, o: "0.13", dash: "none" },
    { deg: 18,  o: "0.07", dash: "4 8" },
    { deg: 54,  o: "0.07", dash: "4 8" },
    { deg: 90,  o: "0.09", dash: "none" },
  ];

  const latToY  = (deg: number) => cy + r * Math.sin((deg * Math.PI) / 180);
  const latToRx = (deg: number) => Math.abs(r * Math.cos((deg * Math.PI) / 180));

  // Deterministic key nodes
  const keyNodes = [
    { lat: 0,   lon: 0   }, { lat: 0,   lon: 90  }, { lat: 0,   lon: 180 }, { lat: 0,   lon: 270 },
    { lat: 36,  lon: 36  }, { lat: -36, lon: 108 }, { lat: 18,  lon: 180 }, { lat: -18, lon: 270 },
    { lat: 56,  lon: 72  }, { lat: -56, lon: 144 }, { lat: 36,  lon: 252 }, { lat: -18, lon: 36  },
  ];

  const nodePoints = keyNodes.map(({ lat, lon }) => {
    const y   = latToY(lat);
    const rx  = latToRx(lat);
    const ang = (lon * Math.PI) / 180;
    return { x: cx + rx * Math.cos(ang), y };
  });

  // Curated arcs
  const arcs = [
    { x1: nodePoints[0].x, y1: nodePoints[0].y, x2: nodePoints[4].x, y2: nodePoints[4].y, bright: true  },
    { x1: nodePoints[1].x, y1: nodePoints[1].y, x2: nodePoints[6].x, y2: nodePoints[6].y, bright: false },
    { x1: nodePoints[2].x, y1: nodePoints[2].y, x2: nodePoints[5].x, y2: nodePoints[5].y, bright: false },
    { x1: nodePoints[4].x, y1: nodePoints[4].y, x2: nodePoints[8].x, y2: nodePoints[8].y, bright: true  },
  ];

  const travelArc = arcs[0];
  const travelMidX = (travelArc.x1 + travelArc.x2) / 2;
  const travelMidY = (travelArc.y1 + travelArc.y2) / 2 - r * 0.18;

  const pulseIndices = [0, 4, 8];

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
          {/* Soft inner glow fill */}
          <radialGradient id={`${uid}-fill`} cx="50%" cy="45%" r="50%">
            <stop offset="0%"   stopColor="hsl(150 60% 35%)" stopOpacity="0.09" />
            <stop offset="50%"  stopColor="hsl(150 55% 30%)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="hsl(150 55% 20%)" stopOpacity="0"    />
          </radialGradient>
          {/* Edge rim glow */}
          <radialGradient id={`${uid}-edge`} cx="50%" cy="50%" r="50%">
            <stop offset="82%"  stopColor="transparent"        stopOpacity="0"    />
            <stop offset="96%"  stopColor="hsl(150 55% 40%)"   stopOpacity="0.14" />
            <stop offset="100%" stopColor="transparent"        stopOpacity="0"    />
          </radialGradient>
          {/* Front hemisphere brightness mask */}
          <radialGradient id={`${uid}-front`} cx="40%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="white" stopOpacity="1"    />
            <stop offset="60%"  stopColor="white" stopOpacity="0.5"  />
            <stop offset="100%" stopColor="white" stopOpacity="0.12" />
          </radialGradient>
          <mask id={`${uid}-brightmask`}>
            <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-front)`} />
          </mask>
          <clipPath id={`${uid}-clip`}>
            <circle cx={cx} cy={cy} r={r} />
          </clipPath>
          {/* Pulse glow filter */}
          <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Arc path for animateMotion */}
          <path
            id={`${uid}-pulse-path`}
            d={`M ${travelArc.x1} ${travelArc.y1} Q ${travelMidX} ${travelMidY} ${travelArc.x2} ${travelArc.y2}`}
          />
        </defs>

        {/* Ambient fill */}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-fill)`} />

        {/* Latitude lines — back (dimmer) */}
        {latitudes.map(({ deg, w, o }) => {
          const y  = latToY(deg);
          const rx = latToRx(deg);
          if (rx < 4) return null;
          return (
            <ellipse key={`lat-back-${deg}`}
              cx={cx} cy={y} rx={rx} ry={rx * 0.07}
              stroke="hsl(150 50% 38%)"
              strokeWidth={w}
              strokeOpacity={String(parseFloat(o) * 0.5)}
              fill="none"
            />
          );
        })}

        {/* Meridians — back (dimmer) */}
        {meridians.map(({ deg, o, dash }) => (
          <g key={`mer-back-${deg}`} style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${deg + 90}deg)` }}>
            <ellipse cx={cx} cy={cy} rx={r * 0.08} ry={r}
              stroke="hsl(150 50% 35%)"
              strokeWidth="0.5"
              strokeOpacity={String(parseFloat(o) * 0.45)}
              strokeDasharray={dash === "none" ? undefined : dash}
              fill="none"
            />
          </g>
        ))}

        {/* Latitude lines — front (bright) */}
        <g mask={`url(#${uid}-brightmask)`}>
          {latitudes.map(({ deg, w, o }) => {
            const y  = latToY(deg);
            const rx = latToRx(deg);
            if (rx < 4) return null;
            return (
              <ellipse key={`lat-front-${deg}`}
                cx={cx} cy={y} rx={rx} ry={rx * 0.07}
                stroke="hsl(150 60% 50%)"
                strokeWidth={w}
                strokeOpacity={o}
                fill="none"
              />
            );
          })}
        </g>

        {/* Meridians — front (bright) */}
        <g mask={`url(#${uid}-brightmask)`}>
          {meridians.map(({ deg, o, dash }) => (
            <g key={`mer-front-${deg}`} style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${deg + 90}deg)` }}>
              <ellipse cx={cx} cy={cy} rx={r * 0.08} ry={r}
                stroke="hsl(150 60% 52%)"
                strokeWidth="0.7"
                strokeOpacity={o}
                strokeDasharray={dash === "none" ? undefined : dash}
                fill="none"
              />
            </g>
          ))}
        </g>

        {/* Outer rim */}
        <circle cx={cx} cy={cy} r={r}     stroke="hsl(150 55% 44%)" strokeWidth="0.8"  strokeOpacity="0.32" fill="none" />
        <circle cx={cx} cy={cy} r={r}     fill={`url(#${uid}-edge)`} />
        {/* Inner atmospheric ring */}
        <circle cx={cx} cy={cy} r={r * 0.94} stroke="hsl(150 50% 40%)" strokeWidth="0.3" strokeOpacity="0.06" fill="none" />

        {/* Signal arcs */}
        {arcs.map((arc, i) => {
          const midX = (arc.x1 + arc.x2) / 2;
          const midY = (arc.y1 + arc.y2) / 2 - r * 0.18;
          return (
            <path key={`arc-${i}`}
              d={`M ${arc.x1} ${arc.y1} Q ${midX} ${midY} ${arc.x2} ${arc.y2}`}
              stroke={arc.bright ? "hsl(150 65% 54%)" : "hsl(150 55% 43%)"}
              strokeWidth={arc.bright ? "0.9" : "0.6"}
              strokeOpacity={arc.bright ? "0.38" : "0.18"}
              fill="none"
              strokeDasharray="5 7"
            />
          );
        })}

        {/* All nodes — small */}
        {nodePoints.map((n, i) => (
          <circle key={`node-${i}`} cx={n.x} cy={n.y} r="1.5"
            fill="hsl(150 65% 60%)"
            fillOpacity={pulseIndices.includes(i) ? "0.75" : "0.3"}
          />
        ))}

        {/* Pulse rings — sparse */}
        {pulseIndices.map((idx, i) => {
          const n   = nodePoints[idx];
          const dur = `${5.5 + i * 2.8}s`;
          const del = `${i * 2.1}s`;
          return (
            <circle key={`pulse-${i}`} cx={n.x} cy={n.y} r="1.5"
              fill="hsl(150 65% 60%)" fillOpacity="0">
              <animate attributeName="r"            values="1.5;10;1.5" dur={dur} begin={del} repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.45;0;0.45" dur={dur} begin={del} repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* Slow rotating ring — 65s */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "wgRotate 65s linear infinite" }}>
          <ellipse cx={cx} cy={cy} rx={r * 0.1} ry={r}
            stroke="hsl(150 60% 52%)" strokeWidth="0.8" strokeOpacity="0.18"
            fill="none" strokeDasharray="3 10"
          />
        </g>

        {/* Counter-rotating ring — 90s */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: "wgRotateR 90s linear infinite" }}>
          <ellipse cx={cx} cy={cy} rx={r * 0.16} ry={r}
            stroke="hsl(150 50% 42%)" strokeWidth="0.5" strokeOpacity="0.11"
            fill="none" strokeDasharray="2 14"
          />
        </g>

        {/* Third orbital ring — slow, tilted via animateTransform */}
        <ellipse cx={cx} cy={cy} rx={r * 0.07} ry={r * 1.01}
          stroke="hsl(150 45% 36%)" strokeWidth="0.35" strokeOpacity="0.07"
          fill="none" strokeDasharray="1.5 22">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`32 ${cx} ${cy}`}
            to={`392 ${cx} ${cy}`}
            dur="160s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Radar sweep — clipped to globe, very subtle */}
        <g clipPath={`url(#${uid}-clip)`}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.97}
            stroke="hsl(150 65% 58%)" strokeWidth="0.7" strokeOpacity="0.17">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cy}`}
              to={`360 ${cx} ${cy}`}
              dur="20s"
              repeatCount="indefinite"
            />
          </line>
        </g>

        {/* Traveling signal pulse along arc 0 */}
        <circle r="2" fill="hsl(150 72% 68%)" fillOpacity="0" filter={`url(#${uid}-glow)`}>
          <animateMotion dur="13s" repeatCount="indefinite" begin="6s">
            <mpath href={`#${uid}-pulse-path`} />
          </animateMotion>
          <animate attributeName="fill-opacity"
            values="0;0;0.88;0.88;0"
            keyTimes="0;0.04;0.12;0.88;1"
            dur="13s" repeatCount="indefinite" begin="6s"
          />
          <animate attributeName="r"
            values="1;2.5;2;1"
            keyTimes="0;0.12;0.88;1"
            dur="13s" repeatCount="indefinite" begin="6s"
          />
        </circle>

        {/* Center crosshair */}
        <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke="hsl(150 65% 57%)" strokeWidth="0.5" strokeOpacity="0.45" />
        <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke="hsl(150 65% 57%)" strokeWidth="0.5" strokeOpacity="0.45" />
        <circle cx={cx} cy={cy} r="2.5" fill="hsl(150 65% 60%)" fillOpacity="0.55" />
        <circle cx={cx} cy={cy} r="5.5" stroke="hsl(150 60% 52%)" strokeWidth="0.4" strokeOpacity="0.28" fill="none" />
        <circle cx={cx} cy={cy} r="11" stroke="hsl(150 55% 45%)" strokeWidth="0.3" strokeOpacity="0.12" fill="none" />
      </svg>

      <style>{`
        @keyframes wgRotate  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes wgRotateR { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
          animateTransform, animateMotion, animate { display: none; }
        }
      `}</style>
    </div>
  );
}
