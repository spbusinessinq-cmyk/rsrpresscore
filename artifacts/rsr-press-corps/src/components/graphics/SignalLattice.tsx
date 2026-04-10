interface SignalLatticeProps {
  className?: string;
  orientation?: "vertical" | "horizontal";
  density?: number;
  opacity?: number;
}

export function SignalLattice({ className = "", orientation = "vertical", density = 8, opacity = 0.6 }: SignalLatticeProps) {
  const cols = orientation === "vertical" ? density : density * 2;
  const rows = orientation === "vertical" ? density * 2 : density;
  const w = cols * 40;
  const h = rows * 40;

  const hotNodes = [
    { c: 2, r: 3 }, { c: 5, r: 1 }, { c: 1, r: 6 }, { c: 4, r: 5 }, { c: 6, r: 8 }, { c: 3, r: 10 },
  ].filter(n => n.c < cols && n.r < rows);

  const diagonals = [
    { x1: 0, y1: 40, x2: w, y2: h * 0.6 },
    { x1: w * 0.3, y1: 0, x2: 0, y2: h * 0.7 },
    { x1: w, y1: h * 0.2, x2: w * 0.1, y2: h },
  ];

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      <defs>
        <radialGradient id="latticeGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="hsl(150 55% 38%)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={w} height={h} fill="url(#latticeGrad)" />

      {/* Grid lines — horizontal */}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <line
          key={`h-${i}`}
          x1={0} y1={i * 40} x2={w} y2={i * 40}
          stroke="hsl(150 55% 38%)" strokeWidth="0.4"
          strokeOpacity={i % 4 === 0 ? "0.18" : "0.08"}
        />
      ))}

      {/* Grid lines — vertical */}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 40} y1={0} x2={i * 40} y2={h}
          stroke="hsl(150 55% 38%)" strokeWidth="0.4"
          strokeOpacity={i % 4 === 0 ? "0.18" : "0.08"}
        />
      ))}

      {/* Diagonal traces */}
      {diagonals.map((d, i) => (
        <line
          key={`diag-${i}`}
          x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
          stroke="hsl(150 55% 45%)" strokeWidth="0.5"
          strokeOpacity="0.1"
          strokeDasharray="6 16"
        />
      ))}

      {/* Hot node markers */}
      {hotNodes.map((n, i) => {
        const x = n.c * 40;
        const y = n.r * 40;
        const dur = `${4.5 + i * 1.2}s`;
        const delay = `${i * 0.7}s`;
        return (
          <g key={`hn-${i}`}>
            <rect x={x - 4} y={y - 4} width={8} height={8}
              stroke="hsl(150 60% 50%)" strokeWidth="0.7" strokeOpacity="0.3" fill="none" />
            <circle cx={x} cy={y} r="1.5" fill="hsl(150 65% 58%)" fillOpacity="0.45" />
            <circle cx={x} cy={y} r="1.5" fill="hsl(150 65% 58%)" fillOpacity="0">
              <animate attributeName="r" values="1.5;8;1.5" dur={dur} begin={delay} repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.25;0;0.25" dur={dur} begin={delay} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
