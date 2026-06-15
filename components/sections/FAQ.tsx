"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const faqs = [
  {
    question: "Le microblading est-il douloureux ?",
    answer:
      "Une crème anesthésiante est appliquée avant le traitement, ce qui rend la procédure très tolérable. La plupart des clientes décrivent une sensation de léger frottement plutôt qu'une douleur.",
  },
  {
    question: "Combien de temps dure une séance de microblading ?",
    answer:
      "Une séance complète dure généralement entre 2h et 2h30, incluant la consultation, le dessin des sourcils, l'application de l'anesthésiant et le traitement lui-même.",
  },
  {
    question: "Combien de temps dure le résultat du microblading ?",
    answer:
      "Le résultat dure en moyenne entre 12 et 18 mois, selon votre type de peau, votre routine de soin et votre exposition au soleil. Une retouche annuelle est recommandée pour maintenir l'effet.",
  },
  {
    question: "Quelle est la période de cicatrisation après un microblading ?",
    answer:
      "La cicatrisation complète prend environ 4 à 6 semaines. Les premiers jours, la couleur peut paraître plus intense puis s'estompe légèrement avant de se stabiliser.",
  },
  {
    question: "Le maquillage permanent est-il sûr ?",
    answer:
      "Oui, à condition d'être réalisé par une professionnelle certifiée dans un environnement respectant des protocoles d'hygiène stricts — ce qui est notre priorité absolue au Cabinet Nouha.",
  },
  {
    question: "Quels produits utilisez-vous pour les pigments ?",
    answer:
      "Nous utilisons exclusivement des pigments premium, certifiés et adaptés aux techniques PHIBROWS, sélectionnés pour leur sécurité et la qualité de leur tenue dans le temps.",
  },
  {
    question: "Comment se déroule la première consultation ?",
    answer:
      "La consultation permet d'analyser votre morphologie, vos attentes et votre type de peau, afin de définir ensemble la technique et le design les plus adaptés avant tout traitement.",
  },
  {
    question: "Dois-je préparer quelque chose avant mon rendez-vous ?",
    answer:
      "Nous vous recommandons d'éviter l'alcool, la caféine et les anti-inflammatoires 24h avant votre séance, et de venir avec une peau propre, sans maquillage sur la zone traitée.",
  },
  {
    question: "Proposez-vous des soins du visage personnalisés ?",
    answer:
      "Oui, chaque soin du visage est adapté à votre type de peau et à vos besoins spécifiques, après une analyse approfondie réalisée lors de la consultation.",
  },
  {
    question: "Quelles sont vos normes d'hygiène ?",
    answer:
      "Nous respectons des protocoles d'hygiène stricts : matériel à usage unique, stérilisation rigoureuse et environnement de travail impeccable, conformément aux standards professionnels les plus élevés.",
  },
  {
    question: "Puis-je réserver directement via le site ?",
    answer:
      "Oui, notre système de réservation en ligne vous permet de choisir un créneau disponible et de confirmer votre rendez-vous instantanément via WhatsApp.",
  },
  {
    question: "Que faire si je dois annuler ou reporter mon rendez-vous ?",
    answer:
      "Contactez-nous directement via WhatsApp dès que possible. Nous ferons notre maximum pour vous proposer un nouveau créneau adapté à votre emploi du temps.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-beige/40 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="Questions Fréquentes"
          title="Tout Ce Que Vous Devez Savoir"
          description="Retrouvez les réponses aux questions les plus posées sur nos prestations et notre fonctionnement."
        />

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                className="overflow-hidden rounded-2xl bg-ivory shadow-luxury"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-charcoal md:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-champagne-dark transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-charcoal-muted">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
