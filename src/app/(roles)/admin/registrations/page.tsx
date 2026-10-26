import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { RoleForm } from "../RoleForm";

export default async function InscriptionsPage() {
  await connection();
  const pending = await prisma.profile.findMany({
    where: { accountStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
  });
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <h1 className="text-2xl font-semibold text-noe-navy">Inscriptions en attente</h1>
      {pending.length === 0 ? (
        <p className="rounded-2xl border border-noe-line bg-white p-6 text-sm text-noe-muted">Aucune inscription en attente.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-noe-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase text-noe-muted">
              <tr><th className="p-3">Nom</th><th className="p-3">Prénoms</th><th className="p-3">Email</th><th className="p-3">Inscrit le</th><th className="p-3">Action</th></tr>
            </thead>
            <tbody>
              {pending.map((p: (typeof pending)[number]) => (
                <tr key={p.id} className="border-t border-noe-line align-middle">
                  <td className="p-3 font-medium">{p.lastName}</td>
                  <td className="p-3">{p.firstName}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.createdAt.toLocaleDateString("fr-FR")}</td>
                  <td className="p-3"><RoleForm profileId={p.id} submitLabel="Valider" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
