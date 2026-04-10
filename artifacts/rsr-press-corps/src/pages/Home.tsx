import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Tiers } from "@/components/sections/Tiers";
import { Credentials } from "@/components/sections/Credentials";
import { Operations } from "@/components/sections/Operations";
import { Process } from "@/components/sections/Process";
import { Benefits } from "@/components/sections/Benefits";
import { Closing } from "@/components/sections/Closing";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JoinModal } from "@/components/JoinModal";

export default function Home() {
  return (
    <main className="min-h-[100dvh] w-full relative overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
      <div className="scanline" />
      
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 flex items-center justify-center border border-primary/50 tactical-glow">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <span className="font-mono font-bold text-xl tracking-tight">RSR <span className="text-primary">CORPS</span></span>
          </div>
          <JoinModal trigger={
            <Button variant="outline" size="sm" className="font-mono text-xs uppercase tracking-wider border-primary/50 hover:bg-primary/10" data-testid="btn-join-header">
              Request Access
            </Button>
          } />
        </div>
      </header>

      <Hero />
      <About />
      <Tiers />
      <Credentials />
      <Operations />
      <Process />
      <Benefits />
      <Closing />

      <footer className="py-12 border-t border-white/5 text-center bg-black/80">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <Shield className="w-4 h-4" />
          <span className="font-mono font-bold tracking-widest uppercase">RSR CORPS</span>
        </div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Secure Infrastructure • Independent Press • © 2025
        </p>
      </footer>
    </main>
  );
}
