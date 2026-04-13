import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Local SQLite for CLI schema operations (db push, migrate)
    // Runtime app code uses PrismaLibSql adapter to connect to Turso directly
    url: "file:./dev.db",
  },
});
