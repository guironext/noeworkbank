-- NOEWork Bank — DRAFT schéma PostgreSQL (Supabase) v1 — 26/10/2026
-- Ne contient aucune valeur métier non tranchée : voir "TODO métier".
create extension if not exists pgcrypto;

create table profiles (
  id uuid primary key references auth.users(id),
  phone text unique not null,
  full_name text,
  is_suspended boolean not null default false,  -- suspension sans suppression
  created_at timestamptz not null default now()
);
create table roles (id serial primary key, code text unique not null); -- VISITOR, LEARNER, AMBASSADOR, TRAINER, CITY_MANAGER, FINANCE, ADMIN, SUPER_ADMIN
create table cities (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,                    -- TODO métier : liste des 20 villes (décision 1)
  is_active boolean not null default true
);
create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  role_id int not null references roles(id),
  city_id uuid references cities(id),           -- portée ville (responsable de ville) ; nullable
  is_active boolean not null default true
);
-- city_id nullable : UNIQUE (user_id, role_id, coalesce(city_id, '00000000-0000-0000-0000-000000000000'))
create unique index user_roles_user_role_city_uidx
  on user_roles (user_id, role_id, (coalesce(city_id, '00000000-0000-0000-0000-000000000000'::uuid)));

create table programs (id uuid primary key default gen_random_uuid(), code text unique not null, title text not null); -- FIN-001, IA-001, FON-001, IMO-001
  -- TODO métier : durée pédagogique (décision 3)
create table training_modules (id uuid primary key default gen_random_uuid(), program_id uuid not null references programs(id), position int not null, title text not null, is_final_project boolean default false);
create table chapters (id uuid primary key default gen_random_uuid(), module_id uuid not null references training_modules(id), position int not null, title text not null);
create table lessons (id uuid primary key default gen_random_uuid(), chapter_id uuid not null references chapters(id), position int not null, title text not null);
create table learning_resources (id uuid primary key default gen_random_uuid(), lesson_id uuid not null references lessons(id), kind text not null, storage_path text);

create table packs (id uuid primary key default gen_random_uuid(), code text unique not null); -- ECO, CLASSIQUE, PREMIUM
create table pack_versions (                     -- RG-005/006/007 : immuable
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references packs(id),
  version int not null,
  price_xof integer not null check (price_xof >= 0),
  -- TODO métier : droits d'accès aux piliers par formule (décision 2)
  valid_from timestamptz not null default now(),
  unique (pack_id, version)
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id),
  city_id uuid not null references cities(id),
  starts_on date, ends_on date,
  capacity int not null check (capacity > 0)
);
create table session_trainers (session_id uuid references sessions(id), trainer_id uuid references profiles(id), primary key (session_id, trainer_id));

create type enrollment_status as enum ('DRAFT','PENDING','PAID','CANCELLED','REFUNDED');
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  session_id uuid not null references sessions(id),
  pack_version_id uuid not null references pack_versions(id),
  status enrollment_status not null default 'DRAFT',
  hold_expires_at timestamptz,                   -- TODO métier : durée du hold
  amount_due_xof integer not null,               -- snapshot du prix
  created_at timestamptz not null default now()
  -- TODO métier : multi-programmes (4), transferts (10)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments(id),
  transaction_id text unique not null,           -- idempotence RG-009..014
  amount_xof integer not null,
  status text not null,                          -- PENDING/ACCEPTED/REFUSED (côté serveur)
  verified_at timestamptz,
  created_at timestamptz not null default now()
  -- TODO métier : paiements partiels (décision 8)
);
create table payment_events (id bigserial primary key, payment_id uuid references payments(id), transaction_id text not null, payload jsonb not null, received_at timestamptz not null default now());
create table receipts (id uuid primary key default gen_random_uuid(), payment_id uuid unique not null references payments(id), number text unique not null, pdf_path text, issued_at timestamptz not null default now());
create table refunds (id uuid primary key default gen_random_uuid(), payment_id uuid not null references payments(id), amount_xof integer not null, created_at timestamptz default now()); -- TODO métier : règles (décision 7)

create table ambassadors (id uuid primary key default gen_random_uuid(), user_id uuid unique not null references profiles(id), code text unique not null, is_active boolean default true);
create table referrals (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid unique not null references enrollments(id),  -- 1 referral max
  ambassador_id uuid not null references ambassadors(id)
  -- auto-parrainage interdit : contrôle serveur / trigger (ambassador.user_id <> enrollment.user_id)
);
create table commission_payouts (id uuid primary key default gen_random_uuid(), ambassador_id uuid not null references ambassadors(id), amount_xof integer not null, paid_at timestamptz);
create table commissions (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references referrals(id),
  enrollment_id uuid not null references enrollments(id),
  ambassador_id uuid not null references ambassadors(id),
  amount_xof integer not null,                   -- TODO métier : taux/conditions (décision 6)
  status text not null default 'PENDING',        -- PENDING/APPROVED/PAID/CANCELLED
  payout_id uuid references commission_payouts(id)
);
create unique index one_active_commission on commissions(enrollment_id) where status <> 'CANCELLED';

create table attendance (session_id uuid references sessions(id), user_id uuid references profiles(id), day date, present boolean, primary key (session_id, user_id, day));
create table lesson_progress (user_id uuid references profiles(id), lesson_id uuid references lessons(id), completed_at timestamptz, primary key (user_id, lesson_id));
create table assessments (id uuid primary key default gen_random_uuid(), module_id uuid references training_modules(id), title text);
create table assessment_results (assessment_id uuid references assessments(id), user_id uuid references profiles(id), score numeric, primary key (assessment_id, user_id));
create table follow_up_actions (id uuid primary key default gen_random_uuid(), enrollment_id uuid references enrollments(id), description text, due_on date); -- TODO métier : début du suivi (5)
create table expenses (id uuid primary key default gen_random_uuid(), city_id uuid references cities(id), program_id uuid references programs(id), amount_xof integer not null, label text, spent_on date);
create table notifications (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id), channel text, body text, sent_at timestamptz);
create table appr_work_items (id uuid primary key default gen_random_uuid(), title text not null, target numeric, owner_id uuid references profiles(id));
create table audit_logs (id bigserial primary key, actor_id uuid references profiles(id), action text not null, entity text, entity_id text, data jsonb, at timestamptz default now());

-- RLS (notes) :
-- alter table ... enable row level security sur toutes les tables.
-- Apprenant : select ses profiles/enrollments/payments/receipts/lesson_progress.
-- Ambassadeur : select referrals/commissions où ambassador.user_id = auth.uid().
-- Aucune policy insert/update client sur payments, payment_events, receipts, commissions, commission_payouts,
--   enrollments.status : écritures via service_role (API) uniquement.
-- Responsable de ville : filtrage par user_roles.city_id.
