# Cabinet Nouha — Site & Système de Réservation

Site web de luxe pour Cabinet Nouha (institut de beauté à Dakhla, Maroc), avec
système de réservation complet propulsé par **Supabase** et redirection
**WhatsApp** automatique.

## Stack Technique

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (palette luxe : Ivoire, Champagne, Beige, Charbon)
- **Framer Motion** (animations)
- **Lucide Icons**
- **Supabase** (PostgreSQL + RLS) — moteur de réservation principal
- **WhatsApp** (`wa.me`) — finalisation de la demande de rendez-vous

## 1. Installation

```bash
npm install
```

## 2. Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Ouvrez le **SQL Editor** et exécutez le contenu de `supabase/schema.sql`.
   Cela crée :
   - `available_slots` — créneaux disponibles gérés par l'admin
   - `blocked_dates` — jours fermés
   - `appointments` — réservations des visiteurs
   - Toutes les policies RLS nécessaires (lecture publique des créneaux
     disponibles, écriture publique uniquement sur `appointments` en INSERT,
     accès complet via `service_role` pour l'admin).
3. Récupérez vos clés dans **Project Settings → API** :
   - `Project URL`
   - `anon public key`
   - `service_role key` (secret, ne jamais exposer côté client)

## 3. Variables d'Environnement

Copiez `.env.example` vers `.env.local` et renseignez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx
NEXT_PUBLIC_SITE_URL=https://cabinetnouha.ma
NEXT_PUBLIC_WHATSAPP_NUMBER=212708835156
ADMIN_PASSWORD=votre-mot-de-passe-fort
```

## 4. Lancer en développement

```bash
npm run dev
```

Le site est disponible sur `http://localhost:3000`.
Le tableau de bord admin est sur `http://localhost:3000/admin` (protégé par
`ADMIN_PASSWORD`).

## 5. Build de production

```bash
npm run build
npm run start
```

## Architecture de Réservation

### Côté Visiteur (Public)
1. Le visiteur consulte le calendrier (`/api/booking/availability`) — seuls
   les créneaux non réservés et les dates non bloquées sont visibles.
2. Il sélectionne une date + un horaire, remplit le formulaire.
3. À la soumission (`POST /api/booking/create`) :
   - La réservation est enregistrée dans `appointments` (statut `pending`).
   - Le créneau correspondant est marqué `is_booked = true` dans
     `available_slots`.
   - Un message WhatsApp pré-rempli est généré et l'utilisateur est redirigé
     vers `wa.me/212708835156` pour finaliser avec l'équipe.

### Côté Admin (`/admin`)
Protégé par mot de passe (`ADMIN_PASSWORD`), le tableau de bord permet de :
- **Aujourd'hui** : voir les rendez-vous du jour avec statistiques.
- **À Venir** : voir tous les rendez-vous futurs.
- **Recherche** : rechercher par nom/téléphone et filtrer par statut.
- **Créneaux** : ajouter des horaires disponibles (rapides ou personnalisés),
  supprimer des créneaux non réservés.
- **Dates Bloquées** : bloquer des jours entiers (congés, fériés) — masqués
  du calendrier public.

Pour chaque rendez-vous, l'admin peut le marquer Terminé ou Annulé.
Annuler un rendez-vous libère automatiquement son créneau (`is_booked = false`),
qui redevient réservable.

## Sécurité (RLS)

- `anon` (visiteurs) : lecture des créneaux disponibles + dates bloquées,
  création de réservations uniquement (INSERT).
- `service_role` (API routes admin) : accès complet, jamais exposé au navigateur.
- Le dashboard `/admin` est protégé par un cookie de session basé sur
  `ADMIN_PASSWORD`.

## Structure du Projet

```
cabinet-nouha/
├── app/
│   ├── api/
│   │   ├── booking/
│   │   │   ├── availability/route.ts   # GET disponibilités publiques
│   │   │   └── create/route.ts         # POST nouvelle réservation
│   │   └── admin/
│   │       ├── auth/route.ts           # Authentification admin
│   │       ├── slots/route.ts          # CRUD créneaux
│   │       ├── appointments/route.ts   # Liste + mise à jour statut
│   │       └── blocked-dates/route.ts  # CRUD dates bloquées
│   ├── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Dashboard admin
│   ├── layout.tsx                      # Layout racine + SEO + JSON-LD
│   ├── page.tsx                        # Page d'accueil
│   └── globals.css
├── components/
│   ├── ui/                             # Button, Badge, SectionHeading
│   ├── layout/                         # Header, Footer, WhatsApp button
│   ├── sections/                       # Sections marketing (12)
│   ├── booking/                        # Calendrier + formulaire de réservation
│   └── admin/                          # UI du tableau de bord admin
├── hooks/
│   ├── useAvailability.ts              # Disponibilités publiques
│   └── useAdmin.ts                     # Hooks admin (slots, RDV, dates bloquées)
├── lib/
│   ├── supabase.ts                     # Clients Supabase (browser + admin)
│   ├── whatsapp.ts                     # Génération message + URL WhatsApp
│   └── utils.ts                        # Helpers (dates, validation, etc.)
├── types/
│   └── booking.ts                      # Types partagés
└── supabase/
    └── schema.sql                      # Schéma SQL complet + RLS
```
