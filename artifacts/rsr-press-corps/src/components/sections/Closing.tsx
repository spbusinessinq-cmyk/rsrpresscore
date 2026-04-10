import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/ApplicationModal";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export const Closing = () => {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleEnter = () => {
    if (user?.role === "operator") {
      setLocation("/command");
    } else if (user?.role === "member") {
      setLocation("/portal");
    }
  };

  return (
    <section className="py-36 relative overflow-hidden section-inset">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,_hsl(150_55%_33%_/_0.08)_0%,_transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_50%_100%,_rgba(0,0,0,0.5)_0%,_transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <div className="w-14 h-14 border border-primary/30 bg-primary/8 flex items-center justify-center mb-8 tactical-glow">
            <Shield className="w-7 h-7 text-primary" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
            <span className="font-mono text-[10px] text-primary/50 uppercase tracking-[0.3em]">Stand By for Tasking</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6 leading-none">
            The Narrative Is
            <br />
            <span className="text-primary">Shaped in the Field</span>
          </h2>

          <p className="text-sm font-sans text-secondary-foreground/70 mb-10 max-w-lg mx-auto leading-relaxed">
            Secure your credentials. Receive your tasking. The corps operates continuously. Await command.
          </p>

          {user ? (
            <Button
              onClick={handleEnter}
              size="lg"
              className="h-12 px-10 text-sm font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-none btn-primary-depth"
              data-testid="btn-join-footer"
            >
              Enter the Corps
            </Button>
          ) : (
            <ApplicationModal trigger={
              <Button
                size="lg"
                className="h-12 px-10 text-sm font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-none btn-primary-depth"
                data-testid="btn-join-footer"
              >
                Enter the Corps
              </Button>
            } />
          )}

          <div className="flex items-center gap-4 mt-10 font-mono text-[10px] text-muted-foreground/25 uppercase tracking-widest">
            <span>Independent Press</span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>Field Operations</span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>RSR Network</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
