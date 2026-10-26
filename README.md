# NOEWork Bank

Plateforme de formation NOE POLYTECHNIQUE (NOE ADN BIG 4).

## Stack

| Couche | Techno |
|--------|--------|
| App | Next.js (App Router) |
| Auth | Clerk |
| Base | Neon (PostgreSQL) |
| ORM | Prisma |

## Démarrage

1. Copier `.env.example` vers `.env` et renseigner Neon + Clerk.
2. `npm install`
3. `npx prisma migrate dev --name init` (nécessite `DATABASE_URL` + `DATABASE_URL_UNPOOLED`)
4. `npm run dev`

## Structure utile

- `prisma/schema.prisma` — modèle de données métier
- `src/lib/prisma.ts` — client Prisma
- `src/middleware.ts` — protection Clerk
- `docs/` — architecture et résumé CDC

## Suite

Brancher les modules inscriptions, CinetPay, ambassadeurs et admin selon le cahier des charges.

## Inscription, validation admin et espaces par rôle

1. **Base Neon** : renseigner `DATABASE_URL` / `DATABASE_URL_UNPOOLED` dans `.env`, puis
   `npx prisma db push --config prisma7.config.ts` et `npm run db:seed` (crée les rôles ADMIN, APPRENANT, ENSEIGNANT, COMPTABLE, MANAGER).
2. **Premier admin** : mettre `BOOTSTRAP_ADMIN_EMAIL=ton@email` dans `.env.local`, redémarrer `npm run dev`, s'inscrire (ou se connecter) avec cet email → le compte est automatiquement ACTIVE + ADMIN. (Si le profil existe déjà : `npm run db:seed`.)
3. **Flux** : `/sign-up` (nom, prénoms, email, mot de passe + code email) → `/onboarding` (en attente) → l'admin valide dans `/admin/inscriptions` et choisit un rôle → l'utilisateur arrive sur `/admin`, `/apprenant`, `/enseignant`, `/comptable` ou `/manager`.
4. **Webhook (optionnel)** : Clerk → Webhooks → `https://<domaine>/api/webhooks/clerk` (user.created, user.updated) avec `CLERK_WEBHOOK_SIGNING_SECRET`. Sans webhook, le profil est créé au premier passage (synchro idempotente).
