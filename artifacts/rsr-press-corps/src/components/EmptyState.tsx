import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  label: string;
  subtext?: string;
  icon?: LucideIcon;
  operationalLine?: string;
}

export function EmptyState({ label, subtext, icon: Icon, operationalLine }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 relative overflow-hidden">
      {/* Grid backdrop */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(60,120,75,1) 1px, transparent 1px), linear-gradient(90deg, rgba(60,120,75,1) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Slow horizontal scan line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="hsl(150 60% 45%)" strokeWidth="0.5" strokeOpacity="0.12">
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 80; 0 0" dur="8s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.12;0.04;0.12" dur="8s" repeatCount="indefinite" />
        </line>
      </svg>

      {/* Top / bottom accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/12 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      {/* Center content */}
      <div className="relative flex flex-col items-center">
        {Icon ? (
          <div className="w-10 h-10 border border-primary/15 flex items-center justify-center mb-5 relative">
            <Icon className="w-4 h-4 text-muted-foreground/20" />
            <div className="absolute inset-0 border border-primary/8 scale-[1.35]" />
          </div>
        ) : (
          <div className="relative w-12 h-12 flex items-center justify-center mb-5">
            {/* Outer rings */}
            <div className="absolute inset-0 border border-primary/15" />
            <div className="absolute inset-0 border border-primary/7 scale-[1.45]" />
            <div className="absolute inset-0 border border-primary/4 scale-[1.85]" />
            {/* Crosshair lines */}
            <div className="w-px h-4 bg-primary/25 absolute left-1/2 top-0 -translate-x-1/2" />
            <div className="w-px h-4 bg-primary/25 absolute left-1/2 bottom-0 -translate-x-1/2" />
            <div className="h-px w-4 bg-primary/25 absolute top-1/2 left-0 -translate-y-1/2" />
            <div className="h-px w-4 bg-primary/25 absolute top-1/2 right-0 -translate-y-1/2" />
            {/* Center dot — pulsing */}
            <div className="w-2 h-2 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-primary/60">
                <span className="status-dot-active" style={{ width: 3, height: 3 }} />
              </div>
            </div>
          </div>
        )}

        <div className="font-mono text-[10px] text-muted-foreground/38 uppercase tracking-[0.3em] mb-2">{label}</div>

        {subtext ? (
          <div className="font-mono text-[9px] text-muted-foreground/20 uppercase tracking-[0.22em]">{subtext}</div>
        ) : (
          <div className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground/18 uppercase tracking-[0.22em]">
            <span className="status-dot-active" style={{ width: 4, height: 4, flexShrink: 0 }} />
            {operationalLine || "System Active — Awaiting Input"}
          </div>
        )}

        {/* Bottom tactical line */}
        <div className="mt-5 flex items-center gap-2 opacity-60">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/20" />
          <div className="w-1 h-1 bg-primary/20" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/20" />
        </div>
      </div>
    </div>
  );
}
