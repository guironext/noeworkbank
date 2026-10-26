import { RoleDashboard } from "@/components/RoleShell";
import { ROLE_CARDS, ROLE_LABELS } from "@/lib/roles";

export default function Page() {
  return (
    <RoleDashboard
      title={`Espace ${ROLE_LABELS.MANAGER}`}
      intro="Vue réseau : villes, sessions et ambassadeurs."
      cards={ROLE_CARDS.MANAGER}
    />
  );
}
