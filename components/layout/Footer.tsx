import { Instagram, Facebook, MapPin, Phone, Clock } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-semibold">
              Cabinet <span className="text-champagne-light">Nouha</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ivory/60">
              Institut de beauté de luxe à Dakhla. Microblading, maquillage permanent et
              soins esthétiques d&apos;exception, certifiés PHIBROWS Academy (USA).
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/cabinet_nouha_dakhla"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 transition-colors hover:border-champagne hover:text-champagne-light"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 transition-colors hover:border-champagne hover:text-champagne-light"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display text-lg font-semibold text-champagne-light">
              Navigation
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ivory/60">
              <li><a href="#about" className="transition-colors hover:text-ivory">À Propos</a></li>
              <li><a href="#services" className="transition-colors hover:text-ivory">Services</a></li>
              <li><a href="#results" className="transition-colors hover:text-ivory">Avant / Après</a></li>
              <li><a href="#testimonials" className="transition-colors hover:text-ivory">Témoignages</a></li>
              <li><a href="#faq" className="transition-colors hover:text-ivory">FAQ</a></li>
              <li><a href="#booking" className="transition-colors hover:text-ivory">Réservation</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold text-champagne-light">
              Nos Services
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ivory/60">
              <li>Microblading</li>
              <li>Maquillage Permanent</li>
              <li>Design des Sourcils</li>
              <li>Extensions de Cils</li>
              <li>Soins du Visage</li>
              <li>Soins de la Peau</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-champagne-light">
              Contact
            </h4>
            <ul className="mt-4 space-y-4 text-sm text-ivory/60">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-champagne" />
                <span>Dakhla, Maroc</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-champagne" />
                <span>+212 7 08 83 51 56</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-champagne" />
                <span>Lun - Sam : 9h00 - 19h00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ivory/10 pt-8 text-center text-xs text-ivory/40">
          <p>
            © {year} Cabinet Nouha. Tous droits réservés. — Certifiée PHIBROWS Academy (USA)
          </p>
        </div>
      </div>
    </footer>
  );
}
