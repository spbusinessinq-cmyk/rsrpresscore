import { motion } from "framer-motion";
import { BadgeCheck, QrCode, FileDigit } from "lucide-react";

export const Credentials = () => {
  return (
    <section className="py-24 border-t border-primary/20 bg-black/60 relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-2">Verification</h2>
            <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-6">Field Credentials</h3>
            <p className="font-mono text-secondary-foreground leading-[1.5] mb-8">
              Every verified operator is issued cryptographic credentials validating their status within the RSR Press Corps. Digital ID cards provide instant verification, while physical press badges are available for high-tier deployed assets requiring hard-pass access in contested zones.
            </p>
            <ul className="space-y-4 font-mono text-sm text-secondary-foreground">
              <li className="flex items-center gap-3">
                <BadgeCheck className="w-4 h-4 text-primary" /> Immutable digital record
              </li>
              <li className="flex items-center gap-3">
                <QrCode className="w-4 h-4 text-primary" /> Instant scan verification
              </li>
              <li className="flex items-center gap-3">
                <FileDigit className="w-4 h-4 text-primary" /> Tier-based clearance levels
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            {/* ID Card Mockup */}
            <div className="w-[400px] aspect-[1.58] bg-card tactical-border rounded-none relative overflow-hidden flex flex-col p-6">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
              <div className="flex justify-between items-start mb-6 z-10">
                <div>
                  <h4 className="font-bold text-xl uppercase tracking-tighter">RSR Press Corps</h4>
                  <p className="text-xs text-primary font-mono uppercase tracking-widest">Field Operator</p>
                </div>
                <div className="w-12 h-12 bg-black/50 border border-primary/30 p-1 flex items-center justify-center rounded-none">
                  <QrCode className="w-full h-full text-primary/70" />
                </div>
              </div>
              <div className="flex gap-6 z-10 mt-auto">
                <div className="w-24 h-32 bg-black/50 border border-primary/30 relative overflow-hidden rounded-none">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-luminosity grayscale" />
                </div>
                <div className="font-mono text-xs space-y-2 flex-1">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">OPERATOR</span>
                    <span className="text-foreground uppercase font-bold">DOE, J.</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">ID NUMBER</span>
                    <span className="text-foreground">RSR-9842-X</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">CLEARANCE</span>
                    <span className="text-primary font-bold">LEVEL 3 - VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
