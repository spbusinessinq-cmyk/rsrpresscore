import { motion } from "framer-motion";
import { Zap, Mic, BarChart, FileKey } from "lucide-react";

export const Benefits = () => {
  return (
    <section className="py-24 border-t border-white/5 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-2">Value Matrix</h2>
          <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Network Benefits</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Zap, title: "Amplification", desc: "Bypass algorithmic suppression. Get your raw footage and reports in front of RSR's massive audience." },
            { icon: FileKey, title: "Access", desc: "Gain entry to restricted events, press conferences, and zones with verifiable credentials." },
            { icon: BarChart, title: "Impact Tracking", desc: "See exactly how your intelligence is used, who views it, and how it shapes the narrative." },
            { icon: Mic, title: "Voice", desc: "Don't just witness history. Document it accurately without corporate editorial spin." }
          ].map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 p-6 items-start"
            >
              <div className="w-12 h-12 shrink-0 border border-primary/30 bg-primary/10 flex items-center justify-center rounded-none">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-mono text-xl font-bold uppercase mb-2">{benefit.title}</h4>
                <p className="text-secondary-foreground font-mono leading-[1.5]">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
