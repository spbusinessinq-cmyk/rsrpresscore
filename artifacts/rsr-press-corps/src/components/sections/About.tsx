import { motion } from "framer-motion";
import { Shield, Radar, Globe } from "lucide-react";

export const About = () => {
  return (
    <section className="py-24 relative overflow-hidden section-raised">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_50%,_hsl(150_55%_33%_/_0.05)_0%,_transparent_100%)] pointer-events-none" />

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
                <span className="cmd-label-primary">Platform Overview</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter leading-none">
                Not a Newsroom.<br />
                <span className="text-foreground/60">An Infrastructure.</span>
              </h3>
            </div>
            <div className="space-y-4 font-sans text-sm text-secondary-foreground/80 leading-relaxed">
              <p>
                Traditional media operates on gatekeeping and centralized control. RSR Press Corps is designed for the decentralized reality of modern conflict and narrative warfare.
              </p>
              <p>
                We provide the clearance, the tasking, and the distribution pipeline for independent field operators, correspondents, citizen reporters, and analysts who bypass legacy filters to deliver raw, actionable intelligence.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
              <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">RSR // Operational</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {[
              { icon: Shield, title: "Credentialing", desc: "Verifiable identity and tier classification for all field operations.", index: "01" },
              { icon: Radar, title: "Live Tasking", desc: "Real-time priority assignments and open coverage opportunities.", index: "02" },
              { icon: Globe, title: "Distribution", desc: "Direct pipeline to RSR's main network and audience infrastructure.", index: "03" },
            ].map((feature, i) => (
              <div
                key={i}
                className={`p-5 glass-panel relative overflow-hidden group transition-all hover:border-primary/25 ${i === 2 ? 'sm:col-span-2' : ''}`}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 bg-primary/8 border border-primary/20 flex items-center justify-center group-hover:border-primary/35 transition-colors">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-mono text-[10px] text-primary/30 group-hover:text-primary/50 transition-colors">{feature.index}</span>
                </div>
                <h4 className="font-mono font-bold uppercase text-sm mb-1.5 tracking-wider">{feature.title}</h4>
                <p className="text-xs text-secondary-foreground/70 font-sans leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
