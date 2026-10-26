"use server";

import { revalidatePath } from "next/cache";
import { requireActiveAccount } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { inviteExpiry, newInviteToken, signupInviteUrl } from "@/lib/invites";

export type CreateInviteResult =
  | { ok: true; inviteId: string; token: string; link: string }
  | { ok: false; error: string };

export async function createInvite(formData: FormData): Promise<CreateInviteResult> {
  const account = await requireActiveAccount();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const firstName = String(formData.get("firstName") ?? "").trim() || null;
  const lastName = String(formData.get("lastName") ?? "").trim() || null;

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Indiquez une adresse email valide." };
  }
  if (account.email && account.email.toLowerCase() === email) {
    return { ok: false, error: "Vous ne pouvez pas vous inviter vous-même." };
  }

  const token = newInviteToken();
  const invite = await prisma.invitation.create({
    data: {
      token,
      inviterId: account.profileId,
      inviteeEmail: email,
      inviteeFirstName: firstName,
      inviteeLastName: lastName,
      channelEmail: false,
      channelWhatsapp: false,
      expiresAt: inviteExpiry(),
    },
  });

  revalidatePath("/invites");
  return {
    ok: true,
    inviteId: invite.id,
    token,
    link: signupInviteUrl(token),
  };
}

export async function revokeInvite(formData: FormData) {
  const account = await requireActiveAccount();
  const id = String(formData.get("inviteId") ?? "");
  if (!id) return;
  await prisma.invitation.updateMany({
    where: { id, inviterId: account.profileId, status: "PENDING" },
    data: { status: "REVOKED" },
  });
  revalidatePath("/invites");
}
