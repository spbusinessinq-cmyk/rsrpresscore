import { motion } from "framer-motion";

export const Process = () => {
  return (
    <section className="py-24 border-t border-white/5 bg-black/40">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-mono text-primary text-sm uppercase tracking-widest mb-2">Protocol</h2>
          <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">How to Join</h3>
        </div>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/50 before:to-transparent">
          {[
            { step: "01", title: "Submit Application", desc: "Provide background, areas of operation, and intent via the secure intake form." },
            { step: "02", title: "Command Review", desc: "RSR analysts evaluate application for credibility and operational need." },
            { step: "03", title: "Credential Issuance", desc: "Receive digital ID, tier classification, and network access keys." },
            { step: "04", title: "Begin Operations", desc: "Access the tasking board, pick up assignments, or submit independent reports." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary/50 bg-background font-mono text-xs font-bold text-primary z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(30,150,80,0.5)]">
                {item.step}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 tactical-border bg-card/50 backdrop-blur-sm">
                <h4 className="font-mono font-bold uppercase text-lg mb-2 text-foreground">{item.title}</h4>
                <p className="text-sm font-mono text-secondary-foreground">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
