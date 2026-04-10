import { motion } from "framer-motion";
import { AlertCircle, MapPin, Clock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useListAssignments } from "@workspace/api-client-react";

export const Operations = () => {
  const { data: assignments, isLoading } = useListAssignments({ visibility: "public_preview" });

  const ops = assignments || [];

  return (
    <section id="operations" className="py-24 border-t border-white/5 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-2">Live Tasking</h2>
            <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter flex items-center gap-4">
              Active Operations
              <span className="w-3 h-3 rounded-none bg-primary animate-pulse" />
            </h3>
          </div>
          <Button variant="outline" className="font-mono uppercase tracking-widest border-primary/50 text-xs rounded-none" onClick={() => document.getElementById('operations')?.scrollIntoView({ behavior: 'smooth' })}>View Full Board</Button>
        </div>
        
        <div className="grid gap-4">
          {isLoading ? (
             <div className="text-center font-mono text-muted-foreground py-8">Fetching active operations...</div>
          ) : ops.length === 0 ? (
             <div className="text-center font-mono text-muted-foreground py-8">No public operations active at this time.</div>
          ) : ops.map((op, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 tactical-border bg-card/50 hover:bg-card cursor-pointer flex flex-col md:flex-row gap-4 md:items-center justify-between group transition-colors rounded-none"
                  data-testid={`op-card-${op.id}`}
                >
                  <div className="flex items-center gap-4 md:w-1/3">
                    <div className={`font-mono text-xs font-bold px-2 py-1 uppercase rounded-none border ${op.priority === 'High' || op.priority === 'Critical' || op.priority === 'urgent' ? 'bg-destructive/20 text-destructive border-destructive/50' : 'bg-primary/20 text-primary border-primary/50'}`}>
                      {op.priority}
                    </div>
                    <div className="font-mono text-sm text-secondary-foreground">OP-{op.id.toString().padStart(3, '0')}</div>
                  </div>
                  <div className="md:w-1/3">
                    <h4 className="font-bold font-mono uppercase truncate">{op.title}</h4>
                  </div>
                  <div className="flex items-center gap-6 md:w-1/3 justify-end text-sm font-mono text-secondary-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {op.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {op.eventTime ? new Date(op.eventTime).toLocaleString() : 'TBD'}</span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-primary/20 bg-background/95 backdrop-blur-xl rounded-none">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase tracking-tighter text-xl flex items-center gap-2">
                    <AlertCircle className={op.priority === 'High' || op.priority === 'Critical' || op.priority === 'urgent' ? 'text-destructive' : 'text-primary'} />
                    OP-{op.id.toString().padStart(3, '0')} // {op.title}
                  </DialogTitle>
                  <DialogDescription className="font-mono text-xs">
                    STATUS: {op.status} | PRIORITY: {op.priority}
                  </DialogDescription>
                </DialogHeader>
                <div className="font-mono text-sm space-y-4 py-4 border-y border-white/10 my-2">
                  <div>
                    <span className="text-primary block text-xs mb-1">LOCATION</span>
                    {op.location}
                  </div>
                  <div>
                    <span className="text-primary block text-xs mb-1">TIMING</span>
                    {op.eventTime ? new Date(op.eventTime).toLocaleString() : 'TBD'}
                  </div>
                  <div>
                    <span className="text-primary block text-xs mb-1">OBJECTIVE</span>
                    <p className="text-secondary-foreground leading-[1.5]">{op.summary}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <Button className="flex-1 font-mono uppercase bg-primary text-primary-foreground hover:bg-primary/90 rounded-none disabled:opacity-50" disabled>Accept Tasking (Members Only)</Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};
