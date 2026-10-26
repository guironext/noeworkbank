# NOEWork Bank — Extraire du CDC v2.0 (26 oct 2026)

## Stack recommandée
- Mobile: Flutter (Android/iOS)
- Portail web + admin: Next.js / React
- API: Node.js / TypeScript, /api/v1
- DB: PostgreSQL (+ Supabase Auth, Supabase Storage)
- Paiement: CinetPay (OM, MTN, Moov, Wave, CB)
- Docker, OpenAPI/Swagger, Git

## Interfaces
1. App mobile — apprenants (inscription, paiement, formations)
2. Portail web — apprenants + ambassadeurs
3. Admin — formations, villes, finance, users
4. Pilotage APPRIVOR — direction

Règle: opérations financières, validation paiement, commissions = côté serveur uniquement. DB commune.

## Rôles (multi-rôles via user_roles)
Visiteur, Apprenant, Ambassadeur, Formateur, Responsable de ville, Responsable financier, Administrateur, Super-administrateur. Suspension sans suppression historique.

## Modules MVP
MOD-001 Auth/comptes (téléphone + OTP)
MOD-002 Catalogue (Programme > Module > Chapitre > Leçon + ressources)
MOD-003 Packs ÉCO 20k / CLASSIQUE 50k / PREMIUM 100k (XOF) — pack_versions pour snapshot prix
MOD-004 Villes (20) + sessions (capacité, réservation temporaire)
MOD-005 Inscriptions: DRAFT, PENDING, PAID, CANCELLED, REFUNDED
MOD-006 Paiements CinetPay (idempotent, verify serveur)
MOD-007 Reçus PDF
MOD-008 Espace apprenant
MOD-010 Ambassadeurs + codes
MOD-011 Commissions
MOD-012 Finance initiale
Admin générale

Post-MVP: APPRIVOR avancé, quiz, certifs, suivi entrepreneurial avancé, notifs multicanal, prédictif

## Programmes
FIN-001, IA-001, FON-001, IMO-001 — chacun 8 modules + TP final

## Tables CDC
profiles, roles, user_roles, cities, programs, training_modules, chapters, lessons, learning_resources, packs, pack_versions, sessions, session_trainers, enrollments, payments, payment_events, receipts, ambassadors, referrals, commissions, commission_payouts, attendance, lesson_progress, assessments, assessment_results, follow_up_actions, expenses, refunds, notifications, appr_work_items, audit_logs

## Décisions ouvertes (ne pas inventer)
1. Liste 20 villes 2. Accès piliers/formule 3. Durées 4. Multi-programmes 5. Date début suivi 6. Taux commissions 7. Remboursements 8. Paiements partiels 9. Attestations 10. Transferts sessions 11. Contenus MVP 12. Contrat CinetPay
