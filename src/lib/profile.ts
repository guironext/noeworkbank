import "server-only";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect, unstable_rethrow } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ROLE_CODES, ROLE_HOME, ROLE_LABELS, isRoleCode, type RoleCode } from "@/lib/roles";

export async function ensureRoles() {
  for (const code of ROLE_CODES) {
    await prisma.role.upsert({
      where: { code },
      update: { label: ROLE_LABELS[code] },
      create: { code, label: ROLE_LABELS[code] },
    });
  }
}

/** Met à jour publicMetadata Clerk (miroir ; la DB reste la source de vérité). */
export async function mirrorToClerk(clerkUserId: string, accountStatus: string, role: RoleCode | null) {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { accountStatus, role },
    });
  } catch (e) {
    console.warn("[clerk] mirror metadata échoué", e);
  }
}

type SyncInput = {
  clerkUserId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

/** Upsert idempotent du Profile (PENDING par défaut) + bootstrap admin. */
export async function upsertProfile(input: SyncInput) {
  const profile = await prisma.profile.upsert({
    where: { clerkUserId: input.clerkUserId },
    update: {
      ...(input.firstName ? { firstName: input.firstName } : {}),
      ...(input.lastName ? { lastName: input.lastName } : {}),
      ...(input.email ? { email: input.email } : {}),
    },
    create: {
      clerkUserId: input.clerkUserId,
      firstName: input.firstName ?? "",
      lastName: input.lastName ?? "",
      email: input.email ?? null,
      accountStatus: "PENDING",
    },
  });

  const bootstrap = (process.env.BOOTSTRAP_ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (input.email && bootstrap.includes(input.email.toLowerCase())) {
    await ensureRoles();
    const admin = await prisma.role.findUniqueOrThrow({ where: { code: "ADMIN" } });
    const has = await prisma.userRole.findFirst({
      where: { userId: profile.id, roleId: admin.id, isActive: true },
    });
    if (!has || profile.accountStatus !== "ACTIVE") {
      if (!has) await prisma.userRole.create({ data: { userId: profile.id, roleId: admin.id } });
      await prisma.profile.update({ where: { id: profile.id }, data: { accountStatus: "ACTIVE" } });
      await mirrorToClerk(input.clerkUserId, "ACTIVE", "ADMIN");
    }
  }
  return profile;
}

export type CurrentAccount = {
  profileId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  role: RoleCode | null;
};

/** Récupère (et synchronise au premier passage) le compte de l'utilisateur connecté. */
export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  const { userId } = await auth();
  if (!userId) return null;

  let profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
    include: { roles: { where: { isActive: true }, include: { role: true } } },
  });

  if (!profile) {
    const user = await currentUser();
    await upsertProfile({
      clerkUserId: userId,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0]?.emailAddress,
    });
    profile = await prisma.profile.findUniqueOrThrow({
      where: { clerkUserId: userId },
      include: { roles: { where: { isActive: true }, include: { role: true } } },
    });
  }

  const codes = profile.roles.map((r: (typeof profile.roles)[number]) => r.role.code).filter(isRoleCode);
  const role = ROLE_CODES.find((c) => codes.includes(c)) ?? null;

  return {
    profileId: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    status: profile.accountStatus,
    role,
  };
}

export function homeFor(account: CurrentAccount | null): string {
  if (!account) return "/sign-in";
  if (account.status !== "ACTIVE" || !account.role) return "/onboarding";
  return ROLE_HOME[account.role];
}

/** Garde serveur : exige un compte ACTIF avec le rôle demandé. */
export async function requireRole(role: RoleCode): Promise<CurrentAccount> {
  const { account, dbError } = await safeGetCurrentAccount();
  // Base indisponible : accès refusé, /onboarding affiche le message.
  if (dbError) redirect("/onboarding");
  if (!account) redirect("/sign-in");
  if (account.status !== "ACTIVE" || !account.role) redirect("/onboarding");
  if (account.role !== role) redirect(ROLE_HOME[account.role]);
  return account;
}

/** Variante qui ne lève pas si la base est indisponible (DATABASE_URL non configurée…). */
export async function safeGetCurrentAccount(): Promise<
  { account: CurrentAccount | null; dbError: false } | { account: null; dbError: true }
> {
  try {
    return { account: await getCurrentAccount(), dbError: false };
  } catch (e) {
    unstable_rethrow(e); // laisser passer redirect / rendu dynamique Next
    console.error("[profile] base de données indisponible", e);
    return { account: null, dbError: true };
  }
}
