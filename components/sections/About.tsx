"use client";

import { motion } from "framer-motion";
import { Award, GraduationCap, Heart, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: GraduationCap,
    title: "Formation PHIBROWS Academy (USA)",
    description:
      "Une certification internationale rigoureuse, gage d'un savoir-faire technique irréprochable en microblading et maquillage permanent.",
  },
  {
    icon: Award,
    title: "Expertise Reconnue",
    description:
      "Des années dédiées à la maîtrise des techniques esthétiques les plus avancées, au service de résultats naturels et durables.",
  },
  {
    icon: Heart,
    title: "Passion du Détail",
    description:
      "Chaque geste est pensé pour révéler la beauté unique de chaque visage, avec douceur, précision et attention.",
  },
  {
    icon: Sparkles,
    title: "Exigence & Qualité",
    description:
      "Des produits premium, un environnement impeccable et un protocole d'hygiène strict pour une sérénité totale.",
  },
];

export function About() {
  return (
    <section id="about" className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-luxury">
              <img
                 src="/nouha-about.jpg"
                alt="Nouha, fondatrice du Cabinet Nouha à Dakhla"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="absolute -right-6 -top-6 hidden h-32 w-32 items-center justify-center rounded-full border border-champagne/30 bg-ivory shadow-luxury md:flex">
              <div className="text-center">
                <p className="font-display text-2xl font-semibold text-champagne-dark">
                  USA
                </p>
                <p className="text-[10px] uppercase tracking-wider text-charcoal-muted">
                  Certifiée
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <div className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-luxury text-champagne-dark">
              <span className="h-px w-8 bg-champagne/60" />
              Notre Histoire
            </div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-charcoal md:text-4xl lg:text-5xl">
              Rencontrez Nouha
            </h2>
            <p className="mt-6 text-base leading-relaxed text-charcoal-muted md:text-lg">
              Animée par une passion profonde pour l&apos;art de la beauté, Nouha a fondé
              son cabinet à Dakhla avec une vision claire : offrir aux femmes une
              expérience esthétique d&apos;exception, alliant précision technique et
              raffinement absolu.
            </p>
            <p className="mt-4 text-base leading-relaxed text-charcoal-muted md:text-lg">
              Formée à la prestigieuse <strong className="text-charcoal">PHIBROWS Academy</strong> aux
              États-Unis, elle maîtrise les techniques les plus avancées du microblading
              et du maquillage permanent. Chaque traitement est réalisé avec une attention
              minutieuse, pour révéler une beauté naturelle, sublimée et durable.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex flex-col gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/10">
                      <Icon className="h-5 w-5 text-champagne-dark" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-charcoal">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-charcoal-muted">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
