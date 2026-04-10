import { motion } from "framer-motion";
import { Activity, Database, Crosshair, Shield, Command } from "lucide-react";
import { ApplicationModal } from "@/components/ApplicationModal";

export const Tiers = () => {
  return (
    <section className="py-24 border-t border-white/5 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-2">Access Levels</h2>
          <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">Operational Tiers</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { role: "Observer", desc: "Basic network access. Monitor active drops and intelligence.", icon: Activity },
            { role: "Contributor", desc: "Submit field reports, raw media, and regional intelligence.", icon: Database },
            { role: "Field Operator", desc: "Deployed asset. Verified identity. Direct tasking board access.", icon: Crosshair },
            { role: "Verified Press", desc: "Full RSR credentials. Priority publishing pipeline.", icon: Shield },
            { role: "Command", desc: "Network administration, operation tasking, and asset coordination.", icon: Command, full: "md:col-span-2 lg:col-span-2" },
          ].map((tier, i) => (
            <ApplicationModal key={i} trigger={
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 tactical-border bg-card/50 hover:bg-card/80 cursor-pointer backdrop-blur-sm relative group overflow-hidden text-left w-full h-full block ${tier.full || ''}`}
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <tier.icon className="w-8 h-8 text-primary mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-mono text-xl font-bold uppercase mb-2 group-hover:text-primary transition-colors">{tier.role}</h4>
                <p className="text-sm text-secondary-foreground font-sans leading-[1.5]">{tier.desc}</p>
                <div className="absolute top-4 right-4 font-mono text-xs text-primary/30">T-{i+1}</div>
              </motion.div>
            } />
          ))}
        </div>
      </div>
    </section>
  );
};
