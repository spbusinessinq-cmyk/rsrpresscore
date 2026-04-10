import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  label: string;
  subtext?: string;
  icon?: LucideIcon;
}

export function EmptyState({ label, subtext, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 relative overflow-hidden">
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(60,120,75,1) 1px, transparent 1px), linear-gradient(90deg, rgba(60,120,75,1) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Top accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/12 to-transparent" />

      {/* Center content */}
      <div className="relative flex flex-col items-center">
        {/* Icon or default crosshair */}
        {Icon ? (
          <div className="w-10 h-10 border border-primary/15 flex items-center justify-center mb-5 relative">
            <Icon className="w-4 h-4 text-muted-foreground/20" />
            <div className="absolute inset-0 border border-primary/8 scale-[1.35]" />
          </div>
        ) : (
          <div className="relative w-10 h-10 flex items-center justify-center mb-5">
            {/* Crosshair */}
            <div className="absolute inset-0 border border-primary/15" />
            <div className="absolute inset-0 border border-primary/8 scale-[1.5]" />
            <div className="w-px h-4 bg-primary/25 absolute left-1/2 top-0 -translate-x-1/2" />
            <div className="w-px h-4 bg-primary/25 absolute left-1/2 bottom-0 -translate-x-1/2" />
            <div className="h-px w-4 bg-primary/25 absolute top-1/2 left-0 -translate-y-1/2" />
            <div className="h-px w-4 bg-primary/25 absolute top-1/2 right-0 -translate-y-1/2" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
          </div>
        )}

        <div className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.3em] mb-2">{label}</div>

        {subtext ? (
          <div className="font-mono text-[9px] text-muted-foreground/20 uppercase tracking-[0.22em]">{subtext}</div>
        ) : (
          <div className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground/18 uppercase tracking-[0.22em]">
            <span className="status-dot-active" style={{ width: '4px', height: '4px', flexShrink: 0 }} />
            System Active — Awaiting Input
          </div>
        )}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
    </div>
  );
}
