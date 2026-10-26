// Seed des rôles NOEWork Bank + promotion optionnelle d'un admin existant.
// Usage : npm run db:seed   (BOOTSTRAP_ADMIN_EMAIL=... pour promouvoir un profil déjà créé)
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) });

const ROLES = {
  ADMIN: "Administrateur",
  APPRENANT: "Apprenant",
  ENSEIGNANT: "Enseignant",
  COMPTABLE: "Comptable",
  MANAGER: "Manager",
};

for (const [code, label] of Object.entries(ROLES)) {
  await prisma.role.upsert({ where: { code }, update: { label }, create: { code, label } });
}
console.log("Rôles OK :", Object.keys(ROLES).join(", "));

const emails = (process.env.BOOTSTRAP_ADMIN_EMAIL ?? "").split(",").map((e) => e.trim()).filter(Boolean);
const admin = await prisma.role.findUnique({ where: { code: "ADMIN" } });
for (const email of emails) {
  const p = await prisma.profile.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });
  if (!p) { console.log(`Profil ${email} introuvable (il sera promu à sa 1re connexion).`); continue; }
  const has = await prisma.userRole.findFirst({ where: { userId: p.id, roleId: admin.id } });
  if (!has) await prisma.userRole.create({ data: { userId: p.id, roleId: admin.id } });
  await prisma.profile.update({ where: { id: p.id }, data: { accountStatus: "ACTIVE" } });
  console.log(`Admin promu : ${email}`);
}
await prisma.$disconnect();
