"use server";

import { cookies } from "next/headers";
import { getCurrentAccount } from "@/lib/profile";
import { acceptInviteIfValid } from "@/lib/invites";
import { prisma } from "@/lib/prisma";

/** Crée le Profile PENDING juste après l'inscription (idempotent) + accepte l'invitation. */
export async function syncProfileAfterSignUp(inviteToken?: string) {
  const account = await getCurrentAccount();
  if (!account) return;

  const jar = await cookies();
  const fromCookie = jar.get("noe_invite")?.value;
  const token = (inviteToken || fromCookie || "").trim() || null;

  await acceptInviteIfValid(token, account.profileId, account.email);

  // Prefill noms depuis l'invitation si le profil est vide
  if (token) {
    const invite = await prisma.invitation.findUnique({ where: { token } });
    if (invite) {
      await prisma.profile.update({
        where: { id: account.profileId },
        data: {
          ...(invite.inviteeFirstName && !account.firstName
            ? { firstName: invite.inviteeFirstName }
            : {}),
          ...(invite.inviteeLastName && !account.lastName
            ? { lastName: invite.inviteeLastName }
            : {}),
        },
      });
    }
    jar.delete("noe_invite");
  }
}
