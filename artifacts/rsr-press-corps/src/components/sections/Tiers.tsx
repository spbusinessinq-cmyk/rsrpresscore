import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Database, Crosshair, Shield, Command, X, ChevronRight } from "lucide-react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    id: "Observer",
    label: "T-1",
    icon: Activity,
    desc: "Basic network access. Monitor active drops and intelligence from the field.",
    detail: "Observer status grants read-level access to the public operations board. Observers document local events, monitor regional activity, and contribute raw intelligence to the network without direct editorial authority.",
    requirements: ["Regional presence in a covered area", "Ability to attend and document events", "Reliable communication channel"],
    canApply: true,
  },
  {
    id: "Contributor",
    label: "T-2",
    icon: Database,
    desc: "Submit field reports, written analysis, and regional intelligence to the network.",
    detail: "Contributors are the editorial backbone. They submit structured field reports, written analysis, sourced media, and verified intelligence. Writing ability and basic research skills are required.",
    requirements: ["Demonstrated writing or reporting capability", "Ability to source and verify claims", "Portfolio or writing samples preferred"],
    canApply: true,
  },
  {
    id: "Field Operator",
    label: "T-3",
    icon: Crosshair,
    desc: "Deployed asset. Verified identity. Direct tasking board access for active coverage.",
    detail: "Field Operators are deployed on active assignments. They receive direct tasking, attend designated events, submit real-time reports, and operate under command directives. Identity verification is mandatory.",
    requirements: ["Physical ability to deploy to assigned locations", "Identity verification required", "Prior field or event coverage experience preferred"],
    canApply: true,
  },
  {
    id: "Verified Press",
    label: "T-4",
    icon: Shield,
    desc: "Full RSR credentials. Priority access. Established media track record required.",
    detail: "Verified Press status is for established journalists, independent media operators, and credentialed press with a documented track record. Credentials are reviewed against public record and prior publication history.",
    requirements: ["Published work under a consistent byline", "Verifiable media credentials or publication history", "Professional references or portfolio"],
    canApply: true,
  },
  {
    id: "Command",
    label: "CMD",
    icon: Command,
    desc: "Network administration, operation tasking, and asset coordination.",
    detail: "Command roles are not available through public intake. Command positions are appointed internally and require direct authorization. If you believe you have been directed here, contact the operator directly.",
    requirements: [],
    canApply: false,
    full: "md:col-span-2 lg:col-span-2",
  },
];

export const Tiers = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="tiers" className="py-24 border-t border-white/5 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-2">Access Levels</h2>
          <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Operational Tiers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TIERS.map((tier, i) => (
            <div key={tier.id} className={tier.full || ""}>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setExpanded(expanded === tier.id ? null : tier.id)}
                className={`w-full text-left p-6 tactical-border bg-card/50 backdrop-blur-sm relative group overflow-hidden cursor-pointer transition-all
                  ${expanded === tier.id ? "bg-card/80 border-primary/40" : "hover:bg-card/70 hover:border-primary/20"}`}
              >
                <div className={`absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity ${expanded === tier.id ? "opacity-100" : ""}`} />
                <div className="flex items-start justify-between mb-4">
                  <tier.icon className={`w-7 h-7 transition-opacity ${expanded === tier.id ? "text-primary opacity-100" : "text-primary opacity-40 group-hover:opacity-80"}`} />
                  <span className="font-mono text-[10px] text-primary/40 group-hover:text-primary/60 transition-colors">{tier.label}</span>
                </div>
                <h4 className={`font-mono text-lg font-bold uppercase mb-2 transition-colors ${expanded === tier.id ? "text-primary" : "group-hover:text-primary"}`}>
                  {tier.id}
                </h4>
                <p className="text-sm text-secondary-foreground font-sans leading-relaxed">{tier.desc}</p>
                <div className="flex items-center gap-1.5 mt-4 font-mono text-[10px] text-primary/50 uppercase tracking-widest">
                  {expanded === tier.id ? <X className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  {expanded === tier.id ? "Collapse" : "View Details"}
                </div>
              </motion.button>

              <AnimatePresence>
                {expanded === tier.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border border-t-0 border-primary/20 bg-black/60 p-6 space-y-5">
                      <p className="font-sans text-sm text-secondary-foreground leading-relaxed">{tier.detail}</p>

                      {tier.requirements.length > 0 && (
                        <div>
                          <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-3">Requirements</div>
                          <ul className="space-y-2">
                            {tier.requirements.map((req) => (
                              <li key={req} className="flex items-start gap-2 font-sans text-xs text-secondary-foreground">
                                <span className="text-primary mt-0.5 shrink-0">—</span>
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
                              className="font-mono uppercase text-xs tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-6 h-9"
                            >
                              Apply for {tier.id} Access
                            </Button>
                          }
                        />
                      ) : (
                        <div className="px-4 py-3 border border-destructive/20 bg-destructive/5 font-mono text-xs text-destructive/80 uppercase tracking-widest">
                          Command intake is not publicly open.
                        </div>
                      )}
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
