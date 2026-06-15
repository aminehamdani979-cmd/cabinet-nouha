"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const transformations = [
  {
    title: "Microblading Sourcils",
    before: "/microblading-avant.jpg",
    after: "/microblading-apres.jpg",
  },
  {
    title: "Maquillage Permanent Lèvres",
    before: "/maquillage-permanent-avant.png",
    after: "/maquillage-permanent-apres.png",
  },
  {
    title: "Soin de Visage Éclat",
    before: "/soinvisage-avant.png",
    after: "/soinvisage-apres.png",
  },
];

export function BeforeAfter() {
  return (
    <section id="results" className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="Transformations"
          title="Des Résultats Qui Parlent d'Eux-Mêmes"
          description="Découvrez la précision et l'élégance de nos transformations, réalisées avec un savoir-faire certifié PHIBROWS."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {transformations.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="overflow-hidden rounded-2xl bg-beige/30 shadow-luxury"
            >
              <div className="grid grid-cols-2">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.before}
                    alt={`${item.title} - Avant`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-charcoal/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory">
                    Avant
                  </span>
                </div>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.after}
                    alt={`${item.title} - Après`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-champagne px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-charcoal">
                    Après
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
