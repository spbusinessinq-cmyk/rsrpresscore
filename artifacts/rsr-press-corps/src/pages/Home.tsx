import { useState } from "react";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationModal } from "@/components/ApplicationModal";
import { LoginModal } from "@/components/LoginModal";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Tiers } from "@/components/sections/Tiers";
import { Credentials } from "@/components/sections/Credentials";
import { Operations } from "@/components/sections/Operations";
import { Process } from "@/components/sections/Process";
import { Benefits } from "@/components/sections/Benefits";
import { Closing } from "@/components/sections/Closing";

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <main className="min-h-[100dvh] w-full relative overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
      <div className="scanline" />

      <header className="fixed top-0 w-full z-50 border-b border-primary/20 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 flex items-center justify-center border border-primary/40">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono font-bold text-xs text-primary/60 uppercase tracking-[0.3em]">Red State Rhetoric</span>
              <span className="font-mono font-bold text-base uppercase tracking-widest leading-tight">RSR PRESS CORPS</span>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hidden md:inline-flex"
              onClick={() => document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Operations
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hidden md:inline-flex"
              onClick={() => document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Access Tiers
            </Button>
            <div className="w-px h-4 bg-white/10 mx-1 hidden md:block" />
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-xs uppercase tracking-widest border-white/20 hover:border-primary/50 hover:bg-primary/5 rounded-none h-8 px-4"
              onClick={() => setLoginOpen(true)}
              data-testid="btn-login-nav"
            >
              Login
            </Button>
            <ApplicationModal trigger={
              <Button
                size="sm"
                className="font-mono text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-8 px-4"
                data-testid="btn-join-header"
              >
                Request Access
              </Button>
            } />
          </nav>
        </div>
      </header>

      <Hero onLoginOpen={() => setLoginOpen(true)} />
      <About />
      <Tiers />
      <Credentials />
      <Operations />
      <Process />
      <Benefits />
      <Closing />

      <footer className="py-12 border-t border-white/5 text-center bg-black/80">
        <div className="flex items-center justify-center gap-2 mb-3 opacity-40">
          <Shield className="w-3 h-3" />
          <span className="font-mono font-bold tracking-[0.3em] text-xs uppercase">RSR Press Corps</span>
        </div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest opacity-60">
          Independent Press Infrastructure &bull; Field Operations &bull; &copy; {new Date().getFullYear()}
        </p>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </main>
  );
}
