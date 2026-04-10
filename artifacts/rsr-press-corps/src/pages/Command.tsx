import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Shield, LogOut, CheckCircle, Clock, AlertTriangle, XCircle, Search, Users, Radio, Calendar, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  useLogout, 
  useListApplications,
  useUpdateApplicationStatus,
  useUpdateApplicationNotes,
  getListApplicationsQueryKey,
  useListBulletins,
  useCreateBulletin,
  useDeleteBulletin,
  getListBulletinsQueryKey,
  useListAssignments,
  useCreateAssignment,
  useDeleteAssignment,
  getListAssignmentsQueryKey,
  useListScheduleItems,
  useCreateScheduleItem,
  useDeleteScheduleItem,
  getListScheduleItemsQueryKey,
  useListReports
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Application } from "@workspace/api-client-react/src/generated/api.schemas";
import { EmptyState } from "@/components/EmptyState";

export default function Command() {
  const { user, isLoading, role, refetch } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!isLoading && role !== "operator") {
      setLocation("/");
    }
  }, [isLoading, role, setLocation]);

  if (isLoading) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-background"><div className="font-mono text-primary animate-pulse">Initializing Command...</div></div>;
  }

  if (role !== "operator") return null;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: async () => {
        await refetch();
        setLocation("/");
      }
    });
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-x-hidden">
      <div className="scanline" />
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[rgba(6,9,7,0.95)] backdrop-blur-xl">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-4 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 glass-panel border-primary/40 flex items-center justify-center tactical-glow-sm">
              <Shield className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[9px] text-primary/50 uppercase tracking-[0.3em]">RSR Press Corps</span>
              <span className="font-mono font-bold text-sm uppercase tracking-[0.15em]"><span className="text-primary">Command</span> Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="status-dot-active" />
              <span className="font-mono text-[9px] text-primary/50 uppercase tracking-widest hidden md:block">Session Active</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 hover:text-muted-foreground/80 h-8">
              <LogOut className="w-3 h-3 mr-2" /> Terminate
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="applications" className="space-y-8">
          <TabsList className="glass-panel font-mono rounded-none flex-wrap h-auto p-1 justify-start gap-0.5">
            <TabsTrigger value="applications" className="rounded-none uppercase text-[10px] tracking-widest data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-b data-[state=active]:border-b-primary/50"><Users className="w-3 h-3 mr-1.5"/> Intake</TabsTrigger>
            <TabsTrigger value="bulletins" className="rounded-none uppercase text-[10px] tracking-widest data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-b data-[state=active]:border-b-primary/50"><Radio className="w-3 h-3 mr-1.5"/> Bulletins</TabsTrigger>
            <TabsTrigger value="assignments" className="rounded-none uppercase text-[10px] tracking-widest data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-b data-[state=active]:border-b-primary/50"><CrosshairIcon className="w-3 h-3 mr-1.5"/> Assignments</TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-none uppercase text-[10px] tracking-widest data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-b data-[state=active]:border-b-primary/50"><Calendar className="w-3 h-3 mr-1.5"/> Schedule</TabsTrigger>
            <TabsTrigger value="reports" className="rounded-none uppercase text-[10px] tracking-widest data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:border-b data-[state=active]:border-b-primary/50"><FileText className="w-3 h-3 mr-1.5"/> Intel</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <ApplicationsPanel />
          </TabsContent>
          <TabsContent value="bulletins">
            <BulletinManagement />
          </TabsContent>
          <TabsContent value="assignments">
            <AssignmentManagement />
          </TabsContent>
          <TabsContent value="schedule">
            <ScheduleManagement />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function CrosshairIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" x2="18" y1="12" y2="12" />
      <line x1="6" x2="2" y1="12" y2="12" />
      <line x1="12" x2="12" y1="6" y2="2" />
      <line x1="12" x2="12" y1="22" y2="18" />
    </svg>
  );
}


function ApplicationsPanel() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data: applications, isLoading } = useListApplications(statusFilter ? { status: statusFilter } : undefined);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted': return <Badge className="bg-primary/20 text-primary border border-primary/50 font-mono text-[10px] uppercase">ACCEPTED</Badge>;
      case 'rejected': return <Badge className="bg-destructive/20 text-destructive border border-destructive/50 font-mono text-[10px] uppercase">REJECTED</Badge>;
      case 'under_review': return <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/50 font-mono text-[10px] uppercase">REVIEWING</Badge>;
      case 'hold': return <Badge className="bg-orange-500/20 text-orange-500 border border-orange-500/50 font-mono text-[10px] uppercase">HOLD</Badge>;
      default: return <Badge variant="outline" className="font-mono text-[10px] uppercase">PENDING</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono text-xl font-bold uppercase tracking-widest">Network Intake Queue</h2>
        <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? undefined : v)}>
          <SelectTrigger className="w-[180px] font-mono text-xs bg-black/50 tactical-border h-8">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ALL STATUSES</SelectItem>
            <SelectItem value="pending">PENDING</SelectItem>
            <SelectItem value="under_review">UNDER REVIEW</SelectItem>
            <SelectItem value="accepted">ACCEPTED</SelectItem>
            <SelectItem value="rejected">REJECTED</SelectItem>
            <SelectItem value="hold">HOLD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-panel overflow-hidden">
        <Table>
          <TableHeader className="bg-black/50 font-mono">
            <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
              <TableHead className="text-primary/70 text-[10px] uppercase tracking-widest">Operator</TableHead>
              <TableHead className="text-primary/70 text-[10px] uppercase tracking-widest">Location</TableHead>
              <TableHead className="text-primary/70 text-[10px] uppercase tracking-widest">Exp.</TableHead>
              <TableHead className="text-primary/70 text-[10px] uppercase tracking-widest">Received</TableHead>
              <TableHead className="text-primary/70 text-[10px] uppercase tracking-widest">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 font-mono text-muted-foreground text-xs uppercase tracking-widest">Loading records...</TableCell></TableRow>
            ) : !applications?.length ? (
              <TableRow><TableCell colSpan={5} className="py-0"><EmptyState label="No Pending Applications" subtext="Intake queue is clear" /></TableCell></TableRow>
            ) : applications?.map((app) => (
              <TableRow 
                key={app.id} 
                className="border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors font-sans"
                onClick={() => setSelectedApp(app)}
              >
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{app.city}, {app.state}</TableCell>
                <TableCell className="text-xs">{app.experienceLevel}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedApp && (
        <ApplicationDetailModal 
          application={selectedApp} 
          onClose={() => setSelectedApp(null)} 
          getStatusBadge={getStatusBadge}
        />
      )}
    </div>
  );
}

function ApplicationDetailModal({ application, onClose, getStatusBadge }: { application: Application, onClose: () => void, getStatusBadge: (s:string) => React.ReactNode }) {
  const updateStatus = useUpdateApplicationStatus();
  const updateNotes = useUpdateApplicationNotes();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState(application.notes || "");
  const { toast } = useToast();

  const handleStatusUpdate = (status: string) => {
    updateStatus.mutate(
      { id: application.id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
          toast({ title: "Status Updated", description: `Operator status changed to ${status.toUpperCase()}` });
          onClose();
        }
      }
    );
  };

  const handleSaveNotes = () => {
    updateNotes.mutate(
      { id: application.id, data: { notes } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
          toast({ title: "Notes Saved", description: "Internal intelligence updated." });
        }
      }
    );
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] border-primary/20 bg-background/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-white/5 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="font-mono text-2xl uppercase tracking-widest">{application.name}</DialogTitle>
              <DialogDescription className="font-mono text-xs mt-1">ID: {application.id.toString().padStart(5, '0')} // {application.email}</DialogDescription>
            </div>
            {getStatusBadge(application.status)}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm font-sans mb-8">
          <div>
            <div className="font-mono text-[10px] text-primary uppercase mb-1">Location</div>
            <div>{application.city}, {application.state}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-primary uppercase mb-1">Phone</div>
            <div>{application.phone || "N/A"}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-primary uppercase mb-1">Op Areas</div>
            <div>{application.areasOfOperation}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-primary uppercase mb-1">Experience</div>
            <div>{application.experienceLevel}</div>
          </div>
          <div className="col-span-2">
            <div className="font-mono text-[10px] text-primary uppercase mb-1">Capabilities</div>
            <div className="flex flex-wrap gap-2">
              {application.workTypes.map(w => (
                <Badge key={w} variant="secondary" className="font-mono text-[10px] uppercase rounded-none bg-white/5">{w}</Badge>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <div className="font-mono text-[10px] text-primary uppercase mb-1">Intent Statement</div>
            <p className="bg-black/50 p-4 border border-white/5 text-secondary-foreground leading-relaxed">{application.intent}</p>
          </div>
          {application.links && (
            <div className="col-span-2">
              <div className="font-mono text-[10px] text-primary uppercase mb-1">Portfolio Links</div>
              <a href={application.links} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{application.links}</a>
            </div>
          )}
        </div>

        <div className="border-t border-white/5 pt-6 space-y-4">
          <div className="font-mono text-xs text-primary uppercase tracking-widest">Command Assessment</div>
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Operator assessment notes..." 
            className="font-mono text-sm min-h-[100px] bg-black/50 tactical-border"
          />
          <Button onClick={handleSaveNotes} variant="outline" size="sm" className="font-mono text-xs uppercase">Save Assessment</Button>
        </div>

        <div className="border-t border-white/5 mt-6 pt-6 flex flex-wrap gap-2">
          <Button onClick={() => handleStatusUpdate('accepted')} className="font-mono uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground"><CheckCircle className="w-3 h-3 mr-2" /> Approve</Button>
          <Button onClick={() => handleStatusUpdate('under_review')} variant="outline" className="font-mono uppercase text-xs border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500"><Search className="w-3 h-3 mr-2" /> Flag for Review</Button>
          <Button onClick={() => handleStatusUpdate('hold')} variant="outline" className="font-mono uppercase text-xs border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:text-orange-500"><Clock className="w-3 h-3 mr-2" /> Hold</Button>
          <Button onClick={() => handleStatusUpdate('rejected')} variant="outline" className="font-mono uppercase text-xs border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"><XCircle className="w-3 h-3 mr-2" /> Reject</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BulletinManagement() {
  const { data: bulletins, isLoading } = useListBulletins();
  const createBulletin = useCreateBulletin();
  const deleteBulletin = useDeleteBulletin();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("standard");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createBulletin.mutate(
      { data: { title, body, priority, author: "Command" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBulletinsQueryKey() });
          toast({ title: "Bulletin Transmitted" });
          setTitle(""); setBody(""); setPriority("standard");
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteBulletin.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBulletinsQueryKey() });
        toast({ title: "Bulletin Retracted" });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="bg-card/30 tactical-border">
          <CardHeader className="bg-black/50 border-b border-white/5">
            <CardTitle className="font-mono text-sm uppercase text-primary">Transmit Bulletin</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase text-primary">Header</Label>
                <Input required value={title} onChange={e=>setTitle(e.target.value)} className="font-mono bg-black/50 tactical-border" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase text-primary">Classification</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="font-mono bg-black/50 tactical-border text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">STANDARD</SelectItem>
                    <SelectItem value="important">IMPORTANT</SelectItem>
                    <SelectItem value="urgent">URGENT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase text-primary">Body</Label>
                <Textarea required value={body} onChange={e=>setBody(e.target.value)} className="font-mono bg-black/50 tactical-border min-h-[150px]" />
              </div>
              <Button type="submit" disabled={createBulletin.isPending} className="w-full font-mono uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                Broadcast
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {isLoading ? <div className="font-mono text-xs animate-pulse text-muted-foreground uppercase tracking-widest">Fetching records...</div> :
          !bulletins?.length ? <EmptyState label="No Active Bulletins" subtext="No bulletins have been transmitted" /> :
          bulletins?.map(b => (
            <Card key={b.id} className="bg-card/30 tactical-border">
              <div className="p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`font-mono text-[10px] uppercase ${b.priority==='urgent'?'text-destructive border-destructive/50':b.priority==='important'?'text-amber-500 border-amber-500/50':'text-primary border-primary/50'}`}>
                      {b.priority}
                    </Badge>
                    <span className="font-mono text-[10px] text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</span>
                  </div>
                  <h4 className="font-mono font-bold uppercase text-lg mb-2">{b.title}</h4>
                  <p className="text-sm font-sans text-secondary-foreground">{b.body}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={()=>handleDelete(b.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        }
      </div>
    </div>
  );
}

function AssignmentManagement() {
  const { data: assignments, isLoading } = useListAssignments();
  const createAssignment = useCreateAssignment();
  const deleteAssignment = useDeleteAssignment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [location, setLocationField] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [visibility, setVisibility] = useState("members_only");
  const [summary, setSummary] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createAssignment.mutate(
      { data: { title, location, eventTime: eventTime || null, priority, visibility, summary, status: "open" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAssignmentsQueryKey() });
          toast({ title: "Tasking Created" });
          setTitle(""); setLocationField(""); setEventTime(""); setSummary("");
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteAssignment.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAssignmentsQueryKey() });
        toast({ title: "Tasking Revoked" });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <Card className="bg-card/30 tactical-border">
          <CardHeader className="bg-black/50 border-b border-white/5">
            <CardTitle className="font-mono text-sm uppercase text-primary">Deploy Tasking</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase text-primary">Objective</Label>
                <Input required value={title} onChange={e=>setTitle(e.target.value)} className="font-mono bg-black/50 tactical-border" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase text-primary">Location Area</Label>
                <Input required value={location} onChange={e=>setLocationField(e.target.value)} className="font-mono bg-black/50 tactical-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase text-primary">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="font-mono bg-black/50 tactical-border text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">LOW</SelectItem>
                      <SelectItem value="Medium">MEDIUM</SelectItem>
                      <SelectItem value="High">HIGH</SelectItem>
                      <SelectItem value="Critical">CRITICAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase text-primary">Visibility</Label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger className="font-mono bg-black/50 tactical-border text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members_only">INTERNAL</SelectItem>
                      <SelectItem value="public_preview">PUBLIC PREVIEW</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase text-primary">Target Time (Optional)</Label>
                <Input type="datetime-local" value={eventTime} onChange={e=>setEventTime(e.target.value)} className="font-mono bg-black/50 tactical-border" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[10px] uppercase text-primary">Briefing</Label>
                <Textarea required value={summary} onChange={e=>setSummary(e.target.value)} className="font-mono bg-black/50 tactical-border h-24" />
              </div>
              <Button type="submit" disabled={createAssignment.isPending} className="w-full font-mono uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                Issue Assignment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2">
        <Table>
          <TableHeader className="bg-black/50 font-mono">
            <TableRow className="border-b border-white/5 hover:bg-transparent">
              <TableHead className="text-primary text-xs uppercase">Obj / Loc</TableHead>
              <TableHead className="text-primary text-xs uppercase">Pri/Vis</TableHead>
              <TableHead className="text-primary text-xs uppercase">Status / Asset</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? <TableRow><TableCell colSpan={4} className="text-center font-mono text-muted-foreground py-8 text-xs uppercase tracking-widest">Fetching...</TableCell></TableRow> :
              !assignments?.length ? <TableRow><TableCell colSpan={4} className="py-0"><EmptyState label="No Open Assignments" subtext="No taskings have been issued" /></TableCell></TableRow> :
              assignments?.map(a => (
                <TableRow key={a.id} className="border-b border-white/5 font-sans">
                  <TableCell>
                    <div className="font-mono font-bold uppercase">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.location} {a.eventTime && `| ${new Date(a.eventTime).toLocaleString()}`}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-mono">{a.priority}</div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">{a.visibility.replace('_', ' ')}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase mr-2">{a.status}</Badge>
                    <span className="text-xs text-secondary-foreground">{a.claimedBy || "Unassigned"}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={()=>handleDelete(a.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ScheduleManagement() {
  const { data: schedule, isLoading } = useListScheduleItems();
  const createItem = useCreateScheduleItem();
  const deleteItem = useDeleteScheduleItem();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [location, setLocationField] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleCreate = (e:React.FormEvent) => {
    e.preventDefault();
    createItem.mutate({ data: { title, location: location||null, eventTime, notes: notes||null } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListScheduleItemsQueryKey() });
        setTitle(""); setLocationField(""); setEventTime(""); setNotes("");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-card/30 tactical-border">
        <CardHeader className="bg-black/50 border-b border-white/5">
          <CardTitle className="font-mono text-sm uppercase text-primary">Log Event</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase text-primary">Event Title</Label>
              <Input required value={title} onChange={e=>setTitle(e.target.value)} className="font-mono bg-black/50 tactical-border" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase text-primary">Time (Required)</Label>
              <Input required type="datetime-local" value={eventTime} onChange={e=>setEventTime(e.target.value)} className="font-mono bg-black/50 tactical-border" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase text-primary">Location</Label>
              <Input value={location} onChange={e=>setLocationField(e.target.value)} className="font-mono bg-black/50 tactical-border" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-[10px] uppercase text-primary">Notes</Label>
              <Input value={notes} onChange={e=>setNotes(e.target.value)} className="font-mono bg-black/50 tactical-border" />
            </div>
            <Button type="submit" disabled={createItem.isPending} className="w-full font-mono uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90">Add to Schedule</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {isLoading ? <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Loading...</div> :
          !schedule?.length ? <EmptyState label="Schedule Clear" subtext="No events logged" /> :
          schedule?.map(s => (
            <div key={s.id} className="p-3 bg-black/40 border border-white/5 flex justify-between items-center group">
              <div>
                <div className="font-mono text-xs text-primary">{new Date(s.eventTime).toLocaleString()}</div>
                <div className="font-mono font-bold uppercase">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.location}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteItem.mutate({id: s.id}, {onSuccess:()=>queryClient.invalidateQueries({queryKey:getListScheduleItemsQueryKey()})})} className="opacity-0 group-hover:opacity-100 text-destructive">
                <XCircle className="w-4 h-4"/>
              </Button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function ReportsPanel() {
  const { data: reports, isLoading } = useListReports();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  return (
    <div>
      <Table className="bg-card/30 tactical-border">
        <TableHeader className="bg-black/50 font-mono">
          <TableRow className="border-b border-white/5 hover:bg-transparent">
            <TableHead className="text-primary text-xs uppercase">Report Code / Title</TableHead>
            <TableHead className="text-primary text-xs uppercase">Operator</TableHead>
            <TableHead className="text-primary text-xs uppercase">Filed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <TableRow><TableCell colSpan={3} className="text-center font-mono text-muted-foreground py-8 text-xs uppercase tracking-widest">Fetching...</TableCell></TableRow> :
            !reports?.length ? <TableRow><TableCell colSpan={3} className="py-0"><EmptyState label="No Reports Filed" subtext="No field reports have been submitted" /></TableCell></TableRow> :
            reports?.map(r => (
              <TableRow key={r.id} onClick={()=>setSelectedReport(r)} className="cursor-pointer border-b border-white/5 font-sans hover:bg-white/5 transition-colors">
                <TableCell className="font-medium font-mono uppercase">{r.title}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.authorName}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      {selectedReport && (
        <Dialog open={true} onOpenChange={(open)=>!open && setSelectedReport(null)}>
          <DialogContent className="sm:max-w-[700px] border-primary/20 bg-background/95 backdrop-blur-xl">
            <DialogHeader className="border-b border-white/5 pb-4 mb-4">
              <DialogTitle className="font-mono text-xl uppercase tracking-widest text-primary">{selectedReport.title}</DialogTitle>
              <DialogDescription className="font-mono text-xs mt-1">FILED BY: {selectedReport.authorName} // {new Date(selectedReport.createdAt).toLocaleString()}</DialogDescription>
            </DialogHeader>
            <div className="font-sans text-sm leading-relaxed text-secondary-foreground whitespace-pre-wrap bg-black/50 p-4 border border-white/5 max-h-[50vh] overflow-y-auto">
              {selectedReport.body}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
              {selectedReport.sourceLinks && <div><span className="text-primary block mb-1">SOURCES:</span><a href={selectedReport.sourceLinks} target="_blank" rel="noreferrer" className="underline break-all">{selectedReport.sourceLinks}</a></div>}
              {selectedReport.mediaLink && <div><span className="text-primary block mb-1">MEDIA:</span><a href={selectedReport.mediaLink} target="_blank" rel="noreferrer" className="underline break-all">{selectedReport.mediaLink}</a></div>}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
