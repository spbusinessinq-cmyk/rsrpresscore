import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Shield, LogOut, CheckCircle, Clock, AlertTriangle, XCircle,
  Search, Users, Radio, Calendar, FileText, Wifi, Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SignalGridOverlay } from "@/components/graphics/SignalGridOverlay";

export default function Command() {
  const { user, isLoading, role, refetch } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!isLoading && role !== "operator") setLocation("/");
  }, [isLoading, role, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border border-primary/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary/60 animate-pulse" />
          </div>
          <div className="font-mono text-[11px] text-primary/50 uppercase tracking-[0.3em] animate-pulse">Initializing Command...</div>
        </div>
      </div>
    );
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
      <SignalGridOverlay opacity={0.22} />

      {/* Faint region mesh background overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cmdGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(150 60% 45%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cmdGrid)" />
        </svg>
        {/* Targeting corner marks */}
        <div className="absolute top-[15%] left-[8%] w-6 h-6 border-t border-l border-primary/10" />
        <div className="absolute top-[15%] right-[8%] w-6 h-6 border-t border-r border-primary/10" />
        <div className="absolute bottom-[15%] left-[8%] w-6 h-6 border-b border-l border-primary/10" />
        <div className="absolute bottom-[15%] right-[8%] w-6 h-6 border-b border-r border-primary/10" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[rgba(5,8,6,0.97)] backdrop-blur-xl">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/22 to-transparent" />
        <div className="container mx-auto px-4 h-[60px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 glass-panel border-primary/40 flex items-center justify-center tactical-glow-sm">
              <Shield className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-mono text-[9px] text-primary/45 uppercase tracking-[0.3em]">RSR Press Corps</span>
              <span className="font-mono font-bold text-sm uppercase tracking-[0.15em]">
                <span className="text-primary">Command</span> Dashboard
              </span>
            </div>
          </div>

          {/* Center — system state strip (desktop only) */}
          <div className="hidden xl:flex items-center gap-px border border-white/[0.06] overflow-hidden">
            {[
              { label: "Signal", value: "Active",   pulse: true  },
              { label: "Network", value: "Nominal",  pulse: false },
              { label: "Auth",    value: "Granted",  pulse: false },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-background/60">
                {s.pulse && <span className="status-dot-active" style={{ width: 4, height: 4 }} />}
                <span className="font-mono text-[7px] text-muted-foreground/25 uppercase tracking-widest">{s.label}</span>
                <span className="font-mono text-[8px] text-primary/45 uppercase tracking-wide font-bold">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 hidden md:flex">
              <Activity className="w-3 h-3 text-primary/35" />
              <span className="font-mono text-[9px] text-primary/40 uppercase tracking-widest">Session Active</span>
            </div>
            <Button
              variant="ghost" size="sm"
              onClick={handleLogout}
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40 hover:text-muted-foreground/70 h-8 gap-1.5"
            >
              <LogOut className="w-3 h-3" /> Terminate
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue="applications" className="space-y-6">
          {/* Chrome tab bar */}
          <div className="glass-panel overflow-hidden">
            <div className="panel-chrome border-b border-white/[0.05]">
              <span className="status-dot-active" />
              <span className="font-mono text-[9px] text-primary/45 uppercase tracking-[0.3em]">RSR Command // Operations Center</span>
              <div className="ml-auto flex items-center gap-3">
                <Wifi className="w-3 h-3 text-primary/22" />
                <span className="font-mono text-[9px] text-muted-foreground/18 uppercase tracking-widest">All Systems Nominal</span>
              </div>
            </div>
            <TabsList className="bg-transparent border-none shadow-none font-mono rounded-none flex-wrap h-auto p-2 justify-start gap-1 w-full">
              {[
                { value: "applications", icon: Users,    label: "Intake"      },
                { value: "bulletins",    icon: Radio,    label: "Bulletins"   },
                { value: "assignments",  icon: CrosshairIcon, label: "Assignments" },
                { value: "schedule",     icon: Calendar, label: "Schedule"    },
                { value: "reports",      icon: FileText, label: "Intel"       },
              ].map(({ value, icon: Icon, label }) => (
                <TabsTrigger
                  key={value} value={value}
                  className="rounded-none uppercase text-[10px] tracking-widest px-4 py-2 flex items-center gap-1.5
                    data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none
                    border border-transparent data-[state=active]:border-primary/20
                    hover:bg-white/[0.02] hover:text-foreground/70 transition-all"
                >
                  <Icon className="w-3 h-3" /> {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="applications"><ApplicationsPanel /></TabsContent>
          <TabsContent value="bulletins"><BulletinManagement /></TabsContent>
          <TabsContent value="assignments"><AssignmentManagement /></TabsContent>
          <TabsContent value="schedule"><ScheduleManagement /></TabsContent>
          <TabsContent value="reports"><ReportsPanel /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function CrosshairIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" x2="18" y1="12" y2="12" />
      <line x1="6"  x2="2"  y1="12" y2="12" />
      <line x1="12" x2="12" y1="6"  y2="2"  />
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
      case 'accepted':    return <Badge className="bg-primary/20 text-primary border border-primary/50 font-mono text-[10px] uppercase rounded-none">Accepted</Badge>;
      case 'rejected':    return <Badge className="bg-destructive/20 text-destructive border border-destructive/50 font-mono text-[10px] uppercase rounded-none">Rejected</Badge>;
      case 'under_review':return <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/50 font-mono text-[10px] uppercase rounded-none">Reviewing</Badge>;
      case 'hold':        return <Badge className="bg-orange-500/20 text-orange-500 border border-orange-500/50 font-mono text-[10px] uppercase rounded-none">Hold</Badge>;
      default:            return <Badge variant="outline" className="font-mono text-[10px] uppercase rounded-none border-white/15">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-0">
      <div className="glass-panel overflow-hidden">
        {/* Intake panel header */}
        <div className="intake-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary/50 flex-shrink-0" />
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/85">Network Intake Queue</div>
              <div className="font-mono text-[9px] text-muted-foreground/32 uppercase tracking-widest mt-0.5">
                {applications?.length
                  ? `${applications.length} record${applications.length !== 1 ? 's' : ''} ${statusFilter ? `— ${statusFilter.replace('_', ' ')}` : '— all statuses'}`
                  : 'awaiting submissions'}
              </div>
            </div>
          </div>
          <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? undefined : v)}>
            <SelectTrigger className="w-[160px] font-mono text-[10px] bg-black/50 border-white/10 h-8 uppercase tracking-wider rounded-none">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="hold">Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="bg-black/40 font-mono">
            <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
              <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest font-mono">Operator</TableHead>
              <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest font-mono">Location</TableHead>
              <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest font-mono hidden md:table-cell">Experience</TableHead>
              <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest font-mono hidden md:table-cell">Received</TableHead>
              <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest font-mono">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 font-mono text-muted-foreground/40 text-[10px] uppercase tracking-[0.25em]">
                  Fetching records...
                </TableCell>
              </TableRow>
            ) : !applications?.length ? (
              <TableRow>
                <TableCell colSpan={5} className="py-0">
                  <EmptyState
                    label="Intake Queue Clear"
                    operationalLine="Queue Clear — Awaiting Submissions"
                  />
                </TableCell>
              </TableRow>
            ) : applications?.map((app) => (
              <TableRow
                key={app.id}
                className="border-b border-white/[0.04] cursor-pointer hover:bg-primary/[0.03] transition-colors font-sans group"
                onClick={() => setSelectedApp(app)}
              >
                <TableCell className="font-medium font-mono text-sm">{app.name}</TableCell>
                <TableCell className="text-muted-foreground text-xs font-mono">{app.city}, {app.state}</TableCell>
                <TableCell className="text-xs font-mono hidden md:table-cell">{app.experienceLevel}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground/60 hidden md:table-cell">{new Date(app.createdAt).toLocaleDateString()}</TableCell>
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

function ApplicationDetailModal({ application, onClose, getStatusBadge }: { application: Application, onClose: () => void, getStatusBadge: (s: string) => React.ReactNode }) {
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
      <DialogContent className="sm:max-w-[700px] border-primary/20 bg-background/97 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-white/[0.05] pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-mono text-[9px] text-primary/40 uppercase tracking-[0.3em] mb-1">
                ID: {application.id.toString().padStart(5, '0')} // {application.email}
              </div>
              <DialogTitle className="font-mono text-2xl uppercase tracking-widest">{application.name}</DialogTitle>
              <DialogDescription className="sr-only">Application detail for {application.name}</DialogDescription>
            </div>
            {getStatusBadge(application.status)}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm font-sans mb-8">
          {[
            { label: "Location", value: `${application.city}, ${application.state}` },
            { label: "Phone",    value: application.phone || "N/A" },
            { label: "Op Areas", value: application.areasOfOperation },
            { label: "Experience", value: application.experienceLevel },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="font-mono text-[9px] text-primary/50 uppercase tracking-widest mb-1">{label}</div>
              <div className="text-secondary-foreground/90">{value}</div>
            </div>
          ))}
          <div className="col-span-2">
            <div className="font-mono text-[9px] text-primary/50 uppercase tracking-widest mb-2">Capabilities</div>
            <div className="flex flex-wrap gap-2">
              {application.workTypes.map(w => (
                <Badge key={w} variant="secondary" className="font-mono text-[10px] uppercase rounded-none bg-white/[0.06] border border-white/10">{w}</Badge>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <div className="font-mono text-[9px] text-primary/50 uppercase tracking-widest mb-2">Intent Statement</div>
            <p className="bg-black/50 p-4 border border-white/[0.06] text-secondary-foreground/80 leading-relaxed text-sm font-sans">{application.intent}</p>
          </div>
          {application.links && (
            <div className="col-span-2">
              <div className="font-mono text-[9px] text-primary/50 uppercase tracking-widest mb-1">Portfolio Links</div>
              <a href={application.links} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all text-sm">{application.links}</a>
            </div>
          )}
        </div>

        <div className="border-t border-white/[0.05] pt-6 space-y-3">
          <div className="font-mono text-[9px] text-primary/50 uppercase tracking-widest">Command Assessment</div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Operator assessment notes..."
            className="font-mono text-sm min-h-[100px] bg-black/50 border-white/10 rounded-none focus:border-primary/30"
          />
          <Button onClick={handleSaveNotes} variant="outline" size="sm" className="font-mono text-[10px] uppercase tracking-wider rounded-none border-white/15 hover:border-primary/30">
            Save Assessment
          </Button>
        </div>

        <div className="border-t border-white/[0.05] mt-6 pt-6 flex flex-wrap gap-2">
          <Button onClick={() => handleStatusUpdate('accepted')} className="font-mono uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-none">
            <CheckCircle className="w-3 h-3 mr-2" /> Approve
          </Button>
          <Button onClick={() => handleStatusUpdate('under_review')} variant="outline" className="font-mono uppercase text-xs border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500 rounded-none">
            <Search className="w-3 h-3 mr-2" /> Flag for Review
          </Button>
          <Button onClick={() => handleStatusUpdate('hold')} variant="outline" className="font-mono uppercase text-xs border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:text-orange-500 rounded-none">
            <Clock className="w-3 h-3 mr-2" /> Hold
          </Button>
          <Button onClick={() => handleStatusUpdate('rejected')} variant="outline" className="font-mono uppercase text-xs border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-none">
            <XCircle className="w-3 h-3 mr-2" /> Reject
          </Button>
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
      {/* Compose panel */}
      <div className="lg:col-span-1">
        <div className="glass-panel overflow-hidden">
          <div className="panel-chrome border-b border-white/[0.05]">
            <span className="status-dot-active" />
            <span className="font-mono text-[9px] text-primary/45 uppercase tracking-[0.3em]">Transmit Bulletin</span>
          </div>
          <div className="p-5">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Header</Label>
                <Input required value={title} onChange={e => setTitle(e.target.value)}
                  className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Classification</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="font-mono bg-black/50 border-white/10 text-xs h-9 rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">STANDARD</SelectItem>
                    <SelectItem value="important">IMPORTANT</SelectItem>
                    <SelectItem value="urgent">URGENT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Body</Label>
                <Textarea required value={body} onChange={e => setBody(e.target.value)}
                  className="font-mono bg-black/50 border-white/10 rounded-none min-h-[150px] focus:border-primary/30" />
              </div>
              <Button type="submit" disabled={createBulletin.isPending}
                className="w-full font-mono uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-9">
                Broadcast
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bulletins list */}
      <div className="lg:col-span-2 space-y-3">
        {isLoading ? (
          <div className="font-mono text-[10px] animate-pulse text-muted-foreground/40 uppercase tracking-widest py-8 text-center">
            Fetching records...
          </div>
        ) : !bulletins?.length ? (
          <EmptyState label="No Active Bulletins" operationalLine="Queue Clear — No Transmissions" />
        ) : bulletins?.map(b => (
          <div key={b.id} className="glass-panel overflow-hidden group hover:border-primary/22 transition-all">
            <div className="px-4 py-3 border-b border-white/[0.05] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`font-mono text-[9px] uppercase rounded-none
                  ${b.priority === 'urgent' ? 'text-destructive border-destructive/50 bg-destructive/10' :
                    b.priority === 'important' ? 'text-amber-500 border-amber-500/50 bg-amber-500/10' :
                    'text-primary border-primary/40 bg-primary/8'}`}>
                  {b.priority}
                </Badge>
                <span className="font-mono text-[9px] text-muted-foreground/30 uppercase tracking-wider">
                  {new Date(b.createdAt).toLocaleString()}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id)}
                className="text-destructive/40 hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-all">
                <XCircle className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="px-4 py-4">
              <h4 className="font-mono font-bold uppercase text-base mb-2">{b.title}</h4>
              <p className="text-sm font-sans text-secondary-foreground/75 leading-relaxed">{b.body}</p>
            </div>
          </div>
        ))}
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
      {/* Compose */}
      <div className="xl:col-span-1">
        <div className="glass-panel overflow-hidden">
          <div className="panel-chrome border-b border-white/[0.05]">
            <span className="status-dot-active" />
            <span className="font-mono text-[9px] text-primary/45 uppercase tracking-[0.3em]">Deploy Tasking</span>
          </div>
          <div className="p-5">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Objective</Label>
                <Input required value={title} onChange={e => setTitle(e.target.value)}
                  className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Location Area</Label>
                <Input required value={location} onChange={e => setLocationField(e.target.value)}
                  className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="font-mono bg-black/50 border-white/10 text-xs h-9 rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">LOW</SelectItem>
                      <SelectItem value="Medium">MEDIUM</SelectItem>
                      <SelectItem value="High">HIGH</SelectItem>
                      <SelectItem value="Critical">CRITICAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Visibility</Label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger className="font-mono bg-black/50 border-white/10 text-xs h-9 rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members_only">INTERNAL</SelectItem>
                      <SelectItem value="public_preview">PUBLIC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Target Time (Optional)</Label>
                <Input type="datetime-local" value={eventTime} onChange={e => setEventTime(e.target.value)}
                  className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Briefing</Label>
                <Textarea required value={summary} onChange={e => setSummary(e.target.value)}
                  className="font-mono bg-black/50 border-white/10 rounded-none h-24 focus:border-primary/30" />
              </div>
              <Button type="submit" disabled={createAssignment.isPending}
                className="w-full font-mono uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground rounded-none h-9">
                Issue Assignment
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="xl:col-span-2 glass-panel overflow-hidden">
        <div className="panel-chrome border-b border-white/[0.05]">
          <span className="font-mono text-[9px] text-primary/45 uppercase tracking-[0.3em]">Active Taskings</span>
        </div>
        <Table>
          <TableHeader className="bg-black/40 font-mono">
            <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
              <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest">Obj / Loc</TableHead>
              <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest">Pri / Vis</TableHead>
              <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest">Status / Asset</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center font-mono text-muted-foreground/40 py-8 text-[10px] uppercase tracking-widest">Fetching...</TableCell></TableRow>
            ) : !assignments?.length ? (
              <TableRow><TableCell colSpan={4} className="py-0"><EmptyState label="No Open Assignments" operationalLine="System Active — No Taskings Issued" /></TableCell></TableRow>
            ) : assignments?.map(a => (
              <TableRow key={a.id} className="border-b border-white/[0.04] font-sans hover:bg-primary/[0.02] transition-colors group">
                <TableCell>
                  <div className="font-mono font-bold uppercase text-sm">{a.title}</div>
                  <div className="text-xs font-mono text-muted-foreground/50">{a.location} {a.eventTime && `| ${new Date(a.eventTime).toLocaleString()}`}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-mono">{a.priority}</div>
                  <div className="text-[10px] font-mono text-muted-foreground/40 uppercase">{a.visibility.replace('_', ' ')}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase rounded-none border-white/15 mr-2">{a.status}</Badge>
                  <span className="text-xs text-secondary-foreground/60 font-mono">{a.claimedBy || "Unassigned"}</span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}
                    className="text-destructive/30 hover:text-destructive hover:bg-destructive/10 w-7 h-7 opacity-0 group-hover:opacity-100 transition-all">
                    <XCircle className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createItem.mutate({ data: { title, location: location || null, eventTime, notes: notes || null } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListScheduleItemsQueryKey() });
        setTitle(""); setLocationField(""); setEventTime(""); setNotes("");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass-panel overflow-hidden">
        <div className="panel-chrome border-b border-white/[0.05]">
          <span className="status-dot-active" />
          <span className="font-mono text-[9px] text-primary/45 uppercase tracking-[0.3em]">Log Event</span>
        </div>
        <div className="p-5">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Event Title</Label>
              <Input required value={title} onChange={e => setTitle(e.target.value)}
                className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Time (Required)</Label>
              <Input required type="datetime-local" value={eventTime} onChange={e => setEventTime(e.target.value)}
                className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Location</Label>
              <Input value={location} onChange={e => setLocationField(e.target.value)}
                className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-[9px] uppercase text-primary/60 tracking-widest">Notes</Label>
              <Input value={notes} onChange={e => setNotes(e.target.value)}
                className="font-mono bg-black/50 border-white/10 rounded-none h-9 focus:border-primary/30" />
            </div>
            <Button type="submit" disabled={createItem.isPending}
              className="w-full font-mono uppercase text-[10px] tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-9">
              Add to Schedule
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40 animate-pulse py-8 text-center">Loading...</div>
        ) : !schedule?.length ? (
          <EmptyState label="Schedule Clear" operationalLine="No Events Logged" />
        ) : schedule?.map(s => (
          <div key={s.id} className="flex justify-between items-center px-4 py-3 glass-panel group hover:border-primary/20 transition-all">
            <div>
              <div className="font-mono text-[10px] text-primary/50 uppercase tracking-wider">{new Date(s.eventTime).toLocaleString()}</div>
              <div className="font-mono font-bold uppercase text-sm">{s.title}</div>
              {s.location && <div className="text-xs font-mono text-muted-foreground/45">{s.location}</div>}
            </div>
            <Button variant="ghost" size="icon"
              onClick={() => deleteItem.mutate({ id: s.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListScheduleItemsQueryKey() }) })}
              className="opacity-0 group-hover:opacity-100 text-destructive/40 hover:text-destructive hover:bg-destructive/10 w-7 h-7 transition-all">
              <XCircle className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsPanel() {
  const { data: reports, isLoading } = useListReports();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="panel-chrome border-b border-white/[0.05]">
        <span className="font-mono text-[9px] text-primary/45 uppercase tracking-[0.3em]">Field Intelligence</span>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground/20 uppercase tracking-widest">
          {reports?.length ? `${reports.length} report${reports.length !== 1 ? 's' : ''}` : 'no reports'}
        </span>
      </div>
      <Table>
        <TableHeader className="bg-black/40 font-mono">
          <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
            <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest">Report / Title</TableHead>
            <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest">Operator</TableHead>
            <TableHead className="text-primary/60 text-[10px] uppercase tracking-widest hidden md:table-cell">Filed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={3} className="text-center font-mono text-muted-foreground/40 py-8 text-[10px] uppercase tracking-widest">Fetching...</TableCell></TableRow>
          ) : !reports?.length ? (
            <TableRow><TableCell colSpan={3} className="py-0"><EmptyState label="No Reports Filed" operationalLine="Queue Clear — Awaiting Field Intel" /></TableCell></TableRow>
          ) : reports?.map(r => (
            <TableRow key={r.id} onClick={() => setSelectedReport(r)}
              className="cursor-pointer border-b border-white/[0.04] font-sans hover:bg-primary/[0.03] transition-colors">
              <TableCell className="font-mono font-bold uppercase text-sm">{r.title}</TableCell>
              <TableCell className="text-xs font-mono text-muted-foreground/60">{r.authorName}</TableCell>
              <TableCell className="text-xs font-mono text-muted-foreground/45 hidden md:table-cell">{new Date(r.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedReport && (
        <Dialog open={true} onOpenChange={(open) => !open && setSelectedReport(null)}>
          <DialogContent className="sm:max-w-[700px] border-primary/20 bg-background/97 backdrop-blur-xl">
            <DialogHeader className="border-b border-white/[0.05] pb-4 mb-4">
              <DialogTitle className="font-mono text-xl uppercase tracking-widest text-primary">{selectedReport.title}</DialogTitle>
              <DialogDescription className="font-mono text-[9px] mt-1 text-muted-foreground/40 uppercase tracking-wider">
                Filed by: {selectedReport.authorName} // {new Date(selectedReport.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="font-sans text-sm leading-relaxed text-secondary-foreground/80 whitespace-pre-wrap bg-black/50 p-4 border border-white/[0.06] max-h-[50vh] overflow-y-auto">
              {selectedReport.body}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-mono">
              {selectedReport.sourceLinks && (
                <div>
                  <span className="text-primary/50 block mb-1 text-[9px] uppercase tracking-widest">Sources:</span>
                  <a href={selectedReport.sourceLinks} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{selectedReport.sourceLinks}</a>
                </div>
              )}
              {selectedReport.mediaLink && (
                <div>
                  <span className="text-primary/50 block mb-1 text-[9px] uppercase tracking-widest">Media:</span>
                  <a href={selectedReport.mediaLink} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">{selectedReport.mediaLink}</a>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
