import { motion } from "framer-motion";
import { ChevronRight, Radio, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/ApplicationModal";
import { WireGlobeGraphic } from "@/components/graphics/WireGlobeGraphic";
import { SignalGridOverlay } from "@/components/graphics/SignalGridOverlay";

interface HeroProps {
  onLoginOpen?: () => void;
}

export const Hero = ({ onLoginOpen }: HeroProps) => {
  return (
    <section className="relative overflow-hidden min-h-[94vh] flex items-center border-b border-white/[0.04]">
      {/* Atmospheric base */}
      <SignalGridOverlay opacity={0.45} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_20%_55%,_hsl(150_55%_30%_/_0.09)_0%,_transparent_70%)] pointer-events-none" />
      {/* Darkening wedge toward right — creates left-right separation */}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,_transparent_40%,_rgba(4,6,5,0.65)_70%,_rgba(3,5,4,0.85)_100%)] pointer-events-none" />
      {/* Top + bottom accent rules */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10 w-full py-32 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-0 items-center">

          {/* LEFT — Copy & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="relative pr-0 lg:pr-12"
          >
            {/* Vertical left structural rule */}
            <div className="absolute -left-8 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-primary/18 to-transparent hidden xl:block" />

            {/* Status bar */}
            <div className="flex items-center gap-4 mb-9">
              <div className="flex items-center gap-2.5 px-3 py-1.5 glass-panel border-primary/20">
                <span className="status-dot-active" />
                <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-[0.25em]">Network Active</span>
              </div>
              <div className="hidden md:flex items-center gap-2 font-mono text-[9px] text-muted-foreground/35 uppercase tracking-[0.2em]">
                <span className="w-4 h-px bg-current" />
                RSR // Secure Operations
              </div>
            </div>

            {/* Headline with glow layer */}
            <div className="mb-7 relative">
              {/* Faint bloom behind headline */}
              <div className="absolute -left-8 top-0 w-[120%] h-full bg-[radial-gradient(ellipse_70%_60%_at_30%_50%,_hsl(150_55%_30%_/_0.06)_0%,_transparent_70%)] blur-2xl pointer-events-none" />
              <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[5.5rem] font-bold uppercase tracking-[-0.02em] leading-[0.86] relative">
                <span className="block text-foreground/92 mb-1">Independent</span>
                <span className="block relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[hsl(150_55%_40%)] to-primary/30">
                    Press Command
                  </span>
                  {/* Glow echo */}
                  <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-primary via-[hsl(150_55%_40%)] to-primary/30 blur-2xl opacity-20 select-none" aria-hidden>
                    Press Command
                  </span>
                </span>
              </h1>
            </div>

            <p className="text-[1.0625rem] text-muted-foreground/60 font-sans max-w-[520px] mb-10 leading-[1.65]">
              RSR Press Corps is the field reporting infrastructure of Red State Rhetoric — a credentialed operations hub for correspondents, analysts, and deployed field operators.
            </p>

            {/* CTA strip — unified command interface feel */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 mb-9">
              <ApplicationModal trigger={
                <Button
                  size="lg"
                  className="h-12 px-8 font-mono uppercase tracking-[0.18em] font-bold bg-primary hover:bg-primary/88 text-primary-foreground rounded-none text-[10px] btn-primary-depth group flex-shrink-0"
                  data-testid="btn-join-hero"
                >
                  Request Access
                  <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Button>
              } />
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-7 font-mono uppercase tracking-[0.18em] font-bold border-white/12 hover:bg-white/[0.03] hover:border-white/20 rounded-none text-[10px] flex-shrink-0 border-l-0 sm:border-l-0"
                data-testid="btn-ops-hero"
                onClick={() => document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Operations
              </Button>
              {onLoginOpen && (
                <button
                  className="h-12 px-6 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/40 hover:text-muted-foreground/65 transition-colors duration-200 border border-white/[0.06] border-l-0 sm:border-l-0 flex-shrink-0"
                  onClick={onLoginOpen}
                >
                  Correspondent Login
                </button>
              )}
            </div>

            {/* Metadata strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[9px] text-muted-foreground/28 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5">
                <Radio className="w-2.5 h-2.5 opacity-60" />
                Field Reporting Network
              </span>
              <span className="w-1 h-1 rounded-full bg-current opacity-40" />
              <span>Independent Operations</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-40" />
              <span>Credentialed Access</span>
            </div>
          </motion.div>

          {/* RIGHT — Globe system */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            {/* Globe outer bloom */}
            <div className="absolute inset-[-20%] bg-[radial-gradient(ellipse_at_center,_hsl(150_55%_30%_/_0.1)_0%,_transparent_60%)] pointer-events-none blur-3xl" />

            <div className="relative">
              <WireGlobeGraphic size={476} opacity={0.72} className="relative z-10" />

              {/* Left-edge vignette — blends globe into copy zone */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(4,6,5,0.85)_0%,_rgba(4,6,5,0.35)_25%,_transparent_55%)] pointer-events-none z-20" />
              {/* Top & bottom fade */}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(4,6,5,0.6)_0%,_transparent_25%,_transparent_75%,_rgba(4,6,5,0.55)_100%)] pointer-events-none z-20" />

              {/* System labels */}
              <div className="absolute top-6 left-6 z-30">
                <div className="font-mono text-[8px] text-primary/35 uppercase tracking-[0.25em] mb-1">Field Coverage Grid</div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-2.5 h-2.5 text-primary/30" />
                  <span className="font-mono text-[8px] text-primary/28 uppercase tracking-[0.2em]">Live</span>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 z-30 text-right">
                <div className="font-mono text-[8px] text-muted-foreground/18 uppercase tracking-[0.2em]">RSR // Global</div>
                <div className="font-mono text-[8px] text-muted-foreground/13 uppercase tracking-[0.15em]">Signal Network</div>
              </div>

              {/* Corner bracket TL */}
              <div className="absolute top-4 right-4 z-30 w-5 h-5 border-t border-r border-primary/15" />
              {/* Corner bracket BR */}
              <div className="absolute bottom-4 left-4 z-30 w-5 h-5 border-b border-l border-primary/15" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
