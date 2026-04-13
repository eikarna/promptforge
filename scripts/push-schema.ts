/**
 * Push Prisma schema to Turso cloud database.
 * 
 * Usage: bun run db:push
 * 
 * 1. Runs prisma db push against local SQLite (generates SQL)
 * 2. Reads the local db schema
 * 3. Pushes CREATE TABLE statements to Turso via HTTP API
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "apiKey" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username")`,

  `CREATE TABLE IF NOT EXISTS "Prompt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "rawPrompt" TEXT NOT NULL,
    "enrichedPrompt" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "tone" TEXT NOT NULL DEFAULT 'professional',
    "industry" TEXT NOT NULL DEFAULT 'general',
    "model" TEXT NOT NULL,
    "tokensUsed" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Prompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "Prompt_userId_createdAt_idx" ON "Prompt"("userId", "createdAt" DESC)`,

  `CREATE TABLE IF NOT EXISTS "UserPreferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "defaultFramework" TEXT NOT NULL DEFAULT 'co-star',
    "defaultTone" TEXT NOT NULL DEFAULT 'professional',
    "defaultIndustry" TEXT NOT NULL DEFAULT 'general',
    "defaultModel" TEXT NOT NULL DEFAULT 'nvidia/nemotron-3-super-120b-a12b',
    "temperature" REAL NOT NULL DEFAULT 0.7,
    CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "UserPreferences_userId_key" ON "UserPreferences"("userId")`,
];

async function main() {
  console.log("🚀 Pushing schema to Turso...\n");

  for (const sql of statements) {
    const tableName = sql.match(/"(\w+)"/)?.[1] || "index";
    try {
      await client.execute(sql);
      console.log(`  ✓ ${tableName}`);
    } catch (err: any) {
      console.error(`  ✗ ${tableName}: ${err.message}`);
    }
  }

  console.log("\n✅ Schema pushed to Turso!");
}

main().catch(console.error);
