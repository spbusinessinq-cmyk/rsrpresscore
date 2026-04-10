interface NetworkNodeFieldProps {
  width?: number;
  height?: number;
  className?: string;
  density?: "low" | "medium" | "high";
}

const NODES_LOW = [
  { x: 12, y: 20 }, { x: 45, y: 8 }, { x: 78, y: 25 }, { x: 32, y: 45 },
  { x: 65, y: 55 }, { x: 90, y: 40 }, { x: 20, y: 75 }, { x: 55, y: 80 },
  { x: 80, y: 70 }, { x: 40, y: 92 }, { x: 8, y: 52 }, { x: 72, y: 88 },
];

const CONNECTIONS_LOW = [
  [0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [2, 5],
  [3, 6], [4, 7], [5, 8], [6, 7], [7, 8], [6, 9],
  [7, 9], [8, 11], [0, 10], [3, 10], [10, 6],
];

export function NetworkNodeField({ width = 600, height = 400, className = "", density = "medium" }: NetworkNodeFieldProps) {
  const nodes = NODES_LOW;
  const connections = CONNECTIONS_LOW;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      <defs>
        <radialGradient id="nodeFieldGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="hsl(150 55% 33%)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100" height="100" fill="url(#nodeFieldGrad)" />

      {/* Connection lines */}
      {connections.map(([a, b], i) => (
        <line
          key={`conn-${i}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="hsl(150 55% 45%)"
          strokeWidth="0.25"
          strokeOpacity="0.25"
          strokeDasharray={i % 3 === 0 ? "2 3" : "none"}
        />
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={`n-${i}`}>
          <circle cx={n.x} cy={n.y} r="0.7" fill="hsl(150 60% 55%)" fillOpacity="0.5" />
          {i % 4 === 0 && (
            <circle cx={n.x} cy={n.y} r="0.7" fill="hsl(150 60% 55%)" fillOpacity="0.25">
              <animate attributeName="r" values="0.7;2.5;0.7" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.25;0;0.25" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}
