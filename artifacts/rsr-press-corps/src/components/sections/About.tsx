import { motion } from "framer-motion";
import { Shield, Radar, Globe } from "lucide-react";

export const About = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-black/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-2">Platform Overview</h2>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Not a Newsroom. <br/>An Infrastructure.</h3>
            </div>
            <p className="font-mono text-secondary-foreground leading-[1.5]">
              Traditional media operates on gatekeeping and centralized control. RSR Press Corps is designed for the decentralized reality of modern conflict and narrative warfare.
            </p>
            <p className="font-mono text-secondary-foreground leading-[1.5]">
              We provide the clearance, the tasking, and the distribution pipeline for independent field operators, correspondents, citizen reporters, and analysts who bypass legacy filters to deliver raw, actionable intelligence.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { icon: Shield, title: "Credentialing", desc: "Verifiable identity for field operations." },
              { icon: Radar, title: "Live Tasking", desc: "Real-time priorities and open assignments." },
              { icon: Globe, title: "Distribution", desc: "Direct pipeline to RSR's main network." }
            ].map((feature, i) => (
              <div key={i} className={`p-6 tactical-border bg-card/30 backdrop-blur-sm rounded-none ${i === 2 ? 'sm:col-span-2' : ''}`}>
                <feature.icon className="w-6 h-6 text-primary mb-4" />
                <h4 className="font-mono font-bold uppercase mb-2">{feature.title}</h4>
                <p className="text-sm text-secondary-foreground font-mono leading-[1.5]">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
