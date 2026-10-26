import { SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { safeGetCurrentAccount, homeFor } from "@/lib/profile";

export default function OnboardingPage() {
  return (
    <div className="flex justify-center px-4 py-16">
      <Suspense fallback={<p className="text-sm text-zinc-500">Chargement…</p>}>
        <Onboarding />
      </Suspense>
    </div>
  );
}

async function Onboarding() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const { account, dbError } = await safeGetCurrentAccount();
  if (dbError) return <DbUnavailable />;
  if (!account) redirect("/sign-in");
  if (account.status === "ACTIVE" && account.role) redirect(homeFor(account));

  const suspended = account.status === "SUSPENDED";
  return (
    <div className="w-full max-w-lg rounded-3xl border border-noe-line bg-white p-8 text-center shadow-sm">
      <Image src="/logo-noe-work-bank.jpeg" alt="NOE Work Bank" width={96} height={96} className="mx-auto h-24 w-24 rounded-full" />
      <h1 className="mt-6 text-2xl font-semibold text-noe-navy">
        {suspended ? "Compte non validé" : "Inscription en attente de validation"}
      </h1>
      <p className="mt-3 text-sm text-noe-muted">
        Bonjour {account.firstName || "et bienvenue"}.{" "}
        {suspended
          ? "Votre inscription n’a pas été validée ou votre compte est suspendu. Contactez l’administration NOEWork Bank."
          : "Votre compte a bien été créé. Un administrateur doit valider votre inscription et vous attribuer un rôle. Vous accéderez ensuite automatiquement à votre espace de travail."}
      </p>
      {!suspended && (
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-noe-gold-soft px-4 py-2 text-sm font-medium text-noe-navy">
          <span className="h-2 w-2 animate-pulse rounded-full bg-noe-gold" /> 
          En attente que l’administrateur valide votre inscription, nous vous prions de patienter ici. Une fois validé, vous pourrez accéder à votre espace de travail juste en actualisant cette page.
        </div>
      )}
      <div className="mt-8 flex justify-center gap-3 text-sm">
        <a href="/onboarding" className="rounded-full bg-noe-navy px-4 py-2 font-medium text-white">Actualiser</a>
        <SignOutButton redirectUrl="/">
          <button className="rounded-full border border-noe-line px-4 py-2 text-noe-navy">Se déconnecter</button>
        </SignOutButton>
      </div>
    </div>
  );
}

function DbUnavailable() {
  return (
    <div className="w-full max-w-lg rounded-3xl border border-noe-line bg-white p-8 text-center shadow-sm">
      <Image src="/logo-noe-work-bank.jpeg" alt="NOE Work Bank" width={96} height={96} className="mx-auto h-24 w-24 rounded-full" />
      <h1 className="mt-6 text-2xl font-semibold text-noe-navy">Inscription en attente de validation</h1>
      <p className="mt-3 text-sm text-noe-muted">
        Votre compte est créé. Configuration base de données requise : la plateforme ne peut pas encore
        enregistrer votre profil. Réessayez plus tard ou contactez l’administration NOEWork Bank.
      </p>
      <div className="mt-8 flex justify-center gap-3 text-sm">
        <a href="/onboarding" className="rounded-full bg-noe-navy px-4 py-2 font-medium text-white">Actualiser</a>
        <SignOutButton redirectUrl="/">
          <button className="rounded-full border border-noe-line px-4 py-2 text-noe-navy">Se déconnecter</button>
        </SignOutButton>
      </div>
    </div>
  );
}
