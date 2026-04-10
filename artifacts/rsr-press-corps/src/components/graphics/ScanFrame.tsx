interface ScanFrameProps {
  className?: string;
  scanDur?: number;
  bracketOpacity?: number;
  scanOpacity?: number;
}

export function ScanFrame({
  className = "",
  scanDur = 5,
  bracketOpacity = 0.45,
  scanOpacity = 0.35,
}: ScanFrameProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
    >
      {/* Corner bracket — TL */}
      <path d="M 2 16 L 2 2 L 16 2"
        stroke="hsl(150 60% 48%)" strokeWidth="0.9" strokeOpacity={bracketOpacity} />
      {/* Corner bracket — TR */}
      <path d="M 84 2 L 98 2 L 98 16"
        stroke="hsl(150 60% 48%)" strokeWidth="0.9" strokeOpacity={bracketOpacity} />
      {/* Corner bracket — BL */}
      <path d="M 2 84 L 2 98 L 16 98"
        stroke="hsl(150 60% 48%)" strokeWidth="0.9" strokeOpacity={bracketOpacity} />
      {/* Corner bracket — BR */}
      <path d="M 84 98 L 98 98 L 98 84"
        stroke="hsl(150 60% 48%)" strokeWidth="0.9" strokeOpacity={bracketOpacity} />

      {/* Micro corner dots */}
      <circle cx="2"  cy="2"  r="1" fill="hsl(150 65% 52%)" fillOpacity={bracketOpacity * 0.8} />
      <circle cx="98" cy="2"  r="1" fill="hsl(150 65% 52%)" fillOpacity={bracketOpacity * 0.8} />
      <circle cx="2"  cy="98" r="1" fill="hsl(150 65% 52%)" fillOpacity={bracketOpacity * 0.8} />
      <circle cx="98" cy="98" r="1" fill="hsl(150 65% 52%)" fillOpacity={bracketOpacity * 0.8} />

      {/* Scan line — vertical sweep */}
      <line x1="2" y1="15" x2="98" y2="15"
        stroke="hsl(150 65% 58%)" strokeWidth="0.6" strokeOpacity={scanOpacity}>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 72; 0 0"
          dur={`${scanDur}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-opacity"
          values={`${scanOpacity}; ${scanOpacity * 0.3}; ${scanOpacity}`}
          dur={`${scanDur}s`}
          repeatCount="indefinite"
        />
      </line>

      {/* Side tick marks */}
      <line x1="2" y1="35" x2="6" y2="35"
        stroke="hsl(150 55% 45%)" strokeWidth="0.5" strokeOpacity={bracketOpacity * 0.6} />
      <line x1="2" y1="65" x2="6" y2="65"
        stroke="hsl(150 55% 45%)" strokeWidth="0.5" strokeOpacity={bracketOpacity * 0.6} />
      <line x1="98" y1="35" x2="94" y2="35"
        stroke="hsl(150 55% 45%)" strokeWidth="0.5" strokeOpacity={bracketOpacity * 0.6} />
      <line x1="98" y1="65" x2="94" y2="65"
        stroke="hsl(150 55% 45%)" strokeWidth="0.5" strokeOpacity={bracketOpacity * 0.6} />
    </svg>
  );
}
