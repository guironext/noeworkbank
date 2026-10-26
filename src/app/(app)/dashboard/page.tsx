import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { homeFor, safeGetCurrentAccount } from "@/lib/profile";

// /dashboard = aiguillage vers l'espace du rôle
export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="p-12 text-zinc-600">Chargement…</p>}>
      <Dispatch />
    </Suspense>
  );
}

async function Dispatch() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const { account, dbError } = await safeGetCurrentAccount();
  // Base indisponible ou compte non validé → /onboarding
  redirect(dbError ? "/onboarding" : homeFor(account));
  return null;
}
