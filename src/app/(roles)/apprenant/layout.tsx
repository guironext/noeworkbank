import { Suspense } from "react";
import { RoleShell, ShellFallback } from "@/components/RoleShell";
import { requireRole } from "@/lib/profile";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <Guarded>{children}</Guarded>
    </Suspense>
  );
}

async function Guarded({ children }: { children: React.ReactNode }) {
  const account = await requireRole("APPRENANT");
  const name = `${account.firstName} ${account.lastName}`.trim() || account.email || "Utilisateur";
  return (
    <RoleShell role="APPRENANT" userName={name}>
      {children}
    </RoleShell>
  );
}
