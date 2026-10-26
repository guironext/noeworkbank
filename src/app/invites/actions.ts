"use server";

import { revalidatePath } from "next/cache";
import { requireActiveAccount } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import {
  inviteExpiry,
  inviteMessage,
  mailtoInviteUrl,
  newInviteToken,
  sendInviteEmail,
  signupInviteUrl,
  whatsappShareUrl,
} from "@/lib/invites";

export type CreateInviteResult =
  | {
      ok: true;
      inviteId: string;
      token: string;
      link: string;
      mailtoUrl: string | null;
      whatsappUrl: string | null;
      emailSent: boolean;
      emailNote?: string;
    }
  | { ok: false; error: string };

export async function createInvite(formData: FormData): Promise<CreateInviteResult> {
  const account = await requireActiveAccount();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const firstName = String(formData.get("firstName") ?? "").trim() || null;
  const lastName = String(formData.get("lastName") ?? "").trim() || null;
  const viaEmail = formData.get("viaEmail") === "on" || formData.get("viaEmail") === "true";
  const viaWhatsapp = formData.get("viaWhatsapp") === "on" || formData.get("viaWhatsapp") === "true";

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Indiquez une adresse email valide." };
  }
  if (!viaEmail && !viaWhatsapp) {
    return { ok: false, error: "Choisissez Email et/ou WhatsApp." };
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
      channelEmail: viaEmail,
      channelWhatsapp: viaWhatsapp,
      expiresAt: inviteExpiry(),
    },
  });

  const link = signupInviteUrl(token);
  const inviterName =
    `${account.firstName} ${account.lastName}`.trim() || account.email || "Un membre NOEWork Bank";
  const message = inviteMessage(inviterName, link);

  let emailSent = false;
  let emailNote: string | undefined;
  let mailtoUrl: string | null = null;

  if (viaEmail) {
    const res = await sendInviteEmail({ to: email, inviterName, link });
    emailSent = res.sent;
    if (!res.sent) {
      mailtoUrl = mailtoInviteUrl(email, inviterName, link);
      emailNote = res.error?.includes("RESEND_API_KEY")
        ? "Aucun service email configuré : utilisez « Ouvrir l’email » (mailto)."
        : `Envoi email échoué (${res.error}). Utilisez « Ouvrir l’email ».`;
    }
  }

  const whatsappUrl = viaWhatsapp ? whatsappShareUrl(message) : null;

  revalidatePath("/invites");
  return {
    ok: true,
    inviteId: invite.id,
    token,
    link,
    mailtoUrl,
    whatsappUrl,
    emailSent,
    emailNote,
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
