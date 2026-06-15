"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const testimonials = [
  {
    name: "Salma B.",
    rating: 5,
    text: "Une expérience exceptionnelle du début à la fin. Le microblading a complètement transformé mes sourcils, le résultat est tellement naturel que personne ne devine que c'est fait. Nouha est une véritable artiste.",
    service: "Microblading",
  },
  {
    name: "Imane R.",
    rating: 5,
    text: "Le cabinet est magnifique, propre et apaisant. J'ai fait un maquillage permanent des lèvres et le rendu est sublime, exactement la couleur que je voulais. Je recommande vivement !",
    service: "Maquillage Permanent",
  },
  {
    name: "Yasmine F.",
    rating: 5,
    text: "Enfin un institut à Dakhla qui propose un vrai standard de luxe. Le soin du visage était divin, ma peau n'a jamais été aussi belle. Nouha prend vraiment le temps d'écouter et de conseiller.",
    service: "Soins du Visage",
  },
  {
    name: "Khadija T.",
    rating: 5,
    text: "J'avais peur du design des sourcils mais Nouha a su m'orienter vers la forme parfaite pour mon visage. Le résultat est impeccable et tellement harmonieux. Merci infiniment !",
    service: "Design des Sourcils",
  },
  {
    name: "Nadia E.",
    rating: 5,
    text: "Professionnalisme, douceur et précision. Les extensions de cils sont parfaites, légères et naturelles. C'est devenu mon rituel beauté incontournable.",
    service: "Extensions de Cils",
  },
  {
    name: "Houda M.",
    rating: 5,
    text: "Une vraie certification PHIBROWS qui se ressent dans la qualité du travail. Tout est pensé dans les moindres détails, du protocole d'hygiène à l'accueil chaleureux. Cinq étoiles amplement méritées.",
    service: "Microblading",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-beige/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="Témoignages"
          title="La Confiance de Nos Clientes"
          description="Des avis authentiques de femmes qui ont vécu l'expérience Cabinet Nouha."
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className="flex flex-col rounded-2xl bg-ivory p-7 shadow-luxury"
            >
              <Quote className="h-7 w-7 text-champagne/50" strokeWidth={1.5} />
              <div className="mt-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-champagne text-champagne" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal-muted">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-champagne/15 pt-4">
                <p className="font-display text-base font-semibold text-charcoal">
                  {t.name}
                </p>
                <p className="text-xs uppercase tracking-wide text-champagne-dark">
                  {t.service}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
