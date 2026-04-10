interface EmptyStateProps {
  label: string;
  subtext?: string;
}

export function EmptyState({ label, subtext }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 border border-white/5 bg-black/20">
      <div className="font-mono text-xs text-muted-foreground/40 uppercase tracking-[0.3em] mb-2">{label}</div>
      {subtext && (
        <div className="font-mono text-[10px] text-muted-foreground/25 uppercase tracking-widest">{subtext}</div>
      )}
    </div>
  );
}
