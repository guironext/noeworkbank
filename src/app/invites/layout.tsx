import { Suspense } from "react";
import { RoleShell, ShellFallback } from "@/components/RoleShell";
import { requireActiveAccount } from "@/lib/profile";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <Guarded>{children}</Guarded>
    </Suspense>
  );
}

async function Guarded({ children }: { children: React.ReactNode }) {
  const account = await requireActiveAccount();
  const name = `${account.firstName} ${account.lastName}`.trim() || account.email || "Utilisateur";
  return (
    <RoleShell role={account.role!} userName={name}>
      {children}
    </RoleShell>
  );
}
