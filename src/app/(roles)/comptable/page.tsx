import { RoleDashboard } from "@/components/RoleShell";
import { ROLE_CARDS, ROLE_LABELS } from "@/lib/roles";

export default function Page() {
  return (
    <RoleDashboard
      title={`Espace ${ROLE_LABELS.COMPTABLE}`}
      intro="Suivi des paiements, dépenses et commissions."
      cards={ROLE_CARDS.COMPTABLE}
    />
  );
}
