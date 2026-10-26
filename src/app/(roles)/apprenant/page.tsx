import { RoleDashboard } from "@/components/RoleShell";
import { ROLE_CARDS, ROLE_LABELS } from "@/lib/roles";

export default function Page() {
  return (
    <RoleDashboard
      title={`Espace ${ROLE_LABELS.APPRENANT}`}
      intro="Retrouve tes formations, sessions et ta progression."
      cards={ROLE_CARDS.APPRENANT}
    />
  );
}
