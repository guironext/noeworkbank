import "server-only";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { signupInviteUrl } from "@/lib/app-url";

export const INVITE_TTL_DAYS = 14;

export function newInviteToken(): string {
  return randomBytes(24).toString("base64url");
}

export function inviteExpiry(from = new Date()): Date {
  return new Date(from.getTime() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export function whatsappShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function inviteMessage(inviterName: string, link: string): string {
  return (
    `Bonjour ! ${inviterName} vous invite à rejoindre NOEWork Bank, ` +
    `la plateforme de formation et d'accompagnement entrepreneurial.\n\n` +
    `Créez votre compte ici : ${link}\n\n` +
    `Ce lien est valable ${INVITE_TTL_DAYS} jours.`
  );
}

export function mailtoInviteUrl(to: string, inviterName: string, link: string): string {
  const subject = encodeURIComponent("Invitation — NOEWork Bank");
  const body = encodeURIComponent(inviteMessage(inviterName, link));
  return `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
}

/** Envoi email via Resend si RESEND_API_KEY est défini. */
export async function sendInviteEmail(opts: {
  to: string;
  inviterName: string;
  link: string;
}): Promise<{ sent: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "NOEWork Bank <onboarding@resend.dev>";
  if (!key) return { sent: false, error: "RESEND_API_KEY manquant" };

  const html = `
    <p>Bonjour,</p>
    <p><strong>${escapeHtml(opts.inviterName)}</strong> vous invite à rejoindre
    <strong>NOEWork Bank</strong>.</p>
    <p><a href="${opts.link}">Créer mon compte</a></p>
    <p style="color:#666;font-size:13px">Lien valable ${INVITE_TTL_DAYS} jours.<br/>
    ${escapeHtml(opts.link)}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: "Invitation — NOEWork Bank",
        html,
        text: inviteMessage(opts.inviterName, opts.link),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { sent: false, error: body.slice(0, 200) };
    }
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "envoi impossible" };
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function acceptInviteIfValid(token: string | null | undefined, profileId: string, email: string | null) {
  if (!token) return;
  const invite = await prisma.invitation.findUnique({ where: { token } });
  if (!invite || invite.status !== "PENDING") return;
  if (invite.expiresAt.getTime() < Date.now()) {
    await prisma.invitation.update({ where: { id: invite.id }, data: { status: "EXPIRED" } });
    return;
  }
  if (email && invite.inviteeEmail.toLowerCase() !== email.toLowerCase()) {
    // email différent : on accepte quand même le parrainage mais on garde une trace
  }
  await prisma.$transaction(async (tx) => {
    await tx.invitation.update({
      where: { id: invite.id },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
        acceptedProfileId: profileId,
      },
    });
    await tx.profile.update({
      where: { id: profileId },
      data: { invitedById: invite.inviterId },
    });
  });
}

export { signupInviteUrl };
