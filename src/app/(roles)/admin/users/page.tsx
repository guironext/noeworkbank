import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS, isRoleCode } from "@/lib/roles";
import { RoleForm } from "../RoleForm";

const STATUS: Record<string, string> = { PENDING: "En attente", ACTIVE: "Actif", SUSPENDED: "Suspendu" };

export default async function UtilisateursPage() {
  await connection();
  const users = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    include: { roles: { where: { isActive: true }, include: { role: true } } },
  });
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <h1 className="text-2xl font-semibold text-noe-navy">Utilisateurs</h1>
      <div className="overflow-hidden rounded-2xl border border-noe-line bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-noe-muted">
            <tr><th className="p-3">Nom complet</th><th className="p-3">Email</th><th className="p-3">Statut</th><th className="p-3">Rôle</th><th className="p-3">Modifier</th></tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const code = u.roles[0]?.role.code;
              return (
                <tr key={u.id} className="border-t border-noe-line">
                  <td className="p-3 font-medium">{u.lastName} {u.firstName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{STATUS[u.accountStatus]}</td>
                  <td className="p-3">{isRoleCode(code) ? ROLE_LABELS[code] : "—"}</td>
                  <td className="p-3"><RoleForm profileId={u.id} current={code} submitLabel="Activer / changer" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
