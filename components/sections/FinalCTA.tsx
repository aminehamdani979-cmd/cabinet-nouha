"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ButtonLink } from "@/components/ui/Button";

const WHATSAPP_NUMBER = "212708835156";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Bonjour Cabinet Nouha, je souhaite réserver un rendez-vous."
);

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-4 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-luxury text-champagne-light">
            <span className="h-px w-8 bg-champagne/60" />
            Votre Beauté Mérite L&apos;Excellence
            <span className="h-px w-8 bg-champagne/60" />
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight text-ivory md:text-4xl lg:text-5xl">
            Offrez-Vous l&apos;Expérience Cabinet Nouha
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/70 md:text-lg">
            Réservez dès aujourd&apos;hui votre rendez-vous et découvrez un savoir-faire
            certifié PHIBROWS Academy, dans un cadre pensé pour votre confort et votre
            élégance.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <ButtonLink href="#booking" variant="secondary" size="lg">
              <Calendar className="h-4 w-4" />
              Réserver un Rendez-vous
            </ButtonLink>
            <ButtonLink
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
            >
              <FaWhatsapp className="h-4 w-4" />
              WhatsApp
            </ButtonLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
