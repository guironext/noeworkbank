import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations: URL directe Neon (sans -pooler). Fallback sur DATABASE_URL.
const migrateUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrateUrl,
  },
});
