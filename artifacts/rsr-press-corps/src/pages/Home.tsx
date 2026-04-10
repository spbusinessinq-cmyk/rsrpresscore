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

      <header className="fixed top-0 w-full z-50 border-b border-white/[0.07] bg-[rgba(8,12,9,0.9)] backdrop-blur-xl">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-4 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 glass-panel border-primary/30 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono font-bold text-[9px] text-primary/50 uppercase tracking-[0.35em]">Red State Rhetoric</span>
              <span className="font-mono font-bold text-[15px] uppercase tracking-[0.12em] leading-tight">RSR PRESS CORPS</span>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55 hover:text-muted-foreground hover:bg-white/[0.03] hidden md:inline-flex h-8 px-4"
              onClick={() => document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Operations
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55 hover:text-muted-foreground hover:bg-white/[0.03] hidden md:inline-flex h-8 px-4"
              onClick={() => document.getElementById('tiers')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Access Tiers
            </Button>
            <div className="w-px h-3.5 bg-white/10 mx-2 hidden md:block" />
            <Button
              variant="outline"
              size="sm"
              className="font-mono text-[10px] uppercase tracking-[0.18em] border-white/12 hover:border-white/22 hover:bg-white/[0.03] rounded-none h-8 px-4 text-muted-foreground/70"
              onClick={() => setLoginOpen(true)}
              data-testid="btn-login-nav"
            >
              Login
            </Button>
            <ApplicationModal trigger={
              <Button
                size="sm"
                className="font-mono text-[10px] uppercase tracking-[0.18em] bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-8 px-4 ml-1 btn-primary-depth"
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

      <footer className="py-12 border-t border-white/[0.05] text-center bg-black/70 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/12 to-transparent" />
        <div className="flex items-center justify-center gap-2 mb-3 opacity-30">
          <Shield className="w-3 h-3" />
          <span className="font-mono font-bold tracking-[0.3em] text-xs uppercase">RSR Press Corps</span>
        </div>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] opacity-35">
          Independent Press Infrastructure &bull; Field Operations &bull; &copy; {new Date().getFullYear()}
        </p>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </main>
  );
}
