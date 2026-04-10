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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { refetch } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: async (data) => {
          await refetch();
          onClose();
          if (data.role === "operator") {
            setLocation("/command");
          } else if (data.role === "member") {
            setLocation("/portal");
          }
        },
        onError: () => {
          toast({
            title: "Access Denied",
            description: "Credentials not recognized. Verify your identity.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const reset = () => {
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
      <DialogContent className="sm:max-w-[480px] border border-primary/20 bg-background p-0 overflow-hidden rounded-none gap-0">
        <DialogTitle className="sr-only">Network Access — RSR Press Corps</DialogTitle>
        <div className="flex border-b border-white/5">
          <button
            onClick={() => switchMode("member")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-mono text-xs uppercase tracking-widest transition-colors border-r border-white/5
              ${mode === "member" ? "bg-primary/10 text-primary border-b-2 border-b-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
          >
            <Users className="w-3 h-3" />
            Member Access
          </button>
          <button
            onClick={() => switchMode("operator")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-mono text-xs uppercase tracking-widest transition-colors
              ${mode === "operator" ? "bg-primary/10 text-primary border-b-2 border-b-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
          >
            <Lock className="w-3 h-3" />
            Command Access
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 flex items-center justify-center border ${mode === "operator" ? "bg-primary/20 border-primary/60" : "bg-white/5 border-white/20"}`}>
              <Shield className={`w-5 h-5 ${mode === "operator" ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <div className="font-mono font-bold uppercase tracking-widest text-sm">
                {mode === "operator" ? "Command Authentication" : "Network Access"}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                {mode === "operator"
                  ? "Operator clearance required"
                  : "Enter issued credentials"}
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-primary">
                {mode === "operator" ? "Operator ID" : "Email Address"}
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder={mode === "operator" ? "command@rsrpresscorps.com" : "correspondent@secure.net"}
                className="font-mono bg-black/60 tactical-border h-11 text-sm placeholder:text-white/20"
                data-testid="input-login-email"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] uppercase tracking-widest text-primary">
                {mode === "operator" ? "Command Passcode" : "Access Code / Password"}
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "operator" ? "current-password" : "off"}
                placeholder="••••••••"
                className="font-mono bg-black/60 tactical-border h-11 text-sm"
                data-testid="input-login-password"
              />
            </div>

            {mode === "member" && (
              <p className="font-mono text-[10px] text-muted-foreground/60 leading-relaxed">
                Access codes are issued upon application acceptance. Contact command if you have not received yours.
              </p>
            )}

            <Button
              type="submit"
              className={`w-full h-11 font-mono uppercase tracking-widest font-bold text-xs mt-2
                ${mode === "operator"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-white/10 hover:bg-white/15 text-foreground border border-white/20"}`}
              disabled={loginMutation.isPending}
              data-testid="btn-login-submit"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "operator" ? (
                "Authenticate — Command"
              ) : (
                "Authenticate — Member"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
