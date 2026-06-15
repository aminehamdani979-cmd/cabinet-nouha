"use client";

import { motion } from "framer-motion";
import { MessageSquare, ClipboardCheck, Sparkles, RefreshCw } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Consultation",
    description:
      "Un échange personnalisé pour comprendre vos attentes, analyser votre morphologie et définir le soin idéal.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Plan Personnalisé",
    description:
      "Nous concevons ensemble un protocole sur-mesure, adapté à votre peau, votre style et vos objectifs.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Traitement",
    description:
      "Le soin est réalisé avec précision, dans un environnement luxueux, hygiénique et apaisant.",
  },
  {
    icon: RefreshCw,
    number: "04",
    title: "Suivi",
    description:
      "Un accompagnement post-traitement pour garantir des résultats optimaux et durables dans le temps.",
  },
];

export function BookingProcess() {
  return (
    <section className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="Votre Parcours"
          title="Un Processus Pensé Pour Votre Sérénité"
          description="De la première consultation au suivi post-soin, chaque étape est conçue pour vous offrir une expérience fluide et rassurante."
        />

        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-champagne/20 lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-ivory shadow-luxury">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-champagne/10">
                    <Icon className="h-7 w-7 text-champagne-dark" strokeWidth={1.5} />
                  </div>
                </div>
                <span className="mt-4 font-display text-sm font-semibold text-champagne-dark">
                  ÉTAPE {step.number}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-charcoal">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
