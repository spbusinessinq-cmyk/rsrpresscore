import { motion } from "framer-motion";
import { ChevronRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/ApplicationModal";
import { WireGlobeGraphic } from "@/components/graphics/WireGlobeGraphic";
import { SignalGridOverlay } from "@/components/graphics/SignalGridOverlay";

interface HeroProps {
  onLoginOpen?: () => void;
}

export const Hero = ({ onLoginOpen }: HeroProps) => {
  return (
    <section className="pt-32 pb-24 md:pt-44 md:pb-32 relative border-b border-white/[0.04] overflow-hidden min-h-[92vh] flex items-center">
      {/* Background layers */}
      <SignalGridOverlay opacity={0.5} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_25%_50%,_hsl(150_55%_33%_/_0.1)_0%,_transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_75%_50%,_rgba(0,0,0,0.7)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — Copy & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Left structural rule */}
            <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden xl:block" />

            {/* System status bar */}
            <div className="flex items-center gap-5 mb-8">
              <div className="flex items-center gap-2.5 px-3 py-1.5 glass-panel">
                <span className="status-dot-active" />
                <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Network Active</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground/45 uppercase tracking-widest hidden md:flex">
                <span className="w-3 h-px bg-current opacity-50" />
                RSR // Secure Operations
              </div>
            </div>

            {/* Headline */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold uppercase tracking-tighter leading-[0.88]">
                <span className="block text-foreground/95">Independent</span>
                <span className="block relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/85 to-primary/35">Press Command</span>
                  <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/85 to-primary/35 blur-xl opacity-25 select-none">Press Command</span>
                </span>
              </h1>
            </div>

            <p className="text-base text-secondary-foreground/75 font-sans max-w-lg mb-10 leading-relaxed">
              RSR Press Corps is the field reporting infrastructure of Red State Rhetoric — a credentialed operations hub for correspondents, analysts, and deployed field operators.
            </p>

            {/* CTA panel */}
            <div className="flex flex-wrap items-stretch gap-0">
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
                  className="h-[58px] px-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 hover:text-muted-foreground transition-colors glass-panel border-l-0"
                  onClick={onLoginOpen}
                >
                  Correspondent Login
                </button>
              )}
            </div>

            {/* Metadata strip */}
            <div className="flex items-center gap-5 mt-8 font-mono text-[10px] text-muted-foreground/35 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Radio className="w-2.5 h-2.5" />Field Reporting</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-50" />
              <span>Independent Operations</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-50" />
              <span>Credentialed Access</span>
            </div>
          </motion.div>

          {/* RIGHT — Globe visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Globe container with vignette edges */}
            <div className="relative">
              {/* Bloom behind globe */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(150_55%_33%_/_0.12)_0%,_transparent_65%)] pointer-events-none blur-2xl" />

              <WireGlobeGraphic size={480} opacity={0.65} className="relative z-10" />

              {/* Globe edge vignettes */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_5%_50%,_hsl(220_16%_6%)_0%,_transparent_50%)] pointer-events-none z-20" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_100%_at_50%_0%,_hsl(220_16%_6%)_0%,_transparent_50%)] pointer-events-none z-20" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_80%_at_50%_100%,_hsl(220_16%_6%)_0%,_transparent_45%)] pointer-events-none z-20" />

              {/* Overlaid system labels */}
              <div className="absolute top-8 left-8 z-30 flex flex-col gap-1.5">
                <div className="font-mono text-[9px] text-primary/40 uppercase tracking-widest">Field Coverage Grid</div>
                <div className="flex items-center gap-1.5">
                  <span className="status-dot-active" style={{ width: '4px', height: '4px' }} />
                  <span className="font-mono text-[9px] text-primary/30 uppercase tracking-widest">Live</span>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 z-30 text-right">
                <div className="font-mono text-[9px] text-muted-foreground/20 uppercase tracking-widest">RSR // Global</div>
                <div className="font-mono text-[9px] text-muted-foreground/15 uppercase tracking-widest">Signal Network</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
