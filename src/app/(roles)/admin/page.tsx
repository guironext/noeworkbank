import { connection } from "next/server";
import Link from "next/link";
import { RoleDashboard } from "@/components/RoleShell";
import { prisma } from "@/lib/prisma";

export default async function AdminHome() {
  await connection();
  const [pending, active] = await Promise.all([
    prisma.profile.count({ where: { accountStatus: "PENDING" } }),
    prisma.profile.count({ where: { accountStatus: "ACTIVE" } }),
  ]);
  return (
    <div className="space-y-6">
      <RoleDashboard
        title="Espace Administrateur"
        intro="Pilotage de la plateforme : inscriptions, utilisateurs et paramètres."
        cards={[
          { title: "Inscriptions en attente", value: String(pending), hint: "À valider dans Inscriptions" },
          { title: "Utilisateurs actifs", value: String(active), hint: "Tous rôles confondus" },
          { title: "Paiements du mois", value: "—", hint: "Module paiements à venir" },
        ]}
      />
      {pending > 0 && (
        <div className="mx-auto max-w-5xl">
          <Link href="/admin/registrations" className="inline-block rounded-full bg-noe-gold px-4 py-2 text-sm font-medium text-noe-navy-deep">
            Traiter {pending} inscription{pending > 1 ? "s" : ""} →
          </Link>
        </div>
      )}
    </div>
  );
}
