import { useEffect, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Command from "@/pages/Command";
import Portal from "@/pages/Portal";

interface ErrorBoundaryState { hasError: boolean; message: string }

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[RSR] Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background text-foreground p-6">
          <div className="text-center space-y-4 max-w-lg w-full">
            <div className="font-mono text-[10px] text-destructive uppercase tracking-[0.3em]">System Error</div>
            <div className="font-display text-xl uppercase tracking-wide">RSR Press Corps</div>
            <p className="font-mono text-[11px] text-muted-foreground/60 uppercase tracking-widest">
              An unexpected error occurred. Check the browser console for details.
            </p>
            {this.state.message && (
              <pre className="font-mono text-[10px] text-left bg-black/40 border border-destructive/20 p-3 rounded overflow-auto max-h-40 text-destructive/70 whitespace-pre-wrap break-all">
                {this.state.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="font-mono text-[10px] uppercase tracking-[0.2em] border border-primary/30 text-primary/70 px-6 py-2 hover:bg-primary/10 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/command" component={Command} />
      <Route path="/portal" component={Portal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
