import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Loader2, Lock, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

type LoginMode = "member" | "operator";

export default function Login() {
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
          if (data.role === "operator") {
            setLocation("/command");
          } else if (data.role === "member") {
            setLocation("/portal");
          } else {
            setLocation("/");
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

  const switchMode = (m: LoginMode) => {
    setMode(m);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <header className="border-b border-primary/10 px-6 h-14 flex items-center">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          RSR Press Corps
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 border border-primary/30 mb-5">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-mono text-2xl font-bold uppercase tracking-widest">Network Access</h1>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1">RSR Press Corps Authentication</p>
          </div>

          <div className="border border-primary/20 bg-black/40 overflow-hidden">
            <div className="flex border-b border-white/5">
              <button
                onClick={() => switchMode("member")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-mono text-[10px] uppercase tracking-widest transition-colors border-r border-white/5
                  ${mode === "member" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              >
                <Users className="w-3 h-3" />
                Member Access
              </button>
              <button
                onClick={() => switchMode("operator")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-mono text-[10px] uppercase tracking-widest transition-colors
                  ${mode === "operator" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              >
                <Lock className="w-3 h-3" />
                Command Access
              </button>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <div className="font-mono font-bold uppercase tracking-widest text-sm mb-1">
                  {mode === "operator" ? "Command Authentication" : "Correspondent Login"}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                  {mode === "operator"
                    ? "Operator clearance required for command access"
                    : "Enter your issued email and access code"}
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
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
                    placeholder={mode === "operator" ? "command@rsrpresscorps.com" : "correspondent@email.com"}
                    className="font-mono bg-black/60 tactical-border h-11"
                    data-testid="input-login-email"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] uppercase tracking-widest text-primary">
                    {mode === "operator" ? "Command Passcode" : "Access Code"}
                  </Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="font-mono bg-black/60 tactical-border h-11"
                    data-testid="input-login-password"
                  />
                </div>

                {mode === "member" && (
                  <p className="font-mono text-[10px] text-muted-foreground/50 leading-relaxed pt-1">
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
          </div>
        </div>
      </div>
    </div>
  );
}
