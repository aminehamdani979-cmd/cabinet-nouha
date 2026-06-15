"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Calendar } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Accueil", href: "#hero" },
  { label: "À Propos", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Résultats", href: "#results" },
  { label: "Témoignages", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-ivory/90 shadow-luxury backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        <a href="#hero" className="font-display text-2xl font-semibold tracking-wide text-charcoal">
          Cabinet <span className="text-champagne-dark">Nouha</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-wide text-charcoal/80 transition-colors hover:text-champagne-dark"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="#booking" variant="secondary" size="sm">
            <Calendar className="h-4 w-4" />
            Réserver
          </ButtonLink>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-full border border-charcoal/10 p-2 text-charcoal lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden bg-ivory/95 backdrop-blur-md lg:hidden"
        >
          <nav className="flex flex-col gap-1 px-6 pb-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-wide text-charcoal/80 transition-colors hover:bg-beige hover:text-champagne-dark"
              >
                {link.label}
              </a>
            ))}
            <ButtonLink href="#booking" variant="secondary" size="md" className="mt-3 w-full" onClick={() => setMobileOpen(false)}>
              <Calendar className="h-4 w-4" />
              Réserver un Rendez-vous
            </ButtonLink>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
