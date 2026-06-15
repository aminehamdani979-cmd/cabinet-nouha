"use client";

import { motion } from "framer-motion";
import {
  Award,
  Microscope,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Gem,
} from "lucide-react";

const trustItems = [
  { icon: Award, label: "Certifiée PHIBROWS Academy" },
  { icon: Microscope, label: "Équipement Professionnel" },
  { icon: Sparkles, label: "Soins Cosmétiques Premium" },
  { icon: HeartHandshake, label: "Suivi Personnalisé" },
  { icon: ShieldCheck, label: "Normes d'Hygiène Strictes" },
  { icon: Gem, label: "Expérience de Luxe" },
];

export function TrustBar() {
  return (
    <section className="border-y border-champagne/15 bg-charcoal py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/25 bg-champagne/5">
                  <Icon className="h-5 w-5 text-champagne-light" strokeWidth={1.75} />
                </div>
                <p className="text-xs font-medium uppercase leading-tight tracking-wide text-ivory/70">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
