import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Shield, LogOut, Radio, Send, FileText, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function Portal() {
  const { user, isLoading, role, refetch } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && role !== "member" && role !== "operator") {
      setLocation("/");
    }
  }, [isLoading, role, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="font-mono text-primary uppercase tracking-widest animate-pulse">Initializing Secure Connection...</div>
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
      
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-mono font-bold tracking-tight">RSR PRESS CORPS // <span className="text-primary">MEMBER PORTAL</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="font-mono text-xs text-secondary-foreground uppercase">OP: {user?.name}</span>
              <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 text-primary border-primary/50">VERIFIED</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-primary" data-testid="btn-logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="bulletins" className="space-y-8">
          <TabsList className="bg-card/50 tactical-border font-mono border-b border-x-0 border-t-0 rounded-none w-full justify-start h-auto flex-wrap">
            <TabsTrigger value="bulletins" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-none uppercase tracking-widest text-xs py-3 px-6">Bulletins</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-none uppercase tracking-widest text-xs py-3 px-6">Assignments</TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-none uppercase tracking-widest text-xs py-3 px-6">Schedule</TabsTrigger>
            <TabsTrigger value="report" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-none uppercase tracking-widest text-xs py-3 px-6">File Report</TabsTrigger>
            <TabsTrigger value="comms" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-none uppercase tracking-widest text-xs py-3 px-6">Comms</TabsTrigger>
          </TabsList>

          <TabsContent value="bulletins">
            <BulletinBoard />
          </TabsContent>
          <TabsContent value="assignments">
            <ActiveAssignments userName={user?.name || ""} />
          </TabsContent>
          <TabsContent value="schedule">
            <Schedule />
          </TabsContent>
          <TabsContent value="report">
            <ReportForm user={user!} />
          </TabsContent>
          <TabsContent value="comms">
            <Comms user={user!} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function BulletinBoard() {
  const { data: bulletins, isLoading } = useListBulletins();

  if (isLoading) return <div className="font-mono text-sm text-muted-foreground animate-pulse">Loading bulletins...</div>;

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-xl font-bold uppercase mb-6 text-primary flex items-center gap-2">
        <Radio className="w-5 h-5" /> Command Bulletins
      </h2>
      {!bulletins?.length ? (
        <EmptyState label="No Active Bulletins" subtext="No transmissions from command" />
      ) : bulletins?.map((b) => (
        <Card key={b.id} className="bg-card/30 tactical-border">
          <CardHeader className="pb-3 border-b border-white/5">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-mono uppercase tracking-widest text-lg">{b.title}</CardTitle>
                <CardDescription className="font-mono text-xs mt-1">
                  ISSUED: {new Date(b.createdAt).toLocaleString()} // BY: {b.author}
                </CardDescription>
              </div>
              <Badge 
                variant="outline" 
                className={`font-mono text-[10px] uppercase
                  ${b.priority === 'urgent' ? 'bg-destructive/20 text-destructive border-destructive/50' : 
                    b.priority === 'important' ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' : 
                    'bg-secondary text-secondary-foreground'}`}
              >
                {b.priority}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="font-sans text-sm text-secondary-foreground whitespace-pre-wrap leading-relaxed">{b.body}</p>
          </CardContent>
        </Card>
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
          toast({ title: "Assignment Claimed", description: "Tasking confirmed. Proceed to objective.", variant: "default" });
          queryClient.invalidateQueries({ queryKey: getListAssignmentsQueryKey() });
        }
      }
    );
  };

  if (isLoading) return <div className="font-mono text-sm text-muted-foreground animate-pulse">Loading assignments...</div>;

  const active = assignments?.filter(a => a.status === 'open' || a.status === 'claimed');

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-xl font-bold uppercase mb-6 text-primary flex items-center gap-2">
        <Shield className="w-5 h-5" /> Field Operations
      </h2>
      {!active?.length ? (
        <EmptyState label="No Open Assignments" subtext="No active field taskings at this time" />
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {active?.map((a) => (
          <Card key={a.id} className={`tactical-border ${a.status === 'claimed' ? 'bg-secondary/30 opacity-75' : 'bg-card/50'}`}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className={`font-mono text-[10px] uppercase ${a.priority === 'urgent' ? 'text-destructive border-destructive/50' : 'text-primary border-primary/50'}`}>
                  PRI: {a.priority}
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px] uppercase bg-black text-muted-foreground">
                  {a.status}
                </Badge>
              </div>
              <h3 className="font-mono font-bold uppercase text-lg mb-2">{a.title}</h3>
              <div className="space-y-1 mb-4 font-mono text-xs text-secondary-foreground">
                <p>LOC: {a.location}</p>
                {a.eventTime && <p>TIME: {new Date(a.eventTime).toLocaleString()}</p>}
              </div>
              <p className="text-sm font-sans text-muted-foreground mb-6 line-clamp-3">{a.summary}</p>
              
              {a.status === 'open' ? (
                <Button 
                  onClick={() => handleClaim(a.id)} 
                  className="w-full font-mono uppercase bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-10"
                  disabled={updateAssignment.isPending}
                >
                  Claim Tasking
                </Button>
              ) : (
                <div className="w-full h-10 flex items-center justify-center border border-white/10 bg-black/50 font-mono text-xs text-muted-foreground uppercase">
                  Claimed by {a.claimedBy}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Schedule() {
  const { data: schedule, isLoading } = useListScheduleItems();
  
  if (isLoading) return <div className="font-mono text-sm text-muted-foreground animate-pulse">Loading schedule...</div>;

  return (
    <div className="space-y-4 max-w-3xl">
      <h2 className="font-mono text-xl font-bold uppercase mb-6 text-primary">Master Schedule</h2>
      {!schedule?.length ? (
        <EmptyState label="Schedule Clear" subtext="No upcoming events or coverage windows" />
      ) : (
      <div className="border-l border-primary/30 pl-4 space-y-6">
        {schedule?.map(item => (
          <div key={item.id} className="relative">
            <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-primary" />
            <div className="font-mono text-xs text-primary mb-1">{new Date(item.eventTime).toLocaleString()}</div>
            <h4 className="font-mono font-bold uppercase text-lg">{item.title}</h4>
            {item.location && <div className="font-mono text-xs text-secondary-foreground mt-1">LOC: {item.location}</div>}
            {item.notes && <p className="text-sm text-muted-foreground mt-2">{item.notes}</p>}
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
      data: {
        title, body, sourceLinks, mediaLink, authorName: user.name, authorEmail: user.email
      }
    }, {
      onSuccess: () => {
        toast({ title: "Transmission Successful", description: "Report submitted. Filed to command.", variant: "default" });
        setTitle("");
        setBody("");
        setSourceLinks("");
        setMediaLink("");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="font-mono text-xl font-bold uppercase mb-6 text-primary flex items-center gap-2">
        <FileText className="w-5 h-5" /> File Intelligence Report
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-card/30 p-6 tactical-border">
        <div className="space-y-2">
          <Label className="font-mono text-xs text-primary uppercase">Report Classification / Title</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} className="font-mono bg-black/50 tactical-border" />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs text-primary uppercase">Intelligence Brief</Label>
          <Textarea required value={body} onChange={(e) => setBody(e.target.value)} className="font-mono min-h-[200px] bg-black/50 tactical-border" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-mono text-xs text-primary uppercase">Source Links (Optional)</Label>
            <Input value={sourceLinks} onChange={(e) => setSourceLinks(e.target.value)} className="font-mono bg-black/50 tactical-border" />
          </div>
          <div className="space-y-2">
            <Label className="font-mono text-xs text-primary uppercase">Raw Media Link (Optional)</Label>
            <Input value={mediaLink} onChange={(e) => setMediaLink(e.target.value)} className="font-mono bg-black/50 tactical-border" />
          </div>
        </div>
        <Button disabled={submitReport.isPending} type="submit" className="w-full font-mono uppercase bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest">
          {submitReport.isPending ? "Transmitting..." : "Submit to Command"}
        </Button>
      </form>
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
    sendMessage.mutate({
      data: { senderName: user.name, senderEmail: user.email, body }
    }, {
      onSuccess: () => {
        setBody("");
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-card/30 tactical-border">
      <div className="p-4 border-b border-white/5 bg-black/40">
        <h2 className="font-mono text-sm font-bold uppercase text-primary flex items-center gap-2">
          <Send className="w-4 h-4" /> Secure Comms Channel
        </h2>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="font-mono text-xs text-muted-foreground text-center">Establishing connection...</div>
        ) : messages?.map(m => (
          <div key={m.id} className="bg-black/40 p-3 border-l-2 border-primary/50 text-sm font-sans">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-mono text-xs font-bold text-primary">{m.senderName}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{new Date(m.createdAt).toLocaleTimeString()}</span>
            </div>
            <p className="text-secondary-foreground">{m.body}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/40">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            placeholder="Transmit message..." 
            className="font-mono bg-black/60 tactical-border"
          />
          <Button type="submit" disabled={sendMessage.isPending || !body.trim()} className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
