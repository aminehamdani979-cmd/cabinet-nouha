"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_NUMBER = "212708835156";
const DEFAULT_MESSAGE = encodeURIComponent(
  "Bonjour Cabinet Nouha, j'aimerais avoir plus d'informations sur vos services."
);

export function WhatsAppFloatingButton() {
  const [hideForBooking, setHideForBooking] = useState(false);

  useEffect(() => {
    const bookingSection = document.getElementById("booking");
    if (!bookingSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideForBooking(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(bookingSection);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {!hideForBooking && (
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter sur WhatsApp"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxury md:bottom-8 md:right-8 md:h-16 md:w-16"
        >
          <FaWhatsapp className="h-8 w-8" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}