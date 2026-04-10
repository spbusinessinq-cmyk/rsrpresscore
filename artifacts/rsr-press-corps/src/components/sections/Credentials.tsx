import { motion } from "framer-motion";
import { BadgeCheck, QrCode, FileDigit, Shield } from "lucide-react";

export const Credentials = () => {
  return (
    <section className="py-24 relative overflow-hidden section-inset">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_80%_40%,_hsl(150_55%_33%_/_0.06)_0%,_transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="status-dot-active" />
                <span className="cmd-label-primary">Verification</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-none mb-6">Field Credentials</h3>
              <p className="font-sans text-sm text-secondary-foreground/80 leading-relaxed">
                Every verified operator receives cryptographic credentials validating their status within RSR Press Corps. Digital ID provides instant network verification, while physical press credentials are available for high-tier deployed field assets.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: BadgeCheck, text: "Immutable digital record" },
                { icon: QrCode, text: "Instant scan verification" },
                { icon: FileDigit, text: "Tier-based clearance levels" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 glass-panel group">
                  <item.icon className="w-3.5 h-3.5 text-primary/70" />
                  <span className="font-mono text-xs text-secondary-foreground/80 uppercase tracking-wider">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            {/* Enhanced ID Card */}
            <div className="w-[400px] aspect-[1.58] glass-elevated relative overflow-hidden flex flex-col p-6 group">
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/80 via-primary to-primary/30" />

              {/* Inner shimmer */}
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(60,160,90,0.03)_50%,transparent_70%)] pointer-events-none" />

              {/* Watermark */}
              <div className="absolute right-4 bottom-4 opacity-[0.04]">
                <Shield className="w-24 h-24 text-primary" />
              </div>

              <div className="flex justify-between items-start mb-5 relative z-10">
                <div>
                  <div className="font-mono text-[10px] text-primary/60 uppercase tracking-[0.25em] mb-1">RSR Press Corps</div>
                  <h4 className="font-bold text-lg uppercase tracking-tight leading-tight">FIELD OPERATOR</h4>
                  <div className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest mt-1">Credentialed Access — Level 3</div>
                </div>
                <div className="w-10 h-10 bg-black/50 border border-primary/25 p-1.5 flex items-center justify-center">
                  <QrCode className="w-full h-full text-primary/60" />
                </div>
              </div>

              <div className="flex gap-5 relative z-10 mt-auto">
                <div className="w-20 h-28 bg-black/60 border border-primary/20 relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-luminosity grayscale" />
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="font-mono text-xs space-y-2.5 flex-1">
                  <div>
                    <div className="cmd-label mb-0.5">Operator</div>
                    <div className="text-foreground font-bold uppercase text-sm">DOE, J.</div>
                  </div>
                  <div>
                    <div className="cmd-label mb-0.5">ID Number</div>
                    <div className="text-foreground text-xs">RSR-9842-X</div>
                  </div>
                  <div>
                    <div className="cmd-label mb-0.5">Clearance</div>
                    <div className="text-primary font-bold text-xs uppercase">Level 3 — Verified</div>
                  </div>
                  <div className="pt-1">
                    <div className="h-px bg-gradient-to-r from-primary/30 to-transparent" />
                    <div className="font-mono text-[8px] text-muted-foreground/30 uppercase tracking-widest mt-1">Auth: 2A4F-9C2E</div>
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
