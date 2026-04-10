import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/ApplicationModal";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { BeaconPulse } from "@/components/graphics/BeaconPulse";
import { SignalGridOverlay } from "@/components/graphics/SignalGridOverlay";

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

      {/* Background layers */}
      <SignalGridOverlay opacity={0.25} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,_hsl(150_55%_33%_/_0.09)_0%,_transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_50%_100%,_rgba(0,0,0,0.5)_0%,_transparent_100%)] pointer-events-none" />

      {/* Beacon pulse — centered background graphic */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <BeaconPulse size={600} rings={5} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          {/* Shield icon with ScanFrame feel */}
          <div className="relative mb-8">
            <div className="w-16 h-16 border border-primary/30 bg-primary/8 flex items-center justify-center tactical-glow relative">
              <Shield className="w-8 h-8 text-primary" />
              {/* Outer bracket accents */}
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t border-l border-primary/30" />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t border-r border-primary/30" />
              <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b border-l border-primary/30" />
              <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b border-r border-primary/30" />
            </div>
            {/* Outer ring */}
            <div className="absolute inset-[-12px] border border-primary/12 pointer-events-none" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
            <div className="flex items-center gap-2">
              <span className="status-dot-active" style={{ width: 4, height: 4 }} />
              <span className="font-mono text-[10px] text-primary/50 uppercase tracking-[0.3em]">Stand By for Tasking</span>
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6 leading-none">
            The Narrative Is
            <br />
            <span className="text-primary">Shaped in the Field</span>
          </h2>

          <p className="text-sm font-sans text-secondary-foreground/68 mb-10 max-w-lg mx-auto leading-relaxed">
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

          {/* Signal route strip — live network sense */}
          <div className="mt-10 w-full max-w-sm">
            <svg viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <line x1="0" y1="6" x2="300" y2="6" stroke="hsl(150 50% 40%)" strokeWidth="0.5" strokeOpacity="0.18" strokeDasharray="4 8" />
              <circle cx="150" cy="6" r="2.5" fill="hsl(150 65% 55%)" fillOpacity="0.5">
                <animate attributeName="fill-opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="60"  cy="6" r="1.5" fill="hsl(150 60% 48%)" fillOpacity="0.3" />
              <circle cx="240" cy="6" r="1.5" fill="hsl(150 60% 48%)" fillOpacity="0.3" />
              {/* Traveling pulse on the center line */}
              <circle r="2" fill="hsl(150 70% 62%)" fillOpacity="0">
                <animateMotion dur="6s" repeatCount="indefinite" begin="2s">
                  <mpath href="#closing-line" />
                </animateMotion>
                <animate attributeName="fill-opacity" values="0;0.75;0.75;0" keyTimes="0;0.1;0.9;1" dur="6s" repeatCount="indefinite" begin="2s" />
              </circle>
              <path id="closing-line" d="M 0 6 L 300 6" fill="none" />
            </svg>
          </div>

          <div className="flex items-center gap-4 mt-4 font-mono text-[10px] text-muted-foreground/22 uppercase tracking-widest">
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
