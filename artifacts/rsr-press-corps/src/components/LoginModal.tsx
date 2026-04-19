import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Loader2, Lock, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type LoginMode = "operator" | "member";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<LoginMode>("member");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { refetch } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = mode === "operator"
      ? { data: { username, password } }
      : { data: { email, password } };
    loginMutation.mutate(payload, {
      onSuccess: async (data) => {
        await refetch();
        onClose();
        if (data.role === "operator") {
          setLocation("/command");
        } else if (data.role === "member") {
          setLocation("/portal");
        }
      },
      onError: (err: unknown) => {
        const serverMsg =
          (err as { data?: { error?: string } })?.data?.error ??
          (err instanceof Error ? err.message : null);
        toast({
          title: "Access Denied",
          description: serverMsg ?? "Credentials not recognized. Verify your identity.",
          variant: "destructive",
        });
      },
    });
  };

  const reset = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    loginMutation.reset?.();
  };

  const switchMode = (m: LoginMode) => {
    setMode(m);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-[460px] glass-elevated rounded-none p-0 overflow-hidden gap-0 border-primary/18">
        <DialogTitle className="sr-only">Network Access — RSR Press Corps</DialogTitle>

        {/* Modal chrome header */}
        <div className="panel-chrome border-b border-white/[0.06]">
          <div className="w-2 h-2 border border-primary/40 bg-primary/8" />
          <span className="font-mono text-[10px] text-primary/50 uppercase tracking-[0.22em]">RSR Press Corps</span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground/30 uppercase tracking-widest">Secure Auth</span>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-white/[0.06]">
          <button
            onClick={() => switchMode("member")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border-r border-white/[0.06]
              ${mode === "member"
                ? "bg-primary/8 text-primary border-b-2 border-b-primary/60"
                : "text-muted-foreground/50 hover:text-muted-foreground/80 hover:bg-white/[0.02]"}`}
          >
            <Users className="w-3 h-3" />
            Member
          </button>
          <button
            onClick={() => switchMode("operator")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all
              ${mode === "operator"
                ? "bg-primary/8 text-primary border-b-2 border-b-primary/60"
                : "text-muted-foreground/50 hover:text-muted-foreground/80 hover:bg-white/[0.02]"}`}
          >
            <Lock className="w-3 h-3" />
            Command
          </button>
        </div>

        <div className="p-7">
          {/* Identity block */}
          <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-white/5">
            <div className={`w-9 h-9 flex items-center justify-center border transition-all ${mode === "operator" ? "bg-primary/15 border-primary/50 tactical-glow-sm" : "bg-white/5 border-white/12"}`}>
              <Shield className={`w-4 h-4 transition-colors ${mode === "operator" ? "text-primary" : "text-muted-foreground/40"}`} />
            </div>
            <div>
              <div className="font-mono font-bold uppercase tracking-widest text-sm leading-none mb-1">
                {mode === "operator" ? "Command Authentication" : "Network Access"}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">
                {mode === "operator" ? "Operator clearance required" : "Enter issued credentials"}
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/70">
                {mode === "operator" ? "Username" : "Email Address"}
              </Label>
              {mode === "operator" ? (
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="rsr-admin"
                  className="font-mono bg-black/60 h-10 text-sm placeholder:text-white/18 border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none"
                  data-testid="input-login-username"
                />
              ) : (
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="correspondent@secure.net"
                  className="font-mono bg-black/60 h-10 text-sm placeholder:text-white/18 border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none"
                  data-testid="input-login-email"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary/70">
                {mode === "operator" ? "Password" : "Access Code"}
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="font-mono bg-black/60 h-10 text-sm border-white/10 hover:border-white/15 focus:border-primary/40 rounded-none"
                data-testid="input-login-password"
              />
            </div>

            {mode === "member" && (
              <div className="px-3 py-2.5 bg-black/30 border border-white/[0.06]">
                <p className="font-mono text-[9px] text-muted-foreground/40 leading-relaxed uppercase tracking-wider">
                  Access codes are issued upon application acceptance. Contact command if you have not received yours.
                </p>
              </div>
            )}

            <div className="pt-1">
              <Button
                type="submit"
                className={`w-full h-10 font-mono uppercase tracking-widest font-bold text-[10px] rounded-none transition-all
                  ${mode === "operator"
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-depth"
                    : "bg-white/8 hover:bg-white/12 text-foreground/80 border border-white/12 hover:border-white/20"}`}
                disabled={loginMutation.isPending}
                data-testid="btn-login-submit"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : mode === "operator" ? (
                  "Authenticate — Command"
                ) : (
                  "Authenticate — Member"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
