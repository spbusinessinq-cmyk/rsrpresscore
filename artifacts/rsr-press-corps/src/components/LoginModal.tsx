import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Loader2, Lock, Users, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type LoginMode = "operator" | "member";
type MemberSubMode = "login" | "signup";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<LoginMode>("member");
  const [memberSubMode, setMemberSubMode] = useState<MemberSubMode>("login");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [, setLocation] = useLocation();
  const { refetch } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = mode === "operator"
      ? { data: { username, password } }
      : { data: { email, password } };
    loginMutation.mutate(payload, {
      onSuccess: async (data) => {
        await refetch();
        onClose();
        if (data.role === "operator") setLocation("/command");
        else if (data.role === "member") setLocation("/portal");
      },
      onError: (err: unknown) => {
        const serverMsg =
          (err as { data?: { error?: string } })?.data?.error ??
          (err instanceof Error ? err.message : null);
        const isPending = serverMsg?.toLowerCase().includes("pending");
        toast({
          title: isPending ? "Awaiting Verification" : "Access Denied",
          description: serverMsg ?? "Credentials not recognized.",
          variant: isPending ? "default" : "destructive",
        });
      },
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({ data: { name, email, password } }, {
      onSuccess: () => { setSignedUp(true); },
      onError: (err: unknown) => {
        const serverMsg =
          (err as { data?: { error?: string } })?.data?.error ??
          (err instanceof Error ? err.message : null);
        toast({
          title: "Signup Failed",
          description: serverMsg ?? "Could not create account.",
          variant: "destructive",
        });
      },
    });
  };

  const reset = () => {
    setUsername(""); setEmail(""); setPassword(""); setName("");
    setSignedUp(false);
    loginMutation.reset?.();
    signupMutation.reset?.();
  };

  const switchMode = (m: LoginMode) => { setMode(m); reset(); };
  const switchMemberMode = (m: MemberSubMode) => { setMemberSubMode(m); reset(); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-[460px] glass-elevated rounded-none p-0 overflow-hidden gap-0 border-primary/18">
        <DialogTitle className="sr-only">Network Access — RSR Press Corps</DialogTitle>

        <div className="panel-chrome border-b border-white/[0.06]">
          <div className="w-2 h-2 border border-primary/40 bg-primary/8" />
          <span className="font-mono text-[10px] text-primary/50 uppercase tracking-[0.22em]">RSR Press Corps</span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground/30 uppercase tracking-widest">Secure Auth</span>
        </div>

        {/* Main mode tabs */}
        <div className="flex border-b border-white/[0.06]">
          <button
            onClick={() => switchMode("member")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-r border-white/[0.06]
              ${mode === "member" ? "bg-primary/8 text-primary border-b-2 border-b-primary/60" : "text-muted-foreground/50 hover:text-muted-foreground/80 hover:bg-white/[0.02]"}`}
          >
            <Users className="w-3 h-3" /> Member
          </button>
          <button
            onClick={() => switchMode("operator")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all
              ${mode === "operator" ? "bg-primary/8 text-primary border-b-2 border-b-primary/60" : "text-muted-foreground/50 hover:text-muted-foreground/80 hover:bg-white/[0.02]"}`}
          >
            <Lock className="w-3 h-3" /> Command
          </button>
        </div>

        <div className="p-7">
          {/* Identity block */}
          <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-white/5">
            <div className={`w-9 h-9 flex items-center justify-center border transition-all ${mode === "operator" ? "bg-primary/15 border-primary/50 tactical-glow-sm" : "bg-white/5 border-white/12"}`}>
              <Shield className={`w-4 h-4 transition-colors ${mode === "operator" ? "text-primary" : "text-muted-foreground/40"}`} />
            </div>
            <div>
              <div className="font-mono font-bold uppercase tracking-widest text-sm leading-none mb-1">
                {mode === "operator" ? "Command Authentication" : "Network Access"}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">
                {mode === "operator" ? "Operator clearance required" : "Sign in or create an account"}
              </div>
            </div>
          </div>

          {/* ── OPERATOR MODE ── */}
          {mode === "operator" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/70">Username</Label>
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" placeholder="rsr-admin" className="font-mono bg-black/60 h-10 text-sm placeholder:text-white/18 border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none" data-testid="input-login-username" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/70">Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" className="font-mono bg-black/60 h-10 text-sm border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none" data-testid="input-login-password" />
              </div>
              <div className="pt-1">
                <Button type="submit" className="w-full h-10 font-mono uppercase tracking-widest font-bold text-[10px] rounded-none bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-depth" disabled={loginMutation.isPending} data-testid="btn-login-submit">
                  {loginMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Authenticate — Command"}
                </Button>
              </div>
            </form>
          )}

          {/* ── MEMBER MODE ── */}
          {mode === "member" && (
            <>
              {/* Sign up / Log in sub-tabs */}
              <div className="flex mb-5">
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

              {/* Signed-up pending screen */}
              {signedUp ? (
                <div className="text-center py-3 space-y-4">
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
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/70">Email Address</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="correspondent@secure.net" className="font-mono bg-black/60 h-10 text-sm placeholder:text-white/18 border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none" data-testid="input-login-email" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/70">Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" className="font-mono bg-black/60 h-10 text-sm border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none" data-testid="input-login-password" />
                  </div>
                  <div className="pt-1">
                    <Button type="submit" className="w-full h-10 font-mono uppercase tracking-widest font-bold text-[10px] rounded-none bg-white/8 hover:bg-white/12 text-foreground/80 border border-white/12 hover:border-white/20" disabled={loginMutation.isPending} data-testid="btn-login-submit">
                      {loginMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Authenticate — Member"}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/70">Full Name</Label>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Your name" className="font-mono bg-black/60 h-10 text-sm placeholder:text-white/18 border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/70">Email Address</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="correspondent@secure.net" className="font-mono bg-black/60 h-10 text-sm placeholder:text-white/18 border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/70">Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder="••••••••" className="font-mono bg-black/60 h-10 text-sm border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none" />
                  </div>
                  <div className="px-3 py-2.5 bg-black/30 border border-white/[0.06]">
                    <p className="font-mono text-[9px] text-muted-foreground/40 leading-relaxed uppercase tracking-wider">
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
      </DialogContent>
    </Dialog>
  );
}
