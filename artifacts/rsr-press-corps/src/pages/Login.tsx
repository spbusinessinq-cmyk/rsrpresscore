import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Loader2, Lock, Users, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { WireGlobeGraphic } from "@/components/graphics/WireGlobeGraphic";
import { SignalGridOverlay } from "@/components/graphics/SignalGridOverlay";
import { useMemberLogin } from "@/hooks/useMemberLogin";

type LoginMode = "member" | "operator";
type MemberSubMode = "login" | "signup";

export default function Login() {
  const [mode, setMode] = useState<LoginMode>("member");
  const [memberSubMode, setMemberSubMode] = useState<MemberSubMode>("login");
  const [username, setUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [, setLocation] = useLocation();
  const { setAdminUnlocked } = useAuth();
  const { toast } = useToast();
  const signupMutation = useSignup();
  const memberLogin = useMemberLogin();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setTimeout(() => {
      if (username.trim() === "rsr-admin" && adminPassword === "4451") {
        setAdminUnlocked(true);
        setLocation("/command");
      } else {
        toast({ title: "Access Denied", description: "Invalid command credentials.", variant: "destructive" });
      }
      setAdminLoading(false);
    }, 400);
  };

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    memberLogin({ email, password }, {
      onSuccess: () => setLocation("/portal"),
      onError: (msg, isPending) => {
        toast({
          title: isPending ? "Awaiting Verification" : "Access Denied",
          description: msg ?? "Credentials not recognized.",
          variant: isPending ? "default" : "destructive",
        });
      },
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({ data: { name, email, password } }, {
      onSuccess: () => setSignedUp(true),
      onError: (err: unknown) => {
        const msg = (err as { data?: { error?: string } })?.data?.error ?? (err instanceof Error ? err.message : null);
        toast({ title: "Signup Failed", description: msg ?? "Could not create account. Try again.", variant: "destructive" });
      },
    });
  };

  const switchMode = (m: LoginMode) => {
    setMode(m);
    setUsername(""); setAdminPassword(""); setEmail(""); setPassword(""); setName("");
    setSignedUp(false);
  };

  const switchMemberMode = (m: MemberSubMode) => {
    setMemberSubMode(m);
    setEmail(""); setPassword(""); setName("");
    setSignedUp(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="scanline" />
      <SignalGridOverlay opacity={0.4} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_30%_50%,_hsl(150_55%_33%_/_0.07)_0%,_transparent_100%)] pointer-events-none" />

      <header className="relative z-10 border-b border-white/[0.06] px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          RSR Press Corps
        </button>
        <div className="flex items-center gap-2">
          <span className="status-dot-active" />
          <span className="font-mono text-[9px] text-primary/40 uppercase tracking-widest">Auth Gate Active</span>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Globe */}
          <div className="hidden lg:flex flex-col items-center justify-center relative min-h-[460px]">
            <div className="absolute pointer-events-none" style={{ inset: '-40%', background: 'radial-gradient(ellipse at 55% 50%, hsl(150 55% 30% / 0.12) 0%, transparent 58%)', filter: 'blur(40px)' }} />
            <WireGlobeGraphic size={380} opacity={0.65} className="relative z-10" />
            <div className="absolute inset-y-0 right-0 w-[30%] bg-[linear-gradient(270deg,_hsl(220_16%_6%_/_0.7)_0%,_transparent_100%)] pointer-events-none z-20" />
            <div className="absolute inset-x-0 top-0 h-[25%] bg-[linear-gradient(180deg,_hsl(220_16%_6%_/_0.65)_0%,_transparent_100%)] pointer-events-none z-20" />
            <div className="absolute inset-x-0 bottom-0 h-[35%] bg-[linear-gradient(0deg,_hsl(220_16%_6%)_0%,_transparent_100%)] pointer-events-none z-20" />
            <div className="mt-6 text-center space-y-2 relative z-30">
              <div className="font-mono text-[10px] text-primary/38 uppercase tracking-[0.3em]">RSR Press Corps</div>
              <div className="font-mono text-[10px] text-muted-foreground/22 uppercase tracking-widest">Secure Access Node // Auth Gate</div>
            </div>
          </div>

          {/* Right — Login form */}
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-11 h-11 glass-panel border-primary/30 mb-5 tactical-glow-sm">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-mono text-2xl font-bold uppercase tracking-tight">Network Access</h1>
              <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mt-1">RSR Press Corps Authentication</p>
            </div>

            <div className="glass-elevated overflow-hidden">
              <div className="panel-chrome border-b border-white/[0.05]">
                <div className="w-2 h-2 border border-primary/40" />
                <span className="font-mono text-[9px] text-primary/40 uppercase tracking-widest">Auth Terminal</span>
                <span className="ml-auto font-mono text-[9px] text-muted-foreground/20 uppercase tracking-widest">v2.1</span>
              </div>

              {/* Main mode tabs */}
              <div className="flex border-b border-white/[0.05]">
                <button
                  onClick={() => switchMode("member")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all border-r border-white/[0.05]
                    ${mode === "member" ? "bg-primary/8 text-primary border-b border-b-primary/50" : "text-muted-foreground/40 hover:text-muted-foreground/70 hover:bg-white/[0.02]"}`}
                >
                  <Users className="w-3 h-3" /> Member
                </button>
                <button
                  onClick={() => switchMode("operator")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all
                    ${mode === "operator" ? "bg-primary/8 text-primary border-b border-b-primary/50" : "text-muted-foreground/40 hover:text-muted-foreground/70 hover:bg-white/[0.02]"}`}
                >
                  <Lock className="w-3 h-3" /> Command
                </button>
              </div>

              <div className="p-7">
                {/* ── OPERATOR MODE — pure client-side check ── */}
                {mode === "operator" && (
                  <>
                    <div className="mb-6 pb-5 border-b border-white/[0.05]">
                      <div className="font-mono font-bold uppercase tracking-widest text-sm mb-1">Command Authentication</div>
                      <div className="font-mono text-[9px] text-muted-foreground/35 uppercase tracking-widest">Operator clearance required</div>
                    </div>
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/60">Username</Label>
                        <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" placeholder="rsr-admin" className="font-mono bg-black/60 h-10 text-sm border-white/10 focus:border-primary/40 rounded-none placeholder:text-white/18" data-testid="input-login-username" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/60">Password</Label>
                        <Input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" className="font-mono bg-black/60 h-10 text-sm border-white/10 focus:border-primary/40 rounded-none" data-testid="input-login-password" />
                      </div>
                      <div className="pt-1">
                        <Button type="submit" className="w-full h-10 font-mono uppercase tracking-widest font-bold text-[10px] rounded-none bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-depth" disabled={adminLoading} data-testid="btn-login-submit">
                          {adminLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Authenticate — Command"}
                        </Button>
                      </div>
                    </form>
                  </>
                )}

                {/* ── MEMBER MODE ── */}
                {mode === "member" && (
                  <>
                    <div className="flex gap-0 mb-6 pb-5 border-b border-white/[0.05]">
                      <button
                        onClick={() => switchMemberMode("login")}
                        className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-widest border transition-all
                          ${memberSubMode === "login" ? "bg-primary/10 text-primary border-primary/30" : "bg-transparent text-muted-foreground/40 border-white/[0.06] hover:text-muted-foreground/70"}`}
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => switchMemberMode("signup")}
                        className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-widest border-t border-b border-r transition-all
                          ${memberSubMode === "signup" ? "bg-primary/10 text-primary border-primary/30" : "bg-transparent text-muted-foreground/40 border-white/[0.06] hover:text-muted-foreground/70"}`}
                      >
                        Sign Up
                      </button>
                    </div>

                    {signedUp ? (
                      <div className="text-center py-4 space-y-4">
                        <div className="w-10 h-10 border border-primary/40 bg-primary/8 flex items-center justify-center mx-auto">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-mono font-bold uppercase tracking-widest text-sm mb-2">Account Created</div>
                          <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-wider leading-relaxed">
                            Your account is pending verification.<br />Command will review and approve your request.
                          </div>
                        </div>
                        <button onClick={() => switchMemberMode("login")} className="font-mono text-[9px] text-primary/50 hover:text-primary uppercase tracking-widest underline underline-offset-2">
                          Back to Log In
                        </button>
                      </div>
                    ) : memberSubMode === "login" ? (
                      <form onSubmit={handleMemberLogin} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/60">Email Address</Label>
                          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="correspondent@email.com" className="font-mono bg-black/60 h-10 text-sm border-white/10 focus:border-primary/40 rounded-none placeholder:text-white/18" data-testid="input-login-email" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/60">Password</Label>
                          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" className="font-mono bg-black/60 h-10 text-sm border-white/10 focus:border-primary/40 rounded-none" data-testid="input-login-password" />
                        </div>
                        <div className="pt-1">
                          <Button type="submit" className="w-full h-10 font-mono uppercase tracking-widest font-bold text-[10px] rounded-none bg-white/8 hover:bg-white/12 text-foreground/80 border border-white/12 hover:border-white/20" disabled={memberLogin.isPending} data-testid="btn-login-submit">
                            {memberLogin.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Authenticate — Member"}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/60">Full Name</Label>
                          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Your name" className="font-mono bg-black/60 h-10 text-sm border-white/10 focus:border-primary/40 rounded-none placeholder:text-white/18" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/60">Email Address</Label>
                          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="correspondent@email.com" className="font-mono bg-black/60 h-10 text-sm border-white/10 focus:border-primary/40 rounded-none placeholder:text-white/18" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/60">Password</Label>
                          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder="••••••••" className="font-mono bg-black/60 h-10 text-sm border-white/10 focus:border-primary/40 rounded-none" />
                        </div>
                        <div className="px-3 py-2.5 bg-black/30 border border-white/[0.06]">
                          <p className="font-mono text-[9px] text-muted-foreground/35 uppercase tracking-wider leading-relaxed">
                            Accounts require verification before access is granted.
                          </p>
                        </div>
                        <div className="pt-1">
                          <Button type="submit" className="w-full h-10 font-mono uppercase tracking-widest font-bold text-[10px] rounded-none bg-white/8 hover:bg-white/12 text-foreground/80 border border-white/12 hover:border-white/20" disabled={signupMutation.isPending}>
                            {signupMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Create Account"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 text-center font-mono text-[9px] text-muted-foreground/20 uppercase tracking-widest">
              Secure session — RSR Press Corps // Auth Gate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
