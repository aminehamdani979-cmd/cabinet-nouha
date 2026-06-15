"use client";

import { motion } from "framer-motion";
import { Award, Calendar } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const WHATSAPP_NUMBER = "212708835156";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Bonjour Cabinet Nouha, je souhaite avoir plus d'informations sur vos prestations."
);

export function Hero() {
  return (
    <section
  id="hero"
  className="relative flex min-h-screen items-center overflow-hidden"
>
     {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/cabinet-bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-ivory/60" />

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />
      </div>

      <div className="relative z-20 mx-auto grid w-full max-w-7xl  grid-cols-1 items-center gap-12 px-6 pt-32 pb-20 lg:grid-cols-2 lg:px-12 lg:pt-24">
        {/* Text content */}
        <motion.div
  initial={false}
  animate={{ opacity: 1, y: 0 }}
>
          <Badge icon={Award} variant="outline" className="mb-6">
            Certifiée PHIBROWS Academy — USA
          </Badge>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-charcoal sm:text-5xl lg:text-6xl">
            L&apos;Art de la Beauté,
            <br />
            <span className="text-gold-gradient">Redéfini à Dakhla</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-charcoal-muted md:text-lg">
            Microblading, maquillage permanent et soins esthétiques d&apos;exception,
            réalisés avec une précision artistique et des technologies de pointe.
            Découvrez une expérience beauté véritablement luxueuse.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="#booking" variant="primary" size="lg">
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

          <div className="mt-12 flex items-center gap-6">
            <div className="luxury-divider" />
            <p className="text-xs uppercase tracking-luxury text-charcoal-muted">
              Excellence • Précision • Élégance
            </p>
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-luxury">
            <img
              src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1200&auto=format&fit=crop"
              alt="Soin esthétique de luxe au Cabinet Nouha à Dakhla"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
          </div>

          {/* Floating badge card */}
          <motion.div
  initial={false}
  animate={{ opacity: 1, scale: 1 }}
  className="relative"
>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/15">
                <Award className="h-6 w-6 text-champagne-dark" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-charcoal">
                  PHIBROWS USA
                </p>
                <p className="text-xs text-charcoal-muted">Formation Certifiée</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
