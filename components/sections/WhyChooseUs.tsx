"use client";

import { motion } from "framer-motion";
import {
  Award,
  Microscope,
  UserCheck,
  Gem,
  ShieldCheck,
  Leaf,
  Sparkle,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reasons = [
  {
    icon: Award,
    title: "Certification PHIBROWS",
    description:
      "Une formation internationale aux États-Unis, garante d'une expertise technique de très haut niveau.",
  },
  {
    icon: Microscope,
    title: "Équipement de Pointe",
    description:
      "Des technologies professionnelles et des outils de dernière génération pour des résultats précis.",
  },
  {
    icon: UserCheck,
    title: "Consultations Personnalisées",
    description:
      "Chaque parcours débute par une analyse approfondie de vos attentes et de votre morphologie.",
  },
  {
    icon: Gem,
    title: "Produits Premium",
    description:
      "Une sélection rigoureuse de produits haut de gamme, sûrs et performants.",
  },
  {
    icon: ShieldCheck,
    title: "Protocoles d'Hygiène",
    description:
      "Des standards d'hygiène et de sécurité stricts, pour une tranquillité d'esprit totale.",
  },
  {
    icon: Leaf,
    title: "Résultats Naturels",
    description:
      "Une approche artistique qui respecte et sublime votre beauté naturelle, sans excès.",
  },
  {
    icon: Sparkle,
    title: "Expérience de Luxe",
    description:
      "Un cadre élégant et apaisant, pensé pour vous offrir un moment d'exception.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-charcoal py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="Pourquoi Nous Choisir"
          title="L'Excellence Comme Standard"
          description="Cabinet Nouha incarne une nouvelle référence de la beauté à Dakhla — où expertise certifiée et raffinement se rencontrent."
          light
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                className="rounded-2xl border border-champagne/10 bg-ivory/[0.03] p-6 transition-colors hover:border-champagne/30 hover:bg-ivory/[0.06]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/25 bg-champagne/5">
                  <Icon className="h-5 w-5 text-champagne-light" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ivory">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/60">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
