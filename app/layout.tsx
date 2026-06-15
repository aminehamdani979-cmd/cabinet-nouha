import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cabinetnouha.ma";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cabinet Nouha | Institut de Beauté de Luxe à Dakhla",
    template: "%s | Cabinet Nouha",
  },
  description:
    "Cabinet Nouha, institut de beauté premium à Dakhla. Microblading, maquillage permanent, design des sourcils et soins du visage par une experte certifiée PHIBROWS Academy (USA). Réservez votre rendez-vous dès maintenant.",
  keywords: [
    "Cabinet Nouha Dakhla",
    "Microblading Dakhla",
    "Institut de beauté Dakhla",
    "Maquillage permanent Dakhla",
    "Soins du visage Dakhla",
    "Soins esthétiques Dakhla",
    "Clinique esthétique Dakhla",
    "PHIBROWS Dakhla",
  ],
  authors: [{ name: "Cabinet Nouha" }],
  openGraph: {
    title: "Cabinet Nouha | Institut de Beauté de Luxe à Dakhla",
    description:
      "Institut de beauté premium à Dakhla. Microblading, maquillage permanent et soins esthétiques par une experte certifiée PHIBROWS Academy (USA).",
    url: siteUrl,
    siteName: "Cabinet Nouha",
    locale: "fr_MA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cabinet Nouha - Institut de Beauté de Luxe à Dakhla",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cabinet Nouha | Institut de Beauté de Luxe à Dakhla",
    description:
      "Institut de beauté premium à Dakhla. Microblading, maquillage permanent et soins esthétiques certifiés PHIBROWS Academy (USA).",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Cabinet Nouha",
  image: `${siteUrl}/og-image.jpg`,
  url: siteUrl,
  telephone: "+212708835156",
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dakhla",
    addressCountry: "MA",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/cabinet_nouha_dakhla",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="bg-ivory font-body text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
