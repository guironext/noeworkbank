"use server";

import { getCurrentAccount } from "@/lib/profile";

/** Crée le Profile PENDING juste après l'inscription (idempotent). */
export async function syncProfileAfterSignUp() {
  await getCurrentAccount();
}
