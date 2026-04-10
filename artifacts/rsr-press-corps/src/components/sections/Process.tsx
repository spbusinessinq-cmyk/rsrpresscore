import { motion } from "framer-motion";
import { SignalRouteMesh } from "@/components/graphics/SignalRouteMesh";

const STEPS = [
  { step: "01", title: "Submit Application", code: "INIT", desc: "Provide background, areas of operation, and operational intent via the secure intake form. All submissions are reviewed by command." },
  { step: "02", title: "Command Review",     code: "EVAL", desc: "RSR analysts evaluate the application for credibility, operational need, and network fit. Incomplete or falsified submissions are permanently rejected." },
  { step: "03", title: "Credential Issuance", code: "AUTH", desc: "Upon acceptance, receive digital ID, tier classification, and network access credentials. A one-time access code is issued to your registered email." },
  { step: "04", title: "Begin Operations",   code: "LIVE", desc: "Access the tasking board, claim open assignments, or submit independent field reports through the secure member portal." },
];

export const Process = () => {
  return (
    <section className="py-24 relative section-raised overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Background route mesh graphic */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl opacity-100 pointer-events-none">
        <SignalRouteMesh width={800} height={160} opacity={0.7} />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="status-dot" />
            <span className="cmd-label-primary">Protocol</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">How to Join</h3>
        </div>

        <div className="space-y-3">
          {STEPS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-5 items-stretch group"
            >
              {/* Step indicator column */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="w-9 h-9 border border-primary/30 bg-primary/8 flex items-center justify-center font-mono text-[10px] font-bold text-primary tracking-wider group-hover:border-primary/50 group-hover:bg-primary/12 transition-all relative z-10">
                  {item.step}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 relative mt-1 min-h-[2rem] overflow-hidden">
                    {/* Animated signal traveling down */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
                    <div
                      className="absolute inset-x-0 h-3 bg-gradient-to-b from-primary/50 to-transparent"
                      style={{ animation: `stepPulse${i} ${2.5 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2 glass-panel p-5 group-hover:border-primary/22 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
                {/* Right-side code label */}
                <div className="absolute top-4 right-5 font-mono text-[8px] text-muted-foreground/18 uppercase tracking-widest">{item.code}</div>
                <h4 className="font-mono font-bold uppercase text-sm tracking-wide mb-2">{item.title}</h4>
                <p className="text-xs font-sans text-secondary-foreground/68 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom pipeline terminus */}
        <div className="flex items-center gap-3 mt-8 px-5">
          <div className="w-9 flex items-center justify-center">
            <div className="w-2 h-2 border border-primary/40 bg-primary/15 flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-primary/60" />
            </div>
          </div>
          <div className="font-mono text-[9px] text-primary/35 uppercase tracking-widest">Pipeline complete — credentials issued</div>
        </div>
      </div>

      <style>{`
        @keyframes stepPulse0 { 0%,100%{top:-12px;opacity:0} 30%,70%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes stepPulse1 { 0%,100%{top:-12px;opacity:0} 30%,70%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes stepPulse2 { 0%,100%{top:-12px;opacity:0} 30%,70%{opacity:1} 100%{top:100%;opacity:0} }
      `}</style>
    </section>
  );
};
