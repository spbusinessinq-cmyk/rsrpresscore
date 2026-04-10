import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { refetch } = useAuth();
  const { toast } = useToast();
  
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    loginMutation.mutate({
      data: { email, password }
    }, {
      onSuccess: async (data) => {
        // Force refresh auth context before navigating
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
          description: "Invalid credentials.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background relative overflow-hidden">
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="mb-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 tactical-glow">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-mono text-2xl font-bold uppercase tracking-widest mb-2">Network Access</h1>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Identify Yourself</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-primary uppercase tracking-widest">Operator ID / Email</Label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-mono bg-card/50 tactical-border h-12"
              data-testid="input-login-email"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="font-mono text-xs text-primary uppercase tracking-widest">Passcode</Label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="font-mono bg-card/50 tactical-border h-12"
              data-testid="input-login-password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
            disabled={loginMutation.isPending}
            data-testid="btn-login-submit"
          >
            {loginMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Authenticate"
            )}
          </Button>
          
          <div className="text-center mt-6">
            <Button 
              type="button"
              variant="link" 
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setLocation("/")}
            >
              Return to Public Terminal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
