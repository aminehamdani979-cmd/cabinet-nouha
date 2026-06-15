"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

const WHATSAPP_NUMBER = "212708835156";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Bonjour Cabinet Nouha, j'aimerais avoir plus d'informations."
);

export function Contact() {
  return (
    <section id="contact" className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <SectionHeading
          eyebrow="Nous Contacter"
          title="Venez Nous Rencontrer à Dakhla"
          description="Notre équipe est à votre disposition pour répondre à toutes vos questions et planifier votre visite."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4 rounded-2xl bg-beige/40 p-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-champagne/15">
                <MapPin className="h-5 w-5 text-champagne-dark" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  Adresse
                </h3>
                <p className="mt-1 text-sm text-charcoal-muted">Dakhla, Maroc</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-beige/40 p-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-champagne/15">
                <Phone className="h-5 w-5 text-champagne-dark" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  Téléphone / WhatsApp
                </h3>
                <p className="mt-1 text-sm text-charcoal-muted">+212 7 08 83 51 56</p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-beige/40 p-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-champagne/15">
                <Clock className="h-5 w-5 text-champagne-dark" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-charcoal">
                  Horaires
                </h3>
                <p className="mt-1 text-sm text-charcoal-muted">
                  Lundi - Samedi : 9h00 - 19h00
                  <br />
                  Dimanche : Fermé
                </p>
              </div>
            </div>

            <ButtonLink
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
              className="w-full"
            >
              <FaWhatsapp className="h-4 w-4" />
              Discuter sur WhatsApp
            </ButtonLink>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="overflow-hidden rounded-2xl shadow-luxury"
          >
            <iframe
              title="Localisation Cabinet Nouha - Dakhla"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13780.0!2d-15.9350!3d23.6848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQxJzA1LjMiTiAxNcKwNTYnMDYuMCJX!5e0!3m2!1sfr!2sma!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "420px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
