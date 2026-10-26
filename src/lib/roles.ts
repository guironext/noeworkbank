export const ROLE_CODES = [
  "ADMIN",
  "APPRENANT",
  "ENSEIGNANT",
  "COMPTABLE",
  "MANAGER",
] as const;

export type RoleCode = (typeof ROLE_CODES)[number];

export const ROLE_LABELS: Record<RoleCode, string> = {
  ADMIN: "Administrateur",
  APPRENANT: "Apprenant",
  ENSEIGNANT: "Enseignant",
  COMPTABLE: "Comptable",
  MANAGER: "Manager",
};

export const ROLE_HOME: Record<RoleCode, string> = {
  ADMIN: "/admin",
  APPRENANT: "/apprenant",
  ENSEIGNANT: "/enseignant",
  COMPTABLE: "/comptable",
  MANAGER: "/manager",
};

export type NavItem = { label: string; href: string };

export const ROLE_NAV: Record<RoleCode, NavItem[]> = {
  ADMIN: [
    { label: "Tableau de bord", href: "/admin" },
    { label: "Inscriptions", href: "/admin/registrations" },
    { label: "Utilisateurs", href: "/admin/users" },
    { label: "Programmes", href: "/admin/programs" },
    { label: "Paiements", href: "/admin/payments" },
    { label: "Paramètres", href: "/admin/settings" },
  ],
  APPRENANT: [
    { label: "Tableau de bord", href: "/apprenant" },
    { label: "Mes formations", href: "/apprenant/courses" },
    { label: "Sessions", href: "/apprenant/sessions" },
    { label: "Progression", href: "/apprenant/progress" },
    { label: "Paiements", href: "/apprenant/payments" },
  ],
  ENSEIGNANT: [
    { label: "Tableau de bord", href: "/enseignant" },
    { label: "Mes sessions", href: "/enseignant/sessions" },
    { label: "Présences", href: "/enseignant/attendance" },
    { label: "Contenu", href: "/enseignant/content" },
  ],
  COMPTABLE: [
    { label: "Tableau de bord", href: "/comptable" },
    { label: "Paiements", href: "/comptable/payments" },
    { label: "Dépenses", href: "/comptable/expenses" },
    { label: "Commissions", href: "/comptable/commissions" },
    { label: "Rapports", href: "/comptable/reports" },
  ],
  MANAGER: [
    { label: "Tableau de bord", href: "/manager" },
    { label: "Villes / sessions", href: "/manager/cities" },
    { label: "Ambassadeurs", href: "/manager/ambassadors" },
    { label: "Suivi", href: "/manager/tracking" },
    { label: "Rapports", href: "/manager/reports" },
  ],
};

export const ROLE_CARDS: Record<RoleCode, { title: string; value: string; hint: string }[]> = {
  ADMIN: [
    { title: "Inscriptions en attente", value: "—", hint: "À valider dans Inscriptions" },
    { title: "Utilisateurs actifs", value: "—", hint: "Tous rôles confondus" },
    { title: "Paiements du mois", value: "—", hint: "Module paiements à venir" },
  ],
  APPRENANT: [
    { title: "Formations suivies", value: "0", hint: "Inscris-toi à un programme" },
    { title: "Prochaine session", value: "—", hint: "Aucune session planifiée" },
    { title: "Progression", value: "0 %", hint: "Leçons complétées" },
  ],
  ENSEIGNANT: [
    { title: "Sessions à venir", value: "0", hint: "Planning à venir" },
    { title: "Présences à saisir", value: "0", hint: "Module présences" },
    { title: "Contenus publiés", value: "0", hint: "Ressources pédagogiques" },
  ],
  COMPTABLE: [
    { title: "Paiements confirmés", value: "—", hint: "CinetPay (à venir)" },
    { title: "Dépenses du mois", value: "—", hint: "Module dépenses" },
    { title: "Commissions à payer", value: "—", hint: "Ambassadeurs" },
  ],
  MANAGER: [
    { title: "Villes actives", value: "—", hint: "Réseau NOE" },
    { title: "Sessions ouvertes", value: "—", hint: "Toutes villes" },
    { title: "Ambassadeurs", value: "—", hint: "Suivi des parrainages" },
  ],
};

export function isRoleCode(v: string | null | undefined): v is RoleCode {
  return !!v && (ROLE_CODES as readonly string[]).includes(v);
}
