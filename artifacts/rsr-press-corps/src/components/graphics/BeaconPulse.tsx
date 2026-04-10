interface BeaconPulseProps {
  size?: number;
  className?: string;
  rings?: number;
}

export function BeaconPulse({ size = 320, className = "", rings = 4 }: BeaconPulseProps) {
  const cx = size / 2;
  const cy = size / 2;
  const baseR = size * 0.06;
  const maxR  = size * 0.46;

  return (
    <div
      className={`relative pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <defs>
          <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="hsl(150 60% 38%)" stopOpacity="0.18" />
            <stop offset="55%"  stopColor="hsl(150 55% 30%)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent"       stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* Background ambient fill */}
        <circle cx={cx} cy={cy} r={maxR} fill="url(#beaconGlow)" />

        {/* Concentric pulsing rings — staggered timing */}
        {Array.from({ length: rings }).map((_, i) => {
          const delay = `${i * 1.6}s`;
          const dur   = `${6.5 + i * 0.3}s`;
          const startR = baseR + i * 2;
          return (
            <circle key={i} cx={cx} cy={cy} r={startR}
              stroke="hsl(150 60% 46%)" strokeWidth="0.7" strokeOpacity="0" fill="none">
              <animate
                attributeName="r"
                values={`${startR};${maxR * (0.65 + i * 0.1)};${startR}`}
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0;0.25;0.1;0"
                keyTimes="0;0.15;0.7;1"
                dur={dur}
                begin={delay}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Static rings — structural depth */}
        <circle cx={cx} cy={cy} r={maxR * 0.35}
          stroke="hsl(150 55% 40%)" strokeWidth="0.5" strokeOpacity="0.12" fill="none"
          strokeDasharray="3 8" />
        <circle cx={cx} cy={cy} r={maxR * 0.65}
          stroke="hsl(150 50% 38%)" strokeWidth="0.4" strokeOpacity="0.07" fill="none"
          strokeDasharray="2 12" />

        {/* Center beacon — small bright core */}
        <circle cx={cx} cy={cy} r={baseR * 1.2}
          fill="hsl(150 60% 40%)" fillOpacity="0.12" stroke="hsl(150 65% 52%)" strokeWidth="0.8" strokeOpacity="0.4" />
        <circle cx={cx} cy={cy} r={baseR * 0.45}
          fill="hsl(150 70% 58%)" fillOpacity="0.7">
          <animate attributeName="fill-opacity" values="0.7;0.4;0.7" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Crosshair lines through center */}
        <line x1={cx - maxR * 0.2} y1={cy} x2={cx + maxR * 0.2} y2={cy}
          stroke="hsl(150 65% 55%)" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1={cx} y1={cy - maxR * 0.2} x2={cx} y2={cy + maxR * 0.2}
          stroke="hsl(150 65% 55%)" strokeWidth="0.5" strokeOpacity="0.3" />
      </svg>
    </div>
  );
}
