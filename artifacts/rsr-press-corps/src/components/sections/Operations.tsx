import { motion } from "framer-motion";
import { AlertCircle, MapPin, Clock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ops = [
  { id: "OP-442", status: "Active", priority: "High", title: "State Capitol Protest Coverage", loc: "Austin, TX", time: "12:00 PST", desc: "Requires on-ground footage of main plaza. Look for agitators." },
  { id: "OP-445", status: "Active", priority: "Medium", title: "City Council Meeting Record", loc: "Portland, OR", time: "14:30 PST", desc: "Document statements regarding new zoning ordinance." },
  { id: "OP-451", status: "Pending", priority: "High", title: "Border Facility Assessment", loc: "El Paso, TX", time: "TBD", desc: "Long-lens photography of new facility construction." },
  { id: "OP-452", status: "Closed", priority: "Low", title: "School Board Review", loc: "Loudoun County, VA", time: "Completed", desc: "Review of curriculum vote." },
];

export const Operations = () => {
  return (
    <section id="operations" className="py-24 border-t border-white/5 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-2">Live Tasking</h2>
            <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter flex items-center gap-4">
              Active Operations
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            </h3>
          </div>
          <Button variant="outline" className="font-mono uppercase tracking-widest border-primary/50 text-xs">View Full Board</Button>
        </div>
        
        <div className="grid gap-4">
          {ops.map((op, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 tactical-border bg-card/50 hover:bg-card cursor-pointer flex flex-col md:flex-row gap-4 md:items-center justify-between group transition-colors"
                  data-testid={`op-card-${op.id}`}
                >
                  <div className="flex items-center gap-4 md:w-1/3">
                    <div className={`font-mono text-xs font-bold px-2 py-1 uppercase ${op.priority === 'High' ? 'bg-destructive/20 text-destructive border border-destructive/50' : 'bg-primary/20 text-primary border border-primary/50'}`}>
                      {op.priority}
                    </div>
                    <div className="font-mono text-sm text-secondary-foreground">{op.id}</div>
                  </div>
                  <div className="md:w-1/3">
                    <h4 className="font-bold font-mono uppercase truncate">{op.title}</h4>
                  </div>
                  <div className="flex items-center gap-6 md:w-1/3 justify-end text-sm font-mono text-secondary-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {op.loc}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {op.time}</span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-primary/20 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase tracking-tighter text-xl flex items-center gap-2">
                    <AlertCircle className={op.priority === 'High' ? 'text-destructive' : 'text-primary'} />
                    {op.id} // {op.title}
                  </DialogTitle>
                  <DialogDescription className="font-mono text-xs">
                    STATUS: {op.status} | PRIORITY: {op.priority}
                  </DialogDescription>
                </DialogHeader>
                <div className="font-mono text-sm space-y-4 py-4 border-y border-white/10 my-2">
                  <div>
                    <span className="text-primary block text-xs mb-1">LOCATION</span>
                    {op.loc}
                  </div>
                  <div>
                    <span className="text-primary block text-xs mb-1">TIMING</span>
                    {op.time}
                  </div>
                  <div>
                    <span className="text-primary block text-xs mb-1">OBJECTIVE</span>
                    <p className="text-secondary-foreground leading-relaxed">{op.desc}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-2">
                  <Button className="flex-1 font-mono uppercase bg-primary text-primary-foreground hover:bg-primary/90">Accept Tasking</Button>
                  <Button variant="outline" className="flex-1 font-mono uppercase border-primary/50">Submit Intel</Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};
