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
    <section className="py-32 border-t border-primary/20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.02] mix-blend-screen pointer-events-none" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <div className="w-16 h-16 border border-primary/50 bg-black/50 flex items-center justify-center mb-8 tactical-glow">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-6">
            Stand By for <span className="text-primary">Tasking</span>
          </h2>
          <p className="text-xl font-mono text-secondary-foreground mb-10 max-w-xl mx-auto leading-[1.5]">
            The narrative is shaped by those on the ground. Secure your credentials. Await command.
          </p>
          {user ? (
            <Button onClick={handleEnter} size="lg" className="h-16 px-12 text-lg font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-none" data-testid="btn-join-footer">
              Enter the Corps
            </Button>
          ) : (
            <ApplicationModal trigger={
              <Button size="lg" className="h-16 px-12 text-lg font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-none" data-testid="btn-join-footer">
                Enter the Corps
              </Button>
            } />
          )}
        </motion.div>
      </div>
    </section>
  );
};
