import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireActiveAccount } from "@/lib/profile";
import { signupInviteUrl } from "@/lib/app-url";
import { InviteForm } from "./InviteForm";
import { CopyLinkButton } from "./CopyLinkButton";
import { revokeInvite } from "./actions";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  REVOKED: "Révoquée",
  EXPIRED: "Expirée",
};

export default async function InvitesPage() {
  await connection();
  const account = await requireActiveAccount();
  const invites = await prisma.invitation.findMany({
    where: { inviterId: account.profileId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-noe-navy">Inviter quelqu’un</h1>
        <p className="mt-1 text-sm text-noe-muted">
          Générez un lien, copiez-le et envoyez-le à la personne cible. Elle arrive sur la page
          d’inscription.
        </p>
      </div>

      <InviteForm />

      <section className="rounded-2xl border border-noe-line bg-white shadow-sm">
        <div className="border-b border-noe-line px-6 py-4">
          <h2 className="font-semibold text-noe-navy">Mes invitations</h2>
        </div>
        {invites.length === 0 ? (
          <p className="p-6 text-sm text-noe-muted">Aucune invitation pour le moment.</p>
        ) : (
          <ul className="divide-y divide-noe-line">
            {invites.map((inv) => {
              const expired = inv.status === "PENDING" && inv.expiresAt.getTime() < Date.now();
              const status = expired ? "EXPIRED" : inv.status;
              const link = signupInviteUrl(inv.token);
              return (
                <li
                  key={inv.id}
                  className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-noe-navy">{inv.inviteeEmail}</p>
                    <p className="text-xs text-noe-muted">
                      {inv.createdAt.toLocaleDateString("fr-FR")} · {STATUS_LABEL[status] ?? status}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {status === "PENDING" && (
                      <>
                        <CopyLinkButton link={link} />
                        <form action={revokeInvite}>
                          <input type="hidden" name="inviteId" value={inv.id} />
                          <button
                            type="submit"
                            className="rounded-full px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            Révoquer
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
