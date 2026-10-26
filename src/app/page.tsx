import Image from "next/image";
import Link from "next/link";

const programmes = [
  {
    code: "FIN-001",
    title: "Intelligence financière",
    blurb: "Budget, cash-flow, investissement et discipline patrimoniale.",
    accent: "from-amber-400/20 to-transparent",
    icon: "₣",
  },
  {
    code: "IA-001",
    title: "Intelligence artificielle",
    blurb: "Outils IA utiles au business : productivité, contenu, décision.",
    accent: "from-sky-400/20 to-transparent",
    icon: "◆",
  },
  {
    code: "FON-001",
    title: "Intelligence foncière",
    blurb: "Sécuriser le foncier, lire les dossiers, éviter les pièges.",
    accent: "from-emerald-400/20 to-transparent",
    icon: "▣",
  },
  {
    code: "IMO-001",
    title: "Intelligence immobilière",
    blurb: "Montage, valorisation et stratégie d’actifs immobiliers.",
    accent: "from-violet-400/20 to-transparent",
    icon: "⌂",
  },
];

const packs = [
  {
    name: "ÉCO",
    price: "20 000",
    tag: "Entrée",
    points: ["Accès catalogue", "1 session ville", "Suivi de base"],
    featured: false,
  },
  {
    name: "CLASSIQUE",
    price: "50 000",
    tag: "Populaire",
    points: ["Programmes BIG 4", "Sessions prioritaires", "Espace apprenant"],
    featured: true,
  },
  {
    name: "PREMIUM",
    price: "100 000",
    tag: "Complet",
    points: ["Tout CLASSIQUE", "Accompagnement renforcé", "Priorité ambassadeur"],
    featured: false,
  },
];

const steps = [
  {
    n: "01",
    title: "Choisis ton pack",
    text: "ÉCO, CLASSIQUE ou PREMIUM — prix figés en XOF via pack_versions.",
  },
  {
    n: "02",
    title: "Réserve ta session",
    text: "20 villes, capacité limitée, réservation temporaire sécurisée.",
  },
  {
    n: "03",
    title: "Apprends & avance",
    text: "Modules, TP, suivi entrepreneurial — paiement CinetPay sécurisé.",
  },
];

const partners = [
  { src: "/part5.jpeg", alt: "NOE Polytechnique Université d’ingénierie" },
  { src: "/part3.jpeg", alt: "NOE Polytechnique Ambassadeur" },
  { src: "/part2.jpeg", alt: "Université Ephrata" },
  { src: "/part1.jpeg", alt: "Kpandji" },
  { src: "/part4.jpeg", alt: "Partenaire réseau" },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative isolate overflow-hidden bg-noe-navy text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 70% -10%, #3d8fd4 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, #c9a22755 0%, transparent 50%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-noe-gold-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-noe-gold" />
              Côte d’Ivoire · Formation entrepreneuriale
            </p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              La banque de compétences pour{" "}
              <span className="text-noe-gold">bâtir ton empire</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              NOEWork Bank — plateforme NOE POLYTECHNIQUE / NOE ADN BIG 4.
              Quatre intelligences, packs clairs en XOF, sessions dans 20
              villes, paiement mobile money et carte.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="rounded-full bg-noe-gold px-6 py-3 text-sm font-semibold text-noe-navy-deep shadow-lg shadow-noe-gold/20 transition hover:brightness-110"
              >
                Créer mon compte
              </Link>
              <Link
                href="/#packs"
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                Voir les packs
              </Link>
            </div>
            <dl className="grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center sm:text-left">
              {[
                ["4", "Programmes BIG 4"],
                ["20", "Villes"],
                ["3", "Packs XOF"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-semibold text-noe-gold">{value}</dt>
                  <dd className="mt-0.5 text-xs text-white/60">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2rem] bg-noe-sky/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur">
              <Image
                src="/logo-noe-work-bank.jpeg"
                alt="Logo NOE Work Bank"
                width={420}
                height={420}
                className="mx-auto h-72 w-72 rounded-full bg-white p-3 shadow-xl sm:h-96 sm:w-96"
                priority
              />
              <p className="mt-5 text-center text-sm font-medium text-white/90">
                Industrie · Digital · Afrique
              </p>
              <p className="mt-1 text-center text-xs text-white/55">
                Engrenage, circuits & carte — identité officielle
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="programmes" className="mx-auto max-w-6xl px-4 py-16 text-noe-navy sm:px-6 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-noe-blue">
            NOE ADN BIG 4
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-noe-navy">
            Quatre intelligences, un parcours
          </h2>
          <p className="mt-3 text-noe-muted">
            Chaque programme : 8 modules + TP final — du savoir utile au terrain
            entrepreneurial ivoirien.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {programmes.map((p) => (
            <li
              key={p.code}
              className="group relative overflow-hidden rounded-2xl border border-noe-line bg-noe-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${p.accent}`}
              />
              <div className="relative flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-noe-navy text-lg text-noe-gold">
                  {p.icon}
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-noe-muted">
                    {p.code}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-noe-navy">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-noe-muted">
                    {p.blurb}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="packs" className="border-y border-noe-line bg-white py-16 text-noe-navy sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-noe-gold">
              Tarifs MVP
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-noe-navy">
              Packs transparents en XOF
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-noe-muted">
              Paiement CinetPay (Orange, MTN, Moov, Wave, carte). Le prix est
              figé à l’inscription.
            </p>
          </div>
          <ul className="grid gap-5 lg:grid-cols-3">
            {packs.map((pack) => (
              <li
                key={pack.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  pack.featured
                    ? "border-noe-navy bg-noe-navy text-white shadow-xl shadow-noe-navy/25 lg:-translate-y-2"
                    : "border-noe-line bg-noe-card text-noe-navy"
                }`}
              >
                {pack.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-noe-gold px-3 py-0.5 text-xs font-semibold text-noe-navy-deep">
                    {pack.tag}
                  </span>
                )}
                {!pack.featured && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-noe-muted">
                    {pack.tag}
                  </span>
                )}
                <h3 className="mt-2 text-xl font-semibold">{pack.name}</h3>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {pack.price}
                  </span>
                  <span
                    className={`text-sm ${pack.featured ? "text-white/70" : "text-noe-muted"}`}
                  >
                    F CFA
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {pack.points.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <span
                        className={
                          pack.featured ? "text-noe-gold" : "text-noe-blue"
                        }
                      >
                        ✓
                      </span>
                      <span
                        className={
                          pack.featured ? "text-white/85" : "text-noe-muted"
                        }
                      >
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`mt-8 block rounded-full py-2.5 text-center text-sm font-semibold transition ${
                    pack.featured
                      ? "bg-noe-gold text-noe-navy-deep hover:brightness-110"
                      : "bg-noe-navy text-white hover:bg-noe-navy-deep"
                  }`}
                >
                  Commencer
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-noe-navy sm:px-6 sm:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-noe-navy">
          Comment ça marche
        </h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-noe-line bg-noe-card p-6"
            >
              <span className="font-mono text-sm font-semibold text-noe-gold">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-noe-navy">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-noe-muted">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-noe-line bg-white py-14 text-noe-navy">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-noe-muted">
            Écosystème NOE
          </p>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            {partners.map((p) => (
              <li key={p.src} className="opacity-90 transition hover:opacity-100">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={128}
                  height={128}
                  className="h-28 w-28 rounded-full object-contain bg-white p-2 shadow-sm ring-1 ring-noe-line sm:h-32 sm:w-32"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-noe-navy-deep py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Prêt à rejoindre NOEWork Bank ?
            </h2>
            <p className="mt-2 max-w-lg text-white/70">
              Crée ton compte, choisis ton pack, réserve ta session — on
              s’occupe du reste.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="shrink-0 rounded-full bg-noe-gold px-7 py-3.5 text-sm font-semibold text-noe-navy-deep transition hover:brightness-110"
          >
            Inscription gratuite
          </Link>
        </div>
      </section>

      <footer className="border-t border-noe-line bg-noe-card py-8 text-noe-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-sm text-noe-muted sm:flex-row sm:px-6 sm:text-left">
          <p>© 2026 NOEWork Bank · NOE POLYTECHNIQUE</p>
          <p>Formation & accompagnement entrepreneurial — Côte d’Ivoire</p>
        </div>
      </footer>
    </div>
  );
}
