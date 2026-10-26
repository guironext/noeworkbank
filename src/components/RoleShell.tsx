import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import type { ReactNode } from "react";
import { ROLE_LABELS, ROLE_NAV, type RoleCode } from "@/lib/roles";
import { NavLinks } from "@/components/NavLinks";

export function RoleShell({
  role,
  userName,
  children,
}: {
  role: RoleCode;
  userName: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-81px)] flex-col md:flex-row">
      <aside className="border-b border-white/10 bg-noe-navy text-white md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 px-4 py-4">
          <Image
            src="/logo-noe-work-bank.jpeg"
            alt="NOE Work Bank"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full bg-white"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-noe-gold">{ROLE_LABELS[role]}</p>
          </div>
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
        <NavLinks items={ROLE_NAV[role]} />
      </aside>
      <section className="flex-1 bg-zinc-50 px-4 py-8 sm:px-8">{children}</section>
    </div>
  );
}

export function ShellFallback() {
  return <div className="p-8 text-sm text-zinc-500">Chargement…</div>;
}

export function RoleDashboard({
  title,
  intro,
  cards,
}: {
  title: string;
  intro: string;
  cards: { title: string; value: string; hint: string }[];
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-noe-navy">{title}</h1>
        <p className="mt-1 text-sm text-noe-muted">{intro}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl border border-noe-line bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-noe-muted">{c.title}</p>
            <p className="mt-2 text-3xl font-semibold text-noe-navy">{c.value}</p>
            <p className="mt-1 text-xs text-noe-muted">{c.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-noe-line bg-white p-10 text-center">
      <h1 className="text-xl font-semibold text-noe-navy">{title}</h1>
      {description && <p className="mt-2 text-sm text-noe-muted">{description}</p>}
      <p className="mt-4 inline-block rounded-full bg-noe-gold-soft px-3 py-1 text-xs font-medium text-noe-navy">
        Bientôt disponible
      </p>
    </div>
  );
}
