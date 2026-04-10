import { motion } from "framer-motion";
import { ChevronRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/ApplicationModal";

interface HeroProps {
  onLoginOpen?: () => void;
}

export const Hero = ({ onLoginOpen }: HeroProps) => {
  return (
    <section className="pt-32 pb-24 md:pt-48 md:pb-36 relative border-b border-white/[0.04] overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_30%_60%,_hsl(150_55%_33%_/_0.09)_0%,_transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,_hsl(220_16%_4%_/_0.8)_0%,_transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Left structural rule */}
      <div className="absolute left-8 top-32 bottom-24 w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent hidden xl:block" />

      {/* Right atmosphere */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_80%_30%,_rgba(10,18,12,0.6)_0%,_transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          {/* System status bar */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2.5 px-3 py-1.5 glass-panel">
              <span className="status-dot-active" />
              <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Network Active</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest hidden md:flex">
              <span className="w-3 h-px bg-current opacity-50" />
              RSR Press Corps // Secure Operations
            </div>
          </div>

          {/* Main headline with depth */}
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.88]">
              <span className="block text-foreground/95">Independent</span>
              <span className="block relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/30">Press Command</span>
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/30 blur-xl opacity-30 select-none">Press Command</span>
              </span>
            </h1>
          </div>

          <p className="text-base md:text-lg text-secondary-foreground/80 font-sans max-w-2xl mb-10 leading-relaxed">
            RSR Press Corps is the field reporting infrastructure of Red State Rhetoric — a credentialed operations hub for correspondents, analysts, and deployed field operators.
          </p>

          {/* CTA group panel */}
          <div className="flex flex-wrap items-center gap-0">
            <div className="flex items-center flex-wrap gap-3 px-4 py-3 glass-panel border-r border-white/5">
              <ApplicationModal trigger={
                <Button
                  size="lg"
                  className="h-11 px-7 font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-none text-xs btn-primary-depth group"
                  data-testid="btn-join-hero"
                >
                  Request Access
                  <ChevronRight className="w-3 h-3 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              } />

              <Button
                size="lg"
                variant="outline"
                className="h-11 px-7 font-mono uppercase tracking-widest font-bold border-white/15 hover:bg-white/[0.04] hover:border-white/25 rounded-none text-xs"
                data-testid="btn-ops-hero"
                onClick={() => document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Operations
              </Button>
            </div>

            {onLoginOpen && (
              <button
                className="h-[58px] px-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground transition-colors glass-panel border-l-0"
                onClick={onLoginOpen}
              >
                Correspondent Login
              </button>
            )}
          </div>

          {/* Metadata strip */}
          <div className="flex items-center gap-6 mt-8 font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Radio className="w-2.5 h-2.5" />Field Reporting Network</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
            <span>Independent Operations</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
            <span>Credentialed Access</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
