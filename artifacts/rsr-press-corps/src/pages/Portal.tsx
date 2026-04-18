import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Shield, LogOut, Radio, Send, FileText, CheckCircle, Activity, ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  useLogout,
  useListBulletins,
  useListAssignments,
  useUpdateAssignment,
  getListAssignmentsQueryKey,
  useListScheduleItems,
  useListMessages,
  useSendMessage,
  getListMessagesQueryKey,
  useSubmitReport
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { EmptyState } from "@/components/EmptyState";
import { SignalGridOverlay } from "@/components/graphics/SignalGridOverlay";

export default function Portal() {
  const { user, isLoading, role, refetch } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!isLoading && role !== "member" && role !== "operator") setLocation("/");
  }, [isLoading, role, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border border-primary/25 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary/50 animate-pulse" />
          </div>
          <div className="font-mono text-[11px] text-primary/40 uppercase tracking-[0.3em] animate-pulse">Initializing Secure Connection...</div>
        </div>
      </div>
    );
  }

  if (role !== "member" && role !== "operator") return null;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: async () => {
        await refetch();
        setLocation("/");
      }
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative">
      <div className="scanline" />
      <SignalGridOverlay opacity={0.20} />

      {/* Background technical overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full opacity-[0.018]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="portalGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(150 55% 45%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#portalGrid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[rgba(5,8,6,0.97)] backdrop-blur-xl">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/18 to-transparent" />
        <div className="container mx-auto px-4 h-[60px] flex items-center gap-3">

          {/* ← Back to site */}
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest
              text-muted-foreground/35 hover:text-primary/70 transition-colors py-1 px-2
              border border-transparent hover:border-white/[0.07] group flex-shrink-0"
            title="Return to Press Corps"
          >
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Press Corps</span>
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-white/[0.07] flex-shrink-0" />

          {/* Identity */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-7 h-7 glass-panel border-primary/28 flex items-center justify-center">
              <Shield className="w-3 h-3 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[8px] text-primary/40 uppercase tracking-[0.25em]">Member Portal</span>
              <span className="font-mono font-bold text-[11px] uppercase tracking-[0.18em] text-foreground/80">RSR Press Corps</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Correspondent identity chip */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass-panel flex-shrink-0">
            <span className="status-dot-active" />
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[7px] text-muted-foreground/30 uppercase tracking-widest">Correspondent</span>
              <span className="font-mono text-[9px] text-foreground/55 uppercase tracking-wider">{user?.name}</span>
            </div>
          </div>

          {/* Auth state */}
          <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
            <Activity className="w-3 h-3 text-primary/30" />
            <span className="font-mono text-[8px] text-primary/30 uppercase tracking-widest">Auth Active</span>
          </div>

          <Button variant="ghost" size="sm" onClick={handleLogout}
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/45 hover:text-destructive/80 hover:bg-destructive/8 h-8 gap-1.5 border border-transparent hover:border-destructive/15 transition-all"
            data-testid="btn-logout">
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <Tabs defaultValue="bulletins" className="space-y-6">
          {/* Chrome tab bar */}
          <div className="glass-panel overflow-hidden">
            <div className="panel-chrome border-b border-white/[0.05]">
              <span className="status-dot-active" />
              <span className="font-mono text-[9px] text-primary/45 uppercase tracking-[0.3em]">RSR Press Corps // Correspondent Access</span>
              <span className="ml-auto font-mono text-[9px] text-muted-foreground/18 uppercase tracking-widest">{user?.name}</span>
            </div>
            <TabsList className="bg-transparent border-none shadow-none font-mono rounded-none flex-wrap h-auto p-1.5 justify-start gap-1 w-full">
              {[
                { value: "bulletins",   label: "Bulletins"   },
                { value: "assignments", label: "Field Ops"   },
                { value: "schedule",    label: "Schedule"    },
                { value: "report",      label: "File Report" },
                { value: "comms",       label: "Comms"       },
              ].map(({ value, label }) => (
                <TabsTrigger
                  key={value} value={value}
                  className="rounded-none uppercase tracking-widest text-[10px] py-2.5 px-4 border border-transparent
                    text-muted-foreground/40
                    data-[state=active]:bg-primary/12 data-[state=active]:text-primary data-[state=active]:shadow-none
                    data-[state=active]:border-primary/15 data-[state=active]:border-b-2 data-[state=active]:border-b-primary/60
                    hover:bg-white/[0.03] hover:text-foreground/65 transition-all"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="bulletins"><BulletinBoard /></TabsContent>
          <TabsContent value="assignments"><ActiveAssignments userName={user?.name || ""} /></TabsContent>
          <TabsContent value="schedule"><Schedule /></TabsContent>
          <TabsContent value="report"><ReportForm user={user!} /></TabsContent>
          <TabsContent value="comms"><Comms user={user!} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function BulletinBoard() {
  const { data: bulletins, isLoading } = useListBulletins();

  if (isLoading) return (
    <div className="font-mono text-[10px] text-muted-foreground/35 animate-pulse uppercase tracking-widest py-8 text-center">
      Establishing signal...
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 border border-primary/25 bg-primary/6 flex items-center justify-center">
          <Radio className="w-3 h-3 text-primary/60" />
        </div>
        <div>
          <div className="font-mono font-bold uppercase text-base tracking-wide">Command Bulletins</div>
          <div className="font-mono text-[9px] text-muted-foreground/30 uppercase tracking-widest">Live transmissions from command</div>
        </div>
      </div>
      {!bulletins?.length ? (
        <EmptyState label="No Active Bulletins" operationalLine="No Transmissions — Channel Clear" />
      ) : bulletins?.map((b) => (
        <div key={b.id} className="glass-panel overflow-hidden hover:border-primary/22 transition-all">
          <div className="px-5 py-3 border-b border-white/[0.05] flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`font-mono text-[9px] uppercase rounded-none flex-shrink-0
                  ${b.priority === 'urgent' ? 'bg-destructive/12 text-destructive border-destructive/40' :
                    b.priority === 'important' ? 'bg-amber-500/12 text-amber-500 border-amber-500/40' :
                    'bg-primary/8 text-primary border-primary/30'}`}
              >
                {b.priority}
              </Badge>
              <span className="font-mono text-[9px] text-muted-foreground/30 uppercase tracking-wider">
                {new Date(b.createdAt).toLocaleString()} // {b.author}
              </span>
            </div>
          </div>
          <div className="px-5 py-4">
            <CardTitle className="font-mono uppercase tracking-widest text-base mb-2">{b.title}</CardTitle>
            <p className="font-sans text-sm text-secondary-foreground/75 whitespace-pre-wrap leading-relaxed">{b.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActiveAssignments({ userName }: { userName: string }) {
  const { data: assignments, isLoading } = useListAssignments();
  const updateAssignment = useUpdateAssignment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleClaim = (id: number) => {
    updateAssignment.mutate(
      { id, data: { status: "claimed", claimedBy: userName } },
      {
        onSuccess: () => {
          toast({ title: "Assignment Claimed", description: "Tasking confirmed. Proceed to objective." });
          queryClient.invalidateQueries({ queryKey: getListAssignmentsQueryKey() });
        }
      }
    );
  };

  if (isLoading) return (
    <div className="font-mono text-[10px] text-muted-foreground/35 animate-pulse uppercase tracking-widest py-8 text-center">
      Loading field ops...
    </div>
  );

  const active = assignments?.filter(a => a.status === 'open' || a.status === 'claimed');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 border border-primary/25 bg-primary/6 flex items-center justify-center">
          <Shield className="w-3 h-3 text-primary/60" />
        </div>
        <div>
          <div className="font-mono font-bold uppercase text-base tracking-wide">Field Operations</div>
          <div className="font-mono text-[9px] text-muted-foreground/30 uppercase tracking-widest">Active assignments and field taskings</div>
        </div>
      </div>
      {!active?.length ? (
        <EmptyState label="No Open Assignments" operationalLine="No Active Field Taskings" />
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {active?.map((a) => (
          <div key={a.id} className={`glass-panel overflow-hidden ${a.status === 'claimed' ? 'opacity-70' : 'hover:border-primary/22'} transition-all`}>
            <div className="panel-chrome border-b border-white/[0.05]">
              <Badge variant="outline" className={`font-mono text-[9px] uppercase rounded-none
                ${a.priority === 'critical' || a.priority === 'High' ? 'text-destructive border-destructive/50 bg-destructive/10' :
                  'text-primary border-primary/40 bg-primary/6'}`}>
                Pri: {a.priority}
              </Badge>
              <Badge variant="outline" className="ml-auto font-mono text-[9px] uppercase rounded-none border-white/12 bg-black/20">
                {a.status}
              </Badge>
            </div>
            <div className="p-5">
              <h3 className="font-mono font-bold uppercase text-base mb-2">{a.title}</h3>
              <div className="space-y-0.5 mb-3 font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                <p>Loc: {a.location}</p>
                {a.eventTime && <p>Time: {new Date(a.eventTime).toLocaleString()}</p>}
              </div>
              <p className="text-sm font-sans text-secondary-foreground/65 mb-5 line-clamp-3 leading-relaxed">{a.summary}</p>

              {a.status === 'open' ? (
                <Button
                  onClick={() => handleClaim(a.id)}
                  className="w-full font-mono uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-9"
                  disabled={updateAssignment.isPending}
                >
                  Claim Tasking
                </Button>
              ) : (
                <div className="w-full h-9 flex items-center gap-2 justify-center border border-white/10 bg-black/50 font-mono text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                  <CheckCircle className="w-3 h-3" /> Claimed by {a.claimedBy}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Schedule() {
  const { data: schedule, isLoading } = useListScheduleItems();

  if (isLoading) return (
    <div className="font-mono text-[10px] text-muted-foreground/35 animate-pulse uppercase tracking-widest py-8 text-center">
      Loading schedule...
    </div>
  );

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="font-mono font-bold uppercase text-base tracking-wide">Master Schedule</div>
      </div>
      {!schedule?.length ? (
        <EmptyState label="Schedule Clear" operationalLine="No Upcoming Events or Coverage Windows" />
      ) : (
        <div className="border-l border-primary/20 pl-4 space-y-6">
          {schedule?.map(item => (
            <div key={item.id} className="relative">
              <div className="absolute -left-[21px] top-2 w-2 h-2 border border-primary/40 bg-primary/15" />
              <div className="font-mono text-[10px] text-primary/45 uppercase tracking-wider mb-1">
                {new Date(item.eventTime).toLocaleString()}
              </div>
              <h4 className="font-mono font-bold uppercase text-base">{item.title}</h4>
              {item.location && <div className="font-mono text-[10px] text-secondary-foreground/50 mt-0.5 uppercase tracking-wider">LOC: {item.location}</div>}
              {item.notes && <p className="text-sm text-muted-foreground/60 mt-2 font-sans">{item.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportForm({ user }: { user: { name: string, email: string } }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sourceLinks, setSourceLinks] = useState("");
  const [mediaLink, setMediaLink] = useState("");
  const submitReport = useSubmitReport();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport.mutate({
      data: { title, body, sourceLinks, mediaLink, authorName: user.name, authorEmail: user.email }
    }, {
      onSuccess: () => {
        toast({ title: "Transmission Successful", description: "Report submitted. Filed to command." });
        setTitle(""); setBody(""); setSourceLinks(""); setMediaLink("");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-6 h-6 border border-primary/25 bg-primary/6 flex items-center justify-center">
          <FileText className="w-3 h-3 text-primary/60" />
        </div>
        <div>
          <div className="font-mono font-bold uppercase text-base tracking-wide">File Intelligence Report</div>
          <div className="font-mono text-[9px] text-muted-foreground/30 uppercase tracking-widest">Transmit field intelligence to command</div>
        </div>
      </div>

      {/* Report terminal */}
      <div className="glass-panel overflow-hidden">
        {/* Terminal chrome header */}
        <div className="panel-chrome border-b border-white/[0.05]">
          <span className="status-dot-active" />
          <span className="font-mono text-[9px] text-primary/40 uppercase tracking-[0.3em]">Secure Transmission — {user.name}</span>
          <span className="ml-auto font-mono text-[8px] text-muted-foreground/18 uppercase tracking-widest">End-to-End</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label className="font-mono text-[9px] uppercase text-primary/55 tracking-widest">Report Classification / Title</Label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)}
              className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-[9px] uppercase text-primary/55 tracking-widest">Intelligence Brief</Label>
            <Textarea required value={body} onChange={(e) => setBody(e.target.value)}
              className="font-mono min-h-[200px] bg-black/50 border-white/10 rounded-none focus:border-primary/30" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-mono text-[9px] uppercase text-primary/55 tracking-widest">Source Links (Optional)</Label>
              <Input value={sourceLinks} onChange={(e) => setSourceLinks(e.target.value)}
                className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-[9px] uppercase text-primary/55 tracking-widest">Raw Media Link (Optional)</Label>
              <Input value={mediaLink} onChange={(e) => setMediaLink(e.target.value)}
                className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
            </div>
          </div>

          {/* Bottom rule + submit */}
          <div className="pt-2">
            <div className="h-px bg-gradient-to-r from-primary/18 via-primary/10 to-transparent mb-4" />
            <Button disabled={submitReport.isPending} type="submit"
              className="w-full font-mono uppercase text-[11px] tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-none h-10 btn-primary-depth">
              {submitReport.isPending ? "Transmitting..." : "Submit to Command"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Comms({ user }: { user: { name: string, email: string } }) {
  const { data: messages, isLoading } = useListMessages({ query: { refetchInterval: 10000 } });
  const sendMessage = useSendMessage();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    sendMessage.mutate({ data: { senderName: user.name, senderEmail: user.email, body } }, {
      onSuccess: () => {
        setBody("");
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-panel overflow-hidden flex flex-col" style={{ height: 580 }}>
        {/* Chrome header */}
        <div className="panel-chrome border-b border-white/[0.05] flex-shrink-0">
          <span className="status-dot-active" />
          <span className="font-mono text-[9px] text-primary/40 uppercase tracking-[0.3em]">Secure Comms Channel</span>
          <div className="ml-auto flex items-center gap-1.5">
            <Send className="w-3 h-3 text-muted-foreground/20" />
            <span className="font-mono text-[8px] text-muted-foreground/18 uppercase tracking-widest">Encrypted</span>
          </div>
        </div>

        {/* Message feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="font-mono text-[10px] text-muted-foreground/30 text-center uppercase tracking-widest py-8">Establishing connection...</div>
          ) : !messages?.length ? (
            <EmptyState label="Channel Clear" operationalLine="No Messages — Channel Open" />
          ) : messages?.map(m => (
            <div key={m.id} className="bg-black/35 p-3 border-l-2 border-primary/35 text-sm font-sans hover:bg-black/50 transition-colors">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-mono text-xs font-bold text-primary/70">{m.senderName}</span>
                <span className="font-mono text-[9px] text-muted-foreground/30">{new Date(m.createdAt).toLocaleTimeString()}</span>
              </div>
              <p className="text-secondary-foreground/75">{m.body}</p>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-white/[0.05] bg-black/30 flex-shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Transmit message..."
              className="font-mono bg-black/60 border-white/10 rounded-none h-9 focus:border-primary/30"
            />
            <Button type="submit" disabled={sendMessage.isPending || !body.trim()}
              className="bg-primary hover:bg-primary/90 rounded-none h-9 w-9 p-0 flex-shrink-0">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
