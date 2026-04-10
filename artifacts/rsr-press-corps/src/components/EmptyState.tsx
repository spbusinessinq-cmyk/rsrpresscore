import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  label: string;
  subtext?: string;
  icon?: LucideIcon;
}

export function EmptyState({ label, subtext, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 glass-panel relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/3 to-transparent" />

      {/* Grid row guides */}
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      {Icon && (
        <div className="w-9 h-9 border border-white/8 bg-black/30 flex items-center justify-center mb-5">
          <Icon className="w-4 h-4 text-muted-foreground/20" />
        </div>
      )}

      <div className="font-mono text-[11px] text-muted-foreground/45 uppercase tracking-[0.28em] mb-1.5">{label}</div>

      {subtext && (
        <div className="font-mono text-[9px] text-muted-foreground/22 uppercase tracking-widest">{subtext}</div>
      )}
    </div>
  );
}
