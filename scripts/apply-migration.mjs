#!/usr/bin/env node
/**
 * Apply a raw SQL migration file to DATABASE_URL_UNPOOLED.
 *
 * Usage: node scripts/apply-migration.mjs <path-to-sql>
 *
 * This is a minimal, literal SQL runner — NOT drizzle-kit push. It
 * executes exactly the statements in the provided file, nothing else.
 * Use it when you want psql-style behavior but don't have psql locally.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

const envFile = process.env.ENV_FILE ?? ".env.production";
config({ path: envFile });

const DB_URL = process.env.DATABASE_URL_UNPOOLED;
if (!DB_URL) {
  console.error(`DATABASE_URL_UNPOOLED not found in ${envFile}`);
  process.exit(1);
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/apply-migration.mjs <path-to-sql>");
  process.exit(1);
}

const abs = resolve(process.cwd(), file);
const sql = await readFile(abs, "utf8");

// Split on semicolons but not inside quoted strings / dollar-quoted blocks.
// For our migrations (plain ALTER TABLE / CREATE INDEX) a naive split is fine.
const statements = sql
  .split(/;\s*$/m)
  .map((s) => s.replace(/--[^\n]*/g, "").trim())
  .filter((s) => s.length > 0);

const conn = neon(DB_URL);

console.log(`→ ${file} (${statements.length} statement${statements.length === 1 ? "" : "s"})`);
for (const stmt of statements) {
  const preview = stmt.slice(0, 100).replace(/\s+/g, " ");
  console.log(`  executing: ${preview}${stmt.length > 100 ? "…" : ""}`);
  await conn.query(stmt);
}
console.log("✓ migration applied");
