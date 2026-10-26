# Architecture & modèle de données — NOEWork Bank (v1)

Source : CDC v2.0 du 26 octobre 2026. Document à itérer.

> **Stack proposée (recommandation CDC, à valider)** : Flutter (mobile) · Next.js/React (portail + admin) · API Node.js/TypeScript `/api/v1` + OpenAPI · PostgreSQL via Supabase (Auth, Storage) · CinetPay (OM, MTN, Moov, Wave, carte) · Docker, Git.

## 1. Architecture cible
```
App mobile (Flutter) ─┐
Portail web ──────────┤
Administration ───────┼──> API métier /api/v1 ──> PostgreSQL (Supabase)
Pilotage APPRIVOR ────┘          ^
                       CinetPay ─┘ (webhook + vérification)
```
Finance, validation des paiements et commissions : **serveur uniquement**. RLS interdit aux clients d'écrire dans payments, commissions, enrollments.status.

## 2. Monorepo
```
noework-bank/
├─ apps/mobile/         Flutter
├─ apps/admin-web/      Next.js (portail + admin + APPRIVOR)
├─ backend/src/modules/ auth, catalog, packs, cities-sessions, enrollments, payments,
│                       ambassadors, learning, finance, notifications, apprivor
├─ backend/openapi/
├─ database/{migrations,policies,seeds}/
└─ docs/
```

## 3. Domaines métier
| Domaine | Tables |
|---|---|
| Auth/Users | profiles, roles, user_roles |
| Catalogue | programs, training_modules, chapters, lessons, learning_resources |
| Packs | packs, pack_versions |
| Villes/Sessions | cities, sessions, session_trainers |
| Inscriptions | enrollments |
| Paiements | payments, payment_events, receipts |
| Ambassadeurs/Commissions | ambassadors, referrals, commissions, commission_payouts |
| Apprentissage | lesson_progress, attendance, assessments, assessment_results, follow_up_actions |
| Finance | expenses, refunds |
| Notifications | notifications |
| APPRIVOR | appr_work_items |
| Transverse | audit_logs |

## 4. Relations fondamentales
- profiles 1–n enrollments → sessions (→ cities, programs), → pack_versions → packs
- enrollments 1–n payments; payments 1–1 receipts
- enrollments 0–1 referrals → ambassadors; referrals → commissions
- programs → training_modules → chapters → lessons → lesson_progress (← profiles)

## 5. Règles de conception critiques
- **Multi-rôles** : user_roles (city_id nullable). Suspension sans suppression d'historique.
- **pack_versions (RG-005/006/007)** : toute modif prix/droits = nouvelle version immuable ; l'inscription référence la version.
- **Idempotence paiements (RG-009–014)** : transaction_id unique, journal payment_events, confirmation après vérification serveur, PAID + reçu dans une même transaction SQL.
- **Capacité + hold** : hold_expires_at, contrôle sous verrou, libération à expiration (durée à valider).
- **Une commission active par inscription** : index unique partiel.
- **Pas d'auto-parrainage** : contrôle serveur ; une referral max par inscription.
- **audit_logs** sur toute action sensible.

## 6. Décisions ouvertes (statut au 26/10/2026 : toutes à valider)
- [ ] Liste définitive des 20 villes
- [ ] Accès aux quatre piliers selon chaque formule
- [ ] Durée pédagogique de chaque formation
- [ ] Souscription à plusieurs programmes
- [ ] Date officielle de début du suivi
- [ ] Taux et conditions des commissions
- [ ] Règles de remboursement
- [ ] Paiements partiels
- [ ] Conditions des attestations
- [ ] Transferts entre sessions
- [ ] Contenus du MVP
- [ ] Contrat CinetPay

## 7. MVP vs suite
**MVP** : MOD-001 Auth, 002 Catalogue, 003 Packs (ÉCO 20 000 / CLASSIQUE 50 000 / PREMIUM 100 000 XOF), 004 Villes/sessions, 005 Inscriptions, 006 Paiements, 007 Reçus PDF, 008 Espace apprenant, 010 Ambassadeurs, 011 Commissions, 012 Finance initiale, Admin.
**Plus tard** : APPRIVOR avancé, quiz, certificats, suivi entrepreneurial avancé, notifications multicanal, prédictif.
