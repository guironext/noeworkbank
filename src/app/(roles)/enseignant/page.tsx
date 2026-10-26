import { RoleDashboard } from "@/components/RoleShell";
import { ROLE_CARDS, ROLE_LABELS } from "@/lib/roles";

export default function Page() {
  return (
    <RoleDashboard
      title={`Espace ${ROLE_LABELS.ENSEIGNANT}`}
      intro="Gère tes sessions, les présences et tes contenus."
      cards={ROLE_CARDS.ENSEIGNANT}
    />
  );
}
