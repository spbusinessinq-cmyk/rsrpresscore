import { motion } from "framer-motion";
import { AlertCircle, MapPin, Clock, ArrowRight, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useListAssignments } from "@workspace/api-client-react";

export const Operations = () => {
  const { data: assignments, isLoading } = useListAssignments({ visibility: "public_preview" });
  const ops = assignments || [];

  return (
    <section id="operations" className="py-24 relative overflow-hidden section-base">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_80%,_hsl(150_55%_33%_/_0.04)_0%,_transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {ops.length > 0 ? <span className="status-dot-active" /> : <span className="status-dot" />}
              <span className="cmd-label-primary">Live Tasking</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">
              Active Operations
            </h3>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">
            <Activity className="w-3 h-3" />
            <span>{ops.length > 0 ? `${ops.length} operation${ops.length !== 1 ? 's' : ''} active` : 'Awaiting deployment'}</span>
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          {/* Panel header chrome */}
          <div className="panel-chrome">
            <span className="status-dot-active" />
            <span className="font-mono text-[10px] text-primary/70 uppercase tracking-widest">Operations Board</span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground/30 uppercase tracking-widest">Public Preview</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <span className="status-dot-active" />
              <span className="font-mono text-xs text-muted-foreground/50 uppercase tracking-widest animate-pulse">Fetching active operations...</span>
            </div>
          ) : ops.length === 0 ? (
            <div className="py-20 px-8 flex flex-col items-center text-center">
              <div className="w-10 h-10 border border-white/8 bg-black/30 flex items-center justify-center mb-5">
                <Activity className="w-4 h-4 text-muted-foreground/30" />
              </div>
              <div className="font-mono text-xs text-muted-foreground/40 uppercase tracking-[0.25em] mb-2">No Active Dispatches</div>
              <div className="font-mono text-[10px] text-muted-foreground/25 uppercase tracking-widest">Operations board clear — public assignments pending deployment</div>
            </div>
          ) : (
            <div>
              {ops.map((op, i) => (
                <Dialog key={i}>
                  <DialogTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="p-4 border-b border-white/[0.05] hover:bg-white/[0.025] cursor-pointer flex flex-col md:flex-row gap-4 md:items-center justify-between group transition-all last:border-b-0"
                      data-testid={`op-card-${op.id}`}
                    >
                      <div className="flex items-center gap-4 md:w-[30%]">
                        <div className={`font-mono text-[10px] font-bold px-2 py-1 uppercase border tracking-wider ${op.priority === 'High' || op.priority === 'Critical' || op.priority === 'urgent' ? 'bg-destructive/15 text-destructive border-destructive/30' : 'bg-primary/10 text-primary border-primary/25'}`}>
                          {op.priority}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground/50 tracking-widest">OP-{op.id.toString().padStart(3, '0')}</div>
                      </div>
                      <div className="md:flex-1">
                        <h4 className="font-bold font-mono uppercase text-sm tracking-wide group-hover:text-primary/90 transition-colors truncate">{op.title}</h4>
                      </div>
                      <div className="flex items-center gap-6 md:w-[35%] justify-end font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {op.location}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {op.eventTime ? new Date(op.eventTime).toLocaleDateString() : 'TBD'}</span>
                        <ArrowRight className="w-3 h-3 text-primary/0 group-hover:text-primary/60 transition-all translate-x-0 group-hover:translate-x-0.5" />
                      </div>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[520px] glass-elevated rounded-none border-primary/20 p-0 gap-0">
                    <div className="panel-chrome border-b border-white/5">
                      <AlertCircle className={`w-3.5 h-3.5 ${op.priority === 'High' || op.priority === 'Critical' || op.priority === 'urgent' ? 'text-destructive' : 'text-primary'}`} />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">OP-{op.id.toString().padStart(3, '0')}</span>
                    </div>
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/5">
                      <DialogTitle className="font-mono uppercase tracking-tight text-lg">{op.title}</DialogTitle>
                      <DialogDescription className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-1">
                        Status: {op.status} &nbsp;|&nbsp; Priority: {op.priority}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="px-6 py-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 p-3 border border-white/5">
                          <span className="cmd-label-primary block mb-1">Location</span>
                          <span className="font-mono text-sm">{op.location}</span>
                        </div>
                        <div className="bg-black/30 p-3 border border-white/5">
                          <span className="cmd-label-primary block mb-1">Timing</span>
                          <span className="font-mono text-sm">{op.eventTime ? new Date(op.eventTime).toLocaleDateString() : 'TBD'}</span>
                        </div>
                      </div>
                      <div className="bg-black/30 p-3 border border-white/5">
                        <span className="cmd-label-primary block mb-2">Objective</span>
                        <p className="font-sans text-sm text-secondary-foreground/80 leading-relaxed">{op.summary}</p>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <Button className="w-full font-mono uppercase bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20 rounded-none text-xs h-10 tracking-widest" disabled>
                        Accept Tasking — Members Only
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
