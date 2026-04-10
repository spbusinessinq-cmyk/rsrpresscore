import { motion } from "framer-motion";
import { BadgeCheck, QrCode, FileDigit, Shield } from "lucide-react";
import { ScanFrame } from "@/components/graphics/ScanFrame";

export const Credentials = () => {
  return (
    <section className="py-24 relative overflow-hidden section-inset">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      {/* Background verification grid pattern */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_40%,_hsl(150_55%_33%_/_0.07)_0%,_transparent_70%)]" />
        {/* Subtle verification grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="verifyGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="1" fill="hsl(150 60% 50%)" />
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="hsl(150 55% 40%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#verifyGrid)" />
        </svg>
        {/* Slow vertical scan line across right panel */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="100%" y2="0" stroke="hsl(150 60% 50%)" strokeWidth="1" strokeOpacity="0.08">
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 200; 0 0" dur="12s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.08; 0.02; 0.08" dur="12s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>

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
              <p className="font-sans text-sm text-secondary-foreground/78 leading-relaxed">
                Every verified operator receives cryptographic credentials validating their status within RSR Press Corps. Digital ID provides instant network verification, while physical press credentials are available for high-tier deployed field assets.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { icon: BadgeCheck, text: "Immutable digital record", label: "Auth-01" },
                { icon: QrCode,     text: "Instant scan verification", label: "Auth-02" },
                { icon: FileDigit,  text: "Tier-based clearance levels", label: "Auth-03" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 px-4 py-3 glass-panel group hover:border-primary/22 hover:bg-white/[0.015] transition-all"
                >
                  <div className="w-7 h-7 border border-primary/20 bg-primary/6 flex items-center justify-center flex-shrink-0 group-hover:border-primary/35 transition-all">
                    <item.icon className="w-3 h-3 text-primary/65" />
                  </div>
                  <span className="font-mono text-xs text-secondary-foreground/78 uppercase tracking-wider flex-1">{item.text}</span>
                  <span className="font-mono text-[8px] text-muted-foreground/25 uppercase tracking-widest">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Credential status strip */}
            <div className="border border-white/[0.06] bg-black/30 px-4 py-3 flex items-center gap-4">
              <span className="status-dot-active" style={{ flexShrink: 0 }} />
              <div className="font-mono text-[9px] text-primary/45 uppercase tracking-widest">RSR Credential System — Active</div>
              <div className="ml-auto font-mono text-[8px] text-muted-foreground/20 uppercase tracking-widest">Auth Gate v2.1</div>
            </div>
          </motion.div>

          {/* ID Card with scan frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Outer scan frame — slightly larger than card */}
              <div className="absolute -inset-5 pointer-events-none">
                <ScanFrame bracketOpacity={0.35} scanOpacity={0.22} scanDur={7} />
              </div>

              {/* ID Card */}
              <div className="w-[400px] aspect-[1.58] glass-elevated relative overflow-hidden flex flex-col p-6 group">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/80 via-primary to-primary/30" />

                {/* Inner scan line overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div
                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
                    style={{ animation: 'scanCard 6s linear infinite', top: 0 }}
                  />
                </div>

                {/* Internal shimmer */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(60,160,90,0.03)_50%,transparent_70%)] pointer-events-none" />

                {/* Watermark */}
                <div className="absolute right-4 bottom-4 opacity-[0.04]">
                  <Shield className="w-24 h-24 text-primary" />
                </div>

                {/* Verification corner marks inside card */}
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-primary/25 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-primary/25 pointer-events-none" />

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
                    <div className="absolute inset-0 border border-primary/10" />
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
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="status-dot-active" style={{ width: 4, height: 4 }} />
                        <span className="font-mono text-[8px] text-muted-foreground/30 uppercase tracking-widest">Auth: 2A4F-9C2E</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes scanCard {
          from { top: 0%; }
          to   { top: 100%; }
        }
      `}</style>
    </section>
  );
};
