import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignUpForm } from "../SignUpForm";
import { prisma } from "@/lib/prisma";

type Props = { searchParams: Promise<{ invite?: string; email?: string }> };

export default async function SignUpPage({ searchParams }: Props) {
  const sp = await searchParams;
  const token = sp.invite?.trim();

  // Si invitation valide : préremplir l'email dans l'URL (le formulaire lit ?email=)
  if (token && !sp.email) {
    try {
      const invite = await prisma.invitation.findUnique({ where: { token } });
      if (
        invite &&
        invite.status === "PENDING" &&
        invite.expiresAt.getTime() > Date.now()
      ) {
        const q = new URLSearchParams({ invite: token, email: invite.inviteeEmail });
        redirect(`/sign-up?${q.toString()}`);
      }
    } catch {
      // DB indisponible : laisser le formulaire sans préremplissage
    }
  }

  return (
    <div className="flex justify-center px-4 py-16">
      <Suspense fallback={<p className="text-sm text-zinc-500">Chargement…</p>}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
