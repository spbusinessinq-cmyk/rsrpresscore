import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/ApplicationModal";

interface HeroProps {
  onLoginOpen?: () => void;
}

export const Hero = ({ onLoginOpen }: HeroProps) => {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 relative border-b border-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_60%,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 border border-primary/25 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-[0.25em]">Network Active // Operations Ongoing</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-6">
            Independent<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/40">Press Command</span>
          </h1>

          <p className="text-base md:text-xl text-secondary-foreground font-sans max-w-2xl mb-10 leading-relaxed">
            RSR Press Corps is the field reporting infrastructure of Red State Rhetoric — a credentialed operations hub for correspondents, analysts, and deployed field operators.
          </p>

          <div className="flex flex-wrap gap-3">
            <ApplicationModal trigger={
              <Button
                size="lg"
                className="h-12 px-8 font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-none text-xs group"
                data-testid="btn-join-hero"
              >
                Request Access
                <ChevronRight className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            } />

            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 font-mono uppercase tracking-widest font-bold border-white/20 hover:bg-white/5 hover:border-white/30 rounded-none text-xs"
              data-testid="btn-ops-hero"
              onClick={() => document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Operations
            </Button>

            {onLoginOpen && (
              <Button
                size="lg"
                variant="ghost"
                className="h-12 px-8 font-mono uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground hover:bg-transparent rounded-none text-xs"
                onClick={onLoginOpen}
              >
                Correspondent Login
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
