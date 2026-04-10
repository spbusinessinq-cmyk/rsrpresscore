import { motion } from "framer-motion";

const STEPS = [
  { step: "01", title: "Submit Application", desc: "Provide background, areas of operation, and operational intent via the secure intake form. All submissions are reviewed by command." },
  { step: "02", title: "Command Review", desc: "RSR analysts evaluate the application for credibility, operational need, and network fit. Incomplete or falsified submissions are permanently rejected." },
  { step: "03", title: "Credential Issuance", desc: "Upon acceptance, receive digital ID, tier classification, and network access credentials. A one-time access code is issued to your registered email." },
  { step: "04", title: "Begin Operations", desc: "Access the tasking board, claim open assignments, or submit independent field reports through the secure member portal." },
];

export const Process = () => {
  return (
    <section className="py-24 relative section-raised overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="status-dot" />
            <span className="cmd-label-primary">Protocol</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">How to Join</h3>
        </div>

        <div className="space-y-4">
          {STEPS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-5 items-start group"
            >
              {/* Step indicator */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-9 h-9 border border-primary/30 bg-primary/8 flex items-center justify-center font-mono text-[10px] font-bold text-primary tracking-wider group-hover:border-primary/50 group-hover:bg-primary/12 transition-all">
                  {item.step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-primary/20 to-transparent mt-1 min-h-[2rem]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4 glass-panel p-5 group-hover:border-primary/20 transition-all">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
                <h4 className="font-mono font-bold uppercase text-sm tracking-wide mb-2">{item.title}</h4>
                <p className="text-xs font-sans text-secondary-foreground/70 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
