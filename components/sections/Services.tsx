"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const services = [
  {
    name: "Microblading",
    image: "/microblading.jpg",
    description:
      "Technique de pointe pour des sourcils naturellement parfaits, poil par poil, adaptés à la morphologie de votre visage.",
    benefits: ["Résultat naturel", "Effet poil à poil", "Tenue longue durée"],
    duration: "2h - 2h30",
  },
  {
    name: "Pigmentation des lèvres",
    image: "/pigmentation-des-lèvres.jpg",
    description:
      "Sublimez vos lèvres avec une pigmentation semi-permanente sur mesure qui rehausse leur couleur",
    benefits: ["Teinte adaptée à votre carnation", "Effet lèvres naturellement embellies", "Résultat longue durée"],
    duration: "1h30 - 2h30",
  },
  {
    name: "Design des Sourcils",
    image: "/design-sourcils.jpg",
    description:
      "Une analyse précise de votre visage pour concevoir des sourcils parfaitement harmonieux et structurés.",
    benefits: ["Harmonie du visage", "Style personnalisé", "Conseils experts"],
    duration: "45min - 1h",
  },
  {
    name: "Extensions de Cils",
   image: "/extensions-de-cils.jpg",
    description:
      "Un regard intense et glamour grâce à des extensions de cils appliquées avec soin et précision.",
    benefits: ["Regard intensifié", "Application délicate", "Effet glamour naturel"],
    duration: "1h30 - 2h",
  },
  {
    name: "Soins du Visage",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=900&auto=format&fit=crop",
    description:
      "Des soins du visage haut de gamme pour purifier, hydrater et redonner éclat à votre peau.",
    benefits: ["Peau revitalisée", "Produits premium", "Détente totale"],
    duration: "1h - 1h30",
  },
  {
    name: "Soins de la Peau",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=900&auto=format&fit=crop",
    description:
      "Des protocoles personnalisés pour traiter les imperfections et préserver la jeunesse de votre peau.",
    benefits: ["Approche personnalisée", "Technologies avancées", "Résultats visibles"],
    duration: "45min - 1h30",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-beige/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="Nos Prestations"
          title="Des Soins d'Exception, Pensés Pour Vous"
          description="Chaque traitement est réalisé avec des équipements professionnels, des produits premium et une attention absolue aux détails."
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-2xl bg-ivory shadow-luxury transition-transform duration-500 hover:-translate-y-1.5"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={`${service.name} au Cabinet Nouha à Dakhla`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-ivory/90 px-3 py-1.5 text-xs font-medium text-charcoal backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5 text-champagne-dark" />
                  {service.duration}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold text-charcoal">
                  {service.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-muted">
                  {service.description}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {service.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2 text-xs text-charcoal-muted"
                    >
                      <span className="h-1 w-1 rounded-full bg-champagne" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <a
                  href="#booking"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-champagne-dark transition-colors hover:text-charcoal"
                >
                  Réserver ce soin
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
