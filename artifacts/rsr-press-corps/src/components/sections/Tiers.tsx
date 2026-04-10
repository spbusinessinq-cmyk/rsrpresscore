import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Database, Crosshair, Shield, Command, X, ChevronRight } from "lucide-react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    id: "Observer",
    label: "T-1",
    clearance: "Lvl 01",
    icon: Activity,
    desc: "Basic network access. Monitor active drops and intelligence from the field.",
    detail: "Observer status grants read-level access to the public operations board. Observers document local events, monitor regional activity, and contribute raw intelligence without direct editorial authority.",
    requirements: ["Regional presence in a covered area", "Ability to attend and document events", "Reliable communication channel"],
    canApply: true,
  },
  {
    id: "Contributor",
    label: "T-2",
    clearance: "Lvl 02",
    icon: Database,
    desc: "Submit field reports, written analysis, and regional intelligence to the network.",
    detail: "Contributors are the editorial backbone. They submit structured field reports, written analysis, sourced media, and verified intelligence. Writing ability and basic research skills are required.",
    requirements: ["Demonstrated writing or reporting capability", "Ability to source and verify claims", "Portfolio or writing samples preferred"],
    canApply: true,
  },
  {
    id: "Field Operator",
    label: "T-3",
    clearance: "Lvl 03",
    icon: Crosshair,
    desc: "Deployed asset. Verified identity. Direct tasking board access for active coverage.",
    detail: "Field Operators are deployed on active assignments. They receive direct tasking, attend designated events, and submit real-time reports under command directives. Identity verification is mandatory.",
    requirements: ["Physical ability to deploy to assigned locations", "Identity verification required", "Prior field or event coverage experience preferred"],
    canApply: true,
  },
  {
    id: "Verified Press",
    label: "T-4",
    clearance: "Lvl 04",
    icon: Shield,
    desc: "Full RSR credentials. Priority access. Established media track record required.",
    detail: "Verified Press status is for established journalists, independent media operators, and credentialed press with a documented track record. Credentials are reviewed against public record and prior publication history.",
    requirements: ["Published work under a consistent byline", "Verifiable media credentials or publication history", "Professional references or portfolio"],
    canApply: true,
  },
  {
    id: "Command",
    label: "CMD",
    clearance: "Restricted",
    icon: Command,
    desc: "Network administration, operation tasking, and asset coordination.",
    detail: "Command roles are not available through public intake. Command positions are appointed internally and require direct authorization from the network operator.",
    requirements: [],
    canApply: false,
    full: "md:col-span-2 lg:col-span-2",
  },
];

export const Tiers = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="tiers" className="py-24 relative section-raised overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,_hsl(150_55%_33%_/_0.06)_0%,_transparent_70%)] pointer-events-none" />

      {/* Background scan bars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[15, 35, 55, 72, 88].map((pct, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${pct}%`,
              background: `linear-gradient(90deg, transparent, hsl(150 55% 40% / ${0.04 + i * 0.01}), transparent)`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with tier ladder */}
        <div className="mb-14 flex items-end gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="status-dot" />
              <span className="cmd-label-primary">Access Levels</span>
              <span className="font-mono text-[8px] text-muted-foreground/20 uppercase tracking-widest ml-auto">
                {TIERS.filter(t => t.canApply).length} tiers open
              </span>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Operational Tiers</h3>
          </div>

          {/* Tier access ladder — decorative */}
          <div className="hidden lg:flex flex-col gap-1 pb-1 flex-shrink-0">
            {["CMD", "T-4", "T-3", "T-2", "T-1"].map((lbl, i) => (
              <div key={lbl} className="flex items-center gap-1.5">
                <div
                  className="h-4 border border-primary/20 bg-primary/5 flex items-center justify-center"
                  style={{ width: `${32 + (4 - i) * 8}px` }}
                >
                  <span className="font-mono text-[7px] text-primary/40 uppercase tracking-wider">{lbl}</span>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-primary/60' : 'bg-primary/20'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TIERS.map((tier, i) => (
            <div key={tier.id} className={tier.full || ""}>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setExpanded(expanded === tier.id ? null : tier.id)}
                className={`w-full text-left p-5 relative group overflow-hidden cursor-pointer transition-all glass-panel
                  ${expanded === tier.id
                    ? "border-primary/35 bg-primary/[0.04]"
                    : "hover:border-primary/22 hover:bg-white/[0.015]"}`}
              >
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-px transition-all ${expanded === tier.id ? "bg-gradient-to-r from-primary/60 via-primary/30 to-transparent" : "bg-gradient-to-r from-primary/15 via-transparent to-transparent"}`} />

                {/* Clearance label — top right */}
                <div className="absolute top-4 right-4 font-mono text-[7px] text-muted-foreground/18 uppercase tracking-widest">{tier.clearance}</div>

                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-9 h-9 border flex items-center justify-center transition-all flex-shrink-0 ${expanded === tier.id ? "border-primary/50 bg-primary/12" : "border-white/10 bg-white/[0.03] group-hover:border-primary/25 group-hover:bg-primary/6"}`}>
                    <tier.icon className={`w-4 h-4 transition-colors ${expanded === tier.id ? "text-primary" : "text-muted-foreground/50 group-hover:text-primary/70"}`} />
                  </div>
                  <span className={`font-mono text-[10px] font-bold tracking-widest self-center transition-colors ${expanded === tier.id ? "text-primary/70" : "text-muted-foreground/30 group-hover:text-primary/40"}`}>{tier.label}</span>
                </div>

                <h4 className={`font-mono text-base font-bold uppercase tracking-wide mb-2 transition-colors ${expanded === tier.id ? "text-primary" : "group-hover:text-foreground/95"}`}>
                  {tier.id}
                </h4>
                <p className="text-xs text-secondary-foreground/60 font-sans leading-relaxed">{tier.desc}</p>

                <div className={`flex items-center gap-1.5 mt-4 font-mono text-[9px] uppercase tracking-widest transition-colors ${expanded === tier.id ? "text-primary/60" : "text-muted-foreground/28 group-hover:text-primary/40"}`}>
                  {expanded === tier.id ? <X className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                  {expanded === tier.id ? "Collapse" : "View Details"}
                </div>
              </motion.button>

              <AnimatePresence>
                {expanded === tier.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border border-t-0 border-primary/20 bg-black/50 backdrop-blur-sm">
                      <div className="panel-chrome border-b border-white/[0.05]">
                        <span className="status-dot-active" />
                        <span className="font-mono text-[9px] text-primary/50 uppercase tracking-widest">{tier.id} — Tier Detail</span>
                        <span className="ml-auto font-mono text-[8px] text-muted-foreground/25 uppercase tracking-widest">{tier.clearance}</span>
                      </div>

                      <div className="p-5 space-y-5">
                        <p className="font-sans text-xs text-secondary-foreground/72 leading-relaxed">{tier.detail}</p>

                        {tier.requirements.length > 0 && (
                          <div className="bg-black/25 p-4 border border-white/[0.05]">
                            <div className="font-mono text-[9px] text-primary/55 uppercase tracking-widest mb-3">Requirements</div>
                            <ul className="space-y-2">
                              {tier.requirements.map((req) => (
                                <li key={req} className="flex items-start gap-2.5 font-sans text-xs text-secondary-foreground/62">
                                  <span className="text-primary/45 mt-0.5 shrink-0 font-mono text-[10px]">—</span>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {tier.canApply ? (
                          <ApplicationModal
                            defaultTier={tier.id}
                            trigger={
                              <Button
                                size="sm"
                                className="font-mono uppercase text-[10px] tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-5 h-9 btn-primary-depth"
                              >
                                Apply for {tier.id} Access
                              </Button>
                            }
                          />
                        ) : (
                          <div className="px-4 py-3 border border-white/8 bg-black/30 font-mono text-[9px] text-muted-foreground/38 uppercase tracking-widest">
                            Command intake is not publicly open
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
