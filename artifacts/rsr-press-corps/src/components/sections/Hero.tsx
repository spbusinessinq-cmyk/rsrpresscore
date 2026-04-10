import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/ApplicationModal";

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 relative border-b border-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 border border-primary/30 rounded-none mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">Network Active // Secure</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.9] mb-6">
            Independent<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Media Command</span>
          </h1>
          <p className="text-lg md:text-2xl text-secondary-foreground font-mono max-w-2xl mb-10 leading-[1.5]">
            RSR Press Corps is the field reporting infrastructure of Red State Rhetoric. A live operations hub for credentialed correspondents, analysts, and operators.
          </p>
          <div className="flex flex-wrap gap-4">
            <ApplicationModal trigger={
              <Button size="lg" className="h-14 px-8 font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-none text-sm group" data-testid="btn-join-hero">
                Request Access
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            } />
            <Button size="lg" variant="outline" className="h-14 px-8 font-mono uppercase tracking-widest font-bold border-primary/50 hover:bg-primary/10 rounded-none text-sm" data-testid="btn-ops-hero" onClick={() => document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' })}>
              View Operations
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
