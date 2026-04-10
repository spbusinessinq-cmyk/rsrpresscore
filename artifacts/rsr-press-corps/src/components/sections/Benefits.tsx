import { motion } from "framer-motion";
import { Zap, Mic, BarChart, FileKey } from "lucide-react";

const BENEFITS = [
  { icon: Zap, title: "Amplification", desc: "Bypass algorithmic suppression. Get your raw footage and reports in front of RSR's massive audience without editorial interference.", index: "A" },
  { icon: FileKey, title: "Access", desc: "Gain entry to restricted events, press conferences, and zones with verifiable credentials that command respect in the field.", index: "B" },
  { icon: BarChart, title: "Impact Tracking", desc: "See exactly how your intelligence is used, who views it, and how it shapes the narrative across the network.", index: "C" },
  { icon: Mic, title: "Voice", desc: "Don't just witness history. Document it accurately without corporate editorial spin — and reach the audience that matters.", index: "D" },
];

export const Benefits = () => {
  return (
    <section className="py-24 relative overflow-hidden section-base">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/12 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,_hsl(150_55%_33%_/_0.05)_0%,_transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="status-dot" />
            <span className="cmd-label-primary">Value Matrix</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Network Benefits</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel p-6 relative overflow-hidden group hover:border-primary/25 transition-all"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/25 via-transparent to-transparent" />
              <div className="absolute top-4 right-4 font-mono text-[10px] text-primary/20 group-hover:text-primary/35 transition-colors">{benefit.index}</div>

              <div className="flex gap-5 items-start">
                <div className="w-11 h-11 shrink-0 border border-primary/20 bg-primary/8 flex items-center justify-center group-hover:border-primary/35 group-hover:bg-primary/12 transition-all">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-mono text-base font-bold uppercase tracking-wide mb-2 group-hover:text-primary/90 transition-colors">{benefit.title}</h4>
                  <p className="text-xs text-secondary-foreground/70 font-sans leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
