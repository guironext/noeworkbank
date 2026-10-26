"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ensureRoles, mirrorToClerk, requireRole } from "@/lib/profile";
import { isRoleCode } from "@/lib/roles";

export async function validateRegistration(formData: FormData) {
  const admin = await requireRole("ADMIN");
  const profileId = String(formData.get("profileId") ?? "");
  const roleCode = String(formData.get("role") ?? "");
  if (!profileId || !isRoleCode(roleCode)) throw new Error("Rôle invalide");

  await ensureRoles();
  const role = await prisma.role.findUniqueOrThrow({ where: { code: roleCode } });
  const profile = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Un rôle principal : on désactive les autres
    await tx.userRole.updateMany({ where: { userId: profileId }, data: { isActive: false } });
    const existing = await tx.userRole.findFirst({ where: { userId: profileId, roleId: role.id, cityId: null } });
    if (existing) {
      await tx.userRole.update({ where: { id: existing.id }, data: { isActive: true } });
    } else {
      await tx.userRole.create({ data: { userId: profileId, roleId: role.id } });
    }
    await tx.auditLog.create({
      data: { actorId: admin.profileId, action: "REGISTRATION_VALIDATED", entityType: "Profile", entityId: profileId, meta: { role: roleCode } },
    });
    return tx.profile.update({ where: { id: profileId }, data: { accountStatus: "ACTIVE" } });
  });
  await mirrorToClerk(profile.clerkUserId, "ACTIVE", roleCode);
  revalidatePath("/admin", "layout");
}

export async function suspendAccount(formData: FormData) {
  const admin = await requireRole("ADMIN");
  const profileId = String(formData.get("profileId") ?? "");
  if (!profileId || profileId === admin.profileId) throw new Error("Action impossible");
  const profile = await prisma.profile.update({ where: { id: profileId }, data: { accountStatus: "SUSPENDED" } });
  await prisma.auditLog.create({
    data: { actorId: admin.profileId, action: "ACCOUNT_SUSPENDED", entityType: "Profile", entityId: profileId },
  });
  await mirrorToClerk(profile.clerkUserId, "SUSPENDED", null);
  revalidatePath("/admin", "layout");
}
