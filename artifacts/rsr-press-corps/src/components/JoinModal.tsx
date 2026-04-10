import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Terminal } from "lucide-react";

export const JoinModal = ({ trigger }: { trigger: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-mono tracking-tighter text-primary-foreground flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            INITIALIZE CLEARANCE
          </DialogTitle>
          <DialogDescription className="font-mono text-xs text-muted-foreground uppercase">
            RSR-CORPS-REQ // SECURE CHANNEL ESTABLISHED
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 mt-2">
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-secondary-foreground">Operator Name / Call Sign</Label>
            <Input id="name" className="font-mono bg-black/50 border-primary/30 focus-visible:ring-primary" placeholder="Enter identifier" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-secondary-foreground">Secure Comms (Email)</Label>
            <Input id="email" type="email" className="font-mono bg-black/50 border-primary/30 focus-visible:ring-primary" placeholder="comms@domain.net" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="background" className="font-mono text-xs uppercase tracking-wider text-secondary-foreground">Operational Background</Label>
            <Textarea id="background" className="font-mono bg-black/50 border-primary/30 focus-visible:ring-primary min-h-[80px]" placeholder="Brief summary of capabilities..." />
          </div>
        </div>
        <Button className="w-full font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm">
          Transmit Request
        </Button>
      </DialogContent>
    </Dialog>
  );
};
